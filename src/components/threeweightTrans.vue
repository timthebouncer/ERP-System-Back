<template>
    <a-select
            :value="value"
            :placeholder="placeholder"
            @change="onSelect"
    >
        <a-select-option v-for="u in weightLists" :value="u.val" :key="u.val">
            {{ u.type }}
        </a-select-option>
    </a-select>
</template>

<script>
  import {dWeights} from "@/unit/dictionary/weights";

  export default {
    name: 'threeWeights',
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
        weightLists: dWeights,
      }
    },
    methods: {
      onSelect(v) {
        this.$emit('input', v)
        console.log(v)
      }
    },
  }
</script>
