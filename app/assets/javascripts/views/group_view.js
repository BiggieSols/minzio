TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],
  
  render: function() {
    console.log("model is below");
    console.log(this.model);
    group = this.model
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});