<template>
  <div class="footer">
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      <span v-html="copyright"></span>
    </div>
  </div>
</template>

<script>
import {Icon} from 'ant-design-vue'

export default {
  name: 'GlobalFooter',
  props: ['copyright'],
  components: {
    AIcon: Icon
  }
}
</script>

<style lang="less" scoped>
  .footer {
    padding: 0 16px;
    margin: 24px 0;
    text-align: center;

    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
      i {
        font-size: .8rem !important;
      }
    }

    &a {
      text-decoration: none;
    }
  }
</style>
