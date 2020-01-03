<template>
  <div class="operator">
    <template v-for='(item, $index) of buttonData'>
      <a-button
        v-if="item.buttonType !== 'update'"
        v-hasPermission="[item.permission]"
        :key='$index'
        style='margin-right: 7px'
        @click='handleType(item)'
      >
        {{item.text}}
      </a-button>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {Button} from 'ant-design-vue'
export default {
  props: ['buttonData', 'routerName', 'selectedRowKeys', 'moduleType', 'dataSource'],
  computed: {
    ...mapState({
      userInfo: state => state.account.user
    })
  },
  components: {
    AButton: Button
  },
  methods: {
    handleType (item) {
      switch (item.buttonType) {
        // 新增
        case 'add':
          this._add()
          break
        // 删除
        case 'delete':
          this._delete()
          break
        // 踢出
        case 'kickout':
          this._kickout()
          break
        // 密码重置
        case 'reset':
          this._reset()
          break
        // 导出Excel
        case 'export':
          this._export()
          break
        // 启用
        case 'enable':
          this._enable()
          break
        // 禁用
        case 'freeze':
          this._freeze()
          break
        // config
        case 'config':
          this.config()
          break
      }
    },
    config () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要配置的问卷')
        return
      }
      if (this.selectedRowKeys.length > 1) {
        this.$message.warning('只能选择一个问卷配置')
        return
      }
      this.dataSource.forEach(el => {
        // 当问卷状态为 {1} 启动时候 不可配置问卷
        if (el.questionnaireId === +this.selectedRowKeys.join()) {
          if (el.questionnaireState === 1) {
            this.$message.warning('当前用户已启用，不可配置')
          } else {
            this.$emit('column')
          }
        }
      })
    },
    _add () {
      this.$emit('add')
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
          this.$delete(`/${this.moduleType}/${this.routerName}/` + ids.join(',')).then((res) => {
            if (+res.status === 200) {
              this.$message.success('删除成功')
              this.$emit('selectedRowKeys', [])
              this.$emit('search')
            } else {
              this.$message.error('删除用户失败')
            }
          }).catch(() => {})
        },
        onCancel: () => {
          this.$emit('selectedRowKeys', [])
        }
      })
    },
    _kickout () {
      let ids = []
      for (let key of this.selectedRowKeys) {
        ids.push(key)
      }
      this.$delete(`/monitor/sys/kickout/` + ids.join(',')).then((res) => {
        if (+res.status === 200) {
          this.$message.success('踢出用户成功')
          this.$emit('selectedRowKeys', [])
          this.$emit('getOnline')
          if (ids.includes(this.userInfo.id)) {
            this.$db.clear()
            location.reload()
          }
        } else {
          this.$message.error('删除用户失败')
        }
      }).catch(() => {
        this.$message.error('踢出用户成功失败')
      })
    },
    _export () {
      alert('export 未开发')
    },
    _reset () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要重置密码的用户')
        return
      }
      this.$confirm({
        title: '确定重置选中用户密码?',
        content: '当您点击确定按钮后，这些用户的密码将会重置为123456',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let userNames = []
          for (let key of this.selectedRowKeys) {
            userNames.push(key)
          }
          this.$put('/manage/sys/user/password/reset', {
            userNames: userNames.join(',')
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success('重置用户密码成功')
              this.$emit('selectedRowKeys', [])
              // 如果选中用户为当前用户 让他重新登录
              let currentUser = this.userInfo.userName
              if (userNames.includes(currentUser)) {
                this.logout()
              }
            }
          })
        },
        onCancel: () => {
          this.$emit('selectedRowKeys', [])
        }
      })
    },
    logout () {
      setTimeout(() => {
        this.$get(`/manage/logout/${this.userInfo.id}`).then(() => {
          return new Promise(() => {
            this.$db.clear()
            location.reload()
          })
        }).catch(() => {
          this.$message.error('退出系统失败')
        })
      }, 1500)
    },
    // 启用
    _enable () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要启用的问卷')
        return
      }
      this.dataSource.forEach(el => {
        if (el.questionnaireId === +this.selectedRowKeys.join()) {
          if (el.questionnaireState === 1) {
            this.$message.warning('当前用户已启用')
          } else {
            this.$confirm({
              title: '确定启用选择的问卷?',
              content: '当您点击确定按钮后，这些问卷将会启用',
              centered: true,
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                let ids = []
                for (let key of this.selectedRowKeys) {
                  ids.push(key)
                }
                this.$put('/manage/label/questionnaire/enable', {
                  questionnaireId: ids.join(',')
                }).then((res) => {
                  if (res.data.code === 200) {
                    this.$message.success('问卷启用成功')
                    this.$emit('fetch')
                    this.$emit('selectedRowKeys', [])
                  }
                })
              },
              onCancel: () => {
                this.$emit('selectedRowKeys', [])
              }
            })
          }
        }
      })
    },
    // 禁止
    _freeze () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要禁用的问卷')
        return
      }
      this.dataSource.forEach(el => {
        if (el.questionnaireId === +this.selectedRowKeys.join()) {
          if (el.questionnaireState === 0) {
            this.$message.warning('当前用户已禁用')
          } else {
            this.$confirm({
              title: '确定禁用选择的问卷?',
              content: '当您点击确定按钮后，这些问卷将会禁用',
              centered: true,
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                let ids = []
                for (let key of this.selectedRowKeys) {
                  ids.push(key)
                }
                this.$put('/manage/label/questionnaire/freeze', {
                  questionnaireId: ids.join(',')
                }).then((res) => {
                  if (res.data.code === 200) {
                    this.$message.success('问卷禁用成功')
                    this.$emit('fetch')
                    this.$emit('selectedRowKeys', [])
                  }
                })
              },
              onCancel: () => {
                this.$emit('selectedRowKeys', [])
              }
            })
          }
        }
      })
    }
  }
}
</script>
