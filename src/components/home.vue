<template>
  <!--  页面主体区域-->
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>首页</span>
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
          <template v-for="item in menulist">
            <el-submenu v-if="item.children.length !== 0" :index="item.id+''" :key="item.id">
              <!--              一级菜单的模板区域-->
              <template slot="title">
                <!--              图标-->
                <i :class="item.icon"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!--            二级菜单-->
              <el-menu-item :index="subItem.id" v-for="subItem in item.children" :key="subItem.id">
                <i :class="subItem.icon"></i>
                <span>{{ subItem.name }}</span>
              </el-menu-item>
            </el-submenu>
            <template v-else>
              <el-menu-item :index="item.id+''" :key="item.id">
                <i :class="item.icon"></i>
                <span>{{ item.authName }}</span>
              </el-menu-item>
            </template>
          </template>
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
          'authName': '首页',
          'children': [],
          'id': 1,
          'path': 'users',
          'icon': 'el-icon-s-home',
        },
        {
          'authName': '模块',
          'children': [
            {
              'id': '2-1',
              'name': '模块1',
              'path': 'users',
              'icon': 'el-icon-monitor',
            },
            {
              'id': '2-2',
              'name': '模块2',
              'path': 'users',
              'icon': 'el-icon-monitor',
            },
          ],
          'id': 2,
          'path': 'users',
          'icon': 'el-icon-s-marketing',
        },
        {
          'authName': '统计',
          'children': [
            {
              'id': '3-1',
              'name': '统计1',
              'path': 'users',
              'icon': 'el-icon-monitor',
            },
            {
              'id': '3-2',
              'name': '统计2',
              'path': 'users',
              'icon': 'el-icon-monitor',
            },
          ],
          'id': 3,
          'path': 'users',
          'icon': 'el-icon-s-data',
        },
        {
          'authName': '设置',
          'children': [
            {
              'id': '4-1',
              'name': '设置1',
              'path': 'users',
              'icon': 'el-icon-monitor',
            },
            {
              'id': '4-2',
              'name': '设置2',
              'path': 'users',
              'icon': 'el-icon-monitor',
            },
          ],
          'id': 4,
          'path': 'users',
          'icon': 'el-icon-setting',
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

.el-menu {
  width: 100%;
}

.el-aside {
  background-color: #373d41;
}

.el-main {
  background-color: #eaeaf1;
}
</style>