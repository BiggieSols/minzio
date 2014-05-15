TeamProfile.Views.GroupListItemView = Backbone.View.extend({
  template: JST['groups/list_item'],
  editGroupTemplate: JST['groups/edit'],

  events: {
    "click .edit-button":"renderEditForm",
    "submit .edit-group-form":"updateGroup",
    "click .submit-button":"submitForm"
  },

  // initialize: function() {
  //   this.listenTo(this.model, "sync", this.render);
  // },

  // yeah this is super kludgy. 
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
    console.log("model is below");
    console.log(this.model);

    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});