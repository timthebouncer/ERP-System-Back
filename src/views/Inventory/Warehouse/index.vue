<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <Modal :change-title="changeTitle" :getDepotList="getDepotList" ref="ModalObject" :recordName="recordName"/>
      </div>
      <div class="search-wrapper">
        <div class="search-input">
          <a-input-search
              v-model="search"
              placeholder="搜尋倉庫名稱"
              enter-button
              autoFocus
              @search="handleSearch"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table
          :columns="columns"
          :data-source="filterData"
          bordered
          :pagination="false"
          rowKey="id"
      >
        <template
            v-for="col in [
            'name',
            'count',
            'lastRecordTime',
            'operation',
          ]"
            :slot="col"
            slot-scope="text, record"
        >
          <div :key="col">
            <template>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.count === 0">
            <a-space>
              <a-button type="link" size="small" @click="editHandler(record)"
              >編輯</a-button
              >
              <a-popconfirm
                  title="確定要刪除嗎?"
                  @confirm="() => onDelete(record.id)"
              >
                <a-button type="link" size="small">刪除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else>
            <a-button type="link" size="small" @click="editHandler(record)"
            >編輯</a-button
            >
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import Modal from './Modal'
export default {
  name:'WareHouse',
  components:{Modal},
  data(){
    return{
      changeTitle:'',
      filterData:[],
      columns: [
        {
          title: '倉庫名稱',
          dataIndex: 'name',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'warehouseName' },
        },
        {
          title: '庫存量',
          dataIndex: 'count',
          width: '15%',
          align: 'center',
          scopedSlots: { customRender: 'quantity' },
        },
        {
          title: '最後更新時間',
          dataIndex: 'lastRecordTime',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'updateDate' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      search:'',
      recordName:''
    }
  },
  created() {
    this.getDepotList(this.search)
    },
  methods:{
    handleSearch(){
      this.getDepotList(this.search)
    },
    editHandler(record){
      this.$refs.ModalObject.showModal(record)
    },
    onDelete(id){
      this.$api.Depot.deleteDepot(id)
      .then(() => {
        this.getDepotList()
        this.$message.success('刪除類別成功')
      })
      .catch(() => {
        this.$message.error('刪除類別失敗')
      })
    },
    getDepotList(){
      this.$api.Depot.getDepotList({
        'name':this.search
      })
      .then(res=>{
        this.filterData = res.data
      })
    }
  }
}
</script>
