<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import { tableData } from "../data/fundData";
const currentView = ref("chart"); // 'chart' 或 'table'
let myChart = null;

// 图表数据
const chartData = {
  xAxis: ["2024M5", "2024M6", "2024M7", "2024M8", "2024M9"],
  series: [
    {
      name: "证券公司及其资管子公司（亿元）",
      data: [369.09, 240.0, 297.01, 495.59, 292.07],
      type: "bar",
      stack: "total",
      itemStyle: { color: "#c23531" }
    },
    {
      name: "基金管理公司（亿元）",
      data: [72.02, 108.07, 151.29, 118.01, 94.46],
      type: "bar",
      stack: "total",
      itemStyle: { color: "#2f4554" }
    },
    {
      name: "基金子公司（亿元）",
      data: [57.75, 34.32, 43.24, 33.51, 30.29],
      type: "bar",
      stack: "total",
      itemStyle: { color: "#61a0a8" }
    },
    {
      name: "基金管理公司私募子公司（亿元）",
      data: [0.0, 0.0, 0.0, 0.0, 0.0],
      type: "bar",
      stack: "total",
      itemStyle: { color: "#91c7ae" }
    }
  ],
  lines: [
    {
      name: "期货公司及其资管子公司（亿元）",
      data: [9.11, 13.97, 42.91, 19.52, 55.07],
      type: "line",
      yAxisIndex: 1,
      itemStyle: { color: "#d48265" }
    },
    {
      name: "证券公司私募子公司（亿元）",
      data: [14.24, 14.01, 8.94, 24.18, 19.53],
      type: "line",
      yAxisIndex: 1,
      itemStyle: { color: "#749f83" }
    }
  ]
};

const toggleView = (view: string) => {
  currentView.value = view;
  if (view === "chart") {
    setTimeout(() => {
      initChart();
    });
  }
};

const initChart = () => {
  const chartDom = document.getElementById("institutionTypeChart");
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
      data: [
        "证券公司及其资管子公司（亿元）",
        "基金管理公司（亿元）",
        "基金子公司（亿元）",
        "基金管理公司私募子公司（亿元）",
        "期货公司及其资管子公司（亿元）",
        "证券公司私募子公司（亿元）"
      ],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
      top: "20%"
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 60,
        end: 100,
        bottom: 0
      },
      {
        type: "inside",
        xAxisIndex: [0],
        start: 60,
        end: 100
      }
    ],
    xAxis: {
      type: "category",
      data: tableData.map(item => item.time)
    },
    yAxis: [
      {
        type: "value",
        name: "规模（亿元）",
        splitLine: {
          lineStyle: {
            type: "dashed"
          }
        }
      },
      {
        type: "value",
        name: "规模（亿元）",
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: "证券公司及其资管子公司（亿元）",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.securities),
        itemStyle: { color: "#c23531" }
      },
      {
        name: "基金管理公司（亿元）",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.fund),
        itemStyle: { color: "#2f4554" }
      },
      {
        name: "基金子公司（亿元）",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.fundSubsidiary),
        itemStyle: { color: "#61a0a8" }
      },
      {
        name: "基金管理公司私募子公司（亿元）",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.fundPrivate),
        itemStyle: { color: "#91c7ae" }
      },
      {
        name: "期货公司及其资管子公司（亿元）",
        type: "line",
        yAxisIndex: 1,
        data: tableData.map(item => item.futures),
        itemStyle: { color: "#d48265" }
      },
      {
        name: "证券公司私募子公司（亿元）",
        type: "line",
        yAxisIndex: 1,
        data: tableData.map(item => item.securitiesPrivate),
        itemStyle: { color: "#749f83" }
      }
    ]
  };

  myChart.setOption(option);

  window.addEventListener("resize", () => {
    myChart?.resize();
  });
};

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  myChart?.dispose();
});
</script>

<template>
  <div class="institution-type-chart">
    <div class="title">按机构类型分私募资管产品备案通过情况（产品数量）</div>

    <!-- 图表切换 -->
    <div class="view-toggle">
      <span
        class="toggle-btn"
        :class="{ active: currentView === 'chart' }"
        @click="toggleView('chart')"
        >图</span
      >
      <span
        class="toggle-btn"
        :class="{ active: currentView === 'table' }"
        @click="toggleView('table')"
        >表</span
      >
    </div>

    <!-- 图表视图 -->
    <div v-show="currentView === 'chart'" class="chart-container">
      <div id="institutionTypeChart" class="chart" />
    </div>

    <!-- 表格视图 -->
    <div v-show="currentView === 'table'" class="table-container">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>证券公司及其资管子公司（亿元）</th>
            <th>证券公司私募子公司（亿元）</th>
            <th>基金管理公司（亿元）</th>
            <th>基金子公司（亿元）</th>
            <th>基金管理公司私募子公司（亿元）</th>
            <th>期货公司及其资管子公司（亿元）</th>
            <th>合计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.time">
            <td>{{ item.time }}</td>
            <td>{{ item.securities }}</td>
            <td>{{ item.securitiesPrivate }}</td>
            <td>{{ item.fund }}</td>
            <td>{{ item.fundSubsidiary }}</td>
            <td>{{ item.fundPrivate }}</td>
            <td>{{ item.futures }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.institution-type-chart {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .view-toggle {
    display: flex;
    gap: 1px;
    background: #ddd;
    width: fit-content;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;

    .toggle-btn {
      padding: 6px 20px;
      cursor: pointer;
      background: #f5f5f5;
      transition: all 0.3s;

      &.active {
        background: #c23531;
        color: white;
      }

      &:hover:not(.active) {
        background: #e6e6e6;
      }
    }
  }

  .chart-container {
    .chart {
      height: 400px;
      width: 100%;
    }
  }

  .table-container {
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: 12px;
        text-align: center;
        border: 1px solid #ddd;
        font-size: 20px;
      }

      th {
        background-color: #f5f5f5;
        font-weight: normal;
        white-space: nowrap;
      }

      tr:nth-child(even) {
        background-color: #fafafa;
      }
    }
  }
}
</style>
