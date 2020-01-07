// 列表头部显示在此配置
export function initFun (_this) {
  let { sortedInfo } = _this
  sortedInfo = sortedInfo || {}
  return {
    // 系统管理类配置
    user: {
      title: 'userName',
      id: 'userName',
      columns: [
        {
          title: '身份',
          dataIndex: 'roleName'
        },
        {
          title: '用户名称',
          dataIndex: 'userName'
        },
        {
          title: '性别',
          dataIndex: 'userSex',
          customRender: (text) => {
            switch (text) {
              case 0:
                return '男'
              case 1:
                return '女'
              case 2:
                return '保密'
              default:
                return text
            }
          }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' },
          width: 100
        },
        {
          title: '医院',
          dataIndex: 'hospitalName'
        },
        {
          title: '部门',
          dataIndex: 'departmentName'
        },
        {
          title: '电话',
          dataIndex: 'cellphone'
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => {
            switch (text) {
              case 0:
                return '锁定'
              case 1:
                return '有效'
              default:
                return text
            }
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    role: {
      title: 'roleName',
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '描述',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          width: 350
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    department: {
      title: 'departmentName',
      columns: [
        {
          title: '部门id',
          dataIndex: 'departmentId'
        },
        {
          title: '部门名称',
          dataIndex: 'departmentName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: 120
        }
      ]
    },
    hospital: {
      title: 'hospitalName',
      columns: [
        {
          title: '医院名称',
          dataIndex: 'hospitalName',
        },
        {
          title: '医院地址',
          dataIndex: 'hospitalAddress'
        },
        {
          title: '电话',
          dataIndex: 'hospitalPhone'
        },
        {
          title: '注册时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: 100
        }
      ]
    },
    dict: {
      title: 'dictName',
      columns: [
        {
          title: 'dictId',
          dataIndex: 'dictId',
        }, {
          title: 'dictPid',
          dataIndex: 'dictPid'
        }, {
          title: 'code',
          dataIndex: 'dictCode'
        }, {
          title: '字典名称',
          dataIndex: 'dictName'
        }, {
          title: '注册时间',
          dataIndex: 'createTime'
        }, {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    log: {
      title: 'userName',
      columns: [
        {
          title: '操作人',
          dataIndex: 'userName',
        },
        {
          title: '操作描述',
          dataIndex: 'operation'
        },
        {
          title: '耗时',
          dataIndex: 'time'
        },
        {
          title: '执行方法',
          dataIndex: 'method',
          scopedSlots: { customRender: 'method' }
        },
        {
          title: '方法参数',
          dataIndex: 'params',
          scopedSlots: { customRender: 'params' },
          width: 100
        },
        {
          title: 'IP地址',
          dataIndex: 'ip'
        },
        {
          title: '操作地点',
          dataIndex: 'location'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime'
          // sorter: true,
          // sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        }
      ]
    },
    config: {
      title: 'key',
      id: 'key',
      columns: [
        {
          title: '配置key',
          dataIndex: 'key',
        },
        {
          title: '值',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' },
          width: 350
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    // 系统监控类配置
    online: {
      title: 'online',
      id: 'id',
      columns: [
        {
          title: '用户',
          dataIndex: 'username'
        },
        {
          title: '登录地址',
          dataIndex: 'loginAddress',
          width: 350
        },
        {
          title: '登录时间',
          dataIndex: 'loginTime'
        }
      ]
    },
    // 问卷类配置
    answer: {
      title: 'answerName',
      columns: [
        {
          title: '问题名称',
          dataIndex: 'answerName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    label: {
      title: 'labelName',
      columns: [
        {
          title: '标签名称',
          dataIndex: 'labelName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    questionnaire: {
      title: 'questionnaireName',
      isColumn: true,
      columns: [
        {
          title: '问卷名称',
          dataIndex: 'questionnaireName'
        },
        {
          title: '状态',
          dataIndex: 'questionnaireState',
          customRender: (text) => {
            switch (text) {
              case 0:
                return '禁用'
              case 1:
                return '启用'
              case 2:
                return text
            }
          }
        },
        {
          title: '类型',
          dataIndex: 'questionnaireType',
          customRender: (text) => {
            switch (text) {
              case 0:
                return '自用'
              case 1:
                return '公用'
              case 2:
                return text
            }
          }
        },
        {
          title: '创建人',
          dataIndex: 'userPeople'
        },
        {
          title: '版本号',
          dataIndex: 'versionId'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    questionnaireLeft: {
      title: 'subjectName',
      id: 'subjectId',
      columns: [
        {
          title: '问卷名称',
          dataIndex: 'subjectName'
        },
        {
          title: '答案',
          scopedSlots: { customRender: 'answer' },
          dataIndex: 'arr'
        },
        {
          title: '问卷Key',
          dataIndex: 'subjectKey'
        },
        {
          title: '后缀',
          dataIndex: 'subjectSuffix'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    questionnaireRight: {
      title: 'questionnaireName',
      isColumn: true,
      columns: [
        {
          title: '问卷名称',
          dataIndex: 'subjectName',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '答案',
          scopedSlots: { customRender: 'answer' },
          dataIndex: 'arr'
        },
        {
          title: '问卷Key',
          dataIndex: 'subjectKey'
        },
        {
          title: '后缀',
          dataIndex: 'subjectSuffix'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    subject: {
      title: 'subjectName',
      columns: [
        {
          title: '问卷题目',
          dataIndex: 'subjectName'
        },
        {
          title: '问题题目Key',
          dataIndex: 'subjectKey'
        },
        {
          title: '问卷Title',
          dataIndex: 'questionnaireTitle'
        },
        {
          title: '问卷Id',
          dataIndex: 'questionnaireId'
        },
        {
          title: '问卷答案内容',
          dataIndex: 'arr',
          scopedSlots: { customRender: 'params' },
          width: 100
        },
        {
          title: '问卷题目内容',
          dataIndex: 'subjectContent'
        },
        {
          title: '问卷题目后缀',
          dataIndex: 'subjectSuffix'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    tempAnswer: {
      title: 'answerName',
      id: 'answerId',
      columns: [
        {
          title: '模板答案',
          dataIndex: 'answerName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    tempSubject: {
      title: 'subjectName',
      id: 'subjectId',
      columns: [
        {
          title: '模板题目',
          dataIndex: 'subjectName'
        },
        {
          title: '模板题目key',
          dataIndex: 'subjectKey'
        },
        {
          title: '答案内容',
          dataIndex: 'arr',
          scopedSlots: { customRender: 'params' },
          width: 100
        },
        {
          title: '模板题目后缀',
          dataIndex: 'subjectSuffix'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          width: 100
        }
      ]
    },
    patient: {
      title: 'patientName',
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'patientName'
        },
        {
          title: '患者Card',
          dataIndex: 'patientIdCard'
        },
        {
          title: '患者性别',
          dataIndex: 'patientSex',
          customRender: (text) => {
            switch (text) {
              case 0:
                return '男'
              case 1:
                return '女'
              case 2:
                return '保密'
              default:
                return text
            }
          }
        },
        {
          title: '患者电话',
          dataIndex: 'patientPhone'
        },
        {
          title: '患者地址',
          dataIndex: 'patientAddress'
        },
        {
          title: '患者年龄',
          dataIndex: 'patientBirthday'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: 120
        }
      ]
    },
    patientOrder: {
      title: 'orderNo',
      id: 'produceOrderId',
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderNo'
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName'
        },
        {
          title: '医生',
          dataIndex: 'userName'
        },
        {
          title: '医院',
          dataIndex: 'hospitalName'
        },
        {
          title: '科室',
          dataIndex: 'departmentName'
        },
        {
          title: '产品名称',
          dataIndex: 'productName'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '套餐名称',
          dataIndex: 'useComboName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: 120
        }
      ]
    },
    followPlanMaster: {
      title: 'patientName',
      id: 'followId',
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderName'
        },
        {
          title: '患者名称',
          dataIndex: 'patientName'
        },
        {
          title: '随访类型',
          dataIndex: 'followTypeName'
        },
        {
          title: '问卷名称',
          dataIndex: 'followQuestionnaireName'
        },
        {
          title: '随访日期',
          dataIndex: 'followTime'
        },
        {
          title: '随访状态',
          dataIndex: 'followState',
          customRender: (text) => {
            switch (text) {
              case 0:
                return '待随访'
              case 1:
                return '已随访'
              default:
                return text
            }
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: 120
        }
      ]
    }
  }
}
