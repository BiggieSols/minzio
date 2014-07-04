TeamProfile.Views.TopNavUserSearchView = TeamProfile.Views.ConnectionSearchView.extend({
  initialize: function() {
    this.placeholder = "Search Minzio...";
    this.width = "270px";
    this.listenTo(this.model, "sync", this.render);
  },

  _formAction: function(params) {
    // var that, groupMembership;
    // that                    = this;
    console.log(params);
    Backbone.history.navigate("users/" + params.user_id, {trigger: true});

    // this._renderSpinner();
    this._clearForm();
  },
});