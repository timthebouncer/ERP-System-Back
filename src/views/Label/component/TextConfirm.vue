<template>
  <div>
    <a-modal
      title="新增標籤"
      v-model="visible"
      @ok="handleOk"
      cancelText="取消"
      okText="確定"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="標籤文字">
          <a-input v-model="item.text" />
        </a-form-item>
        <a-form-item label="字體大小">
          <a-input-number v-model="item.fontSize" defaultValue="40" />
        </a-form-item>
        <a-form-item label="字型">
          <a-space>
            <a-button
              size="small"
              :type="isBold"
              @click="item.bold = !item.bold"
            >
              <a-icon type="bold" />
            </a-button>
            <a-button
              size="small"
              :type="isUnderline"
              @click="item.underline = !item.underline"
            >
              <a-icon type="underline" />
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      item: {
        text: '',
        fontSize: 40,
        bold: false,
        underline: false
      }
    }
  },
  computed: {
    isBold() {
      return this.item.bold ? 'primary' : 'default'
    },
    isUnderline() {
      return this.item.underline ? 'primary' : 'default'
    }
  },
  methods: {
    handleOk() {
      this.$emit('confirmText', this.item)
      this.visible = false
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.item = {
          text: '',
          fontSize: 40,
          bold: false,
          underline: false
        }
      }
    }
  }
}
</script>