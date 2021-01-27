<template>
  <div>
    <div class="action-add">
      <a-button class="button1" @click="showModal()"
      >新增倉庫<a-icon type="plus"
      /></a-button>
    </div>
    <a-modal
        v-model="visible"
        width="500px"
        :title="changeTitle"
        @cancel="clearInput"
    >
      <div class="class-input">
        <label>倉庫名稱:</label>
        <a-input
            v-model="warehouse"
            autoFocus
            label="倉庫名稱"
            placeholder="請輸入"
        />
      </div>
      <template slot="footer">
        <a-button
            key="submit"
            type="primary"
            @click="handleOk"
        >
          儲存
        </a-button>
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  name:'Modal',
  props:['getDepotList', 'recordName'],
  data(){
    return{
      visible:false,
      warehouse:'',
      changeTitle:'',
      updateId:''
    }
  },
  methods:{
    showModal(record){
      this.visible = true
      if(!record){
        this.changeTitle = "新增倉庫"
      }else {
        this.changeTitle = "編輯倉庫"
        this.warehouse = record.name
        this.updateId = record.id
      }
    },
    clearInput(){},
    handleOk(){
      if(this.changeTitle === "新增倉庫"){
        this.$api.Depot.addDepot({
          'name':this.warehouse
        })
                .then(()=>{
                  this.visible = false
                  this.warehouse = ''
                  this.getDepotList();

                }).catch(()=>{
          this.$message.error('此倉庫名稱已存在')
        })
      }else {
        this.$api.Depot.updateDepot({
          'depotId':this.updateId,
          'name':this.warehouse
        })
        .then(()=>{
          this.$message.success('修改成功')
          this.getDepotList();
          this.visible = false
        }).catch(()=>{
          this.$message.error('此倉庫名稱已存在')
        })
      }
    },
    handleCancel(){
      this.visible = false
    }

  }
}
</script>
