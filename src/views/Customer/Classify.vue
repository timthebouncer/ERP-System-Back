<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <a-button class="button1" @click="showModal">新增+</a-button>
      </div>
      <a-modal v-model="visible" width="500px" title="新增類別">
        <div class="class-input">
          <a-input addonBefore="類別名稱" placeholder="請輸入" />
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

      <div class="search-wrapper">
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
        :data-source="tableData"
        bordered
        :pagination="false"
      >
        <template
          v-for="col in [
            'order',
            'className',
            'customerTotal',
            'createdTime',
            'operation'
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
          <a-popconfirm
            title="確定要刪除嗎?"
            @confirm="() => onDelete(record.id)"
          >
            <a-button size="small">刪除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Classify",
  data() {
    return {
      loading: false,
      visible: false,
      tableData: [],
      columns: [
        {
          title: " ",
          dataIndex: "order",
          width: "2%",
          align: "center",
          scopedSlots: { customRender: "order" }
        },
        {
          title: "類別名稱",
          dataIndex: "className",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "className" }
        },
        {
          title: "客戶數量",
          dataIndex: "customerTotal",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "customerTotal" }
        },
        {
          title: "最後更新時間",
          dataIndex: "createdTime",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "createdTime" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ]
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {},
    handleCancel() {
      this.visible = false;
    },
    onSearch() {},
    editHandler() {},
    onDelete() {}
  }
};
</script>

<style scoped lang="scss">

</style>
