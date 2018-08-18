 /* eslint-disable */
<template>
  <el-row>
    <el-col :span="24">
      <el-card id="fz-map" class="fz-box">
        
      </el-card>
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
      allShipInfo: [
        {
          // 状态信息
          'shipId': 1,
          'ioTimes': 1,
          'runStatus': '1',
          'startRunTime': 20180114123456,
          'endRunTime': 20180114133456,
          'runTime': 3600,
          'wait': '0',
          'speed': 0.604,
          // 警告信息
          "overSpeed": "0",
          "collide": "0",
          "ultrasonicValue": "1000|999",
          "leakage": "0",
          "overSmog": "0",
          "overFire": "0",
          "overMotor": "0",
          "batteryStatus": "0",
          // GPS信息
          "gpsTime": 20180114133458,
          "gpsLondir": "E",
          "longitude": 11843.85207,
          "gpsLatdir": "N",
          "latitude": 3202.26643,
          "gpsVardir": "E",
          "gpsMagvar": 0.0,
          "gpsTrackTure": 108.5,
          "gpsModeInd": "A",
          // 电池信息
          "batterySOC": "0",
          "batteryTotalVolt": "0",
          "batteryTotalCurr": "0",
          "batteryTotalRP": "0",
          "batteryTotalRN": "0",
          "batteryMaxVoltSN": "0",
          "batteryMaxVolt": "0",
          "batteryMinVoltSN": "0",
          "batteryMinVolt": "0",
          "batteryMaxTEMPSN": "0",
          "batteryMaxTEMP": "0",
          "batteryMinTEMPSN": "0",
          "batteryMinTEMP": "0",
          // 电机与雷达
          "radarRange": "20",
          "radarAzimuth": "30",
          "radarVerl": "2",
          "radarSNR": "60",
          "motorCurrent1": 5,
          "motorVoltage1": 24,
          "motorSpeed1": 3000,
          "motorCurrent2": 5,
          "motorVoltage2": 24,
          "motorSpeed2": 3000,
          "hardware": "note01"
        }
      ] // 所有船只全部信息
    }
  },
  mounted() {
    initmap()
    this.getAndMake()
  },
  methods: {
    // 消息通知函数
    notification(index) {
      switch (index) {
        case 1:
          this.$notify({
            title: '成功！',
            message: '成功获取远程数据！',
            type: 'success'
          })
          break
        case 2:
          this.$notify.error({
            title: '成功！',
            message: '服务器数据量为空！',
            type: 'warning'
          })
          break
        case 3:
          this.$notify.error({
            title: '超时错误！',
            message: '获取远程数据失败！'
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
        if (data && data.length > 0) {
          _this.notification(1)
          transcode(_this.allShipInfo)
        } else {
          _this.notification(2)
        }
      }).catch(errer => {
        _this.notification(3)
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
