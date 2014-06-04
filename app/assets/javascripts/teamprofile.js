window.TeamProfile = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new TeamProfile.Routers.Router({$rootEl: $('#content')});
    Backbone.history.start();
  },
  lastSelectedGroup: null
};

$(document).ready(function(){
  TeamProfile.initialize();
});

// dev only!
window.resetCookies = function() {
  $.cookie("newUser", null);
  $.cookie("groupsPopoverShown", null);
  TeamProfile.currentUser.set("num_sent_invitations", 0);
};