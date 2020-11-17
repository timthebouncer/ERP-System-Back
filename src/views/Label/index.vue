<template>
  <div>
    <a-layout style="padding:20px;">
      <a-space>
        <span>*標籤名稱</span><a-input v-model="tagName" placeholder="請輸入"></a-input>
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
              <a-select
                size="large"
                show-search
                option-filter-prop="children"
                style="width: 100%;"
                placeholder="刷條碼或選擇商品"
              >
                <a-select-option value="1101">
                  豬耳朵
                </a-select-option>
                <a-select-option value="1102">
                  後臀肉
                </a-select-option>
                <a-select-option value="1103">
                  豬舌
                </a-select-option>
              </a-select>
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag('商品名稱')"
                draggable
                >商品名稱</a-col
              ><a-col
                :span="6"
                class="tags"
                @drag="handleDrag('商品條碼')"
                draggable
                >商品條碼</a-col
              >
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag('成本價')"
                draggable
                >成本價</a-col
              >
              <a-col
                :span="6"
                class="tags"
                @drag="handleDrag('建議售價')"
                draggable
                >建議售價</a-col
              >
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col :span="6" class="tags" @drag="handleDrag('重量')" draggable
                >重量</a-col
              >
              <a-col :span="6" class="tags" @drag="handleDrag('單位')" draggable
                >單位</a-col
              >
            </a-row>
            <a-row class="label-wrap" type="flex" justify="space-between">
              <a-col :span="6" class="tags" @drag="handleDrag('售價')" draggable
                >售價</a-col
              >
              <a-col :span="6" class="tags" @drag="handleDrag('text')" draggable
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
      currentDrag: '',
      labelItemVisible: false,
      tagItem: {},
      tagName:'',
      tagDrawWidth: 100,
      tagDrawHeight: 100,
      svgXml: '',
      svgJson: '',
      exportCanvasW: 550,
      exportCanvasH: 550,
      objSelected: null,
      clipRectangle: null,
      hasTags: [],
      delAlertMsg: ''
    }
  },
  methods: {
    handleDrag(current) {
      this.currentDrag = current
    },
    //放入畫布事件
    handleDrop(e) {
      const { offsetX, offsetY } = e.e
      var element
      if (this.hasTags.indexOf(this.currentDrag) === -1) {
        if (this.currentDrag === 'text') {
          this.currentDrag = {
            text: this.currentDrag,
            offsetX,
            offsetY
          }
          this.$refs.textConfirm.visible = true
          return
        } else if (this.currentDrag === '商品條碼') {
          this.hasTags.push(this.currentDrag)
          element = new fabric.Text(`{{${this.currentDrag}}}`, {
            fontFamily: '微軟正黑體',
            hasControls: true,
            name:this.currentDrag
          })

        } else {
          this.hasTags.push(this.currentDrag)
          element = new fabric.Textbox(`{{${this.currentDrag}}}`, {
            fontSize: 30,
            fontFamily: '微軟正黑體',
            hasControls: true,
            textAlign: 'center',
            editable: false,
            name:this.currentDrag
          })
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
        element.left = offsetX - element.width / 2
        element.top = offsetY - element.height / 2
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
      if (e.target) {
        this.tagItem = e.target
        // if(this.tagItem )
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
      if(this.tagName==null || this.tagName==''){
        this.$message.warning('請輸入標籤名稱')
        return
      }
      let svgJson = this.canvas.toJSON()
      this.svgJson = svgJson
      let svgJsonStr = JSON.stringify(svgJson)
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
      this.canvas.setDimensions({
        width: this.exportCanvasW,
        height: this.exportCanvasH
      })
      console.log(this.svgJson)
      this.canvas.loadFromJSON(this.svgJson)
      this.canvas.getObjects().map(function(o) {
        if (o.text != '{{商品條碼}}') {
          o.setControlsVisibility({
            mt: false, // middle top disable
            mb: false, // midle bottom
            mtr: false,
            bl: false,
            br: false,
            tl: false,
            tr: false
          })
        } else {
        }
      })
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
      element.left = this.currentDrag.offsetX - element.width / 2
      element.top = this.currentDrag.offsetY - element.height / 2
      element.setControlsVisibility({
        mt: false, // middle top disable
        mb: false, // midle bottom
        mtr: false,
        bl: false,
        br: false,
        tl: false,
        tr: false
      })
      element.name = 'TEXT'
      this.canvas.add(element)
    },
    handleDeleteTag() {
      const tag = this.canvas.getActiveObject()
      // console.log(tag);
      // console.log(this.hasTags)
      if (tag) {
        const strLen = tag.text.length
        let str = tag.text.substring(2, strLen - 2)
        const index = this.hasTags.indexOf(str)
        if (index != -1) {
          this.hasTags.splice(index, 1)
        } else {
          str = 'TEXT: ' + tag.text
        }
        this.canvas.remove(tag)
        this.objSelected = null
        this.delAlertMsg = str + ' 模塊已刪除'
        this.$message.success(this.delAlertMsg,1.5)
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
