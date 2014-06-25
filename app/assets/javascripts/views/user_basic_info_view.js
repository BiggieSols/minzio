TeamProfile.Views.UserBasicInfoView = Backbone.View.extend({
  template: JST['users/basic_info'],

  render: function() {
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});