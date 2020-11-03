<template>
  <div class="container">
    <div class="action">
      <div class="buttons">
        <a-button class="reviewButton">刷新</a-button>
        <a-button class="addButton1" @click="showAddPurchaseView"
          >進貨+</a-button
        >
        <a-button class="addButton2">銷貨+</a-button>
      </div>
      <div class="addPurchaseView">
        <a-modal v-model="visible" width="500px" :title="modalTitle">
          <div><span>建立日期:</span><span>2020-10-10</span></div>
          <div class="class-input" style="display: flex;">
            <span>商品條碼:</span><a-input  placeholder="請輸入" style="width: 50%;" />
          </div>
          <div class="class-input" style="display: flex;">
            <span>商品名稱:</span><a-input  placeholder="請輸入" style="width: 50%;" />
          </div>
          <div class="class-input" style="display: flex;">
            <span>數量:</span><a-input  placeholder="請輸入" style="width: 20%;" />
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
      <a-table class="inventoryTable" :columns="columns" bordered :data-source="tableData" rowKey="id" >
        <a-table
          class="innerTable"
          slot="expandedRowRender"
          :data-source="innerData"
          :pagination="false"
          :showHeader="false"
        >
          <a-table-column width="20%" key="barCode" data-index="barCode" title="" align="center"/>
          <a-table-column width="25%" key="productName" data-index="productName" title="" align="center"/>
          <a-table-column width="10%" key="unit" data-index="unit" title="" align="center"/>
          <a-table-column width="10%" key="salesPrice" data-index="salesPrice" title="" align="center"/>
          <a-table-column width="10%" key="listPrice" data-index="listPrice" title="" align="center"/>
          <a-table-column width="10%" key="costPrice" data-index="costPrice" title="" align="center"/>
          <a-table-column width="10%" key="amount" data-index="amount" title="" align="center"/>
          <a-table-column width="5%" key="action" data-index="action" title="" align="center"/>
        </a-table>
        <template slot="amount" slot-scope="text, record">
          <editable-cell
            :text="text + ''"
            :id="record.id"
            @change="onCellChange(record.id, 'amount', $event)"
          />
        </template>
        <template slot="action">
          <a-icon
            type="close-square"
            theme="twoTone"
            two-tone-color="#eb2f96"
            :style="{ fontSize: '25px' }"
          />
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import EditableCell from "@/components/EditableCell";
export default {
  name: "Inventory",
  components: {
    EditableCell
  },
  data() {
    return {
      visible: false,
      modalTitle: "新增進貨",
      list: {},
      tableData: [
        {
          id: 0,
          barCode: "",
          productName: "雞腿",
          unit: "公克",
          totalSalesPrice: 500,
          totalListPrice: 567,
          totalCostPrice: 400,
          amount: 10
        },
        {
          id: 1,
          barCode: "4716852002",
          productName: "貢丸",
          unit: "件",
          totalSalesPrice: 99,
          totalListPrice: 110,
          totalCostPrice: 66,
          amount: 2
        },
        {
          id: 2,
          barCode: "",
          productName: "雞胸",
          unit: "台斤",
          totalSalesPrice: 556,
          totalListPrice: 500,
          totalCostPrice: 420,
          amount: 4
        }
      ],
      innerData: [
        {
          id: 0,
          barCode: "T0001",
          productName: "雞胸",
          unit: "2台斤",
          salesPrice: 79,
          listPrice: 80,
          costPrice: 60,
          amount: 2
        }
      ],
      search: "",
      columns: [
        {
          title: "商品條碼",
          dataIndex: "barCode",
          width: "20%",
          align: "center",
          scopedSlots: { customRender: "barCode" }
        },
        {
          title: "商品名稱",
          dataIndex: "productName",
          width: "25%",
          align: "center",
          scopedSlots: { customRender: "productName" }
        },
        {
          title: "單位量",
          dataIndex: "unit",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "unit" }
        },
        {
          title: "售價",
          dataIndex: "totalSalesPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "totalSalesPrice" }
        },
        {
          title: "建議售價",
          dataIndex: "totalListPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "totalListPrice" }
        },
        {
          title: "成本價",
          dataIndex: "totalCostPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "totalCostPrice" }
        },
        {
          title: "庫存量",
          dataIndex: "amount",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "amount" }
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      innerColumns: [
        {
          dataIndex: "barCode",
          width: "",
          align: "center"
        },
        {
          dataIndex: "productName",
          width: "",
          align: "center"
        },
        {
          dataIndex: "unit",
          width: "",
          align: "center"
        },
        {
          dataIndex: "salesPrice",
          width: "",
          align: "center"
        },
        {
          dataIndex: "listPrice",
          width: "",
          align: "center"
        },
        {
          dataIndex: "costPrice",
          width: "",
          align: "center"
        },
        {
          dataIndex: "amount",
          width: "",
          align: "center"
        },
        {
          dataIndex: "action",
          width: "",
          align: "center"
        }
      ]
    };
  },
  methods: {
    getInventoryList(productName) {
      this.$api.Inventory.getList(productName, 0, 10)
        .then(res => {
          // this.tableData = (res.data).map((item,index)=>{
          //   let obj = {
          //     id:index,
          //     ...item
          //   }
          //   return obj;
          // })
          console.log(res);
          // this.tableData = res.data;
          console.log(this.tableData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    showAddPurchaseView() {
      this.visible = true;
      this.modalTitle = "新增進貨";
    },
    onSearch() {
      this.getInventoryList(this.search);
    },
    onCellChange(id, dataIndex, value) {
      const dataSource = [...this.tableData];
      const target = dataSource.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.tableData = dataSource;
        console.log(this.tableData);
      }
    },
    handleCancel(){
      this.visible = false;
    }
  },
  mounted() {

  }
};
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
.innerTable::v-deep table{
  border: none;
}
/*.innerTable::v-deep thead{*/
/*  display: none !important;*/
/*}*/
/*.inventoryTable::v-deep .ant-table-bordered::v-deep .ant-table-thead > tr > th, .ant-table-bordered::v-deep .ant-table-tbody > tr > td {*/
/*  border-right: none;*/
/*}*/

.inventoryTable::v-deep .ant-table-expanded-row td{
  border-right: none;
  border-left: none;
}
.inventoryTable::v-deep .ant-table-expanded-row{
}
</style>
