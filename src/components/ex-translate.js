import {dWeight} from "@/unit/dictionary";

export default {
  name: 'AAA',
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
  render() {
    return <a-select
      value={this.value}
      placeholder={this.placeholder}
      onChange={this.onSelect}
    >
      {this.weightList.map(w => <a-select-option value={w.val} key={w.val}>{w.type}</a-select-option>)}
    </a-select>
  }
}