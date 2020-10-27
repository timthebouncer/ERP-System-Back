<template>
  <div>
  <a-layout>
    <a-space>
      <span>*標籤名稱</span><a-input placeholder="請輸入"></a-input>
      <span>*標籤尺寸</span><span>寬</span><a-input placeholder="請輸入"></a-input><span>X</span><span>高</span><a-input placeholder="請輸入"></a-input><span>mm</span>
    </a-space>
    <a-space>
      <span>字型</span><a-select></a-select><span>文字大小</span><a-select></a-select>
      <a-button-group>
        <a-button><a-icon type="bold" /></a-button>
        <a-button><a-icon type="underline" /></a-button>
        <a-button><a-icon type="align-left" /></a-button>
        <a-button><a-icon type="align-center" /></a-button>
        <a-button><a-icon type="align-right" /></a-button>
      </a-button-group>
    </a-space>
  </a-layout>
  <a-divider />
    <a-layout style="width: 90%; height: 600px;">
<!--      <a-space>-->
      <a-row type="flex" style="height: 100%;" align="middle">
        <a-col :span="10" STYLE="height: 50%;">
<!--        <a-col :span="10" style="background: #1890ff;">-->
          <a-row type="flex" align="middle" style="height: 100%;">
            <a-col :span="24" style="height: 80%;">
          <a-row type="flex" justify="space-around" style="height: 25%;"><a-col></a-col><a-col :span="6" class="tags">商品名稱</a-col><a-col :span="6" class="tags">商品條碼</a-col><a-col></a-col></a-row>
          <a-row type="flex" justify="space-around" style="height: 25%;"><a-col></a-col><a-col :span="6" class="tags">成本價</a-col><a-col :span="6" class="tags">建議售價</a-col><a-col></a-col></a-row>
          <a-row type="flex" justify="space-around" style="height: 25%;"><a-col></a-col><a-col :span="6" class="tags">重量</a-col><a-col :span="6" class="tags">單位</a-col><a-col></a-col></a-row>
          <a-row type="flex" justify="space-around" style="height: 25%;"><a-col></a-col><a-col :span="6" class="tags">售價</a-col><a-col :span="6" class="tags">TEXT</a-col><a-col></a-col></a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="14" style="height: 100%;">
          <a-row type="flex" justify="center" align="middle" style="height: 90%;">
            <a-col span="20" style="background: #fff; height: 85%; border: #000 solid 2px;"></a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle" style="height: 10%;">
            <a-col :span="4" style="text-align: center;"><a-button style="">取消</a-button></a-col>
            <a-col :span="2"></a-col>
            <a-col :span="4" style="text-align: center;"><a-button type="primary">儲存</a-button></a-col>
          </a-row>
        </a-col>
      </a-row>
<!--      </a-space>-->
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "index"
};
</script>

<style scoped>
  .tags{
    background: #fff;
    height: 30px;
    border: #000 solid 1px;
    font-size: larger;
    text-align: center;
  }
</style>
