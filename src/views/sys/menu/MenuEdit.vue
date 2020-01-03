<template>
  <a-drawer
    title="修改菜单"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="menuEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='菜单名称' v-bind="formItemLayout">
        <a-input v-decorator="['menuName',
                   {rules: [
                    { required: true, message: '菜单名称不能为空'},
                    { max: 10, message: '长度不能超过10个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='菜单URL'
                   v-bind="formItemLayout">
        <a-input v-decorator="['path',
                 {rules: [
                  { required: true, message: '菜单URL不能为空'},
                  { max: 50, message: '长度不能超过50个字符'}
                ]}]"/>
      </a-form-item>
      <a-form-item label='组件地址'
                   v-bind="formItemLayout">
        <a-input v-decorator="['component',
                 {rules: [
                  { required: true, message: '组件地址不能为空'},
                  { max: 100, message: '长度不能超过100个字符'}
                ]}]"/>
      </a-form-item>
      <a-form-item label='相关权限' v-bind="formItemLayout">
        <a-input v-decorator="['perms',
                   {rules: [
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='菜单图标'
                   v-decorator="['icon']"
                   v-bind="formItemLayout">
        <a-input placeholder="点击右侧按钮选择图标" v-model="menu.icon">
          <a-icon v-if="menu.icon" slot="suffix" type="close-circle" @click="deleteIcons"/>
          <a-icon slot="addonAfter" type="setting" style="cursor: pointer" @click="chooseIcons"/>
        </a-input>
      </a-form-item>
      <a-form-item label='菜单排序' v-bind="formItemLayout">
        <a-input-number v-decorator="['orderNum']" style="width: 100%"/>
      </a-form-item>
      <a-form-item label='上级菜单'
                   style="margin-bottom: 2rem"
                   v-bind="formItemLayout">
        <a-tree
          ref="menuTree"
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
    <icons
      @choose="handleIconChoose"
      @close="handleIconCancel"
      :iconChooseVisible="iconChooseVisible">
    </icons>
  </a-drawer>
</template>
<script>
import Icons from './Icons'
import {Form, Button, Input, Icon, Popconfirm, Tree, Drawer, InputNumber} from 'ant-design-vue'
import {mapMutations, mapState} from 'vuex'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'MenuEdit',
  components: {
    Icons,
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    APopconfirm: Popconfirm,
    ATree: Tree,
    ADrawer: Drawer
  },
  props: {
    menuEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      menuTreeKey: +new Date(),
      menu: {
        icon: ''
      },
      checkedKeys: [],
      expandedKeys: [],
      menuTreeData: [],
      defaultCheckedKeys: [],
      iconChooseVisible: false
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
      this.menu = {}
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
    chooseIcons () {
      this.iconChooseVisible = true
    },
    handleIconCancel () {
      this.iconChooseVisible = false
    },
    handleIconChoose (value) {
      this.menu.icon = value
      this.iconChooseVisible = false
    },
    deleteIcons () {
      this.menu.icon = ''
    },
    setFormValues ({...menu}) {
      let fields = ['path', 'component', 'icon']
      Object.keys(menu).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          obj[key] = menu[key]
          this.form.setFieldsValue(obj)
        }
      })
      this.form.getFieldDecorator('menuName')
      this.form.setFieldsValue({'menuName': menu.text})
      this.form.getFieldDecorator('perms')
      this.form.setFieldsValue({'perms': menu.permission})
      this.form.getFieldDecorator('orderNum')
      this.form.setFieldsValue({'orderNum': menu.order})
      this.menu.icon = menu.icon
      if (menu.parentId !== '0') {
        this.defaultCheckedKeys.push(menu.parentId)
        this.checkedKeys = this.defaultCheckedKeys
        this.expandedKeys = this.checkedKeys
      }
      this.menu.menuId = menu.id
      this.menuTreeKey = +new Date()
    },
    handleSubmit () {
      let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (checkedArr.length > 1) {
        this.$message.error('最多只能选择一个上级菜单，请修改')
        return
      }
      if (checkedArr[0] === this.menu.menuId) {
        this.$message.error('不能选择自己作为上级菜单，请修改')
        return
      }
      this.form.validateFields((err) => {
        if (!err) {
          this.loading = true
          let icon = this.menu.icon
          let menu = this.form.getFieldsValue()
          menu.icon = icon
          menu.menuId = this.menu.menuId
          if (checkedArr.length) {
            menu.parentId = checkedArr[0]
          } else {
            menu.parentId = ''
          }
          menu.type = '0'
          this.$put('/manage/sys/menu', {
            ...menu
          }).then((res) => {
            if (res.data.code === 200) {
              this.reset()
              // 更新其state
              location.reload()
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
    menuEditVisiable () {
      if (this.menuEditVisiable) {
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
