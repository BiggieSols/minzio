TeamProfile.Views.QuizView = Backbone.View.extend({
  template: JST["quiz/show"],

  initialize: function() {
    this.questionViews = [];
  },

  events: {
    "click button":"submit",
    "click .answer":"checkAllSubmitted"
  },

  checkAllSubmitted: function() {
    var error_message = this.$('.error-message');
    if(error_message.css("visibility") === "visible" &&
      this._allQuestionsAnswered()) {
        this.$('.error-message').css("visibility", "hidden");
    }
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
      this.sendResults();
    } else {
      this.$('.error-message').css("visibility", "visible");
    }
  },

  sendResults: function() {
    this.userAnswers = new TeamProfile.Models.UserAnswers();
    var selected_answers = this.$('.selected');
    var answer_ids = [];
    var that = this;

    selected_answers.each(function(index) {
      var dataId = selected_answers.eq(index).data("id");
      that.userAnswers.set(index.toString(), {answer_id: dataId});
    });
    this.userAnswers.save({}, {
      success: function() {
        console.log("got here");
        Backbone.history.navigate("/users/current/results", {trigger: true});
      }
    });
  },

  _highlightRemainingQuestions: function() {
    this.questionViews.forEach(function(questionView) {
      questionView.confirmAnswered();
    });
  },

  _allQuestionsAnswered: function() {
    for(var i = 0; i < this.questionViews.length; i++) {
      questionView = this.questionViews[i];
      if(!questionView.answered) {
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