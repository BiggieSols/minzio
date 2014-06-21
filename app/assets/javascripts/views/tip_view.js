TeamProfile.Views.TipView = Backbone.View.extend({
  // tagName: "tr",
  template: JST['tips/show'],

  initialize: function() {
    this.editTipView = new TeamProfile.Views.EditTipView({model: this.model});
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "click .vote-direction"   : "vote",
    "click .edit-button"      : "_renderEditForm",
  },

  _renderEditForm: function() {
    this.editTipView = new TeamProfile.Views.EditTipView({model: this.model});
    this.$('.tip-text-container').html(this.editTipView.render().$el);
    this.editTipView.focus();
    return this;
  },

  render: function() {
    var renderedContent;
    renderedContent = this.template({
      tip: this.model
    });
    this.$el.html(renderedContent);
    return this._renderColors();
  },

  _renderColors: function() {
    var curr_vote, $nodeToSelect;
    curr_vote = this.model.get("curr_user_vote");
    if(curr_vote == 1) {
      this.$('.up, .tip-score').addClass("upvote");
    } else if (curr_vote == -1) {
      this.$('.down, .tip-score').addClass("downvote");
    }
    return this;
  },

  vote: function(event) {
    var target, voteDirection, voteValue, tipVote;

    target = $(event.currentTarget);
    voteDirection = target.data("direction");
    voteValue = voteDirection == "up" ? 1 : -1;

    tipVote = new TeamProfile.Models.TipVote({
      tip_id: this.model.id,
      vote_value: voteValue
    });

    if(this.model.get("curr_user_vote") == voteValue) {
      this.destroyVote(tipVote);
    } else {
      this.createVote(tipVote);
    }
  },

  createVote: function(tipVote) {
    var that;
    that = this;
    tipVote.save({}, {
      success: function() {
        that.model.fetch();
      }
    });
  },

  destroyVote: function(tipVote) {
    var that;
    that = this;
    tipVote.id = -1;
    tipVote.destroy({
      data: {tip_id: this.model.id},
      processData: true,
      success: function() {
        that.model.fetch();
      }
    });
  },
});