<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

const selectedMonth = ref(9);
const months = ref([9, 8, 7, 6, 5, 4, 3, 2, 1]); // 可选月份列表

const chartRef = ref();
let myChart: any = null;

const existingChartRef = ref();
let existingChart: any = null;

const initChart = () => {
  const chartDom = document.getElementById("absChart");
  if (!chartDom) return;

  myChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["产品数量（只）", "设立规模（亿元）"]
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: [
        "2023-09",
        "2023-10",
        "2023-11",
        "2023-12",
        "2024-01",
        "2024-02",
        "2024-03",
        "2024-04",
        "2024-05",
        "2024-06",
        "2024-07",
        "2024-08",
        "2024-09"
      ],
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: [
      {
        type: "value",
        name: "数量",
        min: 0,
        max: 160,
        interval: 20
      },
      {
        type: "value",
        name: "规模",
        min: 0,
        max: 1600,
        interval: 200
      }
    ],
    series: [
      {
        name: "产品数量（只）",
        type: "bar",
        data: [95, 124, 67, 125, 139, 66, 83, 75, 109, 79, 135, 119, 109],
        barWidth: 20,
        itemStyle: {
          color: "#409EFF"
        }
      },
      {
        name: "设立规模（亿元）",
        type: "line",
        yAxisIndex: 1,
        data: [
          842.96, 953.34, 662.42, 1043.1, 1423.2, 593.34, 724.76, 704.27,
          865.47, 732.47, 1037.61, 1096.11, 1138.47
        ],
        itemStyle: {
          color: "#F56C6C"
        },
        lineStyle: {
          width: 2
        },
        symbol: "circle",
        symbolSize: 8
      }
    ]
  };

  myChart.setOption(option);
};

const initExistingChart = () => {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      left: "left"
    },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: [
          { value: 5324.82, name: "应收账款" },
          { value: 3245.67, name: "CMBS" },
          { value: 2876.54, name: "融资租赁债权" },
          { value: 2345.12, name: "不动产特有型ABS" },
          { value: 1729.91, name: "小额贷款债权" },
          { value: 2445.08, name: "其他" },
          { value: 1395.48, name: "基础设施公募REITs" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };

  existingChart.setOption(option);
};

const handleResize = () => {
  myChart?.resize();
  existingChart?.resize();
};

