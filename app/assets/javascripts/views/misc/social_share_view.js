TeamProfile.Views.SocialShareView = Backbone.View.extend({
  template: JST["misc/social_share"],

  initialize: function(options) {
    this.user   = options.user;
    this.group  = options.group;
  },

  render: function() {
    var renderedContent = this.template({
      user            : this.user,
      group           : this.group,
      urlEscaped      : this._referral_url_escaped(),
      personalityType : TeamProfile.currentUser.get("personality_type")
    });
    this.$el.html(renderedContent);
    return this;
  },

  _referral_url: function() {
    var user_hash_str   = this.user   ? "u="  + this.user.get("referral_hash") : "";
    var group_hash_str  = this.group  ? "&g=" + this.gruop.get("referral_hash"): "";
    var base_url        = "http://www.minzio.com?";

    var referralUrl     = base_url + user_hash_str + group_hash_str;
    return referralUrl;
  },

  _referral_url_escaped: function() {
    var referralUrlEscaped = this._referral_url().replace("&", "%26");
    return referralUrlEscaped;
  }
});