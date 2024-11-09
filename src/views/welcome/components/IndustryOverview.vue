<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const activeChart = ref("rose");
let roseChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

// 初始化玫瑰图
const initRoseChart = (chartDom: HTMLElement) => {
  roseChart = echarts.init(chartDom);

  const option = {
    title: {
      text: "资产管理总规模分布",
      left: "5%",
      top: 10,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#303133",
        fontFamily: "SimHei"
      }
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}亿元 ({d}%)"
    },
    series: [
      {
        name: "资产规模",
        type: "pie",
        radius: ["30%", "65%"],
        roseType: "area",
        center: ["50%", "55%"],
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: true,
          position: "outside",
          formatter: (params: any) => {
            return `${params.value}亿元`;
          },
          fontSize: 12,
          lineHeight: 16
        },
        labelLine: {
          length: 10,
          length2: 15,
          maxSurfaceAngle: 80
        },
        data: [
          {
            name: "公募基金",
            value: 320826.37,
            itemStyle: { color: "#FF6B6B" }
          },
          {
            name: "证券公司资管计划",
            value: 64196.86,
            itemStyle: { color: "#4ECDC4" }
          },
          {
            name: "基金公司资管计划",
            value: 47537.01,
            itemStyle: { color: "#45B7D1" }
          },
          {
            name: "基金公司管理的养老金",
            value: 52740.96,
            itemStyle: { color: "#96CEB4" }
          },
          {
            name: "基金子公司资管计划",
            value: 12232.34,
            itemStyle: { color: "#FFAD60" }
          },
          {
            name: "期货公司资管计划",
            value: 3275.19,
            itemStyle: { color: "#7DCFB6" }
          },
          {
            name: "私募基金",
            value: 196933.89,
            itemStyle: { color: "#FBD786" }
          },
          {
            name: "资产支持专项计划",
            value: 19074.18,
            itemStyle: { color: "#79CDCD" }
          }
        ]
      }
    ]
  };

  roseChart.setOption(option);
};

// 初始化柱状图
const initBarChart = (chartDom: HTMLElement) => {
  barChart = echarts.init(chartDom);

  const option = {
    title: {
      text: "产品数量统计",
      left: "5%",
      top: 10,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#303133",
        fontFamily: "SimHei"
      }
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}只",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#e4e7ed",
      borderWidth: 1,
      textStyle: {
        color: "#303133"
      },
      padding: [10, 15]
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "75%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: true,
          position: "outside",
          formatter: (params: any) => {
            return params.value >= 1000
              ? (params.value / 1000).toFixed(1) + "k"
              : params.value;
          },
          fontSize: 12,
          color: "#606266",
          lineHeight: 16
        },
        labelLine: {
          length: 15,
          length2: 20,
          maxSurfaceAngle: 80,
          smooth: true
        },
        data: [
          { name: "公募基金", value: 12036, itemStyle: { color: "#FF6B6B" } },
          {
            name: "证券公司资管计划",
            value: 20991,
            itemStyle: { color: "#4ECDC4" }
          },
          {
            name: "基金公司资管计划",
            value: 8064,
            itemStyle: { color: "#45B7D1" }
          },
          {
            name: "基金公司管理的养老金",
            value: 3102,
            itemStyle: { color: "#96CEB4" }
          },
          {
            name: "基金子公司资管计划",
            value: 2874,
            itemStyle: { color: "#FFAD60" }
          },
          {
            name: "期货公司资管计划",
            value: 2073,
            itemStyle: { color: "#7DCFB6" }
          },
          { name: "私募基金", value: 151198, itemStyle: { color: "#FBD786" } },
          {
            name: "资产支持专项计划",
            value: 2243,
            itemStyle: { color: "#79CDCD" }
          }
        ]
      }
    ]
  };

  barChart.setOption(option);
};

// 监听图表切换
watch(activeChart, newValue => {
  nextTick(() => {
    if (newValue === "rose" && roseChart) {
      roseChart.resize();
    } else if (newValue === "bar" && barChart) {
      barChart.resize();
    }
  });
});

const handleResize = () => {
  nextTick(() => {
    if (roseChart) {
      const container = document.getElementById("roseChart");
      if (container) {
        roseChart.resize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    }
    if (barChart) {
      const container = document.getElementById("barChart");
      if (container) {
        barChart.resize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    }
  });
};

onMounted(() => {
  nextTick(() => {
    const roseChartDom = document.getElementById("roseChart");
    const barChartDom = document.getElementById("barChart");

    if (roseChartDom) initRoseChart(roseChartDom);
    if (barChartDom) initBarChart(barChartDom);

    window.addEventListener("resize", handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (roseChart) roseChart.dispose();
  if (barChart) barChart.dispose();
});
</script>

<template>
  <div class="right-section">
    <div class="section-header">
      <div class="section-header-content">
        <div class="section-title">资产管理行业总貌</div>
        <div class="more-link">更多</div>
      </div>
      <div class="divider" />
    </div>
    <div class="chart-tabs">
      <div
        class="tab-item"
        :class="{ active: activeChart === 'rose' }"
        @click="activeChart = 'rose'"
      >
        <div class="tab-content">
          <span class="tab-title">资产管理总规模</span>
          <span class="tab-value">70.60万亿元</span>
        </div>
      </div>
      <div
        class="tab-item"
        :class="{ active: activeChart === 'bar' }"
        @click="activeChart = 'bar'"
      >
        <div class="tab-content">
          <span class="tab-title">产品数量</span>
          <span class="tab-value">201,964只</span>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <div
        id="roseChart"
        class="chart"
        :style="{
          display: activeChart === 'rose' ? 'block' : 'none',
          height: '100%'
        }"
      />
      <div
        id="barChart"
        class="chart"
        :style="{
          display: activeChart === 'bar' ? 'block' : 'none',
          height: '100%'
        }"
      />
      <div class="chart-notes">
        <p>1.总规模中剔除了私募基金顾问管理类产品与私募资管计划重复部分。</p>
        <p>
          2.养老金指基金管理公司管理的境内养老金，不含证券公司管理的养老金。
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "../index.scss";
</style>
