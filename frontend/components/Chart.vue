<template>
    <highcharts
        ref="highcharts"
        :constructor-type="'stockChart'"
        :options="chartOptions"
        :callback="callbackHandle"
    ></highcharts>
</template>

<script>
import _ from "lodash";

let date = new Date();
date.setDate(date.getDate() - 1826);
let fiveYearsAgo = date.toLocaleDateString("fr-CA").split("-");
let y = parseInt(fiveYearsAgo[0]);
let m = parseInt(fiveYearsAgo[1]) - 1;
let d = parseInt(fiveYearsAgo[2]);
let hchart = null;

var cChart = null;

let grouping = "day";
let customButtonRange = [];
let thresholdValue = 0;

const buttonTheme = [
    {
        // theme
        "stroke-width": 0,
        stroke: "#fff",
        fill: "#fff",
        height: 9,
        r: 4,
        zIndex: 10,
        style: {
            "color": "#8182a8",
            "filter": "none",
            "margin-top": "5px"
        },
    },
    {
        // hover state
        fill: "#fff",
        stroke: "#fff",
        style: {
            "filter": "drop-shadow(1px 3px 3px rgb(218 226 239 / 90%))",
            "color": "#ff7d4a"
        }
    },
    {
        // pressed state
        fill: "#fff",
        stroke: "#fff",
        style: {
            "filter": "drop-shadow(1px 3px 3px rgb(218 226 239 / 90%))",
            "color": "#ff7d4a"
        }
    },
]

