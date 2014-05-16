TeamProfile.Models.Group = Backbone.Model.extend({
  urlRoot: '/groups',
  parse: function(response) {
    response.members = new TeamProfile.Collections.Users(response.members, {parse: true});
    return response;
  }
});