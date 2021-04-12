<template>
    <div>
        <a-button @click="ipSetting"><a-icon type="setting" /><span>設定IP位址</span></a-button>
        <a-modal
                v-model="visible"
                :title="'IP設定'"
                width="500px"
        >
            <div></div>
        </a-modal>
    </div>
</template>
<script>
    export default {
      name:'setIp',
      data(){
        return{
          visible:false
        }
      },
      methods:{
        ipSetting(){
          this.visible = true
        }
      }
    }
</script>
