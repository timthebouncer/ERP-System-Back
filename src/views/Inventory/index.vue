<template>
  <div class="container">
    <div class="action">
      <div class="buttons">
        <a-button class="reviewButton">刷新</a-button>
        <a-button class="addButton1" @click="showAddPurchaseView"
          >進貨+</a-button
        >
        <a-button class="addButton2" @click="showAddOrderView">銷貨+</a-button>
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
            <a-input
              v-model="addSearchValue"
              placeholder="請輸入商品條碼"
              style="width: 50%;"
              @pressEnter="addSearch"
            />
          </div>
          <div class="class-input" style="display: flex;">
            <span>商品名稱:</span>{{ addInventoryProductName }}
            <!--            <a-input placeholder="請輸入" style="width: 50%;" />-->
            <!--            <a-auto-complete v-model="addSearchValue" :data-source="addInventoryData" @search="addSearch"></a-auto-complete>-->
          </div>
          <div class="class-input" style="display: flex;">
            <span>單位:</span>{{ addInventoryProductUnit }}
          </div>
          <div class="class-input" style="display: flex;">
            <span>數量:</span
            ><a-input
              placeholder="請輸入"
              style="width: 20%;"
              v-model="addInventoryAmount"
            />
          </div>
          <template slot="footer">
            <a-button key="submit" type="primary" @click="addInventory">
              <!--              :loading="loading"-->
              <!--              @click="handleOk"-->
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
        >
          <div class="modal-body">
            <a-form-model layout="horizontal" ref="ruleForm">
              <!--              :model="list"-->
              <!--              :rules="rules"-->
              <div class="firstPart">
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="銷貨日期">
                    <div>{{}}</div>
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
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="選擇客戶">
                    <a-select></a-select>
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="email">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="公司電話">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="電話">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="公司名稱">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="傳真">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="統一編號">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="公司email">
                    <a-input placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <a-form-model-item
                  class="custom-form-item address"
                  label="地址"
                >
                  <div style="width: 10%">
                    <a-input placeholder="郵遞區號" />
                  </div>
                  <div>
                    <a-input placeholder="請輸入" />
                  </div>
                </a-form-model-item>
                <a-form-model-item
                  class="custom-form-item address"
                  label="公司地址"
                >
                  <div style="width: 10%">
                    <a-input placeholder="郵遞區號" />
                  </div>
                  <div>
                    <a-input placeholder="請輸入" />
                  </div>
                </a-form-model-item>

                <a-form-model-item class="custom-form-item" label="備註">
                  <div>
                    <a-textarea
                      v-model="value"
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
                      :pagination="false"
                    >
                      <template
                        v-for="col in [
                          'order',
                          'barCode',
                          'name',
                          'unit',
                          'salesPrice',
                          'stockAmount',
                          'orderPrice',
                          'operation'
                        ]"
                        :slot="col"
                        slot-scope="text, record, index"
                      >
                        <div :key="col">
                          <template v-if="col === 'order'">
                            {{ index + 1 }}
                          </template>
                          <template v-else-if="col === 'barCode'">
                            <a-input
                              v-model="record[col]"
                              placeholder="請掃一維碼或手動輸入"
                            ></a-input>
                          </template>
                          <template v-else-if="col === 'name'">
                            <a-select
                              v-model="record[col]"
                              placeholder="請選擇"
                            >
                              <!--                              @change="pushValue($event, record)"-->
                              <a-select-option
                                v-for="item in discountClass"
                                :key="item.id"
                              >
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                          </template>
                          <template v-else>
                            {{ text }}
                          </template>
                        </div>
                      </template>
                      <template
                        slot="operation"
                        slot-scope="text, record, index"
                      >
                        <a-popconfirm
                          class="orderDeletePopconfirm"
                          @confirm="() => deleteOrder(index)"
                        >
                          <template slot="title">
                            <span
                              class="orderDeletePopTitle"
                              style="font-size: larger;"
                              >是否確定刪除此筆銷貨商品?</span
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
                  </div>
                </div>
              </div>
            </a-form-model>
          </div>
          <template slot="footer">
            <a-button key="submit" type="primary">
              <!--              :loading="loading"-->
              <!--              @click="handleOk()"-->
              儲存
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
            placeholder="搜尋內容"
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
export default {
  name: 'Inventory',
  components: {
    EditableCell
  },
  data() {
    return {
      purchaseViewVisible: false,
      orderViewVisible: false,
      purchaseModalTitle: '新增進貨',
      orderModalTitle: '新增銷貨',
      list: {},
      expandIndex: [],
      tableData: [
        {
          id: 0,
          barCode: '',
          productName: '',
          unit: '',
          totalSalesPrice: 0,
          totalListPrice: 0,
          totalCostPrice: 0,
          amount: 0,
          inventoryList: []
        }
      ],
      innerData: [
        {
          id: 0,
          barCode: 'T0001',
          productName: '雞胸',
          unit: '2台斤',
          salesPrice: 79,
          listPrice: 80,
          costPrice: 60,
          amount: 2
        }
      ],
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
          title: '單位量',
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
        {
          title: '序',
          dataIndex: 'order',
          width: '2%',
          align: 'center',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '商品條碼',
          dataIndex: 'barCode',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'barCode' }
        },
        {
          title: '商品名稱',
          dataIndex: 'name',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '單位',
          dataIndex: 'unit',
          width: '2%',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '售價',
          dataIndex: 'salesPrice',
          width: '5%',
          align: 'center',
          scopedSlots: { customRender: 'salesPrice' }
        },
        {
          title: '數量',
          dataIndex: 'stockAmount',
          width: '2%',
          align: 'center',
          scopedSlots: { customRender: 'stockAmount' }
        },
        {
          title: '銷貨金額',
          dataIndex: 'orderPrice',
          width: '5%',
          align: 'center',
          scopedSlots: { customRender: 'orderPrice' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '2%',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      innerTableExpanded: false,
      addSearchValue: '',
      addInventoryData: [],
      addInventoryProductId: '',
      addInventoryProductName: '',
      addInventoryProductUnit: '',
      addInventoryAmount: 0,
      pageSizeOptions: ["10", "25", "50"],
      current: 1,
      pageSize: 10,
      total: 10,
      alertMsgTitle: '',
      alertMessage: ''
    }
  },
  computed: {},
  methods: {
    openNotificationWithIcon(type) {
      this.$notification[type]({
        message: this.alertMsgTitle,
        description:
                this.alertMessage,
      });
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
    getInventoryList(productName) {
      this.tableData = []
      this.$api.Inventory.getList(productName, this.current, this.pageSize)
        .then(res => {
          this.tableData = res.data.content.map((item, index) => {
            let obj = {
              id: index,
              ...item
            }
            return obj
          })
          this.total = res.data.totalElements;
          console.log(res)
          console.log(this.tableData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    showAddPurchaseView() {
      this.purchaseViewVisible = true
    },
    showAddOrderView() {
      this.orderViewVisible = true
    },
    onSearch() {
      this.getInventoryList(this.search)
    },
    onCellChange(id, dataIndex, value) {
      this.tableData[id].amount = value
    },
    onInnerCellChange(record, value) {
      console.log(record, 'record')
      const data = {}
      data.id = record.inventoryId
      data.barcode = record.barcode
      data.amount = value
      console.log(data)
      this.$api.Inventory.edit(data)
        .then(() => {
          this.getInventoryList(this.search)
        })
        .catch(err => {
          console.log(err)
        })
    },
    onDelAmount(record) {
      console.log('delte amount')
      this.$api.Inventory.deleteInventory(record.inventoryId)
        .then((res) => {
          console.log(res);
          this.getInventoryList(this.search)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCancel() {
      this.purchaseViewVisible = false
      this.orderViewVisible = false
    },
    addInventoryCancel() {
      this.purchaseViewVisible = false
      this.addSearchValue = ''
      this.addInventoryData = []
      this.addInventoryProductId = ''
      this.addInventoryProductName = ''
      this.addInventoryProductUnit = ''
      this.addInventoryAmount = 0
    },
    handleAdd() {
      const { orderData } = this
      const newData = {
        order: 0,
        barCode: '',
        name: '',
        unit: '-',
        salesPrice: 0,
        stockAmount: 0,
        orderPrice: 0,
        operation: ''
      }
      this.orderData = [...orderData, newData]
    },
    deleteOrder(index) {
      const orderData = [...this.orderData]
      orderData.splice(index, 1)
      this.orderData = orderData
    },
    addSearch() {
      this.addInventoryProductName = ''
      this.addInventoryProductUnit = ''
      this.$api.Inventory.searchProduct(this.addSearchValue).then(res => {
        console.log(res.data)
        this.addInventoryData = res.data
        // this.addInventoryData=[];
        if (this.addInventoryData.length) {
          if (
            this.addInventoryData[0].barcode != null &&
            this.addInventoryData[0].barcode != ''
          ) {
            this.addInventoryProductId = this.addInventoryData[0].id
            this.addSearchValue = this.addInventoryData[0].barcode
            this.addInventoryProductName = this.addInventoryData[0].name
            this.addInventoryProductUnit = this.addInventoryData[0].unit
          }
        }
      })
    },
    addSelect() {},
    addChange() {},
    addInventory() {
      const data = {}
      data.productId = this.addInventoryProductId
      data.amount = this.addInventoryAmount
      data.barcode = this.addSearchValue
      data.unit = this.addInventoryProductUnit
      data.weight = 0
      console.log(data)
      this.$api.Inventory.addInventory(data)
        .then(res => {
          console.log(res)
          this.purchaseViewVisible = false
          this.addSearchValue = ''
          this.addInventoryData = []
          this.addInventoryProductId = ''
          this.addInventoryProductName = ''
          this.addInventoryProductUnit = ''
          this.addInventoryAmount = 0
          this.getInventoryList(this.search)
        })
        .catch(err => {
          console.log(err)
        })
    },
    onShowSizeChange(current, pageSize){
      // console.log(current);
      this.current = 1;
      this.pageSize = pageSize;
      this.getInventoryList(this.search);
    },
    onPageChange(current, pageSize){
      console.log(current);
      // console.log(pageSize);
      // console.log(this.total);
      this.getInventoryList(this.search);
    },
    moment
  },
  created() {
    this.getInventoryList(this.search);
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
.reviewButton {
  background-color: #169bd4;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
}

.addButton1 {
  background-color: #f59b22;
  color: #fcfcfc;
  font-weight: bold;
  font-size: large;
}

.addButton2 {
  color: #000;
  font-weight: bold;
  font-size: large;
  border: #e19e44 solid 2px;
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
  background-color: #f5e9e9;
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
  font-size: 16px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
