TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],
  
  render: function() {
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});