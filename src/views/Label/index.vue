<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
          <a-button class="addButton" @click="()=>{$router.push('AddLabel').catch(()=>{})}"
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
              <a-switch :checked="value"  @change="onChange($event, record)"/>
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
          scopedSlots: { customRender: "showFront" }
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
          scopedSlots: { customRender: "action" }
        }
      ],
      pageSizeOptions: ['10', '15', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 10,
      dateFormat: 'YYYY-MM-DD',
      today: '',
      startDate: '',
      endDate: '',
      firstThisWeekDay: '',
      endThisWeekDay: '',
      firstThisMonthDay: '',
      endThisMonthDay: '',
      firstLastMonthDay: '',
      endLastMonthDay: '',
      dateRange: [],
      action: ''
    }
  },
  methods: {
    onSearch() {
      this.current = 1
      this.getTagList()
    },
    onChange(value, record){
        const data = {}
        data.tagId = record.id
        data.svgString = record.svgString
        data.showFront = record.showFront
      this.$api.Label.editTag(data)
          .then(() => {
              this.getTagList()
          })
          .catch(err => {
              console.log(err)
          })
    },
    onSelectDateChange(value) {
      // let today = moment(new Date(),this.dateFormat);
      // console.log(value);
      // console.log(today);
      switch (value) {
        case '1':
          console.log('今天')
          this.startDate = this.today
          this.endDate = this.today
          this.dateRange = [this.startDate, this.endDate]
          break
        case '2':
          console.log('本周')
          this.startDate = this.firstThisWeekDay
          this.endDate = this.endThisWeekDay
          this.dateRange = [this.startDate, this.endDate]
          break
        case '3':
          console.log('本月')
          this.startDate = this.firstThisMonthDay
          this.endDate = this.endThisMonthDay
          this.dateRange = [this.startDate, this.endDate]
          break
        case '4':
          console.log('上個月')
          this.startDate = this.firstLastMonthDay
          this.endDate = this.endLastMonthDay
          this.dateRange = [this.startDate, this.endDate]
          break
        case 'all':
          console.log('全部')
          this.startDate = ''
          this.endDate = ''
          this.dateRange = null
          break
        default:
          break
      }
    },
    onSelectActionChange(value) {
      this.action = value == 'all' ? '' : value
      console.log(this.action)
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
      this.current = 1
      this.getTagList()
    },
    onPageChange(current, pageSize) {
      console.log(current)
      // console.log(pageSize);
      // console.log(this.total);
      this.current = current
      this.getTagList()
    },
    getTagList() {
      this.tableData = []
      this.$api.Label.getTagList(this.searchValue,this.current,this.pageSize)
        .then(res => {
          this.tableData = res.data.tagResponseList
          this.total = res.data.totalElements
          this.current = res.data.pageNumber
        })
        .catch(err => {
          console.log(err)
        })
    },
    moment
  },
  created() {
    this.today = moment(new Date()).format(this.dateFormat)
    this.firstThisWeekDay = moment(moment(new Date()).startOf('week'))
      .add(1, 'd')
      .format(this.dateFormat)
    this.endThisWeekDay = moment(moment(new Date()).endOf('week'))
      .add(1, 'd')
      .format(this.dateFormat)
    this.firstThisMonthDay = moment(moment(new Date()).startOf('month')).format(
      this.dateFormat
    )
    this.endThisMonthDay = moment(moment(new Date()).endOf('month')).format(
      this.dateFormat
    )
    this.firstLastMonthDay = moment(
      moment(new Date())
        .subtract(1, 'M')
        .startOf('month')
    ).format(this.dateFormat)
    this.endLastMonthDay = moment(
      moment(new Date())
        .subtract(1, 'M')
        .endOf('month')
    ).format(this.dateFormat)
    this.startDate = this.firstThisMonthDay
    this.endDate = this.endThisMonthDay
    this.dateRange = [this.startDate, this.endDate]
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
