<template>
  <div class="login_container">
    <div class="login_box">
      <!-- ロゴ設定 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- elementUI form -->
      <el-form label-width="80px">
        <el-form-item label="username">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {}
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
}
</style>
