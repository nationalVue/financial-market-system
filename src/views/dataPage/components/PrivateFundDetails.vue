<script setup lang="ts">
import { ref } from "vue";
import { privateFundOverview } from "../data/fundData";
import bgImage from "@/assets/data_bg.jpg";
import PrivateFundTable from "./PrivateFundTable.vue";
import PrivateFundDistribution from "./PrivateFundDistribution.vue";

// 私募基金概览数据
const overviewData = ref(privateFundOverview);
</script>

<template>
  <div class="private-fund-details">
    <!-- 行业数据标题 -->
    <div class="industry-title">私募基金行业数据</div>

    <!-- 行业数据概览 -->
    <div
      class="industry-overview"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
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

    <!-- 添加表格和图表组件 -->
    <PrivateFundTable />
    <PrivateFundDistribution />
  </div>
</template>

<style lang="scss" scoped>
.private-fund-details {
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
}
</style>
