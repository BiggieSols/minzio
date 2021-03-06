TeamProfile.Routers.Router = Backbone.Router.extend({
  initialize: function(options){
    this.bind('route', this._pageView);
    this.$rootEl = options.$rootEl;
    TeamProfile.currentUser = new TeamProfile.Models.User({id: "current"});
    // TeamProfile.dummyUser   = new TeamProfile.Models.User({id: "dummy"});
    TeamProfile.groups      = new TeamProfile.Collections.Groups();

    TeamProfile.currentUser.fetch({
      success: function() {
        topNavSearchView = new TeamProfile.Views.TopNavUserSearchView({model: TeamProfile.currentUser});
        $('#user-search-nav').html(topNavSearchView.render().$el);
      }
    });
    // TeamProfile.dummyUser.fetch();
  },

  routes: {
    // ""           : "home",
    "how"        : "how",
    "contact"    : "contact",
    "terms"      : "terms",
    "privacy"    : "privacy",
    "support"    : "support",
    "users/:id"  : "user",
    "assessment" : "quiz",
    "groups/:id" : "group",
    "groups"     : "groups",
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
    var that = this;
    var homeView = new TeamProfile.Views.HomeView();

    if($.cookie("newUser")) {
      TeamProfile.currentUser.fetch({
        success: function() {
          console.log("got here");
          var personalityType = TeamProfile.currentUser.get("personality_type_id");
          if(personalityType) {
            Backbone.history.navigate("groups", {trigger: true});
          } else {
            that._loadHome(homeView);
            // that._changeActiveNav($('#none'));
            // that._swapView(homeView);
          }
        },
        // eventually move to a separate function
        error: function() {
          that._loadHome(homeView);
        }
      });
    } else {
      this._loadHome(homeView);
    }
  },

  _loadHome: function(homeView) {
    this._changeActiveNav($('#none'));
    // this._swapView(homeView);
  },

  group: function(id) {
    var group, singleGroupView, that;
    that = this;
    group = TeamProfile.groups.get(id) || new TeamProfile.Models.Group({id: id});
    group.fetch({
      success: function() {
        singleGroupView = new TeamProfile.Views.SingleGroupView({model: group});
        that._swapView(singleGroupView);
        that._changeActiveNav($('#none'));
      }
    });
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
              that._swapView(groupsView);
              that._changeActiveNav($('#groups-nav'));
            },
          });
        }
      },
      error: function() {
          ;
      }
    });
  },

  quiz: function() {
    var that, id, quiz;
    that = this;
    this._requireLogin(function() {
      id = 4;
      quiz = new TeamProfile.Models.Quiz({id: id});
      quiz.fetch({
        success: function() {
          // // console.log("fetched the quiz");
          // // console.log(quiz);
          var quizView = new TeamProfile.Views.QuizView({model: quiz});
          that._swapView(quizView);

          that._changeActiveNav($('#test-nav'));

          async = TeamProfile.currentUser.get("connections") ? true : false;

          // console.log("async is " + async);
          TeamProfile.currentUser.save({build_shadow: true, async: async}, {});
          // }
        }
      });
    });
    // temporary
  },

  // optimize later to pull down all friends 
  // and check if friend's info is already available
  user: function(id) {
    var that, user, testComplete;
    that = this;
    user = new TeamProfile.Models.User({id: id});
    user.fetch({
      success: function() {
        // var userView = new TeamProfile.Views.UserView({model: user});
        testComplete = !!user.get("personality_type_id");
        if(testComplete) {
          userView = new TeamProfile.Views.UserView({model: user});
        } else {
          userView = new TeamProfile.Views.InactiveUserView({model: user});
        }
        
        that._swapView(userView);
        if(id == TeamProfile.currentUser.get("id")) {
          that._changeActiveNav($('#profile-nav'));
        } else {
          that._changeActiveNav($('#none'));
        }
      },

      error: function() {
        Backbone.history.navigate("", {trigger: true});
      }
    });
  },

  _changeActiveNav: function($navItem) {
    // console.log("changing active nav");
    $('nav .active').removeClass("active");
    $navItem.addClass("active");
  },

  // used for google analytics
  _pageView: function() {
    var path = Backbone.history.getFragment();
    ga('send', 'pageview', {page: "/" + path});
  },

  _requireLogin: function(callback) {
    if(!TeamProfile.currentUser.get("name")) {
      TeamProfile.currentUser.fetch({
        success: function() {
          callback();
        },

        error: function() {
          window.location = "/auth/linkedin";
        }
      });
    } else {
      callback();
    }
  },

  _swapView: function(view) {
    console.log(Backbone.history.getHash());
    var hash = Backbone.history.getHash();
    window.history.pushState({}, "", "/");//) + Backbone.history.getHash());
    window.history.pushState({}, "", hash);//) + Backbone.history.getHash());

    if($('.collapse').css("display") === "block" && $('.navbar-toggle').css("display") === "block") {
      $('.collapse').collapse("hide");
    }

    if(this.currentView) {

      this.currentView.remove();
    }
    this.currentView = view;

    this.$rootEl.html(view.render().$el);
    $('body').animate({ scrollTop: 0 }, 0);
  }
});