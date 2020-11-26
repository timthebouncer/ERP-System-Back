<template>
  <div class="container">
    <div class="action">
      <div class="buttons">
        <a-space>
          <a-button class="reviewButton" @click="resetPage">重新整理</a-button>
          <a-button class="addButton1" @click="showAddPurchaseView"
            >入庫</a-button
          >
          <a-button class="addButton2" @click="showAddOrderView">出庫</a-button>
        </a-space>
      </div>
      <div>
        <a-modal
          v-model="purchaseViewVisible"
          width="500px"
          :title="purchaseModalTitle"
          @cancel="addInventoryCancel"
          class="addPurchaseView"
        >
          <div>
            <span>建立日期:</span
            ><span>{{ moment(new Date()).format('YYYY-MM-DD') }}</span>
          </div>
          <div class="class-input" style="display: flex;">
            <span>商品條碼:</span>
            <a-auto-complete
              v-model="searchBarcode"
              :dataSource="barCodeSelection"
              placeholder="請輸入商品條碼"
              style="width: 50%;"
              @select="addSelect"
              @change="addChange"
            />
          </div>
          <div class="class-input" style="display: flex;">
            <span>商品名稱:</span>{{ addInventoryProductName }}
          </div>
          <div class="class-input" style="display: flex;">
            <span>計價單位:</span>{{ computedWeight(undefined,addInventoryProductUnit) }}
          </div>
          <div class="class-input" style="display: flex;">
            <span>數量:</span>
            <a-form :form="form">
              <a-form-item>
                <a-input
                  v-decorator="[
                    'addInventoryAmount',
                    {
                      rules: [
                        {required: true, message: '請輸入數字', pattern: /^\d+$/ }
                      ],initialValue:1
                    }
                  ]"
                  style="width: 30%;"
                  @change="vvv"
                /> </a-form-item
            ></a-form>
          </div>
          <template slot="footer">
            <a-button type="primary" @click="submitNonStop">
              儲存並新增
            </a-button>
            <a-button key="submit" type="primary" @click="addInventory">
              儲存
            </a-button>
            <a-button key="back" @click="addInventoryCancel">
              取消
            </a-button>
          </template>
        </a-modal>
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
                  <a-form-model-item class="custom-form-item" label="銷貨日期">
                    <div>{{ list.date }}</div>
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="銷貨單號"
                    prop="classes"
                  >
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="聯絡人"
                    prop="name"
                  >
                    {{ list.contactPerson }}
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="選擇客戶">
                    <a-select
                      show-search
                      placeholder="請選擇"
                      style="width: 200px"
                      :filter-option="filterOption"
                      @change="handleChange"
                    >
                      <a-select-option
                        v-for="item in customerList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="email">
                    {{ list.email }}
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="公司電話">
                    {{ list.companyTel }}
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="電話">
                    {{ list.tel }}
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="公司名稱">
                    {{ list.companyName }}
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="傳真">
                    {{ list.companyFax }}
                  </a-form-model-item>
                </div>
                <div class="firstPart-item" style="width: 608px">
                  <a-form-model-item class="custom-form-item" label="統一編號">
                    {{ list.vatNumber }}
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="公司email">
                    {{ list.companyEmail }}
                  </a-form-model-item>
                </div>
                <a-form-model-item
                  class="custom-form-item address"
                  label="地址"
                >
                  <div style="width: 10%">
                    {{ list.postCode }}
                  </div>
                  <div>
                    {{ list.address }}
                  </div>
                </a-form-model-item>
                <a-form-model-item
                  class="custom-form-item address"
                  label="公司地址"
                >
                  <div style="width: 10%">
                    {{ list.companyPostCode }}
                  </div>
                  <div>
                    {{ list.companyAddress }}
                  </div>
                </a-form-model-item>

                <a-form-model-item class="custom-form-item" label="備註">
                  <div>
                    <a-textarea
                      v-model="remark"
                      line-height="center"
                      placeholder="請輸入"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                  </div>
                </a-form-model-item>
              </div>
              <div class="second-part">
                <div class="second-part-item">
                  <div>
                    銷貨商品
                    <a-button
                      type="primary"
                      size="small"
                      class="editable-add-btn"
                      @click="handleAdd"
                    >
                      <a-icon type="plus" />
                    </a-button>
                    <a-table
                      bordered
                      rowKey="productId"
                      :columns="orderColumns"
                      :data-source="orderData"
                      :pagination="true"
                    >
                    </a-table>
                  </div>
                </div>
              </div>
            </a-form-model>
          </div>
          <template slot="footer">
            <a-button key="submit" type="primary" @click="handleOk">
              出庫確認
            </a-button>
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
          </template>
        </a-modal>
      </div>
      <div class="search-wrapper">
        <div class="searchInput">
          <a-input-search
            v-model="search"
            placeholder="搜尋商品名稱"
            enter-button
            @search="onSearch"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        class="inventoryTable"
        :columns="columns"
        bordered
        :pagination="false"
        :data-source="tableData"
        :rowKey="record => record.id"
        :expandedRowKeys="expandIndex"
      >
        <template
          class="expandRow"
          slot="expandedRowRender"
          slot-scope="record"
        >
          <a-table
            v-if="record.inventoryList.length"
            class="innerTable"
            :data-source="record.inventoryList"
            :pagination="false"
            :showHeader="false"
            :rowKey="record => record.id"
            :columns="innerColumns"
          >
            <template slot="spaceCol">
              <span>{{ '' }}</span>
            </template>
            <template slot="amount" slot-scope="text, record">
              <editable-cell
                :text="text + ''"
                @change="onInnerCellChange(record, $event)"
              />
            </template>
            <template slot="action" slot-scope="record">
              <a-popconfirm
                class="inventoryDeletePopconfirm"
                @confirm="() => onDelAmount(record)"
              >
                <template slot="title">
                  <span
                    class="inventoryDeletePopTitle"
                    style="font-size: larger;"
                    >商品刪除後，所有資料將清空無法還原</span
                  >
                </template>
                <a-icon
                  type="close-square"
                  theme="twoTone"
                  two-tone-color="#eb2f96"
                  :style="{ fontSize: '25px' }"
                />
              </a-popconfirm>
            </template>
          </a-table>
        </template>
        <template slot="expandAction" slot-scope="record">
          <div v-if="record.inventoryList.length">
            <a-icon
              :type="
                expandIndex.indexOf(record.id) != -1
                  ? 'minus-square'
                  : 'plus-square'
              "
              @click="handleExpand(record.id)"
            />
          </div>
          <span v-else></span>
        </template>

        <template slot="amount" slot-scope="text, record">
          <editable-cell
            v-if="!record.inventoryList.length"
            :text="text + ''"
            @change="onCellChange(record.id, 'amount', $event)"
          />
          <span v-else>{{ record.inventoryList.length }}</span>
        </template>
        <template slot="action" slot-scope="record">
          <a-popconfirm
            v-if="!record.inventoryList.length"
            class="inventoryDeletePopconfirm"
            @confirm="() => onDelAmount(record)"
          >
            <template slot="title">
              <span class="inventoryDeletePopTitle" style="font-size: larger;"
                >商品刪除後，所有資料將清空無法還原</span
              >
            </template>
            <a-icon
              type="close-square"
              theme="twoTone"
              two-tone-color="#eb2f96"
              :style="{ fontSize: '25px' }"
            />
          </a-popconfirm>
          <span v-else>{{ '' }}</span>
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
        <!--        <span v-if="props.value === '50'">全部</span>-->
      </template>
    </a-pagination>
  </div>
