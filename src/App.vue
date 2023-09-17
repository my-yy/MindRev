<template>
  <div id="app">
    <!--    <nav class="navi">-->
    <!--      <router-link to="/">导图列表</router-link>-->
    <!--      |-->
    <!--      <router-link to="/today">复习</router-link>-->
    <!--    </nav>-->
    <div class="navi_bar" v-show="showNavi&&!lock_function_mode">
      <el-radio-group :value="curNaviPath" size="mini" @input="onRadioChange">
        <el-radio-button label="/">思维导图</el-radio-button>
        <el-radio-button label="/today">今日复习</el-radio-button>
        <el-radio-button label="/setting">设置</el-radio-button>
      </el-radio-group>
    </div>
    <el-tooltip class="item" effect="dark" content="刷新" placement="bottom" :open-delay="1000">
      <icon-btn v-show="showRefresh" id="refresh_icon" icon="el-icon-refresh-right" @click="onRefresh"/>
    </el-tooltip>


    <router-view class="the_router_view"/>
  </div>
</template>
<script>
import IconBtn from "@/components/IconBtn";
import eventbus from "@/utils/eventbus";
import config_util from "@/utils/config_util";

export default {
  name: 'App',
  components: {IconBtn},
  data() {
    return {
      radio1: "/",
      lock_function_mode: false,
    }
  },
  computed: {
    curNaviPath() {
      return this.$route.path
    },
    showNavi() {
      const cur_url = this.$route.path
      return ["/", "/today", "/setting"].indexOf(cur_url) >= 0
    },
    showRefresh() {
      const cur_url = this.$route.path
      return ["/", "/today"].indexOf(cur_url) >= 0
    }
  },
  mounted() {
    window.document.title = "MindRev"
    this.checkActivateAndLock()
    eventbus.bus.$on("setting:activate_success", this.checkActivateAndLock)
  },
  beforeDestroy() {
    eventbus.bus.$off("setting:activate_success", this.checkActivateAndLock)
  },
  methods: {
    checkActivateAndLock() {
      if (!config_util.isActivated() && config_util.getRemainTrialDays() < 0) {
        //未激活，授权到期，锁死并跳转到设置页面
        this.lock_function_mode = true
        this.$router.push("/setting")
      } else {
        this.lock_function_mode = false
      }
    },
    onRefresh() {
      eventbus.bus.$emit("navi_bar:refresh_click")
    },
    onRadioChange(new_val) {
      this.$router.push(new_val)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /*border: 1px blue solid;*/
  display: flex;
  flex-direction: column;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box; /*这个消除了滚动条*/
}

.navi_bar {
  margin: 5px;
  text-align: center;
  /*border: 1px red solid;*/
}

#refresh_icon {
  position: fixed;

  /*margin-left: 10px;*/
  top: 5px;
  /*left: 0;*/
  right: 5px;
}


.the_router_view {
  /*border: 1px red solid;*/
  flex-grow: 1;
  overflow-y: auto;

}

</style>
