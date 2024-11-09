<script setup lang="ts">
import { ref } from "vue";

const currentMonth = ref("09");

// 生成月份选项
const monthOptions = [
  { value: "09", label: "9月" },
  { value: "08", label: "8月" },
  { value: "07", label: "7月" },
  { value: "06", label: "6月" },
  { value: "05", label: "5月" },
  { value: "04", label: "4月" },
  { value: "03", label: "3月" },
  { value: "02", label: "2月" },
  { value: "01", label: "1月" }
];

const tableData = ref([
  {
    type: "封闭式基金",
    count: "1342",
    shares: "35551.88",
    netValue: "38300.23"
  },
  {
    type: "开放式基金",
    count: "10833",
    shares: "257334.57",
    netValue: "282381.76"
  },
  {
    type: "其中：股票基金",
    count: "2531",
    shares: "30429.61",
    netValue: "42703.60"
  },
  {
    type: "其中：混合基金",
    count: "5082",
    shares: "32573.66",
    netValue: "37465.16"
  },
  {
    type: "其中：货币市场基金",
    count: "371",
    shares: "130369.69",
    netValue: "130334.76"
  },
  {
    type: "其中：债券基金",
    count: "2849",
    shares: "63961.61",
    netValue: "65933.67"
  }
]);

const handleQuery = () => {
  // 处理查询逻辑
};

const handleDateChange = () => {
  handleQuery();
};

const handleExport = () => {
  // 处理导出逻辑
};
</script>

<template>
  <div class="fund-data-table">
    <!-- 查询条件 -->
    <div class="query-section">
      <div class="date-selector">
        <select
          v-model="currentMonth"
          class="month-select"
          @change="handleDateChange"
        >
          <option
            v-for="option in monthOptions"
            :key="option.value"
            :value="option.value"
          >
            2024年{{ option.label }}
          </option>
        </select>
      </div>
      <div class="buttons">
        <button class="query-btn" @click="handleQuery">查询</button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>类别</th>
            <th>封闭式基金</th>
            <th>开放式基金</th>
            <th>其中：股票基金</th>
            <th>其中：混合基金</th>
            <th>其中：货币市场基金</th>
            <th>其中：债券基金</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>基金数量(只)</td>
            <td v-for="(item, index) in tableData" :key="index">
              {{ item.count }}
            </td>
          </tr>
          <tr>
            <td>份额(亿份)</td>
            <td v-for="(item, index) in tableData" :key="index">
              {{ item.shares }}
            </td>
          </tr>
          <tr>
            <td>净值(亿元)</td>
            <td v-for="(item, index) in tableData" :key="index">
              {{ item.netValue }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 注释说明 -->
    <div class="note">
      注：表中"封闭式基金"包含申报为封闭运作和定期开放的基金。由于四舍五入原因，可能存在分项之和不等于合计的情形。基金数量统计不含已向证监会报送清盘的基金。数据来源于中国证监会。
    </div>
  </div>
</template>

<style scoped lang="scss">
.fund-data-table {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .query-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .date-selector {
      .month-select {
        padding: 8px 16px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        outline: none;
        min-width: 150px;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 16px;
        padding-right: 32px;

        &:hover {
          border-color: #c23531;
        }

        &:focus {
          border-color: #c23531;
          box-shadow: 0 0 0 2px rgba(194, 53, 49, 0.1);
        }
      }
    }

    .buttons {
      .query-btn {
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

  .table-container {
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;

      th,
      td {
        padding: 12px;
        text-align: center;
        border: 1px solid #ddd;
      }

      th {
        background-color: #f5f5f5;
        font-weight: normal;
      }

      tr:nth-child(even) {
        background-color: #fafafa;
      }
    }
  }

  .note {
    margin-top: 20px;
    color: #666;
    font-size: 12px;
    line-height: 1.5;
  }
}

.search-input {
  background-size: 16px;
  padding-right: 32px;

  input {
    &:focus {
      border-color: #c23531;
      box-shadow: 0 0 0 2px rgba(194, 53, 49, 0.1);
    }
  }
}
</style>
