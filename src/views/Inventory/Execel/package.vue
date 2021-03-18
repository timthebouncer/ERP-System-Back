<template>
  <div>
    <a-button @click="turnOn">
      貼箱標籤
    </a-button>
    <a-modal v-model="visible" width="600px" footer="" :closable="false">
      <div style="height: 400px">
        <canvas width="550px" height="400px" id="art"></canvas>
      </div>
      <img class="vanish" src="@/assets/brand_logo.jpg" />
        <svg
                id="ean-13"
                :jsbarcode-format="skus.format"
                :jsbarcode-value="orderDetail.orderNo"
        >
        </svg>
        <img class="vanish" id="ean" />
    </a-modal>
  </div>
</template>
<script>
import { fabric } from 'fabric'
import JsBarcode from "jsbarcode";
export default {
  name: 'inventoryExcel',
  props: ['receiverList', 'orderDetail'],
  data() {
    return {
      visible: true,
      svgJson: '',
      skus: { format: 'auto', title: '' },
    }
  },
  mounted() {
    let _this = this
    setTimeout(function() {
      _this.draw()
    }, 300)
  },
  methods: {
    turnOn() {
      this.visible = true
    },
    async draw() {
      let canvas = new fabric.Canvas('art')
      let logo = document.querySelector('.vanish')
      let image = new fabric.Image(logo, {
        left: 50,
        top: 30,
        scaleX: 0.5,
        scaleY: 0.5
      })
      canvas.add(image)

      let text = new fabric.Text('收件客戶', {
        left: 60,
        top: 120,
        name: 'species',
        fontSize: 18
      })
      let text1 = new fabric.Text(`${this.receiverList.receiver}`, {
        left: 60,
        top: 160,
        name: 'species',
        fontSize: 30
      })

      // let line = new fabric.Line([10, 100, 250,100], {
      //   fill: 'green',
      //   stroke: 'green',
      //   strokeDashArray:[5,5],
      //   left:135,
      //   lineTo:(400, 100),
      //   top:170,
      // });
      // canvas.add(line)
      canvas.add(text)
      canvas.add(text1)

      let text2 = new fabric.Text('出貨單號:', {
        left: 60,
        top: 250,
        name: 'orderNo',
        fontSize: 20
      })
      canvas.add(text2)
      await JsBarcode('#ean-13').init()

      let svg = document.querySelector('#ean-13')
      let xml = new XMLSerializer().serializeToString(svg);
      let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
      let img =  document.querySelector('#ean')
      img.src = base64;

      let aaa = await document.querySelector('#ean')
      console.log(aaa)

      let images = await new fabric.Image(aaa, {
        left: 50,
        top: 190,
        scaleX: 1,
        scaleY: 1
      })
     await canvas.add(images)
      // svg.classList.add('.vanish')

      let text7 = new fabric.Text('出貨日期:XXXXXXXXXX', {
        left: 600,
        top: 150,
        name: 'workingDate',
        fontSize: 20
      })
      let line6 = new fabric.Line([10, 100, 250, 100], {
        fill: 'green',
        stroke: 'green',
        strokeDashArray: [5, 5],
        left: 685,
        lineTo: (400, 100),
        top: 170
      })
      canvas.add(line6)
      canvas.add(text7)

      logo.outerHTML = ''
      this.canvas = canvas
      await this.exportSVG()
    },
    exportSVG(){
      let canvasJson = this.canvas.toJSON()
      // console.log(JSON.stringify(canvasJson));
    }
  }
}
</script>
<style>
canvas {
  border: 1px solid #000;
}
.vanish {
  opacity: 0;
}
</style>
