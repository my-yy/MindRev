<template>
  <div class="ReviewTopBar" v-if="item_list">
    <back-icon/>
    <div class="step_wrapper">{{ curStep }}/{{ item_list.length }}</div>
    <info-btn :item="cur_item"/>
  </div>
</template>

<script>
import BackIcon from "@/components/BackIcon";
import IconBtn from "@/components/IconBtn";
import path from "path";
import InfoBtn from "@/components/InfoBtn";

export default {
  name: 'ReviewTopBar',
  components: {IconBtn, BackIcon, InfoBtn},
  props: ["item_list", "cur_item"],
  data() {
    return {}
  },
  computed: {
    curStep() {
      try {
        return this.item_list.indexOf(this.cur_item) + 1
      } catch (e) {
        return -1
      }
    }
  },
  methods: {
    onRefresh() {

    }
  },
}
</script>

<style scoped>
.ReviewTopBar {
  display: flex;
  flex-direction: row;
  /*border: 1px red solid;*/
  align-items: center;
}

.step_wrapper {
  text-align: center;
  flex-grow: 1;
  font-size: small;
}

.mindmap_name {
  text-align: right;
  margin-right: 10px;
  margin-top: 1em;
  font-size: small;
  color: gray;
}


</style>
