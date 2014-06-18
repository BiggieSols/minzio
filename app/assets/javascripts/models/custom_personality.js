TeamProfile.Models.CustomPersonality = Backbone.Model.extend({
  parse: function(response) {
    console.log("parsing custom personality!");
    // if(response.personality_type) {
    response.as_manager   = new TeamProfile.Collections.Tips(response.as_manager);
    response.colleague    = new TeamProfile.Collections.Tips(response.colleague);
    response.as_employee  = new TeamProfile.Collections.Tips(response.as_employee);
    // }
    return response;
  }
});