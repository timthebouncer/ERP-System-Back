<template>
  <!--    商品管理-->
  <div class="container">
    <div class="action">
      <div class="addM">
        <a-button class="button1" @click="showModal">新增<a-icon type="plus" /></a-button>
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

                  <a-form-model-item class="custom-form-item" label="商品條碼">
                    <a-input v-model="list.barcode" placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="單位"
                    prop="unit"
                  >
                    <a-select
                      v-model="list.unit"
                      placeholder="請選擇"
                      style="width: 175px"
                    >
                        <a-select-option v-for="list in unitList"
                                         :value="list.val"
                                         :key="list.type">
                          {{list.type}}
                        </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="售價"
                    prop="salesPrice"
                  >
                    <a-input v-model="list.salesPrice" placeholder="請輸入" />
                  </a-form-model-item>

                  <a-form-model-item class="custom-form-item" label="建議售價">
                    <a-input v-model="list.listPrice" placeholder="請輸入" />
                  </a-form-model-item>

                  <a-form-model-item class="custom-form-item" label="成本售價">
                    <a-input v-model="list.costPrice" placeholder="請輸入" />
                  </a-form-model-item>

                  <a-form-model-item
                    class="custom-form-item"
                    label="商品描述"
                    style="width: 100%"
                  >
                    <a-input
                      v-model="list.description"
                      placeholder="請輸入"
                      style="height: 100px"
                    />
                  </a-form-model-item>
                </div>
              </div>
            </a-form-model>
          </div>
          <template slot="footer">
            <a-button
              v-show="changeTitle === '新增商品'"
              type="primary"
              :loading="loading"
              @click="submitNonstop"
            >
              儲存並繼續
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

      <div class="search">
        <a-input-search
          v-model="search"
          placeholder="搜尋內容"
          enter-button
          @click="onSearch"
        />
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        :columns="columns"
        :data-source="filterText"
        bordered
        rowKey="id"
        :pagination="false"
      >
        <template
          v-for="col in [
            'order',
            'barcode',
            'name',
            'unit',
            'salesPrice',
            'listPrice',
            'costPrice',
            'stockAmount',
            'description'
          ]"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <template v-if="col === 'order'">
              {{ index + 1 }}
            </template>
            <template>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="use">
          <a-switch defaultChecked @change="onChange" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-space>
            <a-button type="link" size="small" @click="editHandler(record)"
              >編輯</a-button
            >
          </a-space>
        </template>
      </a-table>
    </div>
    <a-pagination
      class="pagination"
      v-model="pageNumber"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      :page-size="pageSize"
      @showSizeChange="onShowSizeChange"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span v-if="props.value !== '50'">{{ props.value }}筆/頁</span>
        <span v-if="props.value === '50'">全部</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Merchant",
  data() {
    return {
      loading: false,
      visible: false,
      track: "",
      search: "",
      check: false,
      list: {
        name: "",
        unit: "",
        unitType: undefined,
        barcode: "",
        salesPrice: undefined,
        costPrice: undefined,
        listPrice: undefined,
        description: null,
        use: undefined
      },
      unitList:[{type:"公斤",val:"KG"},{type:"公克",val:"G"},{type:"件",val:"PIECE"},{type:"台斤",val:"TG"}],
      tableData: [],
      changeTitle: "",
      columns: [
        {
          title: "序",
          dataIndex: "order",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "order" }
        },
        {
          title: "商品ID",
          dataIndex: "",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "" }
        },
        {
          title: "商品條碼",
          dataIndex: "barcode",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "barcode" }
        },
        {
          title: "商品名稱",
          dataIndex: "name",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "單位",
          dataIndex: "unit",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "unit" }
        },
        {
          title: "售價",
          dataIndex: "salesPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "salesPrice" }
        },
        {
          title: "建議售價",
          dataIndex: "listPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "listPrice" }
        },
        {
          title: "成本價",
          dataIndex: "costPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "costPrice" }
        },
        {
          title: "庫存量",
          dataIndex: "stockAmount",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "stockAmount" }
        },
        {
          title: "建立時間",
          dataIndex: "createDate",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "createDate" }
        },
        {
          title: "狀態",
          dataIndex: "use",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "use" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      rules: {
        unit: [{ required: true, message: "請選擇", trigger: "blur" }],
        name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
        prices: [{ required: true, message: "請輸入售價", trigger: "blur" }]
      },
      pageSizeOptions: ["10", "20", "30"],
      pageNumber: 0,
      pageSize: 10,
      total: 30
    };
  },
  created() {
    axios
      .get("/erp/product/productList?productName=&pageNumber=0&pageSize=10")
      .then(res => {
        console.log(res.data);
        this.tableData = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    filterText() {
      if (!this.search) {
        return this.tableData;
      } else {
        return this.tableData.filter(item => {
          return item.name.includes(this.search);
        });
      }
    }
  },
  methods: {
    showModal() {
      this.visible = true;
      this.changeTitle = "新增商品";
    },
    clearInput() {
      this.list = {
        name: "",
        unit: "",
        barcode: "",
        salesPrice: "",
        costPrice: "",
        listPrice: "",
        description: ""
      };
      this.resetForm();
    },
    submitNonstop() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === "新增商品") {
            axios
              .post("/erp/product/addProduct", {
                name: this.list.name,
                unit: this.list.unit,
                barcode: this.list.barcode,
                salesPrice: this.list.salesPrice,
                listPrice: this.list.listPrice,
                costPrice: this.list.costPrice,
                description: this.list.description,
                use: this.list.use
              })
              .then(() => {
                axios.get("/erp/product/productList?productName=&pageNumber=0&pageSize=10").then(res => {
                  this.tableData = res.data;
                });
              });
            this.visible = true;
          }
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === "新增商品") {
            axios
              .post("/erp/product/addProduct", {
                "name":"昇龍餃",
                "salesPrice":122.0,
                "unit":"KG",
                "unitType":"WEIGHT",
                "listPrice":null,
                "costPrice":199.0,
                "barcode":"dasdas",
                "description":null,
                "use":true
              })
              .then(() => {
                axios.get("/erp/product/productList?productName=&pageNumber=0&pageSize=10").then(res => {
                  this.tableData = res.data;
                });
              });
            this.visible = false;
          } else {
            axios
              .put("/erp/product/updateProduct", {
                id: this.track,
                name: this.list.name,
                unit: this.list.unit,
                unitType: this.list.unitType,
                barcode: this.list.barcode,
                salesPrice: this.list.salesPrice,
                listPrice: this.list.listPrice,
                costPrice: this.list.costPrice,
                description: this.list.description,
                use: this.check
              })
              .then(() => {
                axios.get("/erp/product/productList?productName=&pageNumber=0&pageSize=10").then(res => {
                  this.tableData = res.data;
                });
              });
            this.visible = false;
            this.loading = false;
          }
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleCancel() {
      this.visible = false;
      this.clearInput();
    },
    editHandler(record) {
      this.track = record.id;
      this.changeTitle = "編輯商品";
      if (this.check === true) {
        this.visible = true
        if (record !== "") {
          (this.list.name = record.name),
            (this.list.barcode = record.barcode),
            (this.list.unit = this.unitList.find(item => item.type === record.unit)),
             this.list.unit = this.list.unit.val,
            (this.list.salesPrice = record.salesPrice),
            (this.list.listPrice = record.listPrice),
            (this.list.costPrice = record.costPrice),
            (this.list.description = record.description)
        }
      }
    },
    // onDelete(record) {
    //   this.$api.Commodity.deleteCommodity(record).then(() => {
    //     axios.get("/erp/product/productList?productName=").then(res => {
    //       this.tableData = res.data;
    //     });
    //   });
    // },
    onSearch() {
      if (this.search) {
        axios.get("/erp/product/productList?productName=&pageNumber=0&pageSize=10").then(res => {
          this.tableData = res.data;
        });
      }
    },
    onShowSizeChange(pageNumber, pageSize) {
      this.pageSize = pageSize;
    },
    onChange(checked) {
      this.check = checked
      // axios.put('/erp/product/updateProduct',{use:this.list.use})
      // .then(()=>{
      //   this.check = check
      //   axios.get("/erp/product/productList?productName=&pageNumber=1&pageSize=10").then(res => {
      //     console.log(res)
      //     this.tableData = res.data;
      //   });
      // })

    }
  }
};
</script>

<style scoped lang="scss">
.search {
  width: 300px;
}

.modal-body {
  background-color: #f5e9e9;
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
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
