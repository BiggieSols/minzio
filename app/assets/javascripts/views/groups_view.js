TeamProfile.Views.GroupsView = Backbone.View.extend({
  template: JST['groups/index'],
  groupList: JST['groups/list'],
  groupDetails: JST['groups/show'],

  render: function() {
    var renderedContent = this.template({groups: this.collection});
    this.$el.html(renderedContent);
    return this;
  }
});