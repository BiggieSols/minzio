TeamProfile.Views.GroupsView = Backbone.View.extend({
  template: JST['groups/index'],
  newGroupTemplate: JST['groups/new'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "submit .new-group-form":"_createGroup",
    "click .group":"_selectGroup",
    "click .remove-group-confirm":"_removeGroup"
  },

  initialize: function() {
    // this.listenTo(this.collection, 'change[:name]', this._renderGroupsList);
    this.groupListItems = [];
    this.listenTo(this.collection, 'destroy', this._renderPostGroupRemoval);
    this.listenToOnce(TeamProfile.currentUser, 'sync', this.render);
  },

  test: function() {
    alert("test succeeded!");
  },

  remove: function() {
    this._removePopovers();
    if(this.createPopoverTimer) clearTimeout(this.createPopoverTimer);

    this.groupListItems.forEach(function(view) {
      view.remove();
    });
    
    return Backbone.View.prototype.remove.call(this);
  },

  render: function() {
    var renderedContent = this.template({groups: this.collection});
    this.$el.html(renderedContent);
    this._renderGroupsList()
        ._renderNewGroup()
        ._renderCreateGroupPopover()
        ._selectLastGroup();
    return this;
  },

  _createGroup: function(event) {
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
    } else {
      this.$('#group-name').focus();
    }
  },

  _highlight: function(node) {
    $(".groups .active").removeClass("active");
    node.addClass("active");
  },

  _removeGroup: function(event) {
    this.$('.modal').modal("hide");
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    var groupId = this.$('.active').data("id");
    var group = this.collection.get(groupId);
    // this._renderGroupsList();
    group.destroy();
  },

  _renderCreateGroupPopover: function() {
    var that = this;
    this.createPopoverTimer = setTimeout(function() {
      if(that.collection.models.length === 0) {
        var title = "step 1: create a group";
        var content = "create a group for you and your colleagues to share your test results";
        that.$('#group-name').data("container", "body")
                             .data("placement", "bottom")
                             .data("content", content)
                             .data("title", title)
                             .popover('show');
      }
    }, 1000);
    return this;
  },

  _removePopovers: function() {
    $('.popover').remove();
  },

  _renderPostGroupRemoval: function() {
    this._renderGroupsList();
    this.$('.group-details').html("");
    this._removePopovers();
  },

  // causing some rednering errors. turning off for now
  _scrollToGroup: function() {
    $('body').animate({
      scrollTop:$('.group-details').offset().top - 50
    }, 'medium');
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


  _renderGroupsList: function() {
    var that = this;
    var $listContainer = this.$('#groups-list');
    $listContainer.html("");
    this.collection.forEach(function(group) {
      // var groupListItemView = new TeamProfile.Views.GroupListItemView({model: group});
      groupListItemView = new TeamProfile.Views.GroupListItemView({model: group});
      that.groupListItems.push(groupListItemView);
      var renderedContent = groupListItemView.render().$el;
      $listContainer.append(renderedContent);
    });

    return this;
  },

  _renderNewGroup: function() {
    var $newGroupContainer = this.$('#new-group');
    var renderedContent = this.newGroupTemplate();
    $newGroupContainer.html(renderedContent);
    return this;
  },

  _selectFirstGroup: function() {
    var group = this.$('.group').eq(0);
    group.click();
  },

  _selectGroup: function(event) {
    var $node = $(event.currentTarget);
    var groupId = $node.data("id");

    currentGroupId = this.groupView ? this.groupView.model.id : null;

    // temporarily removing this feature. not causing performance issues anyway
    invalidGroupId = !((currentGroupId === null) || (currentGroupId != groupId));

    if(!($node.hasClass("editing"))) {// || invalidGroupId)) {
      this._highlight($node);
      TeamProfile.lastSelectedGroup = groupId;
      this._renderGroupDetails(groupId);//._scrollToGroup();      
    }
  },

  _selectLastGroup: function() {
    if(TeamProfile.lastSelectedGroup) {
      this.$('.group')
          .filter(function(i, val) {
            return $(val).data("id") == TeamProfile.lastSelectedGroup;
          }
      ).click();
    } else {
      this._selectFirstGroup();
    }
    return this;
  }
});