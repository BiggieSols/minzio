TeamProfile.Views.HowItWorksView = Backbone.View.extend({
  template: JST['static_pages/how_it_works'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});