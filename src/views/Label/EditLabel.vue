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
            <a-row class="label-wrap" type="flex" justify="space-between" align="middle">
              <a-col>
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
              </a-col>
              <a-col>
              <a-upload
                      name="avatar"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      :before-upload="beforeUpload"
                      @change="uploadChange"
              >
                <img
                        v-if="logoImageUrl"
                        class="logoImg"
                        :src="logoImageUrl"
                        alt="avatar"
                        style="width: 200px; height: 55px;"
                        @drag="handleDrag(logoTag, 'Logo')"
                />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    上傳圖片
                  </div>
                </div>
              </a-upload>
              </a-col>
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
              >
                <img
                  v-if="barcodeImageUrl"
                  class="barcodeImg"
                  :src="barcodeImageUrl"
                  alt="avatar"
                  style="width: 190px; height: 45px;"
                />
                <span v-else>{{ barcodeTag }}</span>
              </a-col>
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
          <a-button
            @click="
              () => {
                $router.push('Label').catch(() => {})
              }
            "
            >取消</a-button
          >
          <a-button type="primary" @click="exportSVG">儲存</a-button>
<!--          <a-button @click="showSVG">IMPORT</a-button>-->
          <a-button @click="showImage">預覽列印</a-button>
        </a-space>
      </a-row>
    </a-layout>
    <TagsDetail ref="tagsDetail" :tagItem="tagItem" @saveTag="handleSaveTag" />
    <TextConfirm @confirmText="confirmText" ref="textConfirm" />
    <a-modal
      v-model="showModalVisible"
      title="預覽列印"
      footer=""
      width="700px"
    >
      <div style="background: #b2b2b2; text-align: center; height: 550px;">
        <img :src="imageDataUrl" style="margin-top: 20px;" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { fabric } from 'fabric'
