<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const selectedMonth = ref(9);
const months = ref([9, 8, 7, 6, 5, 4, 3, 2, 1]); // 可选月份列表

let privateChart: echarts.ECharts | null = null;

const initPrivateChart = () => {
  const chartDom = document.getElementById("privateChart");
  if (!chartDom) return;

  privateChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999"
        }
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    legend: {
      data: ["管理人数量（家）", "管理基金数量（只）", "管理基金规模（万亿元）"]
    },
    xAxis: [
      {
        type: "category",
        data: [
          "2023年9月",
          "2023年10月",
          "2023年11月",
          "2023年12月",
          "2024年1月",
          "2024年2月",
          "2024年3月",
          "2024年4月",
          "2024年5月",
          "2024年6月",
          "2024年7月",
          "2024年8月",
          "2024年9月"
        ],
        axisPointer: {
          type: "shadow"
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "数量",
        min: 0,
        max: 180000,
        interval: 20000
      },
      {
        type: "value",
        name: "规模",
        min: 19,
        max: 21,
        interval: 0.2,
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "管理人数量（家）",
        type: "bar",
        barWidth: 15,
        data: [
          21730, 21720, 21699, 21625, 21594, 21115, 21098, 21032, 20860, 20768,
          20732, 20505, 20457
        ]
      },
      {
        name: "管理基金数量（只）",
        type: "bar",
        barWidth: 15,
        data: [
          153985, 153387, 153698, 153079, 153288, 152659, 152794, 152001,
          151257, 150543, 148415, 147566, 147566
        ]
      },
      {
        name: "管理基金规模（万亿元）",
        type: "line",
        yAxisIndex: 1,
        data: [
          20.81, 20.59, 20.61, 20.58, 20.33, 20.28, 20.29, 19.9, 19.89, 19.89,
          19.69, 19.65, 19.64
        ]
      }
    ]
  };

  privateChart.setOption(option);
};

const handleResize = () => {
  if (privateChart) privateChart.resize();
};

onMounted(() => {
  nextTick(() => {
    initPrivateChart();
    window.addEventListener("resize", handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (privateChart) privateChart.dispose();
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
        <h3>私募基金管理人登记及产品备案月报（2024年{{ selectedMonth }}月）</h3>

        <div class="report-section">
          <h4>一、私募基金管理人登记总体情况</h4>

          <div class="subsection">
            <h5>（一）私募基金管理人月度登记情况</h5>
            <p>
              2024年{{
                selectedMonth
              }}月，在中国证券投资基金业协会（以下简称协会）资产管理业务综合报送平台（以下简称AMBERS系统）办理通过的机构17家，其中，私募证券投资基金管理人3家，私募股权、创业投资基金管理人14家。2024年{{
                selectedMonth
              }}月，协会注销私募基金管理人65家。
            </p>
          </div>

          <div class="subsection">
            <h5>（二）私募基金管理人存续情况</h5>
            <p>
              截至2024年{{
                selectedMonth
              }}月末，存续私募基金管理人20,457家，管理基金数量1147,566只，管理基金规模219.64万亿元。其中，私募证券投资基金管理人8,088家；私募股权、创业投资基金管理人12,152家；私募资产配置类基金管理人7家；其他私募投资基金管理人210家。
            </p>
          </div>

          <div class="notes">
            <p>
              1
              管理基金数量为正在运作的私募基金数量，包括自主发行类基金及顾问管理类基金。
            </p>
            <p>
              2
              管理基金规模为正在运作的私募基金规模；基金规模以季度运行表中填报的期末净资产为准，如相关基金新设立，暂未更新运行表，则以募集规模为准。
            </p>
          </div>
        </div>

        <div id="privateChart" class="chart-container" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.month-selector {
  padding: 20px;

  .fund-description {
    margin-top: 20px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 20px 0;
    }

    .report-section {
      margin: 20px 0;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 15px;
      }

      .subsection {
        margin: 15px 0;

        h5 {
          font-size: 20px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 10px;
        }

        p {
          font-size: 20px;
          color: #606266;
          line-height: 1.8;
          text-align: justify;
          margin-bottom: 10px;
        }
      }

      .notes {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px dashed #e4e7ed;

        p {
          font-size: 13px;
          color: #909399;
          line-height: 1.6;
          margin: 5px 0;
        }
      }
    }
  }

  .chart-container {
    width: 100%;
    height: 400px;
    margin-top: 20px;
  }
}

.scroll-container {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  padding-right: 10px;
}
</style>
