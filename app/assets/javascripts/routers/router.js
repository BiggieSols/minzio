TeamProfile.Routers.Router = Backbone.Router.extend({
  initialize: function(options){
    this.$rootEl = options.$rootEl;
    // TeamProfile.currentUser = new GiftMe.Models.User({id: "current"});

    // GiftMe.currentUser.fetch();
    // GiftMe.users.fetch({
    //   success: function() {
    //     GiftMe.loadNav();
    //   }
    // });
  },

  routes: {
    // "users/:id/recommended": "recommended_items",
    // "users/:id": "user",
    // "items/:id": "item",
    // "items": "all_items",
    // "friends":"friends",
    // "onboard":"onboard"
    "quiz/:id":"quiz"
  },

  quiz: function(id) {
    // console.log("attempting to render quiz")

    // TODO make this a local var
    quiz = new TeamProfile.Models.Quiz({id: id});
    var that = this;

    quiz.fetch({
      success: function() {
        // console.log("fetched the quiz");
        console.log(quiz);
        var quizView = new TeamProfile.Views.QuizView({model: quiz});
        that._swapView(quizView);
      }
    });
  },

  _swapView: function(view) {
    if(this.currentView) {
      this.currentView.remove();
    }
    this.currentView = view;

    this.$rootEl.html(view.render().$el);
    // $('body').animate({ scrollTop: 0 }, 0);
  }
});