<template>
  <div>
    <el-tabs v-model="activeName" tab-position="top" @tab-click="handleClick">
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
                <el-input-number v-model="row.number" :min="1" :max="10" label="" size="mini" @change="handleChange(row)" />
                <el-button v-if="row.info" size="mini" type="info" plain @click="info(row)">详情</el-button>
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
    <el-dialog title="已选套餐" :visible.sync="dialogFormVisible" append-to-body>
      <el-checkbox-group v-model="setServer">
        <el-checkbox
          v-for="(value, item) in getservice"
          :key="item"
          :label="value.sid"
          style="width:150px"
        >{{ value.title }}({{ value.price }})</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getserver
} from '@/api/vocational'
export default {
  data() {
    return {
      dialogFormVisible: false,
      activeName: '',
      listLoading: false,
      sell: [],
      setServer: [],
      editFlag: false,
      getservice: [],
      editRow: [],
      list: null,
      clear: 0,
      row: null,
      num: 1,
      tab: [],
      index: 0,
      sum_price: 0,
      price: 0,
      service: []
    }
  },
  watch: {
    sell: {
      handler() {
        this.changeSell()
      },
      immediate: true
    },
    setServer: {
      handler() {
        this.changeprice()
      },
      immediate: false
    }
  },
  created() {

  },
  methods: {
    // 处理服务
    async getList() {
      this.init()
      this.$nextTick(async() => {
        // this.tab.map(async(v, i) => {
        for (let i = 0; i < this.tab.length; i++) {
          if (this.clear == 0) {
            this.$refs.sellTable[i].clearSelection()
            this.init()
          } else {
            await this.edit(i)
            await this.edit(0)
          }
        }
        // })
      })
    },
    // 计算总价
    handleChange(v) {
      v.totalprice = v.number * v.price
      this.changeSell()
    },
    handleClick(tab, event) {
      this.index = tab.index
    },
    init() {
      var temp = []
      var tab = []
      if (this.list != null) {
        this.activeName = this.list[0].title ? this.list[0].title : ''
        temp = this.list.map(v => {
          v.services.map(k => {
            this.$set(k, 'number', 1)
            this.$set(k, 'inlet', null)
            this.$set(k, 'totalprice', k.price)
          })
          if (v.key == 6) {
            v.services.map(k => {
              this.$set(k, 'info', true)
            })
          }
          tab.push({
            label: v.title,
            list: v.services,
            sells: []
          })
        })
      }
      this.tab = tab
    },
    edit(i) {
      this.index = i
      this.$nextTick(() => {
        this.$refs.sellTable[i].clearSelection()
        this.service.forEach((v, k) => {
          var server = []
          server = v.services
          server.forEach(n => {
            this.$refs.sellTable[i].data.forEach(t => {
              for (var key in t) {
                if (t.id == n.sid) {
                  t.price = n.price
                  t.number = n.number
                  t.inlet = n.inlet
                  t.totalprice = n.totalprice
                  t.combo = n.combo
                }
              }
            })
            this.$refs.sellTable[i].toggleRowSelection(
              this.$refs.sellTable[i].data.find(item => item.id === n.sid),
              true
            )
          })
        })
      })
    },
    showService(v) {
      this.clear = v.type
      this.list = v.server
      this.getList()
    },
    info(v) {
      this.dialogFormVisible = true
      var setService = []
      const data = { id: v.id }
      getserver(data).then(res => {
        this.getservice = res.data
        if (this.clear == 0) {
          res.data.forEach(v => {
            setService.push(v.sid)
          })
        } else {
          setService = v.combo ? v.combo : []
        }

        this.row = v
        this.setServer = setService
        this.$forceUpdate()
      })
    },
    updateData() {
      this.dialogFormVisible = false
      this.confirmEdit(this.row)
    },
    editService(v) {
      this.getList()
      this.service = v
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
      const data = {
        services_totalprice: this.sum_price,
        service: this.sell
        // combo: this.setServer
      }
      this.$emit('service_data', data)
    },
    changeprice(v) {
      let sum_price = 0
      this.getservice.forEach(v => {
        this.setServer.forEach(k => {
          if (v.sid == k) {
            sum_price = sum_price + parseInt(v.price)
          }
        })
      })
      console.log(this.setServer)
      this.price = sum_price
      this.row.price = this.price
      this.row.combo = this.setServer
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
    }
    // SendData() {
    //   const data = {
    //     services_totalprice: this.sum_price,
    //     service: this.sell
    //   }
    //   this.$emit('service_data', data)
    // }
  }
}
</script>
