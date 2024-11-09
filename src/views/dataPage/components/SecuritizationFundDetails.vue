<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const pageTitle = ref("资产证券化行业数据");
const activeTab = ref("产品数量");

const statistics = ref([
  {
    value: "2282",
    unit: "只",
    label: "产品数量"
  },
  {
    value: "1.94",
    unit: "万亿元",
    label: "产品规模"
  },
  {
    value: "144",
    unit: "家",
    label: "管理人数量"
  }
]);

const tabs = [
  {
    label: "分类型资产证券化产品各案通过情况（产品数量）",
    key: "产品数量"
  },
  {
    label: "分类型资产证券化产品各案通过情况（备案规模）",
    key: "备案规模"
  }
];

const stockTabs = [
  {
    label: "分类型资产证券化产品存量（产品数量）",
    key: "存量产品数量"
  },
  {
    label: "分类型资产证券化产品存量（存续规模）",
    key: "存续规模"
  }
];

const activeStockTab = ref("存量产品数量");
const stockViewMode = ref("图");

const viewMode = ref("图");

const handleTabClick = (key: string) => {
  activeTab.value = key;
  if (viewMode.value === "图") {
    setTimeout(updateChart, 0);
  }
};

const switchViewMode = (mode: string) => {
  viewMode.value = mode;
  if (mode === "图") {
    setTimeout(initChart, 0);
  }
};

const handleStockTabClick = (key: string) => {
  activeStockTab.value = key;
  if (stockViewMode.value === "图") {
    setTimeout(updateStockChart, 0);
  }
};

const switchStockViewMode = (mode: string) => {
  stockViewMode.value = mode;
  if (mode === "图") {
    setTimeout(initStockChart, 0);
  }
};

const tableData = ref([
  {
    时间: "2023M8",
    债权类: 114,
    未来经营收入类: 6,
    REITs类: 2,
    其他: 0,
    合计: 122
  },
  {
    时间: "2023M9",
    债权类: 89,
    未来经营收入类: 3,
    REITs类: 2,
    其他: 1,
    合计: 95
  },
  {
    时间: "2023M10",
    债权类: 116,
    未来经营收入类: 5,
    REITs类: 3,
    其他: 0,
    合计: 124
  },
  {
    时间: "2023M11",
    债权类: 63,
    未来经营收入类: 1,
    REITs类: 2,
    其他: 1,
    合计: 67
  },
  {
    时间: "2023M12",
    债权类: 114,
    未来经营收入类: 2,
    REITs类: 6,
    其他: 3,
    合计: 125
  },
  {
    时间: "2024M1",
    债权类: 128,
    未来经营收入类: 3,
    REITs类: 7,
    其他: 1,
    合计: 139
  },
  {
    时间: "2024M2",
    债权类: 56,
    未来经营收入类: 2,
    REITs类: 7,
    其他: 1,
    合计: 66
  },
  {
    时间: "2024M3",
    债权类: 76,
    未来经营收入类: 1,
    REITs类: 6,
    其他: 0,
    合计: 83
  },
  {
    时间: "2024M5",
    债权类: 103,
    未来经营收入类: 3,
    REITs类: 2,
    其他: 1,
    合计: 109
  },
  {
    时间: "2024M6",
    债权类: 74,
    未来经营收入类: 1,
    REITs类: 4,
    其他: 0,
    合计: 79
  },
  {
    时间: "2024M7",
    债权类: 126,
    未来经营收入类: 4,
    REITs类: 5,
    其他: 0,
    合计: 135
  },
  {
    时间: "2024M8",
    债权类: 108,
    未来经营收入类: 5,
    REITs类: 6,
    其他: 0,
    合计: 119
  },
  {
    时间: "2024M9",
    债权类: 96,
    未来经营收入类: 2,
    REITs类: 11,
    其他: 0,
    合计: 109
  }
]);

const columns = ref([
  { title: "时间", key: "时间" },
  { title: "债权类（只）", key: "债权类" },
  { title: "未来经营收入类（只）", key: "未来经营收入类" },
  { title: "REITs类（只）", key: "REITs类" },
  { title: "其他（只）", key: "其他" },
  { title: "合计", key: "合计" }
]);

