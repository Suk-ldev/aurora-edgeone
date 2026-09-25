<template>
  <div></div>
</template>

<script>
export default {
  name: 'OrderCallback',
  mounted() {
    // http://192.168.1.7:7800/dev/#/order/2023050921051960685938814?money=6.99
    const { id } = this.$route.params
    this.$router.replace('/stage/order/info?id=' + id)
  }
}
</script>
