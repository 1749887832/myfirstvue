<template>
  <!--  页面主体区域-->
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>接口自动化平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    主体区-->
    <el-container>
      <el-aside width="200px">
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-submenu index="1">
            <!--              一级菜单的模板区域-->
            <template slot="title">
              <!--              图标-->
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item index="1-4-1">
              <i class="el-icon-location"></i>
              <span>选项1</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push({path: '/login'})
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  width: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 16px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }

    img {
      display: flex;
      height: 40px;
      width: 40px;
    }
  }
}

.el-aside {
  background-color: #373d41;
}

.el-main {
  background-color: #eaeaf1;
}
</style>