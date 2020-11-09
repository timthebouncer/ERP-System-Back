<template>
  <div class="container">
    <!--    <div class="login">-->
    <!--      <div class="account">帳號<input v-model="login.username" type="text"/></div>-->
    <!--      <div class="password">密碼<input v-model="login.password" type="text"/></div>-->
    <!--      <button @submit="loginHandler">登入</button>-->
    <!--    </div>-->
    <div class="action">
      <div class="addM">
        <a-button class="button1" @click="showModal"
          >新增
          <a-icon type="plus" />
        </a-button>
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
                      :rowKey="record => record.id"
                      :pagination="false"
                    >
                      <!--                      <template-->
                      <!--                        v-for="col in [-->
                      <!--                          'order',-->
                      <!--                          'name',-->
                      <!--                          'unit',-->
                      <!--                          'salesPrice',-->
                      <!--                          'discountPrice',-->
                      <!--                          'remark',-->
                      <!--                          'operation'-->
                      <!--                        ]"-->
                      <!--                        :slot="col"-->
                      <!--                        slot-scope="text, record, index"-->
                      <!--                      >-->
                      <!--                        <div :key="col">-->
                      <!--                          <template v-if="col === 'order'">-->
                      <!--                            {{ index + 1 }}-->
                      <!--                          </template>-->
                      <!--                          <template v-else-if="col === 'name'">-->
                      <!--                                                  <a-select v-model="record[col]" placeholder="請選擇" @change="pushValue($event, record)">-->
                      <!--                                                    <a-select-option v-for="item in discountClass" :key="item.id">-->
                      <!--                                                      {{ item.name }}-->
                      <!--                                                    </a-select-option>-->
                      <!--                                                  </a-select>-->
                      <!--                          </template>-->
                      <!--                          <template v-else-if="col === 'discountPrice'||col === 'remark'">-->
                      <!--                            <div v-if="switches">-->
                      <!--                              <a-input-->
                      <!--                                  v-model="record[col]"-->
                      <!--                                  placeholder="請輸入"-->
                      <!--                                  @keyup.enter="addNewItem"-->
                      <!--                              />-->
                      <!--                              </div>-->
                      <!--                            <span v-else @click="helloWorld">-->
                      <!--                               {{text}}-->
                      <!--                            </span>-->
                      <!--                          </template>-->
                      <!--                          <template v-else>-->
                      <!--                            <span>{{ text }}</span>-->
                      <!--                          </template>-->
                      <!--                        </div>-->
                      <!--                      </template>-->
                      <!--                      <template-->
                      <!--                        slot="operation"-->
                      <!--                        slot-scope="text, record, index"-->
                      <!--                      >-->
                      <!--                        <a-popconfirm-->
                      <!--                          v-if="discountTable.length"-->
                      <!--                          title="Sure to delete?"-->
                      <!--                          @confirm="() => deleteDiscount(index)"-->
                      <!--                        >-->
                      <!--                          <a href="javascript:;">刪除</a>-->
                      <!--                        </a-popconfirm>-->
                      <!--                      </template>-->
                    </a-table>
                    <a-pagination
                      class="pagination"
                      v-model="current"
                      :page-size-options="pageSizeOptions"
                      :total="total"
                      show-size-changer
                      :page-size="pageSize"
                      @change="discountTableChange"
                      @showSizeChange="discountTableChange"
                    >
                      <template slot="buildOptionText" slot-scope="props">
                        <span v-if="props.value !== '50'"
                          >{{ props.value }}筆/頁</span
                        >
                        <span v-if="props.value === '50'">全部</span>
                      </template>
                    </a-pagination>
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
        <a-select class="search-select" v-model="match.name" style="width: 100px">
          <a-select-option v-for="item in classify" :key="item.id">
            {{ item.className }}
          </a-select-option>
        </a-select>
        <div class="search-input">
          <a-input-search
            v-model="search"
            placeholder="搜尋內容"
            enter-button
            @click="searchHandler"
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
        :rowKey="record => record.id"
      >
        <template
          v-for="col in [
            'order',
            'id',
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
              >編輯
            </a-button>
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
      v-model="current"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      :page-size="pageSize"
      @change="onShowSizeChange"
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
import { computedWeight } from "@/unit/dictionary/computed";

