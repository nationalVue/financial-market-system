<template>
  <div class="financial-news">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>作者/标题/摘要检索</span>
        </div>
      </template>

      <div class="search-form">
        <!-- 学科领域选择优化 -->
        <div class="field-section">
          <div class="section-title">
            <el-icon><Collection /></el-icon>
            <span>学科领域</span>
          </div>
          <div class="checkbox-group">
            <el-checkbox-group v-model="selectedFields">
              <el-checkbox label="econ">
                经济学
                <el-tooltip
                  content="计算经济学,普通经济学,理论经济学"
                  placement="top"
                >
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
              <el-checkbox label="qfin">
                量化金融
                <el-tooltip
                  content="计算金融,金融数学,投资组合管理"
                  placement="top"
                >
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
              <el-checkbox label="stat">
                统计学
                <el-tooltip
                  content="应用统计,计算统计,统计理论"
                  placement="top"
                >
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 修改搜索条件和时间范围的布局 -->
        <div class="search-row-container">
          <!-- 搜索条件 -->
          <div class="search-section">
            <div class="section-title">
              <el-icon><Search /></el-icon>
              <span>搜索条件</span>
            </div>
            <div class="search-row">
              <el-select v-model="searchField1" class="field-select">
                <el-option label="标题" value="ti" />
                <el-option label="作者" value="au" />
                <el-option label="摘要" value="abs" />
              </el-select>
              <el-input
                v-model="searchValue1"
                placeholder="输入搜索关键词"
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>

          <!-- 时间范围选择 -->
          <div class="date-section">
            <div class="section-title">
              <el-icon><Calendar /></el-icon>
              <span>发布时间</span>
            </div>
            <div class="date-range">
              <el-radio-group v-model="timeRangeType">
                <el-radio label="year">近一年</el-radio>
                <el-radio label="custom">自定义</el-radio>
              </el-radio-group>
              <el-date-picker
                v-if="timeRangeType === 'custom'"
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled-date="disabledDate"
              />
            </div>
          </div>
        </div>

        <!-- 操作按钮优化 -->
        <div class="action-buttons">
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </div>
      </div>

      <div v-if="articles.length" class="content">
        <div class="articles-list">
          <el-card
            v-for="article in articles"
            :key="article.id"
            class="article-card"
            shadow="hover"
          >
            <div class="article-header">
              <h3 class="article-title">{{ article.title }}</h3>
              <el-tag size="small" type="info">{{
                formatDate(article.published)
              }}</el-tag>
            </div>

            <div class="article-meta">
              <el-tag size="small" type="success">
                <el-icon><User /></el-icon>
                {{ formatAuthors(article.authors) }}
              </el-tag>
              <el-tag size="small" type="warning">
                <el-icon><Collection /></el-icon>
                {{ article.categories.join(", ") }}
              </el-tag>
            </div>

            <div class="article-content">
              <p class="article-summary">{{ article.summary }}</p>
            </div>

            <div class="article-footer">
              <div class="article-links">
                <el-button
                  v-for="link in article.links"
                  :key="link.href"
                  :type="getLinkType(link)"
                  :icon="getLinkIcon(link)"
                  size="small"
                  @click="openLink(link.href)"
                >
                  {{ getLinkText(link) }}
                </el-button>
              </div>
              <el-button
                type="primary"
                plain
                size="small"
                icon="Star"
                @click="handleSave(article)"
              >
                收藏
              </el-button>
            </div>
          </el-card>
        </div>

        <div class="statistics-section">
          <el-divider>统计信息</el-divider>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="stat-card">
                <template #header>
                  <div class="stat-header">
                    <el-icon><DataLine /></el-icon>
                    <span>论文统计</span>
                  </div>
                </template>
                <div class="stat-content">
                  <div class="stat-item">
                    <span class="label">今日更新：</span>
                    <span class="value">{{ todayCount }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">本周更新：</span>
                    <span class="value">{{ weekCount }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">本月更新：</span>
                    <span class="value">{{ monthCount }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card class="stat-card">
                <template #header>
                  <div class="stat-header">
                    <el-icon><TrendCharts /></el-icon>
                    <span>热门分类</span>
                  </div>
                </template>
                <div class="stat-content">
                  <div
                    v-for="(count, category) in topCategories"
                    :key="category"
                    class="stat-item"
                  >
                    <span class="label">{{ category }}：</span>
                    <span class="value">{{ count }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-empty>
          <template #description>
            <div class="empty-description">
              <h3>暂无搜索结果</h3>
              <p>您可以尝试以下方式：</p>
              <ul>
                <li>检查是否选择了合适的学科领域</li>
                <li>调整搜索关键词，使用更通用的词语</li>
                <li>扩大发布时间范围</li>
              </ul>
              <div class="empty-examples">
                <p>推荐搜索：</p>
                <div class="example-tags">
                  <el-tag
                    v-for="(tag, index) in recommendedSearches"
                    :key="index"
                    class="example-tag"
                    @click="handleExampleSearch(tag)"
                  >
                    {{ tag.text }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { searchArxivArticles } from "@/api/news";
import { ElMessage } from "element-plus";
import type { ArxivArticle } from "@/api/news";
import {
  User,
  Collection,
  Document,
  Download,
  Link,
  DataLine,
  TrendCharts,
  InfoFilled,
  Calendar,
  Search,
  Refresh
} from "@element-plus/icons-vue";

const loading = ref(false);
const articles = ref<ArxivArticle[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 添加时间范围类型定义
type TimeRangeType = "year" | "custom";
const timeRangeType = ref<TimeRangeType>("year");

// 添加禁用日期函数定义
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

// 修改搜索字段定义
const selectedFields = ref<string[]>(["qfin"]);
const useTimeRange = ref(true);
const dateRange = ref<[Date, Date] | null>(null);
const searchField1 = ref("ti");
const searchValue1 = ref("");
const searchField2 = ref("abs");
const searchValue2 = ref("");

// 格式化日期
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
};

// 格式化作者列表
const formatAuthors = (authors: Array<{ name: string }>) => {
  return authors.map(author => author.name).join(", ");
};

// 获取链接文本
const getLinkText = (link: { rel: string; type?: string }) => {
  if (link.rel === "alternate") return "查看详情";
  if (link.type === "application/pdf") return "PDF下载";
  return "相关链接";
};

// 修改构建搜索查询
const buildSearchQuery = computed(() => {
  const queries: string[] = [];

  if (selectedFields.value.length > 0) {
    queries.push(
      `(${selectedFields.value.map(field => `cat:${field}`).join(" OR ")})`
    );
  }

  if (timeRangeType.value === "year") {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    queries.push(
      `submittedDate:[${oneYearAgo.toISOString().split("T")[0]} TO *]`
    );
  } else if (timeRangeType.value === "custom" && dateRange.value) {
    const [start, end] = dateRange.value;
    queries.push(
      `submittedDate:[${start.toISOString().split("T")[0]} TO ${end.toISOString().split("T")[0]}]`
    );
  }

  if (searchValue1.value) {
    queries.push(`${searchField1.value}:${searchValue1.value}`);
  }

  if (searchValue2.value) {
    queries.push(`${searchField2.value}:${searchValue2.value}`);
  }

  return queries.join(" ");
});

// 修改重置搜索函数
const resetSearch = () => {
  selectedFields.value = ["qfin"];
  timeRangeType.value = "year";
  dateRange.value = null;
  searchField1.value = "ti";
  searchValue1.value = "";
  searchField2.value = "abs";
  searchValue2.value = "";
  currentPage.value = 1;
  pageSize.value = 10;
  total.value = 0;
  handleSearch();
};

// 其他原有的方法保持不变，但使用 buildSearchQuery
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await searchArxivArticles({
      page: currentPage.value - 1,
      pageSize: pageSize.value,
      searchQuery: buildSearchQuery.value
    });

    if (response.feed) {
      articles.value = response.feed.entry;
      total.value = Number(response.feed.totalResults) || 0;
    }
  } catch (error: any) {
    ElMessage.error(`获取数据失败: ${error.message || "未知错误"}`);
    console.error("详细错误:", error);
    articles.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  total.value = 0;
  fetchData();
};

const handleSizeChange = (val: number) => {
  pageSize.value = 10;
  currentPage.value = 1;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};

// 获取链接类型
const getLinkType = (link: { rel: string; type?: string }) => {
  if (link.type === "application/pdf") return "danger";
  if (link.rel === "alternate") return "primary";
  return "info";
};

// 获取链接图标
const getLinkIcon = (link: { rel: string; type?: string }) => {
  if (link.type === "application/pdf") return Download;
  if (link.rel === "alternate") return Document;
  return Link;
};

// 打开链接
const openLink = (url: string) => {
  window.open(url, "_blank");
};

// 处理收藏
const handleSave = (article: ArxivArticle) => {
  ElMessage.success(`已收藏文章：${article.title}`);
  // TODO: 实现收藏功能
};

// 统计数据
const todayCount = ref(0);
const weekCount = ref(0);
const monthCount = ref(0);
const topCategories = ref({
  量化金融: 156,
  机器学习: 89,
  金融市场: 67,
  风险管理: 45,
  资产定价: 34
});

// 更新统计数据
const updateStatistics = async () => {
  try {
    // 这里可以添加实际的API调用来获取统计数据
    todayCount.value = Math.floor(Math.random() * 50) + 10;
    weekCount.value = Math.floor(Math.random() * 200) + 100;
    monthCount.value = Math.floor(Math.random() * 1000) + 500;
  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

// 在页面加载时获取统计数据
onMounted(() => {
  updateStatistics();
  // 确保即使没有搜索结果也显示期刊列表
  if (!articles.value.length) {
    fetchData();
  }
});

// 添加推荐搜索数据
const recommendedSearches = [
  { field: "ti", text: "Machine Learning" },
  { field: "ti", text: "Asset Pricing" },
  { field: "ti", text: "Risk Management" },
  { field: "ti", text: "Portfolio Optimization" },
  { field: "ti", text: "Market Microstructure" }
];

// 添加示例搜索处理函数
const handleExampleSearch = (tag: { field: string; text: string }) => {
  searchField1.value = tag.field;
  searchValue1.value = tag.text;
  selectedFields.value = ["qfin"]; // 默认选中量化金融
  timeRangeType.value = "year"; // 默认搜索近一年
  handleSearch();
};
</script>

<style scoped>
.financial-news {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 40px);
}

.search-form {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 500;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 16px;
}

.info-icon {
  margin-left: 8px;
  font-size: 20px;
  color: #909399;
  cursor: help;
}

:deep(.el-checkbox) {
  margin-right: 0;
  height: auto;
}

:deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  margin-right: 12px;
  font-size: 20px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
}

.field-select {
  width: 120px;
  font-size: 16px;
  flex-shrink: 0;
}

:deep(.el-input) {
  width: 100%;
  max-width: calc(50vw - 160px);
}

:deep(.el-input__inner) {
  font-size: 20px;
}

:deep(.el-radio__label) {
  font-size: 16px;
}

.display-options {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.page-size-select {
  width: 80px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.content {
  margin-top: 20px;
}

.authors {
  color: #666;
  margin: 8px 0;
}

.abstract {
  text-align: justify;
  margin: 12px 0;
  line-height: 1.5;
}

.categories {
  color: #409eff;
  font-size: 0.9em;
  margin-bottom: 12px;
}

.article-links {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.link-item {
  font-size: 0.9em;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 20px 0;
}

:deep(.el-pagination) {
  justify-content: center;
}

.results-summary {
  margin: 20px 0;
  font-size: 16px;
  color: #606266;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  margin-bottom: 16px;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.article-title {
  font-size: 18px;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.article-date {
  color: #909399;
  font-size: 20px;
  white-space: nowrap;
}

.article-meta {
  margin: 12px 0;
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 20px;
}

.article-content {
  margin-bottom: 16px;
}

.article-summary {
  color: #606266;
  line-height: 1.6;
  margin: 16px 0;
  text-align: justify;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.article-links {
  display: flex;
  gap: 12px;
}

.article-actions {
  display: flex;
  display: flex;
  gap: 12px;
}

.article-actions {
  display: flex;
  gap: 12px;
}

.statistics-section {
  margin-top: 40px;
  padding: 20px 0;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-content {
  padding: 20px 0;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  height: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item .label {
  color: #606266;
}

.stat-item .value {
  color: #409eff;
  font-weight: bold;
}

.help-content {
  padding: 0 10px;
}

:deep(.el-row) {
  display: flex;
  flex-wrap: wrap;
}

:deep(.el-col) {
  display: flex;
  flex-direction: column;
}
</style>
