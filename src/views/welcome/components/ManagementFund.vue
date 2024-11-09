<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const selectedMonth = ref(9);
const months = ref([9, 8, 7, 6, 5, 4, 3, 2, 1]); // 可选月份列表

let managementChart: echarts.ECharts | null = null;
let existingChart: echarts.ECharts | null = null;

const initChart = () => {
  const chartDom = document.getElementById("managementChart");
  if (!chartDom) return;

  managementChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    legend: {
      data: ["产品数量（只）", "设立规模（亿元）"]
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
        name: "产品数量",
        min: 0,
        max: 1000,
        interval: 200
      },
      {
        type: "value",
        name: "设立规模",
        min: 0,
        max: 800,
        interval: 200,
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "产品数量（只）",
        type: "bar",
        data: [815, 587, 844, 952, 803, 497, 754, 759, 686, 861, 878, 782, 698],
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
          659.08, 339.45, 618.29, 444.37, 526.84, 234.82, 534.25, 518.72,
          522.19, 410.37, 543.28, 690.8, 491.41
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

  managementChart.setOption(option);
};

const initExistingChart = () => {
  const chartDom = document.getElementById("existingChart");
  if (!chartDom) return;

  existingChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}亿元 ({d}%)"
    },
    legend: {
      orient: "vertical",
      right: "5%",
      top: "center",
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      formatter: (name: string) => {
        const data = option.series[0].data;
        const item = data.find(i => i.name === name);
        return `${name}: ${item.value}亿元 (${item.percentage}%)`;
      }
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 2,
          borderWidth: 2,
          borderColor: "#fff"
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          {
            name: "证券公司及其资管子公司",
            value: 56930.0,
            percentage: 45.43,
            itemStyle: { color: "#FF9B5C" }
          },
          {
            name: "基金管理公司",
            value: 47470.66,
            percentage: 37.88,
            itemStyle: { color: "#47D2FF" }
          },
          {
            name: "基金子公司",
            value: 11080.73,
            percentage: 8.84,
            itemStyle: { color: "#56E1E1" }
          },
          {
            name: "期货公司及其资管子公司",
            value: 3441.16,
            percentage: 2.75,
            itemStyle: { color: "#9F87FF" }
          },
          {
            name: "证券公司私募子公司",
            value: 6272.36,
            percentage: 5.01,
            itemStyle: { color: "#FFD76E" }
          },
          {
            name: "基金管理公司私募子公司",
            value: 116.59,
            percentage: 0.09,
            itemStyle: { color: "#58D88D" }
          }
        ]
      }
    ]
  };

  existingChart.setOption(option);
};

const handleResize = () => {
  if (managementChart) managementChart.resize();
  if (existingChart) existingChart.resize();
};

