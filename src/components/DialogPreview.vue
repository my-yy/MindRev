<template>
  <el-dialog title="" class="the_dialog" :visible.sync="dialogVisible" width="70%" :append-to-body="true">
    <div class="the_wrapper">
      <content-render :cur_item="cur_item" :answer_showing="show_answer"/>
      <el-button class="btn_toggle" @click="show_answer=!show_answer">{{
          show_answer ? '隐藏答案' : '显示答案'
        }}
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import ContentRender from "@/components/ContentRender";

export default {
  name: 'DialogPreview',
  components: {ContentRender},
  data() {
    return {
      dialogVisible: false,
      cur_item: null,
      show_answer: false
    }
  },
  methods: {
    show(object) {
      console.log(object)
      this.cur_item = object
      this.show_answer = false
      this.dialogVisible = true
    }
  },


}
</script>

<style scoped>
.the_wrapper {
  display: flex;
  flex-direction: column;
  height: 60vh;
}

.btn_toggle {
  margin-top: 1em;
}

.the_dialog {
  /*border: 1px red solid;*/
}

</style>
