<template>
  <div class="container">
    <div style="margin:0 0 10px 0">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加寄存服务</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="姓名" prop="vcname" />
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" append-to-body>
      <el-form ref="dataForm" :rules="rules" status-icon :model="dataForm" label-position="left" label-width="80px" style="width: 600px; margin-left:50px;">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="dataForm.order_begin"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="dataForm.order_end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="费用">
          <el-input v-model="dataForm.price" />
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
export default {
  data() {
    return {
      list: null,
      listlink: null,
      linkman_id: null,
      listLoading: true,
      dialogStatus: '',
      dataForm: {
        cid: '',
        vcname: '',
        order_begin: '',
        order_end: '',
        price: ''
      },
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        linkman_id: [{ required: true, message: '联系人不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    cems() {
      return this.$store.state.cemetery.cems
    }
  },
  watch: {
    cems: {
      handler(val) {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    getList() {
    //   this.listLoading = false
    //   const data = { cid: this.cems.id }
    //   listdead(data)
    //     .then(response => {
    //       this.list = response.data
    //       this.listLoading = false
    //     })
    //     .catch(() => {
    //       this.list = []
    //       this.listLoading = false
    //     })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {

    },
    updateData() {

    },
    handleUpdate() {

    },
    handleDelete() {

    }
  }
}
</script>

