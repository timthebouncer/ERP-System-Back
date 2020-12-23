<template>
  <div class="container">
    <div class="distribute-action">
      <div class="calendar">
        <a-select :defaultValue="2" style="width: 100px;" @change="changeDate">
          <a-select-option :value="0">今天</a-select-option>
          <a-select-option :value="1">本週</a-select-option>
          <a-select-option :value="2">本月</a-select-option>
          <a-select-option :value="3">上個月</a-select-option>
          <a-select-option :value="4">全部</a-select-option>
        </a-select>
        <a-range-picker v-model="differentDate" @change="onChange" />
      </div>
      <div class="search-wrapper">
        <div class="search-input">
          <a-input-search
              v-model="search"
              placeholder="搜尋單號"
              enter-button
              autoFocus
              @search="searchHandler"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table
          :columns="columns"
          :data-source="tableData"
          bordered
          rowKey="id"
          :pagination="false"
      >
        <template
            v-for="col in [
            'date',
            'orderNo',
            'clientName',
            'productAmount',
            'totalPrice',
            'remark',
            'operation'
          ]"
            :slot="col"
            slot-scope="text, record"
        >
          <div :key="col">
            <template v-if="col === 'orderNo'">
              <a-popover
                  placement="bottomLeft"
                  trigger="click"
                  @visibleChange="showDetail(record)"
              >
                <template slot="content">
                  <div>
                    <template>
                      <div class="detail-menu">
                        <span> 出貨日期: {{ record.date }} </span>
                        <span> 出貨單號: {{ record.orderNo }} </span>
                        <span> 客戶姓名: {{ record.clientName }} </span>
                      </div>
                    </template>
                    <a-table
                        :columns="columns2"
                        :data-source="orderList"
                        bordered
                        rowKey="id"
                        :pagination="false"
                    >
                      <template
                          v-for="col in [
                          'order',
                          'productName',
                          'unit',
                          'salesPrice',
                          'amount'
                        ]"
                          :slot="col"
                          slot-scope="text, record, index"
                      >
                        <div :key="col">
                          <template v-if="col === 'order'">
                            {{ index + 1 }}
                          </template>
                          <template v-else>
                            {{ text }}
                          </template>
                        </div>
                      </template>
                    </a-table>
                    <template>
                      <span> 總數:{{ Calculate.count }} </span>
                      <span> 總金額:{{ Calculate.total }} </span>
                    </template>
                  </div>
                </template>
                <a-button type="link">{{ text }}</a-button>
              </a-popover>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.remark === '註銷'">
            <a-button type="link" size="small" disabled>取消訂單</a-button>
          </template>
          <template v-else>
            <a-popconfirm
                title="取消訂單後將無法復原"
                @confirm="() => cancelHandler(record)"
            >
              <a-button type="link" size="small">取消訂單</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <div class="pagination">
      <a-pagination
          class="pagination"
          v-model="pageNumber"
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
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    let differentDate = [
      moment()
          .date(1)
          .startOf('day'),
      moment().endOf('month')
    ]
    return {
      differentDate,
      tableData: [],
      orderList: [],
      detailInfo: {},
      Calculate: {},
      columns: [
        {
          title: '日期',
          dataIndex: 'date',
          align: 'center',
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '單號',
          dataIndex: 'orderNo',
          align: 'center',
          scopedSlots: { customRender: 'orderNo' }
        },
        {
          title: '客戶',
          dataIndex: 'clientName',
          align: 'center',
          scopedSlots: { customRender: 'clientName' }
        },
        {
          title: '商品數量',
          dataIndex: 'productAmount',
          align: 'center',
          scopedSlots: { customRender: 'productAmount' }
        },
        {
          title: '金額',
          dataIndex: 'totalPrice',
          align: 'center',
          scopedSlots: { customRender: 'totalPrice' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        },
        {
          title: '備註',
          dataIndex: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      columns2: [
        {
          title: '#',
          dataIndex: 'order',
          align: 'center',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '商品名稱',
          dataIndex: 'productName',
          align: 'center',
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '單位量',
          dataIndex: 'unit',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '售價',
          dataIndex: 'salesPrice',
          align: 'center',
          scopedSlots: { customRender: 'salesPrice' }
        },
        {
          title: '數量',
          dataIndex: 'amount',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        }
      ],
      search: '',
      pageSizeOptions: ['10', '30', '50', '100'],
      pageNumber: 1,
      pageSize: 10,
      total: 30,
      startDate: differentDate[0].format('YYYY-MM-DD'),
      endDate: differentDate[1].format('YYYY-MM-DD')
    }
  },
  created() {
    this.distributeList()
  },
  methods: {
    changeDate(expression) {
      switch (expression) {
        case 0:
          this.differentDate = [moment().startOf('day'), moment().endOf('day')]
          this.startDate = this.differentDate[0].format('YYYY-MM-DD')
          this.endDate = this.differentDate[1].format('YYYY-MM-DD')
          this.distributeList()
          break
        case 1:
          this.differentDate = [
            moment()
                .isoWeekday(1)
                .startOf('day'),
            moment()
                .isoWeekday(7)
                .startOf('day')
          ]
          this.startDate = this.differentDate[0].format('YYYY-MM-DD')
          this.endDate = this.differentDate[1].format('YYYY-MM-DD')
          this.distributeList()
          break
        case 2:
          this.differentDate = [
            moment()
                .date(1)
                .startOf('day'),
            moment().endOf('month')
          ]
          this.startDate = this.differentDate[0].format('YYYY-MM-DD')
          this.endDate = this.differentDate[1].format('YYYY-MM-DD')
          this.distributeList()
          break
        case 3:
          this.differentDate = [
            moment()
                .month(moment().month() - 1)
                .date(1)
                .startOf('day'),
            moment()
                .month(moment().month() - 1)
                .endOf('month')
          ]
          this.startDate = this.differentDate[0].format('YYYY-MM-DD')
          this.endDate = this.differentDate[1].format('YYYY-MM-DD')
          this.distributeList()
          break
        case 4:
          this.differentDate = ['']
          this.startDate = this.differentDate[0]
          this.endDate = this.differentDate[0]
          this.distributeList()
          break
      }
    },
    // formatToDate: string = 'YYYY-MM-DD'
    onChange(date, dateString) {
      ;(this.startDate = dateString[0]), (this.endDate = dateString[1])
      this.distributeList()
    },
    distributeList() {
      this.$api.Distribute.getDistributeList({
        orderNo: this.search,
        startDate:
            this.startDate == '' ? this.startDate : this.startDate + ' 00:00:00',
        endDate: this.endDate == '' ? this.endDate : this.endDate + ' 23:59:59',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then(res => {
        this.total = res.data.totalElements
        this.tableData = res.data.content
      })
    },
    onShowSizeChange(current, pageSize) {
      this.pageNumber = 1
      this.pageSize = pageSize
      this.distributeList(this.search)
    },
    onPageChange(current) {
      this.distributeList(this.search)
    },
    showDetail(record) {
      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res => {
        this.orderList = res.data.orderDetailItemResponseList
        let count = 0
        let total = 0
        this.orderList.forEach(item => {
          count += item.amount
          total += item.salesPrice
        })
        this.Calculate = { count, total }
      })
    },
    cancelHandler(record) {
      this.$api.Distribute.deleteOrderList(record).then(() => {
        record.remark = '註銷'
      })
    },
    searchHandler() {
      this.pageNumber = 1
      this.distributeList()
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  // padding: 20px;
  position: relative;
}
.distribute-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 30px;
}
.distribute-action .calendar {
  margin-right: 10px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.ant-calendar-picker {
  padding: 5px;
}
.detail-menu {
  display: flex;
  flex-direction: column;
}
</style>
