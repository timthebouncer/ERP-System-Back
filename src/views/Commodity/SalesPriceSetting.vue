<template>
  <div>
    <div>
      出貨單價設定
      <a-button
          type="primary"
          size="small"
          class="editable-add-btn"
          @click="handleAdd"
      >
        <a-icon type="plus" />
      </a-button>
      <template>
        <a-table
            class="discountTable"
            bordered
            :data-source="discountTable"
            :columns="columns"
            :rowKey="record => record.id"


        :pagination="{
                          newCurrent,
                          pageSizeOptions,
                          newPageSize
                        }"


            @change="discountTableChange"
        >
        </a-table>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name:'CustomPrice',
  data(){
    return{
      discountTable:[],
      columns: [
        {
          title: '客戶類別',
          dataIndex: '',
          align: 'center',
          // customRender:
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '客戶名稱',
          dataIndex: '',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '出貨單價',
          dataIndex: 'discountPrice',
          align: 'center',
          width: 100,
          // customRender: (val, row) => {
          //   return this.priceAndRemarkEditor(val, row, 'discountPrice')
          // },
          scopedSlots: { customRender: 'discountPrice' }
        },
        {
          title: '備註',
          dataIndex: 'remark',
          align: 'center',
          width: 200,
          // customRender: (val, row) => {
          //   return this.priceAndRemarkEditor(val, row, 'remark')
          // },
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          // width: "2%",
          align: 'center',
          customRender: (value, row, index) => ({
            children: (
                <div>
                  {this.discountTable.length ? (
                      <div>
                        <a-popconfirm
                            title="確定要刪除嗎?"
                            onConfirm={() =>
                                this.deleteDiscount(
                                    row,
                                    // (index = (this.current - 1) * this.pageSize + index)
                                )
                            }
                        >
                          <a>刪除</a>
                        </a-popconfirm>
                      </div>
                  ) : (
                      <span>{row}</span>
                  )}
                </div>
            )
          }),
          scopedSlots: { customRender: 'operation' }
        }
      ],
    }
  },
  methods:{
    handleAdd() {
      const { discountTable } = this
      const newData = {
        // productId: undefined,
        // name: '',
        // unit: '',
        // salesPrice: null,
        // discountPrice: undefined,
        // remark: '',
        // isEditDiscountPrice: true,
        // isEditRemark: true
      }
      this.discountTable = [...discountTable, newData]
    },
    discountTableChange(){

    }
  }
}
</script>
