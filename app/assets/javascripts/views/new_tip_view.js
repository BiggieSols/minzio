TeamProfile.Views.NewTipView = Backbone.View.extend({
  tagName: "tr",
  template: JST['tips/new'],

  events: {
    "submit .new-tip-form":"_addTip",
    "mouseenter .post-anonymous-toolip"   : "_showTooltip",
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
    var tip, text, that, editableTips, anonymous;
    event.preventDefault();
    that = this;
    text = this.$(".tip-text input").val();
    anonymous = this.$('.post-anonymous').prop("checked");

    if(text === "") {
      this.focus();
    } else {
      this.model.set({
        text: text,
        anonymous: anonymous
      });
      this.$('.tip-text input').val("");

      this.model.save({}, {
        success: function() {
        // add to tip IDs the user can edit. this is more efficient than reloading the current user
          editableTips = TeamProfile.currentUser.get("editable_tip_ids");
          editableTips[that.model.id] = true;
          TeamProfile.currentUser.set("editable_tip_ids", editableTips);

          that._appendTip();
        }
      });
    }
    // console.log("custom personality id is " + this.customPersonality.id);
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
  },

  _showTooltip: function(event) {
    $(event.currentTarget).tooltip("show");
  },
});