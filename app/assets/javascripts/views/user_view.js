TeamProfile.Views.UserView = Backbone.View.extend({
  template: JST['quiz/results'],
  template: JST['user/show'],

  initialize: function() {
    this.leftCategories =  ['Introverted', 'Intuitive', 'Feeling', 'Perceiving'];
    this.rightCategories = ['Extroverted', 'Sensing', 'Thinking', 'Judging'];

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

  events: {
    "click .switch":"changeCategory"
  },

  changeCategory: function(event) {
    var clickedItem = $(event.currentTarget);
    if(!clickedItem.hasClass("active")) {
      var newCategory = clickedItem.data("category");
      this.$('.working-with-personality .active').removeClass("active");
      clickedItem.addClass("active");
      this.traitsTableView.traitsCategory = newCategory;
      this.traitsTableView.render();
    }
  },

  render: function() {
    if(this.userResultsInfo.get("name")) {
      return this._renderCallback();
    } else {
      this.userResultsInfo.fetch({
        success: function() {
          console.log("fetched dummy user data!");
          return this.renderCallback();
        }
      });
    }
  },

  _renderCallback: function() {
    var renderedContent = this.template({
      user: this.model,
      userResultsInfo: this.userResultsInfo
    });
    this.$el.html(renderedContent);
    this._renderTraitsTable()
        ._renderChart();
        // ._renderDisabledDivs();

    // ok this is a really stupid solution. see if there's a better way to handle this, eventually
    var that = this;
    setTimeout(function() {that._renderDisabledDivs()}, 1000);
    return this;
  },

  _renderDisabledDivs: function() {
    if(this.dummyData === true) {
      console.log(this.$('#results-chart'));
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

  _renderTraitsTable: function() {
    this.$('.traits-table').html(this.traitsTableView.render().$el);
    return this;
  },

  _renderChart: function() {
    var chart, that;
    that = this;

    this.$('#results-chart').highcharts({
      chart: {
        type: 'bar',
        width: 400
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
          return "<b>" + Highcharts.numberFormat(Math.abs(this.point.y)*100, 0) + "% " + that.pointCategory(this.point) + "</b>";
          // return "<b>" + this.point.series.customInfo + "</b>"
        }
      },

      series: [{
        color: "#0066FF",
        customInfo: "here goes the info",
        data: this._formattedResults({series: "primary"}),//[-0.2, 0.4, -0.8, 1.0],
        showInLegend: false
      }, {
        // data: [-0.2, -0.3, -0.4, -0.25],
        data: this._formattedResults({series: "secondary"}),
        showInLegend: false
      }]
    });
    return this;
  },

  pointCategory: function(point) {
    if(point.y < 0) {
      return point.category;
    } else {
      var idx = this.leftCategories.indexOf(point.category);
      return this.rightCategories[idx];
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
  }
});