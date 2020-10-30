<template>
  <div class="container">
    <div class="action">
      <div class="buttons">
        <a-button class="reviewButton">刷新</a-button>
        <a-button class="addButton1" @click="showAddPurchaseView">進貨+</a-button>
        <a-button class="addButton2">銷貨+</a-button>
      </div>
      <div class="addPurchaseView">
        <a-modal v-model="visible" width="500px" :title="modalTitle">

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
      <a-table
        :columns="columns"
        bordered
        :data-source="tableData"
        rowKey="id"
      >
        <template slot="amount" slot-scope="text, record">
          <editable-cell :text="text+''" :id="record.id" @change="onCellChange(record.id, 'amount', $event)" />
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
      modalTitle:"",
      list:{},
      tableData:[{id:0,amount:1},{id:1,amount: 22}],
      search:"",
      columns: [
        {
          title: "",
          dataIndex: "detail",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "detail" }
        },
        {
          title: "商品條碼",
          dataIndex: "barCode",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "barCode" }
        },
        {
          title: "商品名稱",
          dataIndex: "productName",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "productName" }
        },
        {
          title: "單位量",
          dataIndex: "unit",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "unit" }
        },
        {
          title: "售價",
          dataIndex: "totalSalesPrice",
          width: "5%",
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
        },
      ],
    }
  },
  methods: {
    getInventoryList(productName) {
      this.$api.Inventory.getList(productName,0,10)
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
        }).catch(err=>{
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
    }
  }
}
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
</style>