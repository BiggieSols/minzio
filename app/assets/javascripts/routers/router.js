TeamProfile.Routers.Router = Backbone.Router.extend({
  initialize: function(options){
    this.$rootEl = options.$rootEl;
    TeamProfile.currentUser = new TeamProfile.Models.User({id: "current"});
    TeamProfile.dummyUser   = new TeamProfile.Models.User({id: "dummy"});
    TeamProfile.groups      = new TeamProfile.Collections.Groups();

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
    "quiz/:id":"quiz",
    "groups":"groups"
  },

  groups: function() {
    var that = this;
    // TODO: CONVERT GLOBAL VARIABLES TO LOCAL VARIABLES
    TeamProfile.groups.fetch({
      success: function() {
        groupsView = new TeamProfile.Views.GroupsView({collection: TeamProfile.groups});
        that._swapView(groupsView);
      }
    });
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
        TeamProfile.currentUser.save({build_shadow: true}, {
          success: function() {
            console.log("pulled down shadow accts!");
          }
        });
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
        var userView = new TeamProfile.Views.UserView({model: user});
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