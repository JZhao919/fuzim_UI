 /* eslint-disable */
<template>
  <el-row>
    <el-col :span="24">
      <el-card id="fz-map" class="fz-box"></el-card>
    </el-col>
  </el-row>
</template>

<script>
import { initmap, transcode } from './map.js'
import { getAllShipInfo } from '@/api/shipinfo'
export default {
  name: 'mapmake',
  data() {
    return {
      allShipInfo: [{
        // 状态信息
        shipId: 0,
        ioTimes: 0,
        runStatus: '',
        startRunTime: 0,
        endRunTime: 0,
        runTime: 0,
        wait: '',
        speed: 0,
        // 警告信息
        overSpeed: "",
        collide: "",
        ultrasonicValue: "0|0",
        leakage: "",
        overSmog: "",
        overFire: "",
        overMotor: "",
        batteryStatus: "",
        // GPS信息
        gpsTime: 0,
        gpsLondir: "",
        longitude: 0,
        gpsLatdir: "",
        latitude: 0,
        gpsVardir: "",
        gpsMagvar: 0.0,
        gpsTrackTure: 0,
        gpsModeInd: "",
        // 电池信息
        batterySOC: "",
        batteryTotalVolt: "",
        batteryTotalCurr: "",
        batteryTotalRP: "",
        batteryTotalRN: "",
        batteryMaxVoltSN: "",
        batteryMaxVolt: "",
        batteryMinVoltSN: "",
        batteryMinVolt: "",
        batteryMaxTEMPSN: "",
        batteryMaxTEMP: "",
        batteryMinTEMPSN: "",
        batteryMinTEMP: "",
        // 电机与雷达
        radarRange: "",
        radarAzimuth: "",
        radarVerl: "",
        radarSNR: "",
        hardware: "空",
        motorCurrent1: 0,
        motorVoltage1: 0,
        motorSpeed1: 0,
        motorCurrent2: 0,
        motorVoltage2: 0,
        motorSpeed2: 0
      }] // 所有船只全部信息
    }
  },
  mounted() {
    initmap()
    this.getAndMake()
  },
  methods: {
    // 消息通知函数
    notification(code, string) {
      switch (code) {
        case 0:
          this.$notify.error({
            title: '错误！',
            message: string
          })
          break
        case 1:
          this.$notify({
            title: '成功！',
            message: string,
            type: 'success'
          })
          break
        case 2:
          this.$notify({
            title: '注意！',
            message: string,
            type: 'warning'
          })
          break
        default:
      }
    },
    // 获取远程数据并标点
    getAndMake() {
      const _this = this
      getAllShipInfo().then(response => {
        const data = this.allShipInfo = response.data
        if (data === [] || !data || data === null || data.length <= 0) {
          _this.notification(2, "数据库中没有船只数据！")
        } else {
          _this.notification(1, "成功获取所有船只数据！")
          _this.allShipInfo = data
          transcode(_this.allShipInfo)
        }
      }).catch(errer => {
        _this.notification(0, errer)
      })
    }
  }
}
</script>

<style scoped>
  .fz-box {
    display: -webkit-flex;
    display: flex;
    flex-direction: column; /*主轴为纵轴*/
    justify-content:flex-start; /*主轴自上而下*/
    align-content: center; /*交叉轴中心对其*/
    margin: 2px;
    border: solid 2px #f7f7f7;
    padding: 0px;
    height: 710px;
    text-align: center;
    font-size: 80%;
    color: #606266
  };

</style>
