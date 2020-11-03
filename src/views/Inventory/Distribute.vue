<template>
  <div class="container">
    <div class="distribute-action">
      <div class="calendar">
        <a-date-picker>
          <template slot="dateRender" slot-scope="current, today">
            <div
              class="ant-calendar-date"
              :style="getCurrentStyle(current, today)"
            >
              {{ current.date() }}
            </div>
          </template>
        </a-date-picker>
        <a-range-picker>
          <template slot="dateRender" slot-scope="current">
            <div class="ant-calendar-date" :style="getCurrentStyle(current)">
              {{ current.date() }}
            </div>
          </template>
        </a-range-picker>
      </div>
      <div class="search-wrapper">
        <div class="search-input">
          <a-input-search
            v-model="search"
            placeholder="搜尋內容"
            enter-button
          />
        </div>
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
        <template slot="operation" slot-scope="text, record">
          <a-space>
            <a-button type="link" size="small" @click="cancelHandler(record)"
              >取消訂單</a-button
            >
          </a-space>
        </template>
      </a-table>
    </div>
    <div class="pagination">
      <a-pagination
        class="pagination"
        v-model="current"
        :page-size-options="pageSizeOptions"
        :total="total"
        show-size-changer
        :page-size="pageSize"
        @showSizeChange="onShowSizeChange"
      >
      </a-pagination>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
export default {
  data() {
    return {
      tableData:[],
      columns: [
        {
          title: "日期",
          dataIndex: "date",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "date" }
        },
        {
          title: "單號",
          dataIndex: "",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "" }
        },
        {
          title: "客戶",
          dataIndex: "",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "" }
        },
        {
          title: "商品",
          dataIndex: "",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "" }
        },
        {
          title: "金額",
          dataIndex: "",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "operation" }
        },
        {
          title: "備註",
          dataIndex: "reference",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "reference" }
        }
      ],
      search: "",
      pageSizeOptions: ["10", "20", "30"],
      current: 1,
      pageSize: 10,
      total: 30
    };
  },
  created() {
    axios.get('/erp/deliveryOrder/orderList')
    .then((res)=>{
      this.tableData = res.data
    })
  },
  methods: {
    getCurrentStyle(current) {
      const style = {};
      if (current.date() === 1) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },
    cancelHandler() {},
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  padding: 20px;
  position: relative;
}
.distribute-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 30px;
}
.distribute-action .calendar {
  margin-right: 10px;
}
.pagination{
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.ant-calendar-picker {
padding: 5px;
}
</style>
