<template>
  <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'user-profile']">
    <a-card title="">
      <a href="javascript:void(0)" slot="extra" @click="updateProfile">编辑资料</a>
      <a-row :gutter="10">
        <a-col :span="10">
          <a-row style="text-align: center">
            <img style="max-width: 10rem;width: 100%;border-radius: 2px" alt="头像" :src="require(`@/assets/${avatar}`)"/>
          </a-row>
          <a-row style="text-align: center">
            <a-button icon="edit" style="margin-top:1rem" @click="updateAvatar">修改头像</a-button>
          </a-row>
        </a-col>
        <a-col :span="10" style="font-size: 1rem">
          <p>账户：{{user.userName}}</p>
          <p :title="user.roleName">角色：{{user.roleName? user.roleName: '暂无角色'}}</p>
          <p>性别：{{sex}}</p>
          <p>电话：{{user.cellphone ? user.cellphone : '暂未绑定电话'}}</p>
          <p>邮箱：{{user.email ? user.email : '暂未绑定邮箱'}}</p>
          <p>部门：{{user.departmentName? user.departmentName: '暂无部门'}}</p>
          <p>医院：{{user.hospitalName? user.hospitalName: '暂无医院'}}</p>
          <p>描述：{{user.describe}}</p>
        </a-col>
      </a-row>
    </a-card>
    <update-avatar
      @cancel="handleUpdateAvatarCancel"
      @success="handleUpdateAvatarSuccess"
      :user="user"
      :updateAvatarModelVisible="updateAvatarModelVisible">
    </update-avatar>
    <update-profile
      ref="updateProfile"
      @success="handleProfileEditSuccess"
      @close="handleProfileEditClose"
      :profileEditVisiable="profileEditVisiable">
    </update-profile>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import UpdateProfile from './UpdateProfile'
import UpdateAvatar from './UpdateAvatar'
import {Card, Button, Col, Row} from 'ant-design-vue'
export default {
  name: 'Profile',
  components: {
    UpdateProfile,
    UpdateAvatar,
    ACard: Card,
    AButton: Button,
    ACol: Col,
    ARow: Row
  },
  data () {
    return {
      updateAvatarModelVisible: false,
      profileEditVisiable: false,
      userId: ''
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    }),
    avatar () {
      return `avatar/${this.user.userAvatar}`
    },
    sex () {
      switch (this.user.userSex) {
        case 0:
          return '男'
        case 1:
          return '女'
        case 2:
          return '保密'
        default:
          return this.user.userSex
      }
    }
  },
  methods: {
    ...mapMutations({
      setUser: 'account/setUser'
    }),
    handleUpdateAvatarCancel () {
      this.updateAvatarModelVisible = false
    },
    handleUpdateAvatarSuccess (avatar) {
      this.updateAvatarModelVisible = false
      this.$message.success('更换头像成功')
      let user = this.user
      user.userAvatar = avatar
      this.setUser(user)
    },
    updateAvatar () {
      this.updateAvatarModelVisible = true
      this.userId = this.user.userId
    },
    updateProfile () {
      this.$refs.updateProfile.setFormValues(this.user)
      this.profileEditVisiable = true
    },
    handleProfileEditClose () {
      this.profileEditVisiable = false
    },
    handleProfileEditSuccess () {
      this.profileEditVisiable = false
      this.$message.success('修改成功')
    }
  }
}
</script>
<style lang="less">
  .user-profile {
    .ant-card-body {
      padding: 1rem 0 !important;
      p {
        font-size: .9rem !important;
        margin-bottom: .6rem !important;
      }
    }
  }
</style>
