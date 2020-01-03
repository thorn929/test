<template>
  <a-drawer
    :title="comData && comData.editTitle"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="columnAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form='form'>
      <a-form-item
        v-if='comData && comData.verify'
        :label='comData.verify.label'
        v-bind="formItemLayout"
        :validateStatus="validateStatus"
        :help="help">
        <a-input
          read-only
          v-decorator="[comData.verify.key, {rules: [{ required: true, message: comData.verify.message}]}]"/>
      </a-form-item>
      <a-form-item
        v-for='(item, index) of comData && comData.addArray'
        :key='index'
        v-bind="formItemLayout"
        label='问卷名称'
        >
        <!-- 文本类型不需验证 -->
        <template v-if='item.type == "text"'>
         <a-input
            v-decorator="[
              item.attribute.key,
              {
                rules: [
                  { pattern: item.attribute.pattern, message: item.attribute.message },
                  { required: item.attribute.required, message: item.attribute.message },
                  { type: item.attribute.type, message: item.attribute.message },
                  { max: item.attribute.max, message: item.attribute.warn }
                ]
              }
            ]"/>
        </template>
        <!-- 角色、部门、医院类型因需要单独拉接口  单独写了 -->
        <!-- 角色类型 -->
        <template v-if='item.type == "roleId"'>
          <a-select style="width: 100%" v-decorator="['roleName']" @change='changeRole'>
            <a-select-option v-for="r in roleData" :key="r.roleId">{{r.roleName}}</a-select-option>
          </a-select>
        </template>
        <!-- 部门类型 -->
        <template v-if='item.type == "departmentId"'>
          <a-select style="width: 100%"  v-decorator="['departmentName']" @change='changeDepart'>
            <a-select-option v-for="r in departmentData" :key="r.departmentId">{{r.departmentName}}</a-select-option>
          </a-select>
         </template>
         <!-- 医院类型 -->
         <template v-if='item.type == "hospitalId"'>
          <a-select style="width: 100%" v-decorator="['hospitalName']" @change='changeHospital'>
            <a-select-option  v-for="r in hospitalData" :key="r.hospitalId">{{r.hospitalName}}</a-select-option>
          </a-select>
        </template>
         <!-- 问卷 -->
         <template v-if='item.type == "questionnaireId"'>
          <a-select
            @change='changeSubject'
            style="width: 100%"
            v-decorator="['questionnaireName']"
            >
            <a-select-option  v-for="r in subjectData" :key="r.questionnaireId">{{r.questionnaireName}}</a-select-option>
          </a-select>
        </template>
        <!-- 文本域类型 -->
        <template v-if='item.type == "textarea"'>
          <a-textarea
            :rows="4"
            v-decorator="[
            item.attribute.key,
            {rules: [
              { required: item.attribute.required, message: item.attribute.message },
              { max: item.attribute.max, message: item.attribute.warn}
            ]}]">
          </a-textarea>
        </template>
        <!-- 单选类型 -->
        <template v-if='item.type == "radio"'>
          <a-radio-group
            v-decorator="[
              item.attribute.key,
              {
                rules: [{ required: true, message:  item.attribute.message}]
              }
            ]" >
            <a-radio v-for='(item, index) in item.attribute.data' :key='index' :value='item.value'>{{item.title}}</a-radio>
          </a-radio-group>
        </template>
      </a-form-item>
        <!-- 权限树类型 -->
      <a-form-item
        v-if='routerName == "role"'
        label='权限选择'
        style="margin-bottom: 2rem"
        :validateStatus="menuSelectStatus"
        :help="menuSelectHelp"
        v-bind="formItemLayout">
          <a-tree
            :key="menuTreeKey"
            ref="menuTree"
            :checkable="true"
            :checkStrictly="checkStrictly"
            :defaultCheckedKeys="defaultCheckedKeys[0]"
            @check="handleCheck"
            @expand="handleExpand"
            :expandedKeys="expandedKeys"
            :treeData="menuTreeData">
          </a-tree>
      </a-form-item>
      <!-- 回显input -->
      <template v-if='filterName'>
        <a-form-item v-bind="formItemLayout" label='添加答案' :required='true'>
          <a-button
            type="dashed"
            style="width: 60%"
            @click="add"
          >
            <a-icon type="plus" />添加答案
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(k, index) in form.getFieldValue('keys')"
          :key="k+10"
          v-bind="formItemLayout"
          :label='`答案${index+1}`'
          >
          <a-input
              v-decorator="[
                `names[${k}]`,
                {
                rules: [{
                    required: true,
                    whitespace: true,
                    message: '请填写内容'
                  }]
                }
              ]"
              style="width: 60%; margin-right: 8px"
            />
            <a-icon
              class="dynamic-delete-button"
              type="minus-circle-o"
              @click="() => remove(k)"
            />
        </a-form-item>
       </template>
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
import { mapState } from 'vuex'
import {Form, Button, Col, Tabs, Input, Row, Alert, Icon, Drawer, Select, Radio, Popconfirm, Tree} from 'ant-design-vue'
const comData = require('./comData')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
let id = 500
export default {
  props: ['routerName', 'columnAddVisiable', 'moduleType'],
  data () {
    return {
      // 公共
      formItemLayout,
      loading: false,
      validateStatus: '',
      help: '',
      roleId: '',
      departmentId: '',
      hospitalId: '',
      dictId: '',
      key: '',
      // 问卷类型
      tempAnswerData: [],
      subjectId: '',
      // user部分
      user: {},
      roleData: [],
      departmentData: [],
      hospitalData: [],
      // role树部分
      menuTreeData: [],
      checkedKeys: [],
      defaultCheckedKeys: [],
      allTreeKeys: [],
      menuSelectStatus: '',
      menuTreeKey: +new Date(),
      checkStrictly: true,
      expandedKeys: [],
      menuSelectHelp: '',
      subjectData: []
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
    ATextarea: Input.TextArea,
    ARow: Row,
    ADrawer: Drawer,
    AAlert: Alert,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ATree: Tree,
    APopconfirm: Popconfirm
  },
  computed: {
    comData () {
      return comData[this.routerName]
    },
    filterName () {
      // 当前数组为过滤input可删除可新增
      let filterArray = ['subject', 'tempSubject']
      if (filterArray.includes(this.routerName)) {
        return true
      } else {
        return false
      }
    },
    ...mapState({
      userInfo: state => state.account.user
    })
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  methods: {
    remove (k) {
      const keys = this.form.getFieldValue('keys')
      this.form.setFieldsValue({
        keys: keys.filter(key => {
          return key !== k
        })
      })
    },
    add () {
      const keys = this.form.getFieldValue('keys')
      const nextKeys = keys.concat(++id)
      this.form.setFieldsValue({
        keys: nextKeys
      })
    },
    reset () {
      this.validateStatus = ''
      this.help = ''
      this.loading = false
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },

    fetchSubject () {
      return this.$get('/manage/label/subject/drop').then(res => {
        if (res.data.code === 200) {
          return res.data.data
        }
      })
    },
    async setFormValues ({...info}) {
      this.questionnaireId = info.questionnaireId
      this.subjectId = info.subjectId
      this.roleId = info.roleId
      this.departmentId = info.departmentId
      this.hospitalId = info.hospitalId
      this.dictId = info.dictId
      this.key = info.key
      if (this.routerName === 'subject') {
        // 为了拿问卷name 因为数据返回为问卷id 只能自己去匹配。。
        let data = await this.fetchSubject()
        data.filter(el => {
          if (el.questionnaireId === info.questionnaireId) {
            info.questionnaireName = el.questionnaireName
          }
        })
        this.subjectData = data
      }
      // 回显数组
      let fields = this.comData.editArray
      Object.keys(info).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          obj[key] = info[key] + ''
          this.form.setFieldsValue(obj)
        }
      })

      let filterName = ['tempSubject', 'subject']
      if (filterName.includes(this.routerName)) {
        let url
        if (this.routerName === 'tempSubject') {
          url = '/manage/label/tempSubject/tempAnswer'
        } else {
          url = '/manage/label/subject/answer'
        }
        this.$get(url, {}).then((res) => {
          // input 回显部分
          let nextKeys = []
          if (res.data.code === 200 && res.data.data) {
            res.data.data.map((el) => {
              if (el.subjectId === this.subjectId) {
                el.children.map(ell => {
                  let id = ell.answerId + ''
                  nextKeys.push(id)
                  this.form.getFieldDecorator(`names[${id}]`)
                  let obj = {}
                  obj[`names[${id}]`] = ell.answerName
                  this.form.setFieldsValue(obj)
                })
              }
            })
            this.form.setFieldsValue({
              keys: nextKeys
            })
          }
        }).catch(() => {})
      }
    },
    changeRole (value) {
      this.roleId = value
    },
    changeDepart (value) {
      this.departmentId = value
    },
    changeHospital (value) {
      this.hospitalId = value
    },
    changeSubject (value) {
      this.questionnaireId = value
    },
    // 拼接数组
    handlerArray (values) {
      let keyArray = values.keys
      let valueArray = values.names.filter(Boolean)
      let arr = []
      keyArray.map((el, index) => {
        let obj = {}
        if (typeof el === 'string') {
          obj.answerId = el
        }
        if (this.routerName === 'subject') {
          obj.followSubjectId = this.subjectId
        } else {
          obj.tempSubjectId = this.subjectId
        }
        obj.answerName = valueArray[index]
        arr.push(obj)
        return arr
      })
      return arr
    },
    handleSubmit () {
      // 如果当前为角色 需要获得权限id
      this.form.validateFields((err, values) => {
        // 如果当前input 为可删除添加
        if (values.keys.length) {
          values.subjectId = this.subjectId
          values.children = this.handlerArray(values)
          delete values.keys
          delete values.names
        }
        if (!err) {
          this.loading = true
          let name = this.routerName
          let isRaw
          switch (name) {
            // 用户管理
            case 'user':
              values.roleId = this.roleId
              values.departmentId = this.departmentId
              values.hospitalId = this.hospitalId
              values.userId = this.user.userId
              values.password = this.user.password
              break
            case 'dict':
              values.dictId = this.dictId
              break
            // 配置管理
            case 'config':
              values.key = this.key
              break
            // 问卷管理
            case 'questionnaire':
              values.questionnaireId = this.questionnaireId
              values.createUserId = this.userInfo.userId
              break
          }
          this.$put(`/${this.moduleType}/${name}`, {
            ...values
          }, isRaw).then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              if (name === 'role') {
                this.$db.clear()
                location.reload()
              }
              this.$emit('success')
            }
          }).catch(error => {
            this.$message.warning(error)
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    columnAddVisiable: {
      handler () {
        if (!this.columnAddVisiable) return
        this.$get('/manage/label/subject/drop').then((res) => {
          if (res.data.code === 200) {
            this.subjectData = res.data.data
          }
        })
      },
      immediate: true
    }
  }
}
</script>
