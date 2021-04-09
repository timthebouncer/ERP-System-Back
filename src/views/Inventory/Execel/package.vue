<template>
  <div>
    <button class="print-btn" @click="turnOn">
      貼箱標籤
    </button>
    <a-modal v-model="visible" width="850px" footer="" :closable="false">
      <div style="height: 300px;padding: 8px 0 0 0;">
        <canvas width="800" height="500" id="art"></canvas>
      </div>
      <div class="vanish">
        <img class="brandLogo" src="@/assets/brand_logo.jpg" />
        <svg
          id="ean-14"
          :jsbarcode-format="'auto'"
          :jsbarcode-value="orderDetail.orderNo"
        ></svg>
        <svg
          id="trackNo"
          :jsbarcode-format="skus2.format"
          :jsbarcode-value="orderDetail.trackingNo"
        ></svg>
        <svg id="itf-14"
             :jsbarcode-format="'auto'"
             :jsbarcode-value="orderDetail.trackingNo"
        ></svg>
      </div>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios'
import { fabric } from 'fabric'
import JsBarcode from 'jsbarcode'
import * as htmlToImage from 'html-to-image'
import https from 'https'
export default {
  name: 'inventoryExcel',
  props: ['receiverList', 'orderDetail','distirbuteHandler','orderTitle'],
  data() {
    return {
      visible: false,
      svgJson: '',
      skus: { format: 'auto',width: '100', title: '' },
      skus2: { format: 'auto', title: '' },
      packageType:""
    }
  },
  mounted() {},
  methods: {
    async turnOn() {
      this.packageType = "貼箱標籤"
      this.visible = true
      let _this = this
      if (this.orderTitle !== "訂單詳情"){
        await this.distirbuteHandler(this.packageType)
        setTimeout(() => {
          _this.draw()
        }, 100)
      }else {
        setTimeout(() => {
          _this.draw()
        }, 100)
      }
    },
    async draw() {
      let canvas = new fabric.Canvas('art')
      let img = new Image()
      const dataUrl = await htmlToImage.toPng(
        document.querySelector('.brandLogo')
      )

      img.src = dataUrl

      this.$nextTick(() => {
        let image = new fabric.Image(img, {
          left: 70,
          top: 40,
          scaleX: 0.7,
          scaleY: 0.7
        })
        canvas.add(image)
      })
      let placeholder = new fabric.Textbox('|', {
        left: 0,
        top: 30,
        fontSize: 1
      })
      canvas.add(placeholder)

      let text = new fabric.Textbox('收件客戶', {
        left: 70,
        top: 170,
        name: 'species',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      let text1 = new fabric.Textbox(`${this.receiverList.receiver}`, {
        left: 90,
        top: 200,
        name: 'species',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      text1.set({
        width:300
      })
      let line = new fabric.Textbox('|', {
        left: 170,
        top: 160,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: '微軟正黑體'
      })
      let line1 = new fabric.Textbox('|', {
        left: 170,
        top: 280,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: '微軟正黑體'
      })
      canvas.add(text)
      canvas.add(text1)
      canvas.add(line)
      canvas.add(line1)

      let text2 = new fabric.Textbox('出貨單號', {
        left: 70,
        top: 280,
        name: 'orderNo',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      canvas.add(text2)
      await JsBarcode('#ean-14').init()


      const _dataUrl = await htmlToImage.toPng(
              document.querySelector('#ean-14')
      )

      let _img = new Image()
      _img.src = _dataUrl
      this.$nextTick(() => {
        let _image = new fabric.Image(_img, {
          left: 200,
          top: 230,
          scaleX: 0.8,
          scaleY: 0.8
        })

        canvas.add(_image)
      })

      if (this.orderDetail.trackingNo) {
        let text3 = new fabric.Textbox('物流編號', {
          left: 70,
          top: 410,
          name: 'orderNo',
          fontSize: 25,
          fontFamily: '微軟正黑體'
        })
        canvas.add(text3)

        let line2 = new fabric.Textbox('|', {
          left: 170,
          top: 407,
          fontSize: 20,
          fontWeight: 5,
          fontFamily: '微軟正黑體'
        })
        canvas.add(line2)

        JsBarcode("#itf-14").init()
        const aaa = await htmlToImage.toPng(
                document.querySelector('#itf-14')
        )
        let ___img = new Image()
        ___img.src = aaa
        this.$nextTick(()=>{
          let images3 = new fabric.Image(___img, {
            left: 180,
            top: 345,
            scaleX: 0.8,
            scaleY: 0.8
          })
          canvas.add(images3)
        })
      }

      let text7 = new fabric.Textbox('出貨日期', {
        left: 250,
        top: 58,
        name: 'workingDate',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      let line3 = new fabric.Textbox('|', {
        left: 350,
        top: 55,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: '微軟正黑體'
      })
      let text8 = new fabric.Textbox(`${this.orderDetail.salesDay}`, {
        left: 370,
        top: 58,
        name: 'species',
        fontSize: 25
      })
      canvas.add(text7)
      canvas.add(text8)
      canvas.add(line3)
      this.$nextTick((this.canvas = canvas))

      setTimeout(() => {
        this.exportSVG()
      }, 1000)
    },
    async exportSVG() {
      let canvasJson = this.canvas.toJSON()
      let file = await new File([JSON.stringify(canvasJson)], 'foo.txt', {
        type: 'text/plain'
      })
      const formData = await new FormData()
      formData.append('file', file)
      formData.append('width', '100')
      formData.append('height', '80')
      formData.append('printerName', 'Sbarco T4ES 203 dpi')
      const agent = new https.Agent({ rejectUnauthorized: false })
      await axios
        .post('https://192.168.0.125:8099/print/printTag', formData, {
          httpsAgent: agent
        })
        .then(res => {
          console.log(res)
        })
    }
  }
}
</script>
<style>
canvas {
  border: 1px solid #000;
}
.print-btn {
  background-color: #fba129;
  color: #fcfcfc;
  font-size: large;
  border: unset;
  cursor: pointer;
}
.brandLogo {
  /*opacity: 0;*/
}
.vanish {
  opacity: 0;
}
</style>
