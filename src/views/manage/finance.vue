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
      <el-table-column align="center" label="火化编号" prop="serial" />
      <el-table-column align="center" label="逝者姓名" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }} ({{ scope.row.sex }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="linkman" />
      <el-table-column align="center" label="联系电话" prop="linkphone" />
      <el-table-column align="center" label="告别时间" prop="farewelltime" />
      <el-table-column align="center" label="应付总价" prop="totalprice" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.status == 1 ? '未支付' : '' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-truck" @click="handleCheckinfo(scope.row)">骨灰</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="handleInfo(scope.row)">详情</el-button>
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
    <el-dialog title="骨灰操作" :visible.sync="dialogFormCheck">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="骨灰寄存" name="first">
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
                style="width:180px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endtime">
              <el-date-picker
                v-model="save.endtime"
                style="width:180px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="save.linkman" />
            </el-form-item>
            <el-form-item label="身份证" prop="linkman">
              <el-input v-model="save.card" />
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
        </el-tab-pane>
        <el-tab-pane label="送骨灰" name="second">
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
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createGoData">确定</el-button>
        <el-button @click="dialogFormCheck = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看" :visible.sync="dialogFormInfo">
      <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ info_temp.name }}</p>
              <p><span> 身份证 : </span>{{ info_temp.card }}</p>
              <p><span> 死亡原因 : </span>{{ info_temp.reason }}</p>
              <p><span> 联系人 : </span>{{ info_temp.linkman }}</p>
              <p><span> 告别时间 : </span>{{ info_temp.farewelltime }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ info_temp.sex }}</p>
              <p><span> 户口所在地 : </span>{{ info_temp.registered }}</p>
              <p><span> 联系人性别 : </span>{{ info_temp.linksex }}</p>
              <p><span> 联系电话 : </span>{{ info_temp.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ info_temp.age }}</p>
              <p><span> 民族 : </span>{{ info_temp.nation }}</p>
              <p><span> 承办人 : </span>{{ info_temp.operator }}</p>
              <p><span> 逝者关系 : </span>{{ info_temp.relation }}</p>

            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="info_list ? info_list.length > 0 : false" class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">所选服务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in info_list" :key="index">
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
        <span style="color:red;font-size:14px;margin-right:10px;">应付总价：<b>{{ totalprice }}</b> 元</span>
        <el-button type="primary" icon="el-icon-search" @click="open">查看</el-button>
        <el-button v-if="record_ifsign == 0" type="primary" @click="sign_open">签字</el-button>
        <el-button v-if="record_ifsign == 0" type="primary" :disabled="record_sign == '' ? true : false" @click="handlePay">付款</el-button>
        <el-button @click="dialogFormInfo = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="签名" :visible.sync="dialogFormVisibleSign">
      <sign @cancel="cancel" @imgData="imgData" />
    </el-dialog>
    <el-dialog title="查看签名" :visible.sync="dialogFormSign">
      <img v-if="record_sign" :src="record_sign" alt="">
      <span v-else class="sign">暂无签名</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSign = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { financeList, financeInfo, financePay, createcarcommon, financecheck } from '@/api/manage'
import Pagination from '@/components/Pagination'
import sign from '@/components/Sign'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, sign },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      recetype: null,
      index: 1,
      record_sign: '',
      signatureid: '',
      record_ifsign: '',
      info_list: null,
      activeName: 'first',
      info_temp: {
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
        operator: ''
      },
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
        operator: '',
        remark: '',
        id: ''
      },
      save: {
        name: '',
        serial: '',
        startime: null,
        endtime: null,
        signature: '',
        card: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        totalprice: '',
        id: ''
      },
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
      dialogFormCheck: false,
      dialogFormInfo: false,
      dialogFormVisible: false,
      dialogFormVisibleSign: false,
      dialogFormSign: false,
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
    createcarcommon().then(res => {
      this.recetype = res.data.recetype
    })
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
    handleClick(tab, event) {
      this.index = parseInt(tab.index) + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sign_open() {
      this.record_sign = ''
      this.dialogFormVisibleSign = true
    },
    cancel() {
      this.dialogFormVisibleSign = false
    },
    imgData(v) {
      this.record_sign = v
    },
    open() {
      this.dialogFormSign = true
    },
    handleCheckinfo(v) {
      this.save.id = v.id
      this.send.id = v.id
      this.dialogFormCheck = true
    },
    createGoData() {
      if (this.index == 1) {
        const data = {
          step: this.index,
          save: this.save
        }
        console.log(data)
        financecheck(data).then(res => {
          console.log(res)
        })
      } else {
        const data = {
          step: this.index,
          send: this.send
        }
        console.log(data)
        financecheck(data).then(res => {
          console.log(res)
        })
      }
    },
    handleInfo(row) {
      this.signatureid = row.id
      this.record_ifsign = row.record_ifsign
      this.totalprice = row.totalprice
      this.name = row.name
      this.oid = row.id
      this.info_(row)
    },
    info_(row, type) {
      const data = { id: row.id }
      financeInfo(data)
        .then(res => {
          var server = res.data.services
          var temparr_b = []
          server.forEach((v, k) => {
            temparr_b.push(v.services)
          })
          temparr_b = [].concat.apply([], temparr_b)
          this.info_list = temparr_b
          this.info_temp = res.data.obituary
          this.record_ifsign = res.data.obituary.record_ifsign
          this.record_sign = res.data.obituary.record_sign
          this.dialogFormInfo = true
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
          operator: this.info.realname,
          record_sign: this.record_sign
        }
        financePay(data)
          .then(res => {
            if (res.code == 0) {
              this.getList()
              this.dialogFormInfo = false
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
