TeamProfile.Routers.Router = Backbone.Router.extend({
  initialize: function(options){
    this.bind('route', this._pageView);
    this.$rootEl = options.$rootEl;
    TeamProfile.currentUser = new TeamProfile.Models.User({id: "current"});
    TeamProfile.dummyUser   = new TeamProfile.Models.User({id: "dummy"});
    TeamProfile.groups      = new TeamProfile.Collections.Groups();

    TeamProfile.currentUser.fetch();
    // TeamProfile.dummyUser.fetch();
  },

  routes: {
    ""           : "home",
    "how"        : "how",
    "contact"    : "contact",
    "terms"      : "terms",
    "privacy"    : "privacy",
    "support"    : "support",
    "users/:id"  : "user",
    "assessment" : "quiz",
    "groups"     : "groups"
  },

  how: function() {
    if(TeamProfile.howRedirect) {
      TeamProfile.howRedirect = false;
      Backbone.history.navigate("assessment", {trigger: true});
    } else {
      var howItWorksView = new TeamProfile.Views.HowItWorksView();
      this._swapView(howItWorksView);
    }
  },

  contact: function() {
    this._staticPage("contact");
  },

  terms: function() {
    this._staticPage("terms");
  },

  privacy: function() {
    this._staticPage("privacy");
  },

  support: function() {
    this._staticPage("support");
  },

  _staticPage: function(title) {
    var staticPageView = new TeamProfile.Views.StaticPageView({pageName: title});
    this._swapView(staticPageView);
    this._changeActiveNav($('#none'));
  },

  home: function() {
    var homeView = new TeamProfile.Views.HomeView();
    this._changeActiveNav($('#none'));
    this._swapView(homeView);
  },

  groups: function() {
    var that = this;
    // var groupsView;
    // TODO: CONVERT GLOBAL VARIABLES TO LOCAL VARIABLES

    if(TeamProfile.groups.collection && TeamProfile.groups.collection.length > 0) {
      groupsView = new TeamProfile.Views.GroupsView({collection: TeamProfile.groups});
      this._swapView(groupsView);
    }

    TeamProfile.groups.fetch({
      success: function() {
        groupsView = new TeamProfile.Views.GroupsView({collection: TeamProfile.groups});
        if(TeamProfile.currentUser.get("name")) {
          that._swapView(groupsView);
          that._changeActiveNav($('#groups-nav'));
        } else {
          TeamProfile.currentUser.fetch({
            success: function() {
              console.log("current user not yet loaded");
              that._swapView(groupsView);
              that._changeActiveNav($('#groups-nav'));
            }
          });
        }
      }
    });
  },

  quiz: function() {
    if(!TeamProfile.currentUser.get("name")) {
      TeamProfile.howRedirect = true;
      window.location = "/auth/linkedin";
    } else {
      var id = 4;
      var quiz = new TeamProfile.Models.Quiz({id: id});
      var that = this;
      quiz.fetch({
        success: function() {
          // console.log("fetched the quiz");
          console.log(quiz);
          var quizView = new TeamProfile.Views.QuizView({model: quiz});
          that._swapView(quizView);

          that._changeActiveNav($('#test-nav'));

          async = TeamProfile.currentUser.get("connections") ? true : false;

          // if(TeamProfile.currentUser.get("connections")) {
          //   TeamProfile.currentUser.save({build_shadow: true, async: true}, {});
          // } else {
          console.log("async is " + async);
          TeamProfile.currentUser.save({build_shadow: true, async: async}, {});
          // }
        }
      });
    }
    // temporary
  },

  // optimize later to pull down all friends 
  // and check if friend's info is already available
  user: function(id) {
    var that = this;
    var user = new TeamProfile.Models.User({id: id});
    user.fetch({
      success: function() {
        // var userView = new TeamProfile.Views.UserView({model: user});
        userView = new TeamProfile.Views.UserView({model: user});
        that._swapView(userView);
        if(id == TeamProfile.currentUser.get("id")) {
          that._changeActiveNav($('#profile-nav'));
        } else {
          that._changeActiveNav($('#none'));
        }
      }
    });
  },

  _changeActiveNav: function($navItem) {
    console.log("changing active nav");
    $('nav .active').removeClass("active");
    $navItem.addClass("active");
  },

  // used for google analytics
  _pageView: function() {
    var path = Backbone.history.getFragment();
    ga('send', 'pageview', {page: "/" + path});
  },

  _swapView: function(view) {
    if(this.currentView) {
      this.currentView.remove();
    }
    this.currentView = view;

    this.$rootEl.html(view.render().$el);
    $('body').animate({ scrollTop: 0 }, 0);
  }
});