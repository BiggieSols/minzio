TeamProfile.Views.UserView = Backbone.View.extend({
  template: JST['users/show'],

  events: {
    "click .switch":"_changeCategory",
  },

  initialize: function() {
    this.chartView = null;
    this.leftCategories =  ['Introverted', 'Intuitive', 'Feeling', 'Perceiving'];
    this.rightCategories = ['Extraverted', 'Sensing', 'Thinking', 'Judging'];

    // check to see if personality test is complete
    if(this.model.get("personality_type").get("title")) {
      this.testComplete = false;
    } else {
      this.userResultsInfo = TeamProfile.dummyUser;
      this.testComplete = true;
    }

    this.tipsTableView = new TeamProfile.Views.TipsTableView({
      model: this.model,
      tipsCategory: "colleague"
    });

  },


  remove: function() {
    if(this.disabledDivTimeout) clearTimeout(this.disabledDivTimeout);
    if(this.groupPromptTimeout) clearTimeout(this.groupPromptTimeout);
    this.tipsTableView.remove();
    this.chartView.remove();
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

  _changeCategory: function(event) {
    var clickedItem = $(event.currentTarget);
    if(!clickedItem.hasClass("active")) {
      var newCategory = clickedItem.data("category");
      this.$('.working-with-personality .active').removeClass("active");
      clickedItem.addClass("active");
      this.tipsTableView.tipsCategory = newCategory;
      this.tipsTableView.render();
    }
  },

  _renderCallback: function() {
    var renderedContent;

    renderedContent = this.template({
      user: this.model,
    });
    this.$el.html(renderedContent);
    this._renderTipsTable();
    this._renderSocialShare();
    this._renderIntro();
    this._renderChartView();

    // load social plugin for facebook. CURRENTLY NOT WORKING
    // $(window.fbAsyncInit());
    


    // ok this is a really stupid solution. see if there's a better way to handle this, eventually
    var that = this;
    this.disabledDivTimeout = setTimeout(function() {that._renderDisabledDivs();}, 1000);
    // this.groupPromptTimeout = setTimeout(function() {that._renderGroupPopover();}, 8000);
    
    return this;
  },

  _renderChartView: function() {
    this.chartView = new TeamProfile.Views.ResultsChartView({model: this.model});
    this.$('#results-chart').html(this.chartView.render().$el);
    return this;
  },

  _renderDisabledDivs: function() {
    if(this.dummyData === true) {
      this.$('#results-chart').prepend("<div class='disabled'></div>");
      this.$('.personality-column').prepend("<div class='disabled'><div class='no-info'>Sorry, " + this.model.get("name") + " hasn't completed the personality profile!</div></div>");
      this.$('.disabled').each(function(idx, val) {
        $(val).animate({
          width: $(val).parent().width(),
          height: $(val).parent().height()
        }, 500);
      });
    }
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

  _renderSocialShare: function() {
    if(TeamProfile.currentUser.id == this.model.id) {
      var socialShareView = new TeamProfile.Views.SocialShareView({
        user: this.model
      });
      var renderedContent = socialShareView.render().$el;
      this.$('#social-share').html(renderedContent);
    }
    return this;
  },

  _renderTipsTable: function() {
    this.$('.tips-table').html(this.tipsTableView.render().$el);
    return this;
  },
});