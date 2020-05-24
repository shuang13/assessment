
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    
  }
}
</script>

<style>
html,body,#app {
  height: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 16px;

}
* {
  padding: 0;
  margin: 0;
}
ul,li {
  list-style: none;
}
a {
  text-decoration: none;
}
h1,h2,h3,h4 {
  font-weight: normal;
}
</style>
