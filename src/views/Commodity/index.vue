<template>
  <!--    商品管理-->
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
              <a-form-model-item
                class="custom-form-item"
                label="商品名稱"
                prop="name"
              >
                <a-input v-model="list.name" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-item" label="商品條碼">
                <a-input v-model="list.barCode" placeholder="請輸入" />
              </a-form-model-item>

              <a-select v-model="list.unit" placeholder="請選擇">
                <a-select-option>
                  公斤
                </a-select-option>
              </a-select>

              <a-form-model-item class="custom-form-item" label="售價">
                <a-input v-model="list.prices" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-item" label="建議售價">
                <a-input v-model="list.sprices" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-item" label="成本售價">
                <a-input v-model="list.oprices" placeholder="請輸入" />
              </a-form-model-item>

              <a-form-model-item class="custom-form-item" label="商品描述">
                <a-input v-model="list.desc" placeholder="請輸入" />
              </a-form-model-item>
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
          @click="onSearch"
        />
      </div>
    </div>
    <div class="itemMenu">
      <a-table
        :columns="columns"
        :data-source="filterText"
        bordered
        rowKey="id"
        :pagination="false"
      >
        <template
          v-for="col in [
            'order',
            'barCode',
            'name',
            'unit',
            'prices',
            'sprices',
            'oprices'
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
  name: "Merchant",
  data() {
    return {
      loading: false,
      visible: false,
      track: "",
      search: "",
      list: {
        name: "",
        unit: "",
        barCode: "",
        prices: "",
        oprices: "",
        sprices: "",
        desc: ""
      },
      tableData: [],
      changeTitle: "",
      columns: [
        {
          title: "序",
          dataIndex: "order",
          width: "2%",
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
          dataIndex: "barCode",
          width: "15%",
          align: "center",
          scopedSlots: { customRender: "barCode" }
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
          dataIndex: "prices",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "prices" }
        },
        {
          title: "建議售價",
          dataIndex: "sprices",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "sprices" }
        },
        {
          title: "成本價",
          dataIndex: "oprices",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "oprices" }
        },
        {
          title: "庫存量",
          dataIndex: "quantity",
          width: "5%",
          align: "center",
          scopedSlots: { customRender: "quantity" }
        },
        {
          title: "建立時間",
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
      ],
      pageSizeOptions: ["10", "20", "30"],
      current: 1,
      pageSize: 10,
      total: 30
    };
  },
  created() {
    axios
      .get("http://localhost:3000/lists")
      .then(res => {
        console.log(res.data);
        this.tableData = res.data;
      })
      .catch(err => {
        console.log(err);
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
    showModal() {
      this.visible = true;
      this.changeTitle = "新增商品";
    },
    clearInput() {
      this.list = {
        name: "",
        unit: "",
        barCode: "",
        prices: "",
        oprices: "",
        sprices: "",
        desc: ""
      };
    },
    submitNonstop() {
      if (this.changeTitle === "新增商品") {
        axios
          .post("http://localhost:3000/lists", {
            id: "",
            name: this.list.name,
            unit: this.list.unit,
            barCode: this.list.barCode,
            prices: this.list.prices,
            sprices: this.list.sprices,
            oprices: this.list.oprices,
            desc: this.list.desc
          })
          .then(() => {
            axios.get("http://localhost:3000/lists").then(res => {
              this.tableData = res.data;
            });
          });
        this.visible = true;
      }
    },
    handleOk() {
      this.loading = true;
      if (this.changeTitle === "新增商品") {
        axios
          .post("http://localhost:3000/lists", {
            id: "",
            name: this.list.name,
            unit: this.list.unit,
            barCode: this.list.barCode,
            prices: this.list.prices,
            sprices: this.list.sprices,
            oprices: this.list.oprices,
            desc: this.list.desc
          })
          .then(() => {
            axios.get("http://localhost:3000/lists").then(res => {
              this.tableData = res.data;
            });
          });
        this.visible = false;
        this.loading = false;
      } else {
        axios
          .put("http://localhost:3000/lists/" + this.track, {
            id: this.track,
            name: this.list.name,
            unit: this.list.unit,
            barCode: this.list.barCode,
            prices: this.list.prices,
            sprices: this.list.sprices,
            oprices: this.list.oprices,
            desc: this.list.desc
          })
          .then(() => {
            axios.get("http://localhost:3000/lists").then(res => {
              this.tableData = res.data;
            });
          });
        this.visible = false;
        this.loading = false;
      }
    },
    handleCancel() {
      this.visible = false;
      this.clearInput();
    },
    editHandler(record) {
      this.track = record.id;
      this.changeTitle = "編輯商品";
      axios.get("http://localhost:3000/lists/" + record.id).then(res => {
        this.list = res.data;
        this.visible = true;
      });
    },
    onDelete(id) {
      axios.delete("http://localhost:3000/lists/" + id).then(() => {
        axios.get("http://localhost:3000/lists").then(res => {
          this.tableData = res.data;
        });
      });
    },
    onSearch() {
      if (this.search) {
        axios.get("http://localhost:3000/lists").then(res => {
          this.tableData = res.data;
        });
      }
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
    }
  }
};
</script>

<style scoped lang="scss">
.search {
  width: 300px;
}

.modal-body {
  background-color: #eee3e3;
}

.allPart {
  margin: 25px;
}

.firstPart {
  display: flex;
  justify-content: space-between;
}

.secondPart {
  margin: 25px 0px;
  display: flex;
  justify-content: space-between;
}

.thirdPart {
  display: flex;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
