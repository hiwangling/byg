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

      <el-date-picker
        v-model="listQuery.startime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始时间"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        style="width: 200px"
        class="filter-item"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束时间"
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
      <el-table-column align="center" label="寄存编号" prop="serial" />
      <el-table-column align="center" label="寄存日期" prop="startime" />
      <el-table-column align="center" label="逝者姓名" prop="name" />
      <el-table-column align="center" label="寄存人签字" prop="signature">
        <template slot-scope="scope">
          <img :src="scope.row.signature" alt="" width="60">
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人地址" prop="linkaddress" />
      <el-table-column align="center" label="联系人电话" prop="linkphone" />
      <el-table-column align="center" label="操作人" prop="operator" />
      <el-table-column align="center" label="取走日期" prop="taketime" />
      <el-table-column align="center" label="取走人签字" prop="take_signature">
        <template slot-scope="scope">
          <img :src="scope.row.signature" alt="" width="60">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="100">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="handleInfo(scope.row)"
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
          <div v-for="(item,index) in informationServer" :key="index">
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
        <span v-if="record_sign" class="sign_">家属签字：<img :src="record_sign" alt="" @click="dialogFormSign = true"> </span>
        <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { statscheck } from '@/api/stats'
import { checkinfo } from '@/api/manage'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueGarden',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      record_sign: '',
      listLoading: true,
      information: {
        name: '',
        linkman: '',
        linkphone: '',
        linkaddress: '',
        operator: '',
        sex: '',
        age: ''
      },
      informationServer: null,
      dialogFormVisibleInfo: false,
      listQuery: {
        page: 1,
        limit: 20,
        startime: null,
        endtime: null,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
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
      statscheck(this.listQuery)
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
    handleInfo(v) {
      const data = { id: v.id }
      checkinfo(data)
        .then(res => {
          this.dialogFormVisibleInfo = true
          this.$nextTick(() => {
            this.information = res.data
            this.record_sign = res.data.signature
            this.informationServer = this.information.finance_list.data
          })
        })
        .catch((res) => {
          this.$notify.error({
            title: '获取失败',
            message: res.msg
          })
        })
    }
  }
}
</script>
