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
                <a-input v-model="list.name" placeholder="請輸入" />
              </a-form-model-item>
              <a-form-model-item class="custom-form-commodity" style="margin-left: 13px;" label="出貨名稱">
                <a-input v-model="list.alias" placeholder="請輸入" />
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                style="margin-left: 11px"
                label="商品條碼"
                prop="barcode"
              >
                <a-input v-model="list.barcode" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item
                class="custom-form-commodity"
                label="計價單位"
                labelAlign="left"
                prop="unit"
              >
                <translate v-model="list.unit" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-commodity" style="margin-left: -16px" label="定重重量">
                <div class="weight-wrapper">
                  <a-input
                    v-model="list.weight"
                    style="width: 230px"
                    placeholder="請輸入"
                  />
                  <a-select default-value="lucy" style="width: 120px">
                    <a-select-option value="jack">
                      Jack
                    </a-select-option>
                  </a-select>
                </div>
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-commodity"
                label="單價"
                prop="listPrice"
                style="margin-left: -26px;position: relative;left: 27px;"
              >
                <a-input v-model="list.listPrice" prefix="$" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-commodity alone" label="預設標籤">
                <a-select v-model="list.tagId" @change="passTagId" default-value="list.tagId">
                  <a-select-option v-for="item in tagList" :key="item.id">
                    {{ item.tagName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <a-form-model-item
              class="desc-area"
              label="商品描述"
            >
              <a-textarea
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
import translate from '@/components/translate'
import Fragment from '@/components/Fragment.vue'
// import { computedWeight } from "@/unit/dictionary/computed";
export default {
  name: 'CustomPrice',
  components: { translate },
  props: ['getCommodity'],
  data() {
    return {
      selectedId:[],
      cusList: [],
      tagId: '',
      customerId: '',
      customerList: [],
      tagList: [],
      salesTable: [],
      loading: false,
      visible: false,
      changeTitle: '',
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
        tagId:'',
        alias:''
      },
      rules: {
        barcode: [{ pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }],
        unit: [{ required: true, message: '請選擇', trigger: 'blur' }],
        name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
        listPrice: [{ required: true,pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }]
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
                  <a-select style="width:200px" vModel={row.clientName} placeholder="請選擇" onChange={id => this.clientOption(id,row)} >
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
          // width: "2%",
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
                          row,index
                          // (index = (this.current - 1) * this.pageSize + index)
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
  methods: {
    getCustomerList() {
      this.$api.Inventory.onlyCustomerList().then(res => {
        this.customerList = res.data
      })
    },
    handleChange(id) {
      this.customerId = id

    },
    clientOption(id){
      this.selectedId = id
      // console.log(this.selectedId,6666)
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
          let selected = self.salesTable.map(stItem=>stItem.clientName)
          return self.customerList.filter(item => {
            //把找到的選項加上禁用
            item.disabled = selected.includes(item.id)
           return item.classes.id === newData.classes
          })
        }
      }
      this.salesTable = [...salesTable, newData]
    },
    salesTableChange() {},
    showModal(record) {
      this.visible = true
      if (!record) {
        this.changeTitle = '新增商品'
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
            this.list.weight = record.fixedWeight
            this.list.tagId = record.tagId
            this.visible = true
           this.$api.Commodity.getCommodityDiscount({
              productId: this.track
            }).then(res=>{
             this.salesTable = res.data.map(item=>({
                classes: item.classId,
                clientName: item.clientId,
                discountPrice: item.clientPrice,
                remark: item.remark,
                isEditDiscountPrice: true,
                isEditRemark: true,
                storeClient: this.customerList.filter(list => list.classes.id === item.classId)
              }))
           })
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
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              price: this.list.listPrice,
              description: this.list.description,
              fixedWeight: this.list.weight,
              tagId: this.list.tagId,
              alias:this.list.alias,
              using: true,
              discountRequestList: this.salesTable.map(item=>{
                return {
                  clientId: "",
                  price: item.discountPrice,
                  remark: item.remark
                }
              })
            })
              .then(res => {
                this.getCommodity()
                this.$message.success(`新增${res.data.name}成功`)
              })
              .catch(() => {
                this.visible = true
                this.$message.error('此商品已存在')
              })
            this.visible = true
            this.clearInput()
          }
        }
      })
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === '新增商品') {
            this.$api.Commodity.addCommodity({
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              price: this.list.listPrice,
              description: this.list.description,
              fixedWeight: this.list.weight,
              tagId: this.list.tagId,
              alias:this.list.alias,
              using: true,
              discountRequestList: this.salesTable.map(item=>{
                return {
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
              .catch(() => {
                this.visible = true
                this.$message.error('此商品已存在')
              })
          } else {
            this.$api.Commodity.updateCommodity({
              id: this.track,
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              price: this.list.listPrice,
              description: this.list.description,
              fixedWeight: this.list.weight,
              tagId: this.list.tagId,
              alias: this.list.alias,
              using: true,
              discountRequestList: this.salesTable.map(item=>{
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
              .catch(() => {
                this.$message.error('此商品條碼已存在')
                this.visible = true
              })
          }
        }
      })
    },
    deleteSalesTable(index) {
      this.salesTable.splice(index, 1)
    },
    keepSelection() {
      this.salesTable.reduce((p, v) => {
        console.log(p,v)
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
        unit: 'KG',
        barcode: '',
        listPrice: '',
        description: ''
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
        // let aaa = res.data.map(item => item.id)
      })
    },
    getAllTagList() {
      this.$api.Label.getAllTag().then(res => {
        this.tagList = res.data
      })
    },
    passTagId(id) {
      this.list.tagId = id
      console.log(this.list.tagId)
    }
  },
  computed: {
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
                    onKeyup={() =>  key === 'discountPrice' && (row[key] = row[key].replace(/[^\d]/g, ''))}
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
.editable-add-btn{
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

</style>
