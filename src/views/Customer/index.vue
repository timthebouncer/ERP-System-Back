<template>
  <div class="container">
    <div class="action">
      <div class="addM">
        <a-button class="button1" @click="showModal"
          >新增<a-icon type="plus"
        /></a-button>
        <a-modal
          v-model="visible"
          :title="changeTitle"
          width="1000px"
          @cancel="clearInput"
        >
          <div class="modal-body">
            <a-form-model
              :model="list"
              layout="horizontal"
              ref="ruleForm"
              :rules="rules"
            >
              <div class="firstPart">
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="客戶編號">
                    <div>{{ list.id }}</div>
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="客戶類別"
                    prop="classes"
                  >
                    <a-select v-model="list.classes.id" placeholder="請選擇">
                      <a-select-option v-for="item in classify" :key="item.id">
                        {{ item.className }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    class="custom-form-item"
                    label="客戶姓名"
                    prop="name"
                  >
                    <a-input v-model="list.name" placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <div class="firstPart-item">
                  <a-form-model-item class="custom-form-item" label="電話">
                    <a-input v-model="list.cellphone" placeholder="請輸入" />
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="email">
                    <a-input v-model="list.email" placeholder="請輸入" />
                  </a-form-model-item>
                </div>
                <a-form-model-item
                  class="custom-form-item address"
                  label="地址"
                >
                  <div style="width: 10%">
                    <a-input v-model="list.postcode" placeholder="郵遞區號" />
                  </div>
                  <div>
                    <a-input v-model="list.address" placeholder="請輸入" />
                  </div>
                </a-form-model-item>

                <a-form-model-item
                  class="custom-form-item address"
                  label="備註"
                >
                  <div>
                    <a-input v-model="list.reference" placeholder="請輸入" />
                  </div>
                </a-form-model-item>
              </div>
              <a-collapse
                class="collapse"
                default-active-key="1"
                :bordered="false"
              >
                <a-collapse-panel key="1" header="進階">
                  <div class="secondPart">
                    <div class="secondPart-item">
                      <a-form-model-item
                        class="custom-form-item"
                        label="公司名稱"
                      >
                        <a-input
                          v-model="list.company"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="統一編號"
                      >
                        <a-input
                          v-model="list.vatNumber"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="聯絡人"
                      >
                        <a-input
                          v-model="list.contactPerson"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="公司電話"
                      >
                        <a-input
                          v-model="list.tel"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item class="custom-form-item" label="傳真">
                        <a-input
                          v-model="list.fax"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>

                      <a-form-model-item
                        class="custom-form-item"
                        label="公司email"
                      >
                        <a-input
                          v-model="list.companyEmail"
                          placeholder="請輸入"
                          style="width: 200px"
                        />
                      </a-form-model-item>
                    </div>
                    <a-form-model-item
                      class="custom-form-item address"
                      label="公司地址"
                    >
                      <div style="width: 10%">
                        <a-input
                          v-model="list.companyPostcode"
                          placeholder="郵遞區號"
                        />
                      </div>
                      <div>
                        <a-input
                          v-model="list.companyAddress"
                          placeholder="請輸入"
                        />
                      </div>
                    </a-form-model-item>
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <div class="third-part">
                <div class="third-part-item">
                  <div>
                    商品折扣
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
                      :data-source="discountTable"
                      :columns="columns2"
                      rowKey="productId"
                    >
                      <template
                        v-for="col in [
                          'order',
                          'name',
                          'unit',
                          'salesPrice',
                          'discountPrice',
                          'remark',
                          'operation'
                        ]"
                        :slot="col"
                        slot-scope="text, record, index"
                      >
                        <div :key="col">
                          <template v-if="col === 'order'">
                            {{ index + 1 }}
                          </template>
                          <template v-else-if="col === 'name'">
                            <a-select v-model="record[col]" placeholder="請選擇" @change="pushValue($event, record)">
                              <a-select-option v-for="item in discountClass" :key="item.id">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                          </template>
                          <template v-else-if="col === 'discountPrice'||col === 'remark'">
                            <span @click="helloWorld" v-if="switches">
                              <input
                                  v-model="record[col]"
                                  placeholder="請輸入"
                                  @blur="addNewItem"
                                  @keyup.enter="addNewItem"
                              />
                              </span>
                            <span v-else>
                               {{text}}
                            </span>
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
                          v-if="discountTable.length"
                          title="Sure to delete?"
                          @confirm="() => deleteDiscount(index)"
                        >
                          <a href="javascript:;">刪除</a>
                        </a-popconfirm>
                      </template>
                    </a-table>
                  </div>
                </div>
              </div>
            </a-form-model>
          </div>
          <template slot="footer">
            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="handleOk()"
            >
              儲存
            </a-button>
            <a-button key="back" @click="handleCancel">
              取消
            </a-button>
          </template>
        </a-modal>
      </div>

      <div class="search-wrapper">
        <a-select class="search-select" v-model="match.id" style="width: 100px">
          <a-select-option v-for="item in classify" :key="item.id">
            {{ item.className }}
          </a-select-option>
        </a-select>
        <div class="search-input">
          <a-input-search
            v-model="search"
            placeholder="搜尋內容"
            enter-button
            @click="onSearch"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        :columns="columns"
        :data-source="filterText"
        bordered
        :pagination="false"
        rowKey="list.classes.id"
      >
        <template
          v-for="col in [
            'order',
            'classes.id',
            'classes.className',
            'name',
            'cellphone',
            'company',
            'vatNumber',
            'contactPerson',
            'tel'
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
        <template slot="operation" slot-scope="text, record">
          <a-space>
            <a-button type="link" size="small" @click="editHandler(record)"
              >編輯</a-button
            >
            <a-popconfirm
              title="客戶資料刪除後，所有資料將清空無法還原"
              @confirm="() => onDelete(record)"
            >
              <a-button type="link" size="small">刪除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>
    <!--分頁-->
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
  name: "Customer",
  data() {
    return {
      loading: false,
      visible: false,
      changeTitle: "",
      search: "",
      tableData: [],
      classify: [],
      list: {
        classes: { id: "", className: "" },
        name: "",
        cellphone: "",
        email: "",
        address: "",
        postcode: "",
        reference: "",
        company: "",
        vatNumber: "",
        contactPerson: "",
        tel: "",
        companyEmail: "",
        fax: "",
        companyPostcode: "",
        companyAddress: ""
      },
      discountClass:[],
      columns: [
        {
          title: "序",
          dataIndex: "order",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "order" }
        },
        {
          title: "客戶編號",
          dataIndex: "classes.id",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "classes.id" }
        },
        {
          title: "客戶類別",
          dataIndex: "classes.className",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "classes.className" }
        },
        {
          title: "客戶姓名",
          dataIndex: "name",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "電話",
          dataIndex: "cellphone",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "cellphone" }
        },
        {
          title: "公司名稱",
          dataIndex: "company",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "company" }
        },
        {
          title: "統一編號",
          dataIndex: "vatNumber",
          width: "7%",
          align: "center",
          scopedSlots: { customRender: "vatNumber" }
        },
        {
          title: "聯絡人",
          dataIndex: "contactPerson",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "contactPerson" }
        },
        {
          title: "公司電話",
          dataIndex: "tel",
          width: "6%",
          align: "center",
          scopedSlots: { customRender: "tel" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "7%",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      rules: {
        classes: [{ required: true, message: "請選擇", trigger: "blur" }],
        name: [{ required: true, message: "請輸入姓名", trigger: "blur" }]
      },
      discountTable: [],
      columns2: [
        {
          title: "序",
          dataIndex: "order",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "order" }
        },
        {
          title: "商品名稱",
          dataIndex: "name",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "單位",
          dataIndex: "unit",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "unit" }
        },
        {
          title: "售價",
          dataIndex: "salesPrice",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "salesPrice" }
        },
        {
          title: "價格",
          dataIndex: "discountPrice",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "discountPrice" }
        },
        {
          title: "備註",
          dataIndex: "remark",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "remark" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      pageSizeOptions: ["10", "20", "30"],
      pageNumber: 0,
      pageSize: 10,
      total: 30,
      match: { id: "", name: "" },
      switches: true
    };
  },
  created() {
    this.getCustomerList();
    this.$api.Customer.getClass()
      .then(res => {
        this.classify = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    axios.get("/erp/product/productList?productName=&pageNumber=1&pageSize=2")
    .then(res => {
      // this.discountTable = res.data;
      this.discountClass = res.data
    });
  },
  computed: {
    filterText() {
      if (!this.match.id) {
        return this.tableData;
      } else {
        return this.tableData.filter(item => {
          return item.name.includes(this.search);
        });
      }
    }
  },
  methods: {
    helloWorld() {
      if(this.switches === false)
      this.switches = true;
    },
    addNewItem() {
      if(this.switches === true){
        this.switches = false
      }else{
        this.switches = true
      }
    },
    getCustomerList() {
      this.$api.Customer.getList({
        searchKeyword: this.search,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showModal() {
      this.visible = true;
      this.changeTitle = "新增客戶";
    },
    clearInput() {
      this.list = {
        classes: {},
        name: "",
        cellphone: "",
        company: "",
        vatNumber: "",
        contactPerson: "",
        tel: "",
        address: "",
        fax: "",
        email: "",
        reference: "",
        companyEmail: "",
        companyPostcode: "",
        companyAddress: ""
      };
      this.discountTable = [];
      this.resetForm();
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeTitle === "新增客戶") {
            this.$api.Customer.add({
              // ...this.list,
              // classesId: this.list.classes.id,
              // className: this.list.classes.className,
              // discountList: this.discountTable
              name: this.list.name,
              classesId: this.list.classes.id,
              vatNumber: this.list.vatNumber,
              company: this.list.company,
              contactPerson: this.list.contactPerson,
              tel: this.list.tel,
              address: this.list.address,
              cellphone: this.list.cellphone,
              fax: this.list.fax,
              discountList: this.discountClass.map(item=>{
                return {productId: item.id, discountPrice: item.discountPrice, remark: item.remark}
              })
            })
              .then(() => {
                this.getCustomerList();
              })
              .catch(err => {
                console.log(err);
              });
            this.visible = false;
          } else {
            this.$api.Customer.update({
              id: this.track,
              classesId: this.list.classes.id,
              // className: this.list.classes.className,
              name: this.list.name,
              cellphone: this.list.cellphone,
              company: this.list.company,
              vatNumber: this.list.vatNumber,
              contactPerson: this.list.contactPerson,
              tel: this.list.tel,
              address: this.list.address,
              fax: this.list.fax,
              email: this.list.email,
              reference: this.list.reference,
              companyEmail: this.list.companyEmail,
              companyPostcode: this.list.companyPostcode,
              companyAddress: this.list.companyAddress,
              discountList: this.discountClass.map(item=>{
                return {productId: item.id, discountPrice: item.discountPrice, remark: item.remark}
              })
            })
              .then(() => {
                this.getCustomerList();
              })
              .catch(err => {
                console.log(err);
              });
            this.visible = false;
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
      this.changeTitle = "編輯客戶";
      this.$api.Customer.getSingleList(record)
        .then(res => {
          console.log(res);
          if (res.data !== "") {
            this.list = res.data;
            this.visible = true;
          } else {
            alert("123");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onDelete(record) {
      console.log(record)
      this.$api.Customer.delete(record).then(() => {
        this.getCustomerList();
      });
    },
    onShowSizeChange(pageNumber, pageSize) {
      this.pageSize = pageSize;
    },
    onSearch() {
      if (this.search) {
        this.getCustomerList();
      }
    },
    deleteDiscount(index) {
      const discountTable = [...this.discountTable];
      discountTable.splice(index, 1);
      this.discountTable = discountTable;
    },
    handleAdd() {
      const { discountTable } = this;
      const newData = {
        id: 0,
        name: '',
        unit: '',
        salesPrice: 0,
        discountPrice: 0,
        remark: '',
      };
      this.discountTable = [...discountTable, newData];
    },
    pushValue(id, record){
      const item = this.discountClass.find(item => item.id === id)
      record.id = item.id
      record.salesPrice = item.salesPrice
      record.unit = item.unit
    }
  }
};
</script>

<style scoped lang="scss">
/*::v-deep .ant-layout{*/
/*  height: 0%;*/
/*}*/
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
.secondPart {
  margin-top: 20px;
  padding: 30px 20px 30px 20px;
  background-color: #f5e9e9;
}
.secondPart-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.third-part {
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
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  margin-bottom: -20px;
}
::v-deep .ant-collapse-content > .ant-collapse-content-box {
  padding: 0px;
}
::v-deep .ant-collapse-borderless > .ant-collapse-item {
  border-bottom: none;
}
::v-deep .ant-collapse > .ant-collapse-item {
  border-bottom: none;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}
</style>
