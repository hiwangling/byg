<template>
  <div class="app-container">
    <div class="filter-container">
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
      class="carmonth"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="项目车号" prop="number" />
      <el-table-column align="center" label="总收入" prop="sum_j" />
      <el-table-column label="其中">
        <el-table-column label="免费接运">
          <el-table-column align="center" label="金额" prop="sum_f" />
          <el-table-column align="center" label="趟" prop="count_c" />
        </el-table-column>
        <el-table-column label="送骨灰">
          <el-table-column align="center" label="金额" prop="sum_g" />
          <el-table-column align="center" label="趟" prop="count_g" />
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="司机" prop="chauffeur" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>
<script>
import { statscarmonth } from '@/api/stats'
import Pagination from '@/components/Pagination'
export default {
  name: 'VueGarden',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        startime: null,
        endtime: null,
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      statscarmonth(this.listQuery)
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }

  }
}
</script>
<style>
.carmonth  th > .cell{
  text-align: center
}
</style>
