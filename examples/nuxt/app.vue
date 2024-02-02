<script setup>
onMounted(async () => {
  const pagefind = await import('/pagefind/pagefind.js');
  const r = await pagefind.search('nuxt');
  for (const result of r.results) {
    console.log(await result.data());
  }
})
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
