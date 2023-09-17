<template>
  <div class="icon_wrapper" :class="{'checked':checked,'disabled':disabled,'not_disabled':!disabled}"
       @click="handleClick">
    <i :class="icon">
      <slot></slot>
    </i>
  </div>
</template>

<script>
export default {
  name: 'IconBtn',
  props: ["checked", "disabled", "icon", "badge"],
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    handleClick(evt) {
      if (this.disabled) {
        return
      }
      this.$emit('click', evt);
    }
  }
}
</script>

<style scoped>
.icon_wrapper {
  display: inline-block;
  /*border: 1px red solid;*/
  /*margin-left: 10px;*/
  cursor: default;
  padding: 2px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 6px;
  user-select: none;
  position: relative;
}

.icon_wrapper.not_disabled:hover {
  background-color: #d9d9dc;
  cursor: pointer;
}


.icon_wrapper.checked {
  background-color: #d9d9dc;
}

.icon_wrapper.disabled {
  color: lightgrey;
}

.badge {
  position: absolute;
  top: -2px;
  font-size: 12px;
  padding: 0 5px 0 5px;
  border-radius: 20px;
  color: white;
  display: inline-block;
  text-align: center;
  background: #fe5250;
}


</style>
