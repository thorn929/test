// 列表增删改查在此配置
module.exports = {
  // 系统管理模块
  'user': {
    addTitle: '新增用户',
    editTitle: '修改用户',
    infoTitle: '用户信息',
    verify: {
      label: '用户名',
      key: 'userName',
      message: '请输入正确的用户名称',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '邮箱',
        type: 'text',
        attribute: {
          key: 'email',
          message: '请输入正确的邮箱',
          type: 'email',
          required: true,
          max: '50',
          warn: '长度不能超过50个字符'
        }
      },
      {
        label: '手机',
        type: 'text',
        attribute: {
          key: 'cellphone',
          message: '请输入正确的手机号',
          type: '',
          pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$',
          required: true,
          max: '11',
          warn: '请输入正确的手机号'
        }
      },
      {
        label: '角色',
        type: 'roleId'
      },
      {
        label: '部门',
        type: 'departmentId'
      },
      {
        label: '医院',
        type: 'hospitalId'
      },
      {
        label: '状态',
        type: 'radio',
        attribute: {
          key: 'status',
          message: '请选择状态',
          init: '1',
          required: true,
          data: [
            {
              value: '0',
              title: '锁定'
            },
            {
              value: '1',
              title: '有效'
            }
          ]
        }
      },
      {
        label: '性别',
        type: 'radio',
        attribute: {
          key: 'userSex',
          message: '请选择性别',
          required: true,
          data: [
            {
              value: '0',
              title: '男'
            },
            {
              value: '1',
              title: '女'
            },
            {
              value: '2',
              title: '保密'
            }
          ]
        }
      }
    ],
    editArray: ['userName', 'email', 'status', 'userSex', 'cellphone', 'departmentName', 'roleName', 'hospitalName'],
    infoArray: [
      {
        type: 'user',
        name: '身份：',
        value: 'roleName'
      },
      {
        type: 'user',
        name: '用户名称：',
        value: 'userName'
      },
      {
        type: 'message',
        name: '描述：',
        value: 'describe'
      },
      {
        type: 'skin',
        name: '性别：',
        value: 'userSex'
      },
      {
        type: 'phone',
        name: '电话',
        value: 'cellphone'
      },
      {
        type: 'mail',
        name: '邮箱：',
        value: 'email'
      },
      {
        type: 'home',
        name: '部门：',
        value: 'departmentName'
      },
      {
        type: 'clock-circle',
        name: '创建时间：',
        value: 'createTime'
      },
      {
        type: 'login',
        name: '最近登录：',
        value: 'lastLoginTime'
      },
      {
        type: 'bulb',
        name: '状态：',
        value: 'status'
      }
    ]
  },
  'role': {
    addTitle: '新增角色',
    editTitle: '修改角色',
    infoTitle: '角色信息',
    verify: {
      label: '角色名称',
      key: 'roleName',
      message: '角色名不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '角色描述',
        type: 'textarea',
        attribute: {
          key: 'remark',
          max: '50',
          warn: '长度不能超过50个字符',
          required: true,
          message: '描述不能为空'
        }
      }
    ],
    editArray: ['roleName', 'remark'],
    infoArray: [
      {
        type: 'crown',
        name: '角色名称：',
        value: 'roleName'
      },
      {
        type: 'book',
        name: '角色描述：',
        value: 'remark'
      },
      {
        type: 'clock-circle',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  },
  'department': {
    addTitle: '新增部门',
    editTitle: '修改部门',
    infoTitle: '部门信息',
    addArray: [
      {
        label: '部门名称',
        type: 'text',
        attribute: {
          key: 'departmentName',
          message: '部门名称不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['departmentName', 'remark'],
    infoArray: [
      {
        type: 'crown',
        name: '科室名称',
        value: 'departmentName'
      },
      {
        type: 'clock-circle',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  },
  'hospital': {
    addTitle: '新增医院',
    editTitle: '修改医院',
    infoTitle: 'xiuga',
    verify: {
      label: '医院名称',
      key: 'hospitalName',
      message: '医院名称不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '医院地址',
        type: 'text',
        attribute: {
          key: 'hospitalAddress',
          message: '医院地址不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '医院电话',
        type: 'text',
        attribute: {
          key: 'hospitalPhone',
          message: '请输入正确格式',
          type: '',
          required: true,
          max: '',
          warn: '',
          pattern: '^[0-9]*$'
        }
      }
    ],
    editArray: ['hospitalName', 'hospitalDetail', 'hospitalAddress', 'hospitalPhone'],
    infoArray: [
      {
        type: 'crown',
        name: '医院名称',
        value: 'hospitalName'
      },
      {
        type: 'hdd',
        name: '医院详情：',
        value: 'hospitalDetail'
      },
      {
        type: 'environment',
        name: '医院地址：',
        value: 'hospitalAddress'
      },
      {
        type: 'phone',
        name: '医院电话：',
        value: 'hospitalPhone'
      },
      {
        type: 'clock-circle',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  },
  'dict': {
    addTitle: '新增字典',
    editTitle: '修改字典',
    infoTitle: '字典信息',
    addArray: [
      {
        label: '字典名称',
        type: 'text',
        attribute: {
          key: 'dictName',
          message: '字典名称不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '字典code',
        type: 'text',
        attribute: {
          key: 'dictCode',
          message: '字典code不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['dictName', 'dictCode'],
    infoArray: [
      {
        type: 'crown',
        name: '字典名称：',
        value: 'dictName'
      },
      {
        type: 'code',
        name: '字典code：',
        value: 'dictCode'
      },
      {
        type: 'idcard',
        name: '字典Id：',
        value: 'dictId'
      },
      {
        type: 'clock-circle',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  },
  'config': {
    addTitle: '新增配置',
    editTitle: '修改配置',
    infoTitle: '配置信息',
    verify: {
      label: 'key',
      key: 'key',
      message: '不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '值',
        type: 'text',
        attribute: {
          key: 'value',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['value', 'key'],
    infoArray: [
      {
        type: 'crown',
        name: '配置名称：',
        value: 'key'
      },
      {
        type: 'code',
        name: '值：',
        value: 'value'
      },
      {
        type: 'clock-circle',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  },
  // 问卷配置
  // 新增标签
  'label': {
    addTitle: '新增标签',
    infoTitle: '标签详情',
    addArray: [
      {
        label: '标签名称',
        type: 'text',
        attribute: {
          key: 'labelName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['labelName'],
    infoArray: [
      {
        type: 'crown',
        name: '标签',
        value: 'labelName'
      }
    ]
  },
  // 模板题目管理
  'tempSubject': {
    addTitle: '新增模板问题',
    infoTitle: '模板问题详情',
    verify: {
      label: '模板key',
      key: 'subjectKey',
      message: '不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '模板问题名称',
        type: 'text',
        attribute: {
          key: 'subjectName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '标签',
        type: 'labelName'
      },
      {
        label: '模板问题后缀',
        type: 'text',
        attribute: {
          key: 'subjectSuffix',
          message: '不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['subjectName', 'subjectContent', 'subjectKey', 'subjectSuffix', 'labelName'],
    infoArray: [
      {
        type: 'crown',
        name: '模板题目：',
        value: 'subjectName'
      },
      {
        type: 'code',
        name: '模板内容：',
        value: 'subjectContent'
      },
      {
        type: 'code',
        name: '模板后缀：',
        value: 'subjectSuffix'
      },
      {
        type: 'code',
        name: '模板key：',
        value: 'subjectKey'
      }
    ]
  },
  'tempAnswer': {
    addTitle: '新增模板答案',
    addArray: [
      {
        label: '模板答案名称',
        type: 'text',
        attribute: {
          key: 'answerName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '模板题目',
        type: 'subjectId',
        attribute: {
          key: 'subjectId',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['answerName', 'subjectName']
  },
  'answer': {
    addTitle: '新增答案',
    addArray: [
      {
        label: '答案名称',
        type: 'text',
        attribute: {
          key: 'answerName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['answerName']
  },
  'questionnaire': {
    addTitle: '新增问卷',
    editTitle: '问卷修改',
    infoTitle: '问卷信息',
    addArray: [
      {
        label: '问卷名称',
        type: 'text',
        attribute: {
          key: 'questionnaireName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['questionnaireName'],
    SubEditArray: ['subjectName', 'subjectContent', 'subjectKey', 'subjectSuffix'],
    infoArray: [
      {
        type: 'crown',
        name: '问卷名称',
        value: 'questionnaireName'
      }
    ]
  },
  'questionnaireRight': {
    addTitle: '新增模问题',
    infoTitle: '模板问题详情',
    verify: {
      label: 'key',
      key: 'subjectKey',
      message: '不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '问题名称',
        type: 'text',
        attribute: {
          key: 'subjectName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '问题后缀',
        type: 'text',
        attribute: {
          key: 'subjectSuffix',
          message: '不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      },
      {
        label: '随访类型',
        type: 'subjectTypeName'
      }
    ],
    editArray: ['subjectName', 'subjectContent', 'subjectKey', 'subjectSuffix', 'subjectTypeName']
  },
  'questionnaireLeft': {
    addTitle: '新增模问题',
    infoTitle: '模板问题详情',
    verify: {
      label: 'key',
      key: 'subjectKey',
      message: '不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '问题名称',
        type: 'text',
        attribute: {
          key: 'subjectName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '问题后缀',
        type: 'text',
        attribute: {
          key: 'subjectSuffix',
          message: '不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['subjectName', 'subjectContent', 'subjectKey', 'subjectSuffix']
  },
  'subject': {
    addTitle: '新增问卷问题',
    infoTitle: '模板问卷详情',
    verify: {
      label: '模板key',
      key: 'subjectKey',
      message: '不能为空',
      required: true,
      max: '10',
      warn: '长度不能超过10个字符'
    },
    addArray: [
      {
        label: '模板问题名称',
        type: 'text',
        attribute: {
          key: 'subjectName',
          message: '不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '问卷',
        type: 'questionnaireId'
      },
      {
        label: '模板问题后缀',
        type: 'text',
        attribute: {
          key: 'subjectSuffix',
          message: '不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      }
    ],
    editArray: ['subjectName', 'subjectContent', 'subjectKey', 'subjectSuffix', 'questionnaireName'],
    infoArray: [
      {
        type: 'crown',
        name: '模板题目：',
        value: 'subjectName'
      },
      {
        type: 'code',
        name: '模板内容：',
        value: 'subjectContent'
      },
      {
        type: 'code',
        name: '模板后缀：',
        value: 'subjectSuffix'
      },
      {
        type: 'code',
        name: '模板key：',
        value: 'subjectKey'
      }
    ]
  },
  'patient': {
    addTitle: '新增患者',
    editTitle: '修改患者',
    infoTitle: '患者信息',
    addArray: [
      {
        label: '患者姓名',
        type: 'text',
        attribute: {
          key: 'patientName',
          message: '患者名称不能为空',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '患者地址',
        type: 'text',
        attribute: {
          key: 'patientAddress',
          message: '患者地址不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      },
      {
        label: '患者生日',
        type: 'text',
        attribute: {
          key: 'patientBirthday',
          message: '患者生日不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      },
      {
        label: '患者Card',
        type: 'text',
        attribute: {
          key: 'patientIdCard',
          message: '患者Card不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      },
      {
        label: '患者电话',
        type: 'text',
        attribute: {
          key: 'patientPhone',
          message: '患者电话不能为空',
          type: '',
          required: false,
          max: '',
          warn: ''
        }
      },
      {
        label: '患者性别',
        type: 'radio',
        attribute: {
          key: 'patientSex',
          message: '请选择性别',
          required: false,
          data: [
            {
              value: '0',
              title: '男'
            },
            {
              value: '1',
              title: '女'
            },
            {
              value: '2',
              title: '保密'
            }
          ]
        }
      }
    ],
    editArray: ['patientName', 'patientIdCard', 'patientSex', 'patientAddress', 'patientBirthday', 'patientPhone'],
    infoArray: [
      {
        type: '',
        name: '患者名字',
        value: 'patientName'
      },
      {
        type: '',
        name: '患者Card：',
        value: 'patientIdCard'
      },
      {
        type: '',
        name: '患者性别：',
        value: 'patientSex'
      },
      {
        type: '',
        name: '患者地址：',
        value: 'patientAddress'
      },
      {
        type: '',
        name: '患者手机：',
        value: 'patientPhone'
      },
      {
        type: '',
        name: '患者生日：',
        value: 'patientBirthday'
      },
      {
        type: '',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  },
  'patientOrder': {
    addTitle: '新增患者订单',
    editTitle: '修改患者订单',
    infoTitle: '患者订单信息',
    addArray: [
      {
        label: '订单号',
        type: 'text',
        attribute: {
          key: 'orderNo',
          message: '请填写订单号',
          type: '',
          required: true,
          max: '',
          warn: ''
        }
      },
      {
        label: '医院',
        type: 'hospitalId'
      },
      {
        label: '产品',
        type: 'productId'
      },
      {
        label: '项目',
        type: 'projectId'
      },
      {
        label: '部门',
        type: 'departmentId'
      },
      {
        label: '患者',
        type: 'patientId'
      },
      {
        label: '套餐',
        type: 'useCombo'
      }
    ],
    editArray: ['orderNo', 'hospitalName', 'departmentName', 'patientName', 'productName', 'projectName', 'useComboName'],
    infoArray: [
      {
        type: '',
        name: '订单号：',
        value: 'orderNo'
      },
      {
        type: '',
        name: '患者名字：',
        value: 'patientName'
      },
      {
        type: '',
        name: '医院：',
        value: 'hospitalName'
      },
      {
        type: '',
        name: '产品：',
        value: 'productName'
      },
      {
        type: '',
        name: '项目：',
        value: 'projectName'
      },
      {
        type: '',
        name: '套餐：',
        value: 'useComboName'
      },
      {
        type: '',
        name: '创建时间：',
        value: 'createTime'
      }
    ]
  }
}
