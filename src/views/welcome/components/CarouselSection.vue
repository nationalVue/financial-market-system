<template>
  <div class="carousel-section">
    <el-carousel height="300px" :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
        <div class="carousel-content">
          <img :src="item.url" :alt="item.title" />
          <h3 class="carousel-title">{{ item.title }}</h3>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ElCarousel, ElCarouselItem } from "element-plus";

const carouselImages = [
  {
    url: "/src/assets/VCG211310370769.jpg",
    title: "金融市场数据分析"
  },
  {
    url: "/src/assets/VCG211320256387.jpg",
    title: "投资分析工具"
  },
  {
    url: "/src/assets/VCG211331884398.jpg",
    title: "城市金融中心"
  },
  {
    url: "/src/assets/VCG211493312270.jpg",
    title: "投资收益增长"
  }
];

defineOptions({
  name: "CarouselSection"
});
</script>

<style lang="scss" scoped>
.carousel-section {
  width: calc(100% - 48px);

  .el-carousel {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .carousel-content {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .carousel-title {
        position: absolute;
        bottom: 20px;
        left: 20px;
        color: #fff;
        font-size: 24px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        margin: 0;
      }
    }
  }
}
</style>
