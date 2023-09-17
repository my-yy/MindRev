<template>
  <div class="MarkBtn" v-if="obj">
    <span class="nex_days_area" @click.stop="onDayClick">{{ obj.next_span.toFixed(0) }} 天</span>
    <div class="mark_btn" @click="$emit('click')" :style="{'background-color':obj.color}">
      <div class="mark_name">{{ obj.name }}</div>
    </div>
  </div>
</template>

<script>
import smalltalk from "smalltalk";

export default {
  name: 'MarkBtn',
  props: ["obj"],
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    async onDayClick() {
      const obj = this.obj
      const next_span = obj.next_span
      const current_val = next_span.toFixed(0)

      let answer_span
      try {
        answer_span = await smalltalk.prompt(
          `指定选择"${obj.name}"的复习间隔`,
          '', current_val)
      } catch (e) {
        return
      }
      //获得天数
      answer_span = parseInt(answer_span)
      if (isNaN(answer_span)) {
        this.$message.error("无效天数")
        return
      }

      if (answer_span < 1) {
        this.$message.error("天数需要 >= 1")
        return
      }
      obj.next_span = answer_span
      this.$emit("onChangeDay", answer_span)
    },
  }
}
</script>
<style scoped>

.MarkBtn {
  /*display: flex;*/
  /*flex-direction: column;*/
  /*align-items: center;*/
  text-align: center;
  /*margin-top: 5px;*/
  /*border: 1px red solid;*/
}

.mark_btn {
  text-align: center;
  /*color: white;*/
  /*font-weight: bold;*/
  border-radius: 20px;
  cursor: default;
  user-select: none;
  padding: 10px 5px 10px 5px;
}

.mark_btn:hover {
  /*box-shadow: rgb(0 0 0 / 20%) 0px 0.5px 3px -1px, rgb(0 0 0 / 15%) 0px 5px 30px -10px;*/
  transform: translateY(-1px);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  /*box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);*/
}

.mark_btn.selected {
  color: #4da2ff;
  border-color: #c8e3ff;
  background-color: #eef5ff;
}


.nex_days_area {
  user-select: none;
  cursor: default;
  font-size: small;
}

.nex_days_area:hover {
  /*color: black;*/
  border: 1px white solid;
  text-decoration: underline;
}

</style>
