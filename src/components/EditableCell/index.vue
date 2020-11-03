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
      amountInput:[]
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit("change", this.value);
    },
    cancel() {
      this.value = this.lastValue;
      this.editable = false;
    },
    edit() {
      console.log(this.value);
      this.lastValue = this.value;
      this.editable = true;
      this.$nextTick(() =>{
        this.$refs[this.inputRef].focus();
      });
    }
  },
  created() {
  }
};
</script>

<style scoped></style>
