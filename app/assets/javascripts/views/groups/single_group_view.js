TeamProfile.Views.SingleGroupView = Backbone.View.extend({
  template: JST['groups/single_group'],

  initialize: function() {
    this.groupView = new TeamProfile.Views.GroupView({model: this.model});
    this.childViews = [];
    this.childViews.push(this.groupView);
  },

  remove: function() {
    this.childViews.forEach(function(view) {view.remove(); });
    return Backbone.View.prototype.remove.call(this);
  },

  render: function() {
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent);
    return this._renderGroupView();
    // return this;
  },

  _renderGroupView: function() {
    this.$('.single-group-container').html(this.groupView.render().$el);
    return this;
  }
});