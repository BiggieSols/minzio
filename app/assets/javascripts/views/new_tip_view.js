TeamProfile.Views.NewTipView = Backbone.View.extend({
  tagName: "tr",
  template: JST['tips/new'],

  events: {
    "submit .new-tip-form":"_addTip"
  },

  render: function() {
    var renderedContent;
    renderedContent = this.template({
      tip: this.model
    });
    this.$el.html(renderedContent);
    return this;
  },

  focus: function() {
    this.$('.tip-text input').focus();
  },

  _addTip: function(event) {
    var tip, text;
    event.preventDefault();
    text = this.$(".tip-text input").val();
    // :custom_personality_id, :relationship_type
    // tip = new TeamProfile.Models.Tip({text: text});
    // tip.save();
  },
});