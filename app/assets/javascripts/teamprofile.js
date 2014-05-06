window.TeamProfile = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    console.log("got here")
    new TeamProfile.Routers.Router({$rootEl: $('#content')});
    Backbone.history.start();
  }
};

$(document).ready(function(){
  // console.log("got here")
  TeamProfile.initialize();
});