onMounted(() => {
  myChart = echarts.init(chartRef.value);
  initChart();

  existingChart = echarts.init(existingChartRef.value);
  initExistingChart();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
  if (existingChart) {
    existingChart.dispose();
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="month-selector">
    <div class="fund-description">
      <el-select
        v-model="selectedMonth"
        placeholder="选择月份"
        style="width: 100%"
      >
        <el-option
          v-for="month in months"
          :key="month"
          :label="`2024年${month}月`"
          :value="month"
        />
      </el-select>

      <div class="scroll-container">
        <h3>资产支持专项计划备案运行情况简报（2024年{{ selectedMonth }}月）</h3>

        <div class="report-section">
          <h4>一、备案情况</h4>
          <p>
            2024年{{
              selectedMonth
            }}月，资产支持专项计划（以下简称ABS）新增备案109只，新增备案规模合计1,138.47亿元（见图1）。其中基础设施公募REITs备案4只、77.99亿元。此外，新增备案规模前三的ABS基础资产分别为：应收账款、融资租赁债权、小额贷款债权，备案规模分别为327.55亿元、248.21亿元、193.05亿元（见表1）。
          </p>

          <div class="chart-wrapper">
            <div id="absChart" ref="chartRef" class="chart" />
            <div class="chart-title">图1 ABS月度备案数量及规模情况</div>

            <h5 class="table-title">表1 9月备案ABS分类情况</h5>
            <div class="fund-table">
              <table>
                <thead>
                  <tr>
                    <th class="left-align">类型</th>
                    <th>新增备案数量（只）</th>
                    <th>新增备案规模（亿元）</th>
                    <th>规模占比（%）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="left-align">债权类-应收账款</td>
                    <td>30</td>
                    <td>327.55</td>
                    <td>28.77</td>
                  </tr>
                  <tr>
                    <td class="left-align">债权类-融资租赁债权</td>
                    <td>23</td>
                    <td>248.21</td>
                    <td>21.80</td>
                  </tr>
                  <tr>
                    <td class="left-align">债权类-小额贷款债权</td>
                    <td>29</td>
                    <td>193.05</td>
                    <td>16.96</td>
                  </tr>
                  <tr>
                    <td class="left-align">债权类-保单质押贷款</td>
                    <td>2</td>
                    <td>50.00</td>
                    <td>4.39</td>
                  </tr>
                  <tr>
                    <td class="left-align">债权类-保理融资债权</td>
                    <td>7</td>
                    <td>44.61</td>
                    <td>3.92</td>
                  </tr>
                  <tr>
                    <td class="left-align">
                      债权类-商业不动产抵押贷款（CMBS）
                    </td>
                    <td>3</td>
                    <td>28.03</td>
                    <td>2.46</td>
                  </tr>
                  <tr>
                    <td class="left-align">债权类-个人住房公积金贷款</td>
                    <td>1</td>
                    <td>15.00</td>
                    <td>1.32</td>
                  </tr>
                  <tr>
                    <td class="left-align">债权类-委托贷款债权</td>
                    <td>1</td>
                    <td>0.68</td>
                    <td>0.06</td>
                  </tr>
                  <tr>
                    <td class="left-align">未来经营收入类-基础设施���收费</td>
                    <td>2</td>
                    <td>9.60</td>
                    <td>0.84</td>
                  </tr>
                  <tr>
                    <td class="left-align">不动产特有型ABS</td>
                    <td>7</td>
                    <td>143.75</td>
                    <td>12.63</td>
                  </tr>
                  <tr>
                    <td class="left-align">基础设施公募REITs所投ABS</td>
                    <td>4</td>
                    <td>77.99</td>
                    <td>6.85</td>
                  </tr>
                  <tr class="total-row">
                    <td class="left-align">总计</td>
                    <td>109</td>
                    <td>1,138.47</td>
                    <td>100.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h4>二、存续情况</h4>
          <p>
            截至2024年{{
              selectedMonth
            }}月底，ABS存续2,282只、19,362.62亿元。其中基础设施公募REITs所投ABS存续51只、规模1,395.48亿元。此外，基础资产为应收账款、CMBS、融资租赁债权、不动产特有型ABS、小额贷款债权的ABS存续规模合计15,522.06亿元，占总存续规模的80.17%（见图2）；其余基础资产的ABS存续规模合计2,445.08亿元，占总存续规模的12.63%。
          </p>

          <div class="chart-wrapper">
            <div id="existingChart" ref="existingChartRef" class="chart" />
            <div class="chart-title">图2 大类基础资产ABS存续规模情况</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-wrapper {
  margin-top: 20px;

  .chart {
    width: 100%;
    height: 400px;
  }

  .chart-title {
    text-align: center;
    font-size: 20px;
    color: #606266;
    margin-top: 10px;
  }
}

.report-section {
  margin-top: 30px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
  }

  p {
    font-size: 20px;
    color: #606266;
    line-height: 1.8;
    text-align: justify;
    margin-bottom: 20px;

    sup {
      font-size: 12px;
      color: #909399;
    }
  }
}

.fund-table {
  margin-top: 20px;
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border-top: 2px solid #303133;
    border-bottom: 2px solid #303133;

    th,
    td {
      padding: 12px 8px;
      text-align: center;
      border: 1px solid #e4e7ed;
      font-size: 20px;
      min-width: 100px;

      &.left-align {
        text-align: left;
      }
    }

    th {
      background-color: #f5f7fa;
      color: #303133;
      font-weight: 500;
      border-bottom: 2px solid #303133;
    }

    td {
      color: #606266;

      sup {
        font-size: 12px;
        color: #909399;
      }
    }

    .total-row {
      font-weight: 500;

      td {
        border-top: 1px solid #303133;
      }
    }
  }
}

.table-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 20px 0;
  text-align: center;
}
</style>
