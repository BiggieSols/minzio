window.TeamProfile = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new TeamProfile.Routers.Router({$rootEl: $('#content')});
    Backbone.history.start();
  },
  lastSelectedGroup: 40
};

$(document).ready(function(){
  // console.log("got here")
  TeamProfile.initialize();
});