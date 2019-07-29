import { mapGetters, mapActions } from 'vuex'
import { listRole } from '@/api/role'
var that
export const vuexData = {
  filters: {
    group_list(v) {
      var obj = {}
      that.config_group_list.forEach((item, index) => { obj[index + 1] = item })
      return obj[v]
    },
    type_list(v) {
      var obj = Object.assign({}, that.config_type_list)
      return obj[v]
    },
    service_stype(v) {
      var obj = {}
      that.servicestype.forEach((item, index) => { obj[index + 1] = item })

      return obj[v]
    },
    branch(v) {
      var obj = {}
      that.branch.forEach((item, index) => { obj[item.id] = item.branch_name })
      return obj[v]
    }
  },
  data() {
    return {
      config_type_list: null,
      config_group_list: null,
      servicestype: null,
      branch: null
    }
  },
  computed: {
    ...mapGetters([
      'info',
      'config'
    ])
  },
  beforeCreate: function() {
    that = this
  },
  created() {
    this.config_group_list = this.filter(this.config.config_group_list) // 1,2,3
    this.servicestype = this.filter(this.config.servicestype)
    this.config_type_list = this.filter(this.config.config_type_list) // 0,1,2
    listRole()
      .then(res => {
        this.branch = res.data
      })
  },
  methods: {
    ...mapActions({

    }),
    filter(str) {
      return (((str.replace(/\s*/g, '')).replace(/\d+/g, '')).substring(1)).split(':')
    }
  }
}

