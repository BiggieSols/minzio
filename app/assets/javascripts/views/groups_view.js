TeamProfile.Views.GroupsView = Backbone.View.extend({
  template: JST['groups/index'],
  groupsList: JST['groups/list'],
  groupDetails: JST['groups/show'],

  render: function() {
    var renderedContent = this.template({groups: this.collection});
    this.$el.html(renderedContent);
    return this._renderGroupsList();
  },

  _renderGroupsList: function() {
    var $listContainer = this.$('#groups-list');
    var renderedContent = this.groupsList({groups: this.collection});
    $listContainer.html(renderedContent);
    return this;
  }
});