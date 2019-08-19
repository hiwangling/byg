<template>
  <div>
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
      <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">接运业务</h1>
        <el-divider v-if="carsend" content-position="left">出车信息</el-divider>
        <el-row v-if="carsend" :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 接运类型 : </span>{{ carsend.recetype == 1 ? '接遗体' : '送骨灰' }}</p>
              <p><span> 联系人 : </span>{{ carsend.linkman }}</p>
              <p><span> 接运价格 : </span>{{ carsend.totalprice }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 出车司机 : </span>{{ carsend.driver }}</p>
              <p><span> 联系电话 : </span>{{ carsend.linkphone }}</p>
              <p><span> 操作人 : </span>{{ carsend.operator }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 出车时间 : </span>{{ carsend.create_time }}</p>
              <p><span> 备注 : </span>{{ carsend.remark }}</p>
            </div>
          </el-col>
        </el-row>
        <template v-if="serlist.send ? serlist.send.length > 0 : false">
          <el-divider content-position="left">接运服务</el-divider>
          <el-row :gutter="20">
            <div v-for="(item,index) in serlist.send" :key="index">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 服务名称 : </span>{{ item.title }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 数量 : </span>{{ item.number }} </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p>
                    <span> 合计 : </span>
                    <span style="font-weight: 100;">{{ item.totalprice }}</span>

                  </p>
                </div>
              </el-col>
            </div>
          </el-row>
        </template>
        <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img.send" alt="" width="130" @click="open(sign_img.send)">
        </template>
      </div>

      <div class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">礼厅业务</h1>
        <template v-if="mourn">
          <el-divider content-position="left">灵堂服务</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 灵堂名称 : </span>{{ mourn.title }}</p>
                <p><span> 价格 : </span>{{ mourn.totalprice }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 开始时间 : </span>{{ mourn.startime }}</p>
                <p><span> 备注 : </span>{{ mourn.remark }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 结束时间 : </span>{{ mourn.endtime }}</p>
                <p><span> 操作人 : </span>{{ mourn.operator }}</p>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-if="cold">
          <el-divider content-position="left">冷藏柜</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 冷藏柜名称 : </span>{{ cold.title }}</p>
                <p><span> 价格 : </span>{{ cold.totalprice }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 开始时间 : </span>{{ cold.startime }}</p>
                <p><span> 备注 : </span>{{ cold.remark }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <p><span> 结束时间 : </span>{{ cold.endtime }}</p>
                <p><span> 操作人 : </span>{{ cold.operator }}</p>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-if="serlist.voca ? serlist.voca.length > 0 : false">
          <el-divider content-position="left">礼厅服务</el-divider>
          <el-row :gutter="20">
            <div v-for="(item,index) in serlist.voca" :key="index">
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 服务名称 : </span>{{ item.title }}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 数量 : </span>{{ item.number }} </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p><span> 合计 : </span>{{ item.totalprice }}</p>
                </div>
              </el-col>
            </div>
          </el-row>
        </template>
        <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img.voca" alt="" width="130" @click="open(sign_img.voca)">
        </template>
      </div>

      <div v-if="serlist.fire ? serlist.fire.length > 0 : false" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">火化业务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in serlist.fire" :key="index">
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
        <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img.fire" alt="" width="130" @click="open(sign_img.fire)">
        </template>
      </div>
      <div v-if="serlist.hall ? serlist.hall.length > 0 : false" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">大厅业务</h1>
        <el-row :gutter="20">
          <div v-for="(item,index) in serlist.hall" :key="index">
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

      <div v-if="check.serial != ''" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">寄存业务</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 寄存编号 : </span>{{ check.serial }}</p>
              <p><span> 开始时间 : </span>{{ check.startime }}</p>
              <p><span> 联系人身份证 : </span>{{ check.linkcard }}</p>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 结束时间 : </span>{{ check.endtime }}</p>
              <p><span> 联系人电话 : </span>{{ check.linkphone }}</p>
              <p><span> 寄存价格 : </span>{{ check.totalprice }}</p>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 联系人 : </span>{{ check.linkman }}</p>
              <p><span> 联系人地址 : </span>{{ check.linkaddress }}</p>
              <p><span> 操作人 : </span>{{ check.operator }}</p>
            </div>
          </el-col>
        </el-row>
        <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img_save" alt="" width="130" @click="open(sign_img_save)">
        </template>
      </div>
      <div v-if="derate.id" class="bury_car" style="border:1px solid #63afde;margin-top:10px;">
        <h1 class="bury_car_h1" style="background:#63afde;color:#fff">减免政策</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 普通火化，遗体消毒费 : </span>{{ derate.threeprice }}</p>
              <p><span> 证件编号 : </span>{{ derate.papers ? derate.papers : '无' }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 三日内普通冷藏费 : </span>{{ derate.twoprice }} </p>
              <p><span> 总价 : </span>{{ derate.totalprice }}</p>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 遗体接运费 : </span>{{ derate.threeprice }}</p>
              <p><span> 操作人 : </span>{{ derate.operator }}</p>
            </div>
          </el-col>
        </el-row>
        <template>
          <el-divider content-position="left">家属签字</el-divider>
          <img :src="sign_img_derate" alt="" width="130" @click="open(sign_img_derate)">
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <span v-if="record_sign_info" class="sign_">家属签字：<img :src="record_sign_info" alt="" @click="open(record_sign_info)"> </span> -->
        <span style="color:red;font-size:14px;margin-right:10px;">总价：<b>{{ totalprice }}</b> 元</span>
        <el-button @click="dialogFormInfo = false">取消</el-button>
      </div>
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
import { financeInfo } from '@/api/manage'
export default {
  name: 'VueInfo',
  data() {
    return {
      sign_img_save: '',
      sign_img_derate: '',
      record_sign: '',
      record_sign_info: '',
      totalprice: '',
      dialogFormInfo: false,
      dialogFormSign: false,
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

  },
  methods: {
    handleInfo(v) {
      this.totalprice = v.f_totalprice || v.r_totalprice
      const data = { id: v.id }
      financeInfo(data)
        .then(res => {
          var server = res.data.branchList
          var servers = Object.values(server)
          if (servers[0].carsend) {
            this.carsend = servers[0].carsend[0]
          }
          if (servers[1].record) {
            this.mourn = servers[1].record.mourn
          }
          if (servers[1].record) {
            this.mourn = servers[1].record.cold
          }
          Object.keys(this.serlist).forEach((v, k) => {
            this.serlist[v] = this.solo(servers[k])
            this.sign_img[v] = servers[k].signature
          })
          this.sign_img_derate = res.data.derate.signature
          if (res.data.check) {
            this.sign_img_save = res.data.check.signature
          }
          this.record_sign_info = servers[3].signature
          this.info_temp = res.data.obituary
          this.record_ifsign = res.data.obituary.record_ifsign
          this.record_sign = res.data.obituary.record_sign
          if (res.data.check) {
            this.check = res.data.check
          }
          this.derate = res.data.derate
          this.dialogFormInfo = true
        })
    },
    open(v) {
      this.record_sign = v
      this.dialogFormSign = true
    },
    solo(arr) {
      var editRow = []
      arr.services.forEach((v, k) => {
        editRow.push(v.services)
      })
      return [].concat.apply([], editRow)
    }
  }
}
</script>
