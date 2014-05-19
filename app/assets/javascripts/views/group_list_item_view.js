TeamProfile.Views.GroupListItemView = Backbone.View.extend({
  template: JST['groups/list_item'],
  editGroupTemplate: JST['groups/edit'],

  events: {
    "click .edit-button":"renderEditForm",
    "submit .edit-group-form":"updateGroup",
    "click .submit-button":"submitForm",
    "keydown .change-group-name":"testEscape"
  },

  testEscape: function(e) {
    if(e.keyCode == 27) {
      console.log("pressed escape");
      this.$('.dropdown').removeClass("open");
      this.render();
    }
  },

  // yeah this is super kludgy. result of bootstrap styling issues - I don't want to talk about it.
  submitForm: function(event) {
    event.preventDefault();
    this.$('.edit-group-form').submit();
  },

  updateGroup: function(event) {
    event.preventDefault();
    var newName = this.$('.change-group-name').val();
    var that = this;
    this.model.save({name: newName}, {
      success: function() {
        that.render().$('.group').click();
        // that.$('.group').addClass("active");
      }
    });
  },

  renderEditForm: function(event) {
    var renderedContent = this.editGroupTemplate({group: this.model});
    this.$el.html(renderedContent);
    this.$('.group').addClass("active");
    this.$('.change-group-name').focus();
    return this;
  },

  render: function() {
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});