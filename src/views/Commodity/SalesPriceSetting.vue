<template>
  <div class="addM">
    <a-button class="button1" @click="showModal()"
      >新增<a-icon type="plus"
    /></a-button>
    <a-modal
      v-model="visible"
      :title="changeTitle"
      width="1000px"
      @cancel="clearInput"
      id="modal-wrapper"
    >
      <div class="modal-body">
        <a-form-model :model="list" ref="ruleForm" :rules="rules">
          <div class="firstPart">
            <div class="firstPart-item">
              <a-form-model-item
                class="custom-form-commodity"
                label="商品名稱"
                prop="name"
              >
                <a-input
                  ref="inputDom"
                  v-model="list.name"
                  placeholder="請輸入"
                />
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                style="margin-left: 13px;"
                label="出貨名稱"
              >
                <a-input v-model="list.alias" placeholder="請輸入" />
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                label="商品條碼"
                prop="barcode"
                style="margin-left: 5px"
              >
                <div v-if="list.unit === 'PACK' || list.unit === 'PIECE'">
                  <a-input v-model="list.barcode" placeholder="請輸入" />
                </div>
                <div v-else style="margin-left: 6px">
                  <a-input style="width: 348px" disabled />
                </div>
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                label="計價單位"
                prop="unit"
                style="margin-left: 8px"
              >
                <translate v-model="list.unit" :barCodeVerify="barCodeVerify" />
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                style="margin:1px 0 0 -20px"
                label="定重重量"
              >
                <div
                  class="weight-wrapper"
                  v-if="list.unit === 'PACK' || list.unit === 'PIECE'"
                >
                  <a-input
                    v-model="list.weight"
                    style="width: 550px"
                    placeholder="請輸入"
                    v-mask="decimalFormat"
                  />
                  <a-form-model-item
                    prop="weightUnit"
                    style="margin-top: -4px;width: 120px;"
                  >
                    <threeWeights
                      v-model="list.weightUnit"
                      :weightUnitVerify="weightUnitVerify"
                    />
                  </a-form-model-item>
                </div>
                <div v-else>
                  <a-input disabled style="width: 230px" />
                  <a-select style="width: 120px" disabled>
                    <a-select-option value="1">
                      ""
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                label="單價"
                prop="listPrice"
                style="margin-left: -26px;position: relative;left: 29px;"
              >
                <a-input
                  v-model="priceFormatting"
                  prefix="$"
                  placeholder="請輸入"
                />
              </a-form-model-item>
              <a-form-model-item
                      class="custom-form-commodity alone"
                      label="商品類別"
                      prop="categories"
              >
                <a-select
                        v-model="list.categories"
                        style="z-index: 1"
                >
                  <a-select-option v-for="item in categoryList" :key="item.id">
                    {{ item.category }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity alone"
                label="預設標籤"
                prop="tagId"
              >
                <a-select
                  v-model="list.tagId"
                  @change="passTagId"
                  style="z-index: 1;width:350px"
                >
                  <a-select-option v-for="item in tagList" :key="item.id">
                    {{ item.tagName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <a-form-model-item class="desc-area" label="商品描述">
              <a-textarea
                class="aaa"
                v-model="list.description"
                placeholder="請輸入"
                style="height: 100px;"
              />
            </a-form-model-item>
          </div>
        </a-form-model>
      </div>

      <div>
        出貨單價設定
        <a-button
          type="primary"
          size="small"
          class="editable-add-btn"
          @click="handleAdd"
        >
          <a-icon type="plus" />
        </a-button>
        <template>
          <a-table
            class="salesTable"
            bordered
            :data-source="salesTable"
            :columns="columns"
            :rowKey="record => record.id"
            :pagination="{
              newCurrent,
              newPageSize,
              newPageSizeOptions
            }"
            @change="salesTableChange"
          >
          </a-table>
        </template>
      </div>

      <template slot="footer">
        <div v-if="list.updateTime">
          <span
            >上次更新時間: {{ list.updateTime.split(' ')[0]
            }}<span style="display: inline-block; width: 10px;" />
            {{ list.updateTime.split(' ')[1] }}</span
          >
        </div>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          儲存
        </a-button>
        <a-button
          v-show="changeTitle === '新增商品'"
          type="primary"
          :loading="loading"
          @click="submitNonstop"
        >
          儲存並新增
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import VueMask from 'v-mask'
import formatPrice from '@/components/thousand'
import translate from '@/components/translate'
import threeWeights from '@/components/threeweightTrans'
import Fragment from '@/components/Fragment.vue'
// import { computedWeight } from "@/unit/dictionary/computed";
export default {
  name: 'CustomPrice',
  components: { translate, threeWeights },
  props: ['getCommodity', 'tableData'],
  data() {
    return {
      newCurrent: 1,
      newPageSize: 10,
      newPageSizeOptions: ['10', '30', '50', '100'],
      defaultTagId: '',
      selectedId: [],
      cusList: [],
      customerId: '',
      customerList: [],
      tagList: [],
      salesTable: [],
      loading: false,
      visible: false,
      changeTitle: '',
      categoryList:[{id:'COMMERCIAL',category: '商用包'}, {id:'RETAIL',category: '零售包'}],
      classesList: [],
      list: {
        name: '',
        unit: 'KG',
        unitType: '',
        barcode: '',
        listPrice: '',
        description: '',
        using: undefined,
        updateTime: '',
        tagId: '',
        categories:'',
        alias: '',
        weight: 0,
        weightUnit: ''
      },
      rules: {
        barcode: [
          {
            required: true,
            pattern: /^\d+$/,
            message: '請輸入數字',
            trigger: 'blur'
          }
        ],
        unit: [{ required: true, message: '請選擇', trigger: 'blur' }],
        weightUnit: [{ required: false, message: '請選擇', trigger: 'blur' }],
        tagId: [{ required: true, message: '請選擇', trigger: 'blur' }],
        name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
        listPrice: [
          {
            required: true,
            pattern: /^\d+$/,
            message: '請輸入數字',
            trigger: 'blur'
          }
        ],
        categories: [
          {
            required: true,
            message: '請選擇',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          title: '客戶類別',
          dataIndex: 'classes',
          align: 'center',
          customRender: (val, row) => {
            return {
              children: (
                <div>
                  <a-select
                    style="width:200px"
                    placeholder="請選擇"
                    onChange={id => this.handleChange(id, row)}
                    vModel={row.classes}
                  >
                    {this.classesList.map(item => (
                      <a-select-option value={item.id}>
                        {item.className}
                      </a-select-option>
                    ))}
                  </a-select>
                </div>
              )
            }
          },
          scopedSlots: { customRender: 'classes' }
        },
        {
          title: '客戶名稱',
          dataIndex: 'clientName',
          align: 'center',
          customRender: (val, row) => {
            return {
              children: (
                <div>
                  <a-select
                    style="width:200px"
                    vModel={row.clientName}
                    placeholder="請選擇"
                    onChange={id => this.clientOption(id, row)}
                  >
                    {row.storeClient.map(item => (
                      <a-select-option value={item.id} disabled={item.disabled}>
                        {item.name}
                      </a-select-option>
                    ))}
                  </a-select>
                </div>
              )
            }
          },
          scopedSlots: { customRender: 'clientName' }
        },
        {
          title: '出貨單價',
          dataIndex: 'discountPrice',
          align: 'center',
          width: 100,
          customRender: (val, row) => {
            return this.priceAndRemarkEditor(val, row, 'discountPrice')
          },
          scopedSlots: { customRender: 'discountPrice' }
        },
        {
          title: '備註',
          dataIndex: 'remark',
          align: 'center',
          width: 200,
          customRender: (val, row) => {
            return this.priceAndRemarkEditor(val, row, 'remark')
          },
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          customRender: (value, row, index) => ({
            children: (
              <div>
                {this.salesTable.length ? (
                  <div>
                    <a-popconfirm
                      title="確定要刪除嗎?"
                      onConfirm={() =>
                        this.deleteSalesTable(
                          row,
                          (index =
                            (this.newCurrent - 1) * this.newPageSize + index)
                        )
                      }
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
      ]
    }
  },
  created() {
    this.getAllTagList()
    this.getClassesList()
    this.getCustomerList()
  },
  watch: {
    'list.weight'(val) {
      if (parseFloat(val).toFixed(3) > 0) {
        this.rules.weightUnit[0].required = true
      } else {
        this.rules.weightUnit[0].required = false
        this.$refs.ruleForm.clearValidate()
      }
    },
  },
  methods: {
    barCodeVerify() {
      if (this.list.unit === 'PACK' || this.list.unit === 'PIECE') {
        this.rules.barcode[0].required = true
      } else {
        this.rules.barcode[0].required = false
        this.list.barcode = ''
        this.list.weight = 0
        this.list.weightUnit = ''
        this.$refs.ruleForm.clearValidate()
      }
    },
    weightUnitVerify() {
      console.log(parseFloat(this.list.weight).toFixed(3) > 0)
      this.$refs.ruleForm.clearValidate()
    },
    getCustomerList() {
      this.$api.Inventory.onlyCustomerList().then(res => {
        this.customerList = res.data
      })
    },
    handleChange(id) {
      this.customerId = id
    },
    clientOption(id) {
      this.selectedId = id
    },
    handleAdd() {
      const { salesTable } = this
      const self = this
      const newData = {
        classes: '',
        discountId: undefined,
        clientName: '',
        discountPrice: undefined,
        remark: '',
        isEditDiscountPrice: true,
        isEditRemark: true,
        get storeClient() {
          //找到已選過的選項
          let selected = self.salesTable.map(stItem => stItem.clientName)
          return self.customerList.filter(item => {
            //把找到的選項加上禁用
            item.disabled = selected.includes(item.id)
            return item.classes.id === newData.classes
          })
        }
      }
      this.salesTable = [...salesTable, newData]
    },
    salesTableChange({ current, pageSize }) {
      this.newCurrent = current
      this.newPageSize = pageSize
    },
    showModal(record) {
      this.visible = true
      setTimeout(()=>{
        document.querySelector('#modal-wrapper').addEventListener('keyup',this.handleOk,)
      },100)
      setTimeout(() => {
        this.$refs.inputDom.focus()
      }, 100)
      if (!record) {
        this.changeTitle = '新增商品'
        this.rules.barcode[0].required = false
      } else {
        this.track = record.id
        this.changeTitle = '編輯商品'
        if (record.using === true) {
          if (record !== '') {
            ;(this.list.name = record.name),
              (this.list.barcode = record.barcode),
              (this.list.unit = record.unit),
              (this.list.listPrice = record.price),
              (this.list.description = record.description)
            this.list.updateTime = record.updateTime
            this.list.alias = record.alias
            this.list.weight = record.fixedWeight.toFixed(3)
            this.list.weightUnit =
              record.weightUnit === null ? '' : record.weightUnit
            this.list.categories = record.productCategories
            this.list.tagId = record.tagId
            this.visible = true

            this.$api.Commodity.getCommodityDiscount({
              productId: this.track
            }).then(res => {
              this.salesTable = res.data.map(item => ({
                classes: item.classId,
                clientName: item.clientId,
                discountPrice: item.clientPrice,
                remark: item.remark,
                isEditDiscountPrice: true,
                isEditRemark: true,
                storeClient: this.customerList.filter(
                  list => list.classes.id === item.classId
                )
              }))
            })
            if (record.unit === 'PACK' || record.unit === 'PIECE') {
              this.rules.barcode[0].required = true
            } else {
              this.rules.barcode[0].required = false
              this.list.barcode = ''
              this.$refs.ruleForm.clearValidate()
            }
          }
        }
      }
    },
    submitNonstop() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === '新增商品') {
            this.$api.Commodity.addCommodity({
              name: this.list.name,
              unit: this.list.unit,
              barcode: this.list.barcode,
              price: parseInt(this.list.listPrice),
              description: this.list.description,
              fixedWeight:
                      this.list.barcode === ''
                              ? 0
                              : this.list.weight
                              ? parseFloat(this.list.weight).toFixed(3)
                              : 0,
              weightUnit: this.list.barcode === '' ? '' : this.list.weightUnit,
              productCategories : this.list.categories,
              tagId: this.list.tagId,
              alias: this.list.alias,
              using: true,
              discountRequestList: this.salesTable.map(item => {
                return {
                  clientId: item.clientName,
                  price: item.discountPrice,
                  remark: item.remark
                }
              })
            })
              .then(res => {
                this.getCommodity()
                this.$message.success(`新增${res.data.name}成功`)
                this.visible = true
                this.rules.barcode[0].required = false
                this.clearInput()
              })
              .catch(err => {
                this.$message.error(err.response.data.message)
                this.visible = true
                if (!this.list.tagId) {
                  this.$message.error('請先設定標籤')
                } else if (
                  this.tableData.some(item => item.name === this.list.name)
                ) {
                  this.$message.error('此商品已存在')
                }
              })
          }
        }
      })
    },
    handleOk(e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(e.target.innerText === '儲 存' || e.key === 'Enter'){
            if (this.changeTitle === '新增商品') {
              this.$api.Commodity.addCommodity({
                name: this.list.name,
                unit: this.list.unit,
                barcode: this.list.barcode,
                price: parseInt(this.list.listPrice),
                description: this.list.description,
                fixedWeight:
                        this.list.barcode === ''
                                ? 0
                                : this.list.weight
                                ? parseFloat(this.list.weight).toFixed(3)
                                : 0,
                weightUnit: this.list.barcode === '' ? '' : this.list.weightUnit,
                productCategories : this.list.categories,
                tagId: this.list.tagId,
                alias: this.list.alias,
                using: true,
                discountRequestList: this.salesTable.map(item => {
                  return {
                    clientId: item.clientName,
                    price: item.discountPrice,
                    remark: item.remark
                  }
                })
              })
                      .then(res => {
                        this.getCommodity()
                        this.$message.success(`新增${res.data.name}成功`)
                        this.visible = false
                        this.clearInput()
                      })
                      .catch(err => {
                        this.$message.error(err.response.data.message)
                        this.visible = true
                        if (!this.list.tagId) {
                          this.$message.error('請先設定標籤')
                        } else if (
                                this.tableData.some(item => item.name === this.list.name)
                        ) {
                          this.$message.error('此商品已存在')
                        }
                      })
            } else {
              this.$api.Commodity.updateCommodity({
                id: this.track,
                name: this.list.name,
                unit: this.list.unit,
                barcode: this.list.barcode,
                price: this.list.listPrice,
                description: this.list.description,
                fixedWeight:
                        this.list.barcode === ''
                                ? 0
                                : this.list.weight
                                ? parseFloat(this.list.weight).toFixed(3)
                                : 0,
                weightUnit: this.list.barcode === '' ? '' : this.list.weightUnit,
                productCategories : this.list.categories,
                tagId: this.list.tagId,
                alias: this.list.alias,
                using: true,
                discountRequestList: this.salesTable.map(item => {
                  return {
                    clientId: item.clientName,
                    price: item.discountPrice,
                    remark: item.remark
                  }
                })
              })
                      .then(() => {
                        this.getCommodity()
                        this.$message.success('修改商品成功')
                        this.clearInput()
                        this.visible = false
                      })
                      .catch(err => {
                        this.$message.error(err.response.data.message)
                        this.visible = true
                        if (!this.list.tagId) {
                          this.$message.error('請先設定標籤')
                        } else if (
                                this.tableData.some(item => item.name === this.list.name)
                        ) {
                          this.$message.error('此商品已存在')
                        }
                      })
            }
          }
        }
      })
    },
    async deleteSalesTable(row, index) {
      if (this.changeTitle === '新增商品') {
        this.salesTable.splice(index, 1)
      } else {
        if (row.id) {
          try {
            await this.$api.Customer.discountRemove(row)
            this.salesTable.splice(index, 1)
            this.$message.success('刪除折扣成功')
          } catch (err) {
            this.$message.error('刪除折扣失敗')
            console.log(err)
          }
        } else {
          this.salesTable.splice(index, 1)
        }
      }
      // if ((index % 10) + 1 === 1 && index !== 0) {
      //   this.newCurrent--
      // }
    },
    keepSelection() {
      this.salesTable.reduce((p, v) => {
        return v.classes ? { ...p, [v.classes]: true } : p
      }, {})
    },
    handleCancel() {
      this.visible = false
      this.clearInput()
    },
    clearInput() {
      this.list = {
        name: '',
        categories: '',
        unit: 'KG',
        barcode: '',
        listPrice: '',
        description: '',
        tagId: '',
        fixedWeight: 0,
        weightUnit: '',
        weight: 0
      }
      this.salesTable = []
      this.resetForm()
    },
    addNewItem(row, editKey) {
      row[editKey] = false
    },
    inputORnot(row, editKey) {
      row[editKey] = true
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    getClassesList() {
      this.$api.Customer.getClass().then(res => {
        this.classesList = res.data
      })
    },
    getAllTagList() {
      this.$api.Label.getAllTag().then(res => {
        this.tagList = res.data

        let oldestTime = res.data.reduce((p, c) => {
          return p.createTime > c.createTime ? c : p
        })
        this.defaultTagId = oldestTime.id
      })
    },
    passTagId(id) {
      this.list.tagId = id
      document.getElementsByClassName('aaa')[0].focus()
      this.$refs.ruleForm.clearValidate()
    }
  },
  computed: {
    decimalFormat() {
      return this.list.weight
        .toString()
        .replace(
          /\.\d{2,}$/,
          this.list.weight
            .toString()
            .substr(this.list.weight.toString().indexOf('.'), 3)
        )
    },
    priceFormatting: {
      get: function() {
        return formatPrice(this.list.listPrice)
      },
      set: function(newValue) {
        this.list.listPrice = newValue.replace(/[^\d]/g, '')
      }
    },
    priceAndRemarkEditor() {
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
                      key === 'discountPrice' &&
                      (row[key] = row[key].replace(/[^\d]/g, ''))
                    }
                    vOn:Keyup_enter={() => this.addNewItem(row, editKey)}
                  />
                </div>
              ) : (
                <Fragment>
                  <span onClick={() => this.inputORnot(row, editKey)}>
                    {key === 'discountPrice' ? '$' + formatPrice(val) : val}
                  </span>
                  <div class="displayEdit" />
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
.modal-body {
  background-color: #f5f5f5;
  /*display: flex;*/
}
.firstPart {
  padding: 30px 20px 30px 20px;
}
.firstPart-item {
  display: flex;
  /*flex-direction: column;*/
  flex-wrap: wrap;
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
.editable-add-btn {
  margin-top: 10px;
  margin-bottom: 10px;
}
.editable-cell-icon {
  display: block;
  position: relative;
  z-index: 1;
  cursor: pointer;
  top: 3.5px;
}
.tagMessage {
  width: 100%;
  margin: -40px 0 0 355px;
  z-index: -1;
  color: red;
}
.weight-wrapper {
  display: flex;
}
</style>
