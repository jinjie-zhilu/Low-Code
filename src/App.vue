<script lang="ts" setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { registry } from '@/utils/registerComponent'
import { provide } from 'vue-demi'

// 提供注册组件
provide('components', registry)

</script>

<template>
  <div class="app-box">
    <router-view></router-view>
  </div>
</template>

<style>
.app-box {
  width: 100%;
  height: 100%;
}
</style>
