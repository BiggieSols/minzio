TeamProfile.Views.GroupsView = Backbone.View.extend({
  template: JST['groups/index'],
  newGroupTemplate: JST['groups/new'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "submit .new-group-form":"createGroup",
    "click .group":"selectGroup",
    "click .remove-group-confirm":"removeGroup"
  },

  removeGroup: function(event) {
    this.$('.modal').modal("hide");
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    var groupId = this.$('.active').data("id");
    var group = this.collection.get(groupId);
    // this._renderGroupsList();
    group.destroy();
  },

  initialize: function() {
    this.listenTo(this.collection, 'sync', this._renderGroupsList);
    this.listenTo(this.collection, 'destroy', this._renderPostGroupRemoval);
  },

  _renderPostGroupRemoval: function() {
    this._renderGroupsList();
    this.$('.group-details').html("");
    this.removePopovers();
  },

  _renderCreateGroupPopover: function() {
    var that = this;
    setTimeout(function() {
      if(that.collection.models.length === 0) {
        var title = "step 1: create a group";
        var content = "create a group for you and your colleagues to share your test results";
        that.$('#group-name').data("container", "body")
                             .data("toggle", "popover")
                             .data("placement", "bottom")
                             .data("content", content)
                             .data("title", title)
                             .popover('show');
      }
    }, 1000);
    return this;
  },

  removePopovers: function() {
    $('.popover').remove();
  },

  remove: function() {
    this.removePopovers();
    return Backbone.View.prototype.remove.call(this);
  },

  createGroup: function(event) {
    var that = this;
    var $groupInput = this.$('#group-name');
    event.preventDefault();
    var groupName = $groupInput.val();

    if(groupName !== "") {

      var group = new TeamProfile.Models.Group({name: groupName});

      group.save({}, {
        success: function() {
          $groupInput.val("");
          that.collection.add(group, {at: 0});
          that._renderGroupsList();
          that._selectFirstGroup();
        }
      });
    }
    // console.log(this.$('#group-name').val());
  },

  selectGroup: function(event) {
    var $node = $(event.currentTarget);
    var groupId = $node.data("id");

    currentGroupId = this.groupView ? this.groupView.model.id : null;

    // temporarily removing this feature. not causing performance issues anyway
    invalidGroupId = !((currentGroupId === null) || (currentGroupId != groupId));

    if(!($node.hasClass("editing"))) {// || invalidGroupId)) {
      console.log("loading new group");
      this._highlight($node);
      TeamProfile.lastSelectedGroup = groupId;
      this._renderGroupDetails(groupId);//._scrollToGroup();      
    }
  },

  // causing some rednering errors. turning off for now
  // _scrollToGroup: function() {
  //   $('body').animate({
  //     scrollTop:$('.group-details').offset().top - 50
  //   }, 'medium');
  // },

  _selectFirstGroup: function() {
    var group = this.$('.group').eq(0);
    group.click();
  },

  _highlight: function(node) {
    $(".groups .active").removeClass("active");
    node.addClass("active");
  },

  render: function() {
    var renderedContent = this.template({groups: this.collection});
    this.$el.html(renderedContent);
    this._renderGroupsList()
        ._renderNewGroup()
        ._renderCreateGroupPopover();
    return this;
  },

  _renderGroupsList: function() {
    var $listContainer = this.$('#groups-list');
    $listContainer.html("");
    this.collection.forEach(function(group) {
      // var groupListItemView = new TeamProfile.Views.GroupListItemView({model: group});
      groupListItemView = new TeamProfile.Views.GroupListItemView({model: group});
      var renderedContent = groupListItemView.render().$el;
      $listContainer.append(renderedContent);
    });

    return this._selectLastGroup();
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
    $groupDetails.html(this.spinnerTemplate());

    // clean up event listeners
    if(this.groupView) {
      this.groupView.remove();
    }

    this.groupView = new TeamProfile.Views.GroupView({model: group});
    $groupDetails.html(this.groupView.render().$el);
    return this;
  },

  _selectLastGroup: function() {
    if(TeamProfile.lastSelectedGroup) {
      this.$('.group')
          .filter(function(i, val) {
            return $(val).data("id") == TeamProfile.lastSelectedGroup;
          }
      ).click();
    }
    return this;
  }
});