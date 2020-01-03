<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="名称"
                :labelCol="{span: 3}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.menuName"/>
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
    </div>
    <div>
      <div class="operator">
        <a-button v-hasPermission="['menu:add']" @click='addVisible=true'>新增</a-button>
        <a-button v-hasPermission="['menu:delete']" @click="batchDelete">删除</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table :columns="columns"
               :key="key"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange" :scroll="{ x: 1500 }">
        <template slot="icon" slot-scope="text">
         <a-icon :type="text" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="['menu:update']" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          <a-badge v-hasNoPermission="['menu:update']" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
     <!-- 新增菜单 -->
    <menu-add
      @close="addVisible = false"
      @success="handleAddSuccess"
      :addVisible="addVisible">
    </menu-add>
    <!-- 修改按钮 -->
    <button-edit
      ref="buttonEdit"
      @close="handleButtonEditClose"
      @success="handleButtonEditSuccess"
      :buttonEditVisiable="buttonEditVisiable">
    </button-edit>
     <!-- 修改菜单 -->
    <menu-edit
      ref="menuEdit"
      @close="handleMenuEditClose"
      @success="handleMenuEditSuccess"
      :menuEditVisiable="menuEditVisiable">
    </menu-edit>
    <a-tag /> 
  </a-card>
</template>

<script>
import RangeDate from '@/components/datetime/RangeDate'
import ButtonEdit from './ButtonEdit'
import MenuEdit from './MenuEdit'
import MenuAdd from './MenuAdd'
import { mapState } from 'vuex'
import {Form, Button, Col, Input, Row, Icon, Card, Table, Badge, Tag} from 'ant-design-vue'
export default {
  name: 'Menu',
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AButton: Button,
    ACol: Col,
    AIcon: Icon,
    AInput: Input,
    ARow: Row,
    ACard: Card,
    ATable: Table,
    ABadge: Badge,
    ATag: Tag,
    ButtonEdit,
    RangeDate,
    MenuEdit,
    MenuAdd
  },
  data () {
    return {
      advanced: false,
      key: +new Date(),
      queryParams: {},
      filteredInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      pagination: {
        defaultPageSize: 10000000,
        hideOnSinglePage: true,
        indentSize: 100
      },
      loading: false,
      buttonEditVisiable: false,
      menuEditVisiable: false,
      addVisible: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '名称',
        dataIndex: 'text',
        width: 200,
        fixed: 'left'
      }, {
        title: '图标',
        dataIndex: 'icon',
        scopedSlots: { customRender: 'icon' }
      }, {
        title: '类型',
        dataIndex: 'type',
        customRender: (text) => {
          switch (text) {
            case '0':
              return <a-tag color="cyan"> 菜单 </a-tag>
            case '1':
              return <a-tag color="pink"> 按钮 </a-tag>
            default:
              return text
          }
        }
      }, {
        title: '地址',
        dataIndex: 'path'
      }, {
        title: 'Vue组件',
        dataIndex: 'component'
      }, {
        title: '权限',
        dataIndex: 'permission'
      }, {
        title: '排序',
        dataIndex: 'order'
      }, {
        title: '创建时间',
        dataIndex: 'createTime'
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 120,
        scopedSlots: {customRender: 'operation'},
        fixed: 'right'
      }]
    },
    ...mapState({
      userInfo: state => state.account.user
    })
  },
  mounted () {
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleMenuEditClose () {
      this.menuEditVisiable = false
    },
    handleMenuEditSuccess () {
      this.menuEditVisiable = false
      this.$message.success('修改菜单成功')
      this.fetch()
    },
    handleButtonEditClose () {
      this.buttonEditVisiable = false
    },
    handleButtonEditSuccess () {
      this.buttonEditVisiable = false
      this.$message.success('修改按钮成功')
      this.fetch()
    },
    handleAddSuccess () {
      this.addVisible = false
      this.$message.success('新增成功')
      this.fetch()
    },
    edit (record) {
      if (record.type === '0') {
        this.$refs.menuEdit.setFormValues(record)
        this.menuEditVisiable = true
      } else {
        this.$refs.buttonEdit.setFormValues(record)
        this.buttonEditVisiable = true
      }
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    batchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      let that = this
      this.$confirm({
        title: '确定删除所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          that.$delete('/manage/sys/menu/' + that.selectedRowKeys.join(','), { }).then((res) => {
            if (res.data.code === 200) {
              that.$message.success('删除成功')
              that.selectedRowKeys = []
              that.fetch()
            }
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exprotExccel () {
      let {filteredInfo} = this
      this.$export('menu/excel', {
        ...this.queryParams,
        ...filteredInfo
      })
    },
    search () {
      let {filteredInfo} = this
      this.fetch({
        ...this.queryParams,
        ...filteredInfo
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置查询参数
      this.queryParams = {}
      // 清空时间选择
      this.$refs.createTime.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这两个个参数赋值给Vue data，用于后续使用
      this.filteredInfo = filters
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      this.loading = true
      this.$get('/manage/sys/menu', {
        ...params
      }).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.loading = false
          if (Object.is(data.rows.children, undefined)) {
            this.dataSource = data.rows
          } else {
            this.dataSource = data.rows.children
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/Common";
</style>
