<template>
  <div>
    <div class="print-button-wrapper">
      <button @click="showModal1" class="print-btn">商用格式-有價格</button>
      <button @click="showModal2" class="print-btn">商用格式-無價格</button>
      <button @click="showModal3" class="print-btn">零售格式-有價格</button>
      <button @click="showModal4" class="print-btn">貼箱標籤</button>
    </div>
    <a-modal
      :title="templateType"
      id="exampleWrapper"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :footer="null"
      width="830px"
    >
      <div class="table-content">
        <div class="top-wrapper">
          <div>
            <span class="Brand-logo"><img src="@/assets/01PL628.jpg"/></span>
          </div>
          <div class="title">
            <h1>出貨單</h1>
          </div>
          <div v-if="templateType === '商用-無價格'" class="logo2">
            <h1 class="black-cat-logo">黑貓宅配</h1>
          </div>
          <div v-else></div>
        </div>
        <div class="detail-wrapper">
          <div class="detail-list">
            <span>客戶名稱:{{orderDetail.clientName}}</span>
            <span>客戶類別:{{orderDetail.className}}</span>
            <span>收件地址:{{orderDetail.receivePostCode}}{{orderDetail.receiveAddress}}</span>
            <span>客戶電話:{{orderDetail.phoneNumber}}</span>
            <span>統一編號:{{orderDetail.vatNumber}}</span>
            <span>出貨方式:{{orderDetail.shipment}}</span>
            <span>備註:{{orderDetail.remark}}</span>
          </div>
          <div class="barcode-wrapper">
            <span>出貨日期:{{orderDetail.salesDay}}</span>
            <span>出貨單號:{{orderDetail.orderNo}}</span>
            <span>物流編號:{{orderDetail.trackingNo}}</span>
          </div>
        </div>
        <div class="content-wrapper">
          <a-table
            :columns="columnList"
            :data-source="orderData"
            :pagination="false"
          >
          </a-table>
        </div>
        <div class="footer">
          <div class="contact-wrapper">
            <h2>總計</h2>
            <span>藤舍牧業(何藤畜牧場) 農場牧登字第一一七四三三號</span>
            <span>業務聯絡人</span>
            <span>帳務聯絡人</span>
            <span>匯款帳號: 中國信託-新竹分行 822-554540329807</span>
            <span>戶名: 張何男</span>
          </div>
          <div class="sign-wrapper">
            <div v-if="templateType === '商用-有價格'">
              <h2>合計</h2>
            </div>
            <div v-else></div>
            <div v-if="templateType !== '商用-無價格'" class="sign-block">
              客戶簽收
            </div>
            <div v-else></div>
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <a-button style="margin-right: 8px" type="primary" @click="handleOk"
          >確定</a-button
        >
        <a-button type="primary" @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
    <a-modal
      :title="templateType"
      :visible="show"
      width="500px"
      :footer="null"
      class="package-wrapper"
    >
      <div class="package-sticker">
        <div class="package-top">
          <div class="Brand-logo">
            <span><img src="@/assets/01PL628.jpg"/></span>
          </div>
          <div>
            <span>出貨日期</span>
          </div>
        </div>
        <div class="package-content">
          <div class="package-content-detail">收件客戶</div>
          <div class="package-content-detail-order">
            出貨單號
            <div class="order-barcode"></div>
          </div>
          <div class="package-content-detail-package">
            物流編號
            <div class="package-barcode"></div>
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <a-button style="margin-right: 8px" type="primary" @click="handleOk"
          >確定</a-button
        >
        <a-button type="primary" @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
    <div style="display: none" class="print-modal"></div>
  </div>
