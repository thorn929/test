<template>
  <div>
    <ul class="ztree">
      <vTree v-for="(node,index) in treeData"
        :key="index"
        :checkBoxType="checkBoxType"
        :allOpen="allOpen"
        :checkBox="checkBox"
        :index="index"
        :tree="node"
        :currentArray="treeData"
        :parentTree="node.parentTree"
        :checkBoxCallInit="checkBoxCallInit"
        :checkBoxCall="checkBoxCall"
      />
    </ul>
  </div>
</template>

<script>
import vTree from './tree-core'
export default {
  components: {vTree},
  name: 'tree',
  props: {
    treeNode: {
      type: Array,
      default: () => [],
      required: true
    },
    allOpen: {
      type: Boolean,
      default: null,
      required: false
    },
    checkBox: {
      type: Boolean,
      default: false,
      required: false
    },
    checkBoxType: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
      treeData: [],
      first: true,
      allOpens: this.allOpen,
      checkedBoxCallArr: []
    }
  },
  methods: {
    init () {
      let tempList = JSON.parse(JSON.stringify(this.treeNode))
      let initTree = (tree, parent) => {
        for (let index = 0; index < tree.length; index++) {
          let m = tree[index]
          if (!m.hasOwnProperty('id')) {
            m.id = m.hasOwnProperty('id') ? m.id : null
          }
          if (!m.hasOwnProperty('open')) {
            m.open = m.hasOwnProperty('open') ? m.open : false
          }
          if (!m.hasOwnProperty('checked')) {
            m.checked = m.hasOwnProperty('checked') ? m.checked : false
          }
          if (!m.hasOwnProperty('checkBox')) {
            m.checkBox = m.hasOwnProperty('checkBox') ? m.checkBox : false
          }
          if (!m.hasOwnProperty('checkBoxType')) {
            m.checkBoxType = this.checkBoxType
          }
          if (!m.hasOwnProperty('parentTree')) {
            m.parentTree = parent || null
          }

          m.children = m.children || []
          if (m.children.length > 0) {
            initTree(m.children, m)
          }
        }
      }
      initTree(tempList, null)
      this.treeData = tempList
    },
    checkBoxCallInit (arr) {
      arr.forEach(a => {
        this.checkedBoxCallArr.push(a)
      })
    },
    checkBoxCall (arr, isAdd) {
      if (isAdd) {
        arr.forEach(a => {
          this.checkedBoxCallArr.push(a)
        })
      } else {
        arr.forEach(a => {
          if (this.checkBoxCall.length === 0) {
            return
          }
          let key = (a.id ? a.id : null) + a.index + a.title
          this.checkedBoxCallArr.forEach((ss, index) => {
            if (((ss.id ? ss.id : null) + ss.index + ss.title) === key) {
              this.checkedBoxCallArr.splice(index, 1)
            }
          })
        })
      }
      this.$emit('checkBoxCall', this.checkedBoxCallArr)
    },
    // 是否展示全部
    changeOpenStatus () {
      let changeOpen = (data) => {
        data.forEach(d => {
          d.open = this.allOpen
          if (d.children) {
            changeOpen(d.children)
          }
        })
      }
      changeOpen(this.treeData)
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.$emit('checkBoxCall', this.checkedBoxCallArr)
  },
  watch: {
    allOpen () {
      this.changeOpenStatus()
    },
    treeNode () {
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/css/tree";
</style>