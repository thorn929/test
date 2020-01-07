<template>
  <a-drawer
    :title="comData && comData.editTitle"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="editVisiable"
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
        <!-- 角色、部门、医院类型因需要单独拉接口  单独写了 -->
         <!-- 标签类型 -->
        <template v-if='item.type == "labelName"'>
          <a-select mode="multiple" style="width: 100%"  v-decorator="['labelName']"  @change='changeLabel'>
            <a-select-option v-for="r in labelData" :key="r.labelName">{{r.labelName}}</a-select-option>
          </a-select>
        </template>
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
        <!-- 随访类型 -->
        <template v-if='item.type == "subjectTypeName"'>
          <a-select style="width: 100%" v-decorator="['subjectTypeName']" @change='changeSubjectType'>
            <a-select-option  v-for="item in followTypeData" :key="item.dictId">{{item.dictName}}</a-select-option>
          </a-select>
        </template>
        <!-- 患者 -->
        <template v-if='item.type == "patientId"'>
          <a-select style="width: 100%" v-decorator="['patientName']" @change='changeHospital'>
            <a-select-option v-for="r in dropPatientData" :key="r.patientId">{{r.patientName}}</a-select-option>
          </a-select>
         </template>
         <!-- 产品类型 -->
         <template v-if='item.type == "productId"'>
          <a-select style="width: 100%" v-decorator="['productName']" @change="changeProduct">
            <a-select-option  v-for="r in dropProductData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
        <!-- 项目类型 -->
        <template v-if='item.type == "projectId"'>
          <a-select style="width: 100%" v-decorator="['projectName']" @change="changeProject">
            <a-select-option  v-for="r in dropProjectData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
         <!-- 套餐类型 -->
        <template v-if='item.type == "useCombo"'>
          <a-select style="width: 100%" v-decorator="['projectName']" @change='changeCombo'>
            <a-select-option  v-for="r in dropProjectData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
         <!-- 患者订单Id -->
         <template v-if='item.type == "orderId"'>
          <a-select style="width: 100%"  v-decorator="['orderName', {rules: [{ required: true, message: '不能为空'}]}]" @change='changeOrder' >
            <a-select-option  v-for="r in dropPatientOrderData" :key="r.produceOrderId">{{r.orderNo}}</a-select-option>
          </a-select>
        </template>
        <!-- 随访问卷Id -->
         <template v-if='item.type == "followQuestionnaireId"'>
          <a-select style="width: 100%"  v-decorator="['followQuestionnaireName', {rules: [{ required: true, message: '不能为空'}]}]" @change='changeQuestion' >
            <a-select-option  v-for="r in dropQuestionnaireData" :key="r.questionnaireId">{{r.questionnaireName}}</a-select-option>
          </a-select>
        </template>
         <!-- 随访类型 -->
         <template v-if='item.type == "followType"'>
          <a-select style="width: 100%"  v-decorator="['followTypeName', {rules: [{ required: true, message: '不能为空'}]}]" @change='changeProject' >
            <a-select-option  v-for="r in dropFollowTypeData" :key="r.dictId">{{r.dictName}}</a-select-option>
          </a-select>
        </template>
        <!-- 随访时间 -->  
        <template v-if='item.type == "followTime"'>
          <a-date-picker format="YYYY-MM-DD" @change='changTime' placeholder="选择时间" />
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
           <!-- <a-tree
            :key="menuTreeKey"
            ref="menuTree"
            :checkable="true"
            :checkStrictly="checkStrictly"
            :defaultCheckedKeys="defaultCheckedKeys[0]"
            @check="handleCheck"
            @expand="handleExpand"
            :expandedKeys="expandedKeys"
            :treeData="treeNode">
          </a-tree> -->
          <ul>
            <li>
              <test-tree
                v-if='treeNode.length'
                :treeNode="treeNode"
                :allOpen="allOpen"
                :checkBox="checkBox"
                :checkBoxType="checkBoxType"
                @checkBoxCall="checkBoxCall" />
            </li>
          </ul>
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
import moment from 'moment'
import { mapState } from 'vuex'
import {Form, Button, Input, Icon, Drawer, Select, Radio, Popconfirm, DatePicker} from 'ant-design-vue'
import testTree from '@/components/tree/index'
const comData = require('./comData')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
let id = 500
export default {
  props: ['routerName', 'editVisiable', 'moduleType'],
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
      subjectData: [],
      // tree
      treeNode: [],
      allOpen: true,
      checkBox: true,
      checkBoxType: true,
      trees: [],
      checkedIds: [],
      labelData: [],
      dropProjectData: [],
      dropProductData: [],
      dropUseComboData: [],
      dropPatientData: [],
      followTypeData: [],
      dropFollowTypeData: [],
      dropPatientOrderData: [],
      dropQuestionnaireData: [],
      followTime: ''
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ATextarea: Input.TextArea,
    ADrawer: Drawer,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    APopconfirm: Popconfirm,
    testTree,
    ADatePicker : DatePicker 
  },
  computed: {
    comData () {
      return comData[this.routerName]
    },
    filterName () {
      // 当前数组为过滤input可删除可新增
      let filterArray = ['subject', 'tempSubject', 'questionnaireLeft', 'questionnaireRight']
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
    moment,
    checkBoxCall (checkBox) {
      let arr = []
      checkBox.forEach(el => {
        arr.push(el.id)
      })
      this.checkedIds = arr
    },
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

    fetchSubject (url) {
      return this.$get(url).then(res => {
        if (res.data.code === 200) {
          return res.data.data
        }
      }).catch(() => {})
    },
    async setFormValues ({...info}) {
      this.followId = info.followId
      this.orderId = info.orderId
      this.followType = info.followType
      this.followQuestionnaireId = info.followQuestionnaireId
      this.followTime = info.followTime 
      this.orderName = info.orderName
      this.followTypeName = info.followTypeName
      this.followQuestionnaireName = info.followQuestionnaireName
      this.followTime = info.followTime
      this.subjectType = info.subjectType
      this.questionnaireId = info.questionnaireId
      this.subjectId = info.subjectId
      this.roleId = info.roleId
      this.patientId = info.patientId
      this.departmentId = info.departmentId
      this.hospitalId = info.hospitalId
      this.dictId = info.dictId
      this.useCombo = info.useCombo
      this.projectId = info.projectId
      this.productId = info.productId
      this.produceOrderId = info.produceOrderId
      this.key = info.key
      // 拉取标签列表
      if (this.routerName === 'tempSubject') {
        await this.$get(`/manage/label/tempSubject/detail/${this.subjectId}`).then(res => {
          info.labelName = res.data.data.labelName
        }).catch(() => {})
      }
      if (this.routerName === 'subject') {
        // 为了拿问卷name 因为数据返回为问卷id 只能自己去匹配。。
        let data = await this.fetchSubject('/manage/label/subject/drop')
        data.filter(el => {
          if (el.questionnaireId === info.questionnaireId) {
            info.questionnaireName = el.questionnaireName
          }
        })
        this.subjectData = data
      }

      if (this.routerName === 'questionnaireRight') {
        // 为了拿问卷name 因为数据返回为问卷id 只能自己去匹配。按理说写个方法 但是不想写了。。。，重构再说吧
        let data = await this.fetchSubject('/manage/label/subject/dropSubject')
        data.filter(el => {
          if (el.subjectType === info.subjectType) {
            info.subjectTypeName = el.subjectTypeName
          }
        })
        this.followTypeData = data
      }
      // 回显数组
      let fields = this.comData.editArray
      Object.keys(info).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form.getFieldDecorator(key)
          let obj = {}
          // label是个数组，但是其他都是字符串，怕影响到其他 所以写了一个if
          if (key === 'labelName') {
            obj[key] = info[key]
          } else {
            obj[key] = info[key] + ''
          }
          this.form.setFieldsValue(obj)
        }
      })

      let filterName = ['tempSubject', 'subject', 'questionnaireLeft', 'questionnaireRight']
      if (filterName.includes(this.routerName)) {
        let url
        // 都是调一样的接口， 为了好理解 两个路由
        if (this.routerName === 'tempSubject' || this.routerName === 'questionnaireLeft') {
          url = '/manage/label/tempSubject/tempAnswer'
        } else {
          url = '/manage/label/subject/subjectAnswer'
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
      if (this.routerName === 'user') {
        this.user = {
          'userId': info.userId,
          'password': info.password
        }
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
    changeSubjectType (value) {
      this.subjectType = value
    },
    changeLabel (value) {
      this.labelName = value
    },
    changeProduct (value) {
      this.productId = value
    },
    changeProject (value) {
      this.projectId = value
    },
    changeCombo (value) {
      this.useCombo = value
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
        if (this.routerName === 'subject' || this.routerName === 'questionnaireRight') {
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
    changeOrder (value) {
      // 患者订单id
      this.orderId = value
    },
    changeQuestion (value) {
      // 随访问卷id
      this.followQuestionnaireId = value
    },
    changTime (value, dateString) {
      this.followTime = dateString
    },
    handleSubmit () {
      // 如果当前为角色 需要获得权限id
      // let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      this.form.validateFields((err, values) => {
        // values.labelName = values.labelName.join()
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
          let moduleType = this.moduleType
          // 后端需要raw类型数据
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
            // 角色管理
            case 'role':
              values.menuId = this.checkedIds.join(',')
              values.roleId = this.roleId
              break
            // 部门管理
            case 'department':
              values.departmentId = this.departmentId
              break
            // 标签管理
            case 'label':
              break
            // 医院管理
            case 'hospital':
              values.hospitalId = this.hospitalId
              break
            // 字典管理
            case 'dict':
              values.dictId = this.dictId
              break
            // 配置管理
            case 'config':
              values.key = this.key
              break
            // 问卷问题管理
            case 'subject':
              isRaw = true
              values.questionnaireId = this.questionnaireId
              break
            // 模板题目管理
            case 'tempSubject':
              isRaw = true
              break
            // 患者管理
            case 'patient':
              values.patientId = this.patientId
              break
            // 患者订单
            case 'patientOrder':
              values.departmentId = this.departmentId
              values.hospitalId = this.hospitalId
              values.patientId = this.patientId
              values.useCombo = this.useCombo
              values.projectId = this.projectId
              values.productId = this.productId
              values.produceOrderId = this.produceOrderId
              break
            // 问卷管理
            case 'questionnaire':
              values.questionnaireId = this.questionnaireId
              values.createUserId = this.userInfo.userId
              break
            // 问卷子组件
            case 'questionnaireRight':
              isRaw = true
              moduleType = 'manage/label'
              name = 'subject'
              values.subjectType = this.subjectType
              break
            // 随访计划
            case 'followPlanMaster':
              values.followTime = new Date(this.followTime)
              values.orderId = this.orderId
              values.followType = this.followType
              values.followQuestionnaireId = this.followQuestionnaireId
              values.patientId = this.patientId
              values.followId = this.followId
              break
          }
          if (name === 'questionnaireLeft') {
            isRaw = true
            values.questionnaireId = this.questionnaireId
            this.$put('manage/label/questionnaire/bind', {
              ...values
            }, isRaw).then(res => {
              if (res.data.code === 200) {
                this.$emit('success')
                this.loading = false
              }
            }).catch(() => {})
          } else {
            this.$put(`/${moduleType}/${name}`, {
              ...values
            }, isRaw).then((res) => {
              if (res.data.code === 200) {
                this.loading = false
                if (name === 'role') {
                  // this.$db.clear()
                  // location.reload()
                }
                this.$emit('success')
              }
            }).catch(error => {
              this.$message.warning(error)
              this.loading = false
            })
          }
        }
      })
    }
  },
  watch: {
    editVisiable: {
      handler () {
        if (!this.editVisiable) return
        let fetchMulti = () => {
          const promises = ['role', 'department', 'hospital'].map(url => {
            if (url === 'role') {
              // role路由下， roleId 1 为超管
              if (this.userInfo.roleId === '1') {
                url = `role`
              } else {
                url = 'role/drop'
              }
            }
            return this.$get(`/manage/sys/` + url).then(res => {
              if (res.data.code === 200) {
                res.data.data.url = url
                return res.data.data
              }
            }).catch(() => {})
          })
          Promise.all(promises).then(res => {
            res.map(el => {
              this[`${el.url}Data`] = el.rows
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

        let getTree = () => {
          const getMenu = () => {
            return this.$get('/manage/sys/menu').then((res) => {
              if (res.data.code === 200) {
                return res.data.data.rows && res.data.data.rows.children
              }
            }).catch(() => {})
          }
          const getIds = () => {
            return this.$get('/manage/sys/role/menu/' + this.roleId).then((res) => {
              if (res.data.code === 200) {
                return res.data.data
              }
            }).catch(() => {})
          }
          Promise.all([getMenu(), getIds()]).then(res => {
            let init = (tree) => {
              tree.forEach(el => {
                if (res[1].includes(el.id)) {
                  el.checked = true
                }
                if (el.children && el.children.length > 0) {
                  init(el.children)
                }
              })
            }
            init(res[0])
            this.treeNode = res[0]
          }).catch(error => {
            this.$message.warning(error)
          })
        }
        // 因为后台表的问题，不想一个方法多重判断了，只能重新复制
        let fetchMultiOther = (prefix, arr) => {
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
        switch (this.routerName) {
          case 'user':
            fetchMulti()
            break
          case 'role':
            // fetchMenu()
            // 父组件加了nextTick
            setTimeout(() => {
              getTree()
            }, 200)
            break
          case 'tempAnswer':
            fetch(`/manage/label/tempSubject/detail/${this.subjectId}`, 'tempAnswerData')
            break
          case 'tempSubject':
            fetch(`/manage/label/label/drop`, 'labelData')
            break
          case 'questionnaireRight':
            // fetch(`/manage/label/subject/dropSubject`, 'followTypeData')
            break
          case 'patientOrder':
            fetchMulti()
            fetchMultiOther('/manage/result/patientOrder/', ['dropProduct', 'dropProject', 'dropUseCombo', 'dropPatient'])
            break
          case 'followPlanMaster':
            fetchMultiOther('/manage/result/patientOrder/', ['dropPatient'])
            fetchMultiOther('/manage/result/followPlanMaster/', ['dropFollowType', 'dropPatientOrder', 'dropQuestionnaire'])
        }
      },
      immediate: true
    }
  }
}
</script>
