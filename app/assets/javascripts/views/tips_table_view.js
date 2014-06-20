TeamProfile.Views.TipsTableView = Backbone.View.extend({
  template: JST['users/tips_table'],

  initialize: function(options) {
    this.newTipView   = null;
    this.tipsCategory = options.tipsCategory;
    this.tipViews     = [];
  },

  events: {
    "click .add-tip-container": "_renderNewTipForm",
  },

  render: function() {
    // need to refactor the categories into a separate view and use event triggers to automate this...
    if(this.newTipView) {
      this.newTipView.remove();
      this.newTipView = null;
    }
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent);
    this._renderTips(this._tipsToDisplay());
    return this;
  },

  _tipsToDisplay: function() {
    // var selectedTips, custom_personality = this.model.get("custom_personality");
    var selectedTips, customPersonality;
    customPersonality = this.model.get("custom_personality");

    switch(this.tipsCategory) {
      case "colleague":
        selectedTips = customPersonality.get("as_colleague");
        break;
      case "manager":
        selectedTips = customPersonality.get("as_manager");
        break;
      case "employee":
        selectedTips = customPersonality.get("as_employee");
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

  _renderNewTipForm: function() {
    var tip;
    tip = new TeamProfile.Models.Tip({
      id: "new",
      relationship_type: this.tipsCategory,
      text: "",
      score: 1,
      curr_user_vote: 1
    });

    if(!this.newTipView) {
      this.newTipView = new TeamProfile.Views.NewTipView({model: tip});
      this.$(".add-tip-row").after(this.newTipView.render().$el);
      return this;
    } else {
      this.newTipView.focus();
    }
  },

  remove: function() {
    this.tipViews.forEach(function(view) {
      view.remove();
    });
    
    return Backbone.View.prototype.remove.call(this);
  },
});