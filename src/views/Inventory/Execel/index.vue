<template>
  <div>
    <div class="print-button-wrapper">
      <button @click="showModal1" class="print-btn">商用格式-有價格</button>
      <button @click="showModal2" class="print-btn">商用格式-無價格</button>
      <button @click="showModal3" class="print-btn">零售格式-有價格</button>
      <inventoryExcel :receiverList="receiverList" :orderDetail="orderDetail" :distirbuteHandler="this.distirbuteHandler" :orderTitle="this.orderTitle" />
    </div>
    <div :title="templateType" id="exampleWrapper" v-if="visible">
      <div class="table-content">
        <div class="top-wrapper">
          <div>
            <span class="Brand-logo"><img src="@/assets/brand_logo.jpg"/></span>
          </div>
          <div class="title">
            <h1>出貨單</h1>
          </div>
          <div v-show="templateType === '零售-有價格'" class="logo2">
            <h1 class="black-cat-logo">
              {{
                orderDetail.shipment === 1
                  ? '親送'
                  : orderDetail.shipment === 2
                  ? '黑貓宅配'
                  : orderDetail.shipment === 3
                  ? '自取'
                  : ''
              }}
            </h1>
          </div>
        </div>
        <div class="detail-wrapper">
          <div class="detail-list">
            <span
              >客戶名稱:<span style="border-bottom: 1px dotted">{{
                orderDetail.clientName
              }}</span></span
            >
            <span
              >客戶類別:<span style="border-bottom: 1px dotted">{{
                orderDetail.className
              }}</span></span
            >
            <span
              >收件地址:<span style="border-bottom: 1px dotted"
                >{{ orderDetail.receivePostCode
                }}{{ orderDetail.receiveAddress }}</span
              ></span
            >
            <span
              >客戶電話:<span style="border-bottom: 1px dotted">{{
                orderDetail.phoneNumber
              }}</span></span
            >
            <span
              >統一編號:<span style="border-bottom: 1px dotted">{{
                orderDetail.vatNumber
              }}</span></span
            >
            <span v-show="templateType !== '零售-有價格'"
              >出貨方式:<span style="border-bottom: 1px dotted">{{
                orderDetail.shipment === 1
                  ? '親送'
                  : orderDetail.shipment === 2
                  ? '黑貓宅配'
                  : orderDetail.shipment === 3
                  ? '自取'
                  : ''
              }}</span></span
            >
            <span v-show="templateType === '零售-有價格'">
              付款方式:
              <span style="border-bottom: 1px dotted">{{
                orderDetail.payment === 1
                  ? '貨到付款'
                  : orderDetail.payment === 2
                  ? '匯款'
                  : orderDetail.payment === 3
                  ? '現金'
                  : ''
              }}</span>
            </span>
            <span>備註:{{ orderDetail.remark }}</span>
          </div>
          <div class="barcode-wrapper">
            <span>出貨日期:{{ orderDetail.salesDay }}</span>
            <div class="paper-content-detail-order">
              <span>出貨單號:</span>
              <div class="other3-order-barcode">
                <svg
                  id="ean-13"
                  :jsbarcode-format="skus.format"
                  :jsbarcode-value="orderDetail.orderNo"
                  jsbarcode-textmargin="0"
                  jsbarcode-fontoptions="bold"
                ></svg>
              </div>
            </div>
            <div
              class="paper-content-detail-order"
              v-show="orderDetail.trackingNo"
            >
              <span>物流編號:</span>
              <div class="other3-package-barcode">
                <svg
                  id="trackNo"
                  :jsbarcode-format="skus2.format"
                  :jsbarcode-value="orderDetail.trackingNo"
                  jsbarcode-textmargin="0"
                  jsbarcode-fontoptions="bold"
                ></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="content-wrapper">
          <a-table
            :columns="columnList"
            :data-source="orderData"
            :pagination="false"
            style="text-align: center"
          >
          </a-table>
        </div>
        <div class="footer">
          <div class="contact-wrapper" v-if="templateType !== '零售-有價格'">
            <span>總計 {{ Calculate.count }}</span>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>業務聯絡人 : 0935-734982</span>
            <span>帳務聯絡人 : 0952-582050</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div v-else class="contact-wrapper">
            <span>總計 {{ Calculate.count }}</span>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>聯絡電話: 03-4760311</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div class="sign-wrapper">
            <div v-if="templateType === '商用-有價格'">
              <span>合計 {{ Calculate.totalPrice }}</span>
            </div>
            <div v-else></div>
            <div v-if="templateType !== '零售-有價格'" class="sign-block">
              <span>客戶簽收</span>
            </div>
            <div v-else></div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: none" class="print-modal"></div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode'
