<template>
  <div class="Home">

    <map-item v-for="m in mindmaps" :item="m" @click="onMapClick(m)" @deleted="onMapDeleted"/>

    <van-empty v-show="mindmaps.length===0" description=""/>

    <div style="text-align: center;margin-top: 10px;">
      <el-button @click="onAddMindmap" icon="el-icon-plus">链接导图</el-button>
    </div>


  </div>
</template>

<script>
import eventbus from "@/utils/eventbus";

const {shell} = require('electron')
const path = require('path')
const fs = require('fs')
const db_util = require("@/utils/db_util")
// const {dialog} = require('electron').remote
const {dialog} = require('@electron/remote')
import MapItem from "@/components/MapItem";
import config_util from "@/utils/config_util";

export default {
  name: 'Home',
  components: {MapItem},
  data() {
    return {
      mindmaps: [],
      isActivated: false,
    }
  },
  computed: {},
  async mounted() {
    // this.isActivated = config_util.isActivated()
    eventbus.bus.$on("navi_bar:refresh_click", this.doRefresh)
    this.init()
  },
  beforeDestroy() {
    eventbus.bus.$off("navi_bar:refresh_click", this.doRefresh)
  },
  methods: {
    async doRefresh() {
      console.log("")
      await this.init()
      this.$message({
        "type": "success",
        "duration": 500,
        "message": "已刷新"
      })
    },
    basename(full_path) {
      return path.basename(full_path)
    },
    onMapClick(m) {
      this.$router.push('/node_list?path=' + encodeURIComponent(m.path))
    },
    async init() {
      let all_maps = await db_util.getMapCollection().find({})
      all_maps = all_maps.filter(obj => fs.existsSync(obj.path))
      this.mindmaps = all_maps
    },
    onMapDeleted() {
      this.init()
    },
    async onAddMindmap() {
      const path_list = dialog.showOpenDialogSync(
        {
          properties: ['openFile'],
          filters: [
            // {name: 'Xmind', extensions: ['xmind']},//不能有.，在widows下不可行
            {name: 'MindMap', extensions: ['xmind', 'itmz']},//不能有.，在widows下不可行
          ]
        }
      )


      if (!path_list) {//取消
        return
      }

      //1.插入数据库
      for (const the_path of path_list) {
        const doc = {
          "path": the_path
        }
        const collection = db_util.getMapCollection()
        const tmp_doc = await collection.findOne({path: doc.path})
        if (!tmp_doc) {
          await collection.insert(doc);
        }
      }
      this.init()
    }
  }
}
</script>

<style scoped>
.Home {
  display: flex;
  flex-direction: column;
  padding: 5px;
}


</style>
