<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="header-icon" src="../assets/manager.png" alt />
        <span>ECサイト管理システム</span>
      </div>
      <el-button @click="logout">logout</el-button>
    </el-header>
    <!-- main -->
    <el-container>
      <!-- aside -->
      <el-aside :width="isToggle ? '64px' : '200px'">
        <!-- collapse -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isToggle"
          :collapse-transition="false"
          router
          :default-active="activedPath"
        >
          <!-- first menu -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- second menu -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- routerの位置を占める -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isToggle: false,
      activedPath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activedPath = window.sessionStorage.getItem('activedPath')
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList () {
      this.$http.get('menus')
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message_error(res.data.meta.msg)
          } else {
            this.menuList = res.data.data
          }
        })
        .catch(err => {
        })
    },
    toggleCollapse () {
      this.isToggle = !this.isToggle
    },

    saveNavState (activedPath) {
      window.sessionStorage.setItem('activedPath', activedPath)
      this.activedPath = activedPath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.header-icon {
  width: 64px;
  height: 64px;
  background-color: #ffffff;
  border-radius: 10px;
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  background-color: #4a5064;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
</style>
