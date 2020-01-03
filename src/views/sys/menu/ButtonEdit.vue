<template>
  <a-drawer
    title="修改按钮"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="buttonEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='按钮名称' v-bind="formItemLayout">
        <a-input v-decorator="['menuName',
                   {rules: [
                    { required: true, message: '按钮名称不能为空'},
                    { max: 10, message: '长度不能超过10个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='Url地址' v-bind="formItemLayout">
        <a-input v-decorator="['path',
                   {rules: [
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='相关权限1' v-bind="formItemLayout">
        <a-input v-decorator="['perms',
                   {rules: [
                    { required: true, max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='上级菜单'
                   style="margin-bottom: 2rem"
                   v-bind="formItemLayout">
        <a-tree
          :key="menuTreeKey"
          :checkable="true"
          :checkStrictly="true"
          @check="handleCheck"
          @expand="handleExpand"
          :expandedKeys="expandedKeys"
          :defaultCheckedKeys="defaultCheckedKeys"
          :treeData="menuTreeData">
        </a-tree>
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
import {mapMutations, mapState} from 'vuex'
import {Form, Button, Drawer, Input, Popconfirm, Tree} from 'ant-design-vue'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'ButtonEdit',
  props: {
    buttonEditVisiable: {
      default: false
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    ADrawer: Drawer,
    AInput: Input,
    APopconfirm: Popconfirm,
    ATree: Tree,
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      menuTreeKey: +new Date(),
      button: {},
      checkedKeys: [],
      expandedKeys: [],
      defaultCheckedKeys: [],
      menuTreeData: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.account.user
    })
  },
  methods: {
    reset () {
      this.loading = false
      this.menuTreeKey = +new Date()
      this.expandedKeys = this.checkedKeys = this.defaultCheckedKeys = []
      this.button = {}
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    handleExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    setFormValues ({...menu}) {
      this.form.getFieldDecorator('menuName')
      this.form.setFieldsValue({'menuName': menu.text})
      this.form.getFieldDecorator('path')
      this.form.setFieldsValue({'path': menu.path})
      this.form.getFieldDecorator('perms')
      this.form.setFieldsValue({'perms': menu.permission})

      this.defaultCheckedKeys.push(menu.parentId)
      this.checkedKeys = this.defaultCheckedKeys
      this.expandedKeys = this.checkedKeys
      this.button.menuId = menu.id
    },
    handleSubmit () {
      let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (!checkedArr.length) {
        this.$message.error('请为按钮选择一个上级菜单')
        return
      }
      if (checkedArr.length > 1) {
        this.$message.error('最多只能选择一个上级菜单，请修改')
        return
      }
      this.form.validateFields((err) => {
        if (!err) {
          this.loading = true
          let button = this.form.getFieldsValue()
          button.parentId = checkedArr[0]
          button.type = '1'
          button.menuId = this.button.menuId
          this.$put('/manage/sys/menu', {
            ...button
          }).then((res) => {
            if (res.data.code === 200) {
              this.reset()
              // 更新其state
              this.renovateMenu()
              this.$emit('success')
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    ...mapMutations({
      setRouter: 'account/setRouter'
    }),
    renovateMenu () {
      let user = this.$db.get('USER')
      this.$get(`sys/menu/${user.userName}`).then((res) => {
        if (res.data.code === 200) {
          this.setRouter(res.data.data)
        }
      })
    }
  },
  watch: {
    buttonEditVisiable () {
      if (this.buttonEditVisiable) {
        this.$get('/manage/sys/menu', {
          type: '0'
        }).then((res) => {
          if (res.data.code === 200) {
            this.menuTreeData = res.data.data.rows.children
            this.allTreeKeys = res.data.data.ids
            this.menuTreeKey = +new Date()
          }
        })
      }
    }
  }
}
</script>
