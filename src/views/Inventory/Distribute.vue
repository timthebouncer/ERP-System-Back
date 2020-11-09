<template>
  <div class="container">
    <div class="distribute-action">
      <div class="calendar">
        <a-date-picker @change="onChange" />
        <a-range-picker @change="onChange" />
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
            'date',
            'orderNo',
            'clientName',
            'productAmount',
            'totalPrice',
            'remark',
            'operation'
          ]"
          :slot="col"
          slot-scope="text"
        >
          <div :key="col">
            <template v-if="col === 'orderNo'">
              <a-popover placement="bottom" trigger="click">
                <template slot="content">
                  <div>
                    <template>
                      <div
                        class="detail-menu"
                        v-for="item in tableData"
                        :key="item.id"
                      >
                        <span> 銷貨日期: {{ item.salesDay }} </span>
                        <span> 銷貨單號: {{ item.orderNo }} </span>
                        <span> 客戶姓名: {{ item.clientName }} </span>
                      </div>
                    </template>
                    <a-table
                      :columns="columns2"
                      :data-source="orderList"
                      bordered
                      rowKey="id"
                      :pagination="false"
                    >
                      <template
                        v-for="col in [
                          'order',
                          'productName',
                          'unit',
                          'salesPrice',
                          'amount'
                        ]"
                        :slot="col"
                        slot-scope="text, record, index"
                      >
                        <div :key="col">
                          <template v-if="col === 'order'">
                            {{ index + 1 }}
                          </template>
                          <template v-else>
                            {{ text }}
                          </template>
                        </div>
                      </template>
                    </a-table>
                    <template>
                      <span> 總數:{{ Calculate.count }} </span>
                      <span> 總金額:{{ Calculate.total }} </span>
                    </template>
                  </div>
                </template>
                <a-button type="link">{{ text }}</a-button>
              </a-popover>
            </template>
            <template v-else>
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
        v-model="pageNumber"
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
import axios from "axios";
import moment from 'moment'
export default {
  data() {
    const date = moment().format("YYYY/MM/DD")
    return {
      tableData: [],
      orderList: [],
      Calculate: {},
      columns: [
        {
          title: "日期",
          dataIndex: "date",
          align: "center",
          scopedSlots: { customRender: "date" }
        },
        {
          title: "單號",
          dataIndex: "orderNo",
          align: "center",
          scopedSlots: { customRender: "orderNo" }
        },
        {
          title: "客戶",
          dataIndex: "clientName",
          align: "center",
          scopedSlots: { customRender: "clientName" }
        },
        {
          title: "商品數量",
          dataIndex: "productAmount",
          align: "center",
          scopedSlots: { customRender: "productAmount" }
        },
        {
          title: "金額",
          dataIndex: "totalPrice",
          align: "center",
          scopedSlots: { customRender: "totalPrice" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          align: "center",
          scopedSlots: { customRender: "operation" }
        },
        {
          title: "備註",
          dataIndex: "remark",
          align: "center",
          scopedSlots: { customRender: "remark" }
        }
      ],
      columns2: [
        {
          title: "#",
          dataIndex: "order",
          align: "center",
          scopedSlots: { customRender: "order" }
        },
        {
          title: "商品名稱",
          dataIndex: "productName",
          align: "center",
          scopedSlots: { customRender: "productName" }
        },
        {
          title: "單位量",
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
          title: "數量",
          dataIndex: "amount",
          align: "center",
          scopedSlots: { customRender: "amount" }
        }
      ],
      search: "",
      pageSizeOptions: ["10", "20", "30"],
      pageNumber: 1,
      pageSize: 10,
      total: 30,
      startDate:date,
      endDate:date
    };
  },
  created() {
    this.distributeList();
    axios
      .get(
        "/erp/deliveryOrder/getDetail?orderId=402828337596ee6e017596ef27a00001"
      )
      .then(res => {
        this.orderList = res.data.orderDetailItemResponseList;
        let count = 0;
        let total = 0;
        this.orderList.forEach(item => {
          count += item.amount;
          total += item.salesPrice;
        });
        this.Calculate = { count, total };
      });
  },
  methods: {
    onChange(date, dateString) {
      this.startDate = dateString[0],
      this.endDate = dateString[1]
    },
    distributeList(){
      this.$api.Distribute.getDistributeList({
      starDate:this.startDate,
      endDate:this.endDate,
      pageNumber:this.pageNumber,
      pageSize:this.pageSize,})
      .then(res => {
          console.log(res);
          this.tableData = res.data.content;
        });
    },
    cancelHandler() {
      axios.delete("/erp/deliveryOrder/deleteOrder").then(res => {
        console.log(res);
      });
    },
    onShowSizeChange(pageNumber, pageSize) {
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
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.ant-calendar-picker {
  padding: 5px;
}
.detail-menu {
  display: flex;
  flex-direction: column;
}
</style>
