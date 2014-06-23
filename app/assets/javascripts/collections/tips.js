TeamProfile.Collections.Tips = Backbone.Collection.extend({
  model: TeamProfile.Models.Tip,

  comparator: function(a, b) {
    a = a.get("score");
    b = b.get("score");
    return a > b ? -1
         : a < b ?  1
         :          0;

  },
});