TeamProfile.Views.TipView = Backbone.View.extend({
  template: JST['users/tip'],

  render: function() {
    var renderedContent = this.template({
      tip: this.model
    });
    this.$el.html(renderedContent);
    return this;
  },
});