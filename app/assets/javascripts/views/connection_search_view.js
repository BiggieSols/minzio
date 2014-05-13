TeamProfile.Views.ConnectionSearchView = Backbone.View.extend({
  tagName: "span",

  template: JST['misc/connection_search'],

  // needs to be overridden in subclasses
  initialize: function() {
    this.placeholder = "Add a group member...";
    this.width = "180px";
  },

  dropdownFormat: function(state) {
    return "<div class='row'><div class='col-xs-4'><img class='lazy friend-dropdown' src='" + state.url + "' class='dropdown-img'/></div><div class='col-xs-8 user-name-dropdown'>" + state.text  + "</div></div>";
  },


  _formAction: function(params) {
    // console.log("form is taking an action!");
    // params.item_id = $(event.currentTarget).closest(".item").data("id");
    params.group_id = $('.group-container').data("id");
    console.log(params);
    var groupMembership = new TeamProfile.Models.GroupMember(params);

    var that = this;
    groupMembership.save({}, {
      success: function() {
        console.log("group membership saved!");
        that.model.fetch();
      }
    });
    // rec = new GiftMe.Models.UserItemRecommendation(params);
    // rec.save();

    // userName = this.$('.select2-search-choice div').text();
    // GiftMe.dispatcher.trigger("recommendation", {userName: userName});

    this._clearForm();
  },

  render: function() {
    var renderedContent = this.template({users: TeamProfile.currentUser.get("connections")});
    this.$el.html(renderedContent);
    this._initalizeSelect2();

    // TODO: move to another view? doesn't work within the current element

    return this;
  },

  chosenItemFormat: function(state) {
    return "<span data-id='" + state.id +"'/>" + state.text + "</span>";
  },

  _clearForm: function() {
    this.render();
    this.$('.select2-input').focus();
  },

  _generateSelect2Data: function() {
    var data = [];
    TeamProfile.currentUser.get("connections").models.forEach(function(user) {
      data.push({
        id: user.id,
        text: user.escape("name"),
        url: user.escape("image_url")
      });
    });
    return {results: data};
  },

  _identifyFieldChanges: function() {
    var that = this;
    this.$('.connection-selector').on("change", function(event) {
      params = {};
      params.user_id = that.$('.select2-search-choice div span').data("id");
      that._formAction(params);
    });
  },

  _initalizeSelect2: function() {
    this.$('.connection-selector').select2({
      data: this._generateSelect2Data(),
      minimumInputLength: 3,
      placeholder: this.placeholder,
      width: this.width,
      formatResult: this.dropdownFormat,
      formatSelection: this.chosenItemFormat,
      multiple: true
    });

    this.$('.select2-choice').css("padding", "0px 10px");
    this._identifyFieldChanges();
  },
});