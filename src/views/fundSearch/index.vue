<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { jsonp } from "@/utils/jsonp";
import { fundTypes } from "./constants/fundTypes";
import type { FundInfo, FundApiResponse } from "@/api/fund";

// 搜索相关
const searchCode = ref("");
const searchHistory = ref<FundInfo[]>([]);
const selectedType = ref("");

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 根据选择的类型筛选基金列表
const filteredFunds = computed(() => {
  if (!selectedType.value) {
    return searchHistory.value;
  }
  console.log("Selected type:", selectedType.value);
  return searchHistory.value.filter(fund => {
    console.log("Fund type:", fund.type, "Selected type:", selectedType.value);
    return fund.type === selectedType.value;
  });
});

// 计算分页后的数据
const paginatedFunds = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredFunds.value.slice(startIndex, endIndex).map(fund => ({
    code: fund.code,
    name: fund.name,
    type: fund.type,
    nav: fund.nav,
    dateNav: fund.dateNav,
    gsz: fund.gsz,
    gszzl: fund.gszzl,
    gztime: fund.gztime
  }));
});

// 搜索基金
const searchFund = async (code: string) => {
  const existingFund = searchHistory.value.find(fund => fund.code === code);
  if (existingFund) {
    ElMessage.warning("该基金已在列表中");
    return;
  }

  try {
    const timestamp = new Date().getTime();
    const result: FundApiResponse = await jsonp(
      `http://fundgz.1234567.com.cn/js/${code}.js?rt=${timestamp}`
    ).catch(() => {
      // 如果API调用失败，返回模拟数据
      const mockNav = (Math.random() * 2 + 1).toFixed(4);
      return {
        code: code,
        name: ``,
        nav: Number(mockNav),
        dateNav: new Date().toISOString().split("T")[0],
        type: fundTypes[Math.floor(Math.random() * fundTypes.length)].value,
        gsz: (Number(mockNav) * (1 + Math.random() * 0.02 - 0.01)).toFixed(4),
        gszzl: (Math.random() * 4 - 2).toFixed(2),
        gztime: new Date().toLocaleString("zh-CN")
      };
    });

    // 修改基金类型判断逻辑
    let fundType = "其他";
    const fundName = result.name.toLowerCase(); // 转换为小写以便比较

    if (fundName.includes("股票")) {
      fundType = "股票型";
    } else if (fundName.includes("债券")) {
      fundType = "债券型";
    } else if (fundName.includes("混合")) {
      fundType = "混合型";
    } else if (fundName.includes("指数")) {
      fundType = "指数型";
    } else if (fundName.includes("货币")) {
      fundType = "货币型";
    }

    // 确保与 fundTypes 中的类型值完全匹配
    const fundData: FundInfo = {
      code: result.fundcode || result.code,
      name: result.name,
      type: fundType,
      nav: Number(result.dwjz || result.nav),
      dateNav: result.jzrq || result.dateNav,
      gsz: result.gsz,
      gszzl: result.gszzl,
      gztime: result.gztime
    };

    searchHistory.value.unshift(fundData);
    searchCode.value = ""; // 清空搜索框
    ElMessage.success("添加成功");
  } catch (error) {
    ElMessage.error("获取基金信息失败");
    console.error(error);
  }
};

// 理类型变化
const handleTypeChange = (type: string) => {
  selectedType.value = type;
  currentPage.value = 1;
};

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

// 定时更新基金数据
const updateFundData = async () => {
  const timestamp = new Date().getTime();
  for (const fund of searchHistory.value) {
    try {
      const result = await jsonp(
        `http://fundgz.1234567.com.cn/js/${fund.code}.js?rt=${timestamp}`
      ).catch(() => {
        // 模拟数据更新
        const variation = (Math.random() * 0.4 - 0.2) / 100;
        const newNav = (fund.nav * (1 + variation)).toFixed(4);
        return {
          ...fund,
          nav: Number(newNav),
          gsz: (Number(newNav) * (1 + Math.random() * 0.02 - 0.01)).toFixed(4),
          gszzl: (Math.random() * 4 - 2).toFixed(2),
          gztime: new Date().toLocaleString("zh-CN")
        };
      });

      Object.assign(fund, {
        nav: Number(result.dwjz || result.nav),
        dateNav: result.jzrq || result.dateNav,
        gsz: result.gsz,
        gszzl: result.gszzl,
        gztime: result.gztime
      });
    } catch (error) {
      console.error("更新基金数据失败:", error);
    }
  }
};

// 每60秒更新一次数据
setInterval(updateFundData, 60000);

