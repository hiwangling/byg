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
      <el-table-column align="center" label="名称" prop="title" />
      <el-table-column align="center" label="数量" prop="count_number">
        <template slot-scope="scope">
          {{ Math.abs(scope.row.count_number) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="总价" prop="totalprice" />
      <el-table-column align="center" label="操作" class-name="small-padding" width="160">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="warning"
            size="mini"
            @click="handleSupplies(scope.row)"
          >查看</el-button>
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
    <el-dialog title="花圈挽联详情" :visible.sync="dialogFormVisibleList">
      <el-table :data="supplies_list" border fit highlight-current-row>
        <el-table-column align="center" label="商品" prop="title" />
        <el-table-column align="center" label="价格" prop="price" width="80" />
        <el-table-column align="center" label="数量" prop="number" width="80">
          <template slot-scope="scope">
            {{ Math.abs(scope.row.number) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总价" prop="totalprice" width="80" />
        <el-table-column align="center" label="时间" prop="create_time" />
      </el-table>
      <pagination
        v-show="supplies_total>0"
        :total="supplies_total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="handleSupplies"
      />
    </el-dialog>
  </div>
</template>
<script>
import { statswreath, statswreathList } from '@/api/stats'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueGarden',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisibleList: false,
      supplies_list: null,
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
      statswreath(this.listQuery)
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
    handleSupplies(row) {
      this.dialogFormVisibleList = true
      const data = { sid: row.sid, startime: this.listQuery.startime, endtime: this.listQuery.endtime }
      statswreathList(data)
        .then(res => {
          this.supplies_list = res.data.data
          this.supplies_total = res.data.total || 0
        })
        .catch(() => {
          this.supplies_list = []
          this.supplies_total = 0
        })
    }
  }
}
</script>
