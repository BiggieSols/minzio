
class Invitation < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :from_user_id, :to_user_id, :group_id, :message, :subject, :message_sent

  belongs_to :sending_user,   foreign_key: :from_user_id, class_name: "User"
  belongs_to :receiving_user, foreign_key: :to_user_id,   class_name: "User"
  belongs_to :group, foreign_key: :to_user_id,   class_name: "Group"

  # ON HOLD - NOT SURE IF THIS WILL WORK
  # will check if 10 messages remain to be sent. if yes, it will send them. otherwise put the message on a 2 minute delay
  # (checks the message_sent flag)
  # def add_to_queue
  #   queued_messages = Invitation.includes(:receiving_user).where(from_user_id: i.from_user_id, message_sent: false)
  #   if queued_messages.length == 3
  #     Invitation.bulk_send(queued_messages)
  #   else
  #     puts "\n"*5
  #     puts "doing async stuff"
  #     puts "\n"*5
  #   end
  # end
  # handle_asynchronously :add_to_queue

  # ON HOLD - NOT SURE IF THIS WILL WORK
  # will check if 10 messages remain to be sent. if yes, it will send them. otherwise put the message on a 2 minute delay
  # (checks the message_sent flag)
  # sends all remaining messages
  # def self.bulk_send(messages)
  #   puts "\n"*5
  #   puts "doing async stuff"
  #   puts "\n"*5

  #   sending_user          = User.find(self.from_user_id)
  #   receiving_user_uids   = messages.map {|m| m.receiving_user.uid}
  #   message_subject       = "Join me on MindSparrow"
  #   messsage_text         = messages[-1].message
  # end

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
        message_subject = "Join me on MindSparrow"
        # message_text = self.message#"I just added you to my group '#{group.name}' on MindSparrow. \nWill you take 2 minutes to create an account and join me so we can see each others' work personality profile results?\n http://www.teamprofile.com"

        # TO TEST, SEND ALL MESSAGES TO MY TEST ACCOUNT (user_id: 3)
        # dummy uid is for Sol Garger's primary linkedin account
        sending_user.linkedin.send_message(message_subject, message_text, ["3gVtJAMsun"])
        # self.update_attributes(message: message_text)
      end
    end
  end
  handle_asynchronously :handle_message

end
