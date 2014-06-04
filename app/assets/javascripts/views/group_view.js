TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],

  events: {
    "click .cannot-find-connect-faq":"toggleFAQ",
    "click #referral-link":"_selectReferralURL",
    "mouseover  .glyphicon-question-sign, .glyphicon-refresh, .glyphicon-envelope" :"_showToolTip",
  },

  toggleFAQ: function() {
    var $instructions = this.$('.enable-account-instructions');
    $instructions.slideToggle();
  },

  render: function() {
    var referralUrl        = "http://www.minzio.com?g=" + this.model.get("referral_hash") + "&u=" + TeamProfile.currentUser.get("referral_hash");
    var referralUrlEscaped = referralUrl.replace("&", "%26");
    console.log(referralUrl);
    var renderedContent = this.template({
      group:              this.model,
      referralUrl:        referralUrl,
      referralUrlEscaped: referralUrlEscaped
    });
    this.$el.html(renderedContent);
    this._renderConnectionSearch();
    this._renderGroupMembers();

    // load social plugin for facebook
    // window.fbAsyncInit();

    return this;
  },
  
  _renderGroupMembers: function() {
    // if there is only one member in the group, prompt to add more
    var $node = this.$('.group-members');
    this.groupMembersView = new TeamProfile.Views.GroupMembersView({model: this.model});
    $node.html(this.groupMembersView.render().$el);
    return this;
  },

  _renderConnectionSearch: function() {
    this.connectionSearchView = new TeamProfile.Views.ConnectionSearchView({model: this.model});
    this.$('#add-connections').html(this.connectionSearchView.render().$el);
    return this;
  },

  _removePopovers: function() {
    $('.popover').remove();
  },

  _selectReferralURL: function(event) {
    $(event.currentTarget).select();
  },

  _showToolTip: function(event) {
    $(event.currentTarget).tooltip('show');
  },

  remove: function() {
    this._removePopovers();
    this.groupMembersView.remove();
    this.connectionSearchView.remove();
    return Backbone.View.prototype.remove.call(this);
  },
});