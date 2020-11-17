<template>
  <div class="container">
    <div class="action">
      <div class="action-add">
        <a-button class="button1" @click="showModal">新增<a-icon type="plus" /></a-button>
      </div>
      <a-modal v-model="visible" width="500px" :title="changeTitle" @cancel="clearInput">
        <div class="class-input">
          <label>類別名稱:</label>
          <a-input
            v-model="list.className"
            label="類別名稱"
            placeholder="請輸入"
          />
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
            'className',
            'clientCount',
            'updateDate',
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
          <a-space>
            <a-button type="link" size="small" @click="editHandler(record)"
              >編輯</a-button
            >
            <a-popconfirm
              title="確定要刪除嗎?"
              @confirm="() => onDelete(record.id)"
            >
              <a-button type="link" size="small">刪除</a-button>
            </a-popconfirm>
          </a-space>
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
      search: "",
      track: "",
      tableData: [],
      changeTitle: "",
      list: { id: "", className: "" },
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
          dataIndex: "clientCount",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "clientCount" }
        },
        {
          title: "最後更新時間",
          dataIndex: "updateDate",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "updateDate" }
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
  created() {
    this.getClassifyList();
  },
  computed:{
    filterText(){
      if(!this.search){
        return this.tableData
      }else {
        return this.tableData.filter(item => item.className.includes(this.search))
      }
    }
  },
  methods: {
    showModal() {
      this.changeTitle = "新增類別";
      this.visible = true;
    },
    clearInput(){
      this.list.className = ""
    },
    handleOk() {
      if (this.changeTitle === "新增類別") {
        this.$api.Classify.addClass({ name: this.list.className })
          .then(() => {
            this.getClassifyList();
            this.$message.info('新增類別成功');
          });
        this.visible = false;
      } else {
        this.$api.Classify.updateClass({
          classId: this.track,
          className: this.list.className
        })
          .then(() => {
            this.getClassifyList();
            this.$message.info('修改類別成功');
          });
        this.visible = false;
      }
    },
    handleCancel() {
      this.visible = false;
    },
    editHandler(record) {
      this.track = record.id;
      this.changeTitle = "編輯類別";
      if (record !== "") {
        this.list.className = record.className;
        this.visible = true;
      }
    },
    onDelete(id) {
      this.$api.Classify.deleteClass(id)
       .then(() => {
        this.getClassifyList();
        this.$message.info('刪除類別成功');
      });
    },
    getClassifyList() {
      this.$api.Customer.getClass().then(res => {
        this.tableData = res.data;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.class-input {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50px;
  width: 350px;
}
.class-input > label{
  width: 80px
}
.class-input > input {
  margin-left: 5px;
}
</style>
