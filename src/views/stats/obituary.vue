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
      <el-table-column align="center" label="火化编号" prop="c_serial" />
      <el-table-column align="center" label="火化日期" prop="c_signtime" />
      <el-table-column align="center" label="逝者姓名" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }} ({{ scope.row.sex }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄" prop="age" />
      <el-table-column align="center" label="死因" prop="reason" />
      <el-table-column align="center" label="死亡日期" prop="dietime" />
      <el-table-column align="center" label="身份证" prop="card" />
      <el-table-column align="center" label="地址" prop="registered" />
      <el-table-column align="center" label="总价" prop="r_totalprice" />
      <el-table-column align="center" label="支付时间" prop="r_create_time" />
      <el-table-column align="center" label="操作" class-name="small-padding" width="100">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="InfoSend(scope.row)"
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
    <info ref="info" />
  </div>
</template>
<script>
import { statsobituary } from '@/api/stats'
import info from '@/components/Info'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueGarden',
  components: { Pagination, info },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        startime: null,
        endtime: null,
        sort: 'add_time',
        order: 'desc'
      },
      sign_img_save: '',
      sign_img_derate: '',
      record_sign: '',
      record_sign_info: '',
      totalprice: '',
      dialogFormInfo: false,
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
      derate: {
        name: '',
        age: '',
        sex: '',
        registered: '',
        card: '',
        object: '',
        papers: '',
        serial: '',
        signtime: null,
        oneprice: '',
        twoprice: '',
        threeprice: '',
        totalprice: '',
        operator: '',
        signature: '',
        id: '',
        oid: ''
      },
      check: {
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
        totalprice: ''
      },
      serlist: {
        send: null,
        voca: null,
        fire: null,
        hall: null
      },
      carsend: null,
      mourn: null,
      cold: null,
      sign_img: {
        send: '',
        voca: '',
        fire: '',
        hall: ''
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
      statsobituary(this.listQuery)
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
    InfoSend(v) {
      this.$refs.info.handleInfo(v)
    }
  }
}
</script>
