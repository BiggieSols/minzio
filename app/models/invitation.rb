
class Invitation < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :from_user_id, :to_user_id, :group_id, :message, :subject, :message_sent, :source

  belongs_to :sending_user,   foreign_key: :from_user_id, class_name: "User"
  belongs_to :receiving_user, foreign_key: :to_user_id,   class_name: "User"
  belongs_to :group, foreign_key: :to_user_id,   class_name: "Group"

  def handle_message
    receiving_user  = User.find(self.to_user_id)
    sending_user    = User.find(self.from_user_id)
    group           = Group.find(self.group_id)

    # self.linkedin.send_message("subject goes here", "body goes here", [self.uid, receiving_user.uid])

    if receiving_user != sending_user #don't send if user adds himself to a group
      if receiving_user.account_active
        puts "\n"*5
        puts "account already active"
        puts "sending email notification!"
        msg = UserMailer.group_invitation(from_user: sending_user, to_user: receiving_user, group: group)
        msg.deliver!
        puts "\n"*5
      else
        puts "\n"*5
        puts "sending LinkedIn message"
        puts "\n"*5

        # TO TEST, SEND ALL MESSAGES TO MY TEST ACCOUNT (user_id: 3)
        # dummy uid is for Sol Garger's primary linkedin account
        if Rails.env.production?
          to_user_uid = receiving_user.uid
        else
          to_user_uid = "3gVtJAMsun"
        end
        
        sending_user.linkedin.send_message(self.subject, self.message, [to_user_uid])
        # self.update_attributes(message: message_text)
      end
    end
  end
  handle_asynchronously :handle_message

end
