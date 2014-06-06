TeamProfile.Views.SocialShareView = Backbone.View.extend({
  template: JST["misc/social_share"],

  initialize: function(options) {
    this.user   = options.user;
    this.group  = options.group;
  },

  render: function() {
    var renderedContent = this.template({
      user  : this.user,
      group : this.group
    });
    this.$el.html(renderedContent);
    return this;
  }
});