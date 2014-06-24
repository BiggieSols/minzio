TeamProfile.Views.TipView = Backbone.View.extend({
  // tagName: "tr",
  template: JST['tips/show'],

  initialize: function(options) {
    this.firstTip    = options.firstTip;
    this.canEdit     = TeamProfile.currentUser.get("editable_tip_ids")[this.model.id];
    this.editTipView = new TeamProfile.Views.EditTipView({model: this.model});
    // this.listenTo(this.model, "sync", this.render);
    // this.listenTo(this.model, "destroy", this.remove);
  },

  events: {
    "click .vote-direction"     : "vote",
    "click .edit-button"        : "_renderEditForm",
    "click .trigger-tip-delete" : "_setDeleteModalTipId",
    "mouseenter .cannot-edit, .vote-direction"   : "_showTooltip",

  },

  _setDeleteModalTipId: function() {
    $('.delete-tip-confirm').data("id", this.model.id);
  },

  _delete: function() {
    console.log("attempting to delete this tip");
    this.model.destroy();
    $('#delete-tip').modal("hide");
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

  _showTooltip: function(event) {
    $(event.currentTarget).tooltip("show");
  },

  vote: function(event) {
    var target, voteDirection, voteValue, tipVote, currUserVote, currTipScore, scoreToAdd;

    target = $(event.currentTarget);
    voteDirection = target.data("direction");
    voteValue = voteDirection == "up" ? 1 : -1;

    tipVote = new TeamProfile.Models.TipVote({
      tip_id: this.model.id,
      vote_value: voteValue
    });

    currUserVote = this.model.get("curr_user_vote");
    currTipScore = this.model.get("score");

    if(this.model.get("curr_user_vote") == voteValue) {
      this.destroyVote(tipVote);
      this.model.set("score", currTipScore -= voteValue);
      this.model.set("curr_user_vote", 0);
    } else {
      scoreToAdd = currUserVote ? 2*voteValue : voteValue;
      this.model.set("score", currTipScore + scoreToAdd);
      this.model.set("curr_user_vote", voteValue);
      this.createVote(tipVote);
    }
    this.render();
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