// import { xml2js, js2xml, xml2json, json2xml } from 'xml-js'
import TagsDetail from './component/TagsDetail'
import TextConfirm from './component/TextConfirm'
import { computedWeight } from "@/unit/dictionary/computed";
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'EditLabel',
  components: { TagsDetail, TextConfirm },
  data() {
    return {
      labelMode: 'add',
      labelId: '',
      currentDrag: [
        { name: 'productName', text: '商品名稱' },
        { name: 'barcode', text: '商品條碼' },
        { name: 'costPrice', text: '成本價' },
        { name: 'listPrice', text: '建議售價' },
        { name: 'salesPrice', text: '售價' },
        { name: 'weight', text: '重量' },
        { name: 'unit', text: '單位' },
        { name: 'text', text: 'TEXT' },
        { name: 'Logo', text: 'Logo' }
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
      barcodeImageUrl: '',
      costPriceTag: '成本價',
      listPriceTag: '建議售價',
      salesPriceTag: '售價',
      weightTag: '重量',
      unitTag: '單位',
      logoTag: 'Logo',
      previewed: false,
      showModalVisible: false,
      imageDataUrl: '',
      loading: false,
      logoImageUrl: ''
    }
  },
  computed: {
    computedWeight() {
      return computedWeight
    }
  },
  methods: {
    uploadChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.logoImageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload(file) {
      this.logoImageUrl = ''
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    showImage() {
      this.showModalVisible = true
      this.imageDataUrl = this.canvas.toDataURL({
        left: this.clipRectangle.left,
        top: this.clipRectangle.top,
        width: this.clipRectangle.width,
        height: this.clipRectangle.height,
        format: 'png'
      })
    },
    searchProduct(value) {
      this.productData = []
      this.$api.Label.searchProduct(value, '')
        .then(res => {
          res.data.map(item => {
            if (item.barcode != '') {
              this.productData.push(item)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    async selectProduct(value) {
      this.searchProductName = ''
      let item = {}
      item = this.productData.find(x => x.id === value)
      this.searchProductName = item.name
      this.productNameTag = '商品名稱:' + item.name
      this.barcodeTag = '商品條碼' + item.barcode
      this.costPriceTag = '成本價:' + item.costPrice + '元'
      this.listPriceTag = '建議售價:' + item.listPrice + '元'
      this.salesPriceTag = '售價:' + item.salesPrice + '元'
      this.weightTag = '重量:100'
      this.unitTag = '單位:' + computedWeight(undefined,item.unit)
      this.logoTag = 'Logo'
      this.previewed = true
      this.currentDrag = [
        { name: 'productName', text: this.productNameTag },
        { name: 'barcode', text: this.barcodeTag },
        { name: 'costPrice', text: this.costPriceTag },
        { name: 'listPrice', text: this.listPriceTag },
        { name: 'salesPrice', text: this.salesPriceTag },
        { name: 'weight', text: this.weightTag },
        { name: 'unit', text: this.unitTag },
        { name: 'text', text: 'TEXT' },
        { name: 'Logo', text: this.logoTag }
      ]
      function loadImage(){
        return new Promise((resolve, reject) => {
          this.barcodeImageUrl = 'data:image/png;base64,' + item.barcodeBase64
          resolve(true)
        })
      }

      await loadImage.bind(this)()

      let imgElement
      await this.$nextTick(() => {
        imgElement = document.getElementsByClassName('barcodeImg')[0]
      })
      this.canvas.getObjects().map(o => {
        if (
          this.currentDrag.findIndex(x => x.name == o.name) != -1 &&
          o.name != 'text'
        ) {
          if (o.name == 'barcode' && this.barcodeImageUrl) {
            let { width, height, left, top, scaleX, scaleY } = o
            this.canvas.remove(o)
            let element
            element = new fabric.Image(imgElement, {
              left: left,
              top: top,
              name: 'barcode'
            })

            element.scaleX = (width * scaleX) / element.width
            element.scaleY = (height * scaleY) / element.height
            this.canvas.add(element)
            element.on('moved', e => {
              this.checkInArea(e)
              this.canvas.renderAll()
            })
            this.canvas.renderAll()
          } else {
            o.text = this.currentDrag.find(x => x.name == o.name).text
          }
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
      this.logoTag = 'Logo'
      this.currentDrag = [
        { name: 'productName', text: '商品名稱' },
        { name: 'barcode', text: '商品條碼' },
        { name: 'costPrice', text: '成本價' },
        { name: 'listPrice', text: '建議售價' },
        { name: 'salesPrice', text: '售價' },
        { name: 'weight', text: '重量' },
        { name: 'unit', text: '單位' },
        { name: 'text', text: 'TEXT' },
        { name: 'Logo', text: 'Logo' }
      ]
      this.canvas.getObjects().map(o => {
        if (
          this.currentDrag.findIndex(x => x.name == o.name) != -1 &&
          o.name != 'text'
        ) {
          if (o.name == 'barcode' && this.barcodeImageUrl) {
            let { width, height, left, top, scaleX, scaleY } = o
            this.canvas.remove(o)
            let element
            element = new fabric.Text(`{{商品條碼}}`, {
              fontFamily: '微軟正黑體',
              hasControls: true,
              left: left,
              top: top,
              name: 'barcode'
            })

            element.scaleX = (width * scaleX) / element.width
            element.scaleY = (height * scaleY) / element.height
            this.canvas.add(element)
            element.on('moved', e => {
              this.checkInArea(e)
              this.canvas.renderAll()
            })
            this.canvas.renderAll()
          } else {
            o.text =
              '{{' + this.currentDrag.find(x => x.name == o.name).text + '}}'
          }
        }
      })
      this.canvas.renderAll()

      this.barcodeImageUrl = ''
      this.productData = []
      this.$api.Label.searchProduct('', '')
        .then(res => {
          res.data.map(item => {
            if (item.barcode != '') {
              this.productData.push(item)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDrag(text, name) {
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
          if (this.barcodeImageUrl) {
            let imgElement = document.getElementsByClassName('barcodeImg')[0]
            element = new fabric.Image(imgElement, {
              name: 'barcode'
            })

            element.scaleX = 210 / element.width
            element.scaleY = 45 / element.height
          } else {
            element = new fabric.Text(
              this.previewed
                ? this.currentDragText
                : `{{${this.currentDragText}}}`,
              {
                fontFamily: '微軟正黑體',
                hasControls: true,
                scaleX: 1,
                scaleY: 1,
                name: this.currentDragName
              }
            )
            element.width = 210
            element.height = 45
          }
        } else if (this.currentDragName === 'Logo') {
          this.hasTags.push(this.currentDragName)
          let imgElement = document.getElementsByClassName('logoImg')[0]
          element = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            name: 'Logo'
          })
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

        this.canvas.add(element)
        element.on('moved', e => {
          this.checkInArea(e)
          this.canvas.renderAll()
        })
      }
    },
    handleClickTags(e) {
      if (e.target && e.target.name != 'barcode' && e.target.name != 'Logo') {
        this.tagItem = e.target
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
      if (this.tagName == null || this.tagName == '') {
        this.$message.warning('請輸入標籤名稱')
        return
      }

      // this.currentDrag = [
      //   { name: 'productName', text: '商品名稱' },
      //   { name: 'barcode', text: '商品條碼' },
      //   { name: 'costPrice', text: '成本價' },
      //   { name: 'listPrice', text: '建議售價' },
      //   { name: 'salesPrice', text: '售價' },
      //   { name: 'weight', text: '重量' },
      //   { name: 'unit', text: '單位' },
      //   { name: 'text', text: 'TEXT' },
      //   { name: 'Logo', text: 'Logo' }
      // ]

      this.resetTag()

      this.canvas.getObjects().map(obj => {
        if (
          this.currentDrag.findIndex(x => x.name == obj.name) != -1 &&
          obj.name != 'text' &&
          obj.name != 'Logo'
        ) {
          if (obj.name !== 'barcode' && obj.type !== 'image') {
            obj.text =
              '{{' + this.currentDrag.find(x => x.name == obj.name).text + '}}'
          }
        }

        obj.toObject = (function(toObject) {
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              name: obj.name,
              editable:
                obj.name == 'barcode' || obj.name == 'Logo' ? true : false
            })
          }
        })(obj.toObject)
      })

      let svgJson = this.canvas.toJSON()
      this.svgJson = svgJson
      let svgJsonStr = JSON.stringify(svgJson)
      this.exportCanvasW = this.canvas.width
      this.exportCanvasH = this.canvas.height

      if (this.labelMode == 'add') {
        const data = {}
        data.tagName = this.tagName
        data.showFront = true
        data.svgString = svgJsonStr
        data.height = this.tagDrawHeight
        data.wide = this.tagDrawWidth
        this.$api.Label.addLabel(data)
          .then(() => {
            this.$message.success('新增標籤成功')
            this.$router.push('Label').catch(() => {})
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      } else {
        const data = {}
        data.tagId = this.$store.state.labelData.id
        data.tagName = this.tagName
        data.svgString = svgJsonStr
        data.showFront = this.$store.state.labelData.showFront
        data.height = this.tagDrawHeight
        data.wide = this.tagDrawWidth
        this.$api.Label.editTag(data)
          .then(() => {
            this.$message.success('標籤儲存成功')
            this.$router.push('Label').catch(() => {})
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      }
    },
    async showSVG() {
      this.canvas.clear()
      this.hasTags = []
      this.canvas.setDimensions({
        width: this.exportCanvasW,
        height: this.exportCanvasH
      })

      await this.loadFromJson()

      this.canvas.getObjects().map(o => {
        if (o.type != 'rect' && o.name != 'barcode' && o.name != 'Logo') {
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
          this.clipRectangle = o
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
    loadFromJson() {
      return new Promise((resolve, reject) => {
        this.canvas.loadFromJSON(
          this.svgJson,
          () => {
            this.canvas.renderAll.bind(this.canvas)
            resolve(true)
          },
          (o, obj, error) => {
            this.canvas._objects.push(obj)
          }
        )
      })
    },
    handleSaveTag(edit) {
      this.tagItem.set(edit)
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
      // element.toObject = (function(toObject) {
      //   return function() {
      //     return fabric.util.object.extend(toObject.call(this), {
      //       name: 'text',
      //       editable: false
      //     })
      //   }
      // })(element.toObject)
      this.canvas.add(element)
      element.on('moved', e => {
        this.checkInArea(e)
        this.canvas.renderAll()
      })
    },
    handleDeleteTag() {
      const tag = this.canvas.getActiveObject()
      if (tag) {
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
        height = 500 * scaleHeight
      }
      if (!(scaleWidth > 1)) {
        width = 500 * scaleWidth
      }

      this.clipRectangle.width = 500
      this.clipRectangle.height = 500
      this.canvas.renderAll()

      this.clipRectangle.width = width
      this.clipRectangle.height = height
      this.clipRectangle.left = 550 / 2 - width / 2
      this.clipRectangle.top = 550 / 2 - height / 2
      this.canvas.renderAll()
    },
    checkInArea(e) {
      const left = e.target.left
      const top = e.target.top
      const width =
        e.target.scaleX === 1
          ? e.target.width
          : e.target.scaleX * e.target.width
      const height =
        e.target.scaleY === 1
          ? e.target.height
          : e.target.scaleY * e.target.height
      if (left < -width || left > 550 || top < -height || top > 550) {
        this.handleDeleteTag()
      }
    }
  },
  mounted() {
    if(this.$store.state.labelData.id == '' && sessionStorage.getItem('labelMode') == 'edit'){
      this.$store.state.labelMode = 'edit'
      this.$store.state.labelData = JSON.parse(sessionStorage.getItem('labelData'))
    }
    this.labelMode = this.$store.state.labelMode
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
      selectable: false
    })

    this.canvas.add(this.clipRectangle)
    this.canvas.controlsAboveOverlay = true
    this.canvas.renderAll()

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
        res.data.map(item => {
          if (item.barcode != '') {
            this.productData.push(item)
          }
        })
      })
      .catch(err => {
        console.log(err)
      })

    if (this.labelMode == 'edit') {
      this.tagName = this.$store.state.labelData.tagName
      this.tagDrawWidth = this.$store.state.labelData.wide
      this.tagDrawHeight = this.$store.state.labelData.height
      this.svgJson = JSON.parse(this.$store.state.labelData.svgString)
      this.showSVG()
    }
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
/deep/  .ant-modal-body {
    background: #b2b2b2;
  }
</style>
