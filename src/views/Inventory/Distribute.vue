<template>
  <div class="container">
    <div class="distribute-action">
      <a-button class="addButton2" @click="showAddOrderView"
        >新增出貨<a-icon type="plus"
      /></a-button>
<!--      <inventoryExcel />-->
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
            'operation',
          ]"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <template v-if="col === 'orderNo'">
              <a-button @click="showDetail(record)" type="link">{{
                text
              }}</a-button>
            </template>
            <template v-else-if="col === 'remark'">
                {{record.action === 'CANCEL_ORDER' ? '註銷': ''}}
            </template>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.action === 'CANCEL_ORDER'">
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
          <a-form-model
            layout="horizontal"
            ref="ruleForm"
            :model="ruleList"
            :rules="rules"
          >
            <div class="firstPart">
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="出貨日期">
                  <div v-if="orderModalTitle !== '訂單詳情'" style="width: 315px;">
                    <a-date-picker
                      v-model="dateForOrderNo"
                      @change="salesDate"
                    />
                  </div>
                  <div v-else style="width: 315px;">{{ orderDetail.salesDay }}</div>
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
                <a-form-model-item
                  class="custom-form-item"
                  label="客戶類別"
                  prop="customerClass"
                >
                  <div v-if="orderModalTitle === '新增出貨'" style="width: 315px">
                    <a-select
                      show-search
                      placeholder="請選擇"
                      style="width: 175px"
                      v-model="ruleList.customerClass"
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
                  <div v-else style="width: 315px">{{ orderDetail.className }}</div>
                </a-form-model-item>
                <a-form-model-item
                  class="custom-form-item"
                  label="客戶名稱"
                  prop="optionId"
                >
                  <div v-if="orderModalTitle === '新增出貨'">
                    <a-select
                      show-search
                      placeholder="請選擇"
                      style="width: 175px"
                      :filter-option="filterOption"
                      v-model="ruleList.optionId"
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
                  <div v-if="orderModalTitle === '新增出貨'">
                    {{ list.tel }}
                  </div>
                  <div v-else>
                    {{ orderDetail.phoneNumber }}
                  </div>
                </a-form-model-item>
              </div>
              <div class="firstPart-item">
                <a-form-model-item class="custom-form-item" label="收件人">
                  <div v-if="orderModalTitle !== '訂單詳情'" style="width: 315px">
                    <a-select
                      show-search
                      placeholder="請選擇"
                      style="width: 175px"
                      v-model="recipientId"
                      @change="recipientChange"
                    >
                      <a-select-option
                        v-for="item in list.receiverList"
                        :value="item.id"
                      >
                        {{ item.receiver }}
                      </a-select-option>
                    </a-select>
                    <span>
                      {{ defaultOption }}
                    </span>
                  </div>
                  <div v-else  style="width: 315px">
                    <div v-if="orderDetail.receiver !== ''">
                      {{ orderDetail.receiver }}
                    </div>
                    <div v-else>
                      {{
                        list.defaultReceiveInfo === 0
                          ? list.name
                          : list.companyName
                      }}
                    </div>
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
              <a-form-model
                class="option-wrapper"
                ref="ruleForm"
                :rules="rules"
              >
                <a-form-model-item
                  label="付款方式"
                  class="option-content"
                  prop="payment"
                >
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
                       <span>貨到付款</span>
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                       <span>匯款</span>
                      </a-radio>
                      <a-radio class="option-content-input" :value="3">
                        <span>現金</span>
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <a-form-model-item
                  label="出貨方式"
                  prop="shipment"
                  class="option-content"
                >
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
                        <span>親送</span>
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        <span>黑貓宅配</span>
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-left:-28px"
                        :value="3"
                      >
                        <span>自取</span>
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <div v-if="this.shipment === 2">
                  <a-form-model-item
                    class="option-content"
                    label="物流編號"
                    prop=""
                    style="margin-left: 10px"
                  >
                    <div v-if="orderModalTitle !== '訂單詳情'">
                      <a-input
                              @change="dynamicChange"
                              v-model="trackingNo"
                              style="width: 200px"
                              placeholder="請輸入"
                              v-mask="'####-####-####'"
                      />
                    </div>
                    <div v-else>
                      {{orderDetail.trackingNo}}
                    </div>
                  </a-form-model-item>
                </div>
                <div v-else>
                  <div></div>
                </div>
                <a-form-model-item label="溫層類別" class="option-content" style="margin-left: 10px">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-radio-group
                      v-model="temperatureCategory"
                      @change="shippingFeeCaluelate"
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
                        <span>常溫</span>
                      </a-radio>
                      <a-radio class="option-content-input" :value="2">
                        <span>冷藏</span>
                      </a-radio>
                      <a-radio class="option-content-input" :value="3">
                        <span>冷凍</span>
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <a-form-model-item label="材積單位" class="option-content" style="margin-left: 10px">
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <a-radio-group
                      v-model="volume"
                      @change="shippingFeeCaluelate"
                    >
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
                      <a-radio
                        v-show="this.temperatureCategory === 1"
                        class="option-content-input"
                        :value="4"
                      >
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
                        <span>60公分</span>
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:-6px"
                        :value="2"
                      >
                        <span>90公分</span>
                      </a-radio>
                      <a-radio
                        class="option-content-input"
                        style="margin-right:-10px"
                        :value="3"
                      >
                       <span>120公分</span>
                      </a-radio>
                      <a-radio
                        v-show="this.temperatureCategory === 1"
                        class="option-content-input"
                        :value="4"
                      >
                        <span>150公分</span>
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-form-model-item>
                <a-form-model-item
                  class="option-content"
                  label="運費金額"
                  prop="shippingFee"
                >
                  <div v-if="orderModalTitle !== '訂單詳情'">
                    <span style="font-weight: bold">$</span>
                    <a-input
                      v-model="shippingFee"
                      style="width: 150px"
                      placeholder="請輸入"
                    />
                  </div>
                  <div v-else>
                    <span style="font-weight: bold">$</span>
                    {{ orderDetail.shippingFee }}
                  </div>
                </a-form-model-item>
              </a-form-model>
            </div>
            <div class="second-part">
              <div class="second-part-item">
                <div>
                  <div style="display: flex">
                    <h3 style="margin-top: 10px">出貨商品</h3>
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
                    :pagination="orderModalTitle !== '訂單詳情'?true:false"
                  >
                  </a-table>

                  <a-form-model-item class="remark-wrapper" label="備註">
                    <div v-if="orderModalTitle !== '訂單詳情'">
                      <a-textarea
                        v-model="remark"
                        line-height="center"
                        placeholder="請輸入"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                      />
                    </div>
                    <div v-else>{{ orderDetail.remark }}</div>
                    <template v-if="orderModalTitle !== '訂單詳情'">
                      <span> 總數量:{{ totalAmountPrice.count }} </span>
                      <span> 總金額:{{ totalAmountPrice.total }} </span>
                    </template>
                    <template v-else>
                      <span> 總數量:{{ Calculate.count }} </span>
                      <span> 總金額:{{ Calculate.total }} </span>
                    </template>
                  </a-form-model-item>
                </div>
              </div>
            </div>
          </a-form-model>
          <div class="print-wrapper">
            <div style="margin-left: 21px;"><h3>列印操作</h3></div>
            <div class="button-wrapper">
              <ModalExample
                :distirbuteHandler="handleOk"
                :orderData="orderData"
                :orderDetail="orderDetail"
                :orderTitle="orderModalTitle"
                :list="list"
                :receiverList="receiverList"
                :Calculate="Calculate"
                v-on:passTemplateType="getTemplateType"
              />
            </div>
          </div>
        </div>
        <template slot="footer">
          <div v-if="orderModalTitle !== '訂單詳情'">
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
            <a-button key="submit" type="primary" @click="handleOk">
              儲存
            </a-button>
          </div>
          <div v-else></div>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
