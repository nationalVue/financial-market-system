<template>
  <div class="stock-list-container">
    <div class="table-grid">
      <!-- 左侧表格 -->
      <el-card class="stock-card">
        <template #header>
          <div class="card-header">
            <span class="title-text">A股列表</span>
            <el-input
              v-model="searchKeywords.left"
              placeholder="搜索"
              clearable
              style="width: 150px"
              @input="handleSearch('left')"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </template>
        <div class="table-container">
          <el-table
            :data="filteredStockLists.left"
            height="calc(100% - 80px)"
            border
            :header-cell-style="headerStyle"
          >
            <el-table-column prop="dm" label="股票代码" width="33.33%" />
            <el-table-column prop="mc" label="股票名称" width="33.33%" />
            <el-table-column prop="jys" label="交易所" width="33.33%">
              <template #default="scope">
                {{ formatExchange(scope.row.jys) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage.left"
              :page-size="pageSize"
              :total="totalCounts.left"
              layout="total, prev, pager, next"
              @current-change="page => handlePageChange(page, 'left')"
            />
          </div>
        </div>
      </el-card>

      <!-- 中间表格 -->
      <el-card class="stock-card">
        <template #header>
          <div class="card-header">
            <span class="title-text">港股列表</span>
            <el-input
              v-model="searchKeywords.middle"
              placeholder="搜索"
              clearable
              style="width: 150px"
              @input="handleSearch('middle')"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </template>
        <div class="table-container">
          <el-table
            :data="filteredStockLists.middle"
            height="calc(100% - 50px)"
            border
            :header-cell-style="headerStyle"
          >
            <el-table-column prop="dm" label="股票代码" width="33.33%" />
            <el-table-column prop="mc" label="股票名称" width="33.33%" />
            <el-table-column prop="jys" label="交易所" width="33.33%">
              <template #default="scope">
                {{ formatExchange(scope.row.jys) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage.middle"
              :page-size="pageSize"
              :total="totalCounts.middle"
              layout="total, prev, pager, next"
              @current-change="page => handlePageChange(page, 'middle')"
            />
          </div>
        </div>
      </el-card>

      <!-- 右侧表格 -->
      <el-card class="stock-card">
        <template #header>
          <div class="card-header">
            <span class="title-text">美股列表</span>
            <el-input
              v-model="searchKeywords.right"
              placeholder="搜索"
              clearable
              style="width: 150px"
              @input="handleSearch('right')"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </template>
        <div class="table-container">
          <el-table
            :data="filteredStockLists.right"
            height="calc(100% - 50px)"
            border
            :header-cell-style="headerStyle"
          >
            <el-table-column prop="dm" label="股票代码" width="33.33%" />
            <el-table-column prop="mc" label="股票名称" width="33.33%" />
            <el-table-column prop="jys" label="交易所" width="33.33%">
              <template #default="scope">
                {{ formatExchange(scope.row.jys) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage.right"
              :page-size="pageSize"
              :total="totalCounts.right"
              layout="total, prev, pager, next"
              @current-change="page => handlePageChange(page, 'right')"
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import * as echarts from "echarts";

interface StockItem {
  dm: string;
  mc: string;
  jys: string;
}

// 为每个表格创建独立的数据源
const stockLists = ref({
  left: [] as StockItem[],
  middle: [] as StockItem[],
  right: [] as StockItem[]
});

const searchKeywords = ref({
  left: "",
  middle: "",
  right: ""
});

const pageSize = 30; // 每页显示30条数据
const currentPage = ref({
  left: 1,
  middle: 1,
  right: 1
});

const totalCounts = computed(() => ({
  left: stockLists.value.left.length,
  middle: stockLists.value.middle.length,
  right: stockLists.value.right.length
}));

// 获取股票列表数据
const fetchStockList = async () => {
  try {
    const response = await axios.get(
      "http://api.mairui.club/hslt/list/b997d4403688d5e65a"
    );
    const data = response.data;

    // 将数据平均分配给三个表格
    const chunkSize = Math.ceil(data.length / 3);
    stockLists.value.left = data.slice(0, chunkSize);
    stockLists.value.middle = data.slice(chunkSize, chunkSize * 2);
    stockLists.value.right = data.slice(chunkSize * 2);
  } catch (error) {
    console.error("获取股票列表失败:", error);
  }
};

// 格式化交易所显示
const formatExchange = (jys: string) => {
  const exchangeMap: Record<string, string> = {
    sh: "上交所",
    sz: "深交所"
  };
  return exchangeMap[jys] || jys;
};

// 搜索过滤
const filteredStockLists = computed(() => {
  const filtered = {
    left: [] as StockItem[],
    middle: [] as StockItem[],
    right: [] as StockItem[]
  };

  // 为每个表格应用过滤和分页
  Object.keys(filtered).forEach((key: keyof typeof filtered) => {
    let result = stockLists.value[key];

    // 搜索过滤
    if (searchKeywords.value[key]) {
      const keyword = searchKeywords.value[key].toLowerCase();
      result = result.filter(
        (item: StockItem) =>
          item.dm.toLowerCase().includes(keyword) ||
          item.mc.toLowerCase().includes(keyword)
      );
    }

    // 分页
    const start = (currentPage.value[key] - 1) * pageSize;
    filtered[key] = result.slice(start, start + pageSize);
  });

  return filtered;
});

const handlePageChange = (
  page: number,
  section: keyof typeof currentPage.value
) => {
  currentPage.value[section] = page;
};

const handleSearch = (section: keyof typeof searchKeywords.value) => {
  currentPage.value[section] = 1; // 搜索时重置页码
};

// 修改表头样式，使用正确的 CSS 属性类型
const headerStyle = {
  backgroundColor: "#2c3e50", // 使用 backgroundColor 而不是 background
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "20px",
  textAlign: "center" as const, // 使用类型断言确保类型正确
  height: "45px",
  padding: "0",
  borderRight: "1px solid #dfe6ec"
} as const;

onMounted(() => {
  fetchStockList();
});
</script>

<style scoped>
.stock-list-container {
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: 100%;
}

.stock-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stock-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.title-text {
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-right: auto;
}

/* 确保表格内容区域可以正确滚动 */
:deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

/* 调整表格样式以适应较窄的空间 */
:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table td),
:deep(.el-table th) {
  padding: 6px 0;
}

.table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.pagination-container {
  padding: 15px 0;
  display: flex;
  justify-content: center;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  border-top: 1px solid #dfe6ec;
}

/* 调整表格自适应 */
:deep(.el-table) {
  flex: 1;
}

:deep(.el-card__body) {
  padding: 10px !important;
  height: calc(100% - 80px) !important;
  position: relative;
}

/* 确保最后一列自适应 */
:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}

/* 调整表格样式 */
:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table td) {
  text-align: center !important; /* 单元格内容居中 */
}

:deep(.el-table--border th) {
  border-right: 1px solid #dfe6ec !important;
}

/* 鼠标悬停效果 */
:deep(.el-table tbody tr:hover td) {
  background-color: #f5f7fa !important;
}

/* 确保表格列宽平均分布 */
:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper) {
  width: 100% !important;
}

:deep(.el-table__header),
:deep(.el-table__body) {
  width: 100% !important;
  table-layout: fixed !important;
}

/* 调整表格边框 */
:deep(.el-table--border) {
  border: 1px solid #dfe6ec;
}

:deep(.el-table td),
:deep(.el-table th) {
  padding: 8px 0;
}

/* 斑马纹样式 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}
</style>
