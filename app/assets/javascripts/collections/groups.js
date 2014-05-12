TeamProfile.Collections.Groups = Backbone.Collection.extend({
  url: '/groups',
  model: TeamProfile.Models.Group,

  // sort based on last updated
  comparator: function(a, b) {
    a = Date.parse(a.get("updated_at"));
    b = Date.parse(b.get("updated_at"));
    return a > b ? -1
         : a < b ?  1
         :          0;

  },
});