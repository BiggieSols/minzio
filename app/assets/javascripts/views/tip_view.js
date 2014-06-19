TeamProfile.Views.TipView = Backbone.View.extend({
  tagName: "tr",
  template: JST['users/tip'],

  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "click .vote-direction"   : "vote",
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
      $nodeToSelect = this.$('.up');
    } else if (curr_vote == -1) {
      $nodeToSelect = this.$('.down');
    }

    if($nodeToSelect) $nodeToSelect.addClass("active");
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