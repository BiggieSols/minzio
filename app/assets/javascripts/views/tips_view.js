TeamProfile.Views.TipsView = Backbone.View.extend({
  template: JST['tips/index'],

  initialize: function(options) {
    this.tipViews = [];
    this.listenTo(this.collection, "add", this.render);
  },

  render: function() {
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent);
    this._renderTips();
    return this;
  },

  _renderTips: function() {
    var that, tips;
    console.log("rendering tips");
    tips = this.collection;
    that = this;

    tips.forEach(function(tip) {
      var tipView = new TeamProfile.Views.TipView({
        model: tip,
      });
      that.tipViews.push(tipView);
      that.$el.append(tipView.render().$el);
    });
    return this;
  },

  remove: function() {
    this.tipViews.forEach(function(view) {
      view.remove();
    });
    
    return Backbone.View.prototype.remove.call(this);
  },
});