TeamProfile.Models.Question = Backbone.Model.extend({
  parse: function(response) {
    console.log("parsing the question");
    response.answers = new TeamProfile.Collections.Answers(response.answers, {parse: true});
    return response;
  }
});