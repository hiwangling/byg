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
      <el-table-column align="center" label="逝者姓名" prop="name" width="120">
        <template slot-scope="scope">
          {{ scope.row.name }} ({{ scope.row.sex }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="linkman" width="120" />
      <el-table-column align="center" label="联系电话" prop="linkphone" width="120" />
      <el-table-column align="center" label="出车时间" prop="outtime" width="160" />
      <el-table-column align="center" label="预约地址" prop="address" />
      <el-table-column align="center" label="状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state | obituary_list }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="handleCarStatus(scope.row)"
          >  {{ scope.row.state | carState }}</el-button>
          <el-button
            v-permission="['GET /api/v1/cemetery_classify/g_del']"
            type="info"
            size="mini"
            @click="handleLook(scope.row)"
          >详情</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="900px">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ dataForm.name }}</p>
              <p><span> 死亡日期 : </span>2018-5-5</p>
              <p><span> 联系人 : </span>{{ dataForm.linkman }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ dataForm.sex }}</p>
              <p><span> 死亡原因 : </span>无</p>
              <p><span> 联系电话 : </span>{{ dataForm.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ dataForm.age }}</p>
              <p><span> 死亡原因 : </span></p>
              <p><span> 承办人 : </span>{{ dataForm.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">接运服务</h1>
        <el-row :gutter="20">
          <template v-for="(item,index) in server">
            <el-col :key="index" :span="8">
              <div class="grid-content">
                <p><span> 服务名称 : </span>{{ item.title }}</p>
              </div>
            </el-col>
            <el-col :key="index" :span="8">
              <div class="grid-content">
                <p><span> 服务数量 : </span>{{ item.number }}</p>
              </div>
            </el-col>
            <el-col :key="index" :span="8">
              <div class="grid-content">
                <p><span> 服务合计 : </span>{{ item.totalprice }}</p>
              </div>
            </el-col>
          </template>
          <!-- <el-col :span="6">
            <div class="grid-content">
              <p><span> 服务价格 : </span>张三</p>
              <p><span> 死亡原因 : </span>五</p>
              <p><span> 年龄 : </span>44</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <p><span> 服务数量 : </span>张三</p>
              <p><span> 死亡原因 : </span>五</p>
              <p><span> 年龄 : </span>44</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <p><span> 服务总价 : </span>张三</p>
              <p><span> 死亡原因 : </span>五</p>
              <p><span> 年龄 : </span>44</p>
            </div>
          </el-col> -->
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { editinfoService } from '@/api/manage'
import { listCartask, editCarstatus } from '@/api/task'
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
        id: '',
        type: '',
        state: ''
      },
      server: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '查看',
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
      listCartask(this.listQuery)
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
    carState(v) {
      const statusMap = { 1: '签收', 2: '出车', 3: '出车', 4: '回馆' }
      return statusMap[v]
    },
    handleCarStatus(row) {
      var state = this.carState(row.state)
      this.$confirm(
        `是否确认${state}?`,
        '操作',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'confirmTop'
        }
      )
        .then(() => {
          const data = {
            id: row.id,
            oid: row.oid,
            state: row.state
          }
          editCarstatus(data)
            .then(res => {
              this.getList()
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            })
            .catch(res => {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleLook(row) {
      this.dataForm = Object.assign({}, row)
      const data = { oid: row.oid, id: row.id, type: 2 }
      editinfoService(data).then(res => {
        this.server = res.data.services[0].services
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    }
  }
}
</script>
<style>
 .bury_car{
    border: 1px solid #EEEEEE
 }
 .bury_car_h1{
    height: 40px;
    line-height: 40px;
    background: #F5F5F5;
    font-size: 16px;
    font-weight: 100;
    margin: 0;
    padding-left: 10px;
  }
  .grid-content{
    padding-left: 10px;
  }
   .grid-content span{
     font-weight: 400;
     color: #000
   }
</style>

