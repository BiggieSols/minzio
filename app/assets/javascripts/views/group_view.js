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
    var $node = this.$('.group-members');
    var groupMembersView = new TeamProfile.Views.GroupMembersView({model: this.model});
    $node.html(groupMembersView.render().$el);
    return this;
  },

  _renderConnectionSearch: function() {
    var connectionSearchView = new TeamProfile.Views.ConnectionSearchView({model: this.model});
    this.$('#add-connections').html(connectionSearchView.render().$el);
    return this;
  },
});