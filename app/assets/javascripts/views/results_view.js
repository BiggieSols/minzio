TeamProfile.Views.ResultsView = Backbone.View.extend({
  template: JST['quiz/results'],

  render: function() {
    var renderedContent = this.template({user: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});