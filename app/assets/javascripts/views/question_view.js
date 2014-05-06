TeamProfile.Views.QuestionView = Backbone.View.extend({
  template: JST["question/show"],

  render: function() {
    var renderedContent = this.template({question: this.model});
    this.$el.html(renderedContent);
    // console.log("rendering question");
    this._renderAnswers();
    return this;
  },

  _renderAnswers: function() {
    var answers = this.model.get("answers");
    var answersDiv = this.$(".answers");
    answers.models.forEach(function(answer) {
      var answerView = new TeamProfile.Views.AnswerView({
        model: answer
      });
      answersDiv.append(answerView.render().$el);
    });
    return this;
  },
});