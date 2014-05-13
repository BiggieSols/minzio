TeamProfile.Views.GroupMembersView = Backbone.View.extend({
  template: JST['groups/members'],

  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function() {
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  },
});