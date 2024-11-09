<script setup lang="ts">
import { ref } from "vue";
import { managementRankingData } from "../data/fundData";
const currentYear = ref("2024");
const currentQuarter = ref("第二季度");

const quarterOptions = [
  { value: "第二季度", label: "第二季度" },
  { value: "第一季度", label: "第一季度" }
];

const handleQuery = () => {
  // 处理查询逻辑
};
</script>

<template>
  <div class="fund-ranking-table">
    <div class="title">基金管理机构非货币公募基金月均规模排名</div>

    <!-- 查询条件 -->
    <div class="query-section">
      <div class="date-inputs">
        <input v-model="currentYear" type="text" class="year-input" disabled />
        <select v-model="currentQuarter" class="quarter-select">
          <option
            v-for="option in quarterOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="buttons">
        <button class="query-btn" @click="handleQuery">查询</button>
      </div>
    </div>

    <!-- 排名表格 -->
    <div class="ranking-table">
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>公募基金管理人名称</th>
            <th>非货币理财公募基金月均规模(亿元)</th>
            <th>排名</th>
            <th>公募基金管理人名称</th>
            <th>非货币理财公募基金月均规模(亿元)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td class="rank">{{ i }}</td>
            <td class="name">{{ managementRankingData[i - 1].name }}</td>
            <td class="scale">{{ managementRankingData[i - 1].scale }}</td>
            <td class="rank">{{ i + 5 }}</td>
            <td class="name">{{ managementRankingData[i + 4].name }}</td>
            <td class="scale">{{ managementRankingData[i + 4].scale }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fund-ranking-table {
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

  .query-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .date-inputs {
      display: flex;
      gap: 10px;

      .year-input {
        width: 100px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: center;
        background-color: #f5f5f5;
      }

      .quarter-select {
        width: 120px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
      }
    }

    .buttons {
      display: flex;
      gap: 10px;

      button {
        padding: 8px 24px;
        background-color: #c23531;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #d13f3a;
        }
      }
    }
  }

  .ranking-table {
    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: 12px 8px;
        text-align: center;
        border: 1px solid #ddd;
        font-size: 20px;
      }

      th {
        background-color: #f5f5f5;
        font-weight: 500;
        font-size: 20px;
      }

      .rank {
        color: #c23531;
        font-style: italic;
        width: 60px;
        text-align: center;
        font-weight: bold;
        font-size: 15px;
      }

      .name {
        min-width: 200px;
        text-align: center;
        font-size: 20px;
      }

      .scale {
        text-align: center;
        width: 180px;
        font-size: 20px;
        font-family: Arial, sans-serif;
      }

      tbody tr:hover {
        background-color: #f8f8f8;
      }
    }
  }
}
</style>
