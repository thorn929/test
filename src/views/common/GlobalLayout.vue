<template>
  <a-layout style='position:fixed;width:100%'>
    <a-drawer
      v-if="deviceType ==='mobile'"
      placement="left"
      :wrapClassName="`drawer-sider silder`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menuData="menuData"
        :theme="theme"
        :collapsed="false"
        :collapsible="true"
      />
    </a-drawer>
    <side-menu :theme="theme" v-else-if="layout === 'side'" :menuData="menuData" :collapsed="collapsed" :collapsible="true" />
    <a-layout style='height: 100vh;overflow: scroll' :style="{ paddingLeft: paddingLeft }">
      <global-header :menuData="menuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse"/>
      <a-layout-content :style="{minHeight: minHeight, margin: '20px 14px 0'}" :class="fixHeader ? 'fixed-header-content' : null">
        <slot></slot>
        <a-layout-footer style="padding: .29rem 0" class="copyright">
          <global-footer :copyright="copyright"/>
        </a-layout-footer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'
import SideMenu from '@/components/menu/SiderMenu'
import { mapState, mapMutations } from 'vuex'
import { triggerWindowResizeEvent, deviceEnquire } from '@/utils/common'
import { Layout, Drawer } from 'ant-design-vue'
const minHeight = window.innerHeight - 64 - 24 - 66
let menuData = []
export default {
  name: 'GlobalLayout',
  components: {
    SideMenu,
    GlobalFooter,
    GlobalHeader,
    ALayout: Layout,
    ALayoutContent: Layout.Content,
    ALayoutFooter: Layout.Footer,
    ADrawer: Drawer
  },
  data () {
    return {
      minHeight: minHeight + 'px',
      collapsed: false,
      menuData: menuData,
      deviceType: 'desktop'
    }
  },
  computed: {
    paddingLeft () {
      return this.fixSiderbar && this.layout === 'side' && `${this.sidebarOpened ? 256 : 80}px`
    },
    ...mapState({
      sidebarOpened: state => state.setting.sidebar.opened,
      theme: state => state.setting.theme,
      layout: state => state.setting.layout,
      copyright: state => state.setting.copyright,
      fixSiderbar: state => state.setting.fixSiderbar,
      fixHeader: state => state.setting.fixHeader,
      router: state => state.account.router
    })
  },
  watch: {
    router: {
      handler (value) {
        menuData = value.find((item) => item.path === '/').children.filter((menu) => {
          let meta = menu.meta
          if (typeof meta.isShow === 'undefined') {
            return true
          } else return meta.isShow
        })
        this.menuData = menuData
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations({setSidebar: 'setting/setSidebar'}),
    toggleCollapse () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    onMenuSelect () {
      this.toggleCollapse()
    },
    drawerClose () {
      this.collapsed = false
    }
  },
  created () {
    deviceEnquire(deviceType => {
      this.deviceType = deviceType
    })
  }
}
</script>

<style lang="less" >
.silder {
  /deep/ .ant-drawer-body {
    padding: 0 !important
  }
}
.fixed-header-content {
  margin: 76px 12px 0 !important;
}
</style>
