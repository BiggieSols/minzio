TeamProfile.Views.UserView = Backbone.View.extend({
  template: JST['quiz/results'],
  template: JST['user/show'],

  initialize: function() {
    this.leftCategories =  ['Introverted', 'Intuitive', 'Feeling', 'Perceiving'];
    this.rightCategories = ['Extroverted', 'Sensing', 'Thinking', 'Judging'];
  },

  render: function() {
    var renderedContent = this.template({user: this.model});
    this.$el.html(renderedContent);
    this._buildChart();
    return this;
    // var that = this;
    // $(document).ready(function() {
    //   that._buildChart();
    //   return this;
    // });
  },

  _buildChart: function() {
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
    var result = this.model.get("mbti_test_result");
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