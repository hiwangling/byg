<template>
  <el-dialog title="选择服务" :visible.sync="dialogFormVisible" append-to-body>
    <el-tabs v-model="activeName" type="card" tab-position="top" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tab" :key="index" :label="item.label" :name="item.label">
        <el-table
          ref="sellTable"
          v-loading="listLoading"
          border
          highlight-current-row
          :data="item.list"
          tooltip-effect="dark"
          style="width: 100%;margin-bottom:10px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="title" align="center" label="服务名称" width="150" />
          <el-table-column prop="price" align="center" label="服务价格" show-overflow-tooltip>
            <template slot-scope="{row}">
              <template>
                <el-input
                  v-model="row.price"
                  class="edit-input"
                  size="mini"
                  style="width:80px"
                  @blur="confirmEdit(row)"
                  @focus="confirmFocus(row)"
                />
                <el-input-number v-model="row.number" :min="0" :max="10" label="" size="mini" @change="handleChange(row)" />
                <!-- <span>{{ row.totalprice }}</span> -->
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">已选项目</div>
        </div>
        <el-table
          v-show="false"
          v-loading="listLoading"
          :show-header="false"
          show-summary
          :data="item.sells"
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="title" width="200" />
          <el-table-column prop="totalprice" />
        </el-table>
      </el-tab-pane>
      <el-table
        v-loading="listLoading"
        :show-header="false"
        show-summary
        :data="sell"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="title" width="200" />
        <el-table-column prop="totalprice" />
      </el-table>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="SendData">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      activeName: '接运服务',
      dialogFormVisible: false,
      listLoading: false,
      sell: [],
      editFlag: false,
      editRow: [],
      list: null,
      clear: 0,
      num: 1,
      tab: [],
      index: 0,
      sum_price: 0,
      service: []
    }
  },
  watch: {
    sell: {
      handler() {
        this.changeSell()
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    // 处理服务
    async getList() {
      this.init()
      this.$nextTick(() => {
        this.tab.map(async(v, i) => {
          if (this.clear == 0) {
            this.$refs.sellTable[i].clearSelection()
            this.init()
          } else {
            await this.edit(i)
            await this.edit(0)
          }
        })
      })
    },
    // 计算总价
    handleChange(item) {
      item.totalprice = item.number * item.price
      this.changeSell()
    },
    handleClick(tab, event) {
      this.index = tab.index
    },
    init() {
      var temp = []
      var tab = []
      temp = this.list.map(v => {
        v.services.map(k => {
          this.$set(k, 'number', 1)
          this.$set(k, 'inlet', null)
          this.$set(k, 'totalprice', k.price)
        })
        tab.push({
          label: v.title,
          list: v.services,
          sells: []
        })
      })
      this.tab = tab
    },
    edit(i) {
      this.index = i
      this.$nextTick(() => {
        this.$refs.sellTable[this.index].clearSelection()
        this.service.forEach((v, k) => {
          var server = []
          server = v.services
          server.forEach(n => {
            for (var k in n) {
              this.$refs.sellTable[this.index].data.forEach(t => {
                for (var key in t) {
                  if (t.id == n.sid) {
                    t.price = n.price
                    t.number = n.number
                    t.inlet = n.inlet
                    t.totalprice = n.totalprice
                  }
                }
              })
            }
            this.$refs.sellTable[this.index].toggleRowSelection(
              this.$refs.sellTable[this.index].data.find(item => item.id === n.sid),
              true
            )
          })
        })
      })
    },
    showService(val) {
      this.dialogFormVisible = true
      this.list = val.server
      this.clear = val.clear
      this.getList()
    },
    showServiceEdit(val) {

    },
    editService(val) {
      this.service = val
      // console.log(val)
      // var editRow = []
      // this.service.forEach((v, k) => {
      //   editRow.push(v.services)
      // })
      // this.editRow = [].concat.apply([], editRow)
      // this.sell = this.editRow
      // console.log(this.sell)
    },
    confirmEdit(row) {
      this.changeSell()
      this.handleChange(row)
      this.$refs.sellTable[this.index].toggleRowSelection(row, true)
    },
    confirmFocus(row) {

    },
    // 遍历价格
    changeSell() {
      let sum_price = 0
      if (this.sell) {
        this.sell.forEach((v, k) => {
          sum_price = sum_price + parseInt(v.totalprice)
        })
      }
      this.sum_price = sum_price
    },

    // 获取已选服务
    handleSelectionChange(val) {
      this.tab[this.index].sells = val.filter(item => item != undefined)
      var SellArray = []
      this.tab.forEach((v, k) => {
        SellArray.push(this.tab[k].sells)
      })
      SellArray = [].concat.apply([], SellArray)
      // SellArray = SellArray.filter(item => item != undefined)
      this.sell = SellArray
    },
    SendData() {
      const data = {
        services_totalprice: this.sum_price,
        service: this.sell
      }
      this.$emit('service_data', data)
      this.dialogFormVisible = false
    }
  }
}
</script>
