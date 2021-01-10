<template>
  <div id="app">
    <router-link to="/home">首页</router-link>
    <router-link to="/list">list</router-link>
    <!--    放置路由-->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {}
  }
}
</script>

<style>

</style>
