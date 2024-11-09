<script setup lang="ts">
import { ref } from "vue";

// 私募资管概览数据
const overviewData = ref({
  managerCount: 34,
  productCount: 67,
  fundScale: 122
});

// 区域数据
const regionData = [
  {
    region: "北京",
    managerCount: "89",
    productCount: "156",
    fundScale: "289"
  },
  {
    region: "上海",
    managerCount: "95",
    productCount: "178",
    fundScale: "312"
  },
  {
    region: "深圳",
    managerCount: "78",
    productCount: "143",
    fundScale: "267"
  },
  {
    region: "甘肃",
    managerCount: "34",
    productCount: "67",
    fundScale: "122"
  }
];
</script>

<template>
  <div class="management-fund-map">
    <!-- 行业数据标题 -->
    <div class="industry-title">私募资管行业数据</div>

    <!-- 行业数据概览 -->
    <div class="industry-overview">
      <div class="overview-box">
        <div class="icon">👥</div>
        <div class="content">
          <div class="value">{{ overviewData.managerCount }}</div>
          <div class="label">私募基金管理人数量（家）</div>
        </div>
      </div>
      <div class="overview-box">
        <div class="icon">📊</div>
        <div class="content">
          <div class="value">{{ overviewData.productCount }}</div>
          <div class="label">私募基金产品数量（只）</div>
        </div>
      </div>
      <div class="overview-box">
        <div class="icon">💰</div>
        <div class="content">
          <div class="value">{{ overviewData.fundScale }}</div>
          <div class="label">管理基金规模（亿元）</div>
        </div>
      </div>
    </div>

    <!-- 区域数据展示 -->
    <div class="region-section">
      <div class="region-grid">
        <div v-for="data in regionData" :key="data.region" class="region-card">
          <div class="region-header">{{ data.region }}</div>
          <div class="region-content">
            <div class="data-item">
              <div class="label">管理人数量（家）</div>
              <div class="value">{{ data.managerCount }}</div>
            </div>
            <div class="data-item">
              <div class="label">产品数量（只）</div>
              <div class="value">{{ data.productCount }}</div>
            </div>
            <div class="data-item">
              <div class="label">基金规模（亿元）</div>
              <div class="value">{{ data.fundScale }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="update-time">截至：2024年10月</div>
  </div>
</template>

<style lang="scss" scoped>
.management-fund-map {
  padding: 20px;

  .industry-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .industry-overview {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;

    .overview-box {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .icon {
        font-size: 24px;
        margin-right: 15px;
      }

      .content {
        .value {
          font-size: 24px;
          font-weight: bold;
          color: #c23531;
        }

        .label {
          font-size: 20px;
          color: #666;
          margin-top: 5px;
        }
      }
    }
  }

  .region-section {
    margin-bottom: 30px;

    .region-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;

      .region-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .region-header {
          background: #c23531;
          color: white;
          padding: 15px;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }

        .region-content {
          padding: 20px;

          .data-item {
            margin-bottom: 15px;

            &:last-child {
              margin-bottom: 0;
            }

            .label {
              color: #666;
              font-size: 14px;
              margin-bottom: 5px;
            }

            .value {
              font-size: 20px;
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
    }
  }

  .update-time {
    text-align: right;
    color: #c23531;
    font-size: 12px;
  }
}
</style>
