TeamProfile.Views.GroupsView = Backbone.View.extend({
  template: JST['groups/index'],
  newGroupTemplate: JST['groups/new'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "submit .new-group-form":"_createGroup",
    "click .group":"_selectGroup",
    "click .remove-group-confirm":"_removeGroup",
  },

  initialize: function() {
    this.groupListItems = [];
    this.listenTo(this.collection, 'destroy', this._renderPostGroupRemoval);
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
    // console.log("rendering groups view");
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
          that._renderIntro();
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

  _removePopover: function(event) {
    console.log("got here");
    $(event.currentTarget).closest(".popover").remove();
  },

  _removePopovers: function() {
    $('.popover').remove();
  },

  _renderCreateGroupPopover: function() {
    if($.cookie("groupsPopoverShown") === "1") return this;

    var that = this;
    this.createPopoverTimer = setTimeout(function() {
      var tite, content, node;
      if(that.collection.models.length === 0) {
        title = "Step 1: create a group";
        content = "create a group for you and your colleagues to share your test results (e.g. \"Marketing Team\")";
        node = that.$('#group-name');
      } else {
        title = '<span>Your groups</span>' + '<button type="button" class="close custom-close" data-dismiss="popover">&times;</button>';
        content = "It looks like someone already added you to this group! You can create your own groups too (e.g. \"Marketing Team\"), just use the form above";
        node = that.$('.group').eq(0);
      }

      node.data("container", "body")
          .data("placement", "bottom")
          .data("content", content)
          .data("title", title)
          .data("html", true)
          .popover('show');

      $('.custom-close').on("click", function(e) {
        $(e.currentTarget).closest(".popover").remove();
        that._selectFirstGroup();
        that._renderIntro();
      });

      $.cookie("groupsPopoverShown", 1);
    }, 500);
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

  _renderIntro: function() {
    var that = this;

    if((TeamProfile.currentUser.get("num_sent_invitations") === 0) && $.cookie("introShown") != 1) {
      setTimeout(function() {
        introJs().setOptions({
          'skipLabel':'Exit',
          'scrollToElement': true
        }).oncomplete(function() {
          that.$('#referral-link').select();
        }).start();

        return this;
      }, 500);
    }
  },

  _renderNewGroup: function() {
    var $newGroupContainer = this.$('#new-group');
    var renderedContent = this.newGroupTemplate();
    $newGroupContainer.html(renderedContent);
    return this;
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