// 添加删除基金方法
const handleDeleteFund = (code: string) => {
  searchHistory.value = searchHistory.value.filter(fund => fund.code !== code);
  ElMessage.success("删除成功");

  // 如果当前页没有数据了，回到上一页
  if (paginatedFunds.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
};

// 在script setup部分，添加初始化模拟数据的函数
const initMockData = () => {
  const mockFunds = [
    {
      code: "000001",
      name: "华夏成长混合",
      type: "混合型",
      nav: 1.2345,
      dateNav: "2024-03-20",
      gsz: "1.2456",
      gszzl: "0.89",
      gztime: "2024-03-20 15:00"
    },
    {
      code: "000002",
      name: "华安创新股票",
      type: "股票型",
      nav: 2.3456,
      dateNav: "2024-03-20",
      gsz: "2.3789",
      gszzl: "-1.23",
      gztime: "2024-03-20 15:00"
    },
    {
      code: "000003",
      name: "易方达稳健债券",
      type: "债券型",
      nav: 1.0789,
      dateNav: "2024-03-20",
      gsz: "1.0823",
      gszzl: "0.31",
      gztime: "2024-03-20 15:00"
    },
    {
      code: "000004",
      name: "南方现金A",
      type: "货币型",
      nav: 1.0,
      dateNav: "2024-03-20",
      gsz: "1.0001",
      gszzl: "0.01",
      gztime: "2024-03-20 15:00"
    },
    {
      code: "000005",
      name: "嘉实沪深300ETF联接",
      type: "指数型",
      nav: 1.5678,
      dateNav: "2024-03-20",
      gsz: "1.5589",
      gszzl: "-0.57",
      gztime: "2024-03-20 15:00"
    }
  ];

  searchHistory.value = mockFunds;
};

// 在组件创建时初始化模拟数据
initMockData();
</script>

<template>
  <div class="fund-search-container">
    <div class="search-container">
      <div class="header-section">
        <div class="filter-section">
          <el-select
            v-model="selectedType"
            placeholder="选择基金类型"
            clearable
            class="filter-select"
            @change="handleTypeChange"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in fundTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="search-section">
          <el-input
            v-model="searchCode"
            placeholder="请输入基金代码"
            class="search-input"
            @keyup.enter="searchFund(searchCode)"
          >
            <template #append>
              <el-button type="primary" @click="searchFund(searchCode)">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <div class="fund-content-container">
        <div class="fund-header">
          <h2>我的基金</h2>
          <div class="fund-count">共 {{ filteredFunds.length }} 只基金</div>
        </div>

        <div class="fund-table-container">
          <el-table
            :data="paginatedFunds"
            style="width: 100%"
            border
            :empty-text="'暂无数据'"
            height="calc(100% - 60px)"
          >
            <el-table-column
              prop="code"
              label="基金代码"
              min-width="14%"
              align="center"
            />
            <el-table-column
              prop="name"
              label="基金名称"
              min-width="14%"
              align="center"
            />
            <el-table-column
              prop="type"
              label="基金类型"
              min-width="14%"
              align="center"
            />
            <el-table-column label="净值信息" min-width="16%" align="center">
              <template #default="{ row }">
                <div v-if="row" class="nav-info">
                  <div>净值：{{ row.nav }}</div>
                  <div>估值：{{ row.gsz }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="涨跌幅" min-width="12%" align="center">
              <template #default="{ row }">
                <span
                  v-if="row"
                  :class="{
                    red: Number(row.gszzl) > 0,
                    green: Number(row.gszzl) < 0
                  }"
                >
                  {{ row.gszzl }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column label="日期信息" min-width="16%" align="center">
              <template #default="{ row }">
                <div v-if="row" class="date-info">
                  <div>净值日期：{{ row.dateNav }}</div>
                  <div>估值时间：{{ row.gztime }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                <el-popconfirm
                  v-if="row"
                  title="确定删除该基金吗？"
                  @confirm="handleDeleteFund(row.code)"
                >
                  <template #reference>
                    <el-button type="danger" link> 删除 </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="paginatedFunds.length" class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="filteredFunds.length"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fund-search-container {
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--el-bg-color);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

.filter-section {
  flex: 1;
  margin-right: 40px;
}

.filter-select {
  width: 300px;
}

.search-section {
  flex: 2;
}

.search-input {
  width: 100%;
  max-width: 600px;
}

:deep(.el-select .el-input__wrapper) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  box-shadow: var(--el-box-shadow-lighter);
}

:deep(.el-button--primary) {
  padding: 12px 24px;
  font-weight: bold;
}

.search-container {
  display: flex;
  flex-direction: column;
}

.fund-content-container {
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
  height: calc(100vh - 140px); /* 减去上方搜索区域和padding的高度 */
  display: flex;
  flex-direction: column;
}

.fund-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.fund-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.fund-count {
  color: var(--el-text-color-secondary);
  font-size: 20px;
}

.fund-table-container {
  flex: 1;
  padding: 20px;
  height: calc(100% - 60px); /* 减去header的高度 */
  display: flex;
  flex-direction: column;
}

.result-section {
  height: 100%;
}

.pagination-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
}

:deep(.el-pagination) {
  justify-content: center;
}

.nav-info,
.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.red {
  color: #f56c6c;
}

.green {
  color: #67c23a;
}

:deep(.el-button--danger.el-button--link) {
  font-size: 13px;
}

:deep(.el-button--danger.el-button--link:hover) {
  color: var(--el-color-danger);
}

:deep(.el-popconfirm__main) {
  padding: 16px 0;
}

:deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
</style>
