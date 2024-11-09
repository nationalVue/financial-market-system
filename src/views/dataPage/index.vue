<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PublicFundDetails from "./components/PublicFundDetails.vue";
import PrivateFundDetails from "./components/PrivateFundDetails.vue";
import ManagementFundDetails from "./components/ManagementFundDetails.vue";
import SecuritizationFundDetails from "./components/SecuritizationFundDetails.vue";

const route = useRoute();
const isPublicFund = computed(() => route.name === "PublicFund");
const isPrivateFund = computed(() => route.name === "PrivateFund");
const isManagementFund = computed(() => route.name === "ManagementFund");
const isSecuritizationFund = computed(
  () => route.name === "SecuritizationFund"
);
</script>

<template>
  <div class="fund-details-container">
    <div class="fund-content">
      <PublicFundDetails v-if="isPublicFund" />
      <PrivateFundDetails v-if="isPrivateFund" />
      <ManagementFundDetails v-if="isManagementFund" />
      <SecuritizationFundDetails v-if="isSecuritizationFund" />
      <div
        v-if="
          !isPublicFund &&
          !isPrivateFund &&
          !isManagementFund &&
          !isSecuritizationFund
        "
      >
        <!-- 其他基金类型的内容 -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fund-details-container {
  padding: 20px;

  .fund-content {
    background-color: #f5f5f5;
    min-height: calc(100vh - 150px);
  }
}
</style>
