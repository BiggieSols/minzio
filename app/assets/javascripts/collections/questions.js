TeamProfile.Collections.Questions = Backbone.Collection.extend({
  model: TeamProfile.Models.Question,

  // parse: function(response) {
  //   console.log("parsing questions");
  //   response.models = [];
  //   response.forEach(function(q) {
  //     var tempQuestion = new TeamProfile.Models.Question();
  //     var parsedQuestion = tempQuestion.parse(q);
  //     tempQuestion.set(parsedQuestion);
  //     response.models.push(tempQuestion);
  //   });
  //   // return objResponse;
  //   return response;
  // }
});