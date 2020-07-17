<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>権限管理</el-breadcrumb-item>
      <el-breadcrumb-item>権限リスト</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="権限名"></el-table-column>
        <el-table-column prop="path" label="ルート"></el-table-column>
        <el-table-column prop="level" label="権限クラス">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一級</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二級</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三級</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightList()
  },

  data () {
    return {
      rightList: []
    }
  },

  methods: {
    getRightList () {
      this.$http.get('rights/list')
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message_error('データを読み込むが失敗しました')
          } else {
            this.rightList = res.data.data
          }
        })
        .catch(err => {
          return this.$message_error('データを読み込むが失敗しました')
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
