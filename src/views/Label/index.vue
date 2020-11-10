<template>
  <div>
    <a-layout style="padding:20px;">
      <a-space>
        <span>*標籤名稱</span><a-input placeholder="請輸入"></a-input>
        <span>*標籤尺寸</span><span>寬</span
        ><a-input-number
          v-model="tagDrawWidth"
          placeholder="請輸入"
          defaultValue="100"
          @pressEnter="handleChangeSize"
        /><span>X</span><span>高</span
        ><a-input-number
          v-model="tagDrawHeight"
          placeholder="請輸入"
          defaultValue="100"
          @pressEnter="handleChangeSize"
        /><span>mm</span>
      </a-space>
    </a-layout>
    <a-divider />
    <a-layout style="width: 100%; height: 600px;">
      <a-row type="flex" style="height: 100%;" align="middle">
        <a-col :span="10" style="height: 100%;">
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
        <a-col :span="14" style="height: 100%;">
          <div class="label-canvas">
            <span>＊重量預設顯示100，列印時會依實際重量為主</span>
            <a-button
              size="small"
              class="del-button"
              type="danger"
              @click="handleDeleteTag"
              >移除標籤</a-button
            >
            <canvas id="label-fabric" width="500" height="500" />
          </div>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" align="middle" style="height:100px;">
        <a-space :size="150">
          <a-button @click="canvas.clear()">取消</a-button>
          <a-button type="primary" @click="exportSVG">儲存</a-button>
        </a-space>
      </a-row>
    </a-layout>
    <TagsDetail ref="tagsDetail" :tagItem="tagItem" @saveTag="handleSaveTag" />
    <TextConfirm @confirmText="confirmText" ref="textConfirm" />
  </div>
</template>

<script>
import { fabric } from 'fabric'
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
      tagDrawWidth: 100,
      tagDrawHeight: 100
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
      if (this.currentDrag === 'text') {
        this.currentDrag = {
          text: this.currentDrag,
          offsetX,
          offsetY
        }
        this.$refs.textConfirm.visible = true
        return
      } else if (this.currentDrag === '商品條碼') {
        element = new fabric.Text(`{{${this.currentDrag}}}`, {
          fontFamily: '微軟正黑體',
          hasControls: true
        })
      } else {
        element = new fabric.Text(`{{${this.currentDrag}}}`, {
          fontFamily: '微軟正黑體',
          hasControls: false
        })
      }
      element.left = offsetX - element.width / 2
      element.top = offsetY - element.height / 2
      this.canvas.add(element)
    },
    handleClickTags(e) {
      console.log(e.target)
      if (e.target) {
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
      console.log(this.canvas.toSVG())
    },
    handleSaveTag(edit) {
      this.tagItem.set(edit)
      console.log(this.tagItem)
      this.canvas.renderAll()
    },
    confirmText(text) {
      let element = new fabric.Text(text.text, {
        fontFamily: '微軟正黑體',
        fontSize: text.fontSize,
        fontWeight: text.bold ? 'bold' : 'normal',
        hasControls: false,
        underline: text.underline
      })
      element.left = this.currentDrag.offsetX - element.width / 2
      element.top = this.currentDrag.offsetY - element.height / 2
      this.canvas.add(element)
    },
    handleDeleteTag() {
      const tag = this.canvas.getActiveObject()
      if (tag) {
        this.canvas.remove(tag)
      }
    },
    handleChangeSize() {
      let width = 500
      let height = 500 * (this.tagDrawHeight/this.tagDrawWidth)
      this.canvas.setDimensions({
        width: width,
        height: height
      })
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas('label-fabric')
    this.canvas.on('drop', this.handleDrop)
    this.canvas.on('mouse:dblclick', this.handleClickTags)
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
    canvas{
      background: #fff;
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
</style>
