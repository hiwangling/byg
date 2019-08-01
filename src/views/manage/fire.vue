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
      <el-table-column align="center" label="逝者姓名" prop="name"  >
        <template slot-scope="scope">
          {{ scope.row.name }} ({{ scope.row.sex }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="linkman"   />
      <el-table-column align="center" label="联系电话" prop="linkphone"  />
      <el-table-column align="center" label="联系人民族" prop="nation" />
      <el-table-column align="center" label="死亡原因" prop="reason" />
      <el-table-column align="center" label="状态" prop="c_state"  >
        <template slot-scope="scope">
          <el-tag :type="scope.row.c_state | carFilter"> {{ scope.row.c_state = scope.row.c_state==null ? 1 : scope.row.c_state | cremationstate_stype }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding" width="220">
        <template slot-scope="scope">
        <template v-if="scope.row.c_ifsignature == 0 || scope.row.c_ifsignature ==null">
          <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >办理</el-button>
           <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="primary"
            size="mini"
            plain
            @click="handleSign(scope.row)"
          >打印</el-button>
           </template>
            <template v-else>
            <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="warning"
            size="mini"
             v-if="scope.row.c_state == 2"
            @click="handleOver(scope.row)"
          >火化完成</el-button>
             <el-button
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
            type="danger"
            size="mini"
            v-if="scope.row.c_state == 1"
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
            v-permission="['POST /api/v1/cemetery_classify/g_edit']"
             type="danger"
              plain
            size="mini"
             v-if="scope.row.c_state == 4 || scope.row.c_state == 5"
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
  <el-dialog title="添加寄存" :visible.sync="dialogFormVisibleSave">
        <el-form
        ref="save"
        :inline="true"
        :model="save"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="逝者姓名" prop="name">
              <el-input v-model="save.name" />
            </el-form-item>
      </el-form>
         <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="createSignData">确定</el-button>
        <el-button @click="dialogFormVisibleSave = false">取消</el-button>
      </div> 
   </el-dialog>
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
                 <el-form-item label="承运人" prop="haulier">
              <el-input v-model="dataForm.haulier" />
            </el-form-item>
            <el-form-item label="备注" prop="c_remark">
              <el-input v-model="dataForm.c_remark" />
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" plain @click="handleShow(0)">添加服务</el-button>
        <el-button v-else type="primary" plain @click="handleShow(1)">添加服务</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogFormVisibleLook" width="900px">
          <h3 style="text-align: center;font-size:22px;font-weight: 100; margin: 0 0 15px 0">当阳市殡仪馆火化及申请书</h3>
    <!-- <table class="print_table" style="width:800px">
        <tr>
          <td><b>逝者姓名</b></td>
          <td>{{ dataForm.name }}</td>
          <td style="width:50px"><b>性别</b></td>
          <td>{{ dataForm.sex }}</td>
          <td><b>年龄</b></td>
          <td>{{ dataForm.age }}</td>
          <td><b>死亡日期</b></td>
          <td style="width:50px">{{ dataForm.name }}</td>
          <td><b>死亡原因</b></td>
          <td>234</td>
        </tr>
        <tr>
          <td><b>联系人</b></td>
          <td>44</td>
          <td><b>联系人电话</b></td>
          <td>424</td>
          <td><b>联系人性别</b></td>
          <td>424</td>
          <td><b>联系人民族</b></td>
          <td>4</td>
          <td><b>与逝者关系</b></td>
          <td>3</td>
        </tr>
        <tr>
          <td rowspan="2">申请人</td>
          <td>姓名</td>
          <td>33</td>
          <td>住址</td>
          <td colspan="6">323</td>
        </tr>
        <tr>
          <td>工作单位</td>
          <td colspan="3"/>
          <td>电话</td>
          <td colspan="2">213</td>
          <td>与使用人关系</td>
          <td>32</td>
        </tr>
        <tr>
          <td colspan="10">以下由经办人填写</td>
        </tr>
        <tr>
          <td>墓穴区号</td>
          <td colspan="4">123</td>
          <td colspan="2">收款数</td>
          <td colspan="3">地方</td>
        </tr>
        <tr>
          <td>备注</td>
          <td colspan="10" style="height:100px">
            <div style="height:100px"/>
          </td>
        </tr>
      </table> -->
        <div class="bury_car">
        <h1 class="bury_car_h1">逝者信息</h1>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者姓名 : </span>{{ dataForm.name }}</p>
              <p><span> 死亡日期 : </span>2018-5-5</p>
              <p><span> 联系人 : </span>{{ dataForm.linkman }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者性别 : </span>{{ dataForm.sex }}</p>
              <p><span> 死亡原因 : </span>无</p>
              <p><span> 联系电话 : </span>{{ dataForm.linkphone }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <p><span> 逝者年龄 : </span>{{ dataForm.age }}</p>
              <p><span> 死亡原因 : </span></p>
              <p><span> 承办人 : </span>{{ dataForm.operator }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
       <div class="bury_car" style="border:1px solid #23C6C8;margin-top:10px;" v-if="server.length>0">
        <h1 class="bury_car_h1" style="background:#23C6C8;color:#fff">火化服务</h1>
        <el-row :gutter="20">
          <template v-for="(item,index) in server" >
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
          </template>
        </el-row>
      </div>  
      <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="createSignData">签字</el-button>
        <el-button @click="dialogFormVisibleLook = false">取消</el-button>
      </div> 
    </el-dialog>

    <service ref="server" @service_data="service_data" />
  </div>
</template>
<script>
import {
  commonCremation,
  infoCremation,
  listfire,
  editfire,
  signfire,
  statefire
} from '@/api/manage'
import Pagination from '@/components/Pagination'
import service from '@/components/Service'
import { vuexData } from '@/utils/mixin'
export default {
  name: 'VueGarden',
  components: { Pagination, service },
  mixins: [vuexData],
  data() {
    return {
      list: null,
      total: 0,
      dialogFormVisibleLook:false,
      dialogFormVisibleSave:false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search_data: '',
        sort: 'add_time',
        order: 'desc'
      },
      sex: ['男', '女'],
      save:{
        name:'',
         
      },
      dataForm: {
        name: '',
        sex: '',
        age: '',
        card: '',
        farewelltime:null,
        registered: '',
        reason: '',
        linkman: '',
        relation: '',
        linksex:'',
        nation:'',
        haulier:'',
        linkphone: '',
        operator: '',
        server: null,
        c_remark:'',

      },
      server:null,
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
  watch: {
 
 
  },
  computed: {},
  created() {
    this.getList()
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
    getCommon(){
    commonCremation().then(res => {
      this.server = res.data.services
    })
    },
    handleSign(row){
       this.dataForm = Object.assign({}, row)
      const data = {id: row.id }
      infoCremation(data).then(res => {
        var server = []
        if(res.data.services.length > 0){
        server = res.data.services[0].services
        }
        this.server  = server
      })
      this.dialogFormVisibleLook = true
    },
    handleShow(val) {
      const data = {
        clear: val,
        server: this.server
      }
      this.$refs.server.showService(data)
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
        nation:'',
        linksex:'',
        operator: '',
        c_remark:'',
        haulier:'',
        server:null,
      }
    },
    handleQu(row){
      this.$confirm('是否取灰?', '提示', {
          confirmButtonText: '取灰',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
       const data = {
        id:row.id,
        c_id:row.c_id,
        state:row.c_state
      }
     statefire(data).then(res => {
       if(res.code == 0){
             this.getList()
             this.$message({
            type: 'success',
            message: '操作成功!'
          });
       }
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          });          
        });
    },
    handleSave(row){
       this.save = Object.assign({}, row)
    this.dialogFormVisibleSave = true
    },
    handleOver(row){
        this.$confirm('火化是否完成?', '提示', {
          confirmButtonText: '完成',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
       const data = {
        id:row.id,
        c_id:row.c_id,
        state:row.c_state
      }
     statefire(data).then(res => {
       if(res.code == 0){
             this.getList()
             this.$message({
            type: 'success',
            message: '操作成功!'
          });
       }
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          });          
        });
    },
    handleFire(row){
        this.$prompt('请输入火化牌号', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '请输入数字'
        }).then(({ value }) => {
        const data = {
        id:row.id,
        c_id:row.c_id,
        state:row.c_state,
        number:value
      }
     statefire(data).then(res => {
          if(res.code == 0){
             this.getList()
             this.$message({
            type: 'success',
            message: '操作成功!'
          });
       }
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          });       
        });
    },
    handleCreate() {
      this.resetForm()
      this.getCommon()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.dataForm.operator = this.info.realname
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
    createSignData(){
      const data = {
        c_id:this.dataForm.c_id,
        signature:'张三'
      }
     signfire(data).then(res => {
              this.getList()
              this.dialogFormVisibleLook = false
              this.$notify.success({
                title: '成功',
                message: '提交成功'
              })
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.getCommon()
      const data = { id: row.id }
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
<style>
 .bury_car{
    border: 1px solid #EEEEEE;
  border-radius: 5px;
 }
 .bury_car_h1{
    height: 40px;
    line-height: 40px;
    background: #F5F5F5;
    font-size: 16px;
    font-weight: 100;
    margin: 0;
    padding-left: 10px;
  }
  
  .grid-content{
    padding-left: 10px;
  }
   .grid-content span{
     font-weight: 400;
     color: #000
   }


   .print_table {
  border-collapse: collapse;
  border: none;
}

.print_table td {
  text-align: left;
  padding-left:5px;
  height: 30px;
  line-height: 30px;
  border: solid #000 1px;
}
</style>

