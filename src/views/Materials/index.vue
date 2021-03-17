<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <a-button class="button1" @click="showModal"
          >新增物料<a-icon type="plus"
        /></a-button>
      </div>
      <div class="search-wrapper">
        <div class="search-input">
          <a-input-search
            v-model="searchValue"
            placeholder="搜尋物料名稱"
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
      <div class="class-input" v-if="!edited">
        <label><span style="color: red;">*</span>物料名稱:</label>
        <a-input v-model="list.name" autoFocus placeholder="請輸入" />
      </div>
      <div class="class-input" v-else>
        <label style="margin-left: 5px;">物料名稱:</label>
        <span style="width: 220px;">{{ list.name }}</span>
      </div>
      <div class="class-input" style="margin-top: 20px;">
        <label style="margin-left: 5px;">物料倉庫:</label>
        <a-select v-model="depotId" @change="onSelect" placeholder="請選擇">
          <a-select-option v-for="u in depotList" :value="u.id" :key="u.id">
            {{ u.name }}
          </a-select-option>
        </a-select>
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
    <!--分頁-->
    <a-pagination
      class="pagination"
      v-model="current"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      :page-size="pageSize"
      :show-total="total => `總共 ${total} 筆`"
      @showSizeChange="onShowSizeChange"
      @change="onPageChange"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span>{{ props.value }}筆/頁</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Materials',
  data() {
    return {
      searchValue: '',
      tableData: [],
      depotList: [],
      materialsId: '',
      depotId: '請選擇',
      changeTitle: '',
      visible: false,
      edited: false,
      list: { name: '', depotId: '' },
      columns: [
        {
          title: '物料倉庫',
          dataIndex: 'depotName',
          width: '20%',
          align: 'center'
        },
        {
          title: '物料名稱',
          dataIndex: 'name',
          width: '40%',
          align: 'center'
        },
        {
          title: '數量',
          dataIndex: 'count',
          width: '10%',
          align: 'center'
        },
        {
          title: '建立時間',
          dataIndex: 'lastRecordTime',
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
      ],
      pageSizeOptions: ['10', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 10
    }
  },
  methods: {
    onSearch() {
      this.current = 1
      this.getMaterialsList()
    },
    getMaterialsList() {
      this.$api.Materials.getMaterialsList(
        this.searchValue,
        this.current,
        this.pageSize
      )
        .then(res => {
          this.tableData = res.data.content.map(item => {
            let obj = item
            obj.lastRecordTime = moment(item.lastRecordTime).format(
              'YYYY-MM-DD'
            )
            return obj
          })
          this.total = res.data.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    showModal() {
      this.changeTitle = '新增物料'
      this.edited = false
      this.visible = true
      this.list = { name: '', depotId: '' }
      this.depotList = []
      this.depotId = '請選擇'
      this.$api.Materials.getList()
        .then(res => {
          this.depotList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleOk() {
      this.list.name = this.list.name.replace(/\s*/g, '')
      if (this.list.name.length == 0) {
        this.$message.warning(`請輸入物料名稱`)
        return
      }
      if (this.edited) {
        let data = { id: this.materialsId, depotId: this.list.depotId }
        this.$api.Materials.updateMaterial(data)
          .then(() => {
            this.$message.success(`修改成功`)
            this.visible = false
            this.onSearch()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      } else {
        this.$api.Materials.addMaterial(this.list)
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
      this.list = { name: '', depotId: '' }
    },
    clearInput() {},
    editHandler(item) {
      this.edited = true
      this.changeTitle = '編輯倉庫'
      this.materialsId = item.id
      this.list.name = item.name
      this.list.depotId = item.depotId
      this.depotList = []
      this.$api.Materials.getList()
        .then(res => {
          this.depotList = res.data
          this.depotId = item.depotId ? item.depotId : '請選擇'
        })
        .catch(err => {
          console.log(err)
        })

      this.visible = true
    },
    onDelete(item) {
      this.$api.Materials.delMaterial(item.id)
        .then(() => {
          this.$message.success(item.name + '刪除成功')
          this.onSearch()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    onSelect(value) {
      this.list.depotId = value
      this.depotId = value
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
      this.current = 1
      this.getMaterialsList()
    },
    onPageChange(current, pageSize) {
      this.current = current
      this.getMaterialsList()
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
  margin-left: 50px;
  width: 300px;
}
.class-input > label {
  width: 90px;
}
.class-input > input {
  margin-left: 5px;
}
.class-input > .ant-select {
  width: 300px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
