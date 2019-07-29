<template>
  <el-dialog title="选择灵堂" :visible.sync="dialogFormVisible" append-to-body>
    <div class="box-title">
      <div v-for="(item,index) in box" :key="index">
        <img :src="item.img" alt="" width="30">
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="box-conent">
      <h1>灵堂位</h1>
      <div class="box-main">
        <el-row :gutter="20">
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-1.png" alt="" width="30"><p> <el-radio v-model="radio" label="1">01</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-2.png" alt="" width="30"><p> <el-radio v-model="radio" label="2">03</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-1.png" alt="" width="30"><p> <el-radio v-model="radio" label="3">02</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-1.png" alt="" width="30"><p> <el-radio v-model="radio" label="4">04</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-3.png" alt="" width="30"><p> <el-radio v-model="radio" label="5">51</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-1.png" alt="" width="30"><p> <el-radio v-model="radio" label="6">21</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-1.png" alt="" width="30"><p> <el-radio v-model="radio" label="3">02</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-1.png" alt="" width="30"><p> <el-radio v-model="radio" label="4">04</el-radio></p></div></el-col>
          <el-col :span="4"><div class="grid-content"><img src="../../assets/img/box-3.png" alt="" width="30"><p> <el-radio v-model="radio" label="5">51</el-radio></p></div></el-col>

        </el-row>
      </div>
    </div>
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
      dialogFormVisible: false,
      radio: '1',
      box: [{
        img: require('../../assets/img/box-1.png'),
        title: '空闲'
      }, {
        img: require('../../assets/img/box-2.png'),
        title: '占用'
      }, {
        img: require('../../assets/img/box-3.png'),
        title: '维修中'
      }],
      dataFrom: {

      }
    }
  },
  computed: {},
  created() {

  },
  methods: {
    show() {
      this.dialogFormVisible = true
    },
    SendData() {

    }
  }
}
</script>
<style>
.box-title{
    display: flex;
    width: 60%;
    justify-content:space-between
}
.box-title img{
    vertical-align: middle;
}
.box-title span{
    display: inline-block;
    height: 30px;
    line-height: 30px
}
.box-conent{
    border: 1px solid #eee;
    margin-top: 20px;
}
.box-conent h1{
    margin: 0;
    background: #f5f5f5;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: 100;
}
.box-main{
    padding: 15px;
}
.box-main .grid-content {
    text-align: center
}
</style>

