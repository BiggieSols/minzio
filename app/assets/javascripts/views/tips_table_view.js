TeamProfile.Views.TipsTableView = Backbone.View.extend({
  template: JST['users/tips_table'],

  initialize: function(options) {
    this.newTipView   = null;
    this.tipsView     = null;
    this.tipsCategory = options.tipsCategory;
  },

  events: {
    "click .add-tip-container": "_renderNewTipForm",
    "click .switch":"_changeCategory",
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
    this._renderTipsView()._renderActiveSwitch();
    return this;
  },

  _changeCategory: function(event) {
    var clickedItem, newCategory;
    // var newCategory;
    clickedItem = $(event.currentTarget);
    if(!clickedItem.hasClass("active")) {
      newCategory = clickedItem.data("category");
      // this.$('.active').removeClass("active");
      // clickedItem.addClass("active");
      this.tipsCategory = newCategory;
      this.render();
    }
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

  _renderActiveSwitch: function() {
    this.$("[data-category = " + this.tipsCategory + "]").addClass("active");
  },

  _renderTipsView: function() {
    var that, tips;
    tips = this._tipsToDisplay();
    this.tipsView = new TeamProfile.Views.TipsView({
      collection: tips,
      user:       this.model
    });
    this.$('.tips').html(this.tipsView.render().$el);
    return this;
  },

  _renderNewTipForm: function() {
    if(!this.newTipView) {
      this.newTipView = new TeamProfile.Views.NewTipView({
        customPersonality:    this.model.get("custom_personality"),
        tipsCategory:         this.tipsCategory,
        user:                 this.model,
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