class User < ActiveRecord::Base
  # serialize :description, JSON
  serialize :connections, JSON

  attr_accessible :name, :uid, :provider, :email, :description, :headline, :image_url, :location, :industry, :pub_profile, :access_token, :access_token_secret, :session_token, :password_digest, :password, :password_confirmation, :personality_type_id, :connections

  before_validation :set_password_digest, on: :create
  
  validate :password_matches_confirmation

  has_many :user_answers
  has_many :answers, through: :user_answers

  has_many :sent_invitations,     foreign_key: :from_user_id, class_name: "Invitation"
  has_many :received_invitations, foreign_key: :to_user_id,   class_name: "Invitation"

  has_many :invited_users,  through: :sent_invitations, source: :receiving_user
  has_many :inviting_users, through: :received_invitations, source: :sending_user

  has_many :group_memberships, class_name: "GroupMember"
  has_many :groups, through: :group_memberships

  belongs_to :personality_type, foreign_key: :personality_type_id, class_name: "PersonalityType"

  attr_accessor :password, :password_confirmation

  def self.from_omniauth(auth_hash)
    user = User.where(uid: auth_hash["uid"]).first_or_initialize
    user.uid                  = auth_hash["uid"]
    user.provider             = auth_hash["provider"]
    user.access_token         = auth_hash["credentials"]["token"]
    user.access_token_secret  = auth_hash["credentials"]["secret"]
    user.name                 = auth_hash["info"]["name"]
    user.email                = auth_hash["info"]["email"]
    user.location             = auth_hash["info"]["location"]
    user.headline             = auth_hash["info"]["headline"]
    user.industry             = auth_hash["info"]["industry"]
    user.image_url            = auth_hash["info"]["image"]
    user.pub_profile          = auth_hash["info"]["urls"]["public_profile"]
    user.account_active       = true
    user.save!

    # don't think this is doing anything, but confirm later
    fiber = Fiber.new do 
      user.large_image_url = user.linkedin.picture_urls.all.first
      user.save
      puts "\n\n\nsaved new user\n\n\n"
    end
    fiber.resume

    puts "\n\n\ngot here\n\n\n"
    user
  end

  def num_sent_invitations
    self.sent_invitations.length
  end

  def self.find_by_credentials(params={email: nil, password: nil})
    user = User.find_by_email(params[:email]);
    return user if user && user.is_password?(params[:password])
    nil
  end

  def valid_connection_ids
    return @valid_ids if @valid_ids
    return [] if !self.connections

    @valid_ids = []
    # load all connection IDs

    @valid_ids = self.connections.map {|c| c["id"]}

    # load all connections in groups
    @valid_ids += self.groups.includes(:members).map(&:member_ids).flatten.uniq
  end

  def build_shadow_accounts    
    linkedin_connects       = self.linkedin.connections["all"]
    linkedin_connects_uids  = linkedin_connects.map {|c| c["id"]}

    # "Existing" means users who are already in the database and match the current user's connections' uids
    existing_users_assn     = User.where(uid: linkedin_connects_uids)
    existing_users_hash     = {}
    existing_users_assn.each {|u| existing_users_hash[u.uid] = u}

    # reset connections since they will be rebuilt
    self.connections        = []

    ActiveRecord::Base.transaction do 
      linkedin_connects.each do |connection|
        uid = connection["id"]
        user = existing_users_hash[uid]
        if !user
        # user = User.where(uid: uid).first_or_initialize
          user              = User.new
          user.pub_profile  = clean { connection["site_standard_profile_request"]["url"].split("&").first }
          user.name         = clean { connection["first_name"] + " " + connection["last_name"] }
          user.headline     = clean { connection["headline"] }
          user.industry     = clean { connection["industry"] }
          user.location     = clean { connection["location"]["name"] }
          user.image_url    = clean { connection["picture_url"] }
          user.uid          = clean { connection["id"] }
          user.save if (user.uid && user.name)
        end
        self.connections << {name: user.name, image_url: user.image_url, id: user.id}
      end
      self.connections << {name: self.name, image_url: self.image_url, id: self.id}
      self.save
    end
  end

  def clean
    begin
      yield
    rescue
      nil
    end
  end

  # temporarily sending via LinkedIn. eventually send via email
  def send_completion_notification
    self.inviting_users.uniq.each do |u|
      # message_subject = "Finished the TeamGlide assessment"
      # message_text = "I just finished the personality profile for TeamGlide. \nCheck out the results at www.teamglide.com/#/groups"
      # self.linkedin.send_message(message_subject, message_text, ["3gVtJAMsun"])
      msg = UserMailer.invitee_profile_completion(inviting_user: u, invited_user: self)
      msg.deliver
    end
  end
  handle_asynchronously :send_completion_notification

  # def set_personality_type
  #   first_test_attempt = self.personality_type_id.nil?

  #   results_str = ""
  #   mbti_test_result.each do |types, val|
  #     results_str += val > 0 ? types[0] : types[1]
  #   end
  #   puts "\n"*5
  #   puts results_str.inspect
  #   puts "\n"*5

  #   self.personality_type_id = PersonalityType.find_by_title(results_str.upcase).id

  #   self.send_completion_notification if first_test_attempt

  #   self.save
  # end


  def set_personality_type
    first_test_attempt = self.personality_type_id.nil?

    results_ordering = {"ei"=>0, "sn"=>1, "tf"=>2, "jp"=>3}

    mbti_results = self.mbti_test_result.to_a.sort do |a, b|
      results_ordering[a.first] <=>  results_ordering[b.first]
    end

    results_str = ""
    mbti_results.each do |result|
      p "result is #{result.last.class}"
      results_str += result.last > 0 ? result[0][0] : result[0][1]
    end

    puts "\n"*5
    puts results_str.inspect
    puts "\n"*5

    self.personality_type_id = PersonalityType.find_by_title(results_str.upcase).id

    self.send_completion_notification if first_test_attempt

    self.save
  end


  def mbti_test_result
    return @results if @results

    @results = Hash.new {|h, k| h[k] = 0}

    self.answers.each do |answer|
      answer_result = answer.result_calc
      key = answer_result.keys.first
      @results[key] += answer_result[key]
    end
    @results
  end 

  def set_session_token
    self.session_token = SecureRandom.urlsafe_base64(16);
  end

  def reset_session_token!
    set_session_token
    save!
  end

  def set_password_digest
    self.password_digest = BCrypt::Password.create(self.password) if self.password
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def linkedin
    @client ||= LinkedIn::Client.new(ENV["LINKEDIN_KEY"], ENV["LINKEDIN_SECRET"])
    @client.authorize_from_access(self.access_token, self.access_token_secret)
    @client
  end

  def password_matches_confirmation
    if self.password && self.password != self.password_confirmation
      errors.add(:password, "password does not match confirmation")
    end
  end
end