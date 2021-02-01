<template>
  <div class="container">
    <div class="action">
      <div class="action-add"></div>
      <div class="search-wrapper">
        <a-space>
          <a-select
            default-value="3"
            v-model="dateSelectValue"
            style="width: 100px"
            @change="onSelectDateChange"
            class="dateSelect"
          >
            <a-select-option value="1">今天</a-select-option>
            <a-select-option value="2">本週</a-select-option>
            <a-select-option value="3">本月</a-select-option>
            <a-select-option value="4">上個月</a-select-option>
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="custom" v-if="customDateShow"
              >自訂時間</a-select-option
            >
          </a-select>
          <a-range-picker
            v-model="dateRange"
            :format="dateFormat"
            @change="onDateChange"
          />
          <span style="margin: auto 8px;font-weight:bolder;">異動方式</span>
          <a-select
            default-value="all"
            style="width: 100px"
            @change="onSelectActionChange"
          >
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="MATERIALS_CREAT">新增物料</a-select-option>
            <a-select-option value="DEPOT_UPDATE">編輯倉庫</a-select-option>
            <a-select-option value="MATERIALS_DELETE">刪除物料</a-select-option>
            <a-select-option value="MATERIALS_IN">入料</a-select-option>
            <a-select-option value="MATERIALS_OUT">出料</a-select-option>
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
        <template slot="action" slot-scope="text">
          <span v-if="text == 'MATERIALS_CREAT'">新增物料</span>
          <span v-else-if="text == 'DEPOT_UPDATE'">編輯倉庫</span>
          <span v-else-if="text == 'MATERIALS_DELETE'">刪除物料</span>
          <span v-else-if="text == 'MATERIALS_IN'">入料</span>
          <span v-else-if="text == 'MATERIALS_OUT'">出料</span>
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
  name: 'MaterialsLog',
  data() {
    return {
      searchValue: '',
      tableData: [],
      customDateShow: false,
      dateSelectValue: '3',
      columns: [
        {
          title: '日期',
          dataIndex: 'time',
          width: '10%',
          align: 'center'
        },
        {
          title: '異動方式',
          dataIndex: 'action',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '物料倉庫',
          dataIndex: 'depotName',
          width: '20%',
          align: 'center'
        },
        {
          title: '物料名稱',
          dataIndex: 'name',
          width: '30%',
          align: 'center'
        },
        {
          title: '數量',
          dataIndex: 'count',
          width: '10%',
          align: 'center'
        }
      ],
      pageSizeOptions: ['10', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 10,
      pageSizeChanged: false,
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
      this.getMaterialsLogList()
    },
    onDateChange(value) {
      this.startDate = moment(value[0]._d).format(this.dateFormat)
      this.endDate = moment(value[1]._d).format(this.dateFormat)
      this.onSearch()
      this.customDateShow = true
      this.dateSelectValue = 'custom'
    },
    onSelectDateChange(value) {
      this.customDateShow = false
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
      this.onSearch()
    },
    onSelectActionChange(value) {
      this.action = value == 'all' ? '' : value
      this.onSearch()
    },
    onShowSizeChange(current, pageSize) {
      console.log('showSizeChange')
      this.pageSizeChanged = true
      this.pageSize = pageSize
      this.current = 1
      this.getMaterialsLogList()
    },
    onPageChange(current, pageSize) {
      this.current = current
      this.getMaterialsLogList()
    },
    getMaterialsLogList() {
      this.tableData = []
      const data = {}
      data.key = this.searchValue
      data.action = this.action
      data.startDate =
        this.startDate === '' ? this.startDate : this.startDate + ' 00:00:00'
      data.endDate =
        this.endDate === '' ? this.endDate : this.endDate + ' 23:59:59'
      data.number = this.current - 1
      data.size = this.pageSize
      this.$api.Materials.getMaterialsLogList(data)
        .then(res => {
          this.tableData = res.data.content.map((item, index) => {
            let obj = {
              id: index,
              ...item
            }
            obj.time = moment(item.time).format('YYYY-MM-DD')
            return obj
          })
          this.total = res.data.totalElements
          if (this.pageSizeChanged) {
            this.current = 1
            this.pageSizeChanged = false
          }
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
.amount--red {
  color: #f00;
}
</style>
