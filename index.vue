<template>
  <div>
    <van-cell title="服务项目" value="点灯" />
    <van-cell title="单价" value="100 元" />
    <!-- <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :min-date="minDate"
        :formatter="formatter"
        @confirm="onSave"
        @cancel="onCancel"
      />
    </van-popup>-->
    <!-- <van-field v-model="value" label="点灯时间" placeholder="请选择" @click="showPopup" /> -->
    <van-field
      v-model="dataForm.buyname"
      required
      clearable
      label="购买人"
      right-icon="question-o"
      placeholder="请输入姓名"
      @click-right-icon="$toast('question')"
    />

    <van-field v-model="dataForm.phone" clearable label="联系电话" placeholder="请输入电话" />
    <van-field
      v-model="dataForm.card_no"
      label="身份证"
      type="textarea"
      placeholder="请输入"
      rows="1"
      autosize
    />
    <van-cell title="总计" :value="dataForm.real_price" />
    <van-cell title="cid" :value="dataForm.cid" />
    <van-cell title="openid" :value="dataForm.openid" />
    <van-button type="primary" size="large" style="margin-top:10px" @click="send">支 付</van-button>
    {{}}
  </div>
</template>
<script>
import store from '@/store'
import wx from 'weixin-js-sdk'
import { lightup_add, callback } from '@/api/lamp'
export default {
  data() {
    return {
      dataForm: {
        openid: store.getters.userInfo.openid,
        cid: this.$route.query.id,
        buyname: '李思',
        real_price: '100',
        card_no: '4233121',
        phone: '1312343343'
      },
      list: null,
      trade_no: '123'
      // show: false,
      // minDate: new Date(),
      // currentDate: new Date()
    }
  },
  created() {
    console.log(wx)
  },
  methods: {
    send() {
      lightup_add(this.dataForm).then(res => {
        // 成功状态下
        // 存储微信支付数据data
        console.log(res)
        const data = res.data
        this.trade_no = res.trade_no
        // console.log('即将跳转微信支付')
        // 函数为分装过得  (就是调用微信支付)
        this.wexinPay({
          appId: process.env.VUE_APP_WECHAT_APPID,
          nonceStr: data.nonceStr,
          package: data.package,
          paySign: data.paySign,
          signType: data.signType,
          timeStamp: data.timeStamp
        }, res => {
          // that.$router.push({ path: '/vip' })
        }
        )
      })
    },
    wexinPay(data, cb, errorCb) {
      // 获取后台传入的数据
      const appId = data.appId
      const timestamp = data.timeStamp
      const nonceStr = data.nonceStr
      const signature = data.signature
      const packages = data.package
      const paySign = data.paySign
      const signType = data.signType
      console.log('发起微信支付')
      // 下面要发起微信支付了
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.ready(function() {
        wx.chooseWXPay({
          timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
          package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: paySign, // 支付签名
          success: function(res) {
            // 支付成功后的回调函数
          //  cb(res)
            const data = { trade_no: this.trade_no }
            console.log(data)
            callback(data).then(res => {
              console.log(res)
            })
          },
          fail: function(res) {
            // 失败回调函数
            errorCb(res)
          }
        })
      })
      wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        /* alert("config信息验证失败");*/
      })
    }

    // onCancel() {
    //   this.show = false
    // },
    // formatter(type, value) {
    //   if (type === 'year') {
    //     return `${value}年`
    //   } else if (type === 'month') {
    //     return `${value}月`
    //   }
    //   return value
    // }
    // onSave(val) {
    //   console.log(val)
    //   this.value = val
    //   this.show = false
    // },
    // showPopup() {
    //   this.show = true
    // }
  }
}
</script>
