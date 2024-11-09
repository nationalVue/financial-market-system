<template>
  <div class="stock-chart">
    <h2 class="text-xl font-bold mb-4">股票走势图</h2>
    <div ref="chartRef" style="width: 100%; height: 400px" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import type { StockData } from "@/api/stock";
import * as echarts from "echarts";

const props = defineProps({
  stockData: {
    type: Array as () => StockData[],
    required: true
  }
});

const chartRef = ref();
let myChart: any = null;

const initChart = () => {
  if (!props.stockData.length) return;

  const chartData = props.stockData.map((item: StockData) => ({
    name: item.zqjc,
    value: item.fxjg
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
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
      data: chartData.map(item => item.name),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: "value",
      name: "发行价(元)"
    },
    series: [
      {
        name: "发行价",
        type: "bar",
        data: chartData.map(item => item.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" }
          ])
        }
      }
    ]
  };

  myChart.setOption(option);
};

onMounted(() => {
  myChart = echarts.init(chartRef.value);
  initChart();

  window.addEventListener("resize", () => {
    myChart?.resize();
  });
});

watch(
  () => props.stockData,
  () => {
    initChart();
  },
  { deep: true }
);

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
  window.removeEventListener("resize", () => {
    myChart?.resize();
  });
});
</script>
