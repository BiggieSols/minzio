TeamProfile.Routers.Router = Backbone.Router.extend({
  initialize: function(options){
    this.$rootEl = options.$rootEl;
    TeamProfile.currentUser = new TeamProfile.Models.User({id: "current"});
    TeamProfile.dummyUser = new TeamProfile.Models.User({id: "dummy"});

    TeamProfile.currentUser.fetch();
    TeamProfile.dummyUser.fetch();
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
    "users/:id":"user",
    "quiz/:id":"quiz"
  },

  quiz: function(id) {
    // console.log("attempting to render quiz")

    // TODO make this a local var
    var quiz = new TeamProfile.Models.Quiz({id: id});
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

  // optimize later to pull down all friends 
  // and check if friend's info is already available
  user: function(id) {
    var that = this;
    var user = new TeamProfile.Models.User({id: id});
    user.fetch({
      success: function() {
        userView = new TeamProfile.Views.UserView({model: user});
        that._swapView(userView);
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