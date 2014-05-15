TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],

  render: function() {
    // console.log("model is below");
    // console.log(this.model);
    // group = this.model
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

  removePopovers: function() {
    $('.popover').remove();
  },

  remove: function() {
    this.removePopovers();
    this.groupMembersView.remove();
    this.connectionSearchView.remove();
    return Backbone.View.prototype.remove.call(this);
  },
});