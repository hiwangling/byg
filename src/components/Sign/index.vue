<template>
  <div class="signatureBox">
    <div ref="canvasHW" class="canvasBox">
      <canvas
        ref="canvasF"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mouseup="mouseUp"
      />
      <div class="btnBox" style="text-align: right;margin-right: 20px;">
        <el-button type="danger" size="mini" @click="overwrite">重写</el-button>
        <el-button type="primary" size="mini" @click="send">确定</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Signature',
  data() {
    return {
      points: [],
      imgBase64: '',
      canvasTxt: null,
      stage_info: [],
      startX: 0,
      flag: true,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false
    }
  },
  created() {

  },
  mounted() {
    const canvas = this.$refs.canvasF
    canvas.height = this.$refs.canvasHW.offsetHeight - 60
    canvas.width = this.$refs.canvasHW.offsetWidth - 10
    this.canvasTxt = canvas.getContext('2d')
    this.stage_info = canvas.getBoundingClientRect()
  },
  methods: {
    backHome() {
      window.history.back()
    },
    // 电脑设备事件
    mouseDown(ev) {
      ev = ev || event
      ev.preventDefault()
      //   console.log(ev)
      if (ev) {
        const obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        // console.log(obj)
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.isDown = true
      }
    }, // 移动设备事件
    touchStart(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        const obj = {
          x: ev.targetTouches[0].clientX - this.stage_info.left,
          y: ev.targetTouches[0].clientY - this.stage_info.top
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    // 电脑设备事件
    mouseMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (this.isDown) {
        const obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    }, // 移动设备事件
    touchMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        const obj = {
          x: ev.targetTouches[0].clientX - this.stage_info.left,
          y: ev.targetTouches[0].clientY - this.stage_info.top
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    }, // 电脑设备事件
    mouseUp(ev) {
      ev = ev || event
      ev.preventDefault()
      if (1) {
        const obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.points.push({ x: -1, y: -1 })
        this.isDown = false
      }
    }, // 移动设备事件
    touchEnd(ev) {
      ev = ev || event
      ev.preventDefault()
      //   console.log(ev)
      if (ev.touches.length == 1) {
        const obj = {
          x: ev.targetTouches[0].clientX - this.stage_info.left,
          y: ev.targetTouches[0].clientY - this.stage_info.top
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.points.push({ x: -1, y: -1 })
      }
    }, // 重写
    overwrite() {
      this.canvasTxt.clearRect(
        0,
        0,
        this.$refs.canvasF.width,
        this.$refs.canvasF.height
      )
      this.points = []
    },
    send() {
      const canvas = this.$refs.canvasF
      if (this.points.length > 0) {
        this.imgBase64 = canvas.toDataURL()
      } else {
        this.imgBase64 = ''
      }
      this.$emit('cancel')
      this.$emit('imgData', this.imgBase64)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style  >

 .signatureBox{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 300px;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    z-index: 100;
    display: flex;
    flex-direction: column;
}
.visaDetailTop{
    /*position: absolute;*/    /*top: 0px;*/    /*left: 0px;*/
    width: 100%;
    /*overflow: hidden;*/
    padding: 5px;
    box-sizing: border-box;
    z-index: 2;
    border-bottom: 1px solid #e5e5e5;
    }
.visaDetailTop p{
    margin: 0px;
    text-align: center;
    color: #000;
    font-size: 1em;
    position: relative;
}
p.visaTitle{
    width: 100%;
    position: absolute;
    top: 5px;
    left: 0px;
    text-align: center;
    font-size: 1.2em;
}
.btnBack{
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: transparent;
    border-color: transparent;
    outline: none;
}
.btnDaoHang{
    display: block;
    position: absolute;
    left: 0px;
    top: 0px;
    height: 2.2em;
    width: 2em;
    z-index: 1;
    background: transparent;
    border-color: transparent;
    outline: none;
}
.visaDetailTop p span{
    color: #fff;
    font-size: 1.2em;
}
.visaDetailTop p:first-of-type{
    float: left;
}
.visaDetailTop p:nth-of-type(2){
    float: right;
}
.canvasBox{
    padding: 10px 5px;
    box-sizing: border-box;
    flex: 1;
}
/*
.btnBox{
    height: 30px;
    padding: 5px;
    text-align: right;
    line-height: 30px;
}
.btnBox button:first-of-type{
    border: 1px solid #71b900;
    background: transparent;
    border-radius: 4px;
    padding: 5px 10px;
}
.btnBox button:last-of-type{
    border: 1px solid #71b900;
    background: #71b900;
    color: #fff;
    border-radius: 4px;
    padding: 5px 10px;
} */
/* @media only screen and (min-width: 750px){
    .signatureBox{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        overflow: visible;
    }
} */
</style>
