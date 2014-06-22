TeamProfile.Views.TipsView = Backbone.View.extend({
  template: JST['tips/index'],

  events: {
    "click .delete-tip-confirm":"_removeTip",
  },

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

  _removeTip: function(event) {
    var tip, tipId;
    tipId = $(event.currentTarget).data("id");
    tip = this.collection.get(tipId);
    tip.destroy();
    this.collection.remove(tipId);
    this.$("#delete-tip").modal("hide");

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