<template>
  <div>
    <div>
      收件資料
      <a-button
          type="primary"
          size="small"
          class="editable-add-btn"
          @click="handleAdd"
      >
        <a-icon type="plus" />
      </a-button>
    </div>
    <div>
          <a-form-model class="option-wrapper" >
            <a-form-model-item>
              <a-radio-group>
                <a-form-model-item label="同客戶資料" class="option-content">
                  <a-radio value="1">
                    設為預設收件地址
                  </a-radio>
                </a-form-model-item>
                <a-form-model-item label="同公司資料" class="option-content">
                  <a-radio value="2">
                    設為預設收件地址
                  </a-radio>
                </a-form-model-item>
                <a-form-model-item :style="{'display': (show === false ? 'none':'block')}">
                  <a-radio value="3">
                    設為預設收件地址
                  </a-radio>
                  <div class="custom-address">
                  <a-form-model-item
                      class="custom-form-item"
                      label="收件人"
                      prop=""
                  >
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item
                      class="custom-form-item"
                      label="收件電話"
                      prop=""
                  >
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                  </div>
                  <a-form-model-item
                      class="custom-form-item"
                      label="收件地址"
                      prop=""
                  >
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>

                </a-form-model-item>
              </a-radio-group>
            </a-form-model-item>
          </a-form-model>

    </div>
  </div>
</template>
<script>
export default {
  name:'ReceiveModal',
  data(){
    return{
      show: false,
      form:{
      }
    }
  },
  methods:{
    handleAdd() {
      this.show = !this.show
    }
  },
  computed:{

  }
}
</script>
<style>
.option-wrapper{
  background-color: #F5F5F5;
  padding: 10px 0px 0px 60px
}
.option-content{
  display: flex;
}
.custom-address{
  display: flex;
}
</style>
