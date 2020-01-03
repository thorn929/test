<template>
 <div>
    <div
      class="item"
      v-for="(item, index) of list"
      :key="index"
    >
     <div class="item-title">{{index+1}}、{{item.title}}</div>
      <div v-if="item.children" class="item-chilren">
        <detail-list :list="item.children"></detail-list>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DetailList',
  props: ['list']
}
</script>
<style lang="less" scoped>
.item-title {
  padding: 5px 30px
}
.item-chilren {
  padding: 5px 25px
}
</style>
