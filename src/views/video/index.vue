<template>
  <el-row id="fz-video">
    <el-col v-for="vd in shipDefInfos" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
</template>

<script>
import myplayer from './myPlayer'
import { getAllShipDefInfo } from '@/api/shipinfo'
export default {
  name: 'fz-video',
  components: {
    myplayer
  },
  mounted() {
    this.iniavideo()
  },
  data() {
    return {
      shipDefInfos: [{
        shipId: 0,
        shipName: 'AAA',
        shipNote: '',
        shipStatus: '0',
        url: '',
        urlHD: '',
        pic: ''
      }]
    }
  },
  methods: {
    iniavideo() {
      getAllShipDefInfo().then(response => {
        console.log(response)
        if (response.data && response.data.length !== 0) {
          this.shipDefInfos = response.data
          console.log(this.shipDefInfos)
          this.$notify({
            title: '成功！',
            message: '成功获取所有船只的视频连接！',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '警告！',
            message: '船只的信息为空！',
            type: 'warning'
          })
        }
      }).catch(errer => {
        this.$notify.error({
          title: '错误',
          message: errer
        })
      })
    }
  }
}
</script>

<style scoped>
#fz-video{
  padding: 0 4px;
}
</style>
