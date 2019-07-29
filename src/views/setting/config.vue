<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
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
      <el-button
        v-permission="['POST /api/v1/cemetery_classify/g_add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" label="分组" prop="group">
        <template slot-scope="scope">
          {{ scope.row.group | group_list }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" prop="type">
        <template slot-scope="scope">
          {{ scope.row.type | type_list }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | or_status">{{ scope.row.status == 0 ? '禁用' : '可用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="150">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="用于config函数调用" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" placeholder="用于后台显示的配置标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="根据类型解析配置值" clearable class="filter-item" style="width:185px">
            <el-option v-for="(item,value,index) in config_type_list" :key="index" :label="item" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-select v-model="dataForm.group" placeholder="配置分组" clearable class="filter-item" style="width:185px">
            <el-option v-for="(item,value,index) in config_group_list" :key="index" :label="item" :value="value + 1" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置值" prop="value">
          <el-input
            v-model="dataForm.value"
            style="width:185px"
            type="textarea"
            :rows="2"
            placeholder="配置取值"
          />
        </el-form-item>
        <el-form-item label="配置项" prop="extra">
          <el-input
            v-model="dataForm.extra"
            style="width:185px"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item label="描述" prop="describe">
          <el-input
            v-model="dataForm.describe"
            style="width:185px"
            type="textarea"
            :rows="2"
            placeholder="用于分组显示的顺序，默认为 0"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" />
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
import { listconfig, createconfig, updateconfig, deleteconfig } from '@/api/setting'
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        name: '',
        title: '',
        type: '',
        group: '',
        extra: '',
        value: '',
        describe: '',
        sort: 0
      },
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

    // getconfig()
    //   .then(res => {
    //     // this.config_type_list = res.data.config_type_list
    //     this.config_group_list = res.data.config_group_list
    //   })
  },
  methods: {
    getList() {
      this.listLoading = true
      listconfig(this.listQuery)
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
        name: '',
        title: '',
        type: '',
        group: '',
        extra: '',
        value: '',
        describe: '',
        sort: 0
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
          createconfig(this.dataForm)
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
          updateconfig(this.dataForm)
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
                message: '更新成功'
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
    handleDelete(row) {
      deleteconfig(row)
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
