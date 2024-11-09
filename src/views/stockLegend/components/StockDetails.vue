<template>
  <el-card class="stock-details mt-4">
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="请输入股票名称或代码搜索"
        class="search-input"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-table
      :data="currentPageData"
      style="width: 100%; margin-top: 20px"
      highlight-current-row
      :header-cell-style="getHeaderCellStyle"
      :cell-style="getCellStyle"
      @row-click="handleRowClick"
    >
      <el-table-column prop="zqdm" label="证券代码" min-width="16.66%" />
      <el-table-column prop="zqjc" label="证券简称" min-width="16.66%" />
      <el-table-column prop="sgdm" label="申购代码" min-width="16.66%" />
      <el-table-column label="发行数量(万股)" min-width="16.66%">
        <template #default="{ row }">
          {{ (row.fxsl || 0) / 10000 }}
        </template>
      </el-table-column>
      <el-table-column prop="hysyl" label="行业市盈率" min-width="16.66%" />
      <el-table-column prop="zyyw" label="主营业务" min-width="16.66%">
        <template #default="{ row }">
          <div class="business-content">{{ row.zyyw }}</div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalItems"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import type { StockData } from "@/api/stock";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import * as echarts from "echarts";
const props = defineProps<{
  selectedStock: StockData | null;
  stockList: StockData[];
}>();

const emit = defineEmits<{
  (e: "search", query: string): void;
  (e: "select-stock", stock: StockData): void;
}>();

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const totalItems = computed(() => props.stockList.length);

const currentPageData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return props.stockList.slice(startIndex, endIndex);
});

const handleSearch = () => {
  emit("search", searchQuery.value);
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleRowClick = (row: StockData) => {
  emit("select-stock", row);
};

// 修改表格样式配置的类型
const headerStyle = {
  backgroundColor: "#f5f7fa",
  color: "#606266",
  fontWeight: "bold",
  fontSize: "20px",
  textAlign: "center" as const,
  height: "50px",
  padding: "0",
  width: "auto"
};

const cellStyle = {
  fontFamily: "SimHei, sans-serif",
  fontSize: "20px",
  textAlign: "center" as const,
  padding: "12px 0",
  height: "auto",
  lineHeight: "1.5",
  wordBreak: "break-all" as const,
  whiteSpace: "pre-wrap" as const
};

// 如果需要类型安全，可以定义具体的样式处理函数
const getHeaderCellStyle = () => headerStyle;
const getCellStyle = () => cellStyle;
</script>

<style scoped>
.stock-details {
  margin: 0;
  padding: 20px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.header-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 150px;
}

.label {
  font-size: 20px;
  color: #909399;
  margin-bottom: 8px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  text-align: center;
}

.zyyw-text {
  font-size: 20px;
  line-height: 1.4;
  max-width: 200px;
  white-space: normal;
  word-break: break-all;
}

.text-red {
  color: #f56c6c;
}

.text-green {
  color: #67c23a;
}

.mt-4 {
  margin-top: 16px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
}

.el-table {
  margin-top: 20px;
  height: calc(100vh - 300px); /* 适应屏幕高度 */
}

:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table .cell) {
  white-space: pre-wrap;
  line-height: 1.5;
  padding: 8px;
}

.business-content {
  text-align: left;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
  padding: 8px;
}

:deep(.el-table tbody tr) {
  cursor: pointer;
}

:deep(.el-table tbody tr:hover) {
  background-color: #f5f7fa;
}

:deep(.el-table .cell) {
  word-break: break-all;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* 确保内容可以换行显示 */
:deep(.el-table .cell) {
  word-break: break-all;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* 确保卡片占满整个容器 */
.stock-details {
  height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