export default {
  name: "Customer",
  data() {
    return {
      // login:{username:'',password: ""},
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
      discountClass: [],
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
          align: "center",
          // eslint-disable-next-line no-unused-vars
          customRender: (_, __, i) => {
            return {
              children: <div>{i + 1}</div>
            };
          },
          scopedSlots: { customRender: "order" }
        },
        {
          title: "商品名稱",
          dataIndex: "productName",
          align: "center",
          customRender: (value, row, index) => {
            console.log(row, 4465);
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
                    {this.discountClass.map(item => (
                      <a-select-option value={item.id}>
                        {item.name}
                      </a-select-option>
                    ))}
                  </a-select>
                </div>
              )
            };
          },
          scopedSlots: { customRender: "productName" }
        },
        {
          title: "單位",
          dataIndex: "unit",
          align: "center",
          scopedSlots: { customRender: "unit" }
        },
        {
          title: "售價",
          dataIndex: "salesPrice",
          align: "center",
          scopedSlots: { customRender: "salesPrice" }
        },
        {
          title: "價格",
          dataIndex: "discountPrice",
          align: "center",
          width: 100,
          customRender: (val, row) => {
            return this.priceAndRemarkEditor(val, row, "discountPrice");
          },
          scopedSlots: { customRender: "discountPrice" }
        },
        {
          title: "備註",
          dataIndex: "remark",
          // width: "10%",
          align: "center",
          width: 200,
          customRender: (val, row) => {
            return this.priceAndRemarkEditor(val, row, "remark");
          },
          scopedSlots: { customRender: "remark" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          // width: "2%",
          align: "center",
          customRender: (value, row, index) => ({
            children: (
              <div>
                {this.discountTable.length ? (
                  <div>
                    <a-popconfirm
                      title="Sure to delete?"
                      onConfirm={() => this.deleteDiscount(index)}
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
          scopedSlots: { customRender: "operation" }
        }
      ],
      pageSizeOptions: ["10", "20", "30"],
      current: 1,
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
    axios("/erp/product/getProduct?searchKey=").then(res => {
      this.discountClass = res.data;
      console.log(this.discountClass);
    });
    axios
      .get("/erp/product/productList?productName=&pageNumber=1&pageSize=10")
      .then(res => {
        // this.discountTable = res.data;
        // this.discountClass = res.data.content
        console.log(res);
      });
  },
  computed: {
    changeClass(){
     if(!this.match.name){
       return this.tableData
     }else {
       return this.tableData.filter(item => {
         return item.classes.id === this.match.name
       })
     }
    },
    filterText() {
      if (this.search) {
        return this.tableData.filter(item => {
          return item.name.includes(this.search);
        });
      } else {
        return this.changeClass;
      }
    },
    priceAndRemarkEditor() {
      return (val, row, key) => ({
        children: (
          <div>
            {this.switches ? (
              <div>
                <a-input
                  placeholder="請輸入"
                  value={row[key]}
                  vModel={row[key]}
                  vOn:Keyup_enter={() => this.addNewItem()}
                />
              </div>
            ) : (
              <span onClick={() => this.helloWorld()}>{val}</span>
            )}
          </div>
        )
      });
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    addNewItem() {
      this.switches = false;
    },
    helloWorld() {
      this.switches = true;
    },
    getCustomerList() {
      this.$api.Customer.getList({
        searchKeyword: this.search,
        pageNumber: this.current,
        pageSize: this.pageSize
      })
        .then(res => {
          this.tableData = res.data.content;
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
              name: this.list.name,
              classesId: this.list.classes.id,
              vatNumber: this.list.vatNumber,
              company: this.list.company,
              contactPerson: this.list.contactPerson,
              tel: this.list.tel,
              address: this.list.address,
              cellphone: this.list.cellphone,
              fax: this.list.fax,
              discountList: this.discountTable.map(item => {
                return {
                  discountId: "",
                  productId: item.productId,
                  discountPrice: item.discountPrice,
                  remark: item.remark,
                  unit: item.unit
                };
              })
            })
              .then(() => {
                this.getCustomerList();
                this.$message.info("新增客戶成功");
              })
              .catch(err => {
                console.log(err);
                this.$message.error("新增客戶失敗");
              });
            this.visible = false;
          } else {
            this.$api.Customer.update({
              clientId: this.track,
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
              companyAddress: this.list.companyAddress,
              discountList: this.discountTable.map(item => {
                console.log(item, 9999);
                return {
                  discountId: item.id,
                  productId: item.productId,
                  discountPrice: item.discountPrice,
                  remark: item.remark
                };
              })
            })
              .then(() => {
                this.getCustomerList();
                this.$message.info("編輯客戶成功");
              })
              .catch(err => {
                console.log(err);
                this.$message.error("編輯客戶失敗");
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
      console.log(record.discountList);
      this.track = record.id;
      this.changeTitle = "編輯客戶";
      this.$api.Customer.getSingleList(record)
        .then(res => {
          if (res.data !== "") {
            this.list = res.data;
            this.discountTableChange(1, 10)
            // this.discountTable = record.discountList.map(d => ({
            //   id: d.id,
            //   name: d.productName,
            //   productId: d.productId,
            //   unit: computedWeight(d.productUnit),
            //   salesPrice: d.productPrice,
            //   discountPrice: d.discountPrice,
            //   remark: d.remark
            // }));
            this.visible = true;
            console.log(this.discountTable, 132);
          } else {
            alert("123");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onDelete(record) {
      this.$api.Customer.delete(record)
        .then(() => {
          this.getCustomerList();
          this.$message.info("刪除客戶成功");
        })
        .catch(err => {
          console.log(err);
          this.$message.error("刪除客戶失敗");
        });
    },
    onShowSizeChange(current, pageSize) {
      this.$api.Customer.getList({
        searchKeyword: this.search,
        pageNumber: current,
        pageSize: pageSize
      }).then(res => {
        this.tableData = res.data.content;
      });
    },
    discountTableChange(current, pageSize) {
      this.$api.Customer.discount({
        clientId: this.track,
        pageNumber: current,
        pageSize: pageSize
      }).then(res => {
        console.log(res.data.content,666)
        this.discountTable = res.data.content.map(d => ({
          id: d.discountId,
          name: d.productName,
          productId: d.productId,
          unit: computedWeight(d.productUnit),
          salesPrice: d.productPrice,
          discountPrice: d.discountPrice,
          remark: d.remark
        }));
        // console.log(res,999)
        // this.discountTable = res.data.content;
      });
    },
    searchHandler() {
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
        productId: undefined,
        name: "",
        unit: "",
        salesPrice: null,
        discountPrice: undefined,
        remark: ""
      };
      this.discountTable = [...discountTable, newData];
      console.log(this.discountTable);
    },
    pushValue(id, index) {
      const item = this.discountClass.find(item => item.id === id);
      axios
        .get(
          `/erp/product/productList?productName=${item.name}&pageNumber=1&pageSize=10`
        )
        .then(res => {
          let content = res.data.content;
          let result = content.find(item => item.id === id);
          let rows = this.discountTable[index];
          rows.productId = result.id;
          rows.unit = result.unit;
          rows.salesPrice = result.salesPrice;
        });
    }
    // handleSearch(){
    //   axios.get('/erp/product/getProduct?searchKey='+ this.search)
    //   .then((res)=>{
    //     this.discountClass = res.data
    //   })
    // }
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
