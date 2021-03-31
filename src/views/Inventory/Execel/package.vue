<template>
  <div>
    <button class="print-btn" @click="turnOn">
      貼箱標籤
    </button>
    <a-modal v-model="visible" width="850px" footer="" :closable="false">
      <div style="height: 173px;padding: 8px 0 0 0;">
        <canvas width="800" height="500" id="art"></canvas>
      </div>
      <div class="vanish">
        <img class="brandLogo" src="@/assets/brand_logo.jpg" />
        <svg
          id="ean-13"
          :jsbarcode-format="skus.format"
          :jsbarcode-value="orderDetail.orderNo"
        ></svg>
        <svg
          id="trackNo"
          :jsbarcode-format="skus2.format"
          :jsbarcode-value="orderDetail.trackingNo"
          jsbarcode-textmargin="0"
          jsbarcode-fontoptions="bold"
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
  props: ['receiverList', 'orderDetail'],
  data() {
    return {
      visible: false,
      svgJson: '',
      skus: { format: 'auto', title: '' },
      skus2: { format: 'auto', title: '' }
    }
  },
  mounted() {},
  methods: {
    turnOn() {
      this.visible = true
      let _this = this

      setTimeout(() => {
        _this.draw()
      }, 100)
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
          left: 100,
          top: 10,
          scaleX: 0.7,
          scaleY: 0.7
        })
        canvas.add(image)
      })
      let placeholder = new fabric.Textbox('|', {
        left: 0,
        top: 0,
        fontSize: 1
      })
      canvas.add(placeholder)

      let text = new fabric.Textbox('收件客戶', {
        left: 70,
        top: 140,
        name: 'species',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      let text1 = new fabric.Textbox(`${this.receiverList.receiver}`, {
        left: 90,
        top: 170,
        name: 'species',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      let line = new fabric.Textbox('|', {
        left: 170,
        top: 138,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: '微軟正黑體'
      })
      let line1 = new fabric.Textbox('|', {
        left: 170,
        top: 258,
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
        top: 260,
        name: 'orderNo',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      canvas.add(text2)
      await JsBarcode('#ean-13').init()

      // let svg = document.querySelector('#ean-13')
      // let xml = new XMLSerializer().serializeToString(svg);
      // let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
      // let img =  document.querySelector('#ean')
      // img.src = base64;

      const _dataUrl = await htmlToImage.toPng(
        document.querySelector('#ean-13')
      )
      let _img = new Image()
      _img.src = _dataUrl

      this.$nextTick(() => {
        let _image = new fabric.Image(_img, {
          left: 415,
          top: 210,
          scaleX: 1,
          scaleY: 1
        })
        canvas.add(_image)
      })

      if (this.orderDetail.trackingNo) {
        let text3 = new fabric.Textbox('物流編號', {
          left: 70,
          top: 390,
          name: 'orderNo',
          fontSize: 25,
          fontFamily: '微軟正黑體'
        })
        canvas.add(text3)
        await JsBarcode('#trackNo').init()

        const _dataUrl = await htmlToImage.toPng(
          document.querySelector('#trackNo')
        )
        let __img = new Image()
        __img.src = _dataUrl

        let line2 = new fabric.Textbox('|', {
          left: 170,
          top: 387,
          fontSize: 20,
          fontWeight: 5,
          fontFamily: '微軟正黑體'
        })
        canvas.add(line2)

        this.$nextTick(() => {
          let images2 = new fabric.Image(__img, {
            left: 350,
            top: 350,
            scaleX: 1,
            scaleY: 1
          })
          canvas.add(images2)
        })
      }

      let text7 = new fabric.Textbox('出貨日期', {
        left: 250,
        top: 48,
        name: 'workingDate',
        fontSize: 25,
        fontFamily: '微軟正黑體'
      })
      let line3 = new fabric.Textbox('|', {
        left: 350,
        top: 45,
        fontSize: 20,
        fontWeight: 5,
        fontFamily: '微軟正黑體'
      })
      let text8 = new fabric.Textbox(`${this.orderDetail.salesDay}`, {
        left: 370,
        top: 48,
        name: 'species',
        fontSize: 25
      })
      canvas.add(text7)
      canvas.add(text8)
      canvas.add(line3)

      // logo.outerHTML = ''
      this.$nextTick((this.canvas = canvas))

      setTimeout(() => {
        this.exportSVG()
      }, 200)
    },
    async exportSVG() {
      let canvasJson = this.canvas.toJSON()
      let file = await new File([JSON.stringify(canvasJson)], 'foo.txt', {
        type: 'text/plain'
      })
      const formData = await new FormData()
      formData.append('file', file)
      const agent = new https.Agent({ rejectUnauthorized: false })
      axios
        .post('https://192.168.168.234:8099/print/printTag', formData, {
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
