<template>
  <div class="container">
    <div class="action">
      <div class="addM">
        <a-button class="button1" @click="showModal">新增+</a-button>
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
                    <div style="width: 100px">{{ list.id }}</div>
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="客戶類別">
                    <a-select v-model="list.classes.id" placeholder="請選擇">
                      <a-select-option v-for="item in classify" :key="item.id">
                        {{ item.className }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item class="custom-form-item" label="客戶姓名">
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

                <a-form-model-item label="備註">
                  <div>
                    <a-input v-model="list.reference" placeholder="請輸入" />
                  </div>
                </a-form-model-item>
              </div>
              <div class="secondPart">
                <div class="secondPart-item">
                  <a-form-model-item class="custom-form-item" label="公司名稱">
                    <a-input
                      v-model="list.company"
                      placeholder="請輸入"
                      style="width: 200px"
                    />
                  </a-form-model-item>

                  <a-form-model-item class="custom-form-item" label="統一編號">
                    <a-input
                      v-model="list.vatNumber"
                      placeholder="請輸入"
                      style="width: 200px"
                    />
                  </a-form-model-item>

                  <a-form-model-item class="custom-form-item" label="聯絡人">
                    <a-input
                      v-model="list.contactPerson"
                      placeholder="請輸入"
                      style="width: 200px"
                    />
                  </a-form-model-item>

                  <a-form-model-item class="custom-form-item" label="公司電話">
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

                  <a-form-model-item class="custom-form-item" label="公司email">
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
            </a-form-model>
          </div>
          <template slot="footer">
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

      <div class="search-wrapper">
        <a-select class="search-select" style="width: 100px">
          <a-select-option value="">
            批發商
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
        rowKey="id"
      >
        <template
          v-for="col in [
            'order',
            'id',
            'classify',
            'name',
            'cellPhone',
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
          <a-button size="small" @click="editHandler(record)">編輯</a-button>
          <a-popconfirm title="確定要刪除嗎?" @confirm="() => onDelete(record)">
            <a-button size="small">刪除</a-button>
          </a-popconfirm>
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
      lc: { span: 6 },
      wc: { span: 18 },
      loading: false,
      visible: false,
      changeTitle: "",
      search: "",
      tableData: [],
      classify: [],
      list: {
        id: "",
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
          dataIndex: "id",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "客戶類別",
          dataIndex: "classify",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "classify" }
        },
        {
          title: "客戶姓名",
          dataIndex: "name",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "電話",
          dataIndex: "cellPhone",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "cellPhone" }
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
          width: "10%",
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
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "tel" }
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
        name: [{ required: true, message: "Please input", trigger: "blur" }],
        classes: [{ required: true, message: "Please input", trigger: "blur" }]
      },
      pageSizeOptions: ["10", "20", "30"],
      current: 1,
      pageSize: 10,
      total: 30
    };
  },
  created() {
    this.getList();

      // axios.get('/erp/client/classes')
      //     .then((res) => {
      //         this.classify = res.data
      //         console.log(this.classify)
      //     }).catch((err) => {
      //     console.log(err)
      // })
      this.$api.Customer.getClass().then((res) => {
          this.classify = res.data
          console.log(this.classify)
      }).catch((err) => {
          console.log(err)
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
    getList() {
      axios.get("/erp/client/clients?searchKeyword=").then(res => {
        this.tableData = res.data;
      });
    },
    showModal() {
      this.visible = true;
      this.changeTitle = "新增客戶";
    },
    clearInput() {
      this.list = {
        classes: "",
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
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid && this.changeTitle === "新增客戶") {
          axios
            .post("/erp/client/addClient", {
              classesId: this.list.classes.id,
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
              companyAddress: this.list.companyAddress
            })
            .then(() => {
              this.getList();
            })
            .catch(err => {
              console.log(err);
            });
          this.visible = false;
        } else {
          axios
            .put("/erp/client/updateClient", {
              id: this.track,
              classesId: this.list.classes.id,
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
              companyAddress: this.list.companyAddress
            })
            .then(() => {
              this.getList();
            })
            .catch(err => {
              console.log(err);
            });
          this.visible = false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleCancel() {
      this.visible = false;
    },
    editHandler(record) {
      this.track = record.id;
      this.changeTitle = "編輯客戶";
      axios
        .get("/erp/client/" + record.id)
        .then(res => {
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
      console.log(record.id);
      axios.delete("/erp/client/removeClient/" + record.id).then(() => {
        this.getList();
      });
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
    },
    onSearch() {
      if (this.search) {
        this.getList();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.firstPart {
}
.firstPart-item {
  display: flex;
  justify-content: flex-start;
}
.firstPart-item > div {
  flex: 1;
}
.firstPart-item > .aaa {
  display: flex;
  line-height: 2;
  font-size: medium;
  flex: initial;
}

/*.secondPart{*/
/*    !*margin-top: 10px;*!*/
/*    display: flex;*/
/*    !*flex-wrap: wrap;*!*/
/*    !*justify-content: space-between;*!*/
/*}*/
.secondPart-item {
  display: flex;
  flex-wrap: wrap;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.address::v-deep .ant-form-item {
  /*display: none;*/
}
.address::v-deep .ant-form-item .ant-form-item-label {
}
.address::v-deep .ant-form-item .ant-form-item-control {
}
</style>
