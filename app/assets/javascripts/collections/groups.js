TeamProfile.Collections.Groups = Backbone.Collection.extend({
  url: '/groups',
  model: TeamProfile.Models.Group,
  // parse: function(response) {
  //   console.log(response);
  //   return response;
  // }
});