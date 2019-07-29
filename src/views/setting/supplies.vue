<template>
  <div>
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
      <el-table-column align="center" label="数量" prop="supplies_number" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | or_status">{{ scope.row.status == 0 ? '禁用' : '可用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
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
          <el-button
            v-permission="['GET /api/v1/cemetery_classify/g_del']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
        <el-table-column align="center" label="价格" prop="price" />
        <el-table-column align="center" label="数量" prop="number" />
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
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="dataForm.title" :disabled="true" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="dataForm.price" />
        </el-form-item>
        <el-form-item label="商品数量" prop="number">
          <el-input v-model="dataForm.number" />
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
  listsupplies,
  createsupplies,
  storage,
  updatesupplies,
  deletesupplies
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
        number: '',
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
        type_name: [
          { required: true, message: '墓园名称不能为空', trigger: 'blur' }
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
      listsupplies(this.listQuery)
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
        price: '',
        number: '',
        type: '',
        title: ''
      }
    },
    handleCreate(row) {
      this.resetForm()
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const data = {
        uid: this.info.id,
        sid: this.dataForm.id,
        price: this.dataForm.price,
        number: this.dataForm.number,
        title: this.dataForm.title,
        type: 1
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createsupplies(data)
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
    handleSupplies(row, type) {
      this.dialogFormVisibleList = true
      const data = { sid: type == 0 ? row.id : row.sid }
      storage(data)
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
        uid: this.info.id,
        id: row.id,
        sid: row.sid,
        price: row.price,
        number: row.number,
        type: 1,
        title: row.title
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      updatesupplies(this.dataForm)
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
      deletesupplies(row)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    }
  }
}
</script>
