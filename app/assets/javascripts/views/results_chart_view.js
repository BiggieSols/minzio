TeamProfile.Views.ResultsChartView = Backbone.View.extend({
  template: JST['users/results_chart'],

  initialize: function(options) {
    this.leftCategories   =  ['Introverted', 'Intuitive', 'Feeling', 'Perceiving'];
    this.rightCategories  = ['Extraverted', 'Sensing', 'Thinking', 'Judging'];
    this.width            = options.width;
  },

  // events: {
  //   "resize .chart-view" : "render"
  // },

  render: function() {
    var renderedContent;
    renderedContent = this.template();
    this.$el.html(renderedContent).html();

    var that = this;
    $(document).ready(function() {
      setTimeout(function() {
        that._renderChart();
      }, 500);
    });

    // return this._renderChart({width: this.width});
    return this;
  },

  _formattedResults: function(options) {
    var result = this.model.get("mbti_test_result");
    var series = [];

    result.forEach(function(result) {
      var val = result[1];
      var modifiedVal = (val > 0) ? (0.5 + val * 0.1) : (-0.5 + val * 0.1);
      if(options.series === "secondary") {
        modifiedVal = (modifiedVal > 0) ? (modifiedVal - 1) : (1 + modifiedVal);
      }
      series.push(modifiedVal);
    });
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

  _renderChart: function(options) {
    var chart, that, width;
    that = this;
    options = options || {};
    // var width = options.width || this.$el.parent().width()*0.7;
    width = this.$el.parent().width();// || options.width;
    console.log("width is " + width);

    this.$el.highcharts({
      chart: {
        type: 'bar',
        // width: width
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
        color: "#34495e",
        customInfo: "here goes the info",
        data: this._formattedResults({series: "primary"}),
        showInLegend: false
      }, {
        color: "#1abc9c",
        data: this._formattedResults({series: "secondary"}),
        showInLegend: false
      }]
    });
    return this;
  },
});