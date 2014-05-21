TeamProfile.Views.GroupMembersView = Backbone.View.extend({
  // template: JST['groups/members'],

  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function() {
    var that = this;
    this.$el.html("");
    this.model.get("members").forEach(function(member) {
      var groupMemberView = new TeamProfile.Views.GroupMemberView({model: member});
      var renderedContent = groupMemberView.render().$el;
      that.$el.append(renderedContent);
    });
    return this;
  },
});