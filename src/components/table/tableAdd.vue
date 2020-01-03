<template>
  <a-drawer
    :title="comData && comData.addTitle"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="addVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
  >
    <a-form :form='form'>
      <!-- 文本类型需验证 为更合理用户体验 错误提示同其他input下展示错误信息 单独拿出来 -->
      <a-form-item
        v-if='comData && comData.verify'
        :label='comData.verify.label'
        v-bind="formItemLayout"
        :validateStatus="validateStatus"
        :help="help">
        <a-input
          @blur="handleBlur"
          v-decorator="[comData.verify.key, {rules: [{ required: true, message: comData.verify.message}]}]"/>
      </a-form-item>
      <a-form-item
        v-for='(item, index) of comData && comData.addArray'
        :key='index'
        v-bind="formItemLayout"
        :label='item.label'
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
        <!-- 角色、部门、医院、标签类型因需要单独拉接口 TODO： 如何优化这一部分-->

        <!-- 标签类型 -->
        <template v-if='item.type == "labelName"'>
          <a-select style="width: 100%" mode="multiple" v-decorator="['labelName']">
            <a-select-option v-for="r in labelData" :key="r.labelName">{{r.labelName}}</a-select-option>
          </a-select>
        </template>
        <!-- 角色类型 -->
        <template v-if='item.type == "roleId"'>
          <a-select style="width: 100%" v-decorator="['roleId']">
            <a-select-option v-for="r in roleData" :key="r.roleId">{{r.roleName}}</a-select-option>
          </a-select>
        </template>
        <!-- 部门类型 -->
        <template v-if='item.type == "departmentId"'>
          <a-select style="width: 100%"  v-decorator="['departmentId']">
            <a-select-option v-for="r in departmentData" :key="r.departmentId">{{r.departmentName}}</a-select-option>
          </a-select>
         </template>
         <!-- 医院类型 -->
         <template v-if='item.type == "hospitalId"'>
          <a-select style="width: 100%" v-decorator="['hospitalId', {rules: [{ required: true, message: '不能为空'}]}]">
            <a-select-option  v-for="r in hospitalData" :key="r.hospitalId">{{r.hospitalName}}</a-select-option>
          </a-select>
        </template>
        <!-- 患者列表 -->
         <template v-if='item.type == "patientId"'>
          <a-select style="width: 100%" v-decorator="['patientId']" @change='changePatient'>
            <a-select-option  v-for="r in dropPatientData" :key="r.patientId">{{r.patientName}}</a-select-option>
          </a-select>
        </template>
         <!-- 产品类型 -->
         <template v-if='item.type == "productId"'>
          <a-select style="width: 100%" v-decorator="['productId', {rules: [{ required: true, message:  '不能为空'}]}]" @change='changeProduct'>
            <a-select-option  v-for="r in dropProductData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
         <!-- 项目类型 -->
         <template v-if='item.type == "projectId"'>
          <a-select style="width: 100%"  v-decorator="['projectId', {rules: [{ required: true, message: '不能为空'}]}]" @change='changeProject' >
            <a-select-option  v-for="r in dropProjectData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
         <!-- 套餐类型 -->
         <template v-if='item.type == "useCombo"'>
          <a-select style="width: 100%" v-decorator="['useCombo']" @change='changeCombo'>
            <a-select-option  v-for="r in dropUseComboData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
         <!-- 问卷 -->
         <template v-if='item.type == "questionnaireId"'>
          <a-select
            style="width: 100%" v-decorator="['questionnaireId', {
              rules: [
                { required: true, message: '请选择问卷' }
              ]
            }]"
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
              { initialValue: item.attribute.init },
              {
                rules: [{ required: item.attribute.required, message: item.attribute.message}]
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
            @check="handleCheck"
            @expand="handleExpand"
            :expandedKeys="expandedKeys"
            :treeData="menuTreeData">
          </a-tree>
      </a-form-item>
      <!-- input增删改 部分 -->
      <template v-if='filterName'>
        <a-form-item
          v-bind="formItemLayout"
          label='添加答案'
          :required="true"
          :validateStatus="validateStatus"
          >
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
import {Form, Button, Input, Icon, Drawer, Select, Radio, Popconfirm, Tree} from 'ant-design-vue'
const comData = require('./comData')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
let id = 110
export default {
  props: ['routerName', 'addVisiable', 'moduleType'],
  data () {
    return {
      // 公共
      formItemLayout,
      loading: false,
      validateStatus: '',
      help: '',
      // user部分
      roleData: [],
      departmentData: [],
      hospitalData: [],
      // 问卷部分
      tempAnswerData: [],
      // role树部分
      menuTreeData: [],
      checkedKeys: [],
      allTreeKeys: [],
      menuSelectStatus: '',
      menuTreeKey: +new Date(),
      checkStrictly: false,
      expandedKeys: [],
      menuSelectHelp: '',
      subjectData: [],
      labelData: [],
      dropProjectData: [],
      dropProductData: [],
      dropUseComboData: [],
      dropPatientData: []
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    ADrawer: Drawer,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    APopconfirm: Popconfirm,
    ATextarea: Input.TextArea,
    ATree: Tree
  },
  computed: {
    comData () {
      return comData[this.routerName]
    },
    ...mapState({
      userInfo: state => state.account.user
    }),
    filterName () {
      // 当前数组为过滤input可删除可新增
      let filterArray = ['subject', 'tempSubject']
      if (filterArray.includes(this.routerName)) {
        return true
      } else {
        return false
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  methods: {
    remove (k) {
      const keys = this.form.getFieldValue('keys')
      this.form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    add  () {
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
        obj.tempSubjectId = this.subjectId
        obj.answerName = valueArray[index]
        arr.push(obj)
        return arr
      })
      return arr
    },
    handleSubmit () {
      if (this.validateStatus !== 'success') {
        this.handleBlur()
      }
      let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (checkedArr.length === 0 && this.routerName === 'role') {
        this.menuSelectStatus = 'error'
        this.menuSelectHelp = '请选择相应的权限'
        return
      }
      this.form.validateFields((err, values) => {
        for (let key in values) {
          if (!values[key]) {
            delete values[key]
          }
        }
        if (!err) {
          // 判定带有删除input的类型
          if (this.filterName) {
            if (!values.keys.length) {
              this.$message.warning('请添加答案')
              return
            }
            values.children = this.handlerArray(values)
            delete values.keys
            delete values.names
          }
          this.loading = true

          let isRaw
          let name = this.routerName
          switch (name) {
            // 角色管理
            case 'role':
              values.menuId = checkedArr.join(',')
              break
            // 问卷管理
            case 'questionnaire':
              values.createUserId = this.userInfo.userId
              break
            // 问卷问题管理
            case 'subject':
              isRaw = true
              break
            // 模板题目管理
            case 'tempSubject':
              isRaw = true
              break
            case 'patientOrder':
              values.userId = this.userInfo.userId
              break
          }

          this.$post(`/${this.moduleType}/${this.routerName}`, {
            ...values
          }, isRaw).then((res) => {
            if (res.data.code === 200) {
              this.reset()
              this.$emit('success')
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleBlur (e) {
      let value = (e && e.target.value) || 0
      if (value) {
        let url = `/${this.moduleType}/${this.routerName}/check/${value}`
        this.$get(url).then((res) => {
          if (res.data.code === 200) {
            if (res.data.isUnique) {
              this.validateStatus = 'success'
              this.help = ''
            } else {
              this.validateStatus = 'error'
              this.help = '抱歉，key已存在'
            }
          }
        }).catch(() => {})
      } else {
        this.validateStatus = 'error'
        this.help = '名称不能为空'
      }
    },
    handleCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
      let checkedArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked
      if (checkedArr.length) {
        this.menuSelectStatus = ''
        this.menuSelectHelp = ''
      } else {
        this.menuSelectStatus = 'error'
        this.menuSelectHelp = '请选择相应的权限'
      }
    },
    handleExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    changeCombo (value) {
      alert(value)
    },
    changeProject (value) {
      alert(value)
    },
    changeProduct (value) {
      alert(value)
    },
    changePatient (value) {
      alert(value)
    }
  },
  watch: {
    addVisiable: {
      handler () {
        if (!this.addVisiable) return
        let fetchMulti = (prefix, arr) => {
          const promises = arr.map(url => {
            return this.$get(prefix + url).then(res => {
              if (res.data.code === 200) {
                res.data.data.url = url
                return res.data.data
              }
            }).catch(() => {})
          })
          Promise.all(promises).then(res => {
            res.map(el => {
              let obj = {}
              el.rows.map(() => {
                obj[`${el.url}Id`] = ''
                obj[`${el.url}Name`] = '请选择'
              })
              el.rows.unshift(obj)
              this[`${el.url}Data`] = el.rows
            })
          }).catch(error => {
            this.$message.warning(error)
          })
        }
        // 因为后台表的问题，不想一个方法多重判断了，只能重新复制
        let fetchMultid = (prefix, arr) => {
          const promises = arr.map(url => {
            return this.$get(prefix + url).then(res => {
              if (res.data.code === 200) {
                res.data.data.url = url
                return res.data.data
              }
            })
          })
          Promise.all(promises).then(res => {
            res.map(el => {
              this[`${el.url}Data`] = el
            })
          }).catch(error => {
            this.$message.warning(error)
          })
        }
        let fetch = (url, data) => {
          this.$get(url).then((res) => {
            if (res.data.code === 200) {
              this[data] = res.data.data
            }
          }).catch(() => {})
        }
        switch (this.routerName) {
          case 'user':
            fetchMulti('/manage/sys/', ['role', 'department', 'hospital'])
            break
          case 'role':
            this.$get('/manage/sys/menu').then((res) => {
              if (res.data.code === 200) {
                this.menuTreeData = res.data.data.rows.children
                this.allTreeKeys = res.data.data.ids
              }
            }).catch(() => {})
            break
          case 'tempAnswer':
            fetch('/manage/label/tempSubject/list', 'tempAnswerData')
            break
          case 'subject':
            fetch('/manage/label/subject/drop', 'subjectData')
            break
          case 'tempSubject':
            fetch('/manage/label/label/drop', 'labelData')
            break
          case 'patientOrder':
            fetchMulti('/manage/sys/', ['role', 'department', 'hospital'])
            fetchMultid('/manage/result/patientOrder/', ['dropProduct', 'dropProject', 'dropUseCombo', 'dropPatient'])
        }
      },
      immediate: true
    }
  }
}
</script>
