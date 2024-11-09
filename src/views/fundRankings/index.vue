<template>
  <div class="fund-rankings">
    <el-card class="ranking-card">
      <template #header>
        <div class="card-header">
          <span>基金排行榜</span>
          <el-select
            v-model="selectedType"
            placeholder="选择基金类型"
            clearable
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in fundTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>

      <el-table :data="filteredFundList" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="symbol" label="基金代码" min-width="10%" />
        <el-table-column prop="name" label="基金名称" min-width="16%" />
        <el-table-column prop="type" label="基金类型" min-width="11%" />
        <el-table-column label="单位净值" min-width="11%">
          <template #default="scope">
            {{ scope.row.per_nav || scope.row.netWorth }}
          </template>
        </el-table-column>

        <el-table-column label="近三个月(%)" min-width="11%">
          <template #default="scope">
            <span :class="getGrowthClass(scope.row.three_month)">
              {{ formatGrowth(scope.row.three_month) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="近六个月(%)" min-width="11%">
          <template #default="scope">
            <span :class="getGrowthClass(scope.row.six_month)">
              {{ formatGrowth(scope.row.six_month) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="近一年(%)" min-width="11%">
          <template #default="scope">
            <span :class="getGrowthClass(scope.row.one_year)">
              {{ formatGrowth(scope.row.one_year) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="今年以来" min-width="11%">
          <template #default="scope">
            <span :class="getGrowthClass(scope.row.form_year)">
              {{ formatGrowth(scope.row.form_year) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="成立以来" min-width="11%">
          <template #default="scope">
            <span :class="getGrowthClass(scope.row.form_start)">
              {{ formatGrowth(scope.row.form_start) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const fundList = ref([]);
const selectedType = ref("");

// 添加全部选项到基金类型选项中
const fundTypes = [
  { value: "", label: "全部" },
  { value: "混合型", label: "混合型" },
  { value: "债券型", label: "债券型" },
  { value: "股票型", label: "股票型" },
  { value: "指数型", label: "指数型" },
  { value: "ETF", label: "ETF" },
  { value: "QDII", label: "QDII" },
  { value: "保险型", label: "保险型" },
  { value: "纯债型", label: "纯债型" }
];

// 根据选择的类型过滤基金列表
const filteredFundList = computed(() => {
  if (!selectedType.value) {
    return fundList.value;
  }
  return fundList.value.filter(fund => fund.type === selectedType.value);
});

const handleTypeChange = (value: string) => {
  selectedType.value = value;
};

const getFundRankings = async () => {
  try {
    const response = await axios.get("/api/fund/rankings");
    fundList.value = response.data.data;
  } catch (error) {
    console.error("获取基金排行榜数据失败:", error);
  }
};

const formatGrowth = (value: string | number) => {
  if (
    value === "N/A" ||
    value === undefined ||
    value === "NaN%" ||
    Number.isNaN(value)
  ) {
    return "--";
  }
  return `${Number(value).toFixed(4)}%`;
};

const getGrowthClass = (value: string | number) => {
  if (value === "NaN%" || value === undefined) return "--";
  const numValue = Number(value);
  return {
    "text-red": numValue > 0,
    "text-green": numValue < 0
  };
};

onMounted(() => {
  getFundRankings();
});
</script>

<style scoped>
.fund-rankings {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.ranking-card {
  height: 100%;
  margin: 0;
}

.ranking-card :deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
}

:deep(.el-select) {
  width: 160px;
}

.text-red {
  color: #f56c6c;
}

.text-green {
  color: #67c23a;
}

:deep(.el-table) {
  height: 100%;
}

:deep(.el-table__header-wrapper th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
  text-align: center;
}

:deep(.el-table__cell) {
  text-align: center;
}
</style>
