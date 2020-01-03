<template>
  <div class="login">
    <a-form @submit.prevent="doLogin" :form="form">
      <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;" :activeKey="activeKey"
              @change="handleTabsChange">
        <a-tab-pane tab="账户密码登录" key="1">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                   style="margin-bottom: 24px;"></a-alert>
          <a-form-item>
            <a-input size="large"  v-decorator="[
              'userName',
              {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}
              ]"
            >
              <a-icon slot="prefix" type="user"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码', whitespace: true}]}
              ]" size="large" type="password"
            >
              <a-icon slot="prefix" type="lock"></a-icon>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="手机号登录" key="2">
          <a-form-item>
            <a-input
              @blur="handleExist"
              size="large"
              v-decorator="['phoneNumber',
                {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }],
                validateTrigger: 'change'}
              ]">
              <a-icon slot="prefix" type="mobile"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['validateCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button
                  style="width: 100%"
                  class="captcha-button"
                  size="large"
                  :disabled='state.smsSendBtn'
                  @click="getCaptcha"
                  v-text="!state.smsSendBtn && '获取验证码' || (state.time+ 's')"
                  ></a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
      <a-form-item>
        <a-button :loading="loading" style="width: 100%; margin-top: 4px" size="large" htmlType="submit" type="primary">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import {Form, Button, Col, Tabs, Input, Row, Alert, Icon} from 'ant-design-vue'
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      error: '',
      activeKey: '1',
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false
      }
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    ACol: Col,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AIcon: Icon,
    AInput: Input,
    ARow: Row,
    AAlert: Alert
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    },
    copyright () {
      return this.$store.state.setting.copyright
    }
  },
  created () {
    this.$db.clear()
    this.$router.options.routes = []
  },
  methods: {
    doLogin () {
      const {activeKey, form: { validateFields }} = this
      let req
      if (activeKey === '1') {
        req = {
          keys: ['userName', 'password'],
          url: '/manage/login'
        }
      } else {
        req = {
          keys: ['phoneNumber', 'validateCode'],
          url: '/manage/codeLogin'
        }
      }
      validateFields(req.keys, (err, values) => {
        if (!err) {
          this.loading = true
          this.$post(req.url, {
            ...values
          }).then((res) => {
            if (res.data.code === 200) {
              let data = res.data.data
              this.saveLoginData(data)
              setTimeout(() => {
                this.loading = false
              }, 500)
              this.$router.push('/')
            }
          }).catch(() => {
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        }
      })
    },
    handleExist (e) {
      let mobile = e.target.value
      let reg = /^1[34578]\d{9}$/
      alert(reg.test(mobile))
    },
    getCaptcha () {
      const { form: { validateFields }, state } = this
      validateFields(['phoneNumber'], (err, values) => {
        if (!err) {
          state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          this.$get('/manage/getValidateCode', { phoneNumber: values.phoneNumber }).then(res => {
            if (res.data.code === 200) {
              setTimeout(hide, 500)
            }
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.$message.warning(err)
          })
        }
      })
    },
    handleTabsChange (val) {
      this.activeKey = val
    },
    ...mapMutations({
      setToken: 'account/setToken',
      setExpireTime: 'account/setExpireTime',
      setPermissions: 'account/setPermissions',
      setRoles: 'account/setRoles',
      setUser: 'account/setUser',
      fixSiderbar: 'setting/fixSiderbar',
      fixHeader: 'setting/fixHeader'
    }),
    saveLoginData (data) {
      this.setToken(data.token)
      this.setExpireTime(data.exipreTime)
      this.setUser(data.user)
      this.setPermissions(data.permissions)
      this.setRoles(data.roles)
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    .icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #189F92;
      }
    }
  }
</style>
