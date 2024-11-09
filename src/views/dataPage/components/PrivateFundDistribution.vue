<script setup lang="ts">
import { distributionData } from "../data/fundData";
</script>

<template>
  <div class="distribution-table">
    <div class="title">全部私募基金管理人按注册地分布情况</div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>辖区名称</th>
            <th>私募基金管理人数量（家）</th>
            <th>管理基金数量（只）</th>
            <th>管理基金规模（亿元）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in distributionData" :key="item.rank">
            <td>{{ item.rank }}</td>
            <td>{{ item.region }}</td>
            <td>{{ item.managerCount }}</td>
            <td>{{ item.productCount }}</td>
            <td>{{ item.scale.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.distribution-table {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .table-container {
    position: relative;
    max-height: 440px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: #f5f5f5;
        font-weight: normal;
        white-space: nowrap;
      }

      th,
      td {
        padding: 12px;
        text-align: center;
        border: 1px solid #ddd;
        font-size: 20px;
      }

      td {
        &:first-child {
          color: #333;
          font-weight: 500;
        }

        &:nth-child(2) {
          text-align: left;
          padding-left: 20px;
        }

        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5) {
          font-family: Arial, sans-serif;
        }
      }

      tr:hover {
        background-color: #f8f8f8;
      }

      tr:nth-child(even) {
        background-color: #fafafa;
      }
    }
  }
}
</style>