onMounted(() => {
  nextTick(() => {
    initChart();
    initExistingChart();
    window.addEventListener("resize", handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (managementChart) managementChart.dispose();
  if (existingChart) existingChart.dispose();
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
        <h3>
          证券期货经营机构私募资管产品备案月报（2024年{{ selectedMonth }}月）
        </h3>

        <div class="report-section">
          <h4>一、私募资管产品备案情况</h4>
          <p>
            2024年{{
              selectedMonth
            }}月，证券期货经营机构共备案私募资管产品698只，环比减少10.74%，同比减少14.36%；设立规模491.41亿元，环比减少28.86%，同比减少25.44%（见图1）。
          </p>

          <div class="chart-wrapper">
            <div id="managementChart" class="chart" />
            <div class="chart-title">
              图1 证券期货经营机构资管产品月度备案数量及规模趋势
            </div>
            <div class="chart-description">
              <p>
                从机构类型看，9月备案的私募资管产品中，证券公司及其子公司产品占比最高（见表1）。
              </p>
              <h5 class="table-title">
                表1 按机构类型分私募资管产品月度备案情况（2024年9月）
              </h5>
              <div class="fund-table">
                <table>
                  <thead>
                    <tr>
                      <th class="left-align">机构类型</th>
                      <th>备案数量（只）</th>
                      <th>设立规模（亿元）</th>
                      <th>规模占比（%）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="left-align">证券公司及其资管子公司</td>
                      <td>473</td>
                      <td>292.07</td>
                      <td>59.44</td>
                    </tr>
                    <tr>
                      <td class="left-align">证券公司私募子公司</td>
                      <td>15</td>
                      <td>19.53</td>
                      <td>3.97</td>
                    </tr>
                    <tr>
                      <td class="left-align">基金管理公司</td>
                      <td>106</td>
                      <td>94.46</td>
                      <td>19.22</td>
                    </tr>
                    <tr>
                      <td class="left-align">基金子公司</td>
                      <td>57</td>
                      <td>30.29</td>
                      <td>6.16</td>
                    </tr>
                    <tr>
                      <td class="left-align">期货公司及其资管子公司</td>
                      <td>47</td>
                      <td>55.07</td>
                      <td>11.21</td>
                    </tr>
                    <tr class="total-row">
                      <td class="left-align">合计</td>
                      <td>698</td>
                      <td>491.41</td>
                      <td>100.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="section-text">
                从产品类型看，9月备案的集合产品平均单只设立规模为0.68亿元，环比减少21.71%，单一产品平均单只设立规模为0.74亿元，环比减少18.20%（见表2）。
              </p>

              <h5 class="table-title">
                表2 按产品类型分私募资管产品月度备案情况（2024年9月）
              </h5>
              <div class="fund-table">
                <table>
                  <thead>
                    <tr>
                      <th class="left-align">产品类型</th>
                      <th>备案数量（）</th>
                      <th>设立规模（亿元）</th>
                      <th>规模占比（%）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="left-align">集合资产管理计划</td>
                      <td>401</td>
                      <td>270.90</td>
                      <td>55.13</td>
                    </tr>
                    <tr>
                      <td class="left-align">单一资产管理计划</td>
                      <td>297</td>
                      <td>220.51</td>
                      <td>44.87</td>
                    </tr>
                    <tr class="total-row">
                      <td class="left-align">合计</td>
                      <td>698</td>
                      <td>491.41</td>
                      <td>100.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="section-text">
                从投资类型看，9月备案产品以固定收益类产品为主（见表3）。
              </p>

              <h5 class="table-title">
                表3 按投资类型分私募资管产品月度备案情况（2024年9月）
              </h5>
              <div class="fund-table">
                <table>
                  <thead>
                    <tr>
                      <th class="left-align">投资类型</th>
                      <th>备案数量（只）</th>
                      <th>设立规模（亿元）</th>
                      <th>规模占比（%）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="left-align">权益类</td>
                      <td>39</td>
                      <td>30.56</td>
                      <td>6.22</td>
                    </tr>
                    <tr>
                      <td class="left-align">固定收益类</td>
                      <td>469</td>
                      <td>403.64</td>
                      <td>82.14</td>
                    </tr>
                    <tr>
                      <td class="left-align">期货和衍生品类</td>
                      <td>35</td>
                      <td>10.33</td>
                      <td>2.10</td>
                    </tr>
                    <tr>
                      <td class="left-align">混合类</td>
                      <td>155</td>
                      <td>46.88</td>
                      <td>9.54</td>
                    </tr>
                    <tr class="total-row">
                      <td class="left-align">合计</td>
                      <td>698</td>
                      <td>491.41</td>
                      <td>100.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h4>二、私募资管产品存续情况</h4>
          <p>
            截至2024年{{
              selectedMonth
            }}月底，证券期货经营机构私募资管产品规模合计12.53万亿元（不含社保基金、企业年金），较上月底减少1,283.32亿元，降低1.01%。（证券期货经营机构存续产品规模分布情况见图2）
          </p>

          <div class="chart-wrapper">
            <div id="existingChart" class="chart" />
            <div class="chart-title">
              图2 证券期货经营机构存续产品规模分布情况（单位：亿元）
            </div>
          </div>
        </div>

        <div class="report-section">
          <p>
            从产品类型看，存续单一资产管理计划与集合资产管理计划的数量及规模相近（见表4）。
          </p>

          <h5 class="table-title">
            表4 按产品类型分私募资管产品存续情况（截至2024年9月底）
          </h5>
          <div class="fund-table">
            <table>
              <thead>
                <tr>
                  <th class="left-align">产品类型</th>
                  <th>数量（只）</th>
                  <th>数量占比（%）</th>
                  <th>规模（亿元）</th>
                  <th>规模占比（%）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="left-align">集合资产管理计划</td>
                  <td>17,271</td>
                  <td>50.95</td>
                  <td>61,586.32</td>
                  <td>49.15</td>
                </tr>
                <tr>
                  <td class="left-align">单一资产管理计划</td>
                  <td>16,628</td>
                  <td>49.05</td>
                  <td>63,725.18</td>
                  <td>50.85</td>
                </tr>
                <tr class="total-row">
                  <td class="left-align">合计</td>
                  <td>33,899</td>
                  <td>100.00</td>
                  <td>125,311.50</td>
                  <td>100.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            从投资类型，固定收益类产品数量和规模均占据四类产品最大比例，混合类产品数量位居第二，权益类产品规模位居第二，期货和衍生品类产品数量和规模均较小（见表5）。
          </p>

          <h5 class="table-title">
            表5 按投资类型分私募资管产品存续情况（截至2024年9月底）
          </h5>
          <div class="fund-table">
            <table>
              <thead>
                <tr>
                  <th class="left-align">投资类型</th>
                  <th>数量（只）</th>
                  <th>数量占比（%）</th>
                  <th>规模（亿元）</th>
                  <th>规模占比（%）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="left-align">权益类</td>
                  <td>5,219</td>
                  <td>15.40</td>
                  <td>19,137.55</td>
                  <td>15.27</td>
                </tr>
                <tr>
                  <td class="left-align">固定收益类</td>
                  <td>15,721</td>
                  <td>46.38</td>
                  <td>93,041.33</td>
                  <td>74.25</td>
                </tr>
                <tr>
                  <td class="left-align">期货和衍生品类</td>
                  <td>1,438</td>
                  <td>4.24</td>
                  <td>1,010.59</td>
                  <td>0.81</td>
                </tr>
                <tr>
                  <td class="left-align">混合类</td>
                  <td>11,521</td>
                  <td>33.99</td>
                  <td>12,122.04</td>
                  <td>9.67</td>
                </tr>
                <tr class="total-row">
                  <td class="left-align">合计</td>
                  <td>33,899</td>
                  <td>100.00</td>
                  <td>125,311.50</td>
                  <td>100.00</td>
                </tr>
              </tbody>
            </table>
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

  .chart-description {
    margin-top: 20px;

    p {
      font-size: 20px;
      color: #606266;
      line-height: 1.8;
      text-align: justify;
      margin-bottom: 15px;
    }

    .table-title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 20px 0;
      text-align: center;
    }
  }
}

.fund-table {
  margin: 20px 0;
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
    }

    tr:first-child {
      border-bottom: 1px solid #303133;
    }

    .total-row {
      font-weight: 500;

      td {
        border-top: 1px solid #303133;
      }
    }
  }
}

.section-text {
  font-size: 20px;
  color: #606266;
  line-height: 1.8;
  text-align: justify;
  margin: 20px 0;
}

.fund-table {
  margin: 20px 0;
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
    }

    tr:first-child {
      border-bottom: 1px solid #303133;
    }

    .total-row {
      font-weight: 500;

      td {
        border-top: 1px solid #303133;
      }
    }
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
  }
}

.menu-item {
  font-size: 16px;
  line-height: 48px;
  height: 48px;
  padding: 0 16px;
}

.el-menu-item {
  height: 48px !important;
  line-height: 48px !important;
}

.table-wrapper {
  border-bottom: 2px solid #303133;

  tr:first-child {
    border-bottom: 1px solid #303133;
  }
}
</style>
