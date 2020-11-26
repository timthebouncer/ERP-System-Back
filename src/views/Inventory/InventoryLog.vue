<template>
  <div class="container">
    <div class="action">
      <div class="action-add"></div>
      <div class="search-wrapper">
        <a-space>
        <a-select
          default-value="3"
          style="width: 100px"
          @change="onSelectDateChange"
        >
          <a-select-option value="1">今天</a-select-option>
          <a-select-option value="2">本週</a-select-option>
          <a-select-option value="3">本月</a-select-option>
          <a-select-option value="4">上個月</a-select-option>
          <a-select-option value="all">全部</a-select-option>
        </a-select>
        <a-range-picker v-model="dateRange" :format="dateFormat" />
        <span style="margin: auto 8px;font-weight:bolder;">異動方式</span>
        <a-select
          default-value="all"
          style="width: 100px"
          @change="onSelectActionChange"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="STOCK_IN">進貨</a-select-option>
          <a-select-option value="STOCK_OUT">銷貨</a-select-option>
          <a-select-option value="STOCK_EDIT">編輯庫存</a-select-option>
          <a-select-option value="STOCK_DELETE">刪除庫存</a-select-option>
          <a-select-option value="CANCEL_ORDER">取消訂單</a-select-option>
        </a-select>
        <div class="searchInput">
          <a-input-search
            v-model="searchValue"
            placeholder="搜尋商品"
            enter-button
            @search="onSearch"
          />
        </div>
        </a-space>
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
        <template slot="amount" slot-scope="text">
          <span v-if="~text.indexOf('-')" class="amount--red">{{text}}</span>
          <span v-else>{{text}}</span>
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
  name: 'InventoryLog',
  data() {
    return {
      searchValue: '',
      tableData: [],
      columns: [
        {
          title: '日期',
          dataIndex: 'updateDate',
          width: '10%',
          align: 'center',
        },
        {
          title: '異動方式',
          dataIndex: 'action',
          width: '10%',
          align: 'center',
        },
        {
          title: '商品名稱',
          dataIndex: 'productName',
          width: '20%',
          align: 'center',
        },
        {
          title: '數量',
          dataIndex: 'amount',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '備註',
          dataIndex: '',
          width: '25%',
          align: 'center',
        },
      ],
      pageSizeOptions: ['10', '30', '50', '100'],
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
      action: '',
    }
  },
  methods: {
    onSearch() {
      this.current = 1
      this.getInventoryLogList()
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
          this.dateRange = [this.starDtate, this.endDate]
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
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
      this.current = 1
      this.getInventoryLogList()
    },
    onPageChange(current, pageSize) {
      // console.log(pageSize);
      // console.log(this.total);
      this.current = current
      this.getInventoryLogList()
    },
    getInventoryLogList() {
      this.tableData = []
      const data = {}
      data.searchKey = this.searchValue
      data.action = this.action
      data.startDate = this.startDate
      data.endDate = this.endDate
      data.pageNumber = this.current
      data.pageSize = this.pageSize
      this.$api.Inventory.getInventoryLogList(data)
        .then(res => {
          this.tableData = res.data.content.map((item, index) => {
            let obj = {
              id: index,
              ...item,
            }
            return obj
          })
          this.total = res.data.totalElements
          this.current = data.pageNumber
        })
        .catch(err => {
          console.log(err)
        })
    },
    moment,
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
      moment(new Date()).subtract(1, 'M').startOf('month')
    ).format(this.dateFormat)
    this.endLastMonthDay = moment(
      moment(new Date()).subtract(1, 'M').endOf('month')
    ).format(this.dateFormat)
    this.startDate = this.firstThisMonthDay
    this.endDate = this.endThisMonthDay
    this.dateRange = [this.startDate, this.endDate]
    this.onSearch()
  },
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.amount--red{
  color: #f00
}
</style>
