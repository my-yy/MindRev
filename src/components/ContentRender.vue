<template>
  <div class="qa_wrapper">
    <div class="q_part" v-html="rend(cur_item.q)"></div>
    <div class="a_part" v-show="answer_showing">
      <div class="child_item" v-for="child in cur_item.a" v-html="rend(child)"></div>
    </div>
  </div>
</template>

<script>
import fs from "fs";

const map_reader = require("@/utils/map_helper/map_reader")

export default {
  name: 'ContentRender',
  props: ["cur_item", "answer_showing"],
  components: {},
  computed: {},
  data() {
    return {}
  },
  methods: {
    rend(content_obj) {
      const mindmap_path = this.cur_item._map_path
      if (!fs.existsSync(mindmap_path)) {
        console.log(this.cur_item)
        let html = `思维导图文件不存在：${mindmap_path}`
        return html
      }
      let html = ""
      if (content_obj.image) {
        html = map_reader.readNodeImageHTML(mindmap_path, content_obj)
      }
      if (content_obj.title) {
        html += `<div>${content_obj.title}</div>`
      }
      return html
    }
  },
}


</script>

<style scoped>
.qa_wrapper /deep/ .child_item {
  /*border: 1px red solid;*/
  margin-top: 10px;
}

.q_part, .a_part {
  white-space: pre-wrap;
}

.q_part {
  border-bottom: 1px gray dashed;
}

.qa_wrapper {
  flex-grow: 1;
}

</style>
