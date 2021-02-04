<template>
  <div class="container">
    <div class="distribute-action">
      <a-button class="addButton2" @click="showAddOrderView">出貨</a-button>
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
              <!--原訂單詳情-->
              <!-- <a-popover
                placement="bottomLeft"
                trigger="click"
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
                  </div>
                </template>
              </a-popover> <-->

              <a-button @click="showDetail(record)" type="link">{{ text }}</a-button>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.remark === '註銷'">
            <a-button type="link" size="small" disabled="">編輯</a-button>
            <a-button type="link" size="small" disabled>取消訂單</a-button>
          </template>
          <template v-else>
            <a-button type="link" size="small" @click="editHandler(record)">編輯</a-button>
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

    <div class="addOrderView">
      <a-modal
        v-model="orderViewVisible"
        :title="orderModalTitle"
        width="1000px"
        @cancel="handleCancel"
        :destroyOnClose="true"
      >
        <div class="modal-body">
          <a-form-model layout="horizontal" ref="ruleForm">
            <!--              :model="list"-->
            <!--              :rules="rules"-->
            <div class="firstPart">
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="出貨日期">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-date-picker @change="salesDate" />
                  </div>
                  <div v-else>{{666}}</div>
                </a-form-model-item>
                <a-form-model-item
                  class="custom-form-item"
                  label="出貨單號"
                  prop="classes"
                >
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="統一編號">
                  {{ list.vatNumber }}
                </a-form-model-item>
              </div>
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="客戶類別">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-select
                            show-search
                            placeholder="請選擇"
                            style="width: 200px"
                    >
                      <a-select-option v-for="item in classesList" :value="item.id" :key="item.id">
                        {{item.className}}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else>888</div>
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="客戶名稱">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-select
                            show-search
                            placeholder="請選擇"
                            style="width: 200px"
                            :filter-option="filterOption"
                            @change="handleChange"
                            v-model="optionId"
                    >
                      <a-select-option
                              v-for="item in customerList"
                              :key="item.id"
                              :value="item.id"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else>{{"哈哈"}}</div>
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="客戶電話" v-model="list.tel">
                  {{ list.tel }}
                </a-form-model-item>
              </div>
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="收件人">
<!--                  <a-select-->
<!--                  show-search-->
<!--                  placeholder="請選擇"-->
<!--                  style="width: 200px"-->
<!--                  >-->
<!--                    <a-select-option>-->
<!--                    </a-select-option>-->
<!--                  </a-select>-->
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="收件電話">
                </a-form-model-item>
                <a-form-model-item class="custom-form-item address" label="收件地址">
                  <div style="width: 10%">
                    {{ list.postCode }}
                  </div>
                  <div>
                    {{ list.address }}
                  </div>
                </a-form-model-item>
              </div>
            </div>
            <div class="sales-detail">
              <a-form-model class="option-wrapper">
                <a-form-model-item label="付款方式" class="option-content">
                  <a-radio-group>
                    <a-radio class="option-content-input" value="1">
                      貨到付款
                    </a-radio>
                    <a-radio class="option-content-input" value="2">
                      匯款
                    </a-radio>
                    <a-radio class="option-content-input" value="3">
                      現金
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="出貨方式" class="option-content">
                  <a-radio-group>
                    <a-radio class="option-content-input" style="margin-right:36px" value="1">
                      親送
                    </a-radio>
                    <a-radio class="option-content-input" value="2">
                      黑貓宅配
                    </a-radio>
                    <a-radio class="option-content-input" style="margin-left:-28px" value="3">
                      自取
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                  class="option-content"
                  label="物流編號"
                  prop=""
                >
                  <a-input style="width: 200px" placeholder="請輸入" />
                </a-form-model-item>
                <a-form-model-item label="溫層類別" class="option-content">
                  <a-radio-group>
                    <a-radio class="option-content-input" style="margin-right:36px" value="1">
                      常溫
                    </a-radio>
                    <a-radio class="option-content-input" value="2">
                      冷藏
                    </a-radio>
                    <a-radio class="option-content-input" value="3">
                      冷凍
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="材積單位" class="option-content">
                  <a-radio-group>
                    <a-radio class="option-content-input" style="margin-right:20px" value="1">
                      60公分
                    </a-radio>
                    <a-radio class="option-content-input" style="margin-right:-6px" value="2">
                      90公分
                    </a-radio>
                    <a-radio class="option-content-input" style="margin-right:-10px" value="3">
                      120公分
                    </a-radio>
                    <a-radio class="option-content-input" value="4">
                      150公分
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                    class="option-content"
                    label="運費金額"
                    prop=""
                >
                  <a-input style="width: 200px" placeholder="請輸入" />
                </a-form-model-item>
              </a-form-model>
            </div>
            <div class="second-part">
              <div class="second-part-item">
                <div>
                  出貨商品
                  <a-button
                    type="primary"
                    size="small"
                    class="editable-add-btn"
                    @click="handleAdd"
                  >
                    <a-icon type="plus" />
                  </a-button>
                  <a-table
                      class="saleTable"
                    bordered
                    rowKey="productId"
                    :columns="orderColumns"
                    :data-source="orderData"
                    :pagination="true"
                  >
                  </a-table>
                  <a-form-model-item class="reference-wrapper" label="備註">
                    <div>
                      <a-textarea
                          v-model="remark"
                          line-height="center"
                          placeholder="請輸入"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                      />
                    </div>
                    <template>
                      <span> 總數量:{{ Calculate.count }} </span>
                      <span> 總金額:{{ Calculate.total }} </span>
                    </template>
                  </a-form-model-item>
                </div>
              </div>
            </div>
            <div class="print-wrapper">
              <h3>列印資料</h3>
              <div class="button-wrapper">
                <ModalExample />
            </div>
            </div>
          </a-form-model>
        </div>
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk">
            儲存
          </a-button>
          <a-button key="back" @click="handleCancel">
            取消
          </a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import ModalExample from './Execel/index'
