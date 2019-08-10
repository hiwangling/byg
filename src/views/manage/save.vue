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
      <el-table-column align="center" label="寄存编号" prop="serial" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="开始时间" prop="startime" />
      <el-table-column align="center" label="结束时间" prop="endtime" />
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="联系地址" prop="linkaddress" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | or_status">{{ scope.row.status == 0 ? '禁用' : '可用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="300">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="success"
            size="mini"
            @click="handleRenew(scope.row)"
          >续存</el-button>
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="danger"
            size="mini"
            @click="handleTake(scope.row)"
          >取走</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleInfo(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="续存信息" :visible.sync="dialogFormVisibleRenew">
      <el-form
        ref="dataForm"
        :inline="true"
        :model="renew"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="renew.endtime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="价格" prop="totalprice">
          <el-input v-model="renew.totalprice" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRenew = false">取消</el-button>
        <el-button type="primary" @click="RenewData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="信息" :visible.sync="dialogFormVisibleTake">
      <el-form
        ref="dataForm"
        :inline="true"
        :model="take"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="取出时间" prop="taketime">
          <el-date-picker
            v-model="take.taketime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="取出人" prop="takename">
          <el-input v-model="take.takename" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleTake = false">取消</el-button>
        <el-button type="primary" @click="TakeData">确定</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
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
        <el-form-item label="寄存编号" prop="serial">
          <el-input v-model="dataForm.serial" />
        </el-form-item>
        <el-form-item label="逝者姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startime">
          <el-date-picker
            v-model="dataForm.startime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="dataForm.endtime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="dataForm.linkman" />
        </el-form-item>
        <el-form-item label="身份证" prop="card">
          <el-input v-model="dataForm.card" />
        </el-form-item>
        <el-form-item label="联系电话" prop="linkphone">
          <el-input v-model="dataForm.linkphone" />
        </el-form-item>
        <el-form-item label="联系地址" prop="linkaddress">
          <el-input v-model="dataForm.linkaddress" />
        </el-form-item>
        <el-form-item label="寄存价格" prop="totalprice">
          <el-input v-model="dataForm.totalprice" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogFormVisibleInfo">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ information.name }}</p>
              <p><span> 联系人 : </span>{{ information.linkman }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ information.sex }}</p>
              <p><span> 联系电话 : </span>{{ information.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ information.age }}</p>
              <p><span> 承办人 : </span>{{ information.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">寄存记录</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in information.finance_list" :key="index">
            <el-col :span="8">
              <div class="grid-content">
                <p> {{ item.state_name }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 缴费时间 : </span>{{ item.record_create_time != '' ? item.record_create_time : '无' }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 合计 : </span>{{ item.totalprice }}</p>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checklist, checkadd, checkedit, checkrenew, checktake, checkinfo } from '@/api/manage'
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
      information: {
        name: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        sex: '',
        age: ''
      },
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
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        linkman: '',
        card: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: ''
      },
      renew: {
        endtime: null,
        totalprice: '',
        oid: '',
        name: '',
        id: '',
        operator: ''
      },
      take: {
        id: '',
        taketime: null,
        takename: '',
        operator: ''
      },
      dialogFormVisibleInfo: false,
      dialogFormVisibleRenew: false,
      dialogFormVisibleTake: false,
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
      checklist(this.listQuery)
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
        serial: '',
        name: '张',
        startime: null,
        endtime: null,
        signature: '',
        linkman: '',
        card: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: ''
      }
    },
    handleInfo(row) {
      const data = { id: row.id }
      checkinfo(data)
        .then(res => {
          this.dialogFormVisibleInfo = true
          this.information = res.data
          console.log(this.information)
          // console.log(res)
        })
        .catch((res) => {
          this.$notify.error({
            title: '获取失败',
            message: res.msg
          })
        })
    },
    handleRenew(row) {
      this.renew = Object.assign({}, row)
      this.renew.endtime = null
      this.renew.totalprice = ''
      this.dialogFormVisibleRenew = true
    },
    handleTake(row) {
      this.take = Object.assign({}, row)
      this.dialogFormVisibleTake = true
    },
    TakeData() {
      const data = {
        taketime: this.take.taketime,
        takename: this.take.takename,
        id: this.take.id,
        operator: this.info.realname
      }
      checktake(data)
        .then(res => {
          this.getList()
          this.dialogFormVisibleTake = false
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          })
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
    },
    RenewData() {
      const data = {
        endtime: this.renew.endtime,
        totalprice: this.renew.totalprice,
        name: this.renew.name,
        oid: this.renew.oid,
        id: this.renew.id,
        operator: this.info.realname
      }
      checkrenew(data)
        .then(res => {
          this.getList()
          this.dialogFormVisibleRenew = false
          this.$notify.success({
            title: '成功',
            message: '续费成功'
          })
        })
        .catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
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
      this.dataForm.operator = this.info.realname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          checkadd(this.dataForm)
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
          checkedit(this.dataForm)
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
    }
    // handleDelete(row) {
    //   deletecar(row)
    //     .then(res => {
    //       this.$notify.success({
    //         title: '成功',
    //         message: '删除成功'
    //       })
    //       const index = this.list.indexOf(row)
    //       this.list.splice(index, 1)
    //     })
    //     .catch(res => {
    //       this.$notify.error({
    //         title: '失败',
    //         message: res.msg
    //       })
    //     })
    // }
  }
}
</script>
