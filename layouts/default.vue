<template>
<div class="bg-gray-300 flex flex-col min-h-screen">
  <header-component />
  <main class="mt-16 lg:mt-24 flex-grow">
    <nuxt />
  </main>
  <footer-component />
</div>
</template>

<script>
import HeaderComponent from '@/components/header.vue'
import FooterComponent from '@/components/footer.vue'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>