const scaleTableData = ref([
  {
    时间: "2023M8",
    债权类: 982.02,
    未来经营收入类: 79.26,
    REITs类: 27.91,
    其他: 0.0,
    合计: 1089.18
  },
  {
    时间: "2023M9",
    债权类: 729.92,
    未来经营收入类: 22.4,
    REITs类: 88.8,
    其他: 1.45,
    合计: 842.56
  },
  {
    时间: "2023M10",
    债权类: 870.78,
    未来经营收入类: 36.53,
    REITs类: 45.53,
    其他: 0.0,
    合计: 952.84
  },
  {
    时间: "2023M11",
    债权类: 563.04,
    未来经营收入类: 20.0,
    REITs类: 85.01,
    其他: 1.07,
    合计: 669.12
  },
  {
    时间: "2023M12",
    债权类: 899.16,
    未来经营收入类: 23.0,
    REITs类: 84.89,
    其他: 4.05,
    合计: 1011.1
  },
  {
    时间: "2024M1",
    债权类: 1282.81,
    未来经营收入类: 16.8,
    REITs类: 126.48,
    其他: 2.11,
    合计: 1428.2
  },
  {
    时间: "2024M2",
    债权类: 380.83,
    未来经营收入类: 8.16,
    REITs类: 208.86,
    其他: 2.0,
    合计: 599.84
  },
  {
    时间: "2024M3",
    债权类: 671.12,
    未来经营收入类: 15.0,
    REITs类: 85.82,
    其他: 0.0,
    合计: 771.94
  },
  {
    时间: "2024M5",
    债权类: 805.43,
    未来经营收入类: 44.16,
    REITs类: 9.43,
    其他: 1.35,
    合计: 860.37
  },
  {
    时间: "2024M6",
    债权类: 696.78,
    未来经营收入类: 3.2,
    REITs类: 95.49,
    其他: 0.0,
    合计: 795.47
  },
  {
    时间: "2024M7",
    债权类: 935.42,
    未来经营收入类: 27.95,
    REITs类: 134.14,
    其他: 0.0,
    合计: 1097.51
  },
  {
    时间: "2024M8",
    债权类: 894.02,
    未来经营收入类: 85.63,
    REITs类: 150.3,
    其他: 0.0,
    合计: 1129.96
  },
  {
    时间: "2024M9",
    债权类: 907.13,
    未来经营收入类: 9.6,
    REITs类: 221.74,
    其他: 0.0,
    合计: 1138.47
  }
]);

const scaleColumns = ref([
  { title: "时间", key: "时间" },
  { title: "债权类（亿元）", key: "债权类" },
  { title: "未来经营收入类（亿元）", key: "未来经营收入类" },
  { title: "REITs类（亿元）", key: "REITs类" },
  { title: "其他（亿元）", key: "其他" },
  { title: "合计", key: "合计" }
]);

const chartRef = ref();
let myChart: echarts.ECharts | null = null;

const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    updateChart();
  }
};

const updateChart = () => {
  if (!myChart) return;

  const isScale = activeTab.value === "备案规模";
  const data = isScale ? scaleTableData.value : tableData.value;
  const maxValue = isScale ? 1200 : 150;
  const suffix = isScale ? "（亿元）" : "（只）";

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: [
        `债权类${suffix}`,
        `未来经营收入类${suffix}`,
        `REITs类${suffix}`,
        `其他${suffix}`
      ],
      bottom: 40,
      textStyle: {
        fontSize: 14
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: data.map(item => item.时间),
      axisLabel: {
        fontSize: 14
      }
    },
    yAxis: {
      type: "value",
      max: maxValue,
      axisLabel: {
        fontSize: 14
      }
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        start: 60,
        end: 100,
        bottom: 0
      }
    ],
    series: [
      {
        name: `债权类${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.债权类),
        itemStyle: {
          color: "#c12c1f"
        }
      },
      {
        name: `未来经营收入类${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.未来经营收入类),
        itemStyle: {
          color: "#ff9999"
        }
      },
      {
        name: `REITs类${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.REITs类),
        itemStyle: {
          color: "#ffcccc"
        }
      },
      {
        name: `其他${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.其他),
        itemStyle: {
          color: "#ffe6e6"
        }
      }
    ]
  };

  myChart.setOption(option);
};

const stockChartRef = ref();
let stockChart: echarts.ECharts | null = null;

const initStockChart = () => {
  if (stockChartRef.value) {
    stockChart = echarts.init(stockChartRef.value);
    updateStockChart();
  }
};

