<template>
<div id="fz-detail">
  <el-tabs v-model="activeName" type="border-card" tab-position="top">
    <el-tab-pane label="全部" name="all">
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column label="次数" prop="ioTimes" align="center" sortable></el-table-column>
        <el-table-column label="运行" prop="runStatus" align="center" sortable></el-table-column>
        <el-table-column label="运行时间" prop="runTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="会船" prop="wait" align="center" sortable></el-table-column>
        <el-table-column label="船速" prop="speed" align="center"></el-table-column>
        <el-table-column label="超速" prop="overSpeed" align="center" sortable></el-table-column>
        <el-table-column label="经度" prop="longitude" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="纬度" prop="latitude" align="center" show-overflow-tooltip></el-table-column>   
        <el-table-column label="撞船" prop="collide" align="center" sortable></el-table-column>
        <el-table-column label="船距" prop="ultrasonicValue" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="漏水" prop="leakage" align="center" sortable></el-table-column>
        <el-table-column label="烟雾" prop="overSmog" align="center" sortable></el-table-column>
        <el-table-column label="火光" prop="overFire" align="center" sortable></el-table-column>
        <el-table-column label="电机" prop="overMotor" align="center" sortable></el-table-column>
        <el-table-column label="电池" prop="batteryStatus" align="center" sortable></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="状态信息" name="status" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column label="出行次数" prop="ioTimes" align="center" sortable></el-table-column>
        <el-table-column label="是否运行" prop="runStatus" align="center" sortable></el-table-column>
        <el-table-column label="会船等待" prop="wait" align="center" sortable></el-table-column>
        <el-table-column label="船速" prop="speed" align="center"></el-table-column>
        <el-table-column label="上次开启时间" prop="startRunTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="上次结束时间" prop="endRunTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="运行时间" prop="runTime" align="center" sortable></el-table-column>
        
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="警告信息" name="warning" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column label="超速" prop="overSpeed" align="center" sortable></el-table-column>
        <el-table-column label="撞船" prop="collide" align="center" sortable></el-table-column>
        <el-table-column label="最小船距" prop="ultrasonicValue" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="漏水" prop="leakage" align="center" sortable></el-table-column>
        <el-table-column label="烟雾" prop="overSmog" align="center" sortable></el-table-column>
        <el-table-column label="火光" prop="overFire" align="center" sortable></el-table-column>
        <el-table-column label="电机" prop="overMotor" align="center" sortable></el-table-column>
        <el-table-column label="电池" prop="batteryStatus" align="center" sortable></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="GPS信息" name="GPS" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="时间" prop="gpsTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="经度方向" prop="gpsLondir" align="center"></el-table-column>
        <el-table-column label="经度" prop="longitude" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="纬度方向" prop="gpsLatdir" align="center"></el-table-column>
        <el-table-column label="纬度" prop="latitude" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="磁偏角方向" prop="gpsVardir" align="center"></el-table-column>
        <el-table-column label="磁偏角" prop="gpsMagvar" align="center"></el-table-column>
        <el-table-column label="航向角" prop="gpsTrackTure" align="center" sortable></el-table-column>
        <el-table-column label="模式" prop="gpsModeInd" align="center"></el-table-column> 
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="电池信息" name="battery" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column label="SOC" prop="batterySOC" align="center"></el-table-column>
        <el-table-column label="总电压" prop="batteryTotalVolt" align="center" sortable></el-table-column>
        <el-table-column label="总电流" prop="batteryTotalCurr" align="center" sortable></el-table-column>
        <el-table-column label="正电阻" prop="batteryTotalRP" align="center" sortable></el-table-column>
        <el-table-column label="负电阻" prop="batteryTotalRN" align="center" sortable></el-table-column>
        <el-table-column label="最高电压序列号" prop="batteryMaxVoltSN" align="center"></el-table-column>
        <el-table-column label="最高电压" prop="batteryMaxVolt" align="center" sortable></el-table-column>
        <el-table-column label="最低电压序列号" prop="batteryMinVoltSN" align="center"></el-table-column>
        <el-table-column label="最低电压" prop="batteryMinVolt" align="center" sortable></el-table-column>
        <el-table-column label="最高温度编号" prop="batteryMaxTEMPSN" align="center"></el-table-column>
        <el-table-column label="最高温度" prop="batteryMaxTEMP" align="center" sortable></el-table-column>
        <el-table-column label="最低温度编号" prop="batteryMinTEMPSN" align="center"></el-table-column>
        <el-table-column label="最低温度" prop="batteryMinTEMP" align="center" sortable></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="电机和雷达" name="motor" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column label="电流1" prop="motorCurrent1" align="center" sortable></el-table-column>
        <el-table-column label="电压1" prop="motorVoltage1" align="center" sortable></el-table-column>
        <el-table-column label="转速1" prop="motorSpeed1" align="center" sortable></el-table-column>
        <el-table-column label="电流2" prop="motorCurrent2" align="center" sortable></el-table-column>
        <el-table-column label="电压2" prop="motorVoltage2" align="center" sortable></el-table-column>
        <el-table-column label="转速2" prop="motorSpeed2" align="center" sortable></el-table-column>
        <el-table-column label="雷达距离" prop="radarRange" align="center"></el-table-column>
        <el-table-column label="方位角" prop="radarAzimuth" align="center"></el-table-column>
        <el-table-column label="雷达速度" prop="radarVerl" align="center"></el-table-column>
        <el-table-column label="信噪比" prop="radarSNR" align="center"></el-table-column>
        <el-table-column label="保留" prop="hardware" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { getAllShipInfo } from '@/api/shipinfo'
