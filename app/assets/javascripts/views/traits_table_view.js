TeamProfile.Views.TraitsTableView = Backbone.View.extend({
  template: JST['user/traits_table'],

  initialize: function(options) {
    this.traitsCategory = options.traitsCategory;
  },

  traitsToDisplay: function() {
    var selectedTraits, personality_type = this.model.get("personality_type");

    switch(this.traitsCategory) {
      case "colleague":
        selectedTraits = personality_type.get("as_colleague");
        break;
      case "manager":
        selectedTraits = personality_type.get("as_manager");
        break;
      case "employee":
        selectedTraits = personality_type.get("as_employee");
        break;
    }
    return selectedTraits;
  },

  render: function() {
    var renderedContent = this.template({
      traits: this.traitsToDisplay()
    });
    this.$el.html(renderedContent);
    return this;
  }
});