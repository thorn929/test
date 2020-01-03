<template>
<div>
  <!-- 密码修改 -->
  <a-modal
    title="密码修改"
    :keyboard="false"
    :maskClosable="false"
    :closable="false"
    v-model="show"
    @cancel="cancelUpdatePassword"
    @ok="handleUpdatePassword">
    <a-form :form="form">
      <a-form-item
        label='旧密码'
        v-bind="formItemLayout"
        :validateStatus="validateStatus"
        :help="help">
        <a-input
           @blur="handleOldPassowrd"
           v-decorator="[
              'oldPassword',
              {rules: [{ required: true, message: '请输入旧密码', whitespace: true}]}
           ]"
            type="password"
            autocomplete="false"
            placeholder="请输入旧密码"/>
      </a-form-item>
      <a-form-item
        label='新密码'
        v-bind="formItemLayout">
        <a-input
           v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码', whitespace: true}]}
            ]"
            autocomplete="false"
            type="password"
            placeholder="至少4位密码" />
      </a-form-item>
      <a-form-item
        label='再次确认'  v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'confrim',
            {rules: [{ required: true, message: '请输入密码', whitespace: true},
            {validator: this.handlePasswordCheck}
          ]}]"
          autocomplete="false"
          type="password"
          placeholder="至少4位密码"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</div>
</template>
<script>
import {Form, Input, Modal} from 'ant-design-vue'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
export default {
  props: {
    updatePasswordModelVisible: {
      default: false
    },
    user: {
      required: true
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout,
      state: {
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      oldPassword: '',
      newPassword: '',
      validateStatus: '',
      help: ''
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AModal: Modal
  },
  computed: {
    show: {
      get: function () {
        return this.updatePasswordModelVisible
      },
      set: function () {
      }
    }
  },
  methods: {
    cancelUpdatePassword () {
      this.state.passwordLevelChecked = false
      this.form.resetFields()
      this.$emit('cancel')
    },
    handleUpdatePassword () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$put('/manage/sys/user/password', {
            password: values.password,
            userName: this.user.userName
          }).then((res) => {
            if (res.data.code === 200) {
              this.state.passwordLevelChecked = false
              this.$emit('success')
              this.form.resetFields()
            }
          })
        }
      })
    },
    handlePasswordCheck (rule, value, callback) {
      let password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleOldPassowrd (e) {
      let password = e.target.value
      if (password.length) {
        this.$get('/manage/sys/user/password/check', {
          password: password,
          userName: this.user.userName
        }).then(res => {
          if (res.data.code === 200) {
            if (res.data.isPasswordRight) {
              this.validateStatus = 'success'
              this.help = ''
            } else {
              this.validateStatus = 'error'
              this.help = '抱歉，密码不正确'
            }
          }
        })
      } else {
        this.validateStatus = 'error'
        this.help = '请填写密码'
      }
    }
  }
}
</script>
<style lang="less">
  .update-password {
    &.error {
      color: #ff0000;
    }
    &.warning {
      color: #ff7e05;
    }
    &.success {
      color: #52c41a;
    }
  }
</style>
