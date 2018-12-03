<template>
  <el-row>
    <el-col :span="24">
      <el-card id="makemap"></el-card>
    </el-col>
  </el-row>
</template>
<script>
import { initmap, upDataMarker, clearAllMarker } from './mapmake.js'
import { getAllShipInfo } from '@/api/shipinfo'
export default {
  name: 'mapmake',
  data() {
    return {
      allShipAllInfo: [{
        // 状态信息
        shipId: 0,
        shipName: '123',
        ioTimes: 0,
        runStatus: '0',
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
    this.init()
  },
  destroyed() {
    if (window.Timer) {
      clearInterval(window.Timer)
      window.Timer = null
    }
    clearAllMarker()
  },
  watch: {
    allShipAllInfo: function() {
      upDataMarker(this.allShipAllInfo)
    }
  },
  methods: {
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
    }, // 消息通知函数
    // 获取远程数据
    init() {
      getAllShipInfo().then(response => {
        const data = this.allShipAllInfo = response.data
        if (data === [] || !data || data === null || data.length <= 0) {
          this.notification(2, "数据库中没有船只数据！")
        } else {
          this.notification(1, "成功获取所有船只数据！")
          this.allShipAllInfo = data
          if (window.Timer) {
            clearInterval(window.Timer)
            window.Timer = null
          }
          window.Timer = setInterval(this.loopGetAllShipInfo, 20000)
        }
      })
    },
    loopGetAllShipInfo() {
      getAllShipInfo().then(response => {
        const data = this.allShipAllInfo = response.data
        if (data === [] || !data || data === null || data.length <= 0) {
          return
        } else {
          this.allShipAllInfo = data
          console.log('mapMaker')
        }
      })
    }
  }
}
</script>

<style>
  #makemap{
    display: -webkit-flex;
    display: flex;
    flex-direction: column; /*主轴为纵轴*/
    justify-content:flex-start; /*主轴自上而下*/
    align-content: center; /*交叉轴中心对其*/
    margin: 2px;
    border: solid 2px #f7f7f7;
    padding: 0px;
    height: 907px;
    text-align: center;
    font-size: 80%;
    color: #606266
  };

</style>
