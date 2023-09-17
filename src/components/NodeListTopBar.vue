<template>
  <div class="NodeListTopBar">
    <back-icon/>
    <span style="flex-grow: 1" class="map_name">
        <el-link @click="onOpenFile" v-if="the_path">{{ basename(the_path) }}</el-link>
      </span>
    <icon-btn icon="el-icon-refresh-right" @click="$emit('refresh')"/>
  </div>
</template>

<script>

import path from "path";
import system_util from "@/utils/system_util";
import BackIcon from "@/components/BackIcon";
import IconBtn from "@/components/IconBtn";

export default {
  name: 'NodeListTopBar',
  props: ["the_path"],
  components: {BackIcon, IconBtn},
  methods: {
    basename(full_path) {
      return path.basename(full_path)
    },
    onOpenFile() {
      console.log(this.the_path)
      system_util.openFile(this.the_path)
    },
  },
  data() {
    return {}
  }

}
</script>

<style scoped>

.NodeListTopBar {
  display: flex;
}

.map_path {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: small;
  margin-bottom: 10px;
}

.map_name {
  text-align: center;
}
</style>
