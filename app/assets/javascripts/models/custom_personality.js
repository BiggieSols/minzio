TeamProfile.Models.CustomPersonality = Backbone.Model.extend({
  parse: function(response) {
    // if(response.personality_type) {
    response.as_manager   = new TeamProfile.Collections.Tips(response.as_manager,   { parse: true });
    response.as_colleague = new TeamProfile.Collections.Tips(response.as_colleague, { parse: true });
    response.as_employee  = new TeamProfile.Collections.Tips(response.as_employee,  { parse: true });
    // }
    return response;
  }
});