TeamProfile.Views.UserGroupsView = Backbone.View.extend({
  template: JST['users/user_groups'],

  render: function() {
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});