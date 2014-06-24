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
    var renderedContent, that;
    that = this;
    renderedContent = this.template();
    this.$el.html(renderedContent);

    if(!TeamProfile.currentUser.get("editable_tip_ids")) {
      TeamProfile.currentUser.fetch({
        success: function() {
          that._renderTips();
        }
      });
    } else {
      this._renderTips();
    }

    // this._renderTips();
    return this;
  },

  _addIntroDataAttrs: function() {
    var tipView;
    tipView = this.tipViews[0];
    tipView.$(".tip-vote-container").attr("data-step", 5)
                                    .attr("data-intro", "Do you agree with this comment? If so, click 'up' to upvote. If not, downvote!");

    tipView.$(".tip-edit-trigger-container").attr("data-step", 6)
                                            .attr("data-position", "left")
                                            .attr("data-intro", "Don't worry, you can edit or delete anything on your profile");
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
    var that, tips, firstTip;
    tips     = this.collection;
    that     = this;
    firstTip = true;

    tips.forEach(function(tip) {
      var tipView = new TeamProfile.Views.TipView({
        model: tip,
        firstTip: firstTip
      });
      firstTip = false;
      that.tipViews.push(tipView);
      that.$el.append(tipView.render().$el);
    });
    this._addIntroDataAttrs();
    return this;
  },

  remove: function() {
    this.tipViews.forEach(function(view) {
      view.remove();
    });
    
    return Backbone.View.prototype.remove.call(this);
  },
});