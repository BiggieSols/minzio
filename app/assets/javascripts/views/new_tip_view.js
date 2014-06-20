TeamProfile.Views.NewTipView = Backbone.View.extend({
  tagName: "tr",
  template: JST['tips/new'],

  events: {
    "submit .new-tip-form":"_addTip"
  },

  initialize: function(options) {
    this.customPersonality    = options.customPersonality;
    this.tipsCategory         = options.tipsCategory;
    this._resetModel();
    // this.listenTo(this.model, "sync", this._appendTip);
  },

  render: function() {
    var renderedContent;
    renderedContent = this.template({
      tip: this.model
    });
    this.$el.html(renderedContent);

    return this;
  },

  focus: function() {
    this.$('.tip-text input').focus();
  },

  _addTip: function(event) {
    var tip, text, that;
    event.preventDefault();
    that = this;
    text = this.$(".tip-text input").val();
    console.log("custom personality id is " + this.customPersonality.id);
    this.model.set("text", text);
    this.$('.tip-text input').val("");
    this.model.save({}, {
      success: function() {
        that._appendTip();
      }
    });
  },

  _appendTip: function() {
    relationshipType = "as_"+this.tipsCategory;
    this.customPersonality.get(relationshipType).add(this.model, {at: 0, trigger: true});
    console.log("appending to collection!");
    this._resetModel();
  },

  _resetModel: function() {
    this.model = new TeamProfile.Models.Tip({
      custom_personality_id:  this.customPersonality.id,
      relationship_type:    this.tipsCategory
    });
  }
});