TeamProfile.Views.QuestionView = Backbone.View.extend({
  template: JST["question/show"],

  initialize: function() {
    this.answered = false;
  },

  events: {
    "click .answer":"handleAnswer"
  },

  render: function() {
    var renderedContent = this.template({question: this.model});
    this.$el.html(renderedContent);
    // console.log("rendering question");
    this._renderAnswers();
    return this;
  },

  handleAnswer: function() {
    this.answered = true;
    this.$('.answers').removeClass("un-answered");
  },

  confirmAnswered: function() {
    userSelection = this.$('.selected');
    if(userSelection.length === 0) {
      this.$('.answers').addClass("un-answered");
    }
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
      };
    }

    return this;
  },
});