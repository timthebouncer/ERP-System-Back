<template>
  <div>
    <a-modal
      title="標籤詳細"
      v-model="visible"
      @ok="handleOk"
      cancelText="取消"
      okText="儲存"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="標籤名稱">
          <template v-if="itemType !== 'text'">{{item.text}}</template>
          <a-input v-else v-model="item.text" />
        </a-form-item>
        <a-form-item label="字體大小" v-if="itemType !== 'barcode'">
          <a-input-number v-model="item.fontSize" />
        </a-form-item>
        <a-form-item label="寬" v-if="itemType === 'barcode'">
          <a-input-number v-model="item.width" />
        </a-form-item>
        <a-form-item label="高" v-if="itemType === 'barcode'">
          <a-input-number v-model="item.height" />
        </a-form-item>
        <a-form-item label="字型" v-if="itemType !== 'barcode'">
          <a-space>
            <a-button size="small" :type="isBold" @click="item.bold = !item.bold">
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
  props: {
    saveTag: Function,
    tagItem: Object
  },
  name: 'TagsDetail',
  data() {
    return {
      visible: false,
      item: {
        fontSize: '30',
        bold: false,
        underline: false,
        text: '',
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    isBold() {
      return this.item.bold ? 'primary' : 'default'
    },
    isUnderline() {
      return this.item.underline ? 'primary' : 'default'
    },
    itemType(){
      if(/^[{]{2}.+[}]{2}$/.test(this.item.text)){
        if(~this.item.text.indexOf('商品條碼')){
          return 'barcode'
        }else{
          return 'field'
        }
      }else{
        return 'text'
      }
    }
  },
  methods: {
    handleOk() {
      this.$emit('saveTag',{
        ...this.item,
        fontWeight: this.item.bold ? 'bold' : 'normal'
      })
      this.visible = false
    }
  },
  watch: {
    visible(value) {
      if (value) {
        const {fontWeight,underline,text,fontSize,width,scaleX,height,scaleY} = this.tagItem
        console.log(this.tagItem)
        this.item = {
          bold: fontWeight === 'bold',
          underline: underline,
          text: text,
          fontSize: fontSize,
          actualWdith: width,
          actualHeight: height,
          scaleX: 1,
          scaleY: 1,
          width: Math.round(width*scaleX),
          height: Math.round(height*scaleY)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>