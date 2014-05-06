TeamProfile.Views.QuizView = Backbone.View.extend({
  template: JST["quiz/show"],

  render: function() {
    // var renderedContent = "asdf";
    var renderedContent = this.template({quiz: this.model});
    this.$el.html(renderedContent);
    return this._renderQuestions();
  },

  _renderQuestions: function() {
    var questions = this.model.get("questions");
    var questionsDiv = this.$(".questions");
    questions.models.forEach(function(question) {
      var questionView = new TeamProfile.Views.QuestionView({
        model: question
      });
      questionsDiv.append(questionView.render().$el);
    });
    return this;
  },
});