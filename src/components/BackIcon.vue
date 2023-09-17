<template>
  <icon-btn icon="el-icon-arrow-left" @click="$router.go(-1)"></icon-btn>
</template>

<script>
import IconBtn from "@/components/IconBtn";

export default {
  name: 'BackIcon',
  components: {IconBtn},
  methods: {},
  data() {
    return {}
  }
}
</script>

<style scoped>


</style>
