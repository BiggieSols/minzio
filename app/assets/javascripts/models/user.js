TeamProfile.Models.User = Backbone.Model.extend({
  urlRoot: '/users',
  parse: function(response) {
    var authoredTips;

    response.personality_type   = new TeamProfile.Models.PersonalityType(response.personality_type);
    response.custom_personality = new TeamProfile.Models.CustomPersonality(response.custom_personality, {parse: true});

    // set up editable_tip_ids as hash for O(1) access
    if(response.editable_tip_ids) {
      authoredTips = {};
      response.editable_tip_ids.forEach(function(tipId) {
        authoredTips[tipId] = true;
      });
      response.editable_tip_ids = authoredTips;
    }

    if(response.connections) {
      response.connections = new TeamProfile.Collections.Users(response.connections);
    }
    return response;
  }
});