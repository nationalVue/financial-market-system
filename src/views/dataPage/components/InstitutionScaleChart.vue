<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import { tableData } from "../data/fundData";
const chartRef = ref();
let myChart: any = null;
const showChart = ref(true); // 控制显示图表还是表格

const initChart = () => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: [
        "证券公司及其资管子公司",
        "证券公司私募子公司",
        "基金管理公司",
        "基金子公司",
        "基金管理公司私募子公司",
        "期货公司及其资管子公司"
      ]
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: tableData.map(item => item.time),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: "value",
      name: "规模（亿元）"
    },
    series: [
      {
        name: "证券公司及其资管子公司",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.securities)
      },
      {
        name: "证券公司私募子公司",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.securitiesPrivate)
      },
      {
        name: "基金管理公司",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.fund)
      },
      {
        name: "基金子公司",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.fundSubsidiary)
      },
      {
        name: "基金管理公司私募子公司",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.fundPrivate)
      },
      {
        name: "期货公司及其资管子公司",
        type: "bar",
        stack: "total",
        data: tableData.map(item => item.futures)
      }
    ]
  };

  myChart.setOption(option);
};

onMounted(() => {
  myChart = echarts.init(chartRef.value);
  initChart();

  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  myChart?.resize();
};

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
  window.removeEventListener("resize", handleResize);
});
</script>
<template>
  <div class="chart-container">
    <div class="left-section">
      <h3 class="chart-title">
        按机构类型分私募资管产品备案通过情况（设立规模）
      </h3>
      <div class="switch-buttons">
        <button :class="{ active: showChart }" @click="showChart = true">
          图表
        </button>
        <button :class="{ active: !showChart }" @click="showChart = false">
          表格
        </button>
      </div>
    </div>

    <div class="content-section">
      <div v-show="showChart" ref="chartRef" class="echarts-container" />
      <div v-show="!showChart" class="table-container">
        <table class="data-table">
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
            <tr v-for="(item, index) in tableData" :key="index">
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
  </div>
</template>
<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.left-section {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.switch-buttons {
  display: flex;
  gap: 10px;
}

.switch-buttons button {
  padding: 6px 16px;
  border: 1px solid #c23531;
  background: transparent;
  color: #c23531;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 20px;
}

.switch-buttons button.active {
  background: #c23531;
  color: white;
}

.switch-buttons button:hover {
  opacity: 0.8;
}

.content-section {
  flex: 1;
  position: relative;
}

.echarts-container {
  width: 100%;
  height: 500px;
}

.table-container {
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 20px;
}

.data-table th,
.data-table td {
  padding: 8px 4px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
  white-space: normal;
  line-height: 1.2;
}

.data-table tr:nth-child(even) {
  background-color: #fafafa;
}

.data-table tr:hover {
  background-color: #f0f0f0;
}

.data-table td {
  transition: background-color 0.3s;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 0;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
</style>
