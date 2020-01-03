<template>
  <a-card :bordered="false" class="card-area" v-if='this.listJson[this.routerName]'>
    <a-col :md="7" style='border: 1px solid #e8e8e8;min-height: 500px;padding: 0 10px 0 10px' >
       <a-form style='margin-top:10px'>
        <div class='fold'>
          <a-row>
            <a-form-item
              label='名称'
              :labelCol="{span: 5}"
              :wrapperCol="{span: 17, offset: 1}">
              <a-input v-model='colParams.subjectName' />
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item
              label='key'
              :labelCol="{span: 5}"
              :wrapperCol="{span: 17, offset: 1}">
              <a-input v-model='colParams.subjectKey' />
            </a-form-item>
          </a-row>
        </div>
        <div style="float: right; margin-top: 3px;">
          <div style='margin-bottom: 20px;'>
            <a-button type="primary" @click='_search'>查询</a-button>
          </div>
          <div>
            <a-button @click='_reset'>重置</a-button>
          </div>
        </div>
      </a-form>
      <section >
        <ul class='left__list'>
          <li class='left__list__title'>题目名称</li>
          <li class='left__list__title'>题目key</li>
        </ul>
         <ul class='left__list' v-for='(item, index) of titleList' :key='index'>
          <a-popover>
            <template slot="content">
              <p>{{item.subjectName}}</p>
            </template>
            <li @click='edit(item, "questionnaireLeft")'>{{item.subjectName}}</li>
          </a-popover>
          <li @click='edit(item, "questionnaireLeft")'>{{item.subjectKey}}</li>
        </ul>
      </section>
    </a-col>
    <a-col :md="17" style='padding-left: 0.5rem'>
      <!-- 表格区域 -->
      <section>
        <div class="operator">
           <a-button @click='_delete'>删除</a-button>
            <a-button @click='test'>返回上一级</a-button>
        </div>
        <a-table
          ref="TableInfo"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :rowKey="record => record.subjectId"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :scroll="{ x: '900' }"
          >
          <!-- 模板答案 -->
          <template slot="answer" slot-scope="text">
            <a-popover placement="topLeft">
              <template slot="content">
                <div>{{text}}</div>
              </template>
              <p style="width: 100px;margin-bottom: 0">{{text}}</p>
            </a-popover>
          </template>
          <!-- 操作 -->
          <template slot="operation" slot-scope="text, record">
            <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record, 'questionnaireRight')" title="修改"></a-icon>
            &nbsp;
            <!-- <a-icon type="eye" v-if='filterInfo' theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon> -->
          </template>
        </a-table>
      </section>
      <!-- 新增 -->
      <table-add
        @close="addVisiable=false"
        @success="handleAddSuccess"
        :addVisiable="addVisiable"
        :routerName='routerName'
        :moduleType='moduleType'
      />
      <!-- 修改 -->
      <table-edit
        ref="Edit"
        @close="editVisiable=false"
        @success="handleEditSuccess"
        :editVisiable="editVisiable"
        :routerName='routerName'
        :moduleType='moduleType'
      />
      <!-- 信息查看 -->
      <table-info
        @close="infoVisiable=false"
        :infoVisiable="infoVisiable"
        :routerName='routerName'
        :info='info'
      />
    </a-col>
  </a-card>
