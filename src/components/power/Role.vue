<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>権限管理</el-breadcrumb-item>
      <el-breadcrumb-item>ロールリスト</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="addRoleDiaglog">ロール増加</el-button>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item_1, index_1) in scope.row.children" :key="item_1.id" :class="[index_1 === 0 ? 'bgTop' : '', 'bgBottom', 'vcenter']">
              <el-col :span="5">
                <el-tag type closable @close="removeRightById(scope.row, item_1.id)">{{item_1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item_2, index_2) in item_1.children" :key="item_2.id" :class="[index_2 === 0 ? '' : 'bgTop', 'vcenter']">
                  <el-col :span="7">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item_2.id)">{{item_2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-tag
                      type
                      v-for="(item_3, index_3) in item_2.children"
                      :key="item_3.id"
                      :class="[index_3 === 0 ? '' : 'bgTop']"
                      closable
                      @close="removeRightById(scope.row, item_3.id)"
                    >{{item_3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="No."></el-table-column>
        <el-table-column prop="roleName" label="ロール名"></el-table-column>
        <el-table-column prop="roleDesc" label="ロール内容"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="編集" placement="none" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row)">編集</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="削除" placement="none" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeRoleById(scope.row.id)">削除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="権限配布" placement="none" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small" @click="showSetRightDialog(scope.row)">権限配布</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- addDialog -->
    <el-dialog title="新規" :visible.sync="showAddDialogVisible" width="50%" hide-required-asterisk @close="addDialogClosed">
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleForm" label-width="120px">
        <el-form-item label="ロール名" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="ロール内容" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialogVisible = false">取消し</el-button>
        <el-button type="primary" @click="addRole">確定</el-button>
      </span>
    </el-dialog>

    <!-- editDialog -->
    <el-dialog title="編集" :visible.sync="showEditDialogVisible" width="50%" hide-required-asterisk @close="editDialogClosed">
      <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleForm" label-width="120px">
        <el-form-item label="ロール名" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="ロール内容" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisible = false">取消し</el-button>
        <el-button type="primary" @click="editRole">確定</el-button>
      </span>
    </el-dialog>

    <!-- addDialog -->
    <el-dialog title="権限配布" :visible.sync="showRightDialogVisible" width="50%" hide-required-asterisk @close="clearRights">
      <el-tree
        :data="rightList"
        :props="rightTreeProps"
        default-expand-all
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        node-key="id"
        ref="roleTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightDialogVisible = false">取消し</el-button>
        <el-button type="primary" @click="editRight">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
      roleList: [],
      showAddDialogVisible: false,
      showEditDialogVisible: false,
      showRightDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [{ required: true, message: 'ロール名を入力してください', trigger: 'blur' }]
      },
      editRoleForm: {
      },
      editRoleRules: {
        roleName: [{ required: true, message: 'ロール名を入力してください', trigger: 'blur' }]
      },
      rightList: [],
      rightTreeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckedKeys: [],
      roleId: ''
    }
  },
  methods: {
    getRoleList () {
      this.$http.get('roles')
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message_error('データを読み込むが失敗しました')
          } else {
            this.roleList = res.data.data
          }
        })
        .catch(err => {
          return this.$message_error('データを読み込むが失敗しました')
        })
    },

    addDialogClosed () {
      this.showAddDialogVisible = false
    },

    addRoleDiaglog () {
      this.showAddDialogVisible = true
    },

    editDialogClosed () {
      this.showEditDialogVisible = false
    },

    // addRole
    addRole () {
      this.$refs.addRoleForm.validate(valid => {
        if (!valid) {
          return this.$message_error('新規失敗')
        } else {
          this.$http.post('/roles', this.addRoleForm)
            .then(res => {
              this.$message_success('新規成功')
              this.showAddDialogVisible = false
              this.getRoleList()
            })
            .catch(err => {
              return this.$message_error('新規失敗')
            })
        }
      })
    },

    // showEditDialog
    showEditDialog (roleInfo) {
      this.$http.get(`roles/${roleInfo.id}`)
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message_error('該当ロールがありません')
          } else {
            this.editRoleForm = res.data.data
            this.showEditDialogVisible = true
          }
        })
        .catch(err => {
          return this.$message_error('該当ロールがありません')
        })
    },

    // editRole
    editRole () {
      this.$refs.editRoleForm.validate(valid => {
        if (!valid) {
          return this.$message_error('編集失敗')
        } else {
          this.$http.put(`roles/${this.editRoleForm.roleId}`, { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc })
            .then(res => {
              this.$message_success('編集成功')
              this.getRoleList()
              this.showEditDialogVisible = false
            })
            .catch(err => {
              return this.$message_error('編集失敗')
            })
        }
      })
    },

    // データを削除操作
    removeRoleById (id) {
      this.$confirm('この操作はデータを削除します, 続いてですか?', '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${id}`)
          .then(res => {
            this.$message_success('成功しました')
            this.getRoleList()
          })
          .catch(err => {
            return this.$message_error('失敗しました')
          })
      }).catch(() => {
        this.$message_error('キャンセルしました')
      })
    },

    removeRightById (rightData, rightId) {
      this.$confirm('この操作はデータを削除します, 続いてですか?', '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${rightData.id}/rights/${rightId}`)
          .then(res => {
            this.$message_success('成功しました')
            // 全画面もう一度リニューアル
            //  this.getRoleList()
            rightData.children = res.data.data
          })
          .catch(err => {
            return this.$message_error('失敗しました')
          })
      }).catch(() => {
        this.$message_error('キャンセルしました')
      })
    },

    showSetRightDialog (role) {
      this.roleId = role.id
      this.$http.get('rights/tree')
        .then(res => {
          this.$message_success('権限取得を成功')
          this.rightList = res.data.data
          this.getRightLeafKeys(role, this.defaultCheckedKeys)
          this.showRightDialogVisible = true
        })
        .catch(err => {
          return this.$message_error('権限取得を失敗')
        })
    },

    // get third leaf id
    getRightLeafKeys (node, array) {
      if (!node.children) {
        return array.push(node.id)
      }
      node.children.forEach(item => {
        this.getRightLeafKeys(item, array)
      })
    },

    clearRights () {
      this.defaultCheckedKeys = []
    },

    editRight () {
      const checkedKeys = [
        ...this.$refs.roleTreeRef.getCheckedKeys(),
        ...this.$refs.roleTreeRef.getHalfCheckedKeys()
      ]
      const keysStr = checkedKeys.join(',')
      console.log(keysStr)
      this.$http.post(`roles/${this.roleId}/rights`, { rids: keysStr })
        .then(res => {
          this.$message_success('権限配布を成功')
          this.getRoleList()
          this.showRightDialogVisible = false
        })
        .catch(err => {
          return this.$message_error('権限配布を失敗')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bgTop {
  border-top: 1px solid #eeeeee;
}

.bgBottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
