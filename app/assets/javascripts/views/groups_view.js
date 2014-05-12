TeamProfile.Views.GroupsView = Backbone.View.extend({
  template: JST['groups/index'],
  newGroupTemplate: JST['groups/new'],
  groupsListTemplate: JST['groups/list'],

  events: {
    "submit form":"addGroup",
    "click .group":"selectGroup"
  },

  addGroup: function(event) {
    var that = this;
    var $groupInput = this.$('#group-name');
    event.preventDefault();
    var groupName = $groupInput.val();
    console.log("group name is "  +  groupName);
    var group = new TeamProfile.Models.Group({name: groupName});

    group.save({}, {
      success: function() {
        $groupInput.val("");
        that.collection.add(group, {at: 0});
        that._renderGroupsList();
        that._highlightFirstGroup();
      }
    });
    // console.log(this.$('#group-name').val());
  },

  selectGroup: function(event) {
    var $node = $(event.currentTarget);
    var groupId = $node.data("id");

    this._highlight($node);
    this._renderGroupDetails(groupId);
  },

  _highlightFirstGroup: function() {
    var group = this.$('.group').eq(0);
    this._highlight(group);
  },

  _highlight: function(node) {
    $(".active").removeClass("active");
    node.addClass("active");
  },

  render: function() {
    var renderedContent = this.template({groups: this.collection});
    this.$el.html(renderedContent);
    return this._renderGroupsList()
               ._renderNewGroup();
  },

  _renderGroupsList: function() {
    var $listContainer = this.$('#groups-list');
    var renderedContent = this.groupsListTemplate({groups: this.collection});
    $listContainer.html(renderedContent);
    return this;
  },

  _renderNewGroup: function() {
    var $newGroupContainer = this.$('#new-group');
    var renderedContent = this.newGroupTemplate();
    $newGroupContainer.html(renderedContent);
    return this;
  },

  _renderGroupDetails: function(groupId) {
    var group = this.collection.get(groupId);
    var $groupDetails = this.$('.group-details');
    var groupView = new TeamProfile.Views.GroupView({model: group});
    $groupDetails.html(groupView.render().$el)
    return this;
  }
});