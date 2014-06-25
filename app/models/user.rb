class User < ActiveRecord::Base
  # serialize :description, JSON
  serialize :connections, JSON

  attr_accessible :name, :uid, :provider, :email, :description, :headline, :image_url, :location, :industry, :pub_profile, :access_token, :access_token_secret, :session_token, :password_digest, :password, :password_confirmation, :personality_type_id, :connections, :referral_hash

  before_validation :set_password_digest, on: :create
  before_validation :set_referral_hash, on: :create
  
  validate :password_matches_confirmation

  has_many :user_answers
  has_many :answers, through: :user_answers

  has_many :sent_invitations,     foreign_key: :from_user_id, class_name: "Invitation"
  has_many :received_invitations, foreign_key: :to_user_id,   class_name: "Invitation"

  has_many :invited_users,  through: :sent_invitations, source: :receiving_user
  has_many :inviting_users, through: :received_invitations, source: :sending_user

  has_many :group_memberships, class_name: "GroupMember"
  has_many :groups, through: :group_memberships

  has_many :authored_tips, foreign_key: :author_user_id, class_name: "Tip"

  # this is the GENERAL personality type (INTJ, ENFP, etc.)
  belongs_to :personality_type

  # this is the customized personality type that can be modified for a specific user
  has_one    :custom_personality

  attr_accessor :password, :password_confirmation

  def self.from_omniauth(auth_hash)
    user        = User.where(uid: auth_hash["uid"]).first_or_initialize

    # IMPORTANT: make this !user.account_active when done testing!!!!!
    new_account = !user.account_active

    user.account_active       = true
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

    user.custom_personality   ||= CustomPersonality.new

    user.save!
    UserMailer.delay.welcome_email(user) if new_account
    
    user.get_large_image_url

    user
  end

  def self.find_by_credentials(params={email: nil, password: nil})
    user = User.find_by_email(params[:email]);
    return user if user && user.is_password?(params[:password])
    nil
  end

  def editable_tip_ids
    (self.authored_tip_ids + self.custom_personality.tip_ids).uniq
  end

  def get_large_image_url
    self.large_image_url = self.linkedin.picture_urls.all.first
    self.save
  end
  handle_asynchronously :get_large_image_url

  def num_sent_invitations
    self.sent_invitations.length
  end


  def valid_connection_ids
    return @valid_ids if @valid_ids
    return [] if !self.connections

    @valid_ids = [self.id]
    # load all connection IDs

    @valid_ids = self.connections.map {|c| c["id"]}

    # load all connections in groups
    @valid_ids += self.groups.includes(:members).map(&:member_ids)
    @valid_ids += self.invited_user_ids

    # puts "\n"*10
    # puts "got here"
    # puts "\n"*10
    @valid_ids = @valid_ids.flatten.uniq
  end

  def build_shadow_accounts
    # reset connections since they will be rebuilt
    self.connections        = []    
    start = 0
    batch_size = 500

    loop do
      linkedin_connects = self.linkedin.connections(start: start, count: batch_size)["all"]
      break if linkedin_connects.nil?
      build_batch(linkedin_connects)
      start += batch_size
    end

    self.connections = self.connections.uniq
    self.save
    self.ensure_profile_available
  end

  def ensure_profile_available
    ActiveRecord::Base.transaction do
      connected_users = User.where(id: self.valid_connection_ids, account_active: true)
      connection_info = self.connections.find { |c| c["name"] == self.name }
      connected_users.each do |user|
        if !user.connections.include?(connection_info)
          user.connections << connection_info
          user.save
        end
      end
    end
  end
  handle_asynchronously :ensure_profile_available

  def build_batch(linkedin_connects)
    linkedin_connects_uids  = linkedin_connects.map {|c| c["id"]}

    # "Existing" means users who are already in the database and match the current user's connections' uids
    existing_users_assn     = User.where(uid: linkedin_connects_uids)
    existing_users_hash     = {}
    existing_users_assn.each {|u| existing_users_hash[u.uid] = u}


    ActiveRecord::Base.transaction do 
      linkedin_connects.each do |connection|
        uid                 = connection["id"]
        user                = existing_users_hash[uid]
        valid_user          = true
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
          valid_user        = user.uid && user.name && user.name != "private private"

          user.custom_personality = CustomPersonality.new
          user.save if valid_user
        end
        self.connections << {name: user.name, image_url: user.image_url, id: user.id} if valid_user
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

  def send_completion_notification
    users_to_contact      = self.inviting_users.includes(:groups)

    valid_connection_ids  = self.connections.map {|c| c["id"]}

    connected_users       = User.includes(:groups).where(account_active: true, id: valid_connection_ids)

    users_to_contact      += connected_users

    # just send Sol an email every time someone completes the assessment
    users_to_contact << User.find_by_name("Sol Garger")

    users_to_contact      = users_to_contact.uniq

    shared_groups         = Hash.new { |h, k| h[k] = [] }

    users_to_contact.each do |u|
      shared_groups[u.id] = u.groups & self.groups
    end

    # p shared_groups

    # puts users_to_contact.map(&:id)

    puts "\n"*10
    users_to_contact.each do |u|
      next if u == self
      puts "shared groups for user id #{u.id} is: #{shared_groups[u.id].inspect}"
      # puts "\n"
      msg = UserMailer.invitee_profile_completion(
              inviting_user: u, 
              invited_user: self, 
              shared_groups: shared_groups[u.id]
            )
      msg.deliver
    end
    puts "\n"*10
  end
  handle_asynchronously :send_completion_notification

  def set_personality_type
    first_test_attempt = self.personality_type_id.nil?

    results_str = ""
    self.mbti_test_result.each do |result|
      # p "result is #{result.last.class}"
      results_str += result.last > 0 ? result[0][0] : result[0][1]
    end

    personality_type = PersonalityType.find_by_title(results_str.upcase)
    self.personality_type_id = personality_type.id

    self.custom_personality ||= CustomPersonality.new

    self.custom_personality.add_defaults(personality_type)

    self.send_completion_notification if first_test_attempt
    self.save
  end


  def mbti_test_result
    return @results_arr if @results_arr

    results_hash = Hash.new {|h, k| h[k] = 0}

    self.answers.each do |answer|
      answer_result     = answer.result_calc
      key               = answer_result.keys.first
      results_hash[key] += answer_result[key]
    end

    results_ordering = {"ei"=>0, "sn"=>1, "tf"=>2, "jp"=>3}

    @results_arr = results_hash.to_a.sort do |a, b|
      results_ordering[a.first] <=>  results_ordering[b.first]
    end
    @results_arr
  end 

  def set_session_token
    self.session_token = SecureRandom.urlsafe_base64(16);
  end

  def set_referral_hash
    self.referral_hash = SecureRandom.urlsafe_base64(8);
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