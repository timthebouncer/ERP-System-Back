<template>
  <div>
  </div>
</template>
<script>
  export default {
    name : "Session",
     created(){
      setTimeout(LogginSession(){
        alert("200")
       },3000)
     },
    methods:{
      LogginSession(){
        this.$api.Login.loginIdentify()
            .then((res)=>{
              console.log(res)
            })
      }
    }
  }
</script>
