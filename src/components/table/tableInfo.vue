<template>
  <a-drawer
    :title="comData && comData.infoTitle"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="true"
    @close="close"
    :visible="infoVisiable"
    style="height: calc(100% - 55px); overflow: auto; padding-bottom: 53px;"
  >
    <template v-for='(item, index) of comData && comData.infoArray'>
      <p :key='index'>
        <a-icon :type='item.type'/>
        &nbsp;{{item.name}} {{info[item.value]}}
      </p>
    </template>
    <!-- 如果当前路由为角色 -->
    <p v-if='routerName === "role"'>
      <a-icon type="trophy" />&nbsp;所拥有的权限：
      <a-tree
        :key="key"
        :checkStrictly="checkStrictly"
        :checkable="true"
        :defaultCheckedKeys="checkedKeys"
        :defaultExpandedKeys="checkedKeys"
        :expandedKeys="expandedKeys"
        @expand="handleExpand"
        :treeData="menuTreeData">
      </a-tree>
    </p>
    <template v-if='filterInfo && answerData'>
      <p><a-icon type="question-circle" />&nbsp;模板题目问题：&nbsp;&nbsp; {{answerData.title}}</p>
      <p> <a-icon type="question-circle" />&nbsp;模板题目答案：<detail-list :list="answerData.children" /></p>
    </template>
  </a-drawer>
</template>
<script>
import { mapState } from 'vuex'
import {Icon, Drawer, Tree} from 'ant-design-vue'
import detailList from './detailList'
const comData = require('./comData')
export default {
  props: ['info', 'infoVisiable', 'routerName'],
  data () {
    return {
      key: +new Date(),
      loading: true,
      checkStrictly: false,
      checkedKeys: [],
      menuTreeData: [],
      answerData: '',
      expandedKeys: []
    }
  },
  components: {
    detailList,
    AIcon: Icon,
    ADrawer: Drawer,
    ATree: Tree
  },
  methods: {
    close () {
      this.$emit('close')
      this.checkedKeys = []
    },
    handleExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    }
  },
  computed: {
    comData () {
      return comData[this.routerName]
    },
    filterInfo () {
      let filterArray = ['tempSubject', 'questionnaire']
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
  watch: {
    infoVisiable: {
      handler () {
        if (!this.infoVisiable) return
        let fetch = (url) => {
          this.$get(url).then((res) => {
            if (res.data.code === 200) {
              let str = JSON.stringify(res.data.data)
              this.answerData = JSON.parse(str.replace(/(\w+)Name(?=":)/g, 'title'))
            }
          }).catch(() => {})
        }
        let fetchMenu = () => {
          this.$get('/manage/sys/menu').then((res) => {
            if (res.data.code === 200) {
              this.menuTreeData = res.data.data.rows.children
              this.$get('/manage/sys/role/menu/' + this.info.roleId).then((res) => {
                if (res.data.code === 200) {
                  this.checkedKeys = res.data.data
                  this.key = +new Date()
                }
              }).catch(() => {})
            }
          }).catch(() => {})
        }
        switch (this.routerName) {
          case 'role':
            fetchMenu()
            break
          case 'tempSubject':
            fetch(`/manage/label/tempSubject/detail/${this.info.subjectId}`)
            break
          case 'questionnaire':
            fetch(`/manage/label/questionnaire/list/${this.info.questionnaireId}`)
            break
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>

</style>
