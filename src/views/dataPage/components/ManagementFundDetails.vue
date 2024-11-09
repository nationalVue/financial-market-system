<script setup lang="ts">
import { ref } from "vue";
import * as echarts from "echarts";
import { onMounted, onUnmounted } from "vue";
import InstitutionTypeChart from "./InstitutionTypeChart.vue";
import InstitutionScaleChart from "./InstitutionScaleChart.vue";

// 私募资管概览数据
const overviewData = ref({
  productCount: 33899,
  fundScale: 12.53,
  managerCount: 561
});

// 左侧菜单数据
const menuItems = [
  "按机构类型分私募资管产品备案通过情况（产品数量）",
  "按机构类型分私募资管产品备案通过情况（设立规模）",
  "按产品类型分私募资管产品备案通过情况（产品数量）",
  "按产品类型分私募资管产品备案通过情况（设立规模）",
  "按投资类型分私募资管产品备案通过情况（产品数量）",
  "按投资类型分私募资管产品备案通过情况（设立规模）",
  "按机构类型分私募资管产品存量（产品数量）",
  "按机构类型分私募资管产品存量（产品规模）",
  "按产品类型分私募资管产品存量（产品数量）",
  "按产品类型分私募资管产品存量（产品规模）",
  "按投资类型分私募资管产品存量（产品数量）",
  "按投资类型分私募资管产品存量（产品规模）"
];

const activeMenuItem = ref("按机构类型分私募资管产品备案通过情况（产品数量）");

// 图表实例引用
let currentChart: echarts.ECharts | null = null;

const handleMenuClick = (item: string) => {
  activeMenuItem.value = item;
  // 根据选中的菜单项更新图表
  updateChart();
};

// 更新图表
const updateChart = () => {
  if (!currentChart) return;

  // 根据不同的菜单项设置不同的图表配置
  let option;
  switch (activeMenuItem.value) {
    case "按机构类型分私募资管产品备案通过情况（产品数量）":
      option = {
        title: {
          text: "机构类型分布（产品数量）",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}只 ({d}%)"
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            data: [
              { value: 15000, name: "证券公司" },
              { value: 10000, name: "基金管理公司" },
              { value: 8000, name: "期货公司" },
              { value: 5000, name: "信托公司" },
              { value: 3000, name: "其他" }
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
      break;
    // 可以添加更多case来处理其他菜单项
    default:
      option = {
        title: {
          text: activeMenuItem.value,
          left: "center"
        }
      };
  }

  currentChart.setOption(option);
};

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById("detailChart");
  if (!chartDom) return;

  currentChart = echarts.init(chartDom);
  updateChart();
};

// 处理窗口大小改变
const handleResize = () => {
  currentChart?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

// 在组件卸载时清理资源
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  currentChart?.dispose();
  currentChart = null;
});
</script>

<template>
  <div class="management-fund-details">
    <!-- 行业数据标题 -->
    <div class="industry-title">私募资管行业数据</div>

    <!-- 行业数据概览 -->
    <div class="industry-overview">
      <div class="overview-box">
        <div class="number">
          {{ overviewData.productCount }}<span class="unit">/只</span>
        </div>
        <div class="label">产品数量</div>
      </div>
      <div class="divider" />
      <div class="overview-box">
        <div class="number">
          {{ overviewData.fundScale }}<span class="unit">/万亿元</span>
        </div>
        <div class="label">产品规模</div>
      </div>
      <div class="divider" />
      <div class="overview-box">
        <div class="number">
          {{ overviewData.managerCount }}<span class="unit">/家</span>
        </div>
        <div class="label">管理人数量</div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 左侧菜单 -->
      <div class="menu-section">
        <div class="menu-list">
          <div
            v-for="item in menuItems"
            :key="item"
            class="menu-item"
            :class="{ active: activeMenuItem === item }"
            @click="handleMenuClick(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div id="detailChart" style="width: 100%; height: 100%" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.management-fund-details {
  padding: 20px;

  .industry-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .industry-overview {
    background: linear-gradient(
      to bottom,
      rgba(44, 62, 80, 0.95),
      rgba(58, 74, 93, 0.95)
    );
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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
      background: inherit;
      z-index: -1;
    }

    .overview-box {
      flex: 1;
      text-align: center;

      .number {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

        .unit {
          font-size: 16px;
          margin-left: 4px;
          opacity: 0.8;
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

  .content-section {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    height: 600px;

    .menu-section {
      width: 300px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: 100%;

      .menu-list {
        height: 100%;
        padding: 15px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #e0e0e0;
          border-radius: 2px;

          &:hover {
            background-color: #c0c0c0;
          }
        }

        &::-webkit-scrollbar-track {
          background-color: transparent;
        }

        .menu-item {
          padding: 20px 16px;
          cursor: pointer;
          border-radius: 6px;
          font-size: 20px;
          line-height: 1.5;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          word-break: break-all;

          &:hover {
            background-color: #f5f5f5;
            color: #c23531;
            transform: translateX(5px);
          }

          &.active {
            background-color: #c23531;
            color: white;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(194, 53, 49, 0.2);
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .content-area {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      min-width: 0;
      width: 100%;

      > * {
        width: 100%;
        max-width: 100%;
      }

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #e0e0e0;
        border-radius: 2px;

        &:hover {
          background-color: #c0c0c0;
        }
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
  }
}
</style>
