<template>
  <a-card :bordered="false" class="card-area" v-if='this.listJson[this.routerName]'>
    <table-column v-if='column' :selectedId='selectedRowKeys'  @column='column=false' />
    <a-col v-else :md="24">
      <!-- 公共搜索区域 -->
      <!-- 这一块太low了 但是不想优化了  -->
      <section style='padding-top: 5px'>
        <a-form layout="horizontal"  v-if='routerName !== "online"' >
          <div class='fold'>
            <a-row v-if='routerName === "patientOrder"'>
              <a-col :md="5" :sm="24" >
                <a-form-item
                  label='名称'
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 17, offset: 1}">
                  <a-input v-model="queryParams[listJson[routerName].title]"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24" >
                <a-form-item
                  label='医院'
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 17, offset: 1}">
                   <a-select style="width: 100%"  v-decorator="['hospitalName']"  @change='changeHospital' allowClear>
                    <a-select-option v-for="item in hospitalData" :key="item.hospitalId">{{item.hospitalName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
               <a-col :md="5" :sm="24" >
                <a-form-item
                  label='科室'
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 16, offset: 1}">
                 <a-select style="width: 100%" @change='changeDepartment' allowClear>
                    <a-select-option v-for="item in departmentData" :key="item.departmentId">{{item.departmentName}}</a-select-option>
                 </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="9" :sm="24" >
                <a-form-item
                  label="时间"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 19, offset: 0}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
            </a-row>
             <a-row v-else-if='routerName === "followPlanMaster"'>
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label='患者名称'
                  :labelCol="{span: 7}"
                  :wrapperCol="{span: 15, offset: 1}">
                  <a-input v-model="queryParams[listJson[routerName].title]"/>
                </a-form-item>
              </a-col>
               <a-col :md="8" :sm="24" >
                <a-form-item
                  label='随访类型'
                  :labelCol="{span: 7}"
                  :wrapperCol="{span: 16, offset: 1}">
                 <a-select style="width: 100%" @change='changeFollowType' allowClear>
                    <a-select-option v-for="item in dropFollowTypeData" :key="item.dictId">{{item.dictName}}</a-select-option>
                 </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24" >
                <a-form-item
                  label="时间"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 19, offset: 0}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-else>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label='名称'
                  :labelCol="{span: 3}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams[listJson[routerName].title]"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="创建时间"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
      </section>
      <!-- 表格区域 -->
      <section>
        <div class="operator">
          <button-list
            v-on:selectedRowKeys="onSelectChange"
            @search='search'
            @add='add'
            @fetch='fetch'
            @getOnline='getOnline'
            :dataSource="dataSource"
            :buttonData='buttonData'
            :routerName='routerName'
            :moduleType='moduleType'
            @column='column=true'
            :selectedRowKeys='selectedRowKeys' />
        </div>
        <a-table
          ref="TableInfo"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :rowKey="record => record[`${routerId}`]"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :scroll="{ x: '1300' }"
          @change="handleTableChange">
          <!-- TODO: 优化一下部分 为什么不能遍历？ 应该可以的 -->
          <!-- 日志里面的方法 -->
          <template slot="method" slot-scope="text">
            <a-popover placement="topLeft">
              <template slot="content">
                <div>{{text}}</div>
              </template>
              <p style="width: 150px;margin-bottom: 0">{{text}}</p>
            </a-popover>
          </template>
          <!-- 日志里面的参数 -->
          <template slot="params" slot-scope="text">
            <a-popover placement="topLeft">
              <template slot="content">
                <div style="max-width: 300px;">{{text}}</div>
              </template>
              <p style="width: 100px;margin-bottom: 0">{{text}}</p>
            </a-popover>
          </template>
          <!-- 模板答案 -->
          <template slot="answer" slot-scope="text">
            <a-popover placement="topLeft">
              <template slot="content">
                <div>{{text}}</div>
              </template>
              <p style="width: 200px;margin-bottom: 0">{{text}}</p>
            </a-popover>
          </template>
          <!-- 操作 -->
          <template slot="operation" slot-scope="text, record">
            <a-icon v-hasPermission="[routerName+':update']" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
            &nbsp;
            <a-icon type="eye" v-if='filterInfo' theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          </template>
        </a-table>
      </section>
      <!-- 新增 -->
      <table-add
        ref="Add"
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
import buttonList from './buttonList'
import RangeDate from '@/components/datetime/RangeDate'
import { mapState } from 'vuex'
import { initFun } from './initData.js'
import table from '@/mixins/table'
import tableAdd from './tableAdd'
import tableEdit from './tableEdit'
import tableInfo from './tableInfo'
import tableColumn from './tableColumn'
import {Form, Button, Col, Table, Input, Row, Icon, Card, Popover, Select} from 'ant-design-vue'
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
    RangeDate,
    buttonList,
    tableAdd,
    tableEdit,
    tableInfo,
    tableColumn,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  mixins: [table],
  data () {
    return {
      column: false,
      queryParams: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      colParams: {
        subjectName: '',
        subjectKey: ''
      },
      routerId: '',
      routerPath: '',
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
      hospitalData: [],
      departmentData: [],
      dropFollowTypeData: [],
      form: this.$form.createForm(this)
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
      handler: function (to) {
        this.routerPath = to.path
        this.routerName = to.path.match(/\/([^/]*)$/)[1]
        // id 不唯一的时候判断
        if (this.listJson[this.routerName] && !this.listJson[this.routerName].id) {
          this.routerId = this.routerName + 'Id'
        } else {
          this.routerId = this.listJson[this.routerName] && this.listJson[this.routerName].id
        }
        this.moduleType = to.path.match(/\/(\S*)\//)[1]
        // 当前组件为系统监控的时候需要分页而且不需要高级查询 其他一致
        if (this.moduleType === 'manage/sys/monitor') {
          this.pagination = false
          this.getOnline()
        } else {
          this.fetch()
        }
      },
      immediate: true
    }
  },
  methods: {
    add () {
      this.addVisiable = true
    },
    edit (record) {
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
      this.search()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleAddSuccess () {
      this.addVisiable = false
      this.$message.success('新增成功')
      this.search()
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    getOnline (params = {}) {
      this.$get('/manage/sys/monitor/online', { ...params }).then((res) => {
        if (res.data.code === 200) {
          this.dataSource = res.data.data
          this.loading = false
        }
      }).catch(() => {})
    },
    fetchSubject (params = {}) {
      this.$get('/manage/label/subject/list', {...params}).then(res => {
        if (res.data.code === 200) {
          this.titleList = res.data.data
        }
      }).catch(() => {})
    },
    _search () {
      this.fetchSubject(this.colParams)
    },
    _reset () {
      this.colParams = {}
      this.fetchSubject()
    },
    changeDepartment (value) {
      this.queryParams.departmentId = value || ''
    },
    changeHospital (value) {
      this.queryParams.hospitalId = value || ''
    },
    changeFollowType (value) {
      console.log(value)
      this.queryParams.followType = value | ''
    },
    fectchMultiple (arr, pre) {
      const promises = arr.map(url => {
        return this.$get(pre + url).then(res => {
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
  },
  created () {
    if (this.routerName === 'patientOrder') {
      this.fectchMultiple(['department', 'hospital'], '/manage/sys/')
    } 
    if (this.routerName === 'followPlanMaster') {
      this.$get( '/manage/result/followPlanMaster/dropFollowType').then((res) => {
        if (res.data.code === 200) {
          this.dropFollowTypeData = res.data.data
        }
      }).catch(() => {})
    } 
    this.fetchSubject()
    this.getButtonList()
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
    font-size: 0.9rem;
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
@import "../../assets/css/Common";
</style>
