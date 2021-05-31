<template>
  <div>
    <a-layout style="padding:20px;">
      <a-space>
        <span style="color: red;">*</span><span>標籤名稱</span
        ><a-input v-model="tagName" placeholder="請輸入"></a-input>
        <span style="color: red; margin-left: 20px;">*</span
        ><span>標籤尺寸</span><span>寬</span
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
        <a-col :span="12" style="height: 100%;">
          <a-row class="label-control" align="middle" style="height: 100%;">
            <a-row>
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
                  style="width: 300px; height: 55px;"
                  @drag="handleDrag(logoTag, 'Logo')"
                />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text" style="width: 300px;">
                    <p>上傳圖片</p>
                    <p style="color: red;">
                      (*請使用JPEG、PNG、SVG格式且大小不超過2MB)
                    </p>
                  </div>
                </div>
              </a-upload>
            </a-row>
            <a-row
              class="label-wrap"
              type="flex"
              style="margin-left: 0px;"
              justify="center"
            >
              <a-col>
                <a-row type="flex">
                  <p>請選擇商品</p>
                </a-row>
                <a-row type="flex" style="margin-top: -10px;">
                  <a-auto-complete
                    v-model="searchProductName"
                    @search="searchProduct"
                    @select="selectProduct"
                    placeholder="請輸入商品名稱"
                    style="width: 300px;"
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
              </a-col>
            </a-row>
            <a-row>
              <a-row>
                入庫時間
                <span style="color: red;">
                  ＊注意 : 預覽時顯示當天時間
                </span>
              </a-row>
              <a-row class="label-wrap" type="flex" justify="space-between">
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(todayTag, 'today')"
                  draggable
                  >{{ todayTag }}</a-col
                >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(pSolarDayTag, 'pSolarDay')"
                  draggable
                  style="margin-left: 20px; margin-right: 20px;"
                  >{{ pSolarDayTag }}</a-col
                >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(rSolarDayTag, 'rSolarDay')"
                  draggable
                  >{{ rSolarDayTag }}</a-col
                >
              </a-row>
              <a-divider style="background-color: black; height: 1px;" />
            </a-row>
            <a-row>
              <a-row
                class="label-wrap"
                type="flex"
                justify="space-between"
                style="margin-top: -30px; margin-bottom: 20px;"
              >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(productNameTag, 'productName')"
                  draggable
                  >{{ productNameTag }}</a-col
                >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(weightTag, 'weight')"
                  draggable
                  style="margin-left: 20px; margin-right: 20px;"
                  >{{ weightTag }}</a-col
                >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(unitTag, 'unit')"
                  draggable
                  >{{ unitTag }}</a-col
                >
              </a-row>
              <a-row
                class="label-wrap"
                type="flex"
                justify="space-between"
                style="margin-bottom: 20px;"
              >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(barcodeTag, 'barcode')"
                  draggable
                >
                  <img
                    v-if="barcodeImageUrl"
                    class="barcodeImg"
                    :src="barcodeImageUrl"
                    alt="avatar"
                    style="height: 45px; transform: scale(2.5, 1);"
                  />
                  <span v-else>{{ barcodeTag }}</span>
                </a-col>
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(productNoTag, 'productNo')"
                  draggable
                  style="margin-left: 20px; margin-right: 20px;"
                  >{{ productNoTag }}</a-col
                >
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag('text', 'text')"
                  draggable
                  >TEXT</a-col
                >
              </a-row>
              <a-row class="label-wrap" type="flex" justify="space-between">
                <a-col
                  :span="3"
                  class="tags"
                  @drag="handleDrag(priceTag, 'price')"
                  draggable
                  >{{ priceTag }}</a-col
                >
                <!--                <a-col-->
                <!--                  :span="3"-->
                <!--                  class="tags"-->
                <!--                  @drag="handleDrag(salesPriceTag, 'salesPrice')"-->
                <!--                  draggable-->
                <!--                  style="margin-left: 20px; margin-right: 20px;"-->
                <!--                  >{{ salesPriceTag }}</a-col-->
                <!--                >-->
                <a-col
                  :span="3"
                  style="width: 200px; display: flex; justify-content: center; align-items: center;"
                ></a-col>
              </a-row>
            </a-row>
          </a-row>
        </a-col>
        <a-col :span="10" style="height: 100%;">
          <!--          <a-row style="height: 10%;">-->

          <!--          </a-row>-->
          <!--          <a-row type="flex" style="height: 90%;" align="middle" justify="center">-->
          <div class="label-canvas">
            <span>
              <span style="color: red;"
                >＊重量預設顯示100，列印時會依實際重量為主</span
              >
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
import { computedWeight } from '@/unit/dictionary/computed'
import formatPrice from "../../components/thousand";
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
        { name: 'today', text: '當天時間', width: 0 },
        { name: 'pSolarDay', text: '正向太陽日', width: 0 },
        { name: 'rSolarDay', text: '反向太陽日', width: 0 },
        { name: 'productName', text: '商品名稱', width: 0 },
        { name: 'barcode', text: '商品條碼', width: 0 },
        { name: 'productNo', text: '商品序號', width: 0 },
        // { name: 'costPrice', text: '成本價', width: 0 },
        // { name: 'listPrice', text: '建議售價', width: 0 },
        // { name: 'salesPrice', text: '出貨售價', width: 0 },
        { name: 'price', text: '價格', width: 0 },
        { name: 'weight', text: '重量', width: 0 },
        { name: 'unit', text: '計價單位', width: 0 },
        { name: 'text', text: 'TEXT', width: 0 },
        { name: 'Logo', text: 'Logo', width: 0 }
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
      todayTag: '當天時間',
      pSolarDayTag: '正向太陽日',
      rSolarDayTag: '反向太陽日',
      today:'',
      pSolarDay:'',
      rSolarDay:'',
      productNameTag: '商品名稱',
      barcodeTag: '商品條碼',
      productNoTag: '商品序號',
      barcodeImageUrl: '',
      // costPriceTag: '成本價',
      // listPriceTag: '建議售價',
      // salesPriceTag: '出貨售價',
      priceTag: '價格',
      weightTag: '重量',
      unitTag: '計價單位',
      logoTag: 'Logo',
      previewed: false,
      showModalVisible: false,
      imageDataUrl: '',
      loading: false,
      logoImageUrl: '',
      nameTagFlag: false,
      barcodeTagFlag: false,
      productNoTagFlag: false
    }
  },
  computed: {
    computedWeight() {
      return computedWeight
    }
  },
  methods: {
    uploadChange(info) {
      // console.log(info.file.originFileObj)
      if (info.file.status === 'uploading') {
        this.loading = true
        setTimeout(() => {
          info.file.status = 'done'
        }, 1000)
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
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
      if (!isJpgOrPng) {
        this.$message.error('請上傳JPEG、PNG、SVG檔案格式圖片!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('圖片大小超過2MB!')
        return false
      }
      return true
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
      this.$api.Label.searchProduct(value, '', 'COMMERCIAL')
        .then(res => {
          let data = []
          res.data.map(item => {
              data.push(item)
          })
          this.productData = data
          this.$api.Label.searchProduct(value, '', 'RETAIL')
                  .then(res => {
                    res.data.map(item => {
                      this.productData.push(item)
                    })
                  })
                  .catch(err => {
                    console.log(err)
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
      this.todayTag = this.today
      this.pSolarDayTag = this.pSolarDay.toString()
      this.rSolarDayTag = this.rSolarDay.toString()
      this.productNameTag = '商品名稱:' + item.name
      this.productNoTag = '1'
      this.barcodeTag = '商品條碼' + item.barcode
      // this.costPriceTag = '成本價:' + item.costPrice + '元'
      // this.listPriceTag = '建議售價:' + item.listPrice + '元'
      // this.salesPriceTag = '出貨售價:' + item.salesPrice + '元'
      this.priceTag = '價格:$' + formatPrice(item.price) + '元'
      this.weightTag = '重量:100'
      this.unitTag = '計價單位:' + computedWeight(undefined, item.unit)
      this.logoTag = 'Logo'
      this.previewed = true

      this.currentDrag.find(
        x => x.name == 'productName'
      ).text = this.productNameTag
      this.currentDrag.find(x => x.name == 'today').text = this.todayTag
      this.currentDrag.find(x => x.name == 'pSolarDay').text = this.pSolarDayTag
      this.currentDrag.find(x => x.name == 'rSolarDay').text = this.rSolarDayTag
      this.currentDrag.find(x => x.name == 'productNo').text = this.productNoTag
      this.currentDrag.find(x => x.name == 'barcode').text = this.barcodeTag
      // this.currentDrag.find(x => x.name == 'costPrice').text = this.costPriceTag
      // this.currentDrag.find(x => x.name == 'listPrice').text = this.listPriceTag
      // this.currentDrag.find(
      //   x => x.name == 'salesPrice'
      // ).text = this.salesPriceTag
      this.currentDrag.find(x => x.name == 'price').text = this.priceTag
      this.currentDrag.find(x => x.name == 'weight').text = this.weightTag
      this.currentDrag.find(x => x.name == 'unit').text = this.unitTag
      this.currentDrag.find(x => x.name == 'text').text = 'TEXT'
      this.currentDrag.find(x => x.name == 'Logo').text = this.logoTag

      function loadImage() {
        return new Promise(resolve => {
          this.barcodeImageUrl = 'data:image/svg+xml;base64,' + item.barcodeBase64
          resolve(true)
        })
      }
      if(item.barcodeBase64!=null){
        await loadImage.bind(this)()
      }

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
            element.scaleX = scaleX
            element.scaleY = scaleY
            element.width = 95
            element.height = 71
            element.setControlsVisibility({
              mt: false,
              mb: false,
              ml: false,
              mr: false,
              mtr: false,
            })
            this.canvas.add(element)
            element.on('moved', e => {
              this.checkInArea(e)
              this.canvas.renderAll()
            })
            this.canvas.renderAll()
          } else {
            o.text = this.currentDrag.find(x => x.name == o.name).text
            this.currentDrag.find(x => x.name == o.name).width = o.width
          }
        }
      })
      this.canvas.renderAll()
    },
    resetTag() {
      if(!this.previewed){
        return
      }
      this.productData = []
      this.previewed = false
      this.searchProductName = ''
      this.todayTag = '當天時間'
      this.pSolarDayTag = '正向太陽日'
      this.rSolarDayTag = '反向太陽日'
      this.productNameTag = '商品名稱'
      this.barcodeTag = '商品條碼'
      this.productNoTag = '商品序號'
      // this.costPriceTag = '成本價'
      // this.listPriceTag = '建議售價'
      // this.salesPriceTag = '出貨售價'
      this.priceTag = '價格'
      this.weightTag = '重量'
      this.unitTag = '計價單位'
      this.logoTag = 'Logo'

      this.currentDrag.find(
        x => x.name == 'productName'
      ).text = this.productNameTag
      this.currentDrag.find(x => x.name == 'today').text = this.todayTag
      this.currentDrag.find(x => x.name == 'pSolarDay').text = this.pSolarDayTag
      this.currentDrag.find(x => x.name == 'rSolarDay').text = this.rSolarDayTag
      this.currentDrag.find(x => x.name == 'productNo').text = this.productNoTag
      this.currentDrag.find(x => x.name == 'barcode').text = this.barcodeTag
      // this.currentDrag.find(x => x.name == 'costPrice').text = this.costPriceTag
      // this.currentDrag.find(x => x.name == 'listPrice').text = this.listPriceTag
      // this.currentDrag.find(
      //   x => x.name == 'salesPrice'
      // ).text = this.salesPriceTag
      this.currentDrag.find(x => x.name == 'price').text = this.priceTag
      this.currentDrag.find(x => x.name == 'weight').text = this.weightTag
      this.currentDrag.find(x => x.name == 'unit').text = this.unitTag
      this.currentDrag.find(x => x.name == 'text').text = 'TEXT'
      this.currentDrag.find(x => x.name == 'Logo').text = this.logoTag
      this.canvas.getObjects().map(o => {
        if (
          this.currentDrag.findIndex(x => x.name == o.name) != -1 &&
          o.name != 'text'
        ) {
          if (o.name == 'barcode' && this.barcodeImageUrl) {
            let { width, height, left, top, scaleX, scaleY } = o
            this.canvas.remove(o)
            let element
            element = new fabric.Text(`\n{{商品條碼}}`, {
              fontFamily: '微軟正黑體',
              fontSize: 18,
              hasControls: true,
              left: left,
              top: top,
              name: 'barcode'
            })
            element.scaleX = scaleX
            element.scaleY = scaleY
            element.width = 95
            element.height = 71
            element.setControlsVisibility({
              mt: false,
              mb: false,
              ml: false,
              mr: false,
              mtr: false,
            })
            this.canvas.add(element)
            element.on('moved', e => {
              this.checkInArea(e)
              this.canvas.renderAll()
            })
            this.canvas.renderAll()
          } else {
            o.text =
              '{{' + this.currentDrag.find(x => x.name == o.name).text + '}}'
            o.width = this.currentDrag.find(x => x.name == o.name).width
          }
        }
      })
      this.canvas.renderAll()

      this.barcodeImageUrl = ''
      this.productData = []
      this.$api.Label.searchProduct('', '', 'COMMERCIAL')
        .then(res => {
          res.data.map(item => {
              this.productData.push(item)
          })
          this.$api.Label.searchProduct('', '', 'RETAIL')
                  .then(res => {
                    res.data.map(item => {
                      this.productData.push(item)
                    })
                  })
                  .catch(err => {
                    console.log(err)
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
          this.barcodeTagFlag = true
          this.hasTags.push(this.currentDragName)
          if (this.barcodeImageUrl) {
            let imgElement = document.getElementsByClassName('barcodeImg')[0]
            element = new fabric.Image(imgElement, {
              name: 'barcode',
              scaleX: 1.5,
              scaleY: 1.5,
            })
            element.width = 95
            element.height = 71
          } else {
            element = new fabric.Text(
              this.previewed
                ? this.currentDragText
                : `\n{{${this.currentDragText}}}`,
              {
                fontFamily: '微軟正黑體',
                fontSize: 18,
                hasControls: true,
                scaleX: 1.5,
                scaleY: 1.5,
                name: this.currentDragName,
                textAlign: 'center',
              }
            )
            element.width = 95
            element.height = 71
          }
          element.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            mtr: false,
          })
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
          if (this.currentDragName == 'productName') {
            this.nameTagFlag = true
          }
          if (this.currentDragName == 'productNo') {
            this.productNoTagFlag = true
          }
          this.hasTags.push(this.currentDragName)
          element = new fabric.Textbox(
            this.previewed
              ? this.currentDragText
              : `{{${this.currentDragText}}}`,
            {
              fontSize: 30,
              fontFamily: '微軟正黑體',
              hasControls: true,
              textAlign: 'left',
              editable: false,
              name: this.currentDragName
            }
          )
          element.setControlsVisibility({
            mt: false, // middle top disable
            mb: false, // middle bottom
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
      if (
        e.target &&
        e.target.name != 'barcode' &&
        e.target.name != 'Logo' &&
        e.target.type != 'rect'
      ) {
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
      if (!this.nameTagFlag) {
        this.$message.warning('請加入商品名稱標籤模塊')
        return
      } else if (!this.productNoTagFlag) {
        this.$message.warning('請加入商品序號標籤模塊')
        return
      } else if (!this.barcodeTagFlag) {
        this.$message.warning('請加入商品條碼標籤模塊')
        return
      }

      if (this.previewed) {
        this.resetTag()
      }

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

        console.log(data,'export data');
        console.log(svgJson,'export svgJson');
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
          this.currentDrag.find(x => x.name == o.name).width = o.width
        } else if (o.type == 'rect') {
          this.clipRectangle = o
          o.selectable = false
        } else if (o.name == 'barcode') {
          let { width, height, left, top, scaleX, scaleY } = o
          this.canvas.remove(o)
          let element
          element = new fabric.Text(`\n{{商品條碼}}`, {
            fontFamily: '微軟正黑體',
            fontSize: 18,
            hasControls: true,
            left: left,
            top: top,
            name: 'barcode'
          })
          element.scaleX = scaleX
          element.scaleY = scaleY
          element.width = 95
          element.height = 71
          element.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            mtr: false,
          })
          this.canvas.add(element)
          element.on('moved', e => {
            this.checkInArea(e)
            this.canvas.renderAll()
          })
          this.canvas.renderAll()
        }

        if (o.name != 'text') {
          this.hasTags.push(o.name)
        }
        if(o.name != 'barcode'){
          o.on('moved', e => {
            this.checkInArea(e)
            this.canvas.renderAll()
          })
        }

      })
      this.canvas.controlsAboveOverlay = true

      this.canvas.renderAll()
    },
    loadFromJson() {
      return new Promise(resolve => {
        this.canvas.loadFromJSON(
          this.svgJson,
          () => {
            this.canvas.renderAll.bind(this.canvas)
            resolve(true)
          },
          (o, obj) => {
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
      //     return fabric.utils.object.extend(toObject.call(this), {
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
        if (tag.name == 'productName') {
          this.nameTagFlag = false
        }
        if (tag.name == 'productNo') {
          this.productNoTagFlag = false
        }
        if (tag.name == 'barcode') {
          this.barcodeTagFlag = false
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
    if (
      this.$store.state.labelData.id == '' &&
      sessionStorage.getItem('labelMode') == 'edit'
    ) {
      this.$store.state.labelMode = 'edit'
      this.$store.state.labelData = JSON.parse(
        sessionStorage.getItem('labelData')
      )
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

    let today = new Date();
    this.today =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1 < 10 ? "0" : "") +
            (today.getMonth() + 1) +
            "-" +
            (today.getDate() < 10 ? "0" : "") +
            today.getDate();

    //正向太陽日 今天是一年中的第幾天
    this.pSolarDay = Math.ceil(
            (new Date() - new Date(new Date().getFullYear().toString())) /
            (24 * 60 * 60 * 1000)
    );
    //反向太陽日 一年幾天-正向太陽日+今天
    this.rSolarDay = 365 - this.pSolarDay + 1;

    this.productData = []
    this.$api.Label.searchProduct('', '', 'COMMERCIAL')
      .then(res => {
        res.data.map(item => {
            this.productData.push(item)
        })
        this.$api.Label.searchProduct('', '', 'RETAIL')
                .then(res => {
                  res.data.map(item => {
                    this.productData.push(item)
                  })
                })
                .catch(err => {
                  console.log(err)
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
      this.nameTagFlag = true
      this.productNoTagFlag = true
      this.barcodeTagFlag = true
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
    padding: 0 0px;
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
/deep/ .ant-modal-body {
  background: #b2b2b2;
}
/deep/ .ant-upload-picture-card-wrapper {
  display: flex;
}
/deep/ .ant-upload {
  margin: auto;
}
</style>
