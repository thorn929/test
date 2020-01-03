<template>
    <div :class="multipage === true ? 'multi-page':'single-page'">
      <page-content :breadcrumb="breadcrumb" :title="title" :logo="logo">
        <slot v-if='breadcrumb.length >=3'></slot>
        <div v-else>
          <div class="content">
             <h1>404</h1>
            <div class="desc">抱歉您访问的页面尚未开发</div>
            <h4 @click='a =! a'>移动端浏览</h4>
             <h4 @click='b =! b'>移动端浏览-----</h4>
            <!-- 637128014426914062   637128000657539062-->
            <!-- /manage/label/label -->
            <!-- https://www.wjx.cn/pm/48356590.aspx?wg=1&par=1&t=637128014426914062 -->
            <div v-if='a' style='position:absolute;top:-36px;left:-461px;height: 762px;width:438px;padding: 40px 0 0 0;margin: 0 auto 20px;background: url(https://www.wjx.cn/images/newimg/image-phone@2x.png?v=1) no-repeat 0 0;background-size: 438px 762px;'>
              <iframe style='width: 320px; height: 620px; border-radius: 4px'
              src="https://www.wjx.cn/pm/48356590.aspx?wg=1&par=1&t=637128014426914062"
              frameborder="0"></iframe>
            </div>
            <div v-if='b' style='position:absolute;top:-36px;left:-461px;height: 762px;width:438px;padding: 40px 0 0 0;margin: 0 auto 20px;background: url(https://www.wjx.cn/images/newimg/image-phone@2x.png?v=1) no-repeat 0 0;background-size: 438px 762px;'>
              <iframe style='width: 320px; height: 620px; border-radius: 4px'
              src=" /login"
              frameborder="0"></iframe>
            </div>
            <div class="action">
            </div>
          </div>
        </div>
      </page-content>
    </div>
</template>

<script>
import PageContent from './PageContent'
export default {
  name: 'PageLayout',
  components: {PageContent},
  props: ['logo', 'title'],
  data () {
    return {
      breadcrumb: [],
      a: false,
      b: false
    }
  },
  computed: {
    multipage () {
      return this.$store.state.setting.multipage
    }
  },
  mounted () {
    this.getBreadcrumb()
  },
  updated () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      this.breadcrumb = this.$route.matched
    }
  }
}
</script>

<style lang="less" scoped>
  .link{
    margin-top: 16px;
    line-height: 24px;
    a{
      font-size: 14px;
      margin-right: 32px;
      i{
        font-size: 22px;
        margin-right: 8px;
      }
    }
  }
  .page-content{
    &.side{
      margin: 24px 24px 0;
    }
    &.head{
      margin: 24px auto 0;
      max-width: 1400px;
    }
  }
  .content{
    display: inline-block;
    flex: auto;
    position: absolute;
    transform: translateX(-50%);
    text-align: center;
    left: 50%;
    h1{
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .desc{
      color: rgba(0,0,0,.45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
</style>
