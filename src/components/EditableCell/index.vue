<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
              :ref="inputRef"
        :value="value"
              :id="'input'+ inputId"
        @change="handleChange"
        @pressEnter="check"
              @focusout="cancel"
      />
<!--      <a-icon type="check" class="editable-cell-icon-check" @click="check" />-->
    </div>
    <div v-else class="editable-cell-text-wrapper" @dblclick="edit">
      {{ value+"" || " " }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    text: String,
    id: Number
  },
  data() {
    return {
      value: this.text,
      lastValue: "",
      inputId: this.id,
      editable: false,
      inputRef:'input'+this.id,
      amountInput:[],
      checkEnter:false
    };
  },
  methods: {
    handleChange(e) {
      this.checkEnter = false;
      const value = e.target.value;
      this.value = value;
    },
    check() {
      console.log('check')
      this.checkEnter = true;
      this.editable = false;
      this.$emit("change", this.value);
    },
    cancel() {
      if(!this.checkEnter){
        console.log('focus out');
        this.value = this.lastValue;
        this.editable = false;
      }
    },
    edit() {
      // console.log(this.value);
      this.lastValue = this.value;
      this.editable = true;
      this.$nextTick(() =>{
        this.$refs[this.inputRef].focus();
      });
    }
  },
  created() {
    this.checkEnter = false;
  }
};
</script>

<style scoped></style>