import inventoryExcel from './package'
import * as htmlToImage from 'html-to-image'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
export default {
  name: 'ModalExample',
  components: { inventoryExcel },
  props: [
    'distirbuteHandler',
    'orderData',
    'orderDetail',
    'orderTitle',
    'list',
    'receiverList',
    'Calculate',
    'parentHandleCancel'
  ],
  data() {
    return {
      printable: true,
      skus: { format: 'auto', title: '' },
      skus2: { format: 'auto', title: '' },
      show: false,
      templateType: '',
      visible: true,
      column: {
        type: {
          title: () => <h2>商品名稱</h2>,
          dataIndex: 'name',
          scopedSlots: {
            customRender: 'name'
          },
          customRender: (val, row) => {
            return <h3>{row.productName}</h3>
          }
        },
        type2: {
          title: () => <h2>數量</h2>,
          dataIndex: 'amount',
          customRender: (val, row) => {
            return <h3>{(row.unit !== "件" && row.unit !== "包") ? row.weight:row.amount}</h3>
          }
        },
        type3: {
          title: () => <h2>單位</h2>,
          dataIndex: 'unit',
          customRender: (val, row) => {
            return <h3>{row.unit}</h3>
          }
        },
        type4: {
          title: () => <h2>建議售價</h2>,
          dataIndex: 'salesPrice',
          customRender: (val, row) => {
            return <h3>{row.price * row.amount}</h3>
          }
        },
        type5: {
          title: () => <h2>出貨售價</h2>,
          dataIndex: 'sellsPrice',
          customRender: (val, row) => {
            return <h3>{row.clientPrice * row.amount}</h3>
          }
        },
        type6: {
          title: () => <h2>折讓</h2>,
          dataIndex: 'discount',
          customRender: (val, row) => {
            return <h3>{row.discount}</h3>
          }
        },
        type7: {
          title: () => <h2>總計</h2>,
          dataIndex: 'orderPrice',
          customRender: (val, row) => {
            return <h3>{row.orderPrice}</h3>
          }
        },
        type8: {
          title: () => <h2>備註</h2>,
          dataIndex: 'reference',
          customRender: (val, row) => {
            return <h3>{row.remark}</h3>
          }
        }
      },
      tableData: [],
      columnList: []
    }
  },
  created() {
    this.www()
  },
  methods: {
    www() {
      const { tableData } = this
      const newData = {
        name: '',
        unit: '-',
        productId: undefined,
        Price: 0,
        salesPrice: 0,
        amount: 1,
        discount: 0,
        reference: '',
        orderPrice: 0
      }
      this.tableData = [...tableData, newData]
    },
    async showModal1() {
      if (this.orderTitle !== '訂單詳情') {
        this.templateType = '商用-有價格'
        await this.$emit('passTemplateType', this.templateType)
        await this.distirbuteHandler()
        this.visible = true
        this.columnList = await this.getColumn([
          'type',
          'type2',
          'type3',
          'type4',
          'type5',
          'type6',
          'type7',
          'type8'
        ])

        JsBarcode('#ean-13').init()
        JsBarcode('#trackNo').init()

        let _this = this
        setTimeout(function() {
          _this.handleOk()
        }, 1000)
      } else {
        this.templateType = '商用-有價格'
        this.visible = true
        this.columnList = await this.getColumn([
          'type',
          'type2',
          'type3',
          'type4',
          'type5',
          'type6',
          'type7',
          'type8'
        ])
        JsBarcode('#ean-13').init()
        JsBarcode('#trackNo').init()
        let _this = this
        setTimeout(function() {
          _this.handleOk()
        }, 500)
        setTimeout(function() {
          _this.parentHandleCancel()
        }, 1000)
      }
    },
    async showModal2() {
      if (this.orderTitle !== '訂單詳情') {
        this.templateType = '商用-無價格'
        await this.$emit('passTemplateType', this.templateType)
        await this.distirbuteHandler()
        this.visible = true
        this.columnList = await this.getColumn([
          'type',
          'type2',
          'type3',
          'type8'
        ])

        JsBarcode('#ean-13').init()
        JsBarcode('#trackNo').init()

        let _this = this
        setTimeout(function() {
          _this.handleOk()
        }, 1000)
      }else {
        this.templateType = '商用-無價格'
        this.visible = true
        this.columnList = await this.getColumn([
          'type',
          'type2',
          'type3',
          'type8'
        ])

        JsBarcode('#ean-13').init()
        JsBarcode('#trackNo').init()

        let _this = this
        setTimeout(function() {
          _this.handleOk()
        }, 500)
        setTimeout(function() {
          _this.parentHandleCancel()
        }, 1000)
      }
    },
    async showModal3() {
      if (this.orderTitle !== '訂單詳情') {
        this.templateType = '零售-有價格'
        this.$emit('passTemplateType', this.templateType)
        await this.distirbuteHandler()
        this.visible = true
        this.columnList = await this.getColumn([
          'type',
          'type2',
          'type3',
          'type4',
          'type5',
          'type6',
          'type7',
          'type8'
        ])
        JsBarcode('#ean-13').init()
        JsBarcode('#trackNo').init()

        let _this = this
        setTimeout(function() {
          _this.handleOk()
        }, 1000)
      }else {
        this.templateType = '零售-有價格'
        this.visible = true
        this.columnList = await this.getColumn([
          'type',
          'type2',
          'type3',
          'type4',
          'type5',
          'type6',
          'type7',
          'type8'
        ])
        JsBarcode('#ean-13').init()
        JsBarcode('#trackNo').init()

        let _this = this
        setTimeout(function() {
          _this.handleOk()
        }, 500)
        setTimeout(function() {
          _this.parentHandleCancel()
        }, 1000)
      }
    },
    async handleOk() {
      if (this.templateType !== '貼箱標籤') {
        const dataUrl = await htmlToImage.toPng(
          document.querySelector('.table-content')
        )

        let img = new Image()
        img.src = dataUrl


        let printPage = document.body.appendChild(img)
        printPage.classList.add('printImage')

        let myWindow = await window.open('', '', 'width=2000,height=1000')
        myWindow.document.write(printPage.outerHTML)

        myWindow.document.close()
        myWindow.focus()
        myWindow.print()
        myWindow.close()

        this.visible = false
        this.handleCancel()
      } else {
        // const dataUrl = await htmlToImage.toPng(
        //   document.querySelector('.package-sticker')
        // )
        //
        // let img = new Image()
        // img.src = dataUrl
        //
        // let printPage = document.body.appendChild(img)
        // printPage.classList.add('printImage')
        //
        // let myWindow = await window.open('', '', 'width=2000,height=1000')
        // myWindow.document.write(printPage.outerHTML)
        //
        // myWindow.document.close()
        // myWindow.focus()
        // myWindow.print()
        // myWindow.close()
        //
        // this.printable = false
        // this.handleCancel()
      }
    },
    handleCancel() {
      let printPage = document.querySelector('.printImage')
      printPage.parentNode.removeChild(printPage)
    },
    getColumn(columns) {
      return columns === null
        ? Object.values(this.column)
        : columns.map(e => this.column[e])

      // var a = {
      //   id: {type:'id'},
      //   name: {type:'name'},
      //   type: {type:'type'},
      // }
      //
      // function getColumn(columns) {
      //   return columns == null ? Object.values(a) : columns.map(e => a[e])
      // }
      //
      // console.log(getColumn(['id', 'name', 'type']))
    }
    /*addColumns(){
      this.columns.splice(3,3,
              {
                title: '建議售價',
                dataIndex: 'salesPrice',
              },
              {
                title: '出貨售價',
                dataIndex: 'sellsPrice',
                scopedSlots: { customRender: 'sellsPrice' }
              },
              {
                title: '折讓',
                dataIndex: 'discount',
                scopedSlots: { customRender: 'discount' }
              },
              {
                title: '總計',
                dataIndex: 'totalPrice',
                scopedSlots: { customRender: 'totalPrice' }
              },
              {
                title: '備註',
                dataIndex: 'reference',
                scopedSlots: { customRender: 'reference' }
              })
    }*/
  }
}
</script>
<style scoped lang="scss">
.print-button-wrapper {
  display: flex;
  justify-content: space-evenly;
}
.print-btn {
  background-color: #fba129;
  color: #fcfcfc;
  font-size: large;
  border: unset;
  cursor: pointer;
}
.top-wrapper {
  flex: 1;
  display: flex;
  width: 100%;
  /*justify-content: space-between;*/
  align-items: center;
  height: 120px;
  .black-cat-logo {
    border: 2px solid;
  }
  .title {
    position: relative;
    right: -30%;
  }
  .logo2 {
    position: relative;
    right: -65%;
  }
}
img {
  width: 150px;
  position: relative;
  left: 0;
  top: 0;
}
#exampleWrapper {
  opacity: 0;
}
.table-content {
  padding: 0px 60px 0 10px;
}
.detail-wrapper {
  display: flex;
  justify-content: space-between;

  .detail-list {
    display: flex;
    flex-direction: column;
    position: relative;
    line-height: 30px;
    left: 0;
    span {
      font-size: 20px;
    }
  }
  .barcode-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    right: 30px;
    span {
      font-size: 20px;
    }
  }
}
.other3-order-barcode {
  svg {
    width: 200px;
  }
}
.content-wrapper {
  position: relative;
  top: 20px;
  margin-bottom: 20px;
}
.footer {
  margin-top: 80px;
  h2 {
    margin-bottom: 50px;
  }
  display: flex;
  justify-content: space-between;
  .contact-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    left: 0;
    span:nth-child(1) {
      font-size: 20px;
      margin-bottom: 20px;
    }
    span {
      font-size: 17px;
    }
  }
  .sign-wrapper {
    position: relative;
    right: 30px;
    span:nth-child(1) {
      font-size: 20px;
    }
    span {
      font-size: 17px;
    }
  }
  .sign-block {
    background-color: #f4f4f4;
    width: 230px;
    height: 50px;
    line-height: 3;
    margin-top: 70px;
    padding: 0 0 0 12px;
  }
}
.button-wrapper {
  margin-left: auto;
  margin-top: 30px;
  width: 150px;
}
::v-deep .ant-modal-header {
  display: none;
}
::v-deep .ant-modal-header {
  display: none;
}
.package-wrapper {
  width: 520px;
  height: 510px;
  margin: 0 auto;
  position: relative;
  opacity: 0;
}
.package-sticker {
  h3 {
    color: #d7d7d7;
  }
}
.package-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.package-content {
  padding: 2px 0 0 30px;
  height: 100%;
}
.package-content-detail {
  margin-bottom: 10px;
}
.paper-content-detail-order {
  display: flex;
  margin: -25px 0 -25px 0;
  align-items: center;
}
.package-content-detail-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .order-barcode {
  }
}
.package-content-detail-package {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .package-barcode {
  }
}
.other3-package-barcode {
  svg {
    width: 200px;
  }
}
svg {
  width: 255px;
  align-self: flex-end;
}
</style>
