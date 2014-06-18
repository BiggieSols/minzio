TeamProfile.Models.User = Backbone.Model.extend({
  urlRoot: '/users',
  parse: function(response) {
    // if(response.personality_type) {
    response.personality_type   = new TeamProfile.Models.PersonalityType(response.personality_type);
    response.custom_personality = new TeamProfile.Models.CustomPersonality(response.custom_personality, {parse: true});
    // }

    if(response.connections) {
      response.connections = new TeamProfile.Collections.Users(response.connections);
    }
    return response;
  }
});