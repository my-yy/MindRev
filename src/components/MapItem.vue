<template>
  <div class="MapItem" v-if="item" @contextmenu="showNoteItemMenu" @click="$emit('click')">
    <img :src="logoImgURL" class="xmind_icon">
    <div class="middle_wrapper">
      <div class="name">{{ basename(item.path) }}</div>
      <div class="the_path">{{ item.path }}</div>
    </div>
  </div>
</template>

<script>
import {getCurrentWindow, Menu, MenuItem} from "@electron/remote";
import path from "path";
import {shell} from "electron";
import system_util from "@/utils/system_util";

const db_util = require("@/utils/db_util")
export default {
  name: 'MapItem',
  components: {},
  props: ["item"],
  data() {
    return {}
  },
  computed: {
    logoImgURL() {
      if (this.item && this.item.path && this.item.path.endsWith(".xmind")) {
        return require("@/assets/1_xmind_logo_256.png")
      }
      return require("@/assets/2_ithoughts_logo_256.png")
    }
  },
  methods: {
    basename(full_path) {
      return path.basename(full_path)
    },
    showNoteItemMenu(event) {
      const menu = new Menu()
      const win = getCurrentWindow()
      const SEPARATOR = {
        type: 'separator'
      }
      const DELETE_FILE = {
        label: '删除',
        id: 'delete_note',
        click: async (menuItem, browserWindow) => {
          // const collection = db_util.getMapCollection()
          db_util.deleteMindMapByPath(this.item.path)
          // const delete_count = await collection.remove({path: this.item.path}, {multi: true});
          this.$emit("deleted", this.item)
        }
      }
      const LOCATE_IN_FINDER = {
        label: '在资源管理器中显示',
        id: 'locate_in_finder',
        click: () => {
          shell.showItemInFolder(this.item.path)
        }
      }
      const OPEN_MAP = {
        label: '在导图软件中打开',
        id: 'open_map',
        click: () => {
          system_util.openFile(this.item.path)
        }
      }
      const item_list = [OPEN_MAP, LOCATE_IN_FINDER, SEPARATOR, DELETE_FILE]
      item_list.forEach(item => {
        menu.append(new MenuItem(item))
      })
      menu.popup([{window: win, x: event.clientX, y: event.clientY}])

      //监听显示、消失事件
      menu.addListener('menu-will-show', () => {
      });
      menu.addListener('menu-will-close', () => {
      });

    },
  },

}
</script>

<style scoped>
.MapItem {
  padding: 5px;
  cursor: default;
  /*border: 2px dodgerblue solid;*/
  border: 2px lightgrey solid;
  border-radius: 10px;
  user-select: none;
  margin: 5px;
  display: flex;
  align-items: center;
}

.MapItem:hover {
  border: 2px dodgerblue solid;
}

.middle_wrapper {
  margin-left: 5px;
}

.xmind_icon {
  width: 45px;
}

.the_path {
  font-size: 0.8em;
  color: gray;
}


</style>
