<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入管理员名称" />
      <el-button v-permission="['POST /api/v1/manager/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /api/v1/manager/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="管理员账号" prop="username" />
      <el-table-column align="center" label="姓名" prop="realname" />
      <el-table-column align="center" label="性别" prop="sex" />
      <el-table-column align="center" label="电话" prop="mobile" />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="150"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status == 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门权限" prop="branch">
        <template slot-scope="scope">
          <el-tag type="primary" style="margin-right: 20px;"> {{ formatRole(scope.row) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /api/v1/manager/edit']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :inline="true" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="管理员账号" prop="username">
          <el-input v-model="dataForm.username" />
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="dataForm.realname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" />
        </el-form-item>
        <el-form-item label="员工性别" prop="sex">
          <el-select v-model="dataForm.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门权限" prop="branch">
          <el-select v-model="dataForm.branch" clearable placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.branch_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { listAdmin, createAdmin, updateAdmin } from '@/api/member'
import { roleOptions } from '@/api/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'VueManager',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      roleOptions: null,
      listGrade: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        realname: undefined,
        grade_name: undefined,
        branch: null,
        mobile: undefined,
        sex: null,
        status: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [{ required: true, message: '管理员名称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        branch: [{ required: true, message: '部门不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    roleOptions()
      .then(res => {
        this.roleOptions = res.data
      })
  },
  methods: {
    formatRole(roleId) {
      if (this.roleOptions) {
        for (let i = 0; i < this.roleOptions.length; i++) {
          if (roleId.branch === this.roleOptions[i].id) {
            return this.roleOptions[i].branch_name
          }
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      listAdmin(this.listQuery)
        .then(res => {
          this.list = res.data.data
          this.total = res.data.total || 0
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        username: undefined,
        password: undefined,
        realname: undefined,
        grade_name: undefined,
        branch: null,
        mobile: undefined,
        sex: '男',
        status: 1
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAdmin(this.dataForm)
            .then(res => {
              // console.log(res.data)
              // this.list.unshift(res.data)
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加管理员成功'
              })
            })
            .catch(res => {
              this.$notify.error({
                title: '失败',
                message: res.msg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateAdmin(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新管理员成功'
              })
            })
            .catch(res => {
              console.log(res)
              this.$notify.error({
                title: '失败',
                message: res
              })
            })
        }
      })
    }
  }
}
</script>
