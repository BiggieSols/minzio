TeamProfile.Views.QuizView = Backbone.View.extend({
  template: JST["quiz/show"],

  initialize: function() {
    this.questionViews = [];
  },

  events: {
    "click button":"submit"
  },

  render: function() {
    // var renderedContent = "asdf";
    var renderedContent = this.template({quiz: this.model});
    this.$el.html(renderedContent);
    return this._renderQuestions();
  },

  submit: function() {
    this._highlightRemainingQuestions();
    if(this._allQuestionsAnswered()) {
      console.log("submitting the form!");
    } else {
      this.$('error-message').css("visibility", "visible");
    }
  },

  _highlightRemainingQuestions: function() {
    this.questionViews.forEach(function(questionView) {
      questionView.confirmAnswered();
    });
  },

  _allQuestionsAnswered: function() {
    // this.questionViews.forEach(function(questionView) {
    //   console.log("question answered? -- " + questionView.answered);
    //   if(!questionView.answered) {
    //     console.log("failed");
    //     return false;
    //   }
    // });
    // console.log("got to this line");
    // return true;
    for(var i = 0; i < this.questionViews.length; i++) {
      questionView = this.questionViews[i];
      if(!questionView.answered) {
        console.log("failed");
        return false;
      }
    }
    return true;
  },

  _renderQuestions: function() {
    var that = this;
    var questions = this.model.get("questions");
    var questionsDiv = this.$(".questions");

    questions.models.forEach(function(question) {
      var questionView = new TeamProfile.Views.QuestionView({
        model: question
      });

      that.questionViews.push(questionView);
      questionsDiv.append(questionView.render().$el);
    });
    return this;
  },
});