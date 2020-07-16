<template>
  <div>
    <!-- breadcrumb -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>ユーザー管理</el-breadcrumb-item>
      <el-breadcrumb-item>ユーザーリスト</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input v-model="queryInfo.query" placeholder="条件を入力してください" clearable @clear="getUserList()">
              <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="7">
            <el-button type="primary" @click="dialogVisible=true">新規ユーザー</el-button>
          </el-col>
        </el-row>
        <!-- リストテーブル -->
        <el-table :data="userList" stripe border>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="名前"></el-table-column>
          <el-table-column prop="email" label="メールアドレス"></el-table-column>
          <el-table-column prop="mobile" label="携帯"></el-table-column>
          <el-table-column prop="role_name" label="ロール"></el-table-column>
          <el-table-column prop="mg_state" label="ステータス">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStatusChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="編集" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="削除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="権限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- ページネーション -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- dialog -->
        <el-dialog title="新規" :visible.sync="dialogVisible" width="50%" hide-required-asterisk @close="addDialogClosed">
          <el-form :model="addUserForm" :rules="addUseRules" ref="addUserForm" label-width="120px">
            <el-form-item label="ユーザー名" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="パスワード" prop="password">
              <el-input v-model="addUserForm.password"></el-input>
            </el-form-item>
            <el-form-item label="メールアドレス" prop="email">
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="携帯" prop="mobile">
              <el-input v-model="addUserForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消し</el-button>
            <el-button type="primary" @click="addUser">確定</el-button>
          </span>
        </el-dialog>

        <!-- editDialog -->
        <el-dialog title="編集" :visible.sync="showEditDialogVisible" width="50%" hide-required-asterisk @close="editDialogClosed">
          <el-form :model="editUserForm" :rules="editUseRules" ref="editUserForm" label-width="120px">
            <el-form-item label="ユーザー名" prop="username">
              <el-input v-model="editUserForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="メールアドレス" prop="email">
              <el-input v-model="editUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="携帯" prop="mobile">
              <el-input v-model="editUserForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showEditDialogVisible = false">取消し</el-button>
            <el-button type="primary" @click="editUser">確定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    var checkMail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('メールアドレスが無効です'))
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('携帯番号が無効です'))
    }

    return {
      // query対象
      queryInfo: {
        query: '',
        // current page num
        pagenum: 1,
        // current show page size
        pagesize: 10
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      showEditDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
      },
      addUseRules: {
        username: [
          { required: true, message: 'ユーザー名を入力してください', trigger: 'blur' },
          { min: 3, max: 10, message: '長さは3−10文字になります', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'パスワードを入力してください', trigger: 'blur' },
          { min: 6, max: 15, message: '長さは3−10文字になります', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '携帯を入力してください', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUseRules: {
        username: [
          { required: true, message: 'ユーザー名を入力してください', trigger: 'blur' },
          { min: 3, max: 10, message: '長さは3−10文字になります', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '携帯を入力してください', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    getUserList () {
      this.$http.get('users', { params: this.queryInfo })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message_error('ユーザーのデータを読み込むが失敗しました')
          } else {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          return this.$message_error('ユーザーのデータを読み込むが失敗しました')
        })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    userStatusChanged (userInfo) {
      this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state
            return this.$message_error('更新失敗')
          } else {
            this.$message_success('更新成功')
          }
        })
        .catch(err => {
          return this.$message_error('更新失敗')
        })
    },

    // dialogを閉じる際に値をリセットする
    addDialogClosed () {
      this.$refs.addUserForm.resetFields()
    },

    editDialogClosed () {
      this.$refs.editUserForm.resetFields()
    },

    // adduser
    addUser () {
      this.$refs.addUserForm.validate(valid => {
        if (!valid) {
          return this.$message_error('新規失敗')
        } else {
          this.$http.post('/users', this.addUserForm)
            .then(res => {
              this.$message_success('新規成功')
              this.dialogVisible = false
            })
            .catch(err => {
              return this.$message_error('新規失敗')
            })
        }
      })
    },

    // showEditDialog
    showEditDialog (userInfo) {
      this.$http.get(`users/${userInfo.id}`)
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message_error('該当ユーザーがいません')
          } else {
            this.editUserForm = res.data.data
            this.showEditDialogVisible = true
          }
        })
        .catch(err => {
          return this.$message_error('該当ユーザーがいません')
        })
    },

    // edituser
    editUser () {
      this.$refs.editUserForm.validate(valid => {
        if (!valid) {
          return this.$message_error('編集失敗')
        } else {
          this.$http.put(`users/${this.editUserForm.id}`, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
            .then(res => {
              this.$message_success('編集成功')
              this.getUserList()
              this.showEditDialogVisible = false
            })
            .catch(err => {
              return this.$message_error('編集失敗')
            })
        }
      })
    },

    // データを削除操作
    removeUserById (id) {
      this.$confirm('この操作はデータを削除します, 続いてですか?', '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`)
          .then(res => {
            this.$message_success('成功しました')
            this.getUserList()
          })
          .catch(err => {
            return this.$message_error('失敗しました')
          })
      }).catch(() => {
        this.$message_error('キャンセルしました')
      })
    }
  }
}
</script>

<style lang="less" scoped>
span .el-button {
  width: 80px;
}
</style>
