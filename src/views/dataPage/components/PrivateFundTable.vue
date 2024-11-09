<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { registrationData } from "../data/fundData";
import * as echarts from "echarts";

const tableData = ref(registrationData);

const currentView = ref("chart"); // 'chart' 或 'table'
let myChart = null;

const toggleView = (view: string) => {
  currentView.value = view;
  if (view === "chart") {
    // 在下一个 tick 后初始化图表，确保 DOM 已更新
    setTimeout(() => {
      initBarChart();
    });
  }
};

onMounted(() => {
  initBarChart();
});

const initBarChart = () => {
  const chartDom = document.getElementById("privateFundBarChart");
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
        "私募证券投资基金管理人（家）",
        "私募股权、创业投资基金管理人（家）",
        "私募资产配置基金管理人（家）",
        "其他私募投资基金管理人（家）"
      ],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: tableData.value.map(item => item.time),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: "value",
      name: "数量（家）",
      splitLine: {
        lineStyle: {
          type: "dashed"
        }
      }
    },
    series: [
      {
        name: "私募证券投资基金管理人（家）",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series"
        },
        data: tableData.value.map(item => item.securities),
        itemStyle: { color: "#c23531" }
      },
      {
        name: "私募股权、创业投资基金管理人（家）",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series"
        },
        data: tableData.value.map(item => item.equity),
        itemStyle: { color: "#2f4554" }
      },
      {
        name: "私募资产配置基金管理人（家）",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series"
        },
        data: tableData.value.map(item => item.asset),
        itemStyle: { color: "#61a0a8" }
      },
      {
        name: "其他私募投资基金管理人（家）",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series"
        },
        data: tableData.value.map(item => item.other),
        itemStyle: { color: "#d48265" }
      }
    ]
  };

  myChart.setOption(option);

  // 添加响应式调整
  window.addEventListener("resize", () => {
    myChart?.resize();
  });
};

// 组件卸载时清理
onUnmounted(() => {
  myChart?.dispose();
  window.removeEventListener("resize", () => {
    myChart?.resize();
  });
});
</script>

<template>
  <div class="private-fund-table">
    <div class="title">分类型私募基金管理人登记通过情况</div>

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
      <div id="privateFundBarChart" class="chart" />
    </div>

    <!-- 表格视图 -->
    <div v-show="currentView === 'table'" class="table-container">
      <table>
        <thead>
          <tr>
            <th rowspan="2">时间</th>
            <th rowspan="2">私募证券投资基金管理人（家）</th>
            <th rowspan="2">私募股权、创业投资基金管理人（家）</th>
            <th rowspan="2">私募资产配置类基金管理人（家）</th>
            <th rowspan="2">其他私募投资基金管理人（家）</th>
            <th rowspan="2">合计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.time">
            <td>{{ item.time }}</td>
            <td>{{ item.securities }}</td>
            <td>{{ item.equity }}</td>
            <td>{{ item.asset }}</td>
            <td>{{ item.other }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 注释说明 -->
    <div class="notes">
      <p>注：1.指当期登记通过的机构。</p>
      <p>2.按管理人初始登记日期统计。</p>
      <p>3.2018年之后登记的其他私募基金管理人为QDLP/QDIE试点机构。</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.private-fund-table {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .table-container {
    margin: 20px 0;
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;

      th,
      td {
        padding: 12px;
        border: 1px solid #ddd;
        font-size: 20px;
      }

      th {
        background-color: #f5f5f5;
        font-weight: normal;
        white-space: nowrap;
      }

      td {
        &:first-child {
          background-color: #f5f5f5;
        }
      }

      tr:hover td {
        background-color: #f8f8f8;
      }
    }
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
    margin: 20px 0;

    .chart {
      height: 400px;
      width: 100%;
    }
  }

  .notes {
    margin-top: 20px;
    color: #666;
    font-size: 12px;
    line-height: 1.6;

    p {
      margin: 0;
    }
  }
}
</style>
