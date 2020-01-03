<template>
  <a-drawer
    title="编辑资料"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="profileEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='邮箱' v-bind="formItemLayout">
        <a-input
          v-decorator="[
          'email',
          {rules: [
            { type: 'email', message: '请输入正确的邮箱' },
            { max: 50, message: '长度不能超过50个字符'}
          ]}
        ]"/>
      </a-form-item>
      <a-form-item label="手机" v-bind="formItemLayout">
        <a-input
          v-decorator="['cellphone', {rules: [
            { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入正确的手机号'}
          ]}]"/>
      </a-form-item>
      <a-form-item label='部门' v-bind="formItemLayout">
        <a-select style="width: 100%"  v-decorator="['departmentName']" @change='depChange'>
          <a-select-option v-for="r in deptTreeData" :key="r.departmentId">{{r.departmentName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='医院' v-bind="formItemLayout">
        <a-select style="width: 100%"  v-decorator="['hospitalName']" @change='hostChange'>
          <a-select-option v-for="r in hospitalData" :key="r.hospitalId">{{r.hospitalName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='性别' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="[
            'userSex',
            {rules: [{ required: true, message: '请选择性别' }]}
          ]">
          <a-radio value=0>男</a-radio>
          <a-radio value=1>女</a-radio>
          <a-radio value=2>保密</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='描述' v-bind="formItemLayout">
        <a-textarea
          :rows="4"
          v-decorator="[
          'describe',
          {rules: [
            { max: 100, message: '长度不能超过100个字符'}
          ]}]">
        </a-textarea>
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import {Form, Button, Drawer, Input, Popconfirm, Radio, Select} from 'ant-design-vue'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  props: {
    profileEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      deptTreeData: [],
      hospitalData: [],
      depId: '',
      hostId: '',
      userId: '',
      hospitalId: '',
      departmentId: '',
      status: '',
      roleId: '',
      userName: '',
      loading: false
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    ADrawer: Drawer,
    AInput: Input,
    ATextarea: Input.TextArea,
    APopconfirm: Popconfirm,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    })
  },
  methods: {
    ...mapMutations({
      setUser: 'account/setUser'
    }),
    onClose () {
      this.loading = false
      this.form.resetFields()
      this.$emit('close')
    },
    setFormValues ({...user}) {
      let fields = ['email', 'userSex', 'describe', 'cellphone', 'departmentName', 'hospitalName']
      Object.keys(user).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          obj[key] = user[key] + ''
          this.form.setFieldsValue(obj)
        }
      })
      if (user.departmentId) {
        this.depId = user.departmentId
      }
      if (user.hospitalId) {
        this.hostId = user.hospitalId
      }
      this.userName = user.userName
      this.userId = user.userId
      this.roleId = user.roleId
    },
    hostChange (value) {
      this.hostId = value
    },
    depChange (value) {
      this.depId = value
    },
    handleSubmit () {
      this.form.validateFields((err) => {
        if (!err) {
          this.loading = true
          let user = this.form.getFieldsValue()
          user.userId = this.userId
          user.userName = this.userName
          user.roleId = this.roleId
          user.departmentId = this.depId
          user.hospitalId = this.hostId
          let userRoleId = this.$db.get('USER').roleId
          user.roleId = userRoleId
          delete user.departmentName
          delete user.hospitalName
          this.$put('/manage/sys/user/profile', {
            ...user
          }).then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.$emit('success')
              // 更新其state
              this.$get(`/manage/sys/user/${this.userName}`).then((res) => {
                if (res.data.code === 200) {
                  this.setUser(res.data.data)
                }
              })
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    profileEditVisiable () {
      if (this.profileEditVisiable) {
        this.$get('/manage/sys/department').then((res) => {
          if (res.data.code === 200) {
            this.deptTreeData = res.data.data.rows
          }
        })
        this.$get('/manage/sys/hospital').then((res) => {
          if (res.data.code === 200) {
            this.hospitalData = res.data.data.rows
          }
        })
      }
    }
  }
}
</script>
