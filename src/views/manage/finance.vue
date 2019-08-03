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

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="联系地址" prop="linkaddress" />
      <el-table-column align="center" label="应付总价" prop="totalprice" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.status == 1 ? '未支付' : '' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleInfo(scope.row)">查看</el-button>
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
    <el-dialog title="结算详情" :visible.sync="dialogFormVisibleInfo" append-to-body>
      <el-table
        v-loading="listLoading"
        :data="info_list"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="服务项目" prop="title" />
        <el-table-column align="center" label="单价" prop="price" />
        <el-table-column align="center" label="数量" prop="number" />
        <el-table-column align="center" label="合计" prop="totalprice" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <span style="color:red;font-size:14px;margin-right:10px;">应付总价：<b>{{ totalprice }}</b> 元</span>
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
        <el-button type="primary" @click="handlePay">付款</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { financeList, financeInfo, financePay } from '@/api/manage'
import Pagination from '@/components/Pagination'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      info_list: null,
      totalprice: 0,
      name: '',
      oid: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisibleInfo: false,
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
      financeList(this.listQuery)
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
    handleInfo(row) {
      const data = { id: row.id }
      this.totalprice = row.totalprice
      this.name = row.name
      financeInfo(data)
        .then(res => {
          var server = res.data.data
          var temparr_o = []
          var temparr_b = []
          if (server.length > 0) {
            this.oid = server[0].oid
          }
          server.forEach(ele => {
            if (ele.state == 2) {
              var temp = ele.list
              temp.forEach((v, k) => {
                temparr_b.push(v.services)
              })
              temparr_b = [].concat.apply([], temparr_b)
            } else {
              temparr_o.push(ele)
            }
            this.info_list = [...temparr_o, ...temparr_b]
          })
          this.dialogFormVisibleInfo = true
        })
    },
    handlePay(row) {
      this.$confirm('是否付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          name: this.name,
          oid: this.oid,
          totalprice: this.totalprice,
          operator: this.info.realname
        }
        financePay(data)
          .then(res => {
            if (res.code == 0) {
              this.getList()
              this.dialogFormVisibleInfo = false
              this.$notify.success({
                title: '成功',
                message: '付款成功'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>
