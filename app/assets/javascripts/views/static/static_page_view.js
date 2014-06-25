TeamProfile.Views.StaticPageView = Backbone.View.extend({
  skeleton:         JST['static_pages/skeleton'],
  aboutTemplate:    JST['static_pages/about'],
  contactTemplate:  JST['static_pages/contact'],
  termsTemplate:    JST['static_pages/terms'],
  privacyTemplate:  JST['static_pages/privacy'],
  supportTemplate:  JST['static_pages/support'],

  initialize: function(options) {
    this.pageName = options.pageName;
  },

  render: function() {
    var renderedContent;
    switch(this.pageName) {
      case "about":
        renderedContent = this.aboutTemplate();
        break;
      case "contact":
        renderedContent = this.contactTemplate();
        break;
      case "terms":
        renderedContent = this.termsTemplate();
        break;
      case "privacy":
        renderedContent = this.privacyTemplate();
        break;
      case "support":
        renderedContent = this.supportTemplate();
        break;
    }
    this.$el.html(this.skeleton()).find(".static-info-container").html(renderedContent);
    return this;
  }
});