<template>
  <highcharts ref="highcharts" :constructor-type="'stockChart'" :options="chartOptions"></highcharts>
</template>

<script>
let date = new Date();
date.setDate(date.getDate() - 1826);
let fiveYearsAgo = date.toLocaleDateString("fr-CA").split('-');
let y = parseInt(fiveYearsAgo[0])
let m = parseInt(fiveYearsAgo[1]) - 1
let d = parseInt(fiveYearsAgo[2])
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    chartColour: {
      type: String
    }
  },
  data() {
    return {
      chartOptions: {
        series: [{
          name: 'Price',
          type: 'area',
          data: this.data,
          color: '#fff',
          pointStart: Date.UTC(y, m, d),
          // pointStart: Date.UTC(2021, 1, 5), // jan is 0 not 1
          // pointInterval: 86400000 // one day
          pointInterval: 6.048e+8 // one week
        }],
        chart: {
          backgroundColor: '#fff',
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: this.chartColour === 'up' ? [[0, '#3ed7ab' ], [1, '#3ed7ab' ]] : [[0, '#ff0271' ], [1, '#DC0D56' ]]
                },
            }
        },
        yAxis: {
            gridLineWidth: 0
        },
        xAxis: {
            type: 'datetime',
        },
        rangeSelector : {
            allButtonsEnabled: true,
            selected: 1,
            inputEnabled: true,
            buttonPosition: {
                x: 10,
                y: 5
            },
            // buttons: [{
            //     type: 'month',
            //     count: 3,
            //     text: 'Day',
            //     dataGrouping: {
            //         forced: true,
            //         units: [['day', [1]]]
            //     }
            // }, {
            //     type: 'year',
            //     count: 1,
            //     text: 'Week',
            //     dataGrouping: {
            //         forced: true,
            //         units: [['week', [1]]]
            //     }
            // }, {
            //     type: 'all',
            //     text: 'Month',
            //     dataGrouping: {
            //         forced: true,
            //         units: [['month', [1]]]
            //     }
            // }],
            buttons: [
            //   {
            //     type: 'hour',
            //     count: 1,
            //     text: '1 hr',
            //     title: 'View 1 hour'
            // },{
            //     type: 'hour',
            //     count: 4,
            //     text: '4 hrs',
            //     title: 'View 4 hours'
            // },{
            //     type: 'day',
            //     count: 1,
            //     text: '1 day',
            //     title: 'View 1 day'
            // },
            {
                type: 'week',
                count: 1,
                text: '1w',
                title: 'View 1 week',
                dataGrouping: {
                    forced: true,
                    units: [['week', [1]]]
                },
                events: {
                    click: function() {
                        // console.log('Clicked button');
                        // we could use this function to switch data series between 1 hour / 1 day / 1 week and also emit event bus action to fetch different data from finage
                    }
                }
            },{
                type: 'month',
                count: 1,
                text: '1m',
                title: 'View 1 month'
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: 'View 6 months'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }],
            buttonTheme: {
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                r: 6,
                style: {
                    color: '#0899ae',
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                    },
                    select: {
                        fill: '#0899ae',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
        },
        navigator: {
            // enabled: false,
            height: 30,
            handles: {
                backgroundColor: '#fff',
                borderColor: '#aaa'
            },
            maskFill: 'rgba(220,220,220,0.4)'
        },
        credits: {
          enabled: false
        },
        scrollbar: {
          // enabled: false
        },
      }
    };
  },
  mounted(){
    this.$nextTick(() => {
      this.$refs.highcharts.chart.reflow();
    });
    // console.log(this.chartColour)
  }
};
</script>
