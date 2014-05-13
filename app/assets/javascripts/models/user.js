TeamProfile.Models.User = Backbone.Model.extend({
  urlRoot: '/users',
  parse: function(response) {
    // if(response.personality_type) {
    response.personality_type = new TeamProfile.Models.PersonalityType(response.personality_type);
    // }

    if(response.connections) {
      response.connections = new TeamProfile.Collections.Users(response.connections);
    }
    return response;
  }
});