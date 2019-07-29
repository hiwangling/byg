<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:20px;">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="dataForm.password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="dataForm.new_pwd" type="password" auto-complete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input v-model="dataForm.re_pwd" type="password" auto-complete="off" />
      </el-form-item>
    </el-form>
    <div style="margin-left:100px;">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="change">确定</el-button>
    </div>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'
export default {
  name: 'ChangePassword',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.new_pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        password: '',
        new_pwd: '',
        re_pwd: ''
      },
      rules: {
        password: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.dataForm = {
        password: '',
        new_pwd: '',
        re_pwd: ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    change() {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        changePassword(this.dataForm).then(res => {
          this.$notify.success({
            title: '成功',
            message: '修改密码成功'
          })
        }).catch(res => {
          this.$notify.error({
            title: '失败',
            message: res.msg
          })
        })
      })
    }
  }
}
</script>
