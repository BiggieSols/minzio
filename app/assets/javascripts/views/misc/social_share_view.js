TeamProfile.Views.SocialShareView = Backbone.View.extend({
  template: JST["misc/social_share"],

  initialize: function(options) {
    this.user   = options.user;
    this.group  = options.group;
  },

  render: function() {
    var title, summary;
    title = this.user.get("name") + " is " + this._parsePersonality() + ". See your personality.";
    summary = "Minzio's proprietary technology gives you personalized tips to work better with your colleagues.";

    var referralUrl        = "http://www.minzio.com?u=" + TeamProfile.currentUser.get("referral_hash");
    var referralUrlEscaped = referralUrl.replace("&", "%26");

    var renderedContent = this.template({
      user            : this.user,
      group           : this.group,
      urlEscaped      : this._referral_url_escaped(),
      personalityType : TeamProfile.currentUser.get("personality_type"),
      title           : title,
      summary         : summary,
      url             : referralUrl,
    });
    this.$el.html(renderedContent);
    setTimeout(this._renderButtons, 0.5);

    // trigger button rendering
    // stButtons.locateElements();

    return this;//._renderButtons();
  },

  _renderButtons: function() {
    // console.log("st buttons below");
    // console.log(window.stButtons.locateElements);
    $(document).ready(function() {
      stButtons.locateElements();
    });
    return this;
  },

  _parsePersonality: function() {
    var title_hash, personalityType, long_personality;
    long_personality = [];
    title_hash = {
      "I": "introverted",
      "E": "extroverted",
      "S": "sensing",
      "N": "intuitive",
      "T": "thinking",
      "F": "feeling",
      "J": "and judging",
      "P": "and perceiving"
    };
    personalityType = this.user.get("personality_type")
                               .get("title")
                               .split("");

    // only show 3 characteristics for space reasons
    // personalityType = _.without(personalityType, "S", "N")

    personalityType.forEach(function(char) {
      long_personality.push(title_hash[char]);
    });
    return long_personality.join(", ");
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