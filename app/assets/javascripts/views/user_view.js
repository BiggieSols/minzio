TeamProfile.Views.UserView = Backbone.View.extend({
  template: JST['users/show'],

  events: {
    "click .switch":"_changeCategory",
  },

  initialize: function() {
    this.leftCategories =  ['Introverted', 'Intuitive', 'Feeling', 'Perceiving'];
    this.rightCategories = ['Extraverted', 'Sensing', 'Thinking', 'Judging'];

    // check to see if personality test is complete
    if(this.model.get("personality_type").get("title")) {
      this.userResultsInfo = this.model;
      this.dummyData = false;
    } else {
      this.userResultsInfo = TeamProfile.dummyUser;
      this.dummyData = true;
    }

    this.traitsTableView = new TeamProfile.Views.TraitsTableView({
      model: this.userResultsInfo,
      traitsCategory: "colleague"
    });
  },


  remove: function() {
    if(this.disabledDivTimeout) clearTimeout(this.disabledDivTimeout);
    if(this.groupPromptTimeout) clearTimeout(this.groupPromptTimeout);
    return Backbone.View.prototype.remove.call(this);
  },

  render: function() {
    if(this.userResultsInfo.get("name")) {
      return this._renderCallback();
    } else {
      this.userResultsInfo.fetch({
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
      this.traitsTableView.traitsCategory = newCategory;
      this.traitsTableView.render();
    }
  },

  _formattedResults: function(options) {
    var result = this.userResultsInfo.get("mbti_test_result");
    var series = [];
    for(var key in result){
      var val = result[key];
      var modifiedVal = (val > 0) ? (0.5 + val * 0.1) : (-0.5 + val * 0.1);
      if(options.series === "secondary") {
        modifiedVal = (modifiedVal > 0) ? (modifiedVal - 1) : (1 + modifiedVal);
      }
      series.push(modifiedVal);
    }
    return series;
  },

  _pointCategory: function(point) {
    if(point.y < 0) {
      return point.category;
    } else {
      var idx = this.leftCategories.indexOf(point.category);
      return this.rightCategories[idx];
    }
  },

  _renderCallback: function() {
    var renderedContent = this.template({
      user: this.model,
      userResultsInfo: this.userResultsInfo
    });
    this.$el.html(renderedContent);
    this._renderTraitsTable();
    var that = this;

    $(document).ready(function() {
      setTimeout(function() {
        that._renderChart();
      }, 500);
    });
        // ._renderDisabledDivs();

    // ok this is a really stupid solution. see if there's a better way to handle this, eventually
    this.disabledDivTimeout = setTimeout(function() {that._renderDisabledDivs();}, 1000);
    this.groupPromptTimeout = setTimeout(function() {that._renderGroupPopover();}, 8000);
    
    return this;
  },

  _renderChart: function(options) {
    var chart, that;
    that = this;
    options = options || {};
    var width = options.width || $('#results-chart').width()*0.7;

    this.$('#results-chart').highcharts({
      chart: {
        type: 'bar',
        width: options.width
      },
      title: {
        text: ''//Personality Profile Breakdown'
      },
      // subtitle: {
      //   text: 'sub-title goes here'
      // },
      xAxis: [{
        categories: this.leftCategories,
        reversed: true,
        labels: {
          step: 1
        }
        }, { // mirror axis on right side
          opposite: true,
          reversed: true,
          categories: this.rightCategories,
          linkedTo: 0,
          labels: {
            step: 1
          }
        }],
        yAxis: {
          title: {
            text: null
          },
          labels: {
            formatter: function(){
              return Math.abs(this.value)*100 + '%';
            }
          },
          min: -1,
          max: 1
        },

      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },

      tooltip: {
        formatter: function(){
          return "<b>" + Highcharts.numberFormat(Math.abs(this.point.y)*100, 0) + "% " + that._pointCategory(this.point) + "</b>";
          // return "<b>" + this.point.series.customInfo + "</b>"
        }
      },

      series: [{
        color: "#1abc9c",
        customInfo: "here goes the info",
        data: this._formattedResults({series: "primary"}),
        showInLegend: false
      }, {
        color: "#34495e",
        data: this._formattedResults({series: "secondary"}),
        showInLegend: false
      }]
    });
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
    if($.cookie("newUser") == 1) {
      $.cookie("newUser", 0);
      var title = "set up your groups!";
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
    }
    return this;
  },

  _renderTraitsTable: function() {
    this.$('.traits-table').html(this.traitsTableView.render().$el);
    return this;
  },
});