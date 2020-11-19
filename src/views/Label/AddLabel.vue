<template>
  <div>
    <a-layout style="padding:20px;">
      <a-space>
        <span>*標籤名稱</span
        ><a-input v-model="tagName" placeholder="請輸入"></a-input>
        <span>*標籤尺寸</span><span>寬</span
        ><a-input-number
          v-model="tagDrawWidth"
          placeholder="請輸入"
          :default-value="100"
          :max="200"
          :min="10"
        /><span>X</span><span>高</span
        ><a-input-number
          v-model="tagDrawHeight"
          placeholder="請輸入"
          :default-value="100"
          :max="200"
          :min="10"
        /><span>mm</span>
        <a-button type="primary" @click="handleChangeSize">確定</a-button>
      </a-space>
    </a-layout>
    <a-divider />
    <a-layout style="width: 100%; height: 700px;">
      <a-row type="flex" style="height: 100%;" align="middle">
        <a-col :span="8" style="height: 100%;">
          <a-row class="label-control" align="middle" style="height: 100%;">
            <a-row class="label-wrap">
              <a-auto-complete
                v-model="searchProductName"
                @search="searchProduct"
                @select="selectProduct"
                placeholder="請輸入商品名稱"
              >
                <template slot="dataSource">
                  <a-select-option
                    v-for="item in productData"
                    :key="item.id"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </template>
              </a-auto-complete>
              <a-button type="primary" @click="resetTag">重置</a-button>
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag(productNameTag, 'productName')"
                draggable
                >{{ productNameTag }}</a-col
              ><a-col
                :span="6"
                class="tags"
                @drag="handleDrag(barcodeTag, 'barcode')"
                draggable
                >{{ barcodeTag }}</a-col
              >
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag(costPriceTag, 'costPrice')"
                draggable
                >{{ costPriceTag }}</a-col
              >
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag(listPriceTag, 'listPrice')"
                draggable
                >{{ listPriceTag }}</a-col
              >
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag(weightTag, 'weight')"
                draggable
                >{{ weightTag }}</a-col
              >
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag(unitTag, 'unit')"
                draggable
                >{{ unitTag }}</a-col
              >
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag(salesPriceTag, 'salesPrice')"
                draggable
                >{{ salesPriceTag }}</a-col
              >
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag('text', 'text')"
                draggable
                >TEXT</a-col
              >
            </a-row>
          </a-row>
        </a-col>
        <a-col :span="16" style="height: 100%;">
          <!--          <a-row style="height: 10%;">-->

          <!--          </a-row>-->
          <!--          <a-row type="flex" style="height: 90%;" align="middle" justify="center">-->
          <div class="label-canvas">
            <span>
              <span>＊重量預設顯示100，列印時會依實際重量為主</span>
              <br />
              <span style="color: red;">＊注意:實際列印範圍為白色區塊</span>
            </span>
            <a-button
              size="small"
              class="del-button"
              type="danger"
              @click="handleDeleteTag"
              style="margin-top: 15px;"
              >移除標籤</a-button
            >
            <canvas id="label-fabric" width="550" height="550" />
          </div>
          <!--          </a-row>-->
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" align="middle" style="height:100px;">
        <a-space :size="150">
          <a-button @click="canvas.clear()">取消</a-button>
          <a-button type="primary" @click="exportSVG">儲存</a-button>
          <a-button @click="showSVG">SHOW</a-button>
        </a-space>
      </a-row>
    </a-layout>
    <TagsDetail ref="tagsDetail" :tagItem="tagItem" @saveTag="handleSaveTag" />
    <TextConfirm @confirmText="confirmText" ref="textConfirm" />
  </div>
</template>

