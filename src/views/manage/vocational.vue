<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
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
      <el-table-column align="center" label="业务编号" prop="serial" width="150" />
      <el-table-column align="center" label="逝者姓名" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }} ({{ scope.row.sex }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="操作人" prop="operator" />
      <el-table-column align="center" label="状态" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state | obituary_list }}</el-tag>
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
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="info">
            <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="逝者性别" prop="sex">
              <el-select
                v-model="dataForm.sex"
                placeholder="选择性别"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in sex" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="逝者年龄" prop="age">
              <el-input v-model="dataForm.age" />
            </el-form-item>
            <el-form-item label="身份证" prop="card">
              <el-input v-model="dataForm.card" />
            </el-form-item>
            <el-form-item label="户口所在地" prop="registered">
              <el-input v-model="dataForm.registered" />
            </el-form-item>
            <el-form-item label="死亡原因" prop="reason">
              <el-input v-model="dataForm.reason" />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="dataForm.linkman" />
            </el-form-item>
            <el-form-item label="联系人性别" prop="linksex">
              <el-select
                v-model="dataForm.linksex"
                placeholder="选择性别"
                clearable
                class="filter-item"
                style="width:185px"
              >
                <el-option v-for="(item,index) in sex" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人民族" prop="nation">
              <el-input v-model="dataForm.nation" />
            </el-form-item>
            <el-form-item label="联系人电话" prop="linkphone">
              <el-input v-model="dataForm.linkphone" />
            </el-form-item>
            <el-form-item label="逝者关系" prop="relation">
              <el-input v-model="dataForm.relation" />
            </el-form-item>
            <el-form-item label="告别时间" prop="farewelltime">
              <el-date-picker
                v-model="dataForm.farewelltime"
                type="datetime"
                style="width:185px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择告别时间"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="灵堂服务" name="second">
            <el-form-item label="开始时间" prop="mourn_data_startime">
              <el-date-picker
                v-model="mourn_data.startime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="mourn_data_endtime">
              <el-date-picker
                v-model="mourn_data.endtime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="选择灵堂" prop="mourn_data_title">
              <el-input v-model="mourn_data.list.title" placeholder="请选择灵堂" clearable style="width:200px" @focus="Show(1)" />
            </el-form-item>
            <el-form-item label="合计">
              <el-input v-model="mourn_data.totalprice" placeholder="合计" style="width:200px" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="mourn_data.remark" style="width:200px" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="冷柜服务" name="third">
            <el-form-item label="开始时间" prop="cold_data_startime">
              <el-date-picker
                v-model="cold_data.startime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="outtime">
              <el-date-picker
                v-model="cold_data.endtime"
                type="datetime"
                style="width:200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              />
            </el-form-item>
            <el-form-item label="选择冷柜" prop="cold_data_title">
              <el-input v-model="cold_data.list.title" clearable placeholder="请选择冷柜" style="width:200px" @focus="Show(2)" />
            </el-form-item>
            <el-form-item label="合计">
              <el-input v-model="cold_data.totalprice" placeholder="合计" style="width:200px" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="cold_data.remark" style="width:200px" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="选择服务" name="thr">
            <service ref="server" @service_data="service_data" />
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" plain @click="handleShow(0)">添加服务</el-button>
        <el-button v-else type="primary" plain @click="handleShow(1)">修改服务</el-button> -->
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <box ref="box" @box_data="box_data" />

  </div>
