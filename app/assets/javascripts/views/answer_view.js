TeamProfile.Views.AnswerView = Backbone.View.extend({
  template: JST["answer/show"],

  render: function() {
    var renderedContent = this.template({answer: this.model});
    this.$el.html(renderedContent);
    return this;
  },
});