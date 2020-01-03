<template>
  <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'home-page']">
    <div class='home__logo'>
      <img :src="require('@/assets/images/logoBig.png')" alt="">
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'HomePage',
  data () {
    return {
      series: [],
      todayIp: '',
      todayVisitCount: '',
      totalVisitCount: '',
      userRole: '',
      userDept: '',
      lastLoginTime: '',
      welcomeMessage: ''
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    })
  }
}
</script>
<style lang="less">
  .home__logo {
    max-width: 40rem;
    height: 20rem;
    margin: 10rem auto 10rem;
    img {
      width: 100%;
    }
  }
</style>
