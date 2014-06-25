TeamProfile.Views.InactiveUserView = TeamProfile.Views.UserView.extend({
  template: JST['users/show_inactive'],

  _renderCallback: function() {
    var renderedContent, template;


    renderedContent = this.template({
      user: this.model,
    });

    this.$el.html(renderedContent);

    this._renderBasicInfo()
        ._renderTipsTable();

    // load social plugin for facebook. CURRENTLY NOT WORKING
    // $(window.fbAsyncInit());
        
    return this;
  },
});