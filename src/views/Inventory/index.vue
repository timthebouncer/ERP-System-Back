<template>
  <div class="container">
    <div class="action">
      <div class="buttons">
        <a-space>
          <a-button class="reviewButton" @click="resetPage">重新整理</a-button>
          <a-button class="addButton1" @click="showAddPurchaseView"
            >重新入庫<a-icon type="plus"
          /></a-button>
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
            <span>工作日期:</span
            ><span>{{ moment(new Date()).format('YYYY-MM-DD') }}</span>
          </div>
          <a-form-model :model="list" ref="ruleForm" :rules="rules">
            <div class="barcode-input">
              <!--              <span style="line-height:29px">商品條碼:</span>-->
              <a-form-model-item
                style="display: flex; margin:-8px 0 -5px -10px;"
                label="商品條碼"
                prop="searchBarcode"
              >
                <a-input
                  style="width: 200px"
                  placeholder="請輸入商品條碼"
                  @change="getStock"
                  v-model="list.searchBarcode"
                />
              </a-form-model-item>
            </div>
          </a-form-model>
          <div class="class-input" style="display: flex;">
            <span>商品名稱:</span>{{ inventoryList.productName }}
          </div>
          <div class="class-input" style="display: flex;">
            <span>計價單位:</span
            >{{ computedWeight(undefined, inventoryList.unit) }}
          </div>
          <div class="class-input" style="display: flex;">
            <span style="line-height: 35px">數量:</span>
            <div
              v-if="inventoryList.unit === '包' || inventoryList.unit === '件'"
            >
              <a-form :form="form">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'addInventoryAmount',
                      {
                        rules: [
                          {
                            required: true,
                            message: '請輸入數字',
                            pattern: /^\d+$/
                          }
                        ]
                      }
                    ]"
                    style="width: 30%;"
                    @change="vvv"
                  /> </a-form-item
              ></a-form>
            </div>
            <div v-else>
              <span style="line-height: 35px;">{{ inventoryList.weight }}</span>
            </div>
          </div>
          <template slot="footer">
            <a-button key="back" @click="addInventoryCancel">
              取消
            </a-button>
            <a-button key="submit" type="primary" @click="addInventory">
              儲存
            </a-button>
            <a-button type="primary" @click="submitNonStop">
              儲存並新增
            </a-button>
          </template>
        </a-modal>
      </div>
      <div class="search-wrapper">
        <div class="search-selection">
          <a-select v-model="depotName" style="width: 120px">
            <a-select-option v-for="item in this.goodsTable" :key="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </div>
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
        :data-source="filterDepotName"
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
                  :style="{ fontSize: '15px' }"
                />
              </a-popconfirm>
            </template>
          </a-table>
        </template>
        <template slot="expandAction" slot-scope="record">
          <div
            v-if="record.inventoryList.length"
            class="expandAction"
            @click="handleExpand(record.id)"
          >
            <a-icon
              :type="
                expandIndex.indexOf(record.id) != -1
                  ? 'minus-square'
                  : 'plus-square'
              "
            />
          </div>
          <span v-else></span>
        </template>
        <template slot="barCode" slot-scope="text, record">
          <div
            class="barCodeExpand"
            @click="handleExpand(record.id)"
            style="height: 20px; cursor: pointer;"
          >
            <span>{{ text !== undefined ? text : ' ' }}</span>
          </div>
        </template>
        <template slot="productName" slot-scope="text">
          <div>
            <span>{{ text }}</span>
          </div>
        </template>
        <template slot="amount" slot-scope="text, record">
          <editable-cell
            v-if="!record.inventoryList.length"
            :text="text + ''"
            @change="onCellChange(record.id, 'amount', $event)"
          />
          <span v-else>{{ text }}</span>
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
      :show-total="total => ``"
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
      selectList: [],
      specificId: '',
      barcodeTdWidth: '',
      customerList: [],
      goodsTable: [],
      inventoryList: [],
      barCodeSelection: [],
      purchaseViewVisible: false,
      purchaseModalTitle: '重新入庫',
      orderModalTitle: '出貨',
      list: { searchBarcode: '' },
      remark: '',
      barcode: '',
      expandIndex: [],
      tableData: [],
      search: '',
      columns: [
        {
          class: 'expand-td',
          dataIndex: '',
          align: 'center',
          scopedSlots: { customRender: 'expandAction' }
        },
        {
          class: 'depot-td',
          title: '庫存倉庫',
          dataIndex: 'depotName',
          align: 'center',
          scopedSlots: { customRender: 'depotName' }
        },
        {
          class: 'barcode-td',
          title: '商品條碼',
          dataIndex: 'barCode',
          align: 'center',
          scopedSlots: { customRender: 'barCode' }
        },
        {
          class: 'product-name-td',
          title: '商品名稱',
          dataIndex: 'productName',
          align: 'center',
          scopedSlots: { customRender: 'productName' }
        },
        {
          class: 'unit-td',
          title: '計價單位',
          dataIndex: 'unit',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          class: 'list-price-td',
          title: '建議售價',
          dataIndex: 'totalListPrice',
          align: 'center',
          customRender: (val, row) => {
            let count = 0;
            row.inventoryList.forEach(item => count += item.price)
            return {
              children: <div>${count}</div>
            }
          }
        },
        {
          class: 'amount-td',
          title: '庫存量',
          dataIndex: 'amount',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        },
        {
          class: 'action-td',
          title: '操作',
          dataIndex: '',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      innerColumns: [
        {
          class: 'inner-expand-td',
          scopedSlots: { customRender: 'spaceCol' }
        },
        {
          class: 'inner-depot-td',
          dataIndex: 'depotName',
          align: 'center'
        },
        {
          class: 'inner-barcode-td',
          dataIndex: 'barcode',
          align: 'center'
        },
        {
          class: 'inner-product-name-td',
          dataIndex: 'name',
          align: 'center'
        },
        {
          class: 'inner-unit-td',
          dataIndex: 'unitAmount',
          align: 'center'
        },
        {
          class: 'inner-list-price-td',
          dataIndex: 'listPrice',
          align: 'center',
          customRender: (val, row) => {
            return {
              children: <div>${row.price}</div>
            }
          }
        },
        {
          class: 'inner-amount-td',
          dataIndex: 'amount',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        },
        {
          class: 'inner-action-td',
          dataIndex: '',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      innerTableExpanded: false,
      addSearchValue: '',
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
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      rules: {
        searchBarcode: [{ required: true, message: '請輸入商品條碼' }]
      },
      depotName:''
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
    },
    // addSearch() {
    //   return debounce(this.addSelect)
    // },
    computedWeight() {
      return computedWeight
    },
    filterDepotName(){
      if(!this.depotName){
        return this.tableData
      }else {
        return this.tableData.filter(item=> item.depotId.includes(this.depotName))
      }
    }
  },
  watch: {
    searchBarcode: function(newValue) {
      if (newValue == '') {
        this.addInventoryProductId = ''
        this.addInventoryProductName = ''
        this.addInventoryProductUnit = ''
      }
    }
  },
  methods: {
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
    getInventoryList(productName) {
      this.tableData = []
      this.$api.Inventory.getList(productName, this.current, this.pageSize)
        .then(res => {
          this.tableData = res.data.inventoryListResponseList.map(
            (item, index) => {
              return {
                ...item,
                id: index,
                totalListPrice: item.price * item.amount,
                unit: computedWeight(undefined, item.unit)
              }
            }
          )
          this.total = res.data.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDepotList(){
      this.$api.Depot.getDepotList({
        depotName: this.depotName
      }).then(res=>{
        this.goodsTable = res.data
        this.goodsTable.unshift({id:1,name:'全部'})
        this.depotName = this.goodsTable[0].id
        console.log(this.goodsTable)
      })
    },
    showAddPurchaseView() {
      this.purchaseViewVisible = true
      this.list.searchBarcode = ''
      this.form.resetFields()
    },
    onSearch() {
      this.current = 1
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
          this.$message.success('庫存量已變更!')
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
      this.list = {}
      this.remark = ''
      this.selectList = []
    },
    addInventoryCancel() {
      this.purchaseViewVisible = false
      this.list.searchBarcode = ''
      this.inventoryList.inventoryId = ''
      this.inventoryList.productName = ''
      this.inventoryList.unit = ''
      this.inventoryList.weight = ''
      this.addInventoryAmount = 1
    },
    // addSelect(value) {
    //   this.list.searchBarcode = ''
    //   this.addInventoryProductName = ''
    //   this.addInventoryProductUnit = ''
    //   let item = {}
    //   item = this.barCodeSelection.find(x => x.id === value)
    //   this.list.searchBarcode = item.barcode
    //   this.addInventoryProductId = item.id
    //   this.addInventoryProductName = item.name
    //   this.addInventoryProductUnit = item.unit
    // },
    // addChange() {
    //   this.getStock(this.list.searchBarcode)
    // },
    submitNonStop() {
      if (
        this.inventoryList.unit === '包' ||
        this.inventoryList.unit === '件'
      ) {
        if (!/^\d+$/.test(this.addInventoryAmount)) return
        const data = {}
        data.id = this.inventoryList.inventoryId
        data.amount =
          parseInt(this.addInventoryAmount) + this.inventoryList.amount
        data.barcode = this.list.searchBarcode
        this.$api.Inventory.edit(data)
          .then(res => {
            this.purchaseViewVisible = true
            this.list.searchBarcode = ''
            this.inventoryList.inventoryId = ''
            this.inventoryList.productName = ''
            this.inventoryList.unit = ''
            this.inventoryList.weight = ''
            this.addInventoryAmount = 1
            this.getInventoryList(this.search)
            this.$message.success('入庫成功')
          })
          .catch(() => {
            if (this.list.searchBarcode === '') {
              this.$message.error('請輸入商品條碼')
            } else {
              this.$message.error('商品條碼有誤')
            }
          })
      } else {
        if (!/^\d+$/.test(this.addInventoryAmount)) return
        const data = {}
        data.id = this.inventoryList.inventoryId
        data.amount = this.inventoryList.amount + 1
        data.barcode = this.list.searchBarcode
        this.$api.Inventory.edit(data)
          .then(res => {
            this.purchaseViewVisible = true
            this.list.searchBarcode = ''
            this.inventoryList.inventoryId = ''
            this.inventoryList.productName = ''
            this.inventoryList.unit = ''
            this.inventoryList.weight = ''
            this.addInventoryAmount = 1
            this.getInventoryList(this.search)
            this.$message.success('入庫成功')
          })
          .catch(() => {
            if (this.list.searchBarcode === '') {
              this.$message.error('請輸入商品條碼')
            } else {
              this.$message.error('商品條碼有誤')
            }
          })
      }
    },
    addInventory() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (
            this.inventoryList.unit === '包' ||
            this.inventoryList.unit === '件'
          ) {
            if (!/^\d+$/.test(this.addInventoryAmount)) return
            const data = {}
            data.id = this.inventoryList.inventoryId
            data.amount =
              parseInt(this.addInventoryAmount) + this.inventoryList.amount
            data.barcode = this.list.searchBarcode
            this.$api.Inventory.edit(data)
              .then(res => {
                console.log(res)
                this.purchaseViewVisible = false
                this.list.searchBarcode = ''
                this.inventoryList.inventoryId = ''
                this.inventoryList.productName = ''
                this.inventoryList.unit = ''
                this.inventoryList.weight = ''
                this.addInventoryAmount = 1
                this.getInventoryList(this.search)
                this.$message.success('入庫成功')
              })
              .catch((err) => {
                if (err) {
                  this.$message.error('商品條碼有誤')
                }
              })
          } else {
            if (!/^\d+$/.test(this.addInventoryAmount)) return
            const data = {}
            data.id = this.inventoryList.inventoryId
            data.amount = this.inventoryList.amount + 1
            data.barcode = this.list.searchBarcode
            this.$api.Inventory.edit(data)
              .then(res => {
                console.log(res)
                this.purchaseViewVisible = false
                this.list.searchBarcode = ''
                this.inventoryList.inventoryId = ''
                this.inventoryList.productName = ''
                this.inventoryList.unit = ''
                this.inventoryList.weight = ''
                this.addInventoryAmount = 1
                this.getInventoryList(this.search)
                this.$message.success('入庫成功')
              })
              .catch((err) => {
                if (err) {
                  this.$message.error('商品條碼有誤')
                }
              })
          }
        }
      })
    },
    onShowSizeChange(current, pageSize) {
      this.current = 1
      this.pageSize = pageSize
      this.getInventoryList(this.search)
    },
    onPageChange(current) {
      this.getInventoryList(this.search)
    },
    getCustomerList() {
      this.$api.Inventory.onlyCustomerList().then(res => {
        this.customerList = res.data
      })
    },
    getStock() {
      this.$api.Inventory.getStockDetail({
        barcode: this.list.searchBarcode
      }).then(res => {
        this.inventoryList = res.data
        console.log(this.inventoryList)
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
    this.getDepotList()
  }
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
  line-height: 15px;
  justify-content: center;
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

/deep/ .expand-td {
  width: 3%;
}
/deep/ .barcode-td,
/deep/ .product-name-td {
  width: 20%;
}
/deep/ .unit-td {
  width: 8%;
}
/deep/ .list-price-td {
  width: 10%;
}
/deep/ .amount-td {
  width: 5%;
}
/deep/ .action-td {
  width: 5%;
}
/deep/ .inner-expand-td {
  width: 5%;
}
/deep/ .inner-depot-td{
  width: 25%;
}
/deep/ .inner-barcode-td{
  width: 20%;
}
/deep/ .inner-product-name-td {
  width: 20%;
}
/deep/ .inner-unit-td {
  width: 8%;
}
/deep/ .inner-list-price-td {
  width: 11%;
}
/deep/ .inner-amount-td {
  width: 5%;
}
/deep/ .inner-action-td {
  width: 5%;
}
.expandAction {
  position: relative;
  cursor: pointer;
}
.expandAction::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  bottom: -20px;
  left: -20px;
}
.barCodeExpand {
  position: relative;
}
.barCodeExpand::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  bottom: -20px;
  left: -20px;
}
/deep/ .ant-form-item-required {
  font-size: 16px;
  font-weight: 300;
}
</style>