// import axios from 'axios'
import moment from 'moment'
import { computedWeight } from '@/unit/dictionary/computed'
import Fragment from '@/components/Fragment'
export default {
  components:{ModalExample},
  data() {
    let differentDate = [
      moment()
        .date(1)
        .startOf('day'),
      moment().endOf('month')
    ]
    return {
      orderViewVisible: false,
      orderModalTitle: '',
      customerList: [],
      remark: '',
      orderColumns: [
        {
          title: '商品條碼',
          dataIndex: 'barCode',
          align: 'center',
          customRender: (value, row) => {
            return {
              children: (
                <div>
                  <a-input
                    onChange={barCode => this.pushName(barCode, row)}
                    vModel={row.barCode}
                    placeholder="請手動輸入商品條碼"
                  ></a-input>
                </div>
              )
            }
          },
          scopedSlots: { customRender: 'barCode' }
        },
        {
          title: '商品名稱',
          dataIndex: 'name',
          align: 'center',
          customRender: (value, row, index) => {
            return {
              children: (
                <div>
                  <a-auto-complete
                    value={row.productId}
                    onSelect={id => this.pushValue(id, index)}
                    onChange={() => this.clearData(row, index)}
                    dataSource={this.filterName}
                    placeholder="請選擇"
                    filter-option={this.filterOption}
                  ></a-auto-complete>
                </div>
              )
            }
          },
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '計價單位',
          dataIndex: 'unit',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '數量',
          dataIndex: 'amount',
          align: 'center',
          width: '10%',
          customRender: (val, row) => {
            return this.Quantity(val, row, 'amount')
          },
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '建議售價',
          dataIndex: 'Price',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'Price' }
        },
        {
          title: '出貨售價',
          dataIndex: 'salesPrice',
          align: 'center',
          width: '8%',
          scopedSlots: { customRender: 'salesPrice' }
        },
        {
          title: '折讓',
          dataIndex: 'discount',
          align: 'center',
          width: '6%',
          scopedSlots: { customRender: 'discount' }
        },
        {
          title: '小計',
          dataIndex: 'orderPrice',
          align: 'center',
          customRender: (_, row) => {
            return {
              children: row.salesPrice * row.amount
            }
          },
          scopedSlots: { customRender: 'orderPrice' }
        },
        {
          title: '備註',
          dataIndex: 'reference',
          align: 'center',
          width: '12%',
          scopedSlots: { customRender: 'reference' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '6%',
          align: 'center',
          customRender: (value, row, index) => ({
            children: (
              <div>
                {this.orderData.length ? (
                  <div>
                    <a-popconfirm
                      title="確定要刪除嗎?"
                      onConfirm={() => this.deleteOrder(row, index)}
                    >
                      <a>刪除</a>
                    </a-popconfirm>
                  </div>
                ) : (
                  <span>{row}</span>
                )}
              </div>
            )
          }),
          scopedSlots: { customRender: 'operation' }
        }
      ],
      orderData: [],
      list: {},
      inventoryList: [],
      searchBarcode: '',
      currentPage: 1,
      pageSizes: 10,
      totalPages: 10,
      selectList: [],
      classesList:[],
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
          title: '總金額',
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
          title: '狀態',
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
      optionId:'',
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
    this.getCustomerList()
    this.getClass()
  },
  mounted() {
    this.CommodityDetail(this.searchBarcode)
  },
  methods: {
    showAddOrderView() {
      this.orderModalTitle = '出貨'
      this.orderViewVisible = true
    },
    editHandler(record){
      this.orderViewVisible = true
      this.orderModalTitle = "編輯出貨"

      this.optionId = record.clientId
      this.handleChange(record.clientId)

      this.getOrderDetail(record);
    },
    handleCancel() {
      this.purchaseViewVisible = false
      this.orderViewVisible = false
      this.orderData = []
      this.list = {}
      this.remark = ''
      this.selectList = []
      this.optionId = ''
    },
    addNewItem(row, editKey) {
      row[editKey] = false
    },
    inputORnot(row, editKey) {
      row[editKey] = true
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleChange(id) {
      this.list = this.customerList.find(item => {
        return item.id === id
      })
      // this.list = JSON.parse(JSON.stringify(this.customerList.find(item => {
      //   return item.id === id
      // })))
      this.orderData = []
      this.specificId = id
      this.SalesProduct()
    },
    salesDate(date, dateString){
      console.log(date, dateString);
    },
    handleAdd() {
      const { orderData } = this
      const newData = {
        order: 0,
        barCode: '',
        name: '',
        unit: '-',
        productId: undefined,
        Price:0,
        salesPrice: 0,
        amount: 1,
        discount:0,
        reference:'',
        orderPrice: 0,
        isEditStockAmount: true
      }
      this.orderData = [...orderData, newData]
    },
    clearData(row, index) {
      let rows = this.orderData[index]
      rows.barCode = ''
      rows.unit = '-'
      rows.salesPrice = 0
    },
    pushValue(id, index) {
      let rows = this.orderData[index]
      this.selectList.forEach(item => {
        if (item.productId === id) {
          rows.barCode = item.barcode
          rows.productId = id
          rows.unit = computedWeight(undefined, item.unit)
          rows.salesPrice = item.price
        }
      })
    },
    pushName(barCode, row) {
      if (row.barCode !== '') {
        this.inventoryList.filter(item => {
          if (item.barcode === row.barCode) {
            row.productId = item.id
            row.unit = computedWeight(undefined, item.unit)
            row.salesPrice = item.salesPrice
          }
          return item.barcode === row.barCode
        })
      } else {
        row.productId = ''
        row.unit = '-'
        row.salesPrice = 0
        row.amount = 1
      }
    },
    handleOk() {
      let productId = this.orderData.map(item => item.productId)
      if (this.list.id) {
        if (this.orderData.length !== 0) {
          if (productId[0] !== undefined) {
            this.$api.Distribute.addOrder({
              clientId: this.list.id,
              remark: this.remark,
              orderItemRequestList: this.orderData.map(item => {
                return {
                  barcode: item.barCode,
                  price: item.salesPrice,
                  amount: item.amount
                }
              })
            })
              .then(() => {
                alert('出貨確認成功')
                this.orderViewVisible = false
                this.handleCancel()
                this.resetPage()
              })
              .catch(() => {
                const stock = this.orderData.map(item => {
                  return item.amount
                })
                const quantity = this.selectList.some(
                  (item, i) => item.amount < stock[i]
                )
                if (quantity) {
                  this.$message.error('出貨量大於庫存量')
                } else {
                  this.$message.error('無此商品條碼')
                }
              })
          } else {
            this.$message.error('請選擇商品')
          }
        } else {
          this.$message.error('請先新增商品')
        }
      } else {
        this.$message.error('請選擇客戶')
      }
    },
    deleteOrder(row, index) {
      this.orderData.splice(index, 1)
    },
    getCustomerList() {
      this.$api.Inventory.onlyCustomerList().then(res => {
        this.customerList = res.data
      })
    },
    getClass(){
      this.$api.Customer.getClass()
      .then(res=>{
        this.classesList = res.data.map(item=>{
          return item
        })
        console.log(this.classesList)
      })
    },
    SalesProduct() {
      this.$api.Commodity.getSalesProduct({
        searchKey: '',
        barcode: '',
        clientId: this.specificId
      }).then(res => {
        this.selectList = [].concat.apply([], res.data)
      })
    },
    CommodityDetail() {
      this.$api.Commodity.getCommodityDetail({
        searchKey: '',
        barcode: this.searchBarcode
      }).then(res => {
        this.inventoryList = res.data
        let data = []
        this.inventoryList.forEach(item => {
          if (item.barcode !== '') {
            data.push(item)
          }
        })
      })
    },
    resetPage() {
      this.distributeList()
    },
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
    getOrderDetail(record){
      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res=>{
        this.orderData = res.data.orderDetailItemResponseList
        console.log(this.orderData)
      })
    },
    showDetail(record) {
      this.orderViewVisible = true
      this.orderModalTitle = "訂單詳情"
        this.$api.Distribute.getDistributeDetail({
          orderId: record.orderId
        }).then(res => {
          this.orderList = res.data.orderDetailItemResponseList
          this.orderData = res.data.orderDetailItemResponseList
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
  },
  computed: {
    filterName() {
      return this.selectList.map(item => {
        return { value: item.productId, text: item.productName }
      })
    },
    Quantity() {
      return (val, row, key) => {
        let editKey =
          'isEdit' + key[0].toUpperCase() + key.substring(1, key.length)
        return {
          children: (
            <div class="displayInput">
              {row[editKey] ? (
                <div>
                  <a-input
                    autoFocus
                    placeholder="請輸入"
                    value={row[key]}
                    vModel={row[key]}
                    onKeyup={() => (row[key] = row[key].replace(/[^\d]/g, ''))}
                    vOn:Keyup_enter={() => this.addNewItem(row, editKey)}
                  />
                </div>
              ) : (
                <Fragment>
                  <span onClick={() => this.inputORnot(row, editKey)}>
                    {val}
                  </span>
                  <div className="displayEdit" />
                  <a-icon
                    className="editable-cell-icon"
                    type="edit"
                    onClick={() => this.inputORnot(row, editKey)}
                  />
                </Fragment>
              )}
            </div>
          )
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
  ::v-deep .ant-modal-content{
   margin: -50px -101px 0 -101px;
 }
.container {
  position: relative;
}
.distribute-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.addButton2 {
  background-color: #fba129;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
  border: unset;
  margin-right: auto;
}
.addPurchaseView /deep/ .ant-modal-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
  font-size: 16px;
}
.addPurchaseView div * {
  margin-right: 10px;
}
.firstPart {
  background-color: #f5f5f5;
  padding: 15px 20px 15px 20px;
}
.firstPart-item {
  display: flex;
}
.firstPart-item > div {
  flex: 1;
}
.sales-detail{
  margin-top: 15px;
  padding: 0 0 0 30px;
  background-color: #f5f5f5;
}

.second-part {
  background-color: #f5f5f5;
  margin: 15px 0px 0 0px;
  padding: 0px 20px 0px 20px;
  .editable-add-btn {
    margin-bottom: 15px;
    .discount {
      display: flex;
      align-items: center;
    }
    .discount > button {
      margin-left: 5px;
      float: left;
    }
    .discount-menu {
      margin-top: 5px;
      flex-direction: column;
    }
  }
}
.option-content{
  display: flex;
  margin: 12px 0 0 0;
}
.option-content-input{
  padding: 0 80px 0 0;
}
.print-wrapper{
  height: 100px;
  margin-top: 10px;
  background-color: #f5f5f5;
  .button-wrapper{
    .print-btn{
      background-color: #fba129;
      color: #fcfcfc;
      font-size: large;
      border: unset;
      cursor: pointer;
    }
  }
}
.saleTable{
  background-color: #fff;
}
.displayInput{
  display: flex;
  justify-content: space-evenly;
  line-height: 13px;
}
</style>