<script>
import { fabric } from 'fabric'
// import { xml2js, js2xml, xml2json, json2xml } from 'xml-js'
import TagsDetail from './component/TagsDetail'
import TextConfirm from './component/TextConfirm'
export default {
  name: 'index',
  components: { TagsDetail, TextConfirm },
  data() {
    return {
      currentDrag: [
        { name: 'productName', text: '商品名稱' },
        { name: 'barcode', text: '商品條碼' },
        { name: 'costPrice', text: '成本價' },
        { name: 'listPrice', text: '建議售價' },
        { name: 'salesPrice', text: '售價' },
        { name: 'weight', text: '重量' },
        { name: 'unit', text: '單位' },
        { name: 'text', text: 'TEXT' }
      ],
      currentDragName: '',
      currentDragText: '',
      textTag: '',
      labelItemVisible: false,
      tagItem: {},
      tagName: '',
      tagDrawWidth: 100,
      tagDrawHeight: 100,
      svgXml: '',
      svgJson: '',
      exportCanvasW: 550,
      exportCanvasH: 550,
      objSelected: null,
      clipRectangle: null,
      hasTags: [],
      delAlertMsg: '',
      productData: [],
      productNameList: [],
      searchProductName: '',
      productNameTag: '商品名稱',
      barcodeTag: '商品條碼',
      costPriceTag: '成本價',
      listPriceTag: '建議售價',
      salesPriceTag: '售價',
      weightTag: '重量',
      unitTag: '單位',
      previewed: false
    }
  },
  methods: {
    searchProduct(value) {
      this.productData = []
      console.log(value, 'search value')
      this.$api.Label.searchProduct(value, '')
        .then(res => {
          console.log(res)
          this.productData = res.data
          console.log(this.productData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectProduct(value) {
      this.searchProductName = ''
      let item = {}
      item = this.productData.find(x => x.id === value)
      this.searchProductName = item.name
      this.productNameTag = '商品名稱:' + item.name
      this.barcodeTag = '商品條碼' + item.barcode
      this.costPriceTag = '成本價:' + item.costPrice + '元'
      this.listPriceTag = '建議售價:' + item.listPrice + '元'
      this.salesPriceTag = '售價:' + item.salesPrice + '元'
      this.weightTag = '重量:xxx'
      this.unitTag = '單位:' + item.unit
      this.previewed = true
      this.currentDrag = [
        { name: 'productName', text: this.productNameTag },
        { name: 'barcode', text: this.barcodeTag },
        { name: 'costPrice', text: this.costPriceTag },
        { name: 'listPrice', text: this.listPriceTag },
        { name: 'salesPrice', text: this.salesPriceTag },
        { name: 'weight', text: this.weightTag },
        { name: 'unit', text: this.unitTag },
        { name: 'text', text: 'TEXT' }
      ]
      this.canvas.getObjects().map(o => {
        if (
          this.currentDrag.findIndex(x => x.name == o.name) != -1 &&
          o.name != 'text'
        ) {
          o.text = this.currentDrag.find(x => x.name == o.name).text
        }
      })
      this.canvas.renderAll()
    },
    resetTag() {
      this.productData = []
      this.previewed = false
      this.searchProductName = ''
      this.productNameTag = '商品名稱'
      this.barcodeTag = '商品條碼'
      this.costPriceTag = '成本價'
      this.listPriceTag = '建議售價'
      this.salesPriceTag = '售價'
      this.weightTag = '重量'
      this.unitTag = '單位'
      this.currentDrag = [
        { name: 'productName', text: '商品名稱' },
        { name: 'barcode', text: '商品條碼' },
        { name: 'costPrice', text: '成本價' },
        { name: 'listPrice', text: '建議售價' },
        { name: 'salesPrice', text: '售價' },
        { name: 'weight', text: '重量' },
        { name: 'unit', text: '單位' },
        { name: 'text', text: 'TEXT' }
      ]
      this.canvas.getObjects().map(o => {
        if (
          this.currentDrag.findIndex(x => x.name == o.name) != -1 &&
          o.name != 'text'
        ) {
          o.text =
            '{{' + this.currentDrag.find(x => x.name == o.name).text + '}}'
        }
      })
      this.canvas.renderAll()

      this.productData = []
      this.$api.Label.searchProduct('', '')
        .then(res => {
          this.productData = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDrag(text, name) {
      console.log(text)
      this.currentDragText = text
      this.currentDragName = name
    },
    //放入畫布事件
    handleDrop(e) {
      const { offsetX, offsetY } = e.e
      var element
      if (this.hasTags.indexOf(this.currentDragName) === -1) {
        if (this.currentDragName === 'text') {
          this.textTag = {
            text: this.currentDragText,
            offsetX,
            offsetY
          }
          this.$refs.textConfirm.visible = true
          return
        } else if (this.currentDragName === 'barcode') {
          this.hasTags.push(this.currentDragName)
          element = new fabric.Text(
            this.previewed
              ? this.currentDragText
              : `{{${this.currentDragText}}}`,
            {
              fontFamily: '微軟正黑體',
              hasControls: true,
              name: this.currentDragName
            }
          )
        } else {
          this.hasTags.push(this.currentDragName)
          element = new fabric.Textbox(
            this.previewed
              ? this.currentDragText
              : `{{${this.currentDragText}}}`,
            {
              fontSize: 30,
              fontFamily: '微軟正黑體',
              hasControls: true,
              textAlign: 'center',
              editable: false,
              name: this.currentDragName
            }
          )
          element.setControlsVisibility({
            mt: false, // middle top disable
            mb: false, // midle bottom
            mtr: false,
            bl: false,
            br: false,
            tl: false,
            tr: false
          })
        }
        this.currentDrag.find(
          x => x.name == this.currentDragName
        ).text = this.currentDragText
        element.left = offsetX - element.width / 2
        element.top = offsetY - element.height / 2
        let _this = this
        element.toObject = (function(toObject) {
          let currentDragName = _this.currentDragName
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              name: currentDragName,
              editable: false
            })
          }
        })(element.toObject)
        // element.toObject = function(){
        //   return {name:this.currentDragName}
        // }
        console.log(element, 'element')
        // element.clipPath = this.clipRectangle
        this.canvas.add(element)
        element.on('moved', e => {
          this.checkInArea(e)
          this.canvas.renderAll()
        })

        // element.globalCompositeOperation = 'sou'
        // this.canvas.renderAll()
      }
    },
    handleClickTags(e) {
      if (e.target && e.target.name) {
        this.tagItem = e.target
        console.log(this.tagItem, 'tagItem')
        this.$refs.tagsDetail.visible = true
      }
    },
    initFabric() {
      this.canvas.clear()
      this.tags.forEach(item => {
        let element
        switch (item.type) {
          case 'text':
            element = new fabric.Text(`{{${item.var}}}`, {
              left: item.x,
              top: item.y
            })
            break
        }
        this.canvas.add(element)
      })
    },
    exportSVG() {
      // let svgJs = xml2js(this.canvas.toSVG())
      // let svgJson = xml2json(this.canvas.toSVG())
      if (this.tagName == null || this.tagName == '') {
        this.$message.warning('請輸入標籤名稱')
        return
      }
      console.log(this.canvas.getObjects())
      let svgJson = this.canvas.toJSON()
      this.svgJson = svgJson
      let svgJsonStr = JSON.stringify(svgJson)
      // let testSvgJson = JSON.stringify(this.canvas)
      // console.log(testSvgJson)
      console.log(svgJsonStr)
      this.exportCanvasW = this.canvas.width
      this.exportCanvasH = this.canvas.height

      const data = {}
      data.productName = this.tagName
      data.showFront = true
      data.svgString = svgJsonStr
      // this.$api.Label.addLabel(data)
      //   .then(() => {
      //     this.$message.success('標籤儲存成功')
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   })

      // let svgxml = json2xml(svgJson)
      // let svgXml = (this.canvas.toSVG()).getElementsByTagName('svg')[0]
      // this.svgXml = this.canvas.toSVG()
      // console.log(this.svgXml.toString())
    },
    showSVG() {
      // this.canvas = this.svgXml
      // this.canvas.renderAll(this.svgXml)
      this.canvas.clear()
      // fabric.loadSVGFromString(this.svgXml, (objects, options) => {
      //   this.canvas.setDimensions(options)
      //   console.log(objects)
      //   console.log(options)
      //   objects.map(item => {
      //     this.canvas.add(item)
      //   })
      //   this.canvas.renderAll()
      //
      //   // const obj = fabric.util.groupSVGElements(objects, options)
      //   // this.canvas.add(obj).renderAll()
      // })
      this.hasTags = []
      this.canvas.setDimensions({
        width: this.exportCanvasW,
        height: this.exportCanvasH
      })
      // console.log(this.svgJson)
      this.canvas.loadFromJSON(this.svgJson)
      this.canvas.getObjects().map(o => {
        console.log(o)
        if (o.type != 'rect' && o.name != 'barcode') {
          o.setControlsVisibility({
            mt: false, // middle top disable
            mb: false, // midle bottom
            mtr: false,
            bl: false,
            br: false,
            tl: false,
            tr: false
          })
        } else if (o.type == 'rect') {
          o.selectable = false
        }

        if (o.name != 'text') {
          this.hasTags.push(o.name)
        }

        o.on('moved', e => {
          this.checkInArea(e)
          this.canvas.renderAll()
        })
      })
      this.canvas.controlsAboveOverlay = true
      this.canvas.renderAll()
    },
    handleSaveTag(edit) {
      console.log(edit, 'edit')
      this.tagItem.set(edit)
      // console.log(this.tagItem)
      this.canvas.renderAll()
    },
    confirmText(text) {
      let element = new fabric.Textbox(text.text, {
        fontFamily: '微軟正黑體',
        fontSize: text.fontSize,
        fontWeight: text.bold ? 'bold' : 'normal',
        hasControls: true,
        editable: false,
        underline: text.underline
      })
      element.left = this.textTag.offsetX - element.width / 2
      element.top = this.textTag.offsetY - element.height / 2
      element.setControlsVisibility({
        mt: false, // middle top disable
        mb: false, // midle bottom
        mtr: false,
        bl: false,
        br: false,
        tl: false,
        tr: false
      })
      element.name = 'text'
      element.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            name: 'text',
            editable: false
          })
        }
      })(element.toObject)
      this.canvas.add(element)
      element.on('moved', e => {
        this.checkInArea(e)
        this.canvas.renderAll()
      })
    },
    handleDeleteTag() {
      const tag = this.canvas.getActiveObject()
      console.log(tag)
      if (tag) {
        console.log(tag.name)
        let str = this.currentDrag.find(x => x.name == tag.name).text
        const index = this.hasTags.indexOf(tag.name)
        if (index != -1) {
          this.hasTags.splice(index, 1)
        } else {
          str = 'TEXT: ' + tag.text
        }
        this.canvas.remove(tag)
        this.objSelected = null
        this.delAlertMsg = str + ' 模塊已刪除'
        this.$message.success(this.delAlertMsg, 1.5)
      }
    },
    handleChangeSize() {
      let width = 500
      let height = 500
      let scaleWidth = this.tagDrawWidth / this.tagDrawHeight
      let scaleHeight = this.tagDrawHeight / this.tagDrawWidth
      if (!(scaleHeight > 1)) {
        height = scaleHeight < 1 ? 500 * scaleHeight + 50 : 500 * scaleHeight
      }
      if (!(scaleWidth > 1)) {
        width = scaleWidth < 1 ? 500 * scaleWidth + 50 : 500 * scaleWidth
      }
      this.clipRectangle.width = width
      this.clipRectangle.height = height
      this.clipRectangle.left = 550 / 2 - width / 2
      ;(this.clipRectangle.top = 550 / 2 - height / 2),
        // this.clipRectangle.setWidth(width)
        // this.clipRectangle.setHeight(height)
        // this.canvas.clipPath = this.clipRectangle
        this.canvas.renderAll()
    },
    checkInArea(e) {
      const left = e.target.left
      const top = e.target.top
      const width = e.target.width
      const height = e.target.height
      if (left < -width || left > 550 || top < -height || top > 550) {
        this.handleDeleteTag()
      }
    }
  },
  mounted() {
    fabric.Group.prototype.hasControls = false
    this.canvas = new fabric.Canvas('label-fabric')
    this.clipRectangle = new fabric.Rect({
      originX: 'left',
      originY: 'top',
      left: 550 / 2 - 250,
      top: 550 / 2 - 250,
      width: 500,
      height: 500,
      fill: 'white',
      /* use transparent for no fill */
      // strokeDashArray: [10, 10],
      // strokeLineJoin: 'mitter',
      // stroke: '#1890ff',
      selectable: false
    })
    // We give these `Rect` objects a name property so the `clipTo` functions can
    // find the one by which they want to be clipped.
    // this.clipRectangle.set({
    //   clipFor: 'layer'
    // });
    // this.canvas.clipPath = this.clipRectangle
    // this.canvas.clipPath
    this.canvas.add(this.clipRectangle)
    // this.canvas.backgroundColor = '#b7e0f2'
    this.canvas.controlsAboveOverlay = true
    // this.canvas.group.selected = false
    this.canvas.renderAll()
    // this.canvas.clipTo = function(ctx){
    //   console.log('clip');
    //   this.clipRectangle.render(ctx)
    // }

    this.canvas.on('drop', this.handleDrop)
    this.canvas.on('mouse:dblclick', this.handleClickTags)
    this.canvas.on('mouse:up', e => {
      this.objSelected = e.target
    })
    document.addEventListener('keydown', e => {
      if (e.keyCode == 46 && this.objSelected) {
        this.handleDeleteTag()
      }
    })
    document.addEventListener('mousedown', e => {
      if (e.target.tagName != 'CANVAS') {
        this.objSelected = null
      }
    })

    this.productData = []
    this.$api.Label.searchProduct('', '')
      .then(res => {
        this.productData = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="scss" scoped>
.label {
  &-control {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 0 20px;
  }
  &-wrap {
    width: 100%;
  }
  &-canvas {
    height: 90%;
    margin: 0 auto;
    margin-top: 40px;
    // background: #fff;
    display: flex;
    align-items: center;
    width: 500px;
    height: 500px;
    position: relative;
    > span {
      position: absolute;
      left: 0;
      top: -24px;
    }
    .del-button {
      position: absolute;
      right: 0;
      top: -28px;
    }
    canvas {
      background: #b2b2b2;
    }
  }
}
.tags {
  background: #fff;
  height: 50px;
  width: 200px;
  font-size: 60px;
  border: #000 solid 1px;
  font-size: larger;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.label-canvas /deep/ .canvas-container {
  margin: auto;
  margin-top: 20px;
}
</style>
