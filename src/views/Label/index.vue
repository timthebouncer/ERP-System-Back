<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <a-button class="button1" @click="onAdd"
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
        :loading="isLoading"
      >
<!--        <template slot="showFront" slot-scope="value, record">-->
<!--          <a-switch :checked="value" @change="onChange($event, record)" />-->
<!--        </template>-->
        <template slot="action" slot-scope="text, record">
          <a-row type="flex">
            <a-col :span="11" align="right"
              ><a-button type="link" size="small" @click="onEdit(record)"
                >編輯</a-button
              ></a-col
            >
            <a-col :span="2"></a-col>
            <a-col :span="11" align="left">
              <a-popconfirm
                class="labelDeletePopconfirm"
                @confirm="() => onDelete(record)"
              >
                <template slot="title">
                  <span class="labelDeletePopTitle" style="font-size: larger;"
                    >確定刪除此標籤資料嗎?</span
                  >
                </template>
                <a-button type="link" size="small" v-show="tableData.length > 1"
                  >刪除</a-button
                >
              </a-popconfirm>
            </a-col>
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
      isLoading: false,
      searchValue: '',
      tableData: [],
      columns: [
        {
          title: '標籤名稱',
          dataIndex: 'tagName',
          width: '20%',
          align: 'center'
        },
        // {
        //   title: '前台顯示',
        //   dataIndex: 'showFront',
        //   width: '10%',
        //   align: 'center',
        //   scopedSlots: { customRender: 'showFront' }
        // },
        {
          title: '最後修改時間',
          dataIndex: 'updateDate',
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
      ],
      pageSizeOptions: ['10', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 10
    }
  },
  methods: {
    onAdd() {
      sessionStorage.setItem('labelMode', 'add')
      this.$store.state.labelMode = 'add'
      this.$router.push('EditLabel').catch(() => {})
    },
    onEdit(record) {
      sessionStorage.setItem('labelMode', 'edit')
      this.$store.state.labelMode = 'edit'
      const data = {}
      data.id = record.id
      data.tagName = record.tagName
      data.showFront = record.showFront
      data.svgString = record.svgString
      data.height = record.height
      data.wide = record.wide
      this.$store.state.labelData = data
      sessionStorage.setItem('labelData', JSON.stringify(data))
      this.$router.push('EditLabel').catch(() => {})
    },
    onDelete(record) {
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
      this.isLoading = true
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
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
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
</style>
