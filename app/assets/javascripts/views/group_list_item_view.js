TeamProfile.Views.GroupListItemView = Backbone.View.extend({
  template: JST['groups/list_item'],
  editGroupTemplate: JST['groups/edit'],

  events: {
    "click .edit-button":"renderEditForm",
    "submit .edit-group-form":"updateGroup",
    "click .submit-button":"submitForm",
    "click .modify-group-button":"showDropdown",
    "keydown .change-group-name":"testEscape"
  },

  showDropdown: function() {
    console.log("rendering dropdown");
    console.log(this.$('.dropdown'));
    this.$('.dropdown').addClass("open");
  },

  testEscape: function(e) {
    if(e.keyCode == 27) {
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
      }
    });
  },

  renderEditForm: function(event) {
    var renderedContent = this.editGroupTemplate({group: this.model});
    this.$el.html(renderedContent);
    this.$('.change-group-name').focus();
    return this;
  },

  render: function() {
    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});