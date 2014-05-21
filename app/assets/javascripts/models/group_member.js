TeamProfile.Models.GroupMember = Backbone.Model.extend({
  urlRoot: '/group_members',
  collection: TeamProfile.Collections.GroupMembers,

  // destroy: function (options) {
  //   options = options ? _.clone(options) : {};
  //   var model = this;
  //   var success = options.success;

  //   var destroy = function() {
  //     model.trigger('destroy', model, model.collection, options);
  //   };

    // options.success = function(resp) {
    //   if (options.wait || model.isNew()) destroy();
    //   if (success) success(model, resp, options);
      // if (!model.isNew()) model.trigger('sync', model, resp, options);
    // };

    // if (this.isNew()) {
    //   options.success();
    //   return false;
    // }
    // wrapError(this, options);

  //   var xhr = this.sync('delete', this, options);
  //   if (!options.wait) destroy();
  //   return xhr;
  // }

  // methodToUrl: {
  //   "delete":"/group_members/dummy_var",
  //   "create":"/group_members"
  // },

  // sync: function(method, model, options) {
  //   // console.log("method below")
  //   // console.log(method)
  //   // console.log("options below")
  //   // console.log(options)
  //   options = options || {};
  //   options.url = model.methodToURL[method.toLowerCase()];
  //   // fail

  //   return Backbone.sync.apply(this, arguments);
  // },
});