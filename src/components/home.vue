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
            active-text-color="#409EFF">
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--              一级菜单的模板区域-->
            <template slot="title">
              <!--              图标-->
              <i :class="item.icon"></i>
              <span>{{ item.authName}}</span>
            </template>
            <!--            二级菜单-->
            <el-menu-item :index="subItem.id"  v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span>{{subItem.name}}</span>
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
  data() {
    return {
      // 左侧菜单数据
      menulist: [
        {
          'authName': '用户管理',
          'children': [
            {
              'id':'11',
              'name':'子菜单1'
            },
            {
              'id':'12',
              'name':'子菜单2'
            },
          ],
          'id': 1,
          'order': 2,
          'path': 'users',
          'icon':'el-icon-s-grid',
        },
        {
          'authName': '商品管理',
          'children': [
            {
              'id':'21',
              'name':'子菜单3'
            },
            {
              'id':'22',
              'name':'子菜单4'
            },
          ],
          'id': 2,
          'order': 3,
          'path': 'users',
          'icon': 'el-icon-s-data',
        },
      ]
    }
  },
  name: "home",
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push({path: '/login'})
    },
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