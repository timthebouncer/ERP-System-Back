<template>
  <div class="container">
    <div class="loginForm">
      <a-form-model
        layout="vertical"
        :model="formInline"
        ref="ruleForm"
        :rules="rules"
        @submit.native.prevent
      >
        <div class="formTitle">
          <h2>
            進銷存
          </h2>
        </div>
        <a-form-model-item prop="account">
          <div class="account">
            <a-input v-model="formInline.account" placeholder="請輸入帳號">
              <a-icon slot="prefix" type="user" style="color:rgba(12,12,12,0.25)" />
            </a-input>
          </div>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <div class="passWord">
            <a-input
              v-model="formInline.password"
              type="password"
              placeholder="請輸入密碼"
              @pressEnter="handleSubmit"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,0.25)" />
            </a-input>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <div class="checkbox">
            <a-checkbox v-model="checkbox" @change="rememberAccount">
              <span>記住帳號</span>
            </a-checkbox>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <div class="loginBtn">
            <a-button
              class="loginBtnColor"
              type="submit"
              @click="handleSubmit"
            >
              登入
            </a-button>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        account: '',
        password: ''
      },
      checkbox: false,
      rules: {
        account: [{required: true, message: '請輸入帳號', trigger: 'blur'}],
        password: [{required: true, message: '請輸入密碼', trigger: 'blur'}],
      }
    }
  },
  created () {
    if (sessionStorage.getItem('account')){
      this.formInline.account = sessionStorage.getItem('account')
      this.checkbox = Boolean(sessionStorage.getItem('rememberAccountStatus'))
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const formData = new FormData()
          formData.append("username",this.formInline.account)
          formData.append("password", this.formInline.password)
          this.$api.Login.userLogin(formData)
            .then((res)=>{
              this.rememberAccount()
              this.$router.replace('/Inventory')
              console.log(res)
            }).catch(()=>{
              this.$message.error("登入失敗,帳號或密碼錯")
            })
        }
      })
    },
    rememberAccount () {
      if (this.checkbox) {
        if (this.formInline.account) {
          sessionStorage.setItem('account', this.formInline.account)
        }
        sessionStorage.setItem('rememberAccountStatus', this.checkbox)
      } else {
        sessionStorage.removeItem('account')
        sessionStorage.removeItem('rememberAccountStatus')
      }
    },
  }
}
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  background-color: #044e7c;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginForm {
  display: flex;
  justify-content: center;
  background: linear-gradient(to bottom right, #437695, #71BAC3, #2A90E4, #2B69A6, #337FAF);
  box-shadow: 1px 1px 15px #4a4444;
  padding: 50px 0px 20px 0px;
  width: 350px;
  border-radius: 5px;
}
.formTitle {
  display: flex;
  justify-content: center;
  margin: 10px 0 50px 0px;
}
.formTitle h2{
  font-weight: bold;
  color: #fcfcfc;
}
.account {
  //width: 300px;
}
.passWord {
  //width: 300px;
}
.loginBtn {
  display: flex;
  justify-content: center;
}
.loginBtnColor{
  color: #fcfcfc;
  font-weight: bold;
  background-color: #2769B4;
}
.checkbox span{
  color: #fcfcfc;
  font-weight: bold;
}
</style>
