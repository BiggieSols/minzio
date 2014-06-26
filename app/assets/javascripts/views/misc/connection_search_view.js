TeamProfile.Views.ConnectionSearchView = Backbone.View.extend({
  tagName: "span",

  template: JST['misc/connection_search'],
  spinnerTemplate: JST['misc/spinner'],

  events: {
    "submit form" : "test"
  },

  test: function(e) {
    e.preventDefault();

  },

  initialize: function() {
    this.placeholder = "DEFAULAT TEXT GOES HERE";
    
    //width of the search field
    this.width = "270px";
  },

  render: function() {
    var renderedContent = this.template({
      users: TeamProfile.currentUser.get("connections"),
    });
    this.$el.html(renderedContent);
    this._renderSelect2();
    return this;
  },

  _chosenItemFormat: function(state) {
    return "<span data-id='" + state.id +"'/>" + state.text + "</span>";
  },

  _clearForm: function() {
    this.render();
    this.$('.select2-input').focus();
  },

  _dropdownFormat: function(state) {
    return "<div class='row'><div class='col-xs-4'><img class='lazy friend-dropdown' src='" + state.url + "' class='dropdown-img'/></div><div class='col-xs-8 user-name-dropdown'>" + state.text  + "</div></div>";
  },

  // need to override
  _formAction: function(params) {
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
    // console.log("identifying changes");
    var that = this;
    this.$('.connection-selector').on("change", function(event) {
      params = {};
      params.user_id = that.$('.select2-search-choice div span').data("id");
      that._formAction(params);
    });
  },

  _renderSelect2: function() {
    this.$('.connection-selector').select2({
      data: this._generateSelect2Data(),
      minimumInputLength: 3,
      placeholder: this.placeholder,
      width: this.width,
      formatResult: this._dropdownFormat,
      formatSelection: this._chosenItemFormat,
      multiple: true
    });

    this.$('.select2-choice').css("padding", "0px 10px");
    this._identifyFieldChanges();
    return this;
  },
});