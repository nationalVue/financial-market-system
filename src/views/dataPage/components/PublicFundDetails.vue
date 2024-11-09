<script setup lang="ts">
import { ref } from "vue";
import * as echarts from "echarts";
import { onMounted, onUnmounted } from "vue";
import FundDataTable from "./FundDataTable.vue";
import FundRankingTable from "./FundRankingTable.vue";

// 基金概览数据
const overviewData = ref({
  managerCount: 163,
  productCount: 12175,
  fundScale: 32.07
});

// 饼图数据
const pieChartData = {
  stockFund: 42703.6,
  bondFund: 65933.67,
  QDII: 5944.57,
  mixedFund: 37465.16,
  moneyMarketFund: 130334.76,
  openEndFund: 282381.76,
  closedEndFund: 34300.23
};

// 基金管理机构排名数据
const managementCompanies = [
  "易方达基金管理有限公司",
  "华夏基金管理有限公司",
  "广发基金管理有限公司",
  "嘉实基金管理有限公司",
  "富国基金管理有限公司",
  "博时基金管理有限公司",
  "招商基金管理有限公司",
  "南方基金管理股份有限公司",
  "汇添富基金管理股份有限公司",
  "鹏华基金管理有限公司"
];

// 图表实例引用
let pieChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

// 初始化饼图
const initPieChart = () => {
  const chartDom = document.getElementById("fundPieChart");
  if (!chartDom) return;

  pieChart = echarts.init(chartDom);

  const option = {
    title: {
      text: "公募基金市场数据",
      left: "center"
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} (亿元)"
    },
    series: [
      {
        name: "基金类型",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: "{b}: {c}亿元"
        },
        data: [
          { value: pieChartData.stockFund, name: "股票基金" },
          { value: pieChartData.bondFund, name: "债券基金" },
          { value: pieChartData.QDII, name: "QDII" },
          { value: pieChartData.mixedFund, name: "混合基金" },
          { value: pieChartData.moneyMarketFund, name: "货币市场基金" }
        ]
      }
    ]
  };

  pieChart.setOption(option);
};

// 初始化柱状图
const initBarChart = () => {
  const chartDom = document.getElementById("managementBarChart");
  if (!chartDom) return;

  barChart = echarts.init(chartDom);

  const option = {
    title: {
      text: "基金管理机构非货币公募基金月均规模（单位：亿元）",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      top: "15%",
      left: "20%",
      right: "5%",
      bottom: "10%"
    },
    xAxis: {
      type: "value",
      axisLine: {
        show: true
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "category",
      data: [
        "10.鹏华基金管理有限公司",
        "9.汇添富基金管理股份有限公司",
        "8.南方基金管理股份有限公司",
        "7.招商基金管理有限公司",
        "6.博时基金管理有限公司",
        "5.富国基金管理有限公司",
        "4.嘉实基金管理有限公司",
        "3.广发基金管理有限公司",
        "2.华夏基金管理有限公司",
        "1.易方达基金管理有限公司"
      ],
      axisLabel: {
        interval: 0,
        fontSize: 12
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        type: "bar",
        data: [2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600],
        barWidth: "60%",
        itemStyle: {
          color: "#c23531"
        },
        label: {
          show: false
        }
      }
    ]
  };

  barChart.setOption(option);
};

// 处理窗口大小改变
const handleResize = () => {
  pieChart?.resize();
  barChart?.resize();
};

onMounted(() => {
  initPieChart();
  initBarChart();
  window.addEventListener("resize", handleResize);
});

// 在组件卸载时清理资源
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  pieChart?.dispose();
  barChart?.dispose();
  pieChart = null;
  barChart = null;
});
</script>

<template>
  <div class="public-fund-details">
    <!-- 行业数据标题 -->
    <div class="industry-title">公募基金行业数据</div>

    <!-- 行业数据概览 -->
    <div class="industry-overview">
      <div class="overview-box">
        <div class="number">
          {{ overviewData.productCount }}<span class="unit">/只</span>
        </div>
        <div class="label">基金数量</div>
      </div>
      <div class="divider" />
      <div class="overview-box">
        <div class="number">
          {{ overviewData.fundScale }}<span class="unit">/万亿元</span>
        </div>
        <div class="label">基金规模</div>
      </div>
      <div class="divider" />
      <div class="overview-box">
        <div class="number">
          {{ overviewData.managerCount }}<span class="unit">/家</span>
        </div>
        <div class="label">基金管理人</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div id="fundPieChart" class="chart" />
      <div id="managementBarChart" class="chart" />
    </div>

    <div class="data-source">
      <span>截至：2024年09月</span>
    </div>

    <!-- 添加表格组件 -->
    <FundDataTable />

    <!-- 添加基金排名表格 -->
    <FundRankingTable />
  </div>
</template>

<style lang="scss" scoped>
.public-fund-details {
  padding: 20px;

  .industry-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .industry-overview {
    background: linear-gradient(to bottom, #2c3e50, #3a4a5d);
    border-radius: 8px;
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    color: white;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0.1;
      pointer-events: none;
    }

    .overview-box {
      flex: 1;
      text-align: center;

      .number {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 10px;

        .unit {
          font-size: 16px;
          margin-left: 4px;
        }
      }

      .label {
        font-size: 16px;
        opacity: 0.9;
      }
    }

    .divider {
      width: 1px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 0 40px;
    }
  }

  .charts-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    .chart {
      height: 500px;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .data-source {
    text-align: right;
    color: #666;
    font-size: 12px;
  }
}
</style>
