<template>
  <div class="login-container">
    <h2>login</h2>
    <el-form ref="login-form" :model="loginForm" :rules="loginRules">
      <el-form-item label="User Name" prop="username">
        <el-input v-model="loginForm.username" type="text"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click.prevent="handleLogin">登陆</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {Login} from '@/api/getData'
  import {setTokenForLogin} from "@/utils/auth";

  export default {
    name: 'Login',
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loading: false,
        redirect: '',
        loginRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleLogin () {
        // loginByusername
        this.loading = true
        this.$refs['login-form'].validate((valid) => {
          if (valid) {
            // do submit
            Login(this.loginForm).then(response => {
              this.loading = false;
              const data = response.data
              if (data.errcode) {
                this.$notify.error({
                  title: '登陆失败！',
                  message: data.errmsg
                })
              } else {
                setTokenForLogin(data.result)
                this.$notify.success({
                  title: '登陆成功！',
                  message: data.username
                });
              }
            }).catch(error => {
                this.$notify.error({
                  title: '登陆失败！',
                  message: error.message
                })
                setTimeout(() => {
                  this.loading = false
                }, 500)
            })
            // this.$store.dispatch('loginByUsername', this.loginForm).then(response => {
            //   this.$router.push({
            //     name: 'Dashboard'
            //   })
            // }).catch(error => {
            //   this.$notify.error({
            //     title: '登陆失败！',
            //     message: error.message
            //   })
            //   setTimeout(() => {
            //     this.loading = false
            //   }, 500)
            // })
          } else {
            this.loading = false
            this.$message.error('请修复错误重新提交！')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-container {
    width: 200px;
    margin: 100px auto;
  }
</style>
