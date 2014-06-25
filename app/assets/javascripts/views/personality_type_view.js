TeamProfile.Views.PersonalityTypeView = Backbone.View.extend({
  template: JST['users/personality_type_details'],

  render: function() {
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});