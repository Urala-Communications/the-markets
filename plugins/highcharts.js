import Vue from "vue";
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import Stock from "highcharts/modules/stock";
import boost from "highcharts/modules/boost";

Stock(Highcharts)
boost(Highcharts)
Vue.use(HighchartsVue);
