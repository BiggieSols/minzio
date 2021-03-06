TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],

  events: {
    "click .cannot-find-connect-faq":"_toggleFAQ",
    "click #referral-link":"_selectReferralURL",
    "mouseover  .glyphicon-question-sign, .glyphicon-refresh, .glyphicon-envelope" :"_showToolTip",
  },

  remove: function() {
    this._removePopovers();
    this.groupMembersView.remove();
    this.addViaLinkedInView.remove();
    return Backbone.View.prototype.remove.call(this);
  },

  render: function() {
    var referralUrl        = "http://www.minzio.com?g=" + this.model.get("referral_hash") + "&u=" + TeamProfile.currentUser.get("referral_hash");
    var referralUrlEscaped = referralUrl.replace("&", "%26");
    // console.log(referralUrl);
    var renderedContent = this.template({
      group:              this.model,
      referralUrl:        referralUrl,
      referralUrlEscaped: referralUrlEscaped
    });
    this.$el.html(renderedContent);
    this._renderAddViaLinkedIn();
    this._renderGroupMembers();
    return this;
  },

  _removePopovers: function() {
    $('.popover').remove();
  },
  
  _renderAddViaLinkedIn: function() {
    this.addViaLinkedInView = new TeamProfile.Views.AddViaLinkedInView({model: this.model});
    this.$('#add-connections').html(this.addViaLinkedInView.render().$el);
    return this;
  },

  _renderGroupMembers: function() {
    // if there is only one member in the group, prompt to add more
    var $node = this.$('.group-members');
    this.groupMembersView = new TeamProfile.Views.GroupMembersView({model: this.model});
    $node.html(this.groupMembersView.render().$el);
    return this;
  },

  _selectReferralURL: function(event) {
    $(event.currentTarget).select();
  },

  _showToolTip: function(event) {
    $(event.currentTarget).tooltip('show');
  },

  _toggleFAQ: function() {
    var $instructions = this.$('.enable-account-instructions');
    $instructions.slideToggle();
  },
});