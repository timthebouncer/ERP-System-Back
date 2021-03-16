<!--<template>-->
<!--  <div>-->
<!--    <a-button @click="turnOn">-->
<!--      入庫報表-->
<!--    </a-button>-->
<!--    <a-modal v-model="visible" width="1000px" footer="" :closable="false">-->
<!--      <div style="height: 400px">-->
<!--          <canvas width="950px" height="400px" id="art"></canvas>-->
<!--      </div>-->
<!--        <img class="vanish" src="@/assets/brand_logo.jpg"/>-->
<!--    </a-modal>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--import { fabric } from 'fabric'-->
<!--export default {-->
<!--  name: 'inventoryExcel',-->
<!--  data() {-->
<!--    return {-->
<!--      visible: true,-->
<!--      svgJson:''-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    let _this = this-->
<!--    setTimeout(function () {-->
<!--      _this.draw()-->
<!--    },300)-->
<!--  },-->
<!--  methods: {-->
<!--    turnOn() {-->
<!--      this.visible = true-->
<!--    },-->
<!--   async draw() {-->
<!--      let canvas = new fabric.Canvas('art');-->
<!--      let logo = document.querySelector('img')-->
<!--      let image = new fabric.Image(logo,{left:10, top:10})-->
<!--      canvas.add(image);-->
<!--      let text = new fabric.Text('屠宰雞種:XXXXXXXXXX', { left: 50, top: 150, name: 'species',fontSize: 20});-->

<!--     let line = new fabric.Line([10, 100, 250,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:135,-->
<!--       lineTo:(400, 100),-->
<!--       top:170,-->
<!--     });-->
<!--      canvas.add(line)-->
<!--      canvas.add(text);-->
<!--      let text1 = new fabric.Text('數量:XXXXXXXXXXXXX', { left: 50, top: 190,name: 'amount',fontSize: 20 });-->
<!--     let line1 = new fabric.Line([10, 100, 290,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:95,-->
<!--       lineTo:(400, 100),-->
<!--       top:210,-->
<!--     });-->
<!--      canvas.add(text1);-->
<!--      canvas.add(line1);-->
<!--      let text2 = new fabric.Text('毛雞總重量:XXXXXXXXXX', { left: 50, top: 230,name: 'livingWeight',fontSize: 20 });-->
<!--     let line2 = new fabric.Line([10, 100, 250,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:135,-->
<!--       lineTo:(400, 100),-->
<!--       top:250,-->
<!--     });-->
<!--      canvas.add(text2);-->
<!--      canvas.add(line2);-->
<!--      let text3 = new fabric.Text('屠體總重量:XXXXXXXXXX', { left: 50, top: 270,name: 'carcassWeight',fontSize: 20 });-->
<!--     let line3 = new fabric.Line([10, 100, 250,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:135,-->
<!--       lineTo:(400, 100),-->
<!--       top:290,-->
<!--     });-->
<!--      canvas.add(text3);-->
<!--      canvas.add(line3);-->
<!--      let text4 = new fabric.Text('倉別:XXXXXXXXXX', { left: 50, top: 310,name: 'depotClass',fontSize: 20 });-->
<!--     let line4 = new fabric.Line([10, 100, 290,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:95,-->
<!--       lineTo:(400, 100),-->
<!--       top:330,-->
<!--     });-->
<!--      canvas.add(text4);-->
<!--      canvas.add(line4);-->
<!--      let text5 = new fabric.Text('操作人員:XXXXXXXXXX', { left: 50, top: 350,name: 'user',fontSize: 20 });-->
<!--     let line5 = new fabric.Line([10, 100, 250,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:135,-->
<!--       lineTo:(400, 100),-->
<!--       top:370,-->
<!--     });-->
<!--      canvas.add(text5);-->
<!--      canvas.add(line5);-->
<!--      let text6 = new fabric.Text('入庫報表', { left: 750, top: 50,name: 'inventoryExcel',fontSize: 40, fontWeight:'bold' });-->

<!--      canvas.add(text6);-->

<!--      let text7 = new fabric.Text('工作日期:XXXXXXXXXX', { left: 600, top: 150,name: 'workingDate',fontSize: 20 });-->
<!--     let line6 = new fabric.Line([10, 100, 250,100], {-->
<!--       fill: 'green',-->
<!--       stroke: 'green',-->
<!--       strokeDashArray:[5,5],-->
<!--       left:685,-->
<!--       lineTo:(400, 100),-->
<!--       top:170,-->
<!--     });-->
<!--     canvas.add(line6);-->
<!--      canvas.add(text7)-->
<!--      let text8 = new fabric.Text('入庫單號:', { left: 600, top: 190,name: 'orderNo',fontSize: 20 });-->
<!--      canvas.add(text8);-->

<!--      let rect = new fabric.Rect({-->
<!--        fill: 'grey',-->
<!--        width: 180,-->
<!--        height: 70,-->
<!--        left:750,-->
<!--        top:190-->
<!--      });-->
<!--      canvas.add(rect);-->
<!--      logo.outerHTML = ''-->
<!--     this.canvas = canvas-->
<!--     await this.exportSVG()-->
<!--    },-->
<!--    exportSVG(){-->
<!--      let canvasJson = this.canvas.toJSON()-->
<!--      console.log(JSON.stringify(canvasJson));-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style>-->
<!--canvas{border: 1px solid #000;}-->
<!--.vanish{-->
<!--    opacity: 0;-->
<!--}-->
<!--</style>-->
/////////////////////////////////
<!--<template>-->
<!--  <div>-->
<!--    <a-button @click="turnOn">-->
<!--      入庫報表-->
<!--    </a-button>-->
<!--    <a-modal v-model="visible" width="1000px" footer="" :closable="false">-->
<!--      <div style="height: 400px">-->
<!--        <canvas width="950px" height="400px" id="art"></canvas>-->
<!--      </div>-->
<!--      <img class="vanish" src="@/assets/brand_logo.jpg"/>-->
<!--    </a-modal>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--  import { fabric } from 'fabric'-->
<!--  export default {-->
<!--    name: 'inventoryExcel',-->
<!--    data() {-->
<!--      return {-->
<!--        visible: true,-->
<!--        svgJson:''-->
<!--      }-->
<!--    },-->
<!--    mounted() {-->
<!--      let _this = this-->
<!--      setTimeout(function () {-->
<!--        _this.draw()-->
<!--      },300)-->
<!--    },-->
<!--    methods: {-->
<!--      turnOn() {-->
<!--        this.visible = true-->
<!--      },-->
<!--      async draw() {-->
<!--        let canvas = new fabric.Canvas('art');-->
<!--        let logo = document.querySelector('img')-->
<!--        let image = new fabric.Image(logo,{left:10, top:10})-->
<!--        canvas.add(image);-->
<!--        let text6 = new fabric.Text('屠宰&分切報表', { left: 650, top: 50,name: 'inventoryExcel',fontSize: 40, fontWeight:'bold' });-->

<!--        canvas.add(text6);-->

<!--        let text7 = new fabric.Text('2021年 1 2 3 4 5 6 7 8 9 10 11 12 月', { left: 600, top: 150,name: 'workingDate',fontSize: 20, fontWeight:'bold' });-->
<!--       -->
<!--        canvas.add(text7)-->
<!--      -->
<!--        this.canvas = await canvas-->
<!--        await this.exportSVG()-->
<!--      },-->
<!--      exportSVG(){-->
<!--        let canvasJson = this.canvas.toJSON()-->
<!--        console.log(JSON.stringify(canvasJson))-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->
<!--<style>-->
<!--  canvas{border: 1px solid #000;}-->
<!--  .vanish{-->
<!--    opacity: 0;-->
<!--  }-->
<!--</style>-->
