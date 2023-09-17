<template>
  <div class="Setting">


    <div class="action_wrapper">
      <el-link class="item" href="https://docs.qq.com/doc/DRmJwSEJ4b2NITEd6">使用教程</el-link>
      <el-link class="item" href="mailto:my@huacishu.com">建议与反馈</el-link>
      <el-link class="item" @click="openDatabase">数据库目录</el-link>
    </div>


    <div class="dev_part" v-if="isDevelopment">
      <button @click="openDatabase">打开数据库文件夹</button>
    </div>


    <div style="flex-grow: 1"></div>
    <div class="bottom_area">
      {{ version }}
    </div>

  </div>
</template>

<script>
import config_util from "@/utils/config_util";
import license_util_valid from "@/utils/license_util_valid";
import db_util from "@/utils/db_util";
import {shell} from "electron";
import pkg from "../../package.json"
import eventbus from "@/utils/eventbus";
import system_util from "@/utils/system_util";

// console.log(pkg.version)

export default {
  name: 'Setting',
  components: {},
  data() {
    return {
      remainDays: 0,
      isActivated: false,
      isDevelopment: config_util.isDevelopment,
      version: pkg.version
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.remainDays = config_util.getRemainTrialDays()
      this.isActivated = config_util.isActivated()
    },
    openDatabase() {
      system_util.openFile(db_util.getDBRootPath())
    }
  },
}
</script>

<style scoped>
.Setting {
  display: flex;
  flex-direction: column;
  margin: 5px;
  margin-top: 20px;
  align-items: center;
}

.bottom_area {
  text-align: center;
  font-size: small;
}

.setting_item {
  margin-top: 2em;
}

.setting_title {
  font-weight: bold;
  font-size: 0.9em;
  /*margin-bottom: 5px;*/
}

.center_align {
  display: flex;
  align-items: center;
  font-size: 0.9em;
}

.dev_part {
  text-align: center;
  margin-top: 7em;
}

.activationInput {
  display: flex;
  text-align: center;
  margin-top: 10px;
}

.action_wrapper {
  display: flex;
  flex-direction: column;
}

.action_wrapper .item {
  margin-bottom: 2em;
}
</style>
