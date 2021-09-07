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
                        type: "area",
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
                },
                plotOptions: {
                    series: {
                        dataGrouping: {
                            enabled: false,
                        },
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
                    inputEnabled: false,
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
                        "<div>1mn</div>", // text
                        10, // x
                        0, // y
                        function () {
                            // callback function
                            console.log("button 1min pressed");                            
                            customButtonRange.map((btn) => btn.setState(0));
                            this.setState(2);
                            grouping = "second";
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "1m",
                                "second",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
                    )
                    .css({
                        "font-weight": "bold",
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "5m",
                                "second",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "10m",
                                "second",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "30m",
                                "second",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "1h",
                                "minute",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "4h",
                                "minute",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "1d",
                                "hour",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "1w",
                                "hour",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "1M",
                                "hour",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "3M",
                                "day",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "6M",
                                "day",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "1y",
                                "day",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
                            cChart.$root.$emit("changeRangeCrypto", [
                                { name: cChart.c_symbol },
                                "All",
                                "day",
                            ]);
                        },
                        {
                            // theme
                            "stroke-width": 1,
                            stroke: "silver",
                            fill: "#E0E0E0",
                            height: 12,
                            r: 0,
                            zIndex: 10,
                        },
                        {
                            // hover state
                            fill: "#bada55",
                        },
                        {
                            // pressed state
                            fill: "#bada55",
                        },
                        null,
                        null,
                        true
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
        new: {
            handler: function (val, oldval) {
                //console.log("new data changed: ",[val, oldval])
            },
            deep: true,
        },
    },
    methods: {
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
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.highcharts.chart.reflow();
        });

        cChart = this;
        const self = this;

        this.$root.$on("updateCrypto", (data) => {
            if (data.symbol === cChart.c_symbol) {
                if (hchart != null) {
                    let group_timedata = new Date(data.time);
                    group_timedata.setMilliseconds(0);
                    if (grouping == "minute") {
                        group_timedata.setSeconds(0);
                    }

                    if (grouping !== "hour" && grouping !== "day") {
                        
                        const price = parseFloat(data.price.replace(",", ""));
                        const time = group_timedata.getTime();

                        const series = hchart.series[0];

                        let tempdat = series.options.data;
                        const index = _.findIndex(
                            series.options.data,
                            function (el) {
                                return el[0] == time;
                            }
                        );
                        if (index === -1) {
                            tempdat.push([time, price]);                            
                            series.addPoint([time, price], true, true);
                            console.log("new point added", [time, price]);
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
        });
    },
    created() {
        const self = this;
        this.$root.$on("update-chart-data", (data) => {
            console.log("received & change new data:", data);            
            
            if (data.data.length) {
                hchart.series[0].update({
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
