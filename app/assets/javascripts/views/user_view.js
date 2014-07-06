TeamProfile.Views.UserView = Backbone.View.extend({
  template:               JST['users/show'],

  initialize: function() {
    this.basicInfoView        = new Backbone.View();
    this.chartView            = new Backbone.View();
    this.personalityTypeView  = new Backbone.View();
    this.socialShareView      = new Backbone.View();
    this.tipsTableView        = new Backbone.View();
    this.userGroupsView       = new Backbone.View();
    TeamProfile.currentUser.fetch();
  },

  remove: function() {
    if(this.disabledDivTimeout) clearTimeout(this.disabledDivTimeout);
    if(this.groupPromptTimeout) clearTimeout(this.groupPromptTimeout);

    this.basicInfoView.remove();
    this.chartView.remove();
    this.personalityTypeView.remove();
    this.tipsTableView.remove();
    this.socialShareView.remove();

    return Backbone.View.prototype.remove.call(this);
  },

  render: function() {
    if(this.model.get("name")) {
      return this._renderCallback();
    } else {
      this.model.fetch({
        success: function() {
          return this._renderCallback();
        }
      });
    }
  },

  _renderCallback: function() {
    var renderedContent, template;


    renderedContent = this.template({
      user: this.model,
    });

    this.$el.html(renderedContent);

    this._renderBasicInfo()
        ._renderTipsTable()
        ._renderChartView()
        ._renderPersonalityTypeView()
        ._renderUserGroups()
        ._renderSocialShare()
        ._renderIntro();

    // load social plugin for facebook. CURRENTLY NOT WORKING
    // $(window.fbAsyncInit());
        
    return this;
  },

  _renderBasicInfo: function() {
    this.basicInfoView = new TeamProfile.Views.UserBasicInfoView({model: this.model});
    this.$('.user-basic-info').html(this.basicInfoView.render().$el);
    return this;
  },

  _renderChartView: function() {
    this.chartView = new TeamProfile.Views.ResultsChartView({model: this.model});
    this.$('.user-results-chart').html(this.chartView.render().$el);
    return this;
  },

  _renderGroupPopover: function() {
    var that = this;
    // if($.cookie("newUser") == 1) {
      // var title = "set up your groups!";
      var title = '<span class="popover-title">Set up your groups!</span>' + '<button type="button" class="close custom-close" data-dismiss="popover">&times;</button>';
      var content = "When you're ready, compare results with your co-workers on the <b>Groups</b> tab";
      var $container = $('#groups-nav');
      $container.data("container", "body")
                .data("placement", "bottom")
                .data("trigger", "manual")
                .data("content", content)
                .data("title", title)
                .data("html", true)
                .popover('show');

      // fix popover position
      $('.popover').addClass("popover-fixed");
      $container.popover("show");

      // remove the popover on click.
      $('.popover, #groups-nav').on("click", function(e) {
        $('.popover').remove();
      });
    // }
    return this;
  },

  _renderIntro: function() {
    var that = this;

    if($.cookie("newUser") === "1" || $.cookie("newUser") === "null") {
      $.cookie("newUser", 0);
      setTimeout(function() {
        introJs().setOptions({
          'skipLabel':'Exit',
          'scrollToElement': true
        }).start();
        that._renderGroupPopover();

        return this;
      }, 1000);
    }
  },

  _renderPersonalityTypeView: function() {
    this.personalityTypeView = new TeamProfile.Views.PersonalityTypeView({model: this.model});
    this.$('.user-personality-type').html(this.personalityTypeView.render().$el);
    return this;
  },

  _renderSocialShare: function() {
    if(TeamProfile.currentUser.id == this.model.id) {
      this.socialShareView = new TeamProfile.Views.SocialShareView({
        user: this.model
      });
      var renderedContent = this.socialShareView.render().$el;
      this.$('#social-share').html(renderedContent);
    }
    return this;
  },

  _renderTipsTable: function() {
    this.tipsTableView = new TeamProfile.Views.TipsTableView({
      model: this.model,
      tipsCategory: "colleague"
    });

    this.$('.working-with-personality').html(this.tipsTableView.render().$el);
    return this;
  },

  _renderUserGroups: function() {
    this.userGroupsView = new TeamProfile.Views.UserGroupsView({model: this.model});
    this.$('.user-groups').html(this.userGroupsView.render().$el);
    return this;
  },
});