const updateStockChart = () => {
  if (!stockChart) return;

  const isScale = activeStockTab.value === "存续规模";
  const data = isScale ? stockScaleTableData.value : stockTableData.value;
  const maxValue = isScale ? 21000 : 2500;
  const suffix = isScale ? "（亿元）" : "（只）";

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: [
        `债权类${suffix}`,
        `未来经营收入类${suffix}`,
        `REITs类${suffix}`,
        `其他${suffix}`
      ],
      bottom: 40,
      textStyle: {
        fontSize: 14
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: data.map(item => item.时间),
      axisLabel: {
        fontSize: 14
      }
    },
    yAxis: {
      type: "value",
      max: maxValue,
      axisLabel: {
        fontSize: 14
      }
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        start: 60,
        end: 100,
        bottom: 0
      }
    ],
    series: [
      {
        name: `债权类${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.债权类),
        itemStyle: {
          color: "#c12c1f"
        }
      },
      {
        name: `未来经营收入类${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.未来经营收入类),
        itemStyle: {
          color: "#ff9999"
        }
      },
      {
        name: `REITs类${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.REITs类),
        itemStyle: {
          color: "#ffcccc"
        }
      },
      {
        name: `其他${suffix}`,
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: data.map(item => item.其他),
        itemStyle: {
          color: "#ffe6e6"
        }
      }
    ]
  };

  stockChart.setOption(option);
};

watch(viewMode, newVal => {
  if (newVal === "图") {
    setTimeout(initChart, 0);
  }
});

watch(activeTab, () => {
  if (viewMode.value === "图") {
    setTimeout(updateChart, 0);
  }
});

watch(stockViewMode, newVal => {
  if (newVal === "图") {
    setTimeout(initStockChart, 0);
  }
});

watch(activeStockTab, () => {
  if (stockViewMode.value === "图") {
    setTimeout(updateStockChart, 0);
  }
});

window.addEventListener("resize", () => {
  myChart?.resize();
  stockChart?.resize();
});

onMounted(() => {
  if (viewMode.value === "图") {
    initChart();
  }
  if (stockViewMode.value === "图") {
    initStockChart();
  }
});

// 添加存量产品数量的数据
const stockTableData = ref([
  {
    时间: "2023M8",
    债权类: 1919,
    未来经营收入类: 214,
    REITs类: 127,
    其他: 24,
    合计: 2284
  },
  {
    时间: "2023M9",
    债权类: 1924,
    未来经营收入类: 209,
    REITs类: 128,
    其他: 23,
    合计: 2284
  },
  {
    时间: "2023M10",
    债权类: 1950,
    未来经营收入类: 208,
    REITs类: 129,
    其他: 21,
    合计: 2308
  },
  {
    时间: "2023M11",
    债权类: 1919,
    未来经营收入类: 204,
    REITs类: 131,
    其他: 20,
    合计: 2274
  },
  {
    时间: "2023M12",
    债权类: 1909,
    未来经营收入类: 204,
    REITs类: 135,
    其他: 20,
    合计: 2268
  },
  {
    时间: "2024M1",
    债权类: 1954,
    未来经营收入类: 198,
    REITs类: 142,
    其他: 19,
    合计: 2313
  },
  {
    时间: "2024M2",
    债权类: 1934,
    未来经营收入类: 196,
    REITs类: 147,
    其他: 19,
    合计: 2296
  },
  {
    时间: "2024M3",
    债权类: 1928,
    未来经营收入类: 194,
    REITs类: 153,
    其他: 19,
    合计: 2294
  },
  {
    时间: "2024M5",
    债权类: 1898,
    未来经营收入类: 187,
    REITs类: 156,
    其他: 18,
    合计: 2259
  },
  {
    时间: "2024M6",
    债权类: 1881,
    未来经营收入类: 184,
    REITs类: 160,
    其他: 18,
    合计: 2243
  },
  {
    时间: "2024M7",
    债权类: 1909,
    未来经营收入类: 185,
    REITs类: 165,
    其他: 17,
    合计: 2276
  },
  {
    时间: "2024M8",
    债权类: 1910,
    未来经营收入类: 187,
    REITs类: 170,
    其他: 16,
    合计: 2283
  },
  {
    时间: "2024M9",
    债权类: 1906,
    未来经营收入类: 184,
    REITs类: 177,
    其他: 15,
    合计: 2282
  }
]);

// 添加存量产品数量的列定义
const stockColumns = ref([
  { title: "时间", key: "时间" },
  { title: "债权类（只）", key: "债权类" },
  { title: "未来经营收入类（只）", key: "未来经营收入类" },
  { title: "REITs类（只）", key: "REITs类" },
  { title: "其他（只）", key: "其他" },
  { title: "合计", key: "合计" }
]);

// 添加存续规模的数据
const stockScaleTableData = ref([
  {
    时间: "2023M8",
    债权类: 19190.02,
    未来经营收入类: 2140.26,
    REITs类: 1270.91,
    其他: 240.0,
    合计: 22840.18
  },
  {
    时间: "2023M9",
    债权类: 19240.92,
    未来经营收入类: 2090.4,
    REITs类: 1280.8,
    其他: 230.45,
    合计: 22840.56
  },
  {
    时间: "2023M10",
    债权类: 19500.78,
    未来经营收入类: 2080.53,
    REITs类: 1290.53,
    其他: 210.0,
    合计: 23080.84
  },
  {
    时间: "2023M11",
    债权类: 19190.04,
    未来经营收入类: 2040.0,
    REITs类: 1310.01,
    其他: 200.07,
    合计: 22740.12
  },
  {
    时间: "2023M12",
    债权类: 19090.16,
    未来经营收入类: 2040.0,
    REITs类: 1350.89,
    其他: 200.05,
    合计: 22680.1
  },
  {
    时间: "2024M1",
    债权类: 19540.81,
    未来经营收入类: 1980.8,
    REITs类: 1420.48,
    其他: 190.11,
    合计: 23130.2
  },
  {
    时间: "2024M2",
    债权类: 19340.83,
    未来经营收入类: 1960.16,
    REITs类: 1470.86,
    其他: 190.0,
    合计: 22960.84
  },
  {
    时间: "2024M3",
    债权类: 19280.12,
    未来经营收入类: 1940.0,
    REITs类: 1530.82,
    其他: 190.0,
    合计: 22940.94
  },
  {
    时间: "2024M5",
    债权类: 18980.43,
    未来经营收入类: 1870.16,
    REITs类: 1560.43,
    其他: 180.35,
    合计: 22590.37
  },
  {
    时间: "2024M6",
    债权类: 18810.78,
    未来经营收入类: 1840.2,
    REITs类: 1600.49,
    其他: 180.0,
    合计: 22430.47
  },
  {
    时间: "2024M7",
    债权类: 19090.42,
    未来经营收入类: 1850.95,
    REITs类: 1650.14,
    其他: 170.0,
    合计: 22760.51
  },
  {
    时间: "2024M8",
    债权类: 19100.02,
    未来经营收入类: 1870.63,
    REITs类: 1700.3,
    其他: 160.0,
    合计: 22830.96
  },
  {
    时间: "2024M9",
    债权类: 19060.13,
    未来经营收入类: 1840.6,
    REITs类: 1770.74,
    其他: 150.0,
    合计: 22820.47
  }
]);

// 添加存续规模的列定义
const stockScaleColumns = ref([
  { title: "时间", key: "时间" },
  { title: "债权类（亿元）", key: "债权类" },
  { title: "未来经营收入类（亿元）", key: "未来经营收入类" },
  { title: "REITs类（亿元）", key: "REITs类" },
  { title: "其他（亿元）", key: "其他" },
  { title: "合计", key: "合计" }
]);
</script>

<template>
  <div class="asset-securitization-container">
    <!-- 标题区域 -->
    <div class="page-header">
      <div class="title-wrapper">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <p class="page-description" />
      </div>
    </div>

    <!-- 数据统计区域 -->
    <div class="statistics-wrapper">
      <div class="statistics-content">
        <div v-for="(item, index) in statistics" :key="index" class="stat-item">
          <div class="stat-value">
            <span class="number">{{ item.value }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <div class="section">
        <div class="tabs-container">
          <div class="tabs-wrapper">
            <div
              v-for="tab in tabs"
              :key="tab.key"
              class="tab-item"
              :class="{ active: activeTab === tab.key }"
              @click="handleTabClick(tab.key)"
            >
              {{ tab.label }}
            </div>
          </div>
          <div class="view-mode-switch">
            <div
              class="mode-item"
              :class="{ active: viewMode === '图' }"
              @click="switchViewMode('图')"
            >
              图
            </div>
            <div
              class="mode-item"
              :class="{ active: viewMode === '表' }"
              @click="switchViewMode('表')"
            >
              表
            </div>
          </div>
        </div>
        <div v-if="viewMode === '图'" ref="chartRef" class="chart-container" />
        <div v-if="viewMode === '表'" class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th
                  v-for="col in activeTab === '产品数量'
                    ? columns
                    : scaleColumns"
                  :key="col.key"
                >
                  {{ col.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in activeTab === '产品数量'
                  ? tableData
                  : scaleTableData"
                :key="index"
              >
                <td
                  v-for="col in activeTab === '产品数量'
                    ? columns
                    : scaleColumns"
                  :key="col.key"
                >
                  {{ row[col.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="tabs-container">
          <div class="tabs-wrapper">
            <div
              v-for="tab in stockTabs"
              :key="tab.key"
              class="tab-item"
              :class="{ active: activeStockTab === tab.key }"
              @click="handleStockTabClick(tab.key)"
            >
              {{ tab.label }}
            </div>
          </div>
          <div class="view-mode-switch">
            <div
              class="mode-item"
              :class="{ active: stockViewMode === '图' }"
              @click="switchStockViewMode('图')"
            >
              图
            </div>
            <div
              class="mode-item"
              :class="{ active: stockViewMode === '表' }"
              @click="switchStockViewMode('表')"
            >
              表
            </div>
          </div>
        </div>
        <div
          v-if="stockViewMode === '图'"
          ref="stockChartRef"
          class="chart-container"
        />
        <div v-if="stockViewMode === '表'" class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th
                  v-for="col in activeStockTab === '存量产品数量'
                    ? stockColumns
                    : stockScaleColumns"
                  :key="col.key"
                >
                  {{ col.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in activeStockTab === '存量产品数量'
                  ? stockTableData
                  : stockScaleTableData"
                :key="index"
              >
                <td
                  v-for="col in activeStockTab === '存量产品数量'
                    ? stockColumns
                    : stockScaleColumns"
                  :key="col.key"
                >
                  {{ row[col.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.asset-securitization-container {
  margin: 0 30px;

  .page-header {
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 16px;

    .title-wrapper {
      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #1f2329;
        margin-bottom: 8px;
        line-height: 32px;
      }

      .page-description {
        font-size: 20px;
        color: #fff;
        margin: 0;
        line-height: 22px;
      }
    }
  }

  .statistics-wrapper {
    background: url("@/assets/data_bg.jpg") center center/cover;
    border-radius: 8px;
    margin-bottom: 24px;
    padding: 40px 24px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -16px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #c12c1f;
    }

    .statistics-content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      min-height: 120px;

      .stat-item {
        text-align: center;
        position: relative;
        color: #fff;
        padding: 20px 40px;

        &:not(:last-child)::after {
          content: "";
          position: absolute;
          right: -50%;
          top: 50%;
          transform: translateY(-50%);
          height: 60px;
          width: 1px;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .stat-value {
          margin-bottom: 12px;

          .number {
            font-size: 42px;
            font-weight: bold;
            margin-right: 8px;
            color: #fff;
          }

          .unit {
            font-size: 16px;
            opacity: 0.9;
            color: #fff;
          }
        }

        .stat-label {
          font-size: 16px;
          opacity: 0.9;
          color: #fff;
        }
      }
    }
  }

  .content-wrapper {
    .section {
      margin-bottom: 50px;
    }

    .tabs-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      .tabs-wrapper {
        display: flex;
        gap: 0;
        justify-content: center;
        border: 1px solid #e4e7ed;
        border-radius: 16px;
        overflow: hidden;

        .tab-item {
          padding: 12px 30px;
          cursor: pointer;
          font-size: 24px;
          color: #666;
          background-color: #fff;
          transition: all 0.3s;
          border-right: 1px solid #e4e7ed;
          min-width: 400px;
          text-align: center;

          &:last-child {
            border-right: none;
          }

          &.active {
            background-color: #c12c1f;
            color: #fff;
          }

          &:hover:not(.active) {
            background-color: #f5f7fa;
          }
        }
      }

      .view-mode-switch {
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #ddd;

        .mode-item {
          padding: 8px 20px;
          cursor: pointer;
          font-size: 18px;
          background-color: #fff;
          color: #666;
          transition: all 0.3s;

          &.active {
            background-color: #c12c1f;
            color: #fff;
          }

          &:first-child {
            border-right: 1px solid #ddd;
          }
        }
      }
    }

    .table-container {
      margin-top: 24px;
      width: 100%;
      overflow-x: auto;

      .data-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;

        th,
        td {
          padding: 20px;
          border: 1px solid #e4e7ed;
          font-size: 15px;
        }

        th {
          background-color: #f5f7fa;
          color: #606266;
          font-weight: 600;
        }

        tr:hover {
          background-color: #f5f7fa;
        }

        td {
          color: #606266;
        }
      }
    }

    .chart-container {
      width: 100%;
      height: 600px;
      margin-top: 24px;
    }
  }
}
</style>
