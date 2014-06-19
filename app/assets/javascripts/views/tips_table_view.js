TeamProfile.Views.TipsTableView = Backbone.View.extend({
  template: JST['users/tips_table'],

  initialize: function(options) {
    this.tipsCategory = options.tipsCategory;
    this.tipViews = [];
  },

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    this._renderTips(this._tipsToDisplay());
    return this;
  },

  _tipsToDisplay: function() {
    // var selectedTips, custom_personality = this.model.get("custom_personality");
    var selectedTips, custom_personality = this.model.get("custom_personality");

    switch(this.tipsCategory) {
      case "colleague":
        selectedTips = custom_personality.get("as_colleague");
        break;
      case "manager":
        selectedTips = custom_personality.get("as_manager");
        break;
      case "employee":
        selectedTips = custom_personality.get("as_employee");
        break;
    }
    return selectedTips;
  },

  _renderTips: function(tips) {
    var that, $node;
    that = this;
    $node = this.$('.table');
    tips.forEach(function(tip) {
      var tipView = new TeamProfile.Views.TipView({model: tip});
      that.tipViews.push(tipView);
      $node.append(tipView.render().$el);
    });
  },

  remove: function() {
    this.tipViews.forEach(function(view) {
      view.remove();
    });
    
    return Backbone.View.prototype.remove.call(this);
  },
});