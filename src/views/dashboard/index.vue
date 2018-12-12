<template>
<div>
  <el-row>
    <el-col :span="24">
      <el-card id="makemap"></el-card>
    </el-col>
  </el-row>
  <div id="infoWindows">
    <p style="color: #ff0000;">等待出发: {{infoWindows.waitNums}} 艘</p>
    <p style="color: #3ebb00;">正在运行: {{infoWindows.runNums}} 艘</p>
    <p style="color: #000000;">暂停使用: {{infoWindows.norunNums}} 艘</p>
  </div>
</div>
</template>
<script>
import { dateToInt, intToDate } from '@/utils/times'
import { getAllShipInfo } from '@/api/shipinfo'
import { initmap, upDataMarker, clearAllMarker } from './mapmake.js'
let nowdatetime = new Date() // 当前的日期与时间当前刷新时间
export default {
  name: 'mapmake',
  data() {
    return {
      infoWindows: {
        runNums: 0, // 运行中数量
        norunNums: 0, // 暂停使用数量
        waitNums: 0 // 等待出发数量
      },
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
    this.getAllInfo()
  },
  destroyed() {
    if (window.Timer) {
      clearInterval(window.Timer)
      window.Timer = null
    } // 清除定时器
    clearAllMarker() // 清除标记点
  },
  watch: {
    allShipAllInfo: function() {
      upDataMarker(this.allShipAllInfo, dateToInt(nowdatetime))
    }
  },
  methods: {
    // 消息通知函数
    notification(code, string) {
      switch (code) {
        case 0:
          this.$notify.error({
            title: '错误！',
            message: string,
            duration: 1000
          })
          break
        case 1:
          this.$notify({
            title: '成功！',
            message: string,
            type: 'success',
            duration: 1000
          })
          break
        case 2:
          this.$notify({
            title: '注意！',
            message: string,
            type: 'warning',
            duration: 1000
          })
          break
        default:
      }
    },
    // 获取远程数据
    getAllInfo() {
      nowdatetime = new Date() // 重置当前刷新时间
      getAllShipInfo().then(response => {
        const data = this.allShipAllInfo = response.data
        if (!data || data === null || data.length <= 0) {
          this.notification(2, "数据库中没有船只数据！")
        } else {
          // this.notification(1, "成功获取所有船只数据！")
          this.allShipAllInfo = data
          this.counts()
          if (window.Timer) {
            clearInterval(window.Timer)
            window.Timer = null
          }
          window.Timer = setInterval(this.loopGetAllShipInfo, 20000)
        }
      })
    },
    // 循环获取远程数据
    loopGetAllShipInfo() {
      nowdatetime = dateToInt(new Date()) // 重置当前刷新时间
      getAllShipInfo().then(response => {
        const data = this.allShipAllInfo = response.data
        if (!data || data === null || data.length <= 0) {
          return
        } else {
          this.allShipAllInfo = data
          this.counts()
          console.log('mapMaker')
        }
      })
    },
    // 船只状态计数函数
    counts() {
      let shipInfo
      let runNums = 0 // 运行状态计数
      let waitNums = 0 // 等待状态计数
      let norunNums = 0 // 暂停使用计数
      for (let i = 0; i < this.allShipAllInfo.length; i++) {
        shipInfo = this.allShipAllInfo[i]
        if (!shipInfo.gpsTime || shipInfo.gpsTime === "" || shipInfo.gpsTime === "0") {
          norunNums++
        } else if (intToDate(nowdatetime).getTime() - intToDate(shipInfo.gpsTime).getTime() > 1800000) { // 超过半小时
          norunNums++
        } else {
          switch (shipInfo.runStatus) { // 半小时之内的GPS状态
            case '0':
              runNums++
              break
            case '1':
              runNums++
              break
            case '2':
              runNums++
              break
            case '3':
              waitNums++
              break
            default:
              norunNums++
              break
          }
        }
      }
      this.infoWindows.runNums = runNums
      this.infoWindows.waitNums = waitNums
      this.infoWindows.norunNums = norunNums
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
    height: 55rem;
    text-align: center;
    font-size: 80%;
    color: #606266
  }
  #infoWindows {
    position: absolute;
    right: 15px;
    top: 15px;
    border: 1px solid #606266;
    padding: 5px;
    background-color: #f7f7f7;
    color: #6d6b6b;
  }
  #infoWindows p {
    margin: 2px 2px 2px 2px;
  }
  .amap-marker-label {
    position: absolute;
    z-index: 2;
    border: 1px solid #0a0a0a85;
    background-color: #f5f5f570;
    white-space: nowrap;
    cursor: default;
    padding: 3px;
    font-size: 11px;
    line-height: 12px;
    color: black;
  }
</style>
