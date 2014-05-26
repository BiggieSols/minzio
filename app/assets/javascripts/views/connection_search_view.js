TeamProfile.Views.ConnectionSearchView = Backbone.View.extend({
  tagName: "span",

  template: JST['misc/connection_search'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "click      .reload-contacts"                             :"_reloadContacts",
    "click      .default-message-dropdown"                    :"_toggleMessageText",
    "focus      .select2-input"                               :"_removePopover",
    "mouseover  .glyphicon-question-sign, .glyphicon-refresh" :"_showToolTip",
  },

  initialize: function() {
    this.placeholder = "Add a group member...";
    this.width = "270px";

    // used to prevent additional sliding down of linkedin info
    this.usersAdded = false;
  },

  remove: function() {
    if(this.popoverTimeout) clearTimeout(this.popoverTimeout);
    return Backbone.View.prototype.remove.call(this);
  },

  render: function() {
    var renderedContent = this.template({
      users: TeamProfile.currentUser.get("connections"),
      group: this.model
    });
    this.$el.html(renderedContent);
    this._renderSelect2()._renderAddMemberPopover();
    console.log("rendering connection search view");
    return this;
  },

  _chosenItemFormat: function(state) {
    return "<span data-id='" + state.id +"'/>" + state.text + "</span>";
  },

  _clearForm: function() {
    this.render();
    this.$('.select2-input').focus();
  },

  _dropdownFormat: function(state) {
    return "<div class='row'><div class='col-xs-4'><img class='lazy friend-dropdown' src='" + state.url + "' class='dropdown-img'/></div><div class='col-xs-8 user-name-dropdown'>" + state.text  + "</div></div>";
  },

  _formAction: function(params) {
    params.group_id         = $('.group-container').data("id");
    params.message_subject  = this.$('.linkedin-msg-subject').val();
    params.message_text     = this.$('.linkedin-msg-text').val();
    var groupMembership     = new TeamProfile.Models.GroupMember(params);
    this.usersAdded         = true;
    var that                = this;
    console.log(params);

    // that.$(".linkedin-msg-container").slideUp("fast");

    groupMembership.save({}, {
      success: function() {
        console.log("group membership saved!");
        that._showPostInviteModal();

        // change the default message text
        that.$(".linkedin-msg-text").html(params.message_text);

        var num_sent_invitations = TeamProfile.currentUser.get("num_sent_invitations");
        TeamProfile.currentUser.set("num_sent_invitations", num_sent_invitations + 1);
        that.model.fetch();
      }
    });
    this._clearForm();
  },

  _generateSelect2Data: function() {
    var data = [];
    TeamProfile.currentUser.get("connections").models.forEach(function(user) {
      data.push({
        id: user.id,
        text: user.escape("name"),
        url: user.escape("image_url")
      });
    });
    return {results: data};
  },

  _identifyFieldChanges: function() {
    var that = this;
    this.$('.connection-selector').on("change", function(event) {
      params = {};
      params.user_id = that.$('.select2-search-choice div span').data("id");
      that._formAction(params);
    });
  },

  _reloadContacts: function() {
    var spinner = this.spinnerTemplate();
    this.$('.reload-contacts').html(spinner);
    var that = this;
    TeamProfile.currentUser.save({build_shadow: true}, {
      success: function() {
        that.render();
      }
    });
  },

  _removePopover: function(event) {
    this.$('.select2-search-field').popover("hide");
    this._showLinkedinMsg();
  },

  _showLinkedinMsg: function() {
    if (this.$('.linkedin-msg-container').css("display") === "none" && this.usersAdded === false) {
      console.log("showing the message");
      this.$(".linkedin-msg-container").slideDown();
    }
  },

  _renderAddMemberPopover: function() {
    var that = this;
    this.popoverTimeout = setTimeout(function() {
      if(that.model.get("members").length == 1) {
        var title = "Add a group member";
        var content = "Invite your LinkedIn connections to the group! <br/><div class='linkedin-warning'>Note: this will send a message via LinkedIn on your behalf</div>";
        var $container = that.$('.select2-search-field');

        console.log("container is below");
        console.log($container);

        if($container[0].clientWidth > 0) {
          $container.data("container", "body")
                    .data("toggle", "popover")
                    .data("placement", "bottom")
                    .data("content", content)
                    .data("title", title)
                    .data("html", true)
                    .data("trigger", "manual")
                    .popover('show');
        }
      }
    }, 500);
    return this;
  },

  _renderSelect2: function() {
    this.$('.connection-selector').select2({
      data: this._generateSelect2Data(),
      minimumInputLength: 3,
      placeholder: this.placeholder,
      width: this.width,
      formatResult: this._dropdownFormat,
      formatSelection: this._chosenItemFormat,
      multiple: true
    });

    this.$('.select2-choice').css("padding", "0px 10px");
    this._identifyFieldChanges();
    return this;
  },

  _showPostInviteModal: function() {
    if(TeamProfile.currentUser.get("num_sent_invitations") === 0) {
      $('#first-invite-confirm').modal("show");
    }
  },

  _showToolTip: function(event) {
    $(event.currentTarget).tooltip('show');
  },

  _toggleMessageText: function(event) {
    console.log("got here");
    $(".linkedin-msg-container").slideToggle();
  }
});