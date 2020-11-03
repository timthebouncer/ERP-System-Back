<template>
  <a-locale-provider :locale="zh_TW">
    <App />
  </a-locale-provider>
</template>
<script>
import zh_TW from "ant-design-vue/lib/locale-provider/zh_TW";
import moment from "moment";
import "moment/locale/zh-tw";

moment.locale("zh-tw");
export default {
  data() {
    return {
      zh_TW
    };
  }
};
</script>
