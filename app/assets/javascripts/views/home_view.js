TeamProfile.Views.HomeView = Backbone.View.extend({
  template: JST['misc/landing_page'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});