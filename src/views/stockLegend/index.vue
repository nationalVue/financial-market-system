<template>
  <div class="stock-legend-container">
    <el-card class="market-overview">
      <MarketOverview
        :stockData="stockData"
        @select-stock="handleSelectStock"
      />
    </el-card>

    <el-card class="stock-chart mt-4">
      <StockChart :stockData="stockData" @select-stock="handleSelectStock" />
    </el-card>

    <StockDetails
      :selectedStock="selectedStock"
      :stockList="filteredStockData"
      @search="handleSearch"
      @select-stock="handleSelectStock"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MarketOverview from "./components/MarketOverview.vue";
import StockChart from "./components/StockChart.vue";
import StockDetails from "./components/StockDetails.vue";
import axios from "axios";
import type { StockData } from "@/api/stock";

const stockData = ref<StockData[]>([]);
const selectedStock = ref<StockData | null>(null);
const filteredStockData = ref<StockData[]>([]);

const handleSelectStock = (stock: StockData) => {
  selectedStock.value = stock;
};

const fetchStockData = async () => {
  try {
    const response = await axios.get(
      "https://api.mairui.club/hslt/new/b997d4403688d5e65a"
    );
    stockData.value = response.data;
    filteredStockData.value = response.data;
    if (response.data.length > 0) {
      selectedStock.value = response.data[0];
    }
  } catch (error) {
    console.error("获取股票数据失败:", error);
  }
};

const handleSearch = (query: string) => {
  if (!query) {
    filteredStockData.value = stockData.value;
    return;
  }

  filteredStockData.value = stockData.value.filter(
    stock =>
      stock.zqjc.toLowerCase().includes(query.toLowerCase()) ||
      stock.zqdm.includes(query)
  );
};

onMounted(() => {
  fetchStockData();
});
</script>

<style scoped>
.stock-legend-container {
  padding: 20px;
}
</style>
