<template>
  <li>
    <div @click="vShow(tree)" v-if="tree.children.length" class='tree--show' :class='[ tree.open ? "arrow--close" : "arrow--open"]'>
      <span class="bottom_open" />
    </div>
    <span v-else style='background: white;' class="button"/>
    <span v-if="checkBox"
      @click="selectCheckBox(tree)"
      class="button chk"
      :class="tree.checked ? 'checkbox_true_full' : ''" />
    <span :title="tree.title">
      <span class="node_name">{{tree.title}}</span>
    </span>
    <ul >
      <treeCore
        v-for="(tr, i) in tree.children"
        v-show="tree.open"
        :key="i"
        :checkBoxType="checkBoxType"
        :checkBox="checkBox"
        :index="i"
        :tree="tr"
        :currentArray="tree.children"
        :parentTree="tr.parentTree"
        :checkBoxCallInit="checkBoxCallInit"
        :checkBoxCall="checkBoxCall"
      />
    </ul>
  </li>
</template>
<script>
export default {
  name: 'treeCore',
  props: {
    tree: {
      type: Object,
      required: true
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
    },
    last: {
      type: Boolean,
      default: null,
      required: false
    },
    currentArray: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    parentTree: {
      type: Object,
      required: false
    },
    checkBoxCallInit: {
      type: Function
    },
    checkBoxCall: {
      type: Function
    }
  },
  data () {
    return {
      currentTree: this.tree
    }
  },
  methods: {
    coreInit () {
      if (this.tree.checked) {
        let checkedBoxArr = []
        checkedBoxArr.push(this.tree)
        let selectParent = (data) => {
          if (!data.checked) {
            data.checked = this.tree.checked
            checkedBoxArr.push(data)
          }
          if (data.parentTree) {
            selectParent(data.parentTree)
          } else {
            this.checkBoxCallInit(checkedBoxArr)
          }
        }
        selectParent(this.currentTree)
      }
    },
    vShow (tree) {
      tree.open = !tree.open
    },
    selectCheckBox (tree) {
      tree.checked = !tree.checked
      let checkedBoxArr = []
      checkedBoxArr.push(tree)
      if (this.checkBoxType) {
        let changeChecked = (data) => {
          data.forEach(d => {
            checkedBoxArr.push(d)
            d.checked = tree.checked
            if (d.children) {
              changeChecked(d.children)
            }
          })
        }
        changeChecked(tree.children)

        let checkChildren = (data) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
              return true
            }
          }
        }
        let selectParent = (data) => {
          if (data.children.length > 1) {
            const childExistsThis = []
            data.children.forEach((m, index) => {
              if (index !== this.index) {
                childExistsThis.push(m)
              }
            })
            if (childExistsThis && data.checked && checkChildren(childExistsThis)) {
              return
            }
          }
          checkedBoxArr.push(data)
          data.checked = tree.checked
          if (data.parentTree) {
            selectParent(data.parentTree)
          }
        }
        if (this.parentTree) {
          selectParent(this.parentTree)
        }
      }
      this.checkBoxCall(checkedBoxArr, tree.checked)
    }
  },
  created () {
    this.coreInit()
  },
  computed: {
    classes () {
      return function () {
        return this.currentArray.length - 1 === this.index ? 'bottom_docu' : 'center_docu'
      }
    }
  },
  watch: {
    tree: {
      handler (oldV, newV) {
        if (newV.checked) {
          // this.tree.checked = newV.checked
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/css/tree";
</style>
