TeamProfile.Views.AddViaLinkedInView = Backbone.View.extend({
  tagName: "span",

  template: JST['groups/add_group_member_linkedin'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "click      .reload-contacts"                             :"_reloadContacts",
    "click      .default-message-dropdown"                    :"_toggleMessageText",
    "focus      .select2-input"                               :"_removePopover",
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
    this._renderConnectionSearchField();
    return this;
  },

  _linkedinMsgClose: function() {
    this.$(".linkedin-msg-container").slideUp();
    this._toggleExpandGlyph();
  },

  _linkedinMsgOpen: function() {
    this.$(".linkedin-msg-container").slideDown();
    this._toggleExpandGlyph();
  },

  _reloadContacts: function() {
    this._renderSpinner();
    var that = this;
    TeamProfile.currentUser.save({build_shadow: true, async: false}, {
      success: function() {
        that.render();
      }
    });
  },

  _removePopover: function(event) {
    this.$('.select2-search-field').popover("hide");
    this._showLinkedinMsg();
  },

  _renderConnectionSearchField: function() {
    this.connectionSearchView = new TeamProfile.Views.ConnectionSearchView({model: this.model});
    this.$('.connection-search-container').html(this.connectionSearchView.render().$el);
    return this;
  },

  _renderAddMemberPopover: function() {
    var that = this;
    this.popoverTimeout = setTimeout(function() {
      if(TeamProfile.currentUser.get("num_sent_invitations") === 0) {

        that._linkedinMsgOpen();

        var title = "Add a group member";
        var content = "Invite your LinkedIn connections to the group! <br/><div class='linkedin-warning'>IMPORTANT: This will send a message via LinkedIn on your behalf. You can customize your message below</div>";
        var $container = that.$('.select2-search-field');

        if($container[0].clientWidth > 0) {
          $container.data("container", "body")
                    .data("toggle", "popover")
                    .data("placement", "top")
                    .data("content", content)
                    .data("title", title)
                    .data("html", true)
                    .data("trigger", "manual")
                    .popover('show');
        }
      }
    }, 1000);
    return this;
  },

  _renderSpinner: function() {
    var spinner = this.spinnerTemplate();
    this.$('.reload-contacts').html(spinner);
    return this;
  },

  _showLinkedinMsg: function() {
    if (this.$('.linkedin-msg-container').css("display") === "none" && this.usersAdded === false) {
      this.$(".connection-container").addClass("linkedin-info-open");
      this._linkedinMsgOpen();
    }
  },

  _toggleMessageText: function(event) {
    $(".linkedin-msg-container").slideToggle();
    this._toggleExpandGlyph();
  },

  _toggleExpandGlyph: function() {
    this.$('.glyphicon-expand').toggleClass("invisible");
    this.$('.glyphicon-collapse-down').toggleClass("invisible");
  },
});