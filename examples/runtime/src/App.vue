<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {
    bbb: '11'
  },
  data () {
    return {
      temp: {
        temp1: {
          temp2: {
            temp3: '222'
          }
        }
      }
    }
  },
  computed: {
    aaa() {
      return this.temp
    }
  },
  methods: {
    install () {
      // const a = 1
      const WSSocketData = 1
      const 事实上 = 1
      const test = this.temp.temp1.temp2.temp3
      localStorage.setItem('22222', WSSocketData)
      installData1 = localStorage.getItem('installData2')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
