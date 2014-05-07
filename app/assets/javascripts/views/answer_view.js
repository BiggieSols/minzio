TeamProfile.Views.AnswerView = Backbone.View.extend({
  template: JST["answer/show"],

  events: {
    'click .answer': 'toggleSelect'
  },

  render: function() {
    var renderedContent = this.template({answer: this.model});
    this.$el.html(renderedContent);
    return this;
  },

  toggleSelect: function(event) {
    console.log("selected option");

    var targetAnswer = $(event.currentTarget);

    // $(answer.closest(".question").find(".answer")).removeClass("selected")

    targetAnswer.closest(".question")
                .find(".answer")
                .removeClass("selected");

    // this.$('.answer').toggleClass("selected");

    targetAnswer.toggleClass("selected");
  }
});