<template>
  <div class="container">
    <div class="loginForm">
      <a-form-model
        layout="vertical"
        :model="formInline"
        @submit="handleSubmit"
        @submit.native.prevent
      >
        <div class="formTitle">
          <h2>
            進銷存
          </h2>
        </div>
        <a-form-model-item>
          <div class="userName">
            <a-input v-model="formInline.account" placeholder="Username">
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <div class="passWord">
            <a-input
              v-model="formInline.password"
              type="password"
              placeholder="Password"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <div>
            <a-checkbox v-model="checkbox" name="type">
              記住帳號
            </a-checkbox>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <div class="loginBtn">
            <a-button
              type="primary"
              html-type="submit"
              :disabled="formInline.account === '' || formInline.password === ''"
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
      checkbox: false
    }
  },
  created () {
      if(localStorage.getItem('account')){
        this.formInline.account = localStorage.getItem('account')
        this.checkbox = localStorage.getItem('rememberAccount')
      }
  },
  methods: {
    handleSubmit() {
      localStorage.setItem("account","")
      console.log(this.formInline)
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 500px;
  margin: 0px auto;
  background-color: #7cd3f3;
}
.loginForm {
  display: flex;
  justify-content: center;
  padding: 50px 0px 20px 0px;
}
.formTitle {
  display: flex;
  justify-content: center;
  margin-bottom: 70px;
}
.userName {
  height: 70px;
  width: 300px;
}
.passWord {
  height: 70px;
  width: 300px;
}
.loginBtn {
  display: flex;
  justify-content: center;
}
</style>
