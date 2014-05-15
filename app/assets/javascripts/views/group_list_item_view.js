TeamProfile.Views.GroupListItemView = Backbone.View.extend({
  template: JST['groups/list_item'],
  editGroupTemplate: JST['groups/edit'],

  events: {
    "click .edit-button":"editGroup",
    "submit .edit-group-form":"updateGroup",
    "click .submit-button":"submitForm"
  },

  // yeah this is super kludgy. 
  submitForm: function(event) {
    event.preventDefault();
    this.$('.edit-group-form').submit();
  },

  updateGroup: function(event) {
    console.log("updating the group");
    event.preventDefault();
  },

  editGroup: function(event) {
    // event.preventDefault();
    // console.log("attempting to edit group");
    // var $groupNode = $(event.currentTarget).closest('.group');
    // console.log("group node is below");
    // console.log($groupNode);

    // $groupNode.addClass("editing");
    // $groupNode.removeClass("active");

    var renderedContent = this.editGroupTemplate({group: this.model});
    this.$el.html(renderedContent);
    // $groupNode.html(renderedContent);
    this.$('.change-group-name').focus();
    // $groupNode.html
  },

  render: function() {
    console.log("model is below");
    console.log(this.model);

    var renderedContent = this.template({group: this.model});
    this.$el.html(renderedContent);
    return this;
  }
});