<template>
  <el-dialog :title="type== 1 ? '选择灵堂' : '选择冷藏柜'" :visible.sync="dialogFormVisible" append-to-body>
    <div class="box-title">
      <div v-for="(item,index) in box" :key="index" class="box-img">
        <img :src="item.img" alt="" width="20">
        <span>{{ item.title }}</span>
      </div>
      <div class="box-select">
        {{ select_data.title }}
        <span style="color:red"> {{ select_data.price }}{{ select_data.unit }}</span>
      </div>
    </div>
    <div class="box-conent">
      <h1>{{ type== 1 ? '灵堂' : '冷藏柜' }}</h1>
      <div class="box-main">
        <el-row :gutter="20">
          <el-col v-for="(item,index) in list" :key="index" :span="4">
            <div class="grid-content">
              <img :src="item.state == 0 ? box[0].img : box[1].img " alt="" width="30">
              <p>
                <el-radio v-model="radio" :label="item.id" :disabled="item.state == 0 ? false : true" @change="changeData">{{ item.title }}</el-radio>
                <!-- <span class="box-span">{{ item.price }}{{ item.unit }}</span> -->
              </p>
            </div>
          </el-col>
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
      radio: '',
      select_data: '',
      type: '',
      list: null,
      box: [{
        img: require('../../assets/img/box-1.png'),
        title: '空闲',
        state: 0
      }, {
        img: require('../../assets/img/box-2.png'),
        title: '占用',
        state: 1
      }],
      dataFrom: {

      }
    }
  },
  computed: {},
  created() {

  },
  methods: {
    show(v) {
      this.list = v.list
      this.type = v.type
      this.select_data = ''
      this.radio = ''
      this.dialogFormVisible = true
    },
    changeData(v) {
      this.list.forEach(ele => {
        if (ele.id == v) {
          this.select_data = ele
        }
      })
    },
    SendData() {
      const data = { type: this.type, data: this.select_data }
      this.$emit('box_data', data)
      this.dialogFormVisible = false
    }
  }
}
</script>
<style>
.box-title{
  width: 100%;
    padding:0 40px;
    display: inline-block
}
.box-title .box-img{
  display: inline-block;
    width: 100px;
}
.box-select{
  display: inline-block;
    height: 30px;
    float: right;
    font-size: 14px;
    font-family: '宋体';
    font-weight: 800;
    line-height: 30px;
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
.box-span{
    display:inline-block;
    margin-top:5px;
    font-size: 12px;
    color: red
}
</style>

