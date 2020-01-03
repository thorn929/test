
import { mapState } from 'vuex'
export default {
  data () {
    return {
      sortedInfo: null,
      paginationInfo: null,
      loading: false,
      dataSource: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.account.user
    })
  },
  methods: {
    search () {
      let {sortedInfo} = this
      let sortField, sortOrder
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        sortField = sortedInfo.field
        sortOrder = sortedInfo.order
      }
      this.fetch({
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列排序规则
      this.sortedInfo = null
      // 重置查询参数
      this.queryParams = {}
      // 清空时间选择
      this.$refs.createTime.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这两个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      sorter.order = 'descend'
      this.sortedInfo = sorter
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams
      })
    },
    fetchAnswer () {
      let url
      switch (this.routerName) {
        case 'tempSubject':
          url = '/manage/label/tempSubject/tempAnswer'
          break
        case 'subject':
          url = '/manage/label/subject/answer'
          break
        case 'questionnaire':
          url = '/manage/label/questionnaire/listSubject'
          break
      }
      return this.$get(url, {}).then((res) => {
        if (res.data.code === 200) {
          return res.data.data
        }
      }).catch(() => {})
    },
    fetch (params = {}) {
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      this.$get(`/${this.moduleType}/${this.routerName}`, {
        ...params
      }).then(async (res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          // 因模板题目管理不支持分页 只能拉取其他接口 把子数组插入当前数组中
          // TODO 记得分页过多会不会有问题
          let filterName = ['tempSubject', 'subject', 'questionnaire']
          if (filterName.includes(this.routerName)) {
            let answerData = await this.fetchAnswer()
            this.dataSource = data.rows.map((el, index) => {
              let arr = []
              answerData[index].children.forEach(el => {
                arr.push(el.answerName || el.subjectName)
              })
              el.arr = arr.join(', ')
              return el
            })
          } else {
            this.dataSource = data.rows
          }
          const pagination = { ...this.pagination }
          pagination.total = data.total
          this.pagination = pagination
          this.loading = false
        }
      }).catch(() => {})
    },
    getButtonList () {
      this.loading = true
      this.$get('/manage/sys/menu').then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.loading = false
          data.rows.children.map((item) => {
            // id: 1 -> 系统管理模块 145 -> 系统监控模块  151 -> 问卷配置
            // let filterId = [1, 145, 151]
            if (+item.id) {
              if (!item.children) return
              item.children.map((el) => {
                if (el.path === this.routerPath) {
                  if (!el.children) return
                  el.children.map((ell) => {
                    if (ell.permission) {
                      ell['buttonType'] = ell.permission.split(':')[1]
                    }
                    return el
                  })
                  this.buttonData = el.children
                }
              })
            }
          })
        }
      }).catch(() => {})
    },
    batchDelete () {
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
          this.$delete(`/manage/sys/${this.routerName}/` + ids.join(',')).then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.search()
            }
          }).catch(() => {})
        },
        onCancel: () => {
          this.selectedRowKeys = []
        }
      })
    }
  }
}
