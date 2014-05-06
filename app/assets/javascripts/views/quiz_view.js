TeamProfile.Views.QuizView = Backbone.View.extend({
  template: JST["quiz/show"],

  render: function() {
    // var renderedContent = "asdf";
    var renderedContent = this.template({quiz: this.model});
    this.$el.html(renderedContent);
    return this;
  },

  _renderQuestions: function() {
  },


});