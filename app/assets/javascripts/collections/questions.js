TeamProfile.Collections.Questions = Backbone.Model.extend({
  model: TeamProfile.Models.Question,

  parse: function(response) {
    console.log("parsing questions");
    console.log(response);
    objResponse = [];
    response.forEach(function(q) {
      var tempQuestion = new TeamProfile.Models.Question();
      var parsedQuestion = tempQuestion.parse(q);
      tempQuestion.set(parsedQuestion);
      objResponse.push(tempQuestion);
    });
    return objResponse;
  }
});