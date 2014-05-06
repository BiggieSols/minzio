TeamProfile.Collections.Answers = Backbone.Collection.extend({
  model: TeamProfile.Models.Answer,

  parse: function(response) {
    console.log("parsing answers");
    console.log(response);
    objResponse = [];
    response.forEach(function(q) {
      var tempAnswer = new TeamProfile.Models.Answer();
      var parsedAnswer = tempAnswer.parse(q);
      tempAnswer.set(parsedAnswer);
      objResponse.push(tempAnswer);
    });
    return objResponse;
  }
});