TeamProfile.Views.GroupView = Backbone.View.extend({
  template: JST['groups/show'],

  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
  },
  
  render: function() {
    // console.log("model is below");
    // console.log(this.model);
    // group = this.model
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    this._renderConnectionSearch();
    return this;
  },

  _renderConnectionSearch: function() {
    var connectionSearchView = new TeamProfile.Views.ConnectionSearchView({model: this.model});
    this.$('#add-connections').html(connectionSearchView.render().$el);
    return this;
  },
});