<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
              :ref="inputRef"
        :value="value"
              :id="'input'+ inputId"
        @change="handleChange"
        @pressEnter="check"
              @focusout="editable=false"
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
    edit() {
      this.editable = true;
      // console.log(this);
      console.log(this.$refs);
      this.$nextTick(() =>{
        console.log(this.$refs[this.inputRef].focus());
        this.$refs[this.inputRef].focus();
      });
      // this.$refs[this.inputRef].autoFocus=true;
      // this.$refs[0].autoFocus = true;
      // if(this.$refs[0]==this.inputId){
      //   console.log(this.$refs[0]);
      // }
    }
  },
  created() {
    // this.inputId = 'input' + this.inputId;
  }
};
</script>

<style scoped></style>
