<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
      </div>
      <div class="search-wrapper">
        <a-select default-value="3" style="width: 100px;">
          <a-select-option value="1">今天</a-select-option>
          <a-select-option value="2">本週</a-select-option>
          <a-select-option value="3">本月</a-select-option>
          <a-select-option value="4">上個月</a-select-option>
          <a-select-option value="all">全部</a-select-option>
        </a-select>
        <a-range-picker :default-value="[moment('2020/11/01', dateFormat), moment('2020/11/30', dateFormat)]" :format="dateFormat"/>
        <span>異動方式</span>
        <a-select default-value="all" style="width: 100px;">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="1">進貨</a-select-option>
          <a-select-option value="2">銷貨</a-select-option>
          <a-select-option value="3">編輯</a-select-option>
          <a-select-option value="4">刪除</a-select-option>
          <a-select-option value="5">取消訂單</a-select-option>
        </a-select>
        <div class="searchInput">
          <a-input-search
            v-model="search"
            placeholder="搜尋商品"
            enter-button
            @search="onSearch"
          />
        </div>
      </div>
    </div>
    <div class="itemMenu">
      <a-table class="inventoryLogTable" :columns="columns" bordered :data-source="tableData" rowKey="id" >
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
  import moment from 'moment'
export default {
  name: "InventoryLog",
  data(){
    return{
      columns: [
        {
          title: "日期",
          dataIndex: "barCode",
          width: "20%",
          align: "center",
          scopedSlots: { customRender: "barCode" }
        },
        {
          title: "異動方式",
          dataIndex: "productName",
          width: "25%",
          align: "center",
          scopedSlots: { customRender: "productName" }
        },
        {
          title: "商品名稱",
          dataIndex: "unit",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "unit" }
        },
        {
          title: "數量",
          dataIndex: "totalSalesPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "totalSalesPrice" }
        },
        {
          title: "備註",
          dataIndex: "totalListPrice",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "totalListPrice" }
        }
      ],
      pageSizeOptions: ["10", "20", "30"],
      current: 1,
      pageSize: 10,
      total: 30,
      dateFormat: 'YYYY/MM/DD',
    }
  },
  methods:{
    moment
  }
};
</script>

<style scoped lang="scss">
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
