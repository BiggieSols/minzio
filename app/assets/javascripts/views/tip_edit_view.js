TeamProfile.Views.EditTipView = Backbone.View.extend({
  template: JST['tips/edit'],

  events: {
    "submit .edit-tip-form":"_updateTip",
    "keydown .edit-text-input":"escape",
  },

  // initialize: function(options) {
  //   this.customPersonality    = options.customPersonality;
  //   this.tipsCategory         = options.tipsCategory;
  //   this._resetModel();
  //   // this.listenTo(this.model, "sync", this._appendTip);
  // },

  render: function() {
    var renderedContent;
    renderedContent = this.template({
      tip: this.model
    });
    this.$el.html(renderedContent);
    return this;
  },

  focus: function() {
    this.$('.edit-text-input').focus();
  },

  escape: function(e) {
    if(e.keyCode == 27) {
      console.log("got here");
      // console.log("pressed escape");
      // this.$('.dropdown').removeClass("open");
      this.remove();
      this.model.trigger("sync");
    }
  },

  _updateTip: function(e) {
    var text;
    e.preventDefault();
    text = this.$('.edit-text-input').val();
    this.model.save({"text": text});
  },
});