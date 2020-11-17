<template>
  <!--    商品管理-->
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
                    <NNN v-model="list.unit" style="width: 175px" />
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
          autoFocus
          @search="onSearch"
        />
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        :columns="columns"
        :data-source="tableData"
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
        <template slot="using" slot-scope="using, record">
          <a-switch :checked="using" @change="onChange($event, record)" />
        </template>
        <template slot="operation" slot-scope="text, record">
            <template v-if="record.using === true">
              <a-button type="link" size="small" @click="editHandler(record)"
              >編輯</a-button
              >
            </template>
          <template v-else>
            <a-button type="link" size="small" disabled @click="editHandler(record)"
            >編輯</a-button
            >
          </template>
        </template>
      </a-table>
    </div>
    <a-pagination
      class="pagination"
      v-model="current"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      :page-size="pageSize"
      :show-total="total => `總共 ${total} 筆`"
      @change="onPageChange"
      @showSizeChange="onShowSizeChange"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span>{{ props.value }}筆/頁</span>
<!--        <span v-if="props.value === '50'">全部</span>-->
      </template>
    </a-pagination>
    <!--    <AAA v-model="list.unit" />-->
  </div>
</template>

<script>
import axios from "axios";
import NNN from "@/components/NNN";
import { computedWeight } from "@/unit/dictionary/computed";
// import AAA from "@/components/AAA";
export default {
  name: "Merchant",
  components: { NNN },
  data() {
    return {
      loading: false,
      visible: false,
      track: "",
      search: "",
      list: {
        name: "",
        unit: "",
        unitType: undefined,
        barcode: "",
        salesPrice: undefined,
        costPrice: undefined,
        listPrice: undefined,
        description: null,
        using: undefined
      },
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
          dataIndex: "using",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "using" }
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
      pageSizeOptions: ["10", "30", "50", "100"],
      current: 1,
      pageSize: 10,
      total: 50
    };
  },
  created() {
    this.getCommodity();
  },
  methods: {
    showModal() {
      this.visible = true;
      this.changeTitle = "新增商品";
    },
    getCommodity() {
      this.$api.Commodity.getCommodityList({
        productName: this.search,
        pageNumber: this.current,
        pageSize: this.pageSize
      })
        .then(res => {
          this.total = res.data.totalElements;
          this.tableData = res.data.content.map(e=>({...e,unit:computedWeight(undefined,e.unit)}));
        })
        .catch(err => {
          console.log(err);
        });
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
            this.$api.Commodity.addCommodity({
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              salesPrice: this.list.salesPrice,
              listPrice: this.list.listPrice,
              costPrice: this.list.costPrice,
              description: this.list.description
            }).then(() => {
              this.getCommodity();
              this.$message.success("新增商品成功");
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
            this.$api.Commodity.addCommodity({
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              salesPrice: this.list.salesPrice,
              listPrice: this.list.listPrice,
              costPrice: this.list.costPrice,
              description: this.list.description
            }).then(() => {
              this.getCommodity();
              this.$message.success("新增商品成功");
            });
            this.visible = false;
          } else {
            this.$api.Commodity.updateCommodity({
              id: this.track,
              name: this.list.name,
              unit: this.list.unit,
              unitType: this.list.unitType,
              barcode: this.list.barcode,
              salesPrice: this.list.salesPrice,
              listPrice: this.list.listPrice,
              costPrice: this.list.costPrice,
              description: this.list.description,
              using: true
            }).then(() => {
              this.getCommodity();
              this.$message.success("修改商品成功");
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
      if (record.using === true) {
        if (record !== "") {
          (this.list.name = record.name),
            (this.list.barcode = record.barcode),
            (this.list.unit = computedWeight(record.unit)),
            (this.list.salesPrice = record.salesPrice),
            (this.list.listPrice = record.listPrice),
            (this.list.costPrice = record.costPrice),
            (this.list.description = record.description);
          this.visible = true;
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
        this.getCommodity(this.search);
    },
    onShowSizeChange(current, pageSize){
      this.current = 1;
      this.pageSize = pageSize;
      this.getCommodityList(this.search);
    },
    onPageChange(current){
      console.log(current);
      // console.log(pageSize);
      // console.log(this.total);
      this.getCommodityList(this.search);
    },
    onChange(checked, record) {
      console.log(record)
      axios
        .put(
          `/erp/product/changeStatus?productId=${record.id}&status=${checked}`
        )
        .then(res => {
          console.log(res);
          record.using = checked;
          this.$message.success("修改狀態成功");
        });
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
