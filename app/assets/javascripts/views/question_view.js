TeamProfile.Views.QuestionView = Backbone.View.extend({
  template: JST["questions/show"],

  // called by QuizView
  initialize: function() {
    this.answered = false;
  },

  events: {
    "click .answer":"_handleAnswer"
  },

  confirmAnswered: function() {
    userSelection = this.$('.selected');
    if(userSelection.length === 0) {
      this.$('.answers').addClass("un-answered");
    }
  },

  render: function() {
    var renderedContent = this.template({question: this.model});
    this.$el.html(renderedContent);
    // // console.log("rendering question");
    this._renderAnswers();
    return this;
  },

  _handleAnswer: function() {
    this.answered = true;
    this.$('.answers').removeClass("un-answered");
  },

  _renderAnswers: function() {
    var answers = this.model.get("answers");
    var answersDiv = this.$(".answers");

    for(var i = 0; i < answers.models.length; i++) {
      answer = answers.models[i];
      var answerView = new TeamProfile.Views.AnswerView({
        model: answer
      });

      answersDiv.append(answerView.render().$el);
      if(i < answers.models.length-1) {
        answersDiv.append('<hr class="divider">');
      }
    }
    return this;
  },
});