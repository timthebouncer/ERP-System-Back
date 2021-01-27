<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <a-button class="button1" @click="showModal"
          >新增物料倉庫<a-icon type="plus"
        /></a-button>
      </div>
      <div class="search-wrapper">
        <div class="search-input">
          <a-input-search
            v-model="searchValue"
            placeholder="搜尋物料倉庫名稱"
            enter-button
            autoFocus
            @search="handleSearch"
          />
        </div>
      </div>
    </div>
    <a-modal
      v-model="visible"
      width="500px"
      :title="changeTitle"
      @cancel="clearInput"
    >
      <div class="class-input">
        <label>物料倉庫名稱:</label>
        <a-input v-model="list.materialsName" autoFocus placeholder="請輸入" />
      </div>
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">
          儲存
        </a-button>
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
      </template>
    </a-modal>
    <div class="itemMenu">
      <a-table
        class="inventoryLogTable"
        :columns="columns"
        bordered
        :pagination="false"
        :data-source="tableData"
        rowKey="id"
      >
        <!--        <template slot="amount" slot-scope="text">-->
        <!--          <span v-if="~text.indexOf('-')" class="amount&#45;&#45;red">{{ text }}</span>-->
        <!--          <span v-else>{{ text }}</span>-->
        <!--        </template>-->
        <template slot="action" slot-scope="text, record">
          <template v-if="record.clientCount === 0">
            <a-space>
              <a-button type="link" size="small" @click="editHandler(record)"
                >編輯</a-button
              >
              <a-popconfirm
                title="確定要刪除嗎?"
                @confirm="() => onDelete(record)"
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
export default {
  name: 'MaterialsDepot',
  data() {
    return {
      searchValue: '',
      tableData: [],
      changeTitle: '',
      visible: false,
      list: { id: '', materialsName: '' },
      columns: [
        {
          title: '類別名稱',
          dataIndex: 'updateDate',
          width: '10%',
          align: 'center'
        },
        {
          title: '客戶數量',
          dataIndex: 'num',
          width: '10%',
          align: 'center'
        },
        {
          title: '最後更新時間',
          dataIndex: 'productName',
          width: '20%',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    showModal() {
      this.changeTitle = '新增物料倉庫'
      this.visible = true
      this.list = { id: '', materialsName: '' }
    },
    handleSearch() {},
    handleOk() {},
    handleCancel() {},
    clearInput() {},
    editHandler() {
      this.changeTitle = '編輯物料倉庫'
    },
    onDelete(item) {
      this.$message.success(item.name + '倉庫刪除成功')
    }
  }
}
</script>

<style scoped lang="scss">
.class-input {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  width: 400px;
}
.class-input > label {
  width: 120px;
}
.class-input > input {
  margin-left: 5px;
}
</style>