</template>
<script>
import moment from 'moment'
import EditableCell from '@/components/EditableCell'
// import axios from 'axios'
import Fragment from '@/components/Fragment'
import { computedWeight } from '@/unit/dictionary/computed'

function debounce(func, delay = 500) {
  let timer = null

  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func()
    }, delay)
  }
}

export default {
  name: 'Inventory',
  components: {
    EditableCell
  },
  data() {
    return {
      customerList: [],
      goodsTable: [],
      inventoryList: [],
      barCodeSelection: [],
      purchaseViewVisible: false,
      orderViewVisible: false,
      purchaseModalTitle: '入庫',
      orderModalTitle: '出庫',
      list: {},
      remark: '',
      barcode: '',
      expandIndex: [],
      tableData: [],
      // innerData: [
      //   {
      //     id: 0,
      //     barCode: 'T0001',
      //     productName: '雞胸',
      //     unit: '2台斤',
      //     salesPrice: 79,
      //     listPrice: 80,
      //     costPrice: 60,
      //     amount: 2
      //   }
      // ],
      orderData: [],
      search: '',
      columns: [
        {
          dataIndex: '',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'expandAction' }
        },
        {
          title: '商品條碼',
          dataIndex: 'barCode',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'barCode' }
        },
        {
          title: '商品名稱',
          dataIndex: 'productName',
          width: '15%',
          align: 'center',
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '計價單位',
          dataIndex: 'unit',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '售價',
          dataIndex: 'totalSalesPrice',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'totalSalesPrice' }
        },
        {
          title: '建議售價',
          dataIndex: 'totalListPrice',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'totalListPrice' }
        },
        {
          title: '成本價',
          dataIndex: 'totalCostPrice',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'totalCostPrice' }
        },
        {
          title: '庫存量',
          dataIndex: 'amount',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '操作',
          dataIndex: '',
          width: '5%',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      innerColumns: [
        {
          width: '4%',
          scopedSlots: { customRender: 'spaceCol' }
        },
        {
          dataIndex: 'barcode',
          width: '20%',
          align: 'center'
        },
        {
          dataIndex: 'name',
          width: '20%',
          align: 'center'
        },
        {
          dataIndex: 'unitAmount',
          width: '15%',
          align: 'center'
        },
        {
          dataIndex: 'salesPrice',
          width: '10%',
          align: 'center'
        },
        {
          dataIndex: 'listPrice',
          width: '10%',
          align: 'center'
        },
        {
          dataIndex: 'costPrice',
          width: '10%',
          align: 'center'
        },
        {
          dataIndex: 'amount',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        },
        {
          dataIndex: '',
          width: '2%',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      orderColumns: [
        // {
        //   title: '序',
        //   dataIndex: 'order',
        //   align: 'center',
        //   customRender: (_, __, i) => {
        //     return {
        //       children: <div>{i + 1}</div>
        //     }
        //   },
        //   scopedSlots: { customRender: 'order' }
        // },
        {
          title: '商品條碼',
          dataIndex: 'barCode',
          width: '23%',
          align: 'center',
          customRender: (value, row) => {
            return {
              children: (
                <div>
                  <a-input
                    onChange={barCode => this.pushName(barCode, row)}
                    vModel={row.barCode}
                    placeholder="請掃一維碼或手動輸入"
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
                  <a-select
                    value={row.productId}
                    placeholder="請選擇"
                    onChange={id => this.pushValue(id, index)}
                    show-search
                    filter-option={this.filterOption}
                  >
                    {this.filterName(row).map(item => {
                      return (
                        <a-select-option value={item.id}>
                          {item.name}
                        </a-select-option>
                      )
                    })}
                  </a-select>
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
          dataIndex: 'stockAmount',
          width: 100,
          align: 'center',
          customRender: (val, row) => {
            return this.Quantity(val, row, 'stockAmount')
          },
          scopedSlots: { customRender: 'stockAmount' }
        },
        {
          title: '銷貨金額',
          dataIndex: 'orderPrice',
          align: 'center',
          customRender: (_, row) => {
            return {
              children: row.salesPrice * row.stockAmount
            }
          },
          scopedSlots: { customRender: 'orderPrice' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '10%',
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
      innerTableExpanded: false,
      addSearchValue: '',
      searchBarcode: '',
      addInventoryData: [],
      addInventoryProductId: '',
      addInventoryProductName: '',
      addInventoryProductUnit: '',
      addInventoryAmount: 1,
      pageSizeOptions: ['10', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 10,
      alertMsgTitle: '',
      alertMessage: '',
      form: this.$form.createForm(this, { name: 'dynamic_rule' })
    }
  },
  computed: {
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
    },
    addSearch() {
      return debounce(this.addSelect)
    },
    computedWeight(){
      return computedWeight
    }
  },
  methods: {
    handleChange(id) {
      this.list = this.customerList.find(item => {
        return item.id === id
      })
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
    openNotificationWithIcon(type) {
      this.$notification[type]({
        message: this.alertMsgTitle,
        description: this.alertMessage
      })
    },
    handleExpand(index) {
      if (this.expandIndex.length > 0) {
        let id = this.expandIndex.indexOf(index)
        if (id > -1) {
          this.expandIndex.splice(id, 1)
        } else {
          this.expandIndex.splice(0, this.expandIndex.length)
          this.expandIndex.push(index)
        }
      } else {
        this.expandIndex.push(index)
      }
    },
    pushValue(id, index) {
      this.orderData[index].productId = id
      this.$api.Commodity.getCommodityList({
        productName: this.search,
        pageNumber: this.current,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        let content = res.data.content
        let value = content.find(item => item.id === id)
        // let result = this.goodsTable.find(item => {
        //   return item.id === id
        // })
        let rows = this.orderData[index]
        rows.barCode = value.barcode
        rows.productId = value.id
        rows.unit = computedWeight(undefined, value.unit)
        rows.salesPrice = value.salesPrice
      })
    },
    pushName(barCode, row) {
      console.log(this.inventoryList,12)
      console.log(barCode,row,66)
      this.inventoryList.filter(item => {
        if(item.barcode === row.barCode){
          row.productId = item.id
          row.unit = computedWeight(undefined, item.unit)
          row.salesPrice = item.salesPrice
        }
        return item.barcode === row.barCode
      })
    },
    filterName(row) {
      console.log(row,32)
      return this.inventoryList.filter(item => {
        return item.barcode?.indexOf(row.barCode) > -1 && item.barcode !== ''
      })
    },
    handleOk() {
      this.$api.Distribute.addOrder({
        clientId: this.list.id,
        remark: this.remark,
        orderItemRequestList: this.orderData.map(item => {
          return {
            barcode: item.barCode,
            price: item.salesPrice,
            amount: item.stockAmount
          }
        })
      }).then(res => {
        alert(`出庫確認成功，已新增銷貨單號:${res.data.orderNo}`)
        this.orderViewVisible = false
        console.log(res)
      })
    },
    getInventoryList(productName) {
      this.tableData = []
      this.$api.Inventory.getList(productName, this.current, this.pageSize)
        .then(res => {
          this.tableData = res.data.inventoryListResponseList.map(
            (item, index) => {
              return {
                ...item,
                id: index,
                unit: computedWeight(undefined, item.unit)
              }
            }
          )
          this.total = res.data.totalElements
          this.goodsTable = this.tableData.map(item => {
            return {
              id: item.productId,
              barcode: item.inventoryList.map(item => {
                return item.barcode
              })
            }
          })
          
        })
        .catch(err => {
          console.log(err)
        })
    },
    showAddPurchaseView() {
      this.purchaseViewVisible = true
      this.barCodeSelection = []
      this.form.resetFields();
    },
    showAddOrderView() {
      this.orderViewVisible = true
      this.CommodityDetail()
    },
    onSearch() {
      this.getInventoryList(this.search)
    },
    onCellChange(id, dataIndex, value) {
      this.tableData[id].amount = value
    },
    onInnerCellChange(record, value) {
      const data = {}
      data.id = record.inventoryId
      data.barcode = record.barcode
      data.amount = value
      this.$api.Inventory.edit(data)
        .then(() => {
          this.getInventoryList(this.search)
        })
        .catch(err => {
          console.log(err)
        })
    },
    onDelAmount(record) {
      this.$api.Inventory.deleteInventory(record.inventoryId)
        .then(res => {
          console.log(res)
          this.getInventoryList(this.search)
        })
        .catch(err => {
          this.alertMsgTitle = '錯誤'
          this.alertMessage = err.response.data.message
          this.openNotificationWithIcon('error')
        })
    },
    handleCancel() {
      this.purchaseViewVisible = false
      this.orderViewVisible = false
      this.orderData = []
      this.list = {}
    },
    addInventoryCancel() {
      this.purchaseViewVisible = false
      this.searchBarcode = ''
      this.addInventoryData = []
      this.addInventoryProductId = ''
      this.addInventoryProductName = ''
      this.addInventoryProductUnit = ''
      this.addInventoryAmount = 1
    },
    handleAdd() {
      const { orderData } = this
      const newData = {
        order: 0,
        barCode: '',
        name: '',
        unit: '-',
        productId: undefined,
        salesPrice: 0,
        stockAmount: 1,
        orderPrice: 0,
        isEditStockAmount: true
      }
      this.orderData = [...orderData, newData]
    },
    deleteOrder(row, index) {
      this.orderData.splice(index, 1)
    },
    addSelect() {
      this.addInventoryProductName = ''
      this.addInventoryProductUnit = ''
      this.$api.Commodity.getCommodityDetail({
        searchKey: this.search,
        barcode: this.searchBarcode
      }).then(res => {
        this.addInventoryData = res.data
        // this.addInventoryData=[];
        if (this.addInventoryData.length) {
          // this.searchBarcode = this.addInventoryData.barcode
          this.addInventoryProductId = this.addInventoryData[0].id
          this.addInventoryProductName = this.addInventoryData[0].name
          this.addInventoryProductUnit = this.addInventoryData[0].unit
        }
      })
    },
    addChange() {
      // this.addSearch();
      this.CommodityDetail()
    },
    submitNonStop() {
      const data = {}
      data.productId = this.addInventoryProductId
      data.amount = this.addInventoryAmount
      data.barcode = this.addSearchValue
      data.unit = this.addInventoryProductUnit
      data.weight = 0
      this.$api.Inventory.addInventory(data)
        .then(res => {
          console.log(res)
          this.purchaseViewVisible = true
          this.addSearchValue = ''
          this.addInventoryData = []
          this.addInventoryProductId = ''
          this.addInventoryProductName = ''
          this.addInventoryProductUnit = ''
          this.addInventoryAmount = 1
          this.getInventoryList(this.search)
          this.$message.success('入庫成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    addInventory() {
      if (!/^\d+$/.test(this.addInventoryAmount)) return
      const data = {}
      data.productId = this.addInventoryProductId
      data.amount = this.addInventoryAmount
      data.barcode = this.searchBarcode
      data.unit = this.addInventoryProductUnit
      data.weight = 0
      this.$api.Inventory.addInventory(data)
        .then(res => {
          console.log(res)
          this.purchaseViewVisible = false
          this.searchBarcode = ''
          this.addInventoryData = []
          this.addInventoryProductId = ''
          this.addInventoryProductName = ''
          this.addInventoryProductUnit = ''
          this.addInventoryAmount = 1
          this.getInventoryList(this.search)
          this.$message.success('入庫成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    onShowSizeChange(current, pageSize) {
      // console.log(current);
      this.current = 1
      this.pageSize = pageSize
      this.getInventoryList(this.search)
    },
    onPageChange(current) {
      // console.log(pageSize);
      // console.log(this.total);
      this.getInventoryList(this.search)
    },
    getCustomerList() {
      this.$api.Inventory.onlyCustomerList().then(res => {
        this.customerList = res.data
      })
    },
    CommodityDetail() {
      this.$api.Commodity.getCommodityDetail({
        searchKey: this.search,
        barcode: this.searchBarcode
      }).then(res => {
        this.inventoryList = res.data
        this.barCodeSelection = []
        this.inventoryList.forEach(item => {
          if (item.barcode !== '') {
            this.barCodeSelection.push(item.barcode)
          }
        })
      })
    },
    resetPage() {
      this.getInventoryList(this.search)
    },
    vvv(ev) {
      this.addInventoryAmount = ev.target.value
      this.form.setFieldsValue({ addInventoryAmount: ev.target.value })
    },
    moment
  },
  created() {
    this.getInventoryList(this.search)
    this.getCustomerList()
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
::v-deep .ant-modal {
  top: 40px;
}
.reviewButton {
  background-color: #1890ff;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
  border: unset;
}

.addButton1 {
  background-color: #57d698;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
  border: unset;
}

.addButton2 {
  background-color: #fba129;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
  border: unset;
}
.innerTable {
  border-right: 1px solid #e8e8e8;
}
.innerTable::v-deep table {
  border: none;
}
.inventoryTable::v-deep .ant-table-expanded-row td {
  border-right: none;
  border-left: none;
}
.inventoryTable::v-deep .ant-table-expanded-row {
}
.firstPart {
  background-color: #f5f5f5;
  padding: 30px 20px 30px 20px;
}
.firstPart-item {
  display: flex;
}
.firstPart-item > div {
  flex: 1;
}
.second-part {
  padding: 20px 20px 20px 20px;
  /*background-color: #f5e9e9;*/
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
.inventoryTable /deep/ .ant-table-row-expand-icon-cell,
.inventoryTable /deep/ .ant-table-expand-icon-th {
  width: 0;
  border-right: 0 !important;
  display: none;
}

.inventoryTable /deep/ .ant-table-expanded-row > td:first-child {
  width: 0;
  border-right: 0 !important;
  display: none;
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
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.discountTable::v-deep .ant-table-row td {
  position: relative;
}
.displayInput {
  display: flex;
  justify-content: space-between;
}
.displayEdit {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.displayEdit:hover + .editable-cell-icon {
  display: block;
}
.editable-cell-icon {
  display: none;
  position: relative;
  z-index: 1;
  cursor: pointer;
  top: 3.5px;
}

.editable-cell-icon:hover {
  display: block;
}
</style>