</template>
<script>
import {
  getobituary,
  listobituary,
  addobituary,
  infoobituary,
  editobituary,
  delobituary
} from '@/api/manage'
import Pagination from '@/components/Pagination'
import box from '@/components/Box'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, box, service },
  mixins: [vuexData],
  data() {
    var validateDate = (rule, value, callback) => {
      if (this.mourn_data.list.title != undefined && this.mourn_data.startime == null) {
        if (this.mourn_data.startime == null) {
          callback(new Error('请选择灵堂开始时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateDate1 = (rule, value, callback) => {
      if (this.cold_data.list.title != undefined && this.cold_data.startime == null) {
        if (this.cold_data.startime == null) {
          callback(new Error('请选择冷柜开始时间'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      list: null,
      flag: true,
      EditServer: null,
      mourn: null,
      cold: null,
      server: null,
      mourn_data: {
        startime: null,
        endtime: null,
        remark: '',
        totalprice: '',
        list: {
          title: ''
        }
      },
      cold_data: {
        startime: null,
        endtime: null,
        totalprice: '',
        remark: '',
        list: {
          title: ''
        }
      },
      activeName: 'info',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      sex: ['男', '女'],
      dataForm: {
        name: '',
        sex: '',
        age: '',
        card: '',
        farewelltime: null,
        registered: '',
        reason: '',
        linkman: '',
        relation: '',
        linksex: '',
        nation: '',
        linkphone: '',
        operator: '',
        mourn: {
        },
        cold: {
        },
        server: null,
        type: 0

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        mourn_data_startime: [
          { type: 'date', validator: validateDate, trigger: 'change' }
        ],
        cold_data_startime: [
          { type: 'date', validator: validateDate1, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    'mourn_data.list.title': {
      deep: true,
      handler: function(newV, oldV) {
        if (newV == '') {
          this.mourn_data.list = ''
          this.mourn_data.totalprice = ''
        }
      }
    },
    'cold_data.list.title': {
      deep: true,
      handler: function(newV, oldV) {
        if (newV == '') {
          this.cold_data.list = ''
          this.cold_data.totalprice = ''
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listobituary(this.listQuery)
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
    getCommon() {
      getobituary().then(res => {
        this.mourn = res.data.mourn
        this.cold = res.data.cold
        this.server = res.data.services
        const data = {
          server: this.server
        }
        this.$refs.server.showService(data)
      })
    },
    box_data(val) {
      this.dataForm.type = val.type
      if (val.type == 1) {
        this.mourn_data.list = Object.assign({}, val.data)
        this.mourn_data.totalprice = val.data.price
      } else {
        this.cold_data.list = Object.assign({}, val.data)
        this.cold_data.totalprice = val.data.price
      }
    },
    Show(val) {
      const data = {
        list: val == 1 ? this.mourn : this.cold,
        type: val
      }
      this.$refs.box.show(data)
    },
    service_data(data) {
      this.dataForm.server = data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        name: '张三',
        sex: '男',
        age: '18',
        card: '4421154',
        registered: '湖北宜昌市',
        reason: '死亡原因',
        linkman: '李四',
        relation: '母女',
        linkphone: '1315412',
        nation: '',
        linksex: '',
        operator: '',
        farewelltime: null
      }
    },
    reset() {
      this.mourn_data = {
        startime: null,
        endtime: null,
        remark: '',
        totalprice: '',
        list: {
          title: ''
        }
      }
      this.cold_data = {
        startime: null,
        endtime: null,
        totalprice: '',
        remark: '',
        list: {
          title: ''
        }
      }
    },
    handleCreate() {
      this.resetForm()
      this.reset()
      this.getCommon()

      this.activeName = 'info'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        const data = {
          server: this.server
        }
        this.$refs.server.showService(data)
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.dataForm.operator = this.info.realname
      this.dataForm.mourn = this.mourn_data
      this.dataForm.cold = this.cold_data
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addobituary(this.dataForm)
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
    handleClick() {

    },
    handleUpdate(row) {
      this.activeName = 'info'
      this.dataForm = Object.assign({}, row)
      this.getCommon()
      const data = { id: row.id }
      infoobituary(data).then(res => {
        this.reset()
        if (res.data.mourn) {
          this.mourn_data = res.data.mourn
        }
        if (res.data.cold) {
          this.cold_data = res.data.cold
        }
        this.$refs.server.editService(res.data.services)
        // const server = {
        //   service: res.data.services,
        //   services_totalprice: res.data.services_totalprice
        // }
        // var editRow = []
        // server.service.forEach((v, k) => {
        //   editRow.push(v.services)
        // })
        // server.service = [].concat.apply([], editRow)
        // this.dataForm.server = server
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.operator = this.info.realname
      this.dataForm.mourn = this.mourn_data
      this.dataForm.cold = this.cold_data
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editobituary(this.dataForm)
            .then(() => {
              this.getList()
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
      delobituary(row)
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
