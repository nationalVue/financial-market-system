<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import PublicFund from "./components/PublicFund.vue";
import IndustryOverview from "./components/IndustryOverview.vue";
import PrivateFund from "./components/PrivateFund.vue";
import ManagementFund from "./components/ManagementFund.vue";
import SecuritizationFund from "./components/SecuritizationFund.vue";
import CarouselSection from "./components/CarouselSection.vue";

defineOptions({
  name: "Welcome"
});

// 设置默认选中公募基金
const selectedFund = ref("public");

// 创建基金数据类
class FundData {
  private static instance: FundData;
  private _funds = [
    { name: "公募基金", type: "public" },
    { name: "私募基金", type: "private" },
    { name: "私募资管", type: "management" },
    { name: "资产证券化", type: "securitization" }
  ];

  private constructor() {}

  public static getInstance(): FundData {
    if (!FundData.instance) {
      FundData.instance = new FundData();
    }
    return FundData.instance;
  }

  public getFunds() {
    return this._funds;
  }
}

// 使用单例模式获取基金数据
const fundData = FundData.getInstance();
const fundTypes = fundData.getFunds();

// 其他基金类型数据
const otherFundData = {
  9: {
    institutions: "145",
    companies: "132",
    qualifiedInstitutions: "13",
    totalAssets: "28.56",
    tableData: [
      {
        category: "股票策略",
        current: {
          number: 1245,
          shares: 9856,
          netValue: 32551.88,
          marketValue: 35300.23
        },
        previous: { number: 1247, netValue: 32697.45, marketValue: 35355.35 }
      }
    ]
  }
  // ... 其他月份数据
};

// 计算属性：获取当前选中基金的文本
const selectedFundText = computed(() => {
  const fundType = fundTypes.find(f => f.type === selectedFund.value);
  return fundType?.name || "";
});

// 计算属性：获取当前月份的数据
const currentMonthData = ref(otherFundData[9]);

// 获取路由实例
const router = useRouter();

// 添加跳转方法
const handleMoreClick = () => {
  // 根据当前选中的基金类型跳转到对应页面
  const routeMap = {
    public: "/publicFund",
    private: "/privateFund",
    management: "/managementFund",
    securitization: "/securitizationFund"
  };

  router.push(routeMap[selectedFund.value]);
};
</script>

<template>
  <div class="welcome-container">
    <!-- 添加标题区域 -->
    <div class="header-banner">
      <h1 class="main-title">金融市场在线管理系统</h1>
    </div>

    <!-- 轮播图移到底部 -->
    <CarouselSection />
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧部分 -->
      <div class="left-section">
        <div class="section-header">
          <div class="section-header-content">
            <div class="section-title">统计报告</div>
            <div class="more-link" @click="handleMoreClick">更多</div>
          </div>
          <div class="divider" />
        </div>
        <div class="fund-boxes">
          <div
            v-for="fund in fundTypes"
            :key="fund.type"
            class="tab-item"
            :class="{ active: selectedFund === fund.type }"
            @click="selectedFund = fund.type"
          >
            <div class="tab-title">{{ fund.name }}</div>
          </div>
        </div>

        <!-- 公募基金数据 -->
        <div v-if="selectedFund === 'public'">
          <PublicFund />
        </div>

        <!-- 私募基金数据 -->
        <div v-else-if="selectedFund === 'private'">
          <PrivateFund />
        </div>

        <!-- 私募资管数据 -->
        <div v-else-if="selectedFund === 'management'">
          <ManagementFund />
        </div>

        <!-- 资产证券化数据 -->
        <div v-else-if="selectedFund === 'securitization'">
          <SecuritizationFund />
        </div>

        <!-- 其他基金类型数据 -->
        <div v-else class="month-selector">
          <!-- 其他基金类型内容保持不变 -->
        </div>
      </div>

      <!-- 右侧部分 -->
      <IndustryOverview />
    </div>
  </div>
</template>

<style lang="scss">
@import "./index.scss";
</style>