</template>
<script>
import { mapState } from 'vuex'
import { initFun } from './initData.js'
import tableAdd from './tableAdd'
import tableEdit from './tableEdit'
import tableInfo from './tableInfo'
import {Form, Button, Col, Table, Input, Row, Icon, Card, Popover} from 'ant-design-vue'
const colData = [
  {
    title: '题目名称',
    dataIndex: 'subjectName'
  },
  {
    title: '题目key',
    dataIndex: 'subjectKey'
  }
]
export default {
  components: {
    ACard: Card,
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    ACol: Col,
    ATable: Table,
    AIcon: Icon,
    AInput: Input,
    ARow: Row,
    APopover: Popover,
    tableAdd,
    tableEdit,
    tableInfo
  },
  props: ['selectedId'],
  data () {
    return {
      colData,
      queryParams: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      colParams: {
        subjectName: '',
        subjectKey: ''
      },
      columnAddVisiable: false,
      routerId: '',
      moduleType: '',
      buttonData: '',
      selectedRowKeys: [],
      addVisiable: false,
      infoVisiable: false,
      editVisiable: false,
      answerVisiable: false,
      info: '',
      routerName: '',
      // 分栏
      titleList: [],
      sortedInfo: null,
      loading: false,
      dataSource: [],
      answerList: []
    }
  },
  computed: {
    listJson () {
      return initFun(this)
    },
    columns () {
      return this.listJson[this.routerName].columns
    },
    ...mapState({
      user: state => state.account.user
    }),
    filterInfo () {
      let filterArray = ['answer', 'tempAnswer']
      if (filterArray.includes(this.routerName)) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    $route: {
      handler: function () {
        this.routerName = 'questionnaireRight'
        this.fetch()
      },
      immediate: true
    }
  },
  methods: {
    test () {
      this.$emit('column')
    },
    fetch (params = {}) {
      this.loading = true
      this.$get(`manage/label/subject/answer/${this.selectedId}`, {
        ...params
      }).then(async (res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          data.map(el => {
            let arr = []
            el.children.map(ell => {
              arr.push(ell.answerName)
            })
            el.arr = arr.join(', ')
            delete el.children
          })
          // data.map(el => el.subjectKey)
          this.answerList = data
          this.dataSource = data
          this.loading = false
        }
      })
    },
    add () {
      this.addVisiable = true
    },
    _delete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      this.$confirm({
        title: '确定删除所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let ids = []
          for (let key of this.selectedRowKeys) {
            ids.push(key)
          }
          this.$delete(`manage/label/subject/` + ids.join(',')).then((res) => {
            if (+res.status === 200) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.fetch()
            } else {
              this.$message.error('删除用户失败')
            }
          })
        },
        onCancel: () => {
          this.selectedRowKeys = []
        }
      })
    },
    columnAdd (info) {
      this.columnAddVisiable = true
      this.$nextTick(() => {
        this.$refs.Add.setFormValues(info)
      })
    },
    edit (record, name) {
      if (name) {
        this.routerName = name
      }
      // 进入下一页之前判断一下当前选中key在右边列表key是否存在
      this.answerList.map(el => {
        if (el.subjectKey === record.subjectKey) {
          record.subjectId = el.subjectId
          this.routerName = 'questionnaireRight'
        }
      })
      record.questionnaireId = this.selectedId.join()
      this.editVisiable = true
      this.$nextTick(() => {
        this.$refs.Edit.setFormValues(record)
      })
    },
    view (record) {
      if (record.userSex + '') {
        switch (record.userSex) {
          case 0:
            record.userSex = '男'
            break
          case 1:
            record.userSex = '女'
            break
          case 2:
            record.userSex = '保密'
            break
        }
      }
      if (record.status + '') {
        switch (record.status) {
          case 0:
            record.status = '锁定'
            break
          case 1:
            record.status = '有效'
            break
        }
      }
      this.info = record
      this.infoVisiable = true
    },
    handleEditSuccess () {
      this.editVisiable = false
      this.$message.success('修改成功')
      this.fetch()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAddSuccess () {
      this.addVisiable = false
      this.columnAddVisiable = false
      this.$message.success('新增成功')
      this.fetch()
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    getOnline (params = {}) {
      this.$get('/monitor/sys/online', { ...params }).then((res) => {
        if (res.data.code === 200) {
          this.dataSource = res.data.data
          this.loading = false
        }
      })
    },
    fetchSubject (params = {}) {
      this.$get('/manage/label/tempSubject/list', {...params}).then(res => {
        if (res.data.code === 200) {
          this.titleList = res.data.data
        }
      })
    },
    _search () {
      this.fetchSubject(this.colParams)
    },
    _reset () {
      this.colParams = {}
      this.fetchSubject()
    }
  },
  created () {
    this.fetchSubject()
  }
}
</script>

<style lang="less" scoped>
.button__list {
  margin: 10px 10px;
}
.left__list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #eeeeee;
  .left__list__title {
    font-size: 0.8rem;
    font-weight: 600;
  }
  li {
    width: 49%;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 0.8rem
  }
}
.left__list:hover{
  background:#E6F7FF;
  cursor: pointer;
}
@import "../../assets/css/Common";
</style>
