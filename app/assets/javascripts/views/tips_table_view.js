TeamProfile.Views.TipsTableView = Backbone.View.extend({
  template: JST['users/tips_table'],

  initialize: function(options) {
    this.newTipView   = null;
    this.tipsView     = null;
    this.tipsCategory = options.tipsCategory;
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
    this._renderTipsView();
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

  _renderTipsView: function() {
    var that, tips;
    tips = this._tipsToDisplay();
    this.tipsView = new TeamProfile.Views.TipsView({collection: tips});
    this.$('.tips').html(this.tipsView.render().$el);
    return this;
  },

  _renderNewTipForm: function() {
    if(!this.newTipView) {
      this.newTipView = new TeamProfile.Views.NewTipView({
        customPersonality:    this.model.get("custom_personality"),
        tipsCategory:         this.tipsCategory
      });
      this.$(".add-tip-row").after(this.newTipView.render().$el);
    }
    this.newTipView.focus();
    return this;
  },

  remove: function() {
    this.tipsView.remove();
    return Backbone.View.prototype.remove.call(this);
  },
});