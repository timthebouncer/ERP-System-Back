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
                class="custom-form-item"
                label="商品名稱"
                prop="name"
              >
                <a-input v-model="list.name" placeholder="請輸入" />
              </a-form-model-item>
              <a-form-model-item class="custom-form-item"
               label="出貨名稱">
                <a-input placeholder="請輸入" />
              </a-form-model-item>
              <a-form-model-item
                class="custom-form-item"
                label="商品條碼"
                prop="barcode"
              >
                <a-input v-model="list.barcode" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item
                class="custom-form-item"
                label="計價單位"
                labelAlign="left"
                prop="unit"
              >
                <translate v-model="list.unit" style="width: 175px" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-item" label="定重重量">
                <div class="weight-wrapper">
                  <a-input style="width: 115px" placeholder="請輸入" />
                  <a-select style="width: 60px">
                    <option></option>
                  </a-select>
                </div>
              </a-form-model-item>

              <a-form-model-item
                class="custom-form-item"
                label="單價"
                prop="listPrice"
              >
                <a-input v-model="list.listPrice" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-item" label="預設標籤">
                <a-select style="width: 175px">
                  <a-select-option v-for="item in tagList" :key="item.id">
                    {{item.tagName}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              </div>
              <a-form-model-item
                class="custom-form-item"
                label="商品描述"
                style="width: 100%"
              >
                <a-textarea
                  v-model="list.description"
                  placeholder="請輸入"
                  style="height: 100px"
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
        <a-button
          v-show="changeTitle === '新增商品'"
          type="primary"
          :loading="loading"
          @click="submitNonstop"
        >
          儲存並新增
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          儲存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import translate from "@/components/translate";
  // import { computedWeight } from "@/unit/dictionary/computed";
export default {
  name: 'CustomPrice',
  components: { translate },
  props:['getCommodity'],
  data() {
    return {
      tagList:[],
      salesTable: [],
      loading: false,
      visible: false,
      changeTitle: '',
      classesList:[],
      list: {
        name: '',
        unit: 'KG',
        unitType: '',
        barcode: '',
        listPrice: undefined,
        description: '',
        using: undefined,
        updateTime: ''
      },
      rules: {
        barcode: [{ pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }],
        unit: [{ required: true, message: '請選擇', trigger: 'blur' }],
        name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
        // salesPrice: [{ required: true, pattern:/^\d+$/,message: "請輸入售價(數字)", trigger: "blur" }],
        listPrice: [
          { pattern: /^\d+$/, message: '請輸入數字', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: '客戶類別',
          dataIndex: 'classes',
          align: 'center',
          customRender:(val, row)=>{
            return {
              children:(
                      <div>
                        <a-select
                        style="width:200px"
                        placeholder="請選擇"
                        >
                          {this.classesList.map(item => (
                                  <a-select-option
                                          value={item.id}
                                  >
                                    {item.className}
                                  </a-select-option>
                          ))}
                        </a-select>
                      </div>

              )
            }
          } ,
          scopedSlots: { customRender: 'classes' }
        },
        {
          title: '客戶名稱',
          dataIndex: '',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '出貨單價',
          dataIndex: 'discountPrice',
          align: 'center',
          width: 100,
          // customRender: (val, row) => {
          //   return this.priceAndRemarkEditor(val, row, 'discountPrice')
          // },
          scopedSlots: { customRender: 'discountPrice' }
        },
        {
          title: '備註',
          dataIndex: 'remark',
          align: 'center',
          width: 200,
          // customRender: (val, row) => {
          //   return this.priceAndRemarkEditor(val, row, 'remark')
          // },
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
                          row
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

    this.getAllTagList();
  },
  methods: {
    handleAdd() {
      const { salesTable } = this
      const newData = {
        classes:''
        // productId: undefined,
        // name: '',
        // unit: '',
        // salesPrice: null,
        // discountPrice: undefined,
        // remark: '',
        // isEditDiscountPrice: true,
        // isEditRemark: true
      }
      this.salesTable = [...salesTable, newData]
    },
    salesTableChange() {},
    showModal(record) {
      this.getClassesList();
      this.visible = true
      if(!record){
        this.changeTitle = '新增商品'
      }else {
        this.changeTitle = "編輯商品"
        this.track = record.id;
        if (record.using === true) {
          if (record !== "") {
            (this.list.name = record.name),
            (this.list.barcode = record.barcode),
            (this.list.unit = record.unit),
            (this.list.listPrice = record.listPrice),
            (this.list.description = record.description);
            (this.list.updateTime = record.updateTime)
            this.visible = true;
          }
        }
      }

    },
    submitNonstop() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === "新增商品") {
            this.$api.Commodity.addCommodity({
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              listPrice: this.list.listPrice,
              description: this.list.description,
              using: true
            }).then((res) => {
              this.getCommodity();
              this.$message.success(`新增${res.data.name}成功`);
            }).catch(()=>{
              this.visible = true
              this.$message.error('此商品已存在')
            });
            this.visible = true;
            this.clearInput();
          }
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === "新增商品") {
            this.$api.Commodity.addCommodity({
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              listPrice: this.list.listPrice,
              description: this.list.description,
              using: true
            }).then((res) => {
              this.getCommodity();
              this.$message.success(`新增${res.data.name}成功`);
              this.visible = false;
              this.clearInput();
            }).catch(()=>{
              this.visible = true
              this.$message.error('此商品已存在')
            });

          } else {
            this.$api.Commodity.updateCommodity({
              id: this.track,
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              listPrice: this.list.listPrice,
              description: this.list.description,
              use: true
            }).then(() => {
              this.getCommodity();
              this.$message.success("修改商品成功");
              this.visible = false;
            }).catch(()=>{
              this.$message.error('此商品條碼已存在')
              this.visible = true;
            });
          }
        }
      });
    },
    deleteSalesTable(){

    },
    handleCancel() {
      this.visible = false;
      this.clearInput();
    },
    clearInput() {
      this.list = {
        name: "",
        unit: "KG",
        barcode: "",
        listPrice: "",
        description: ""
      };
      this.salesTable = []
      this.resetForm();
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    getClassesList(){
      this.$api.Customer.getClass()
              .then(res=>{
                this.classesList = res.data
              })
    },
    getAllTagList(){
      this.$api.Label.getAllTag()
      .then(res=>{
        this.tagList = res.data
        console.log(this.tagList)
      })
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
  justify-content: space-between;
}
.weight-wrapper {
  display: flex;
}
</style>
