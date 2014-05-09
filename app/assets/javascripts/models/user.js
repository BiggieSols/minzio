TeamProfile.Models.User = Backbone.Model.extend({
  urlRoot: '/users',
  parse: function(response) {
    response.personality_type = new TeamProfile.Models.PersonalityType(response.personality_type);
    return response;
  }
});