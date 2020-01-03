<template>
  <a-layout-sider
    :class="[theme, 'sider', 'shadow', fixSiderbar? 'ant-fixed-sidemenu' : null]"
    width="226px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <div :class="['logo', theme]">
      <router-link to="/">
        <img :src="require('@/assets/images/logo.png')" class='logo' alt="">
        <h1 class="animated fadeIn">{{systemName}}</h1>
      </router-link>
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :menuData="menuData" @select="onSelect"/>
  </a-layout-sider>
</template>
<script>
import IMenu from './menu'
import { mapState } from 'vuex'
import {Layout} from 'ant-design-vue'
export default {
  name: 'SiderMenu',
  components: {
    IMenu,
    ALayoutSider: Layout.Sider
  },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    ...mapState({
      systemName: state => state.setting.systemName,
      fixSiderbar: state => state.setting.fixSiderbar
    })
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .shadow {
    box-shadow: 1px 0 6px rgba(0, 21, 41, .35);
  }
  .sider {
    z-index: 16;
    position: relative;
    overflow-x: hidden;
    &.light {
      background-color: #fff;
    }
    &.dark {
      background-color: #393e46;
      min-height: 100vh;
    }
    &.ant-fixed-sidemenu {
      position: fixed;
      overflow-y: auto;
      height: 100%;
    }
    .logo {
      height: 59px;
      position: relative;
      line-height: 59px;
      padding-left: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      overflow: hidden;
      &.light {
        background-color: #fff;
        border-bottom: 1px solid #f8f8f8;
      }
      &.dark {
        background-color: #393e46;
        h1 {
          color: #fff;
        }
      }
      h1 {
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 12px;
        font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        font-weight: 600;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
      }
      img {
        width: 26px;
        height: 25px;
        padding-left: 0;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
