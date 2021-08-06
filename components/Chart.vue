<template>
  <highcharts ref="highcharts" :constructor-type="'stockChart'" :options="chartOptions" :callback="callbackHandle"></highcharts>
</template>

<script>
let date = new Date();
date.setDate(date.getDate() - 1826);
let fiveYearsAgo = date.toLocaleDateString("fr-CA").split('-');
let y = parseInt(fiveYearsAgo[0])
let m = parseInt(fiveYearsAgo[1]) - 1
let d = parseInt(fiveYearsAgo[2]);
let hchart=null;

var cChart=null;
let liveData=[];
let grouping='day';
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    chartColour: {
      type: String
    },
    new: {
       type: Object,
      default: () => {}
    },
    c_symbol: {
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
          //pointStart: Date.UTC(y, m, d),
          // pointStart: Date.UTC(2021, 1, 5), // jan is 0 not 1
          //pointInterval: 86400000 // one day
          //pointInterval: 6.048e+8 // one week
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
            events: {
                afterSetExtremes: this.handleSetExtremes.bind(this)
            }
        },
        rangeSelector : {
            allButtonsEnabled: true,
            selected: 9,
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
              {
                type: 'hour',
                count: 1,
                text: '1 hr',
                title: 'View 1 hour',
                dataGrouping: {
                    forced: true,
                    units: [['minute', [1]]]
                },
                events: {
                    click: this.handleClickRange
                }
            },{
                type: 'hour',
                count: 4,
                text: '4 hrs',
                title: 'View 4 hours',
                dataGrouping: {
                    forced: true,
                    units: [['minute', [1]]]
                },
                events: {
                    click: this.handleClickRange
                }
            },{
                type: 'day',
                count: 1,
                text: '1 day',
                title: 'View 1 day',
                dataGrouping: {
                    forced: true,
                    units: [['minute', [1]]]
                },
                events: {
                    click: this.handleClickRange
                }
            },
            {
                type: 'week',
                count: 1,
                text: '1w',
                title: 'View 1 week',
                dataGrouping: {
                    forced: true,
                    units: [['hour', [1]]]
                },
                events: {
                    click: this.handleClickRange
                }
            },{
                type: 'month',
                count: 1,
                text: '1m',
                title: 'View 1 month',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                },
                events: {
                    click: this.handleClickRange
                }
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                },
                events: {
                    click: function() {
                      grouping = 'day';
                    }
                }
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: 'View 6 months',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                },
                events: {
                    click: function() {
                      grouping = 'day';
                    }
                }
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date',
                events: {
                    click: function() {
                      grouping = 'day';
                    }
                }
            }, {
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                },
                events: {
                    click: function() {
                      grouping = 'day';
                    }
                }
            }, {
                type: 'all',
                text: 'All',
                title: 'View all',
                events: {
                    click: function() {
                      grouping = 'day';
                    }
                }
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
            allButtonsEnabled: true,
        },
        navigator: {
            enabled: false,
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
           enabled: false
        },
      },
      callbackHandle ()  {
        console.log(this);
        hchart = this;
        return this;
      }
    };
  },
  watch: {
    data: {
      handler: function(val, oldval) {
        console.log( "all data changed: " , [val, oldval])       
      },
      deep: true
    },
    new : {
      handler: function(val, oldval) {
        //console.log("new data changed: ",[val, oldval])
        this.addLiveData(val);

      },
      deep: true
    }
  },
  methods: {
    getChart ()  {
      //console.log(hchart)
      return hchart;
    },
    /**
     * GET THE MAX AND MIN OF INPUT DATA CHART
     */
    hasMin(array) {
        return array.reduce(function (prev, curr) {
            return prev[1] < curr[1] ? prev : curr;
        });
    },
    hasMax(array) {
        return array.reduce(function (prev, curr) {
            return prev[1] > curr[1] ? prev : curr;
        });
    },
    addLiveData(newData){
      var series = hchart.series[0]; 

      let group_timedata = new Date(newData.time);        
      group_timedata.setSeconds(0);
      group_timedata.setMilliseconds(0);

      if (grouping == 'minute') {
        
      } else if (grouping == 'hour') {
        group_timedata.setMinutes(0);

      } else if (grouping == 'day' ) {
        group_timedata.setMinutes(0);
        group_timedata.setHours(-(group_timedata.getTimezoneOffset()/60));

      }
      const price = parseFloat(newData.price.replace(",",""));
      const time = group_timedata.getTime();

      const index = series.xData.indexOf(time);
        if (index === -1) {
            series.addPoint([time, price], true, true);
            console.log('added point', [time, price])
  
        } else {
          if (series.yData[index] !== price ) {
              // redraw in this can cause laggy, consider better option or dont need it.
              
              // this caused laggy to the chart

              //series.removePoint(index);
              //series.addPoint([time, price ], false, false);
              
            }
        }


    },
    
    handleClickRange(e){
      let buttonText = e.srcElement.textContent;
      if (e.type === "click" && buttonText == "1 hr") {
        console.log("emit: ", [ { name: cChart.c_symbol }, '1h', 'minute'    ]);
        this.$root.$emit('changeRangeCrypto', [ { name: cChart.c_symbol }, '1h', 'minute'   ]);
        grouping = 'minute';
      }else
      if (e.type === "click" && buttonText == "4 hrs") {
        console.log("emit: ", [ { name: cChart.c_symbol }, '4h', 'minute'    ]);
        this.$root.$emit('changeRangeCrypto', [ { name: cChart.c_symbol }, '4h', 'minute'   ]);
        grouping = 'minute';
      }else
      if (e.type === "click" && buttonText == "1 day") {
        console.log("emit: ", [ { name: cChart.c_symbol }, '1d', 'minute'    ]);
        this.$root.$emit('changeRangeCrypto', [ { name: cChart.c_symbol }, '1d', 'minute'   ]);
        grouping = 'minute';
      }else
      if (e.type === "click" && buttonText == "1w") {
        console.log("emit: ", [ { name: cChart.c_symbol }, '1w', 'minute'    ]);
        this.$root.$emit('changeRangeCrypto', [ { name: cChart.c_symbol }, '1w', 'hour'   ]);
        grouping = 'hour';
      }
      
    },
    handleSetExtremes(e) {
     
      
      if (e.trigger === "rangeSelectorButton" ) {
        let nowdate = new Date();
        let now = nowdate.getTime();
        let min =  now  - 1000 * 60 * 60 ;

        if ( ( e.rangeSelectorButton.text === "1 hr" || e.rangeSelectorButton.text === "4 hrs" || e.rangeSelectorButton.text === "1 day" ) ) {
          console.log('draw by minute')
          const data = JSON.parse(localStorage.getItem(cChart.c_symbol + "-minute"));
          hchart.series[0].setData(
            data
          , true);           
          
          switch (e.rangeSelectorButton.text) {
            case "1 hr":
              nowdate.setHours(nowdate.getHours() -1 )
              min =  nowdate.getTime() ; 
              break;
            case "4 hrs":
              nowdate.setHours(nowdate.getHours() -4 )
              min =  nowdate.getTime() ; 
              break;
            case "1 day":
              nowdate.setDate(nowdate.getDate() - 1 )
              min =  nowdate.getTime() ; 
              break;
          
            default:
              break;
          }
          setTimeout(function(){ 
            hchart.xAxis[0].setExtremes(min, now);
          }, 1);

          const rangedata = data.filter(a => a[0] > min);
          hchart.yAxis[0].setExtremes( this.hasMin(rangedata)[1] ,  this.hasMax(rangedata)[1]  );
          
          
        }  else  if ( e.rangeSelectorButton.text === "1w") {
          console.log('draw by hour')
          const data = JSON.parse(localStorage.getItem(cChart.c_symbol + "-hour"));
          hchart.series[0].setData(
             data
          , true);
          
          //min =  now  - 7 * 24 * 1000 * 60 * 60 ;
          nowdate.setDate(nowdate.getDate() - 7 )
          min =  nowdate.getTime() ; 

          setTimeout(function(){ 
            hchart.xAxis[0].setExtremes(min, now);
          }, 1);

          hchart.yAxis[0].setExtremes( this.hasMin(data)[1] ,  this.hasMax(data)[1]  );

        } else {               
          console.log('draw by day')

          const data = JSON.parse(localStorage.getItem(cChart.c_symbol + "-all"));
          hchart.series[0].setData(
             data
          , true);

          if  ( e.rangeSelectorButton.text === "1m") {
            //min =  now  - 30 * 24 * 1000 * 60 * 60 ;
            //console.log(hchart.xAxis[0].getExtremes())
            nowdate.setMonth(nowdate.getMonth() - 1 )
            min =  nowdate.getTime() ; 
            console.log(min)
            setTimeout(function(){ 
              hchart.xAxis[0].setExtremes(min, now);
            }, 1);
          } else if  ( e.rangeSelectorButton.text === "3m") {
              //min =  now  - 90 * 24 * 1000 * 60 * 60 ;
              nowdate.setMonth(nowdate.getMonth() - 3 )
              min =  nowdate.getTime() ; 
              setTimeout(function(){ 
                hchart.xAxis[0].setExtremes(min, now);
              }, 1);
          } else if  ( e.rangeSelectorButton.text === "6m") {
              //min =  now  - 180 * 24 * 1000 * 60 * 60 ;
              nowdate.setMonth(nowdate.getMonth() - 6 )
              min =  nowdate.getTime() ; 
              setTimeout(function(){ 
                hchart.xAxis[0].setExtremes(min, now);
              }, 1);
          } else if  ( e.rangeSelectorButton.text === "1y") {
              //min =  now  - 365 * 24 * 1000 * 60 * 60 ;
              nowdate.setFullYear(nowdate.getFullYear() - 1 )
              min =  nowdate.getTime() ; 
              setTimeout(function(){ 
                hchart.xAxis[0].setExtremes(min, now);
              }, 1);
          } else if ( e.rangeSelectorButton.text === "All") {
            setTimeout(function(){ 
              hchart.xAxis[0].setExtremes(date.getTime(), now);
            }, 1);
          }
           
           
           hchart.yAxis[0].setExtremes( this.hasMin(data)[1] ,  this.hasMax(data)[1]  );
          //hchart.redraw();
        }
      }

      
    
      return true;
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.$refs.highcharts.chart.reflow();
    });
    cChart = this;
    //console.log(this.chartColour)
   
  }
};
</script>
