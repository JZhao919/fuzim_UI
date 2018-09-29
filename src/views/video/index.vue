<template>
<div id="fz-video">
  <el-row class="fz-video">
    <el-col v-for="vd in runShipAllV" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer ref="runShipAllV" :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
  <el-row class="fz-video">
    <el-col v-for="vd in runShipTwoV" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer ref="runShipTwoV" :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
  <el-row class="fz-video">
    <el-col v-for="vd in runShipOneV" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer ref="runShipOneV" :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
  <el-row class="fz-video">
    <el-col v-for="vd in runShipNoV" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer ref="runShipNoV" :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
  <el-row class="fz-video">
    <el-col v-for="vd in norunShipV" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer ref="norunShipV" :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
</div>
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
        shipStatus: "0",
        shipCamheadUrl: "",
        shipCamheadUrlHD: "",
        shipCamcabinUrl: "",
        shipCamcabinUrlHD: "",
        shipCamtailUrl: "",
        shipCamtailUrlHD: ""
      }],
      runShipAllV: [], // 运行中且所有视频都存在
      runShipOneV: [], // 运行中且只有一个视频存在
      runShipTwoV: [], // 运行中且只有两个视频存在
      runShipNoV: [], // 运行中且所有视频都不存在
      norunShipV: [] // 未运行
    }
  },
  methods: {
    init() {
      if (this.runShipAllV.length > 0) {
        this.$refs.runShipAllV.init()
      }
      if (this.runShipAllV.length > 0) {
        this.$refs.runShipTwoV.init()
      }
      if (this.runShipAllV.length > 0) {
        this.$refs.runShipOneV.init()
      }
      if (this.runShipAllV.length > 0) {
        this.$refs.runShipNoV.init()
      }
      if (this.runShipAllV.length > 0) {
        this.$refs.norunShipV.init()
      }
    },
    iniavideo() {
      getAllShipDefInfo().then(response => {
        if (response.data && response.data.length > 0) {
          this.dealInfo(response.data)
          this.$notify({
            title: '成功！',
            message: '成功获取所有船只的视频信息！',
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
          message: "获取信息失败：" + errer
        })
      })
    },
    dealInfo(shipDefInfos) {
      for (let i = 0; i < shipDefInfos.length; i++) {
        ((n) => {
          const SpDIf = shipDefInfos[n]
          if (SpDIf.shipStatus === "1") {
            if ((SpDIf.shipCamheadUrl && SpDIf.shipCamheadUrl !== "") &&
            (SpDIf.shipCamcabinUrl && SpDIf.shipCamcabinUrl !== "") && (SpDIf.shipCamtailUrl && SpDIf.shipCamtailUrl !== "")) {
              this.runShipAllV.push(SpDIf) // 运行中且所有视频都存在
            } else if ((!SpDIf.shipCamheadUrl || SpDIf.shipCamheadUrl === "") &&
            (!SpDIf.shipCamcabinUrl || SpDIf.shipCamcabinUrl === "") && (!SpDIf.shipCamtailUrl || SpDIf.shipCamtailUrl === "")) {
              this.runShipNoV.push(SpDIf) // 运行中且所有视频都不存在
            } else if ((SpDIf.shipCamheadUrl && SpDIf.shipCamheadUrl !== "") &&
            (SpDIf.shipCamcabinUrl && SpDIf.shipCamcabinUrl !== "") && (!SpDIf.shipCamtailUrl || SpDIf.shipCamtailUrl === "")) {
              this.runShipTwoV.push(SpDIf) // 运行中且独没有尾视频
            } else if ((SpDIf.shipCamheadUrl && SpDIf.shipCamheadUrl !== "") &&
            (!SpDIf.shipCamcabinUrl || SpDIf.shipCamcabinUrl === "") && (SpDIf.shipCamtailUrl && SpDIf.shipCamtailUrl !== "")) {
              this.runShipTwoV.push(SpDIf) // 运行中且独没有中视频
            } else if ((!SpDIf.shipCamheadUrl || SpDIf.shipCamheadUrl === "") &&
            (SpDIf.shipCamcabinUrl && SpDIf.shipCamcabinUrl !== "") && (SpDIf.shipCamtailUrl && SpDIf.shipCamtailUrl !== "")) {
              this.runShipTwoV.push(SpDIf) // 运行中且独没有头视频
            } else {
              this.runShipOneV.push(SpDIf) // 运行中且只有一个视频存在
            }
          } else {
            this.norunShipV.push(SpDIf) // 未运行
          }
        })(i)
      }
    }
  }
}
</script>

<style scoped>
.fz-video{
  padding: 0 2px;
}
</style>
