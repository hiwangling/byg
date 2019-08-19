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
      <el-table-column align="center" label="牌号" prop="number" width="50" />
      <el-table-column align="center" label="逝者姓名" prop="o_name">
        <template slot-scope="scope">
          {{ scope.row.o_name }} ({{ scope.row.o_sex }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="o_linkman" />
      <el-table-column align="center" label="联系电话" prop="o_linkphone" />
      <el-table-column align="center" label="死亡原因" prop="o_reason" />
      <el-table-column align="center" label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | carFilter"> {{ scope.row.state = scope.row.state==null ? 1 : scope.row.state | cremationstate_stype }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.c_ifsignature == 0 || scope.row.c_ifsignature ==null">
            <el-button
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >办理</el-button>
            <el-button
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="handleSign(scope.row)"
            >详情</el-button>
          </template>
          <template v-else>
            <el-button
              v-if="scope.row.c_state == 2"
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="warning"
              size="mini"
              @click="handleOver(scope.row)"
            >结束火化</el-button>
            <el-button
              v-if="scope.row.c_state == 1"
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="danger"
              size="mini"
              @click="handleFire(scope.row)"
            >开始火化</el-button>
            <template v-if="scope.row.c_state == 3">
              <el-button
                v-permission="['POST /api/v1/cemetery_classify/g_edit']"
                type="info"
                size="mini"
                @click="handleQu(scope.row)"
              >取灰</el-button>
              <el-button
                v-permission="['POST /api/v1/cemetery_classify/g_edit']"
                type="primary"
                size="mini"
                @click="handleSave(scope.row)"
              >寄存</el-button>
            </template>
            <el-button
              v-if="scope.row.c_state == 4 || scope.row.c_state == 5"
              v-permission="['POST /api/v1/cemetery_classify/g_edit']"
              type="danger"
              plain
              size="mini"
            >已完结</el-button>
          </template>
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
    <el-dialog title="取灰信息" :visible.sync="dialogFormVisibleGo">
      <el-form
        ref="send"
        :inline="true"
        :model="send"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="逝者姓名" prop="name">
          <el-input v-model="send.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="send.sex" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="send.age" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="send.address" />
        </el-form-item>
        <el-form-item label="出车时间" prop="outtime">
          <el-date-picker
            v-model="send.outtime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="send.linkman" />
        </el-form-item>
        <el-form-item label="联系电话" prop="linkphone">
          <el-input v-model="send.linkphone" />
        </el-form-item>
        <el-form-item label="司机" prop="driver">
          <el-input v-model="send.driver" />
        </el-form-item>
        <el-form-item label="接运类型" prop="recetype">
          <el-select v-model="send.recetype" placeholder="" clearable class="filter-item" style="width:185px">
            <el-option v-for="(item,value,index) in recetype" :key="index" :label="item" :value="Number(value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="接运价格" prop="totalprice">
          <el-input v-model="send.totalprice" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="send.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="createsSendData">自取</el-button>
        <el-button type="primary" @click="createGoData">确定</el-button>
        <el-button @click="dialogFormVisibleGo = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加寄存" :visible.sync="dialogFormVisibleSave">
      <el-form
        ref="save"
        :inline="true"
        :model="save"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="寄存编号" prop="serial">
          <el-input v-model="save.serial" />
        </el-form-item>
        <el-form-item label="逝者姓名" prop="name">
          <el-input v-model="save.name" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startime">
          <el-date-picker
            v-model="save.startime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            v-model="save.endtime"
            style="width:185px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="save.linkman" />
        </el-form-item>
        <el-form-item label="联系电话" prop="linkphone">
          <el-input v-model="save.linkphone" />
        </el-form-item>
        <el-form-item label="联系地址" prop="linkaddress">
          <el-input v-model="save.linkaddress" />
        </el-form-item>
        <el-form-item label="寄存价格" prop="totalprice">
          <el-input v-model="save.totalprice" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSaveData">确定</el-button>
        <el-button @click="dialogFormVisibleSave = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="info">
          <el-form
            ref="dataForm"
            :rules="rules"
            :inline="true"
            :model="dataForm"
            status-icon
            label-position="left"
            label-width="100px"
          >
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
            <el-form-item label="民族" prop="nation">
              <el-input v-model="dataForm.nation" />
            </el-form-item>
            <el-form-item label="身份证" prop="card">
              <el-input v-model="dataForm.card" />
            </el-form-item>
            <el-form-item label="户口所在地" prop="registered">
              <el-input v-model="dataForm.registered" />
            </el-form-item>
            <el-form-item label="死亡时间" prop="dietime">
              <el-date-picker
                v-model="dataForm.dietime"
                style="width:185px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
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

            <el-form-item label="联系人电话" prop="linkphone">
              <el-input v-model="dataForm.linkphone" />
            </el-form-item>
            <el-form-item label="逝者关系" prop="relation">
              <el-input v-model="dataForm.relation" />
            </el-form-item>
            <el-form-item label="承运人" prop="haulier">
              <el-input v-model="dataForm.haulier" />
            </el-form-item>
            <el-form-item label="牌号" prop="number">
              <el-input v-model="dataForm.number" />
            </el-form-item>
            <el-form-item label="操作员" prop="operator">
              <el-input v-model="dataForm.operator" />
            </el-form-item>
            <el-form-item label="备注" prop="c_remark">
              <el-input v-model="dataForm.c_remark" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="选择服务" name="second">
          <service ref="server" @service_data="service_data" />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogFormVisibleInfo">
      <h3 style="text-align: center;font-size:22px;font-weight: 100; margin: 0 0 15px 0">当阳市殡仪馆火化及申请书</h3>
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ dataForm.o_name }}</p>
              <p><span> 逝者民族 : </span>{{ dataForm.o_nation }}</p>
              <p><span> 户口所在地 : </span>{{ dataForm.o_registered }}</p>
              <p><span> 联系人性别 : </span>{{ dataForm.o_linksex }}</p>
              <p><span> 承运人 : </span>{{ dataForm.haulier }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ dataForm.o_sex }}</p>
              <p><span> 死亡原因 : </span>{{ dataForm.o_reason }}</p>
              <p><span> 死亡时间 : </span>{{ dataForm.o_dietime }}</p>
              <p><span> 联系人电话 : </span>{{ dataForm.o_linkphone }}</p>
              <p><span> 备注 : </span>{{ dataForm.remark }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ dataForm.o_age }}</p>
              <p><span> 身份证 : </span>{{ dataForm.o_card }}</p>
              <p><span> 联系人 : </span>{{ dataForm.o_linkman }}</p>
              <p><span> 与逝者关系 : </span>{{ dataForm.o_relation }}</p>
              <p><span> 操作员 : </span>{{ dataForm.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="server ? server.length > 0 : false" class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">火化服务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in server" :key="index">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 服务名称 : </span>{{ item.title }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 数量 : </span>{{ item.number }}</p>
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
        <span class="sign_">家属签字：<img v-if="record_sign" :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button v-if="record_ifsign == 0" type="primary" @click="sign_open">签字</el-button>
        <el-button v-if="record_ifsign == 0" type="primary" @click="SignSend">确定</el-button>
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="签名" :visible.sync="dialogFormVisibleSign" @close="sign_close">
      <e560 ref="child" @cancel="cancel" @imgData="imgData" />
    </el-dialog>
    <el-dialog title="查看签名" :visible.sync="dialogFormSign">
      <img :src="record_sign" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSign = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  commonCremation,
  infoCremation,
  addfire,
  listfire,
  editfire,
  signfire,
  statefire,
  checkfire,
  sendfire,
  createcarcommon
} from '@/api/manage'
import Pagination from '@/components/Pagination'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
import e560 from '@/components/E560'
export default {
  name: 'VueGarden',
  components: { Pagination, service, e560 },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      recetype: null,
      // signature: '',
      // ifsignature: '',
      signatureid: '',
      record_sign: '',
      record_ifsign: '',
      activeName: 'info',
      dialogFormVisibleGo: false,
      dialogFormVisibleInfo: false,
      dialogFormVisibleSave: false,
      dialogFormVisibleSign: false,
      dialogFormSign: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      sex: ['男', '女'],
      send: {
        name: '',
        sex: '',
        age: '',
        address: '',
        recetype: '',
        outtime: null,
        linkman: '',
        totalprice: '',
        linkphone: '',
        driver: '',
        cid: '',
        c_id: '',
        operator: '',
        remark: '',
        oid: ''
      },
      go: {
        id: '',
        c_id: '',
        state: ''
      },
      save: {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: '',
        c_id: '',
        oid: ''
      },
      dataForm: {
        name: '',
        sex: '',
        age: '',
        card: '',
        registered: '',
        reason: '',
        linkman: '',
        number: '',
        relation: '',
        dietime: null,
        linksex: '',
        nation: '',
        haulier: '',
        linkphone: '',
        operator: '',
        server: null,
        c_remark: '',
        oid: '',
        id: ''
      },
      server: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '办理火化',
        create: '创建'
      },
      rules: {

      }
    }
  },
  computed: {},
  watch: {

  },
  created() {
    this.getList()
    createcarcommon().then(res => {
      this.recetype = res.data.recetype
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      listfire(this.listQuery)
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
    getCommon(v) {
      commonCremation().then(res => {
        this.server = res.data.services
        const data = {
          type: v,
          server: this.server
        }
        this.$refs.server.showService(data)
      })
    },

    sign_open() {
      this.record_sign = ''
      this.dialogFormVisibleSign = true
      this.$nextTick(() => {
        this.$refs.child.initDevice()
      })
    },
    sign_close() {
      this.$refs.child.uninitDevice()
    },
    cancel() {
      this.dialogFormVisibleSign = false
    },
    imgData(v) {
      this.record_sign = v
    },

    handleSign(row) {
      this.dataForm = Object.assign({}, row)
      const data = { id: row.id, oid: row.oid, type: 2 }
      infoCremation(data).then(res => {
        var server = []
        if (res.data.services.length > 0) {
          server = res.data.services[0].services
        }
        this.server = server
        this.dialogFormVisibleInfo = true
        this.signatureid = row.id
        this.record_sign = row.signature
        this.record_ifsign = row.ifsignature
      })
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
        name: '',
        sex: '',
        age: '',
        card: '',
        registered: '',
        reason: '',
        linkman: '',
        relation: '',
        linkphone: '',
        dietime: null,
        nation: '',
        number: '',
        linksex: '',
        operator: '',
        c_remark: '',
        haulier: '',
        server: null
      }
    },
    createGoData() {
      sendfire(this.send).then(res => {
        if (res.code == 0) {
          this.getList()
          this.dialogFormVisibleGo = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
      })
    },
    createsSendData() {
      const data = {
        id: this.go.id,
        c_id: this.go.c_id,
        state: this.go.state
      }
      statefire(data).then(res => {
        if (res.code == 0) {
          this.getList()
          this.dialogFormVisibleGo = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
      })
    },
    handleQu(row) {
      this.dialogFormVisibleGo = true
      this.go = {
        id: row.id,
        c_id: row.c_id,
        state: row.c_state
      }
      this.send = {
        name: row.name,
        sex: row.sex,
        age: row.age,
        address: row.address,
        linkman: row.linkman,
        totalprice: row.totalprice,
        recetype: 2,
        linkphone: row.linkphone,
        driver: '',
        c_id: row.c_id,
        cid: row.cid,
        oid: 1,
        operator: this.info.realname,
        remark: ''
      }
      // this.$confirm('是否取灰?', '提示', {
      //   confirmButtonText: '取灰',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const data = {
      //     id: row.id,
      //     c_id: row.c_id,
      //     state: row.c_state
      //   }
      //   statefire(data).then(res => {
      //     if (res.code == 0) {
      //       this.getList()
      //       this.$message({
      //         type: 'success',
      //         message: '操作成功!'
      //       })
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '操作取消'
      //   })
      // })
    },
    handleSave(row) {
      this.save = Object.assign({}, row)
      this.save.serial = ''
      this.dialogFormVisibleSave = true
    },
    createSaveData() {
      const data = {
        name: this.save.name,
        startime: this.save.startime,
        signature: '',
        serial: this.save.serial,
        endtime: this.save.endtime,
        linkman: this.save.linkman,
        linkphone: this.save.linkphone,
        linkaddress: this.save.linkaddress,
        operator: this.info.realname,
        totalprice: this.save.totalprice,
        c_id: this.save.c_id,
        oid: this.save.c_id
      }
      checkfire(data).then(res => {
        if (res.code == 0) {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialogFormVisibleSave = false
        }
      })
    },
    handleOver(row) {
      this.$confirm('火化是否完成?', '提示', {
        confirmButtonText: '完成',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          c_id: row.c_id,
          state: row.c_state
        }
        statefire(data).then(res => {
          if (res.code == 0) {
            this.getList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    handleFire(row) {
      this.$prompt('请输入火化牌号', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '请输入数字'
      }).then(({ value }) => {
        const data = {
          id: row.id,
          c_id: row.c_id,
          state: row.c_state,
          number: value
        }
        statefire(data).then(res => {
          if (res.code == 0) {
            this.getList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    handleCreate() {
      this.resetForm()
      this.getCommon(0)
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addfire(this.dataForm)
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
    SignSend() {
      const data = { signature: this.record_sign, id: this.signatureid }
      signfire(data).then(res => {
        if (res.code == 0) {
          this.$notify.success({
            title: '成功',
            message: '操作成功'
          })
          this.getList()
          this.dialogFormVisibleInfo = false
        } else {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dataForm = {
        name: row.o_name || '',
        sex: row.o_sex || '',
        age: row.o_age || '',
        card: row.o_card || '',
        registered: row.o_registered || '',
        reason: row.o_reason || '',
        dietime: row.o_dietime || '',
        linkman: row.o_linkman || '',
        relation: row.o_relation || '',
        linkphone: row.o_linkphone || '',
        nation: row.o_nation || '',
        number: row.number || '',
        linksex: row.o_linksex || '',
        operator: row.operator || '',
        c_remark: row.remark || '',
        haulier: row.haulier || '',
        id: row.id || '',
        oid: row.oid || '',
        server: null
      }
      this.getCommon(1)
      const data = { id: row.id, oid: row.oid, type: 1 }
      infoCremation(data).then(res => {
        this.$refs.server.editService(res.data.services)
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.dataForm.operator = this.info.realname
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          editfire(this.dataForm)
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
    }
    // handleDelete(row) {
    //   delobituary(row)
    //     .then(res => {
    //       this.$confirm('您确认删除吗?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         const index = this.list.indexOf(row)
    //         this.list.splice(index, 1)
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         })
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消删除'
    //         })
    //       })
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

