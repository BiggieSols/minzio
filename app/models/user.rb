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

  def self.find_by_credentials(params={email: nil, password: nil})
    user = User.find_by_email(params[:email]);
    return user if user && user.is_password?(params[:password])
    nil
  end

  # def interpreted_mbti_test_result
  #   questions_per_category = 5 #hard-coded 5 questions
  #   results = self.mbti_test_result
  #   result_string = results.keys.map do |key|
  #     char = results[key] > 0 ? key[0] : key[1]
  #     magnitude = (results[key].to_f / questions_per_category).abs
  #     [char, magnitude]
  #   end
  # end

  def build_shadow_accounts
    connections = self.linkedin.connections["all"]

    # TEMP TO AVOID BUILDING TOO MANY ACCTS
    # connections = connections[0..1]

    all_uids        = connections.map {|c| c["id"]}
    existing_users  = User.where(uid: all_uids)
    existing_uids   = existing_users.map { |u| u.uid }

    connection_uids = connections.map {|c| c["id"]}

    self.connections ||= []

    ActiveRecord::Base.transaction do 
      connections.each do |connection|
        uid = connection["id"]

        if !connection_uids.include?(uid)
          if existing_uids.include?(uid)
            user = existing_users.find_by_uid(uid)
          else
          # user = User.where(uid: uid).first_or_initialize
            user = User.new
            user.pub_profile  = clean { connection["site_standard_profile_request"]["url"].split("&").first }
            user.name         = clean { connection["first_name"] + " " + connection["last_name"] }
            user.headline     = clean { connection["headline"] }
            user.industry     = clean { connection["industry"] }
            user.location     = clean { connection["location"] }
            user.image_url    = clean { connection["picture_url"] }
            user.uid          = clean { connection["id"] }
            user.save if (user.uid && user.name)
          end

          self.connections << {name: user.name, image_url: user.image_url, id: user.id}
        end
      end
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

  def set_personality_type
    results_str = ""
    mbti_test_result.each do |types, val|
      results_str += val > 0 ? types[0] : types[1]
    end
    puts results_str
    self.personality_type_id = PersonalityType.find_by_title(results_str.upcase).id
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