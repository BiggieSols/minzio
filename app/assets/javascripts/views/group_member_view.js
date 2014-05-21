TeamProfile.Views.GroupMemberView = Backbone.View.extend({
  template: JST['groups/member'],

  events: {
    "click .destroy":"removeMember"
  },

  removeMember: function() {
    console.log("removing");
    var user_id = this.model.id;
    var group_id = $('.group-member-container').eq(0).closest('.group-container').data("id");
    var groupMember = new TeamProfile.Models.GroupMember({id: -1});
    groupMember.destroy({data: {user_id: user_id, group_id: group_id}, processData: true});
    this.$el.hide("fast");

    this.model.collection.remove(user_id);
    // g.destroy({data: {user_id: 1, group_id: 94}, processData: true})
  },


  render: function() {
    var renderedContent = this.template({member: this.model});
    this.$el.html(renderedContent);
    return this;
  },
});