<template>
  <div class="market-overview">
    <h2 class="text-xl font-bold mb-4">市场概览</h2>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in summaryData" :key="index" :span="6">
        <el-card shadow="hover">
          <div class="summary-item">
            <div class="label">{{ item.label }}</div>
            <div
              class="value"
              :class="{
                'text-red-500': Number(item.value) > 0,
                'text-green-500': Number(item.value) < 0
              }"
            >
              {{ item.value }}{{ item.unit }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div ref="chartRef" style="width: 100%; height: 400px; margin-top: 20px" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import type { StockData } from "@/api/stock";
import * as echarts from "echarts";
const props = defineProps({
  stockData: {
    type: Array as () => StockData[],
    required: true
  }
});

const summaryData = computed(() => {
  if (!props.stockData.length) return [];

  const avgPrice =
    props.stockData.reduce((acc, cur: StockData) => acc + (cur.fxjg || 0), 0) /
    props.stockData.length;

  const avgPE =
    props.stockData.reduce((acc, cur: StockData) => acc + (cur.syl || 0), 0) /
    props.stockData.length;

  return [
    {
      label: "平均发行价",
      value: avgPrice.toFixed(2),
      unit: "元"
    },
    {
      label: "平均市盈率",
      value: avgPE.toFixed(2),
      unit: ""
    },
    {
      label: "今日新股数量",
      value: props.stockData.length,
      unit: "只"
    },
    {
      label: "平均涨幅",
      value: (
        props.stockData.reduce(
          (acc, cur: StockData) => acc + (cur.zf || 0),
          0
        ) / props.stockData.length
      ).toFixed(2),
      unit: "%"
    }
  ];
});

const chartRef = ref();
let myChart: any = null;

const initChart = () => {
  if (!props.stockData.length) return;

  const option = {
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: ["发行价", "市盈率"]
    },
    xAxis: {
      type: "category",
      data: props.stockData.map((item: StockData) => item.zqjc),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: [
      {
        type: "value",
        name: "发行价(元)",
        position: "left"
      },
      {
        type: "value",
        name: "市盈率",
        position: "right"
      }
    ],
    series: [
      {
        name: "发行价",
        type: "bar",
        data: props.stockData.map((item: StockData) => item.fxjg),
        yAxisIndex: 0
      },
      {
        name: "市盈率",
        type: "line",
        data: props.stockData.map((item: StockData) => item.syl),
        yAxisIndex: 1
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

watch(
  () => props.stockData,
  () => {
    initChart();
  },
  { deep: true }
);
</script>

<style scoped>
.summary-item {
  text-align: center;
}

.label {
  font-size: 20px;
  color: #666;
  margin-bottom: 8px;
}

.value {
  font-size: 20px;
  font-weight: bold;
}
</style>
