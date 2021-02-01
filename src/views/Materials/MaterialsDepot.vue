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
            @search="onSearch"
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
        <a-input v-model="depotName" autoFocus placeholder="請輸入" />
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
        <template slot="action" slot-scope="text, record">
          <template v-if="record.count === 0">
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
import moment from 'moment'

export default {
  name: 'MaterialsDepot',
  data() {
    return {
      searchValue: '',
      tableData: [],
      changeTitle: '',
      visible: false,
      edited: false,
      depotId: '',
      depotName: '',
      columns: [
        {
          title: '物料倉庫名稱',
          dataIndex: 'name',
          width: '10%',
          align: 'center'
        },
        {
          title: '物料數量',
          dataIndex: 'count',
          width: '10%',
          align: 'center'
        },
        {
          title: '最後更新時間',
          dataIndex: 'lastRecordTime',
          width: '10%',
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
    onSearch() {
      this.getDepotList()
    },
    getDepotList() {
      this.$api.Materials.getDepotList(this.searchValue)
        .then(res => {
          this.tableData = res.data.map(item => {
            let obj = item
            obj.lastRecordTime = moment(item.lastRecordTime).format(
              'YYYY-MM-DD'
            )
            return obj
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    showModal() {
      this.changeTitle = '新增物料倉庫'
      this.edited = false
      this.visible = true
      this.depotName = ''
    },
    handleSearch() {},
    handleOk() {
      // if(this.depotName == '')
      this.depotName = this.depotName.replace(/\s*/g, '')
      if (this.depotName.length == 0) {
        this.$message.warning(`請輸入物料倉庫名稱`)
        return
      }

      if (this.edited) {
        let data = { depotId: this.depotId, name: this.depotName }
        this.$api.Materials.updateDepot(data)
          .then(() => {
            this.$message.success(`修改成功`)
            this.visible = false
            this.onSearch()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      } else {
        let data = { name: this.depotName }
        this.$api.Materials.addDepot(data)
          .then(() => {
            this.$message.success(`新增成功`)
            this.visible = false
            this.onSearch()
          })
          .catch(err => {
            console.log(err.response.data)
            this.$message.error(err.response.data.message)
          })
      }
    },
    handleCancel() {
      this.visible = false
      this.depotName = ''
    },
    clearInput() {},
    editHandler(item) {
      console.log(item)
      this.changeTitle = '編輯物料倉庫'
      this.edited = true
      this.depotId = item.id
      this.depotName = item.name
      this.visible = true
    },
    onDelete(item) {
      this.$api.Materials.deleteDepot(item.id)
        .then(() => {
          this.$message.success(`刪除成功`)
          this.onSearch()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    }
  },
  mounted() {
    this.onSearch()
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
