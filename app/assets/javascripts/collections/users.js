TeamProfile.Collections.Users = Backbone.Collection.extend({
  model: TeamProfile.Models.User,

  comparator: function(a, b) {
    a = Date.parse(a.get("updated_at"));
    b = Date.parse(b.get("updated_at"));
    return a > b ? -1
         : a < b ?  1
         :          0;

  },
});