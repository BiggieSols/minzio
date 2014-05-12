TeamProfile.Views.AnswerView = Backbone.View.extend({
  template: JST["answers/show"],

  events: {
    'click .answer': 'selectAnswer'
  },

  render: function() {
    var renderedContent = this.template({answer: this.model});
    this.$el.html(renderedContent);
    return this;
  },

  selectAnswer: function(event) {
    var targetAnswer = $(event.currentTarget);
    targetAnswer.closest(".question")
                .find(".answer")
                .removeClass("selected");
    targetAnswer.addClass("selected");
  }
});