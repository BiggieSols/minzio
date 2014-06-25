TeamProfile.Views.GroupMembersView = Backbone.View.extend({
  // template: JST['groups/members'],

  initialize: function(options) {
    this.groupMemberViews = [];
    this.listenTo(this.model, "sync", this.render);
    this.group = options.group;
  },

  remove: function() {
    this.groupMemberViews.forEach(function(view) {
      view.remove();
    });
    Backbone.View.prototype.remove.call(this);
  },
  
  render: function() {
    var that = this;
    var firstMember = true;
    this.$el.html("");
    this.model.get("members").forEach(function(member) {
      var groupMemberView = new TeamProfile.Views.GroupMemberView({model: member, group: that.model, firstMember: firstMember});
      firstMember = false;
      that.groupMemberViews.push(groupMemberView);
      var renderedContent = groupMemberView.render().$el;
      that.$el.append(renderedContent);
    });
    return this;
  },
});