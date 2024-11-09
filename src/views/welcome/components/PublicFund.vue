<script setup lang="ts">
import { ref } from "vue";

const selectedMonth = ref(9);
const months = ref([9, 8, 7, 6, 5, 4, 3, 2, 1]); // 可选月份列表

// 表格数据
const tableData = [
  {
    category: "封闭式基金",
    current: { number: 1342, shares: 35551.88, netValue: 38300.23 },
    previous: { number: 1347, shares: 35697.45, netValue: 38355.35 }
  },
  {
    category: "开放式基金",
    current: { number: 10833, shares: 257334.57, netValue: 282381.57 },
    previous: { number: 10785, shares: 260340.59, netValue: 270683.6 }
  },
  {
    category: "其中：股票基金",
    current: { number: 2531, shares: 30429.61, netValue: 42703.6 },
    previous: { number: 2505, shares: 29824.6, netValue: 32931.82 }
  },
  {
    category: "其中：混合基金",
    current: { number: 5082, shares: 32573.66, netValue: 37465.16 },
    previous: { number: 5075, shares: 32826.62, netValue: 33011.1 }
  },
  {
    category: "其中：债券基金",
    current: { number: 2544, shares: 58179.13, netValue: 65933.67 },
    previous: { number: 2529, shares: 57910.13, netValue: 65527.27 }
  },
  {
    category: "其中：货币基金",
    current: { number: 371, shares: 130369.69, netValue: 130334.76 },
    previous: { number: 371, shares: 133958.87, netValue: 133922.34 }
  },
  {
    category: "其中：QDII基金",
    current: { number: 305, shares: 5782.49, netValue: 5944.57 },
    previous: { number: 305, shares: 5820.37, netValue: 5291.06 }
  },
  {
    category: "合计",
    current: { number: 12175, shares: 292886.45, netValue: 320681.99 },
    previous: { number: 12132, shares: 296038.03, netValue: 309038.95 }
  }
];
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
        <h3>公募基金市场数据（2024年{{ selectedMonth }}月）</h3>
        <p>
          截至2024年{{
            selectedMonth
          }}月底，我国境内公募基金管理机构共163家，其中基金管理公司148家，取得公募资格的资产管理机构15家。以上机构管理的公募基金资产净值合计32.07万亿元。
        </p>

        <div class="fund-table">
          <table>
            <thead>
              <tr>
                <th rowspan="2">类别</th>
                <th colspan="3">本期</th>
                <th colspan="3">上期</th>
              </tr>
              <tr>
                <th>基金数量（只）</th>
                <th>份额（亿份）</th>
                <th>净值（亿元）</th>
                <th>基金数量（只）</th>
                <th>份额（亿份）</th>
                <th>净值（亿元）</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.category">
                <td>{{ item.category }}</td>
                <td>{{ item.current.number.toLocaleString() }}</td>
                <td>{{ item.current.shares.toLocaleString() }}</td>
                <td>{{ item.current.netValue.toLocaleString() }}</td>
                <td>{{ item.previous.number.toLocaleString() }}</td>
                <td>{{ item.previous.shares.toLocaleString() }}</td>
                <td>{{ item.previous.netValue.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "../index.scss";
</style>
