<template>
  <div class="login_container">
    <div class="login_box">
      <!-- ロゴ設定 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- elementUI form -->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" style="width:100px;" @click="login">登録</el-button>
          <el-button type="info" style="width:100px;" @click="resetLoginForm">リセット</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // データバインディング
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // username検証
        username: [
          { required: true, message: 'ユーザー名を入力してください', trigger: 'blur' },
          { min: 3, max: 10, message: '長さは3−10文字になります', trigger: 'blur' }
        ],
        // パスワードの検証
        password: [
          { required: true, message: 'パスワードを入力してください', trigger: 'blur' },
          { min: 6, max: 15, message: '長さは6−15文字になります', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // formの内容や検証などを取り戻す
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('login', this.loginForm)
          .then(res => {
            console.log(res.data)
            const data = res.data
            if (data.meta.status !== 200) {
              this.$message_error('登録失敗')
            } else {
              this.$message_success('登録成功')
              // tokenを保存する
              window.sessionStorage.setItem('token', data.data.token)
              // /homeに遷移する
              this.$router.push('/home')
            }
          })
          .catch(err => {
            console.error(err)
            this.$message_error('登録失敗')
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 140px;
    height: 140px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    padding: 10px;
    background-color: #fff;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
