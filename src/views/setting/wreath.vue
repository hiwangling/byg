<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search_data"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入关键字"
      />
      <el-button
        v-permission="['GET /api/v1/cemetery_classify/g_list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="商品" prop="title" />
      <el-table-column align="center" label="数量" prop="wreath_number" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | or_status">{{ scope.row.status == 0 ? '禁用' : '可用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="160">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="handleCreate(scope.row)"
          >添加</el-button>
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="warning"
            size="mini"
            @click="handleSupplies(scope.row,0)"
          >查看</el-button>
          <!-- <el-button
            v-permission="['GET /api/v1/cemetery_classify/g_del']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="入库记录" :visible.sync="dialogFormVisibleList">
      <el-table :data="supplies_list" border fit highlight-current-row>
        <el-table-column align="center" label="商品" prop="title" />
        <el-table-column align="center" label="价格" prop="price" width="80" />
        <el-table-column align="center" label="数量" prop="number" width="80" />
        <el-table-column align="center" label="总价" prop="totalprice" width="80" />
        <el-table-column align="center" label="时间" prop="create_time" />
        <el-table-column align="center" label="操作" class-name="small-padding" width="100">
          <template slot-scope="scope">
            <el-button
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="supplies_total>0"
        :total="supplies_total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="handleSupplies"
      />
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :inline="true"
        :model="dataForm"
        status-icon
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="dataForm.title" :disabled="true" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="dataForm.price" @blur="sumPrice" />
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input v-model="dataForm.number" @blur="sumPrice" />
        </el-form-item>
        <el-form-item label="商品总价" prop="totalprice">
          <el-input v-model="totalprice" />
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
import {
  listwreath,
  createwreath,
  wreathstorage,
  updatewreath,
  deletewreath
} from '@/api/setting'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      totalprice: '',
      supplies_total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        uid: '',
        sid: '',
        price: '',
        number: 1,
        totalprice: '',
        type: '',
        title: ''
      },
      supplies_list: null,
      dialogFormVisibleList: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        number: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listwreath(this.listQuery)
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
        uid: '',
        sid: '',
        price: 0,
        number: '',
        totalprice: '',
        type: '',
        title: ''
      }
    },
    handleCreate(row) {
      this.resetForm()
      this.dataForm = Object.assign({}, row)
      this.totalprice = 0
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const data = {
        operator: this.info.realname,
        sid: this.dataForm.id,
        price: this.dataForm.price,
        number: this.dataForm.number,
        title: this.dataForm.title,
        totalprice: this.totalprice,
        type: 1
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createwreath(data)
            .then(res => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
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
    sumPrice() {
      var sum = 0
      sum = parseInt(this.dataForm.price ? this.dataForm.price : 0) * parseInt(this.dataForm.number ? this.dataForm.number : 0)
      this.totalprice = sum
    },
    handleSupplies(row, type) {
      this.dialogFormVisibleList = true
      const data = { sid: type == 0 ? row.id : row.sid }
      wreathstorage(data)
        .then(res => {
          this.supplies_list = res.data.data
          this.supplies_total = res.data.total || 0
        })
        .catch(() => {
          this.supplies_list = []
          this.supplies_total = 0
        })
    },
    handleUpdate(row) {
      this.dataForm = {
        id: row.id,
        sid: row.sid,
        price: row.price,
        number: row.number,
        operator: this.info.realname,
        type: 1,
        title: row.title
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.dataForm.totalprice = this.totalprice
      updatewreath(this.dataForm)
        .then(() => {
          this.dialogFormVisible = false
          this.$notify.success({
            title: '成功',
            message: '更新成功'
          })
          this.getList()
          this.handleSupplies(this.dataForm, 1)
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    },
    handleDelete(row) {
      this.$confirm('您确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletewreath(row)
          .then(res => {
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
