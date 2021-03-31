<template>
  <a-select
      :value="value"
      :placeholder="placeholder"
      @change="onSelect"
  >
    <a-select-option v-for="u in weightList" :value="u.val" :key="u.val">
      {{ u.type }}
    </a-select-option>
  </a-select>
</template>

<script>
import {dWeight} from "@/unit/dictionary";

export default {
  name: 'translate',
  props: {
    value: {
      required: true,
      type: String,
      default: "KG"
    },
    placeholder: {
      required: false,
      type: String,
      default: '請選擇'
    },
    barCodeVerify:{
      type: Function
    }
  },
  data() {
    return {
      weightList: dWeight,
    }
  },
  methods: {
    onSelect(v) {
      this.$emit('input', v)
      console.log(v)
      this.barCodeVerify()
    }
  }
}
</script>