export default {
  name: "detail",
  data() {
    return {
      activeName: 'all',
      defaultSort: { prop: 'shipId', order: 'ascending' },
      allShipInfo: [
        {
          // 状态信息
          "shipId": 1,
          "ioTimes": 0,
          "runStatus": "0",
          "startRunTime": 0,
          "endRunTime": 0,
          "runTime": 0,
          "wait": "0",
          "speed": 0,
          // 警告信息
          "overSpeed": "0",
          "collide": "0",
          "ultrasonicValue": "0",
          "leakage": "0",
          "overSmog": "0",
          "overFire": "0",
          "overMotor": "0",
          "batteryStatus": "0",
          // GPS信息
          "gpsTime": 0,
          "gpsLondir": "E",
          "longitude": 0,
          "gpsLatdir": "N",
          "latitude": 0,
          "gpsVardir": "E",
          "gpsMagvar": 0.0,
          "gpsTrackTure": 0,
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
          "radarRange": "0",
          "radarAzimuth": "0",
          "radarVerl": "0",
          "radarSNR": "0",
          "motorCurrent1": 0,
          "motorVoltage1": 0,
          "motorSpeed1": 0,
          "motorCurrent2": 0,
          "motorVoltage2": 0,
          "motorSpeed2": 0,
          "hardware": "note01"
        }
      ] // 所有船只的全部信息
    }
  },
  mounted() {
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
    // 动态上色函数
    tableRowClassName({ row, index }) {
      if (row.overSmog === '1' || row.overFire === '1' || row.leakage === '1' || row.overMotor === '1') {
        return 'warn3-row' // 烟雾火光漏水电机警告
      } else if (row.collide === '1' || row.overSpeed === '1' || row.batteryStatus === '1') {
        return 'warn2-row' // 撞船超速电池警告
      } else if (row.wait === '1') {
        return 'warn1-row' // 会船提醒
      }
    },
    // 数据获取函数
    getAndMake() {
      const _this = this
      getAllShipInfo().then(response => {
        const data = response.data
        if (data && data.length > 0) {
          _this.notification(1)
          _this.allShipInfo = data
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

<style>
  .el-table .warn3-row {
      background-color: #ff9292ad;
      color: #ff0000;
  }
  .el-table .warn2-row {
      background-color: #f8f3aaad;
      color: #ff0000;
  }
  .el-table .warn1-row {
      background-color: #5897e9ad;
      color: #0000ff;
  }
</style>

<style scoped>
  #fz-detail{
    margin: 0;
    border: 1px;
    padding: 0px;
    width: 100%;
    height: auto;
  }
  
</style>