export default {
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        chartColour: {
            type: String,
        },
        new: {
            type: Object,
            default: () => {},
        },
        c_symbol: {
            type: String,
        },
    },

    data() {
        return {
            chartOptions: {
                boost: {
                    enabled: true,
                    // usePreallocated: true,
                    useGPUTranslations: true, // gpu translation
                },
                series: [
                    {
                        name: "Price",
                        // type: 'candlestick',
                        type: 'area',
                        data: this.data,
                        color: "#fff",
                    },
                ],
                time: {
                    useUTC: false, // disable utc
                },
                chart: {
                    backgroundColor: "#fff",
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 50,
                    animation: false,
                },
                plotOptions: {
                    series: {
                        dataGrouping: {
                            enabled: false,
                        },
                    },
                    candlestick: {
                        color: 'red',
                        lineColor: 'red',
                        upColor: 'green',
                        upLineColor: 'green',
                    },
                    area: {
                        //stacking: "normal",
                        lineWidth: 1,
                        marker: {
                            enabled: !1,
                        },
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1,
                            },
                            stops:
                                this.chartColour === "up"
                                    ? [
                                          [0, "#3ed7ab"],
                                          [1, "#3ed7ab"],
                                      ]
                                    : [
                                          [0, "#ff0271"],
                                          [1, "#DC0D56"],
                                      ],
                        },
                    },
                },
                yAxis: {
                    gridLineWidth: 0,
                },
                xAxis: {
                    type: "datetime",
                },
                rangeSelector: {
                    enabled: false,
                    inputEnabled: false
                },
                navigator: {
                    enabled: false,
                    height: 30,
                    handles: {
                        backgroundColor: "#fff",
                        borderColor: "#aaa",
                    },
                    maskFill: "rgba(220,220,220,0.4)",
                },
                credits: {
                    enabled: false,
                },
                scrollbar: {
                    enabled: false,
                },
            },
            callbackHandle(chart) {
                const self = this;
                const btn1min = chart.renderer
                    .button(
                        "1mn", // text
                        10, // x
                        0, // y
                        function () {
                            // callback function
                            console.log("button 1min pressed");
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "second";
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "1m",
                                "second",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold"
                    })
                    .attr({
                        id: "button-1min",
                    })
                    .addClass("btn-1min")
                    .add();

                customButtonRange.push(btn1min);
                const btn5min = chart.renderer
                    .button(
                        "5mn", // text
                        60, // x
                        0, // y
                        function () {
                            // callback function
                            console.log("button 5 min pressed");
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "second";
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "5m",
                                "second",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-5min")
                    .add();
                customButtonRange.push(btn5min);
                const btn10min = chart.renderer
                    .button(
                        "10mn", // text
                        110, // x
                        0, // y
                        function () {
                            // callback function
                            console.log("button 10min pressed");
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "second";
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "10m",
                                "second",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-10min")
                    .add();
                customButtonRange.push(btn10min);
                const btn30min = chart.renderer
                    .button(
                        "30mn", // text
                        170, // x
                        0, // y
                        function () {
                            // callback function
                            console.log("button 30mn pressed");
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "second";
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "30m",
                                "second",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-30min")
                    .add();
                customButtonRange.push(btn30min);
                const btn1h = chart.renderer
                    .button(
                        "1h", // text
                        230, // x
                        0, // y
                        function () {
                            // callback function
                            console.log("button 1h pressed");
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "minute";
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "1h",
                                "minute",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-1h")
                    .add();
                customButtonRange.push(btn1h);

                const btn4h = chart.renderer
                    .button(
                        "4h", // text
                        270, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "minute";
                            console.log("button 4h pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "4h",
                                "minute",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-4h")
                    .add();
                customButtonRange.push(btn4h);

                const btn1d = chart.renderer
                    .button(
                        "1d", // text
                        310, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button 1d pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "1d",
                                "hour",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-1d")
                    .add();
                customButtonRange.push(btn1d);

                const btn1w = chart.renderer
                    .button(
                        "1w", // text
                        350, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button 1w pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "1w",
                                "hour",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-1w")
                    .add();
                customButtonRange.push(btn1w);

                const btn1M = chart.renderer
                    .button(
                        "1M", // text
                        390, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button 1M pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "1M",
                                "hour",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-1M")
                    .add();
                customButtonRange.push(btn1M);

                const btn3M = chart.renderer
                    .button(
                        "3M", // text
                        430, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button 3M pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "3M",
                                "day",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-3M")
                    .add();
                customButtonRange.push(btn3M);

                const btn6M = chart.renderer
                    .button(
                        "6M", // text
                        470, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button 6M pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "6M",
                                "day",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-6M")
                    .add();
                customButtonRange.push(btn6M);

                const btn1y = chart.renderer
                    .button(
                        "1y", // text
                        510, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button 1y pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "1y",
                                "day",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-1y")
                    .add();
                customButtonRange.push(btn1y);

                let allbtn = chart.renderer
                    .button(
                        "All", // text
                        550, // x
                        0, // y
                        function () {
                            // callback function
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            console.log("button All pressed");
                            cChart.$root.$emit("changeRangeData", [
                                { name: cChart.c_symbol },
                                "All",
                                "day",
                            ]);
                        },
                        buttonTheme[0],
                        buttonTheme[1],
                        buttonTheme[2],
                        null,
                        null,
                        false
                    )
                    .css({
                        "font-weight": "bold",
                    })
                    .addClass("btn-all")
                    .add();
                customButtonRange.push(allbtn);
                allbtn.setState(2);

                hchart = this;

                //return this;
            },
        };
    },
    watch: {

    },
    methods: {

    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.highcharts.chart.reflow();
        });

        cChart = this;
        const self = this;

        let oldtime = new Date();
        oldtime.setMilliseconds(0);
        oldtime = oldtime.getTime();

        let oldtimeMin = new Date();
        oldtimeMin.setMilliseconds(0);
        oldtimeMin.setSeconds(0);
        oldtimeMin = oldtimeMin.getTime();

        function updateChartDat(data) {
            if (data.symbol === self.c_symbol) {
                if (self.$refs.highcharts != null) {

                    let group_timedata = new Date(data.time);
                    group_timedata.setMilliseconds(0);
                    if (grouping == "minute") {
                        group_timedata.setSeconds(0);
                    }

                    if (grouping !== "hour" && grouping !== "day") {

                        const price = parseFloat(data.price.replace(",", ""));
                        const time = group_timedata.getTime();

                        const series = self.$refs.highcharts.chart.series[0];
                        let conditionAdd=true;
                        if (grouping == "second") {
                            conditionAdd = (time-oldtime)>=1000;
                        } else if (grouping == "minute"){
                            conditionAdd = (time-oldtimeMin)>=10000;
                        }
                        if (conditionAdd) {
                            series.addPoint([time, price], true, true);
                            if (grouping == "second") {
                                oldtime=time;
                            } else if (grouping == "minute"){
                                oldtimeMin=time;
                            }
                        } else {
                            if (series.points.length > 0) {
                                if (
                                    series.points[series.points.length - 1]
                                        .y !== price
                                ) {

                                    series.points[
                                        series.points.length - 1
                                    ].update({
                                        y: price,
                                    });
                                }
                            }
                        }

                    }
                }
            }

        }

        this.$root.$on("updateCrypto", (data) => {
            updateChartDat(data);
        });
        this.$root.$on("updateCurrency", (data) => {
             updateChartDat(data);
        });
        this.$root.$on("updateIndice", (data) => {
             updateChartDat(data);
        });
        this.$root.$on("updateStock", (data) => {
             updateChartDat(data);
        });

    },
    created() {
        const self = this;
        this.$root.$on("update-chart-data", (data) => {
            //console.log("received & change new data:", data);
//            self.$refs.highcharts.chart.reflow();
            if (data.data.length && self.$refs.highcharts) {
                self.$refs.highcharts.chart.series[0].update({
                    getExtremesFromAll: true,
                    softThreshold: false,
                    data: data.data
                });
            }
        });
    },
};
</script>
<style lang="scss">
/* need responsive for custom button here */
.highcharts-button {
    @media (max-width: 768px) {
    }
}
</style>
