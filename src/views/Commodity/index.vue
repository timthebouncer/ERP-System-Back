<template>
  <!--    商品管理-->
  <div class="container">
    <div class="action">
      <CustomPrice ref="Modal" :getCommodity="getCommodity" :tableData="tableData" />
      <div class="search">
        <a-input-search
          v-model="search"
          placeholder="搜尋商品名稱"
          enter-button
          autoFocus
          @search="onSearch"
        />
      </div>
    </div>
    <div class="itemMenu">
      <a-button :style="{backgroundColor: this.isClick === true? '#81D3F8':'white'}" class="busSort-btn" @click="setBusinessSort">
        商用包
      </a-button>
      <a-button :style="{backgroundColor: this.isClick2 === true? '#81D3F8':'white'}" class="retailSort-btn" @click="setRetailSort">
        零售包
      </a-button>
      <a-table
              class="sort-table"
              ref="table"
        :columns="columns"
        :data-source="tableData"
        bordered
        rowKey="id"
        :pagination="false"
      >
        <template
          v-for="col in [
            'barcode',
            'name',
            'unit',
            'listPrice',
            'stockAmount',
            'createDate',
            'price',
            'description'
          ]"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <template v-if="col === 'unit'">
              <div :style="{color: record.using === true? 'black':'#ACB9BF'}">
                {{ computedWeight(undefined, text) }}
              </div>
            </template>
            <template v-else>
              <div :style="{color: record.using === true? 'black':'#ACB9BF'}">
                <span v-show="col === 'barcode'" style="float:left">
                  <a-icon type="menu" />
                </span>
                <span>
                  {{ text }}
                </span>
              </div>
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
            <a-button
              type="link"
              size="small"
              disabled
              @click="editHandler(record)"
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
      </template>
    </a-pagination>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { computedWeight } from '@/unit/dictionary/computed'
import CustomPrice from './SalesPriceSetting'
import formatPrice from "../../components/thousand";

export default {
  name: 'Merchant',
  components: { CustomPrice },
  data() {
    return {
      loading: false,
      visible: false,
      isClick:false,
      isClick2:false,
      track: '',
      search: '',
      categories:'',
      list: {
        name: '',
        unit: 'KG',
        unitType: '',
        barcode: '',
        listPrice: undefined,
        description: '',
        using: true,
        updateTime: ''
      },
      tableData: [],
      changeTitle: '',
      columns: [
        {
          title: '商品條碼',
          dataIndex: 'barcode',
          width: '15%',
          align: 'center',
          scopedSlots: { customRender: 'barcode' }
        },
        {
          title: '商品名稱',
          dataIndex: 'name',
          width: '15%',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '計價單位',
          dataIndex: 'unit',
          width: '6%',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '單價',
          dataIndex: 'price',
          width: '10%',
          align: 'center',
          customRender:(_,row)=>{
            return formatPrice(row.price)
          }
        },
        {
          title: '庫存量',
          dataIndex: 'stockAmount',
          width: '5%',
          align: 'center',
          scopedSlots: { customRender: 'stockAmount' }
        },
        {
          title: '建立時間',
          dataIndex: 'createDate',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'createDate' }
        },
        {
          title: '狀態',
          dataIndex: 'using',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'using' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      pageSizeOptions: ['10', '30', '50', '100'],
      current: 1,
      pageSize: 10,
      total: 30
    }
  },
  computed: {
    computedWeight() {
      return computedWeight
    }
  },
  created() {
    this.categories = 'COMMERCIAL'
    this.getCommodity(this.categories)
    this.isClick = true
  },
  mounted() {
    this.initSortable()
    },
  methods: {
    initSortable () {
      let that = this
      let el = this.$el.querySelector('.sort-table tbody')
      Sortable.create(el, {
        handle: '.ant-table-row',
        animation: 150,
        group: { name: 'name', pull: true, put: true },
        onUpdate: function (evt) {
          let o = evt.oldIndex
          let n = evt.newIndex
          if (o === n) {
            return
          }
          that.sortListAndUpdate(that.tableData, o, n)
        },
      })
    },
    sortList (list, o, n) {
      let newTableData = JSON.parse(JSON.stringify(list))
      let data = newTableData.splice(o, 1, null)
      newTableData.splice(o < n ? n + 1 : n, 0, data[0])
      newTableData.splice(o > n ? o + 1 : o, 1)
      return newTableData
    },
    sortListAndUpdate (list, o, n) {
      let nData = [];
      let newTableData = this.sortList(list, o, n)
      newTableData.forEach((item, index) => {
        item.sort = index + 1
        nData.push({productId: item.id, sortId: index})
      })
      this.$nextTick(() => {
        this.$api.Commodity.sortProduct(nData)
        this.tableData = newTableData
        // that.$refs.table2 && this.$refs.table2.refresh(true)
      })
    },
    getCommodity() {
      this.$api.Commodity.getCommodityList({
        categories:this.categories,
        productName: this.search,
        pageNumber: this.current,
        pageSize: this.pageSize
      })
        .then(res => {
          console.log(res)
          this.total = res.data.totalElements
          this.tableData = res.data.content
        })
        .catch(err => {
          console.log(err)
        })
    },
    editHandler(record) {
      this.$refs.Modal.showModal(record)
    },
    onSearch() {
      this.getCommodity((this.current = 1))
    },
    onShowSizeChange(current, pageSize) {
      this.current = 1
      this.pageSize = pageSize
      this.getCommodity()
    },
    onPageChange(current) {
      console.log(current)
      this.getCommodity()
    },
    onChange(checked, record) {
      if (record.stockAmount === 0) {
        this.$api.Commodity.editStatus({
          productId:record.id,
          status:checked
        }).then(()=>{
          record.using = checked
          this.$message.success('修改狀態成功')
        })
      } else {
        this.$message.error('庫存量大於0')
      }
    },
    setBusinessSort(){
      this.isClick = true
      this.isClick2 = false
      this.categories = 'COMMERCIAL'
      this.getCommodity(this.categories)
    },
    setRetailSort(){
      this.isClick = false
      this.isClick2 = true
      this.categories = 'RETAIL'
      this.getCommodity(this.categories)
    },
    sortProduct(){

    }
  }
}
</script>
<style scoped lang="scss">
.search {
  width: 300px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.modal-body {
  background-color: #f5f5f5;
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
.weight-wrapper {
  display: flex;
}
.busSort-btn{
  color: black;
}
.retailSort-btn{
  color: black;
}
</style>
