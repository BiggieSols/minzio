TeamProfile.Models.Quiz = Backbone.Model.extend({
  urlRoot: '/quiz',

  parse: function(response) {
    // response.questions.forEach
    console.log("parsing the quiz");
    response.questions = new TeamProfile.Collections.Questions(response.questions, {parse: true});
    return response;
  }
});