TeamProfile.Views.AddMemberConnectionSearchView = TeamProfile.Views.ConnectionSearchView.extend({

  initialize: function() {
    this.placeholder = "Add a group member...";
    this.width = "270px";
  },

  _formAction: function(params) {
    var that, groupMembership;
    that                    = this;
    params.group_id         = $('.group-container').data("id");
    params.message_subject  = $('.linkedin-msg-subject').val();
    params.message_text     = $('.linkedin-msg-text').val();
    this.usersAdded         = true;

    groupMembership         = new TeamProfile.Models.GroupMember(params);

    groupMembership.save({}, {
      success: function() {
        // console.log("group membership saved!");
        that._showPostInviteModal();

        // change the default message text
        that.$(".linkedin-msg-text").html(params.message_text);

        var num_sent_invitations = TeamProfile.currentUser.get("num_sent_invitations");
        TeamProfile.currentUser.set("num_sent_invitations", num_sent_invitations + 1);
        that.model.fetch();
      }
    });
    // this._renderSpinner();
    this._clearForm();
  },

  _showPostInviteModal: function() {
    if(TeamProfile.currentUser.get("num_sent_invitations") === 0) {
      $('#first-invite-confirm').modal("show");
    }
  },

});