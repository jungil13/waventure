<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Navbar from './components/navbar.vue'

const route = useRoute()
</script>

<template>
  <header>
    <Navbar
      v-if="!route.path.startsWith('/user') && !route.path.startsWith('/owner') && !route.path.startsWith('/admin')" />
  </header>
  <RouterView />
</template>
