<template>
  <div class="container">
    <div class="distribute-action">
      <a-button class="addButton2" @click="showAddOrderView"
        >新增出貨<a-icon type="plus"
      /></a-button>
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

              <a-button @click="showDetail(record)" type="link">{{
                text
              }}</a-button>
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
            <a-button type="link" size="small" @click="editHandler(record)"
              >編輯</a-button
            >
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
                    <a-date-picker
                      v-model="dateForOrderNo"
                      @change="salesDate"
                    />
                  </div>
                  <div v-else>{{ orderDetail.salesDay }}</div>
                </a-form-model-item>
                <a-form-model-item
                  class="custom-form-item"
                  label="出貨單號"
                  prop=""
                  v-model="orderNumber"
                >
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    {{ orderNumber }}
                  </div>
                  <div v-else>
                    {{ orderDetail.orderNo }}
                  </div>
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="統一編號">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    {{ list.vatNumber }}
                  </div>
                  <div v-else>
                    {{ orderDetail.vatNumber }}
                  </div>
                </a-form-model-item>
              </div>
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="客戶類別">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-select
                      show-search
                      placeholder="請選擇"
                      style="width: 200px"
                      v-model="customerClass"
                      @change="cusListChange"
                    >
                      <a-select-option
                        v-for="item in classesList"
                        :value="item.id"
                        :key="item.id"
                      >
                        {{ item.className }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else>{{ orderDetail.className }}</div>
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="客戶名稱">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-select
                      show-search
                      placeholder="請選擇"
                      style="width: 200px"
                      :filter-option="filterOption"
                      v-model="optionId"
                      @change="handleChange"
                    >
                      <a-select-option v-for="item in cusList" :value="item.id">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else>{{ orderDetail.clientName }}</div>
                </a-form-model-item>
                <a-form-model-item
                  class="custom-form-item"
                  label="客戶電話"
                  v-model="list.tel"
                >
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    {{ list.tel }}
                  </div>
                  <div v-else>
                    {{ orderDetail.phoneNumber }}
                  </div>
                </a-form-model-item>
              </div>
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="收件人">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    {{ receiverList.receiver }}
                  </div>
                  <div v-else>
                    {{ orderDetail.receiver }}
                  </div>
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="收件電話">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    {{ receiverList.tel }}
                  </div>
                  <div v-else>
                    {{ orderDetail.receiverPhone }}
                  </div>
                </a-form-model-item>
                <a-form-model-item class="custom-form-item" label="收件地址">
                  <div
                    style="display: flex"
                    v-if="orderModalTitle !== '訂單詳情'"
                  >
                    <div style="width: 10%">
                      {{ receiverList.postCode }}
                    </div>
                    <div>
                      {{ receiverList.address }}
                    </div>
                  </div>
                  <div style="display: flex" v-else>
                    <div style="width: 10%">
                      {{ orderDetail.receivePostCode }}
                    </div>
                    <div>
                      {{ orderDetail.receiveAddress }}
                    </div>
                  </div>
                </a-form-model-item>
              </div>
            </div>
            <div class="sales-detail">
              <a-form-model class="option-wrapper">
                <a-form-model-item label="付款方式" class="option-content">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-radio-group v-model="payments">
                      <a-radio class="option-content-input" :value="1">
                        貨到付款
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        匯款
                      </a-radio>
                      <a-radio class="option-content-input" :value="3">
                        現金
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div v-else>
                    <a-radio-group v-model="orderDetail.payment" disabled>
                      <a-radio class="option-content-input" :value="1">
                        貨到付款
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        匯款
                      </a-radio>
                      <a-radio class="option-content-input" :value="3">
                        現金
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <a-form-model-item label="出貨方式" class="option-content">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-radio-group v-model="shipment" @change="clearTrackingNo">
                      <a-radio
                        class="option-content-input"
                        style="margin-right:36px"
                        :value="1"
                      >
                        親送
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        黑貓宅配
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-left:-28px"
                        :value="3"
                      >
                        自取
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div v-else>
                    <a-radio-group
                      v-model="orderDetail.shipment"
                      @change="clearTrackingNo"
                      disabled
                    >
                      <a-radio
                        class="option-content-input"
                        style="margin-right:36px"
                        :value="1"
                      >
                        親送
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        黑貓宅配
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-left:-28px"
                        :value="3"
                      >
                        自取
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <div v-if="this.shipment === 2">
                  <a-form-model-item
                    class="option-content"
                    label="物流編號"
                    prop=""
                  >
                    <a-input
                      v-model="trackingNo"
                      style="width: 200px"
                      placeholder="請輸入"
                    />
                  </a-form-model-item>
                </div>
                <div v-else>
                  <div></div>
                </div>
                <a-form-model-item label="溫層類別" class="option-content">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-radio-group v-model="temperatureCategory">
                      <a-radio
                        class="option-content-input"
                        style="margin-right:36px"
                        :value="1"
                      >
                        常溫
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        冷藏
                      </a-radio>
                      <a-radio class="option-content-input" :value="3">
                        冷凍
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div v-else>
                    <a-radio-group
                      v-model="orderDetail.temperatureCategory"
                      disabled
                    >
                      <a-radio
                        class="option-content-input"
                        style="margin-right:36px"
                        :value="1"
                      >
                        常溫
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        冷藏
                      </a-radio>
                      <a-radio class="option-content-input" :value="3">
                        冷凍
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <a-form-model-item label="材積單位" class="option-content">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-radio-group v-model="volume">
                      <a-radio
                        class="option-content-input"
                        style="margin-right:20px"
                        :value="1"
                      >
                        60公分
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:-6px"
                        :value="2"
                      >
                        90公分
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:-10px"
                        :value="3"
                      >
                        120公分
                      </a-radio>
                      <a-radio class="option-content-input" :value="4">
                        150公分
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div v-else>
                    <a-radio-group v-model="orderDetail.volume" disabled>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:20px"
                        :value="1"
                      >
                        60公分
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:-6px"
                        :value="2"
                      >
                        90公分
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:-10px"
                        :value="3"
                      >
                        120公分
                      </a-radio>
                      <a-radio class="option-content-input" :value="4">
                        150公分
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <a-form-model-item
                  class="option-content"
                  label="運費金額"
                  prop=""
                >
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-input
                      v-model="shippingFee"
                      style="width: 200px"
                      placeholder="請輸入"
                    />
                  </div>
                  <div v-else>
                    {{ orderDetail.shippingFee }}
                  </div>
                </a-form-model-item>
              </a-form-model>
            </div>
            <div class="second-part">
              <div class="second-part-item">
                <div>
                  <div style="display: flex">
                    出貨商品
                    <div v-if="orderModalTitle !== '訂單詳情'">
                      <a-button
                        type="primary"
                        size="small"
                        class="editable-add-btn"
                        @click="handleAdd"
                      >
                        <a-icon type="plus" />
                      </a-button>
                    </div>
                    <div v-else></div>
                  </div>
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
          </a-form-model>
          <div class="print-wrapper">
            <h3>列印資料</h3>
            <div class="button-wrapper">
              <ModalExample :distirbuteHandler="handleOk" :orderData="orderData" :orderDetail="orderDetail" />
            </div>
          </div>
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
import {shippingRule} from '@/components/shippingFee'
import ModalExample from './Execel/index'
import moment from 'moment'
import { computedWeight } from '@/unit/dictionary/computed'
import Fragment from '@/components/Fragment'
export default {
  components: { ModalExample },
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
          width: '20%',
          customRender: (value, row) => {
            console.log(row, 555)
            return {
              children:
                this.orderModalTitle !== '訂單詳情' ? (
                  <div>
                    <a-input
                      onChange={barCode => this.pushName(barCode, row)}
                      vModel={row.barCode}
                      placeholder="請手動輸入商品條碼"
                    ></a-input>
                  </div>
                ) : (
                  <div>{row.barcode}</div>
                )
            }
          },
          scopedSlots: { customRender: 'barCode' }
        },
        {
          title: '商品名稱',
          dataIndex: 'productName',
          align: 'center',
          customRender: (value, row) => {
            return {
              children: <div>{row.productName}</div>
            }
          }
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
          width: '8%',
          customRender: (val, row) => {
            return this.Quantity(val, row, 'amount')
          },
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '建議售價',
          dataIndex: 'price',
          align: 'center',
          width: '8%',
          customRender: (val, row) => {
            return {
              children: <div>{row.price}</div>
            }
          }
        },
        {
          title: '出貨售價',
          dataIndex: 'clientPrice',
          align: 'center',
          width: '8%',
          customRender: (val, row) => {
            return <div>{row.clientPrice}</div>
          }
        },
        {
          title: '折讓',
          dataIndex: 'discount',
          align: 'center',
          width: '8%',
          customRender: (val, row) => {
            return this.Quantity(val, row, 'discount')
          },
          scopedSlots: { customRender: 'discount' }
        },
        {
          title: '小計',
          dataIndex: 'orderPrice',
          align: 'center',
          customRender: (_, row) => {
            return {
              children:
                row.clientPrice > 0
                  ? row.clientPrice * row.amount - row.discount
                  : row.price * row.amount - row.discount
            }
          },
          scopedSlots: { customRender: 'orderPrice' }
        },
        {
          title: '備註',
          dataIndex: 'reference',
          align: 'center',
          width: '14%',
          customRender: (val, row) => {
            return this.Quantity(val, row, 'reference')
          },
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
                {this.orderModalTitle !== '訂單詳情' ? (
                  <div>
                    <a-popconfirm
                      title="確定要刪除嗎?"
                      onConfirm={() => this.deleteOrder(row, index)}
                    >
                      <a>刪除</a>
                    </a-popconfirm>
                  </div>
                ) : (
                  <span></span>
                )}
              </div>
            )
          }),
          scopedSlots: { customRender: 'operation' }
        }
      ],
      orderData: [],
      list: {},
      cusList: [],
      inventoryList: [],
      searchBarcode: '',
      currentPage: 1,
      pageSizes: 10,
      totalPages: 10,
      selectList: [],
      classesList: [],
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
      search: '',
      optionId: '',
      customerClass: '',
      pageSizeOptions: ['10', '30', '50', '100'],
      pageNumber: 1,
      pageSize: 10,
      total: 30,
      startDate: differentDate[0].format('YYYY-MM-DD'),
      endDate: differentDate[1].format('YYYY-MM-DD'),
      dateForOrderNo: '',
      orderNumber: '',
      payments: 1,
      shipment: 1,
      temperatureCategory: 2,
      volume: 1,
      trackingNo: '',
      shippingFee: '',
      receiverList: {},
      orderDetail: {}
    }
  },
  created() {
    this.distributeList()
    this.getClass()
    console.log(shippingRule)
  },
  mounted() {
    this.CommodityDetail(this.searchBarcode)
  },
  methods: {
    showAddOrderView() {
      this.orderModalTitle = '出貨'
      this.orderViewVisible = true
      this.getCustomerList()
    },
    editHandler(record) {
      this.getCustomerList()
      this.orderViewVisible = true
      this.orderModalTitle = '編輯出貨'

      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res => {
        this.customerClass = res.data.classId
        this.optionId = res.data.clientId

        this.cusList = this.customerList.filter(item => {
          return item.classes.id === this.customerClass
        })
        // this.cusListChange(this.customerClass)
        // this.handleChange(record.clientId)

        this.orderData = res.data.orderDetailItemResponseList.map(item => {
          return {
            amount: item.amount,
            barCode: item.barcode,
            price: item.price,
            productName: item.productName,
            reference: item.remark,
            clientPrice: item.clientPrice,
            orderPrice: item.totalPrice,
            unit: item.unit,
            discount: 0,
            isEditAmount: true,
            isEditReference: true,
            isEditDiscount: true
          }
        })
      })
      this.orderNumber = record.orderNo
      this.dateForOrderNo = record.date
    },
    handleCancel() {
      this.purchaseViewVisible = false
      this.orderViewVisible = false
      this.orderData = []
      this.list = {}
      this.remark = ''
      this.selectList = []
      this.optionId = ''
      this.customerClass = ''
      this.dateForOrderNo = ''
      this.orderNumber = ''
      this.payments = 1
      this.shipment = 1
      this.temperatureCategory = 2
      this.volume = 1
      this.trackingNo = ''
      this.shippingFee = ''
    },
    clearTrackingNo() {
      this.trackingNo = ''
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
    cusListChange(id) {
      this.cusList = this.customerList.filter(item => {
        return item.classes.id === id
      })
      this.optionId = ''
      this.list = {}
      this.receiverList = {}
    },
    handleChange(id) {
      this.list = this.customerList.find(item => {
        return item.id === id
      })
      this.receiverList = Object.assign({}, this.list.recipientList[0])

      // this.list = JSON.parse(JSON.stringify(this.customerList.find(item => {
      //   return item.id === id
      // })))
      this.orderData = []
      this.specificId = id
      this.SalesProduct()
    },
    salesDate(date, dateString) {
      this.dateForOrderNo = dateString

      if (dateString === '') {
        this.orderNumber = ''
      } else {
        this.$api.Distribute.getOrderNo({
          date: this.dateForOrderNo
        }).then(res => {
          this.orderNumber = res.data
        })
      }
    },
    handleAdd() {
      const { orderData } = this
      const newData = {
        order: 0,
        barCode: '',
        productName: '',
        unit: '-',
        productId: undefined,
        clientPrice: 0,
        price: 0,
        amount: 1,
        discount: 0,
        reference: '',
        orderPrice: 0,
        isEditAmount: true,
        isEditReference: true,
        isEditDiscount: true
      }
      this.orderData = [...orderData, newData]
    },
    clearData(row, index) {
      let rows = this.orderData[index]
      rows.barCode = ''
      rows.unit = '-'
      rows.clientPrice = 0
    },
    pushValue(id, index) {
      let rows = this.orderData[index]
      this.selectList.forEach(item => {
        if (item.productId === id) {
          rows.barCode = item.barcode
          rows.productId = id
          rows.unit = computedWeight(undefined, item.unit)
          rows.clientPrice = item.clientPrice
        }
      })
    },
    pushName(barCode, row) {
      if (row.barCode !== '') {
        this.selectList.filter(item => {
          if (item.barcode === row.barCode) {
            console.log(this.selectList,9999)
            row.productId = item.productId
            row.unit = computedWeight(undefined, item.unit)
            row.clientPrice = item.clientPrice
            row.productName = item.productName
            row.price = item.price
          }
          return item.barcode === row.barCode
        })
      } else {
        row.productId = ''
        row.productName = ''
        row.unit = '-'
        row.clientPrice = 0
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
              payment: 1,
              shipment: 2,
              temperatureCategory: 1,
              volume: 1,
              orderNo: this.orderNumber,
              stockOutDate: this.dateForOrderNo,
              trackingNo: this.trackingNo,
              shippingFee: this.shippingFee,
              orderItemRequestList: this.orderData.map(item => {
                return {
                  barcode: item.barCode,
                  amount: item.amount,
                  discount: item.discount,
                  price: item.orderPrice,
                  remark: item.reference
                }
              })
            })
              .then(() => {
                this.$message.success('出貨確認成功')
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
      // let promise =  new Promise(function (resolve, reject) {
      //     this.editHandler();
      // })

      // promise.then(function () {
      //
      // })
      this.$api.Inventory.onlyCustomerList().then(res => {
        this.customerList = res.data
      })
    },
    getClass() {
      this.$api.Customer.getClass().then(res => {
        this.classesList = res.data.map(item => {
          return item
        })
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
    getOrderDetail(record) {
      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res => {
        this.orderData = res.data.orderDetailItemResponseList
        console.log(this.orderData, 33)
      })
    },
    showDetail(record) {
      console.log(record, 333)
      this.orderViewVisible = true
      this.orderModalTitle = '訂單詳情'
      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res => {
        this.orderDetail = res.data
        this.orderList = res.data.orderDetailItemResponseList
        this.orderData = res.data.orderDetailItemResponseList

        let count = 0
        let total = 0
        this.orderList.forEach(item => {
          count += item.amount
          total += item.totalPrice
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
                    onKeyup={() =>
                      (key === 'discount' || key === 'amount') &&
                      (row[key] = row[key].replace(/[^\d]/g, ''))
                    }
                    vOn:Keyup_enter={() => this.addNewItem(row, editKey)}
                  />
                </div>
              ) : (
                <Fragment>
                  <span onClick={() => this.inputORnot(row, editKey)}>
                    {val}
                  </span>
                  <div class="displayEdit" />
                  <a-icon
                    class="editable-cell-icon"
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
::v-deep .ant-modal-content {
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
.sales-detail {
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
.option-content {
  display: flex;
  margin: 12px 0 0 0;
}
.option-content-input {
  padding: 0 80px 0 0;
}
.print-wrapper {
  height: 100px;
  margin-top: 10px;
  background-color: #f5f5f5;
  .button-wrapper {
    .print-btn {
      background-color: #fba129;
      color: #fcfcfc;
      font-size: large;
      border: unset;
      cursor: pointer;
    }
  }
}
.saleTable {
  background-color: #fff;
}
.displayInput {
  display: flex;
  justify-content: space-evenly;
}
.displayEdit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.editable-cell-icon {
  display: block;
  position: relative;
  z-index: 1;
  cursor: pointer;
  top: 3.5px;
}
</style>
