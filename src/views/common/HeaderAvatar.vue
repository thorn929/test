<template>
  <div>
    <div class='menu'>
      <span style="cursor: pointer">
        <a-avatar class="avatar" size="small" shape="circle"
         :src="require(`@/assets/${avatar}`)"/>
        <span class="curr-user">{{user.userName}}</span>
      </span>
       <ul class='menu__list'>
        <li class='menu__list__item' @click="openProfile">
          <a-icon type="user"/>
          <span>个人中心</span>
        </li>
        <li class='menu__list__item' @click="updatePassword">
          <a-icon type="key"/>
          <span>密码修改</span>
        </li>
        <li class='menu__list__item' @click="logout">
          <a-icon type="logout"/>
          <span>退出登录</span>
        </li>
      </ul>
    </div>
    <update-password
      @success="handleUpdate"
      @cancel="handleCancelUpdate"
      :user="user"
      :updatePasswordModelVisible="updatePasswordModelVisible">
    </update-password>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import UpdatePassword from '../personal/UpdatePassword'
import {Icon, Avatar} from 'ant-design-vue'
export default {
  name: 'HeaderAvatar',
  components: {
    UpdatePassword,
    AIcon: Icon,
    AAvatar: Avatar
  },
  data () {
    return {
      updatePasswordModelVisible: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    avatar () {
      return `avatar/${this.user.userAvatar}`
    }
  },
  methods: {
    openProfile () {
      this.$router.push('/profile')
    },
    updatePassword () {
      this.updatePasswordModelVisible = true
    },
    handleCancelUpdate () {
      this.updatePasswordModelVisible = false
    },
    handleUpdate () {
      this.updatePasswordModelVisible = false
      this.$message.success('更新密码成功，请重新登录系统')
      setTimeout(() => {
        this.logout()
      }, 1500)
    },
    logout () {
      this.$get(`/manage/logout/${this.user.id}`).then(() => {
        return new Promise(() => {
          this.$db.clear()
          location.reload()
        })
      }).catch(() => {
        this.$message.error('退出系统失败')
      })
    },
    ...mapMutations({setSettingBar: 'setting/setSettingBar'})
  }
}
</script>

<style lang="less" scoped>
  .ant-avatar-sm {
    width: 30px;
    height: 30px;
  }
  .avatar {
    margin: 20px 4px 20px 0;
    color: #189F92;
    background: hsla(0, 0%, 100%, .85);
    vertical-align: middle;
  }
  .curr-user {
    font-weight: 600;
    margin-left: 6px
  }
  .menu {
    text-align: right
  }
  .menu__list {
    display: none;
    outline: none;
    position: relative;
    list-style-type: none;
    padding: 4px 0;
    margin: 0;
    text-align: left;
    background-color: #fff;
    border-radius: 4px;
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-clip: padding-box;
  }
  .menu:hover .menu__list {
    display: block;
    // text-align: right;
  }
  .menu__list__item {
    padding: 0 45px 0px 10px;
    background: hsla(0, 0%, 100%, 1);
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .menu__list__item:hover {
    background: #e6f7ff
  }
</style>
