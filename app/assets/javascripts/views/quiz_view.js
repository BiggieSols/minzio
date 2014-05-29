TeamProfile.Views.QuizView = Backbone.View.extend({
  template: JST["quizzes/show"],

  initialize: function() {
    this.questionViews = [];
  },

  events: {
    "click .get-results":"submit",
    "click .answer"     :"checkAllSubmitted"
  },

  checkAllSubmitted: function() {
    var error_message = this.$('.error-message');
    if(error_message.css("display") === "none" &&
      this._allQuestionsAnswered()) {
        this.$('.error-message').css("display", "none");
    }
  },

  render: function() {
    // var renderedContent = "asdf";
    var renderedContent = this.template({quiz: this.model});
    this.$el.html(renderedContent);
    return this._renderQuestions()._renderModal();
  },

  submit: function() {
    this._highlightRemainingQuestions();
    if(this._allQuestionsAnswered()) {
      this.sendResults();
    } else {
      this.$('.error-message').css("display", "inline-block");
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
        $.cookie("newUser", 1);
        Backbone.history.navigate("/users/current", {trigger: true});
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

  _renderModal: function() {
    if(TeamProfile.currentUser.get("personality_type").get("title")) {
      this.$('#quiz-already-taken').modal("show");
    }
    return this;
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