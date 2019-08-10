<template>
  <div>
    <div class="row-canvas">
      <canvas id="ppCanvas" ref="ppCanvas" width="600" height="375" />
      <div class="shutdown" />
    </div>
    <div style="text-align: right;">
      <!-- <el-button type="success" :disabled="IsInit" @click="initDevice">初始化</el-button>
      <el-button type="danger" @click="uninitDevice">停用</el-button> -->
      <el-button type="primary" @click="clearInk">清除</el-button>
      <el-button type="primary" @click="encode">保存</el-button>
      <el-button @click="encode">取消</el-button>
    </div>
  </div>
</template>
<script>
var isPolling = false
import axios from 'axios'
export default {
  data() {
    return {
      canvasTxt: null,
      IsInit: false,
      imgBase64: '',
      stage_info: [],
      context: '',
      apiUrl: 'http://localhost:8089/PPSignSDK/'
    }
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    initCanvas() {
      const canvas = document.getElementById('ppCanvas')
      this.context = canvas.getContext('2d')
    },
    initDevice() {
      var initUrl = this.apiUrl + 'InitialDevice?id=2&width=580&height=380'
      axios.get(initUrl).then(res => {
        if (res.data === true) {
          isPolling = true
          this.IsInit = true
          this.getInk()
          this.getStatus()
        } else {
          this.$message.error('未检测到设备!')
        }
      })
    },
    getInk() {
      var _that = this;
      (function poll() {
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          if (isPolling) {
            axios.get('http://localhost:8089/PPSignSDK/GetInks').then(res => {
              var dataInfos = JSON.parse(res.data)
              dataInfos.forEach(function(value) {
                if (value.EventType === 0) {
                  _that.drawImages(value.Image)
                }
              })
              if (isPolling) {
                poll()
              }
            }).catch(() => {
              if (isPolling) {
                poll()
              }
            })
          }
        }, 50)
      })()
    },
    getStatus() {
      var _that = this;
      (function poll() {
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          if (isPolling) {
            axios.get('http://localhost:8089/PPSignSDK/GetDeviceConfirmOrCancelKeyStatus').then(res => {
              if (res.data == '1') {
                // alert('Notify From Device : Confirmed.')
              } else if (res.data == '0') {
                //    alert('Notify From Device : Cancel !')
                _that.clearInk()
              }
              if (isPolling) {
                poll()
              }
            }).catch(() => {
              if (isPolling) {
                poll()
              }
            })
          }
        }, 500)
      })()
    },
    encode() {
      axios.get('http://localhost:8089/PPSignSDK/Encode?type=3').then(res => {
        var dataUrl = 'data:image/png;base64,'
        this.imgBase64 = dataUrl + res.data
        this.$emit('cancel')
        this.$emit('imgData', this.imgBase64)
      })
    },
    clearInk() {
      axios.get('http://localhost:8089/PPSignSDK/Clear').then(res => {
        var canvas = document.getElementById('ppCanvas')
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      })
    },
    uninitDevice() {
      isPolling = false
      axios.get('http://localhost:8089/PPSignSDK/UninitialDevice?id=2').then(res => {
        if (res.data === true) {
          var canvas = document.getElementById('ppCanvas')
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          this.IsInit = false
        }
      })
    },
    drawImages(base64) {
      var dataUrl = 'data:image/png;base64,'
      dataUrl = dataUrl + base64
      var img = new Image()
      var canvas = document.getElementById('ppCanvas')
      var ctx = canvas.getContext('2d')
      img.addEventListener('load', function() {
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
      }, false)
      img.src = dataUrl
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style>
.row-canvas {
  text-align: center;
  margin: 1em 0;
  width: 100%;
  position: relative;
}

.shutdown {
  width: 600px;
  height: 375px;
  position: absolute;
  z-index: 2;
  background: #333;
  top: 1px;
  left: 50%;
  margin-left: -300px;
  display: none;
}

#ppCanvas {
  border: thin solid #ccc;
  box-shadow: 4px 4px 12px -2px rgba(51, 51, 51, 0.5);
  z-index: 1;
}

.functions td {
  padding: 5px;
  width: 16.65%;
}

.functions2 td {
  padding: 5px;
  width: 20%;
}

.functions2 .modal-content {
  padding: 15px;
  text-align: center;
}

.functions2 .modal-content p {
  font-size: 1.5em;
}

.encoding {
  margin-top: 1.5em;
}

.encoding td {
  padding: 5px;
}

.decode {
  margin-top: 10px;
}

.decode td {
  margin: 10px 0;
}

hr.style-three {
  border: 0;
  border-bottom: 1px dashed #ccc;
  background: #999;
}

/*switch*/
.switch-title {
  float: left;
  line-height: 26px;
}

.switch {
  width: 46px;
  height: 26px;
  margin: 0 10px;
  position: relative;
  border: 1px solid #dddddd;
  background-color: #ffffff;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  border-radius: 13px;
  -moz-border-radius: 13px;
  background-clip: content-box;
  -moz-background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-user-select: none;
      -ms-user-select: none;
          user-select: none;
  -moz-user-select: none;
  outline: none;
  -moz-outline: none;
  transition: border cubic-bezier(0, 0, 0, 1) 0.2s, box-shadow cubic-bezier(0, 0, 0, 1) 0.2s;
  -moz-transition: border cubic-bezier(0, 0, 0, 1) 0.2s, box-shadow cubic-bezier(0, 0, 0, 1) 0.2s;
}

.switch:before {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 13px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  content: '';
  -moz-content: '';
  transition: left 0.2s;
  -moz-transition: left 0.2s;
}

.switch:checked {
  border-color: #1abc9c;
  box-shadow: #1abc9c 0 0 0 26px inset;
  background-color: #1abc9c;
  transition: border ease 0.2s, box-shadow ease 0.2s, background-color ease 0.6s;
  -moz-transition: border ease 0.2s, box-shadow ease 0.2s, background-color ease 0.6s;
}

.switch.switch-info:checked {
  border-color: #3498db;
  box-shadow: #3498db 0 0 0 26px inset;
  background-color: #3498db;
}

.switch.switch-success:checked {
  border-color: #2ecc71;
  box-shadow: #2ecc71 0 0 0 26px inset;
  background-color: #2ecc71;
}

.switch.switch-danger:checked {
  border-color: #e74c3c;
  box-shadow: #e74c3c 0 0 0 26px inset;
  background-color: #e74c3c;
}

.switch.switch-warning:checked {
  border-color: #f1c40f;
  box-shadow: #f1c40f 0 0 0 26px inset;
  background-color: #f1c40f;
}

.switch:checked:before {
  left: 20px;
  transition: left 0.2s;
}