</template>
<script>
import * as htmlToImage from 'html-to-image'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
export default {
  name: 'ModalExample',
  props:['distirbuteHandler','orderData', 'orderDetail'],
  data() {
    return {
      show: false,
      templateType: '',
      visible: false,
      column: {
        type: {
          title: '商品名稱',
          dataIndex: 'name',
          scopedSlots: {
            customRender: 'name'
          },
          customRender:(val, row)=>{
            return <div>{row.productName}</div>
          }
        },
        type2: {
          title: '數量',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        type3: {
          title: '單位',
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' }
        },
        type4: {
          title: '建議售價',
          dataIndex: 'salesPrice',
          customRender:(val, row)=>{
            return <div>{row.price}</div>
          }
        },
        type5: {
          title: '出貨售價',
          dataIndex: 'sellsPrice',
          customRender:(val, row)=>{
            return <div>{row.clientPrice}</div>
          }
        },
        type6: {
          title: '折讓',
          dataIndex: 'discount',
          scopedSlots: { customRender: 'discount' }
        },
        type7: {
          title: '總計',
          dataIndex: 'totalPrice',
          scopedSlots: { customRender: 'totalPrice' }
        },
        type8: {
          title: '備註',
          dataIndex: 'reference',
          customRender:(val, row)=>{
            return <div>{row.remark}</div>
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
        name: 666,
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
    showModal1() {
      this.distirbuteHandler();
      this.templateType = '商用-有價格'
      this.visible = true
      this.columnList = this.getColumn([
        'type',
        'type2',
        'type3',
        'type4',
        'type5',
        'type6',
        'type7',
        'type8'
      ])
      let _this = this;
      setTimeout(function() {
        _this.handleOk();
      },200)

    },
    showModal2() {
      this.templateType = '商用-無價格'
      this.visible = true
      this.columnList = this.getColumn([
        'type',
        'type2',
        'type3',
        'type4',
        'type5',
        'type6',
        'type7',
        'type8'
      ])
      let _this = this;
      setTimeout(function() {
        _this.handleOk();
      },200)
    },
    showModal3() {
      this.templateType = '零售-有價格'
      this.visible = true
      this.columnList = this.getColumn(['type', 'type2', 'type3', 'type8'])

      let _this = this;
      setTimeout(function() {
        _this.handleOk();
      },200)
    },
    showModal4() {
      this.templateType = '貼箱標籤'
      this.show = true

      let _this = this;
      setTimeout(function() {
        _this.handleOk();
      },200)
    },
    handleOk() {
      this.handleCancel()

      if (this.templateType !== '貼箱標籤') {
        htmlToImage
          .toPng(document.querySelector('.table-content'))
          .then(function(dataUrl) {
            let img = new Image()
            img.src = dataUrl

            // let printPage = document.querySelector('.print-modal')
            // printPage.appendChild(img)

            // let body = window.document.appendChild(img)


            let myWindow = window.open('', '', 'width=2000,height=1000')
            myWindow.document.write(img.outerHTML)

            setTimeout(function() {
              myWindow.document.close()
              myWindow.focus()
              myWindow.print()
              myWindow.close()
            }, 250)
          })
      } else {
        htmlToImage
          .toPng(document.querySelector('.package-sticker'))
          .then(function(dataUrl) {
            let img = new Image()
            img.src = dataUrl

            let printPage = document.querySelector('.print-modal')
            printPage.appendChild(img)

            let myWindow = window.open('', '', 'width=500,height=700')
            myWindow.document.write(printPage.innerHTML)

            setTimeout(function() {
              myWindow.document.close()
              myWindow.focus()
              myWindow.print()
              myWindow.close()
            }, 250)
          })
      }
    },
    handleCancel() {
      this.visible = false
      this.show = false
      let printPage = document.querySelector('.print-modal')
      printPage.innerHTML = ''
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120px;
  .black-cat-logo {
    border: 2px solid;
  }
}
img {
  width: 150px;
  position: relative;
  left: 0;
  top: 0;
}

.detail-wrapper {
  display: flex;
  justify-content: space-around;

  .detail-list {
    display: flex;
    flex-direction: column;
    position: relative;
    right: 45px;
  }
  .barcode-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    right: 30px;
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
  justify-content: space-around;
  .contact-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: -100px;
  }
  .sign-wrapper {
    margin-left: -140px;
  }
  .sign-block {
    background-color: #f4f4f4;
    width: 160px;
    height: 50px;
    line-height: 5;
    position: absolute;
    bottom: 117px;
    right: 86px;
    padding: 0 0 0 12px;
  }
}
.button-wrapper {
  margin-left: auto;
  margin-top: 45px;
  width: 150px;
}
::v-deep .ant-modal-header {
  display: none;
}
::v-deep .ant-modal-header {
  display: none;
}
.package-wrapper {
}
.package-sticker {
  height: 450px;
  padding: 11px 15px 10px 10px;
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
  margin-bottom: 100px;
}
.package-content-detail-order {
  display: flex;
  justify-content: space-between;
  .order-barcode {
    width: 250px;
    height: 100px;
    background-color: green;
  }
}
.package-content-detail-package {
  display: flex;
  justify-content: space-between;
  .package-barcode {
    width: 250px;
    height: 100px;
    background-color: red;
  }
}
</style>
