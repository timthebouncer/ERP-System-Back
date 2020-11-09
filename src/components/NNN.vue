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
  name: 'NNN',
  props: {
    value: {
      required: true,
      type: String,
    },
    placeholder: {
      required: false,
      type: String,
      default: '請選擇'
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
    }
  },
}
</script>