// import inventoryExcel from '../Inventory/Execel/package'
import VueMask from 'v-mask'
import { shippingRule } from '@/components/shippingFee'
import ModalExample from './Execel/index'
import moment from 'moment'
import { computedWeight } from '@/unit/dictionary/computed'
import Fragment from '@/components/Fragment'
export default {
  components: { ModalExample},
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
          width: '12%',
          customRender: (value, row) => {
            return {
              children:
                this.orderModalTitle !== '訂單詳情' ? (
                  <div>
                    <a-input
                      autoFocus
                      style={{ width: '130px' }}
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
            console.log(row,111)
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
            console.log(row)
            return (row.unit === '件' || row.unit === '包') ? this.Quantity(val, row, 'amount') : row.weight
          },
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '建議售價(單價*數量)',
          dataIndex: 'price',
          align: 'center',
          width: '9.5%',
          customRender: (val, row) => {
            return {
              children: <div>{row.price * row.amount}</div>
            }
          }
        },
        {
          title: () => <div>出貨售價<br/>(出貨單價*數量)</div>,
          dataIndex: 'clientPrice',
          align: 'center',
          width: '140px',
          customRender: (val, row) => {
            return <div>{row.clientPrice * row.amount}</div>
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
          width: '8%',
          customRender: (_, row) => {
            return {
              children: this.$set(
                row,
                'orderPrice',
                row.clientPrice > 0
                  ? row.clientPrice * row.amount - row.discount
                  : row.price * row.amount - row.discount
              )
            }
          }
        },
        {
          title: '備註',
          dataIndex: 'remark',
          align: 'center',
          width: '14%',
          customRender: (val, row) => {
            return this.Quantity(val, row, 'remark')
          },
          scopedSlots: { customRender: 'remark' }
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
          title: '客戶名稱',
          dataIndex: 'clientName',
          align: 'center',
          scopedSlots: { customRender: 'clientName' }
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
        },
      ],
      search: '',
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
      shippingFee: 0,
      receiverList: {},
      orderDetail: {},
      recipientId: '',
      defaultList: [],
      defaultReceiver:'',
      defaultOption: '',
      findDefaultInfo: [],
      templateType: '',
      ruleList: {
        customerClass: '',
        optionId: ''
      },
      rules: {
        customerClass: [{ required: true, message: '請選擇', trigger: 'blur' }],
        optionId: [{ required: true, message: '請選擇', trigger: 'blur' }],
        payment: [{ required: true, message: '請選擇', trigger: 'blur' }],
        shipment: [{ required: true, message: '請選擇', trigger: 'blur' }],
        shippingFee: [
          {
            required: true,
            pattern: /^\d+$/,
            message: '請輸入數字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.distributeList()
    this.getClass()
    this.getCustomerList()
    this.getTemplateType()
  },
  mounted() {
    this.CommodityDetail(this.searchBarcode)
  },
  methods: {
    shippingFeeCaluelate() {
      let aaa =
        shippingRule[
          '' + this.shipment + this.temperatureCategory + this.volume
        ]
      this.shippingFee = aaa
    },
    dynamicChange(){
      // this.trackingNo = this.trackingNo.replace(/(\d{4})(?=\d)/g, '$1-')
    },
    getTemplateType(e) {
      this.templateType = e
    },
    showAddOrderView() {
      this.orderModalTitle = '新增出貨'
      this.orderViewVisible = true
      this.payments = 1
      this.shipment = 1
      this.temperatureCategory = 2
      this.volume = 1
      this.shippingFeeCaluelate()
    },
    editHandler(record) {
      console.log(record,666)
      this.orderViewVisible = true
      this.orderModalTitle = '編輯出貨'
      this.orderId = record.orderId

      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res => {
        this.orderDetail = res.data
        this.ruleList.customerClass = res.data.classId
        this.ruleList.optionId = res.data.clientId
        this.payments = res.data.payment
        this.shipment = res.data.shipment
        this.temperatureCategory = res.data.temperatureCategory
        this.volume = res.data.volume
        this.trackingNo = res.data.trackingNo
        this.remark = res.data.remark
        this.shippingFee = res.data.shippingFee
        this.defaultReceiver = res.data.defaultReceiveInfo
        this.$api.Commodity.getSalesProduct({
          searchKey: '',
          barcode: '',
          clientId: res.data.clientId
        }).then(res => {
          this.selectList = [].concat.apply([], res.data)
        })

        this.list = this.customerList.find(item => {
          return item.id === this.ruleList.optionId
        })
        this.findDefaultInfo = [
          { id: '', receiver: '', address: '', tel: '', postCode: '' },
          { id: '', receiver: '', address: '', tel: '', postCode: '' }
        ]
        this.findDefaultInfo.push(...this.list.recipientList)
        this.findDefaultInfo[0].id = '0'
        this.findDefaultInfo[0].receiver = this.list.name
        this.findDefaultInfo[0].address = this.list.address
        this.findDefaultInfo[0].postCode = this.list.postCode
        this.findDefaultInfo[0].tel = this.list.tel
        this.findDefaultInfo[1].id = '1'
        this.findDefaultInfo[1].receiver = this.list.companyName
        this.findDefaultInfo[1].address = this.list.companyAddress
        this.findDefaultInfo[1].postCode = this.list.companyPostCode
        this.findDefaultInfo[1].tel = this.list.companyTel
        this.list.receiverList = this.findDefaultInfo

        let nonDefaultList = this.list.receiverList.filter((item, i) => {
          return item.id === this.findDefaultInfo[i].id
        })
        this.defaultList = this.findDefaultInfo.filter(
          (item, i) => i === this.list.defaultReceiveInfo
        )
        if (nonDefaultList[this.list.defaultReceiveInfo].id === this.defaultList[0].id) {
          if (this.list.defaultReceiveInfo === 0) {
            this.defaultList[0].default = '同客戶資料(預設地址)'
            this.defaultOption = this.defaultList[0].default
          } else if (this.list.defaultReceiveInfo === 1) {
            this.defaultList[0].default = '同公司資料(預設地址)'
            this.defaultOption = this.defaultList[0].default
          } else {
            if (res.data.receiver === this.defaultList[0].receiver) {
              this.defaultList[0].default = '(預設地址)'
              this.defaultOption = this.defaultList[0].default
            }
          }
          nonDefaultList[this.defaultReceiver]
          this.recipientId = nonDefaultList[this.defaultReceiver].id
          console.log(nonDefaultList[this.defaultReceiver],111)
          this.receiverList = nonDefaultList[this.defaultReceiver]
          console.log(this.receiverList,222)
          // if (this.defaultList[0].id === '0') {
          //   this.recipientId = this.findDefaultInfo[0].id
          //   this.receiverList = { ...this.defaultList[0] }
          // } else if (this.defaultList[0].id === '1') {
          //   this.recipientId = this.findDefaultInfo[1].id
          //   this.receiverList = { ...this.defaultList[0] }
          // } else {
          //   if (res.data.receiver !== '' && res.data.recipientId === null) {
          //     this.recipientId = this.findDefaultInfo[0].id
          //     this.receiverList = { ...this.defaultList[0] }
          //   } else if (res.data.receiver === '') {
          //     this.recipientId = this.findDefaultInfo[1].id
          //     this.receiverList = { ...this.defaultList[0] }
          //   } else {
          //     this.recipientId = res.data.recipientId
          //     this.receiverList = { ...nonDefaultList[0] }
          //   }
          // }
        }

        this.orderData = res.data.orderDetailItemResponseList.map(item => {
          return {
            id: item.id,
            amount: item.amount,
            barCode: item.barcode,
            price: item.price,
            productName: item.productName,
            remark: item.remark,
            clientPrice: item.clientPrice,
            unit: item.unit,
            discount: item.discount,
            weight: item.weight,
            isEditAmount: true,
            isEditRemark: true,
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
      this.ruleList.optionId = ''
      this.ruleList.customerClass = ''
      this.dateForOrderNo = ''
      this.orderNumber = ''
      this.payments = ''
      this.shipment = ''
      this.temperatureCategory = ''
      this.volume = ''
      this.trackingNo = ''
      this.shippingFee = ''
      this.recipientId = ''
      this.receiverList = {}
      this.defaultOption = ''
      this.list.recipientList = []
      this.resetForm()
    },
    clearTrackingNo() {
      this.shippingFeeCaluelate()
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
      this.ruleList.optionId = ''
      this.list = {}
      this.recipientId = ''
      this.receiverList = {}
      this.$refs.ruleForm.validate()
    },
    handleChange(id) {
      this.$refs.ruleForm.validate()
      this.list = this.customerList.find(item => {
        return item.id === id
      })

      //把資料叫回來組一個陣列拿index去判斷defaultReceiveInfo
      this.findDefaultInfo = [
        { id: '', receiver: '', address: '', tel: '', postCode: '' },
        { id: '', receiver: '', address: '', tel: '', postCode: '' }
      ]
      this.findDefaultInfo.push(...this.list.recipientList)
      this.findDefaultInfo[0].id = '0'
      this.findDefaultInfo[0].receiver = this.list.name
      this.findDefaultInfo[0].address = this.list.address
      this.findDefaultInfo[0].postCode = this.list.postCode
      this.findDefaultInfo[0].tel = this.list.tel
      this.findDefaultInfo[1].id = '1'
      this.findDefaultInfo[1].receiver = this.list.companyName
      this.findDefaultInfo[1].address = this.list.companyAddress
      this.findDefaultInfo[1].postCode = this.list.companyPostCode
      this.findDefaultInfo[1].tel = this.list.companyTel

      this.list.receiverList = this.findDefaultInfo
      this.defaultList = this.findDefaultInfo.filter(
        (item, i) => i === this.list.defaultReceiveInfo
      )

      if (this.list.defaultReceiveInfo === 0) {
        this.defaultList[0].default = '同客戶資料(預設地址)'
      } else if (this.list.defaultReceiveInfo === 1) {
        this.defaultList[0].default = '同公司資料(預設地址)'
      } else {
        this.defaultList[0].default = '(預設地址)'
      }
      this.defaultOption = this.defaultList[0].default
      this.recipientId = this.defaultList[0].id
      this.receiverList = { ...this.defaultList[0] }

      this.defaultReceiver = this.list.receiverList.findIndex(item => item.id === this.defaultList[0].id)
      // this.receiverList = Object.assign({}, this.list.recipientList.filter(item=>item.id === id))[0]
      // this.recipientId = this.receiverList.id
      // this.list = JSON.parse(JSON.stringify(this.customerList.find(item => {
      //   return item.id === id
      // })))
      this.specificId = id
      this.SalesProduct()
    },
    recipientChange(id) {
      this.recipientId = id
      this.receiverList = Object.assign(
        {},
        this.list.receiverList.filter(item => item.id === id)
      )[0]
      if (
        this.receiverList.default === '同客戶資料(預設地址)' &&
        this.list.defaultReceiveInfo === 0
      ) {
        this.defaultOption = '同客戶資料(預設地址)'
      } else if (
        this.receiverList.default === '同公司資料(預設地址)' &&
        this.list.defaultReceiveInfo === 1
      ) {
        this.defaultOption = '同公司資料(預設地址)'
      } else if (
        this.receiverList.default === '(預設地址)' &&
        this.list.defaultReceiveInfo > 1
      ) {
        this.defaultOption = '(預設地址)'
      } else {
        this.defaultOption = ''
      }

       this.defaultReceiver = this.list.receiverList.findIndex(item => item.id === id)
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
        remark: '',
        orderPrice: 0,
        weight:0,
        isEditAmount: true,
        isEditRemark: true,
        isEditDiscount: true
      }
      this.orderData = [...orderData, newData]
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
            row.productId = item.productId
            row.unit = computedWeight(undefined, item.unit)
            row.clientPrice = item.clientPrice
            row.productName = item.alias === "" ? item.productName:item.alias
            row.price = item.price
            row.weight = item.weight
          }
          return item.barcode === row.barCode
        })
      } else {
        row.productId = ''
        row.productName = ''
        row.unit = '-'
        row.price = 0
        row.clientPrice = 0
        row.amount = 1
        row.weight = 0
        row.remark = ''
      }
    },
    handleOk() {
      let productId = this.orderData.map(item => item.productId)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.orderModalTitle === '新增出貨') {
            if (this.list.id) {
              if (this.orderData.length !== 0) {
                if (productId[0] !== undefined) {
                  this.$api.Distribute.addOrder({
                    recipientId: this.recipientId,
                    clientId: this.list.id,
                    remark: this.remark,
                    payment: this.payments,
                    shipment: this.shipment,
                    temperatureCategory: this.temperatureCategory,
                    volume: this.volume,
                    orderNo: this.orderNumber,
                    stockOutDate: this.dateForOrderNo,
                    trackingNo: this.trackingNo,
                    shippingFee: this.shippingFee,
                    defaultReceiveInfo:this.defaultReceiver,
                    orderItemRequestList: this.orderData.map(item => {
                      return {
                        barcode: item.barCode,
                        amount: item.amount,
                        discount: item.discount,
                        price: item.orderPrice,
                        remark: item.remark
                      }
                    })
                  })
                    .then((res) => {
                      this.$message.success('出貨確認成功')
                      if (this.templateType) {
                        this.$api.Distribute.getDistributeDetail({
                          orderId: res.data.id
                        }).then(response=>{
                          this.orderDetail = response.data
                        })
                        this.orderViewVisible = true
                        this.templateType = ''
                      } else {
                        this.orderViewVisible = false
                        this.handleCancel()
                        this.templateType = ''
                      }
                      // this.orderViewVisible = false
                      // this.handleCancel()
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
          } else {
            this.$api.Distribute.editOrder({
              orderId: this.orderId,
              recipientId: this.receiverList.id,
              remark: this.remark,
              payment: this.payments,
              shipment: this.shipment,
              temperatureCategory: this.temperatureCategory,
              volume: this.volume,
              orderNo: this.orderNumber,
              stockOutDate: this.dateForOrderNo,
              trackingNo: this.trackingNo,
              shippingFee: this.shippingFee,
              defaultReceiveInfo:this.defaultReceiver,
              orderItemRequestList: this.orderData.map(item => {
                return {
                  id: item.id,
                  barcode: item.barCode,
                  amount: item.amount,
                  discount: parseInt(item.discount),
                  price: item.orderPrice,
                  remark: item.remark
                }
              })
            })
              .then(() => {
                this.$message.success('編輯出貨成功')
                if (this.templateType) {
                  this.$api.Distribute.getDistributeDetail({
                    orderId: this.orderId
                  }).then(response=>{
                    this.orderDetail = response.data
                  })
                  this.orderViewVisible = true
                  this.templateType = ''
                } else {
                  this.orderViewVisible = false
                  this.handleCancel()
                  this.templateType = ''
                }
                this.templateType = ''
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
          }
        }
      })
    },
    deleteOrder(row, index) {
      if (this.changeTitle === '新增出貨') {
        this.orderData.splice(index, 1)
      } else {
        if (row.id) {
          this.$api.Distribute.deleteCommodityDiscount(row)
          this.orderData.splice(index, 1)
        } else {
          this.orderData.splice(index, 1)
        }
      }
    },
    getCustomerList() {
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
      this.orderViewVisible = true
      this.orderModalTitle = '訂單詳情'
      this.$api.Distribute.getDistributeDetail({
        orderId: record.orderId
      }).then(res => {
        this.createReceiverList(record)
        this.list.receiverList = this.findDefaultInfo

        let nonDefaultList = this.list.receiverList.filter(item => {
          return item.id === this.findDefaultInfo[0].id
        })
        this.defaultList = this.findDefaultInfo.filter(
          (item, i) => i === this.list.defaultReceiveInfo
        )
        if (nonDefaultList[0].id === this.defaultList[0].id) {
          if (this.list.defaultReceiveInfo === 0) {
            this.defaultList[0].default = '同客戶資料(預設地址)'
          } else if (this.list.defaultReceiveInfo === 1) {
            this.defaultList[0].default = '同公司資料(預設地址)'
          } else {
            this.defaultList[0].default = '(預設地址)'
          }
          this.defaultOption = this.defaultList[0].default
          this.recipientId = res.data.recipientId
          this.receiverList = { ...this.defaultList[0] }
        } else {
          this.recipientId = res.data.recipientId
          this.receiverList = { ...nonDefaultList[0] }
        }
        this.orderDetail = res.data
        this.orderData = res.data.orderDetailItemResponseList
        this.orderList = res.data.orderDetailItemResponseList
        this.shipment = res.data.shipment
        this.trackingNo = res.data.trackingNo

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
        this.$message.success(`${record.orderNo}訂單取消成功`)
      })
    },
    searchHandler() {
      this.pageNumber = 1
      this.distributeList()
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    createReceiverList(record) {
      this.list = this.customerList.find(item => {
        return item.id === record.clientId
      })
      this.findDefaultInfo = [
        { id: '', receiver: '', address: '', tel: '', postCode: '' },
        { id: '', receiver: '', address: '', tel: '', postCode: '' }
      ]
      this.findDefaultInfo.push(...this.list.recipientList)
      this.findDefaultInfo[0].id = '0'
      this.findDefaultInfo[0].receiver = this.list.name
      this.findDefaultInfo[0].address = this.list.address
      this.findDefaultInfo[0].postCode = this.list.postCode
      this.findDefaultInfo[0].tel = this.list.tel
      this.findDefaultInfo[1].id = '1'
      this.findDefaultInfo[1].receiver = this.list.companyName
      this.findDefaultInfo[1].address = this.list.companyAddress
      this.findDefaultInfo[1].postCode = this.list.companyPostCode
      this.findDefaultInfo[1].tel = this.list.companyTel
    }
  },
  computed: {
    totalAmountPrice() {
      let count = 0
      let total = 0
      this.orderData.forEach(item => {
        count += parseInt(item.amount)
        total += item.orderPrice
      })
      return { count, total }
    },
    // calculating: {
    //   get: function() {
    //     return shippingRule[
    //     '' + this.shipment + this.temperatureCategory + this.volume
    //             ]
    //   },
    //   set: function(newValue) {
    //     console.log(newValue)
    //     this.shippingFee = newValue
    //   }
    // },
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
                    placeholder="請輸入"
                    value={row[key]}
                    vModel={row[key]}
                    onKeyup={() =>
                      ((key === 'discount' ||key === 'amount') && (row[key] = row[key].replace(/[^\d]/g, '')))
                    }
                    vOn:Keyup_enter={() => this.addNewItem(row, editKey)}
                  />
                </div>
              ) : this.orderModalTitle !== '訂單詳情' ? (
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
              ) : (
                <span>{val}</span>
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
  /*padding: 5px;*/
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
    margin-top: 10px;
    /*margin-bottom: 15px;*/
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
  span{
    color: black;
  }
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
