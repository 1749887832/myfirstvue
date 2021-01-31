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
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
            mode="vertical"
            :collapse="isCollapse"
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            collapse-transition
            router>
          <template v-for="item in menulist">
            <el-submenu v-if="item.children.length !== 0" :index="item.path+''" :key="item.id">
              <!--              一级菜单的模板区域-->
              <template slot="title">
                <!--              图标-->
                <i :class="item.icon"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!--            二级菜单-->
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNavState(subItem.path)">
                <i :class="subItem.icon"></i>
                <span>{{ subItem.name }}</span>
              </el-menu-item>
            </el-submenu>
            <template v-else>
              <el-menu-item :index="item.path+''" :key="item.id" @click="saveNavState(item.path)">
                <i :class="item.icon"></i>
                <span>{{ item.authName }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <!--        放一个路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Message from 'element-ui'

export default {
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 左侧菜单数据
      menulist: [
        {
          'authName': '首页管理',
          'children': [],
          'id': 1,
          'path': 'welcome',
          'icon': 'el-icon-s-home',
        },
        {
          'authName': '模块',
          'children': [
            {
              'id':'2-1',
              'name':'系统模块',
              'path':'model',
              'icon':'el-icon-monitor',
            },
            {
              'id': '2-2',
              'name': '系统环境',
              'path': 'server',
              'icon': 'el-icon-monitor',
            },
            {
              'id': '2-3',
              'name': '系统变量',
              'path': 'global',
              'icon': 'el-icon-monitor',
            },
            {
              'id':'2-4',
              'name':'请求头',
              'path':'headers',
              'icon':'el-icon-monitor',
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
              'name': '测试单',
              'path': 'test',
              'icon': 'el-icon-monitor',
            },
            {
              'id': '3-2',
              'name': '用例',
              'path': 'case_nva',
              'icon': 'el-icon-monitor',
            },
          ],
          'id': 3,
          'path': 'users5',
          'icon': 'el-icon-s-data',
        },
        {
          'authName': '设置',
          'children': [
            {
              'id': '4-1',
              'name': '设置1',
              'path': 'users6',
              'icon': 'el-icon-monitor',
            },
            {
              'id': '4-2',
              'name': '设置2',
              'path': 'users7',
              'icon': 'el-icon-monitor',
            },
          ],
          'id': 4,
          'path': 'users8',
          'icon': 'el-icon-setting',
        },
      ],
      // 是否折叠
      isCollapse: false,
      // 保存链接的激活状态
      activePath: ''
    }
  },
  name: "home",
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$http.post('api/logout/')
          .then((res) => {
            Message.Message.success(res.data['msg'])
            this.$router.push({path: '/login'})
          })
          .catch(() => {
            Message.Message.error('网络错误')
          })
    },
    // 这是点击按钮的折叠和展开
    toggleCollapse() {
      // 是否折叠
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
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
  width: 100%;
  background-color: #373d41;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaeaf1;
  height: 100%;
  width: 100%;
}

.toggle-button {
  background-color: #374249;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 1px;
  cursor: pointer;
}
</style>