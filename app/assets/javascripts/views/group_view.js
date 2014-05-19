TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],

  events: {
    "click .cannot-find-connect-faq":"toggleFAQ"
  },

  // need to refactor this but it works for now
  toggleFAQ: function() {
    // var $faq          = this.$('.cannot-find-connect-faq');
    var $instructions = this.$('.enable-account-instructions');
    
    if($instructions.hasClass("invisible")) {
      $instructions.removeClass("invisible");
      $instructions.slideDown();
    } else {
      $instructions.slideToggle();
    }
  },

  render: function() {
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    this._renderConnectionSearch();
    this._renderGroupMembers();
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

  remove: function() {
    this._removePopovers();
    this.groupMembersView.remove();
    this.connectionSearchView.remove();
    return Backbone.View.prototype.remove.call(this);
  },
});