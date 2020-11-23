<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <a-button class="addButton" @click="onAdd"
          >新增<a-icon type="plus"
        /></a-button>
      </div>
      <div class="search-wrapper">
        <div class="searchInput">
          <a-input-search
            v-model="searchValue"
            placeholder="輸入標籤名稱關鍵字"
            enter-button
            @search="onSearch"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        class="inventoryLogTable"
        :columns="columns"
        bordered
        :pagination="false"
        :data-source="tableData"
        rowKey="id"
      >
        <template slot="showFront" slot-scope="value, record">
          <a-switch :checked="value" @change="onChange($event, record)" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a-row type="flex">
            <a-col :span="11" align="right"
              ><a-button @click="onEdit(record)">編輯</a-button></a-col
            >
            <a-col :span="2"></a-col>
            <a-col :span="11" align="left"
              ><a-button v-show="!record.showFront" @click="onDelete(record)"
                >刪除</a-button
              ></a-col
            >
          </a-row>
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
export default {
  name: 'Label',
  data() {
    return {
      searchValue: '',
      tableData: [],
      columns: [
        {
          title: '標籤名稱',
          dataIndex: 'tagName',
          width: '10%',
          align: 'center'
        },
        {
          title: '前台顯示',
          dataIndex: 'showFront',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'showFront' }
        },
        {
          title: '最後修改時間',
          dataIndex: 'updateDate',
          width: '20%',
          align: 'center'
        },
        {
          title: '動作',
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
    onAdd() {
      this.$store.state.labelMode = 'add'
      this.$router.push('EditLabel').catch(() => {})
    },
    onEdit(record) {
      this.$store.state.labelMode = 'edit'
      const data = {}
      data.id = record.id
      data.tagName = record.tagName
      data.showFront = record.showFront
      data.svgString = record.svgString
      data.height = record.height
      data.wide = record.wide
      this.$store.state.labelData = data
      this.$router.push('EditLabel').catch(() => {})
    },
    onDelete(record) {
      console.log(record.id)
      this.$api.Label.deleteTag(record.id)
        .then(() => {
          this.$message.success('標籤刪除成功')
          this.getTagList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSearch() {
      this.current = 1
      this.getTagList()
    },
    onChange(value, record) {
      const data = {}
      data.tagId = record.id
      data.tagName = record.tagName
      data.svgString = record.svgString
      data.showFront = !record.showFront
      data.height = record.height
      data.wide = record.wide
      this.$api.Label.editTag(data)
        .then(() => {
          this.$message.success('前台顯示變更成功')
          this.getTagList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
      this.current = 1
      this.getTagList()
    },
    onPageChange(current, pageSize) {
      this.current = current
      this.getTagList()
    },
    getTagList() {
      this.tableData = []
      this.$api.Label.getTagList(this.searchValue, this.current, this.pageSize)
        .then(res => {
          this.tableData = res.data.tagResponseList
          this.total = res.data.totalElements
          this.current = res.data.pageNumber
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.onSearch()
  }
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.addButton {
  background-color: #f59b22;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
}
</style>
