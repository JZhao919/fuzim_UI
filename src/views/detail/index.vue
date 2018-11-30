<template>
<div id="fz-detail">
  <el-tabs v-model="activeName" type="border-card" tab-position="top">
    <el-tab-pane label="全部" name="all">
      <el-table max-height='52rem' border size="mini" fit style="width:100%" 
      :data="allShipAllInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="名称" prop="shipName" align="center"></el-table-column>
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
      <el-table max-height='52rem' border size="mini" fit style="width:100%" 
      :data="allShipAllInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="名称" prop="shipName" align="center"></el-table-column>
        <el-table-column label="出行次数" prop="ioTimes" align="center" sortable></el-table-column>
        <el-table-column label="是否运行" prop="runStatus" align="center" sortable></el-table-column>
        <el-table-column label="会船等待" prop="wait" align="center" sortable></el-table-column>
        <el-table-column label="船速" prop="speed" align="center"></el-table-column>
        <el-table-column label="上次开启时间" prop="startRunTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="上次结束时间" prop="endRunTime" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="运行时间" prop="runTime" align="center" sortable></el-table-column>
        
      </el-table>
    </el-tab-pane>
    <el-tab-pane max-height='52rem' label="警告信息" name="warning" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipAllInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="名称" prop="shipName" align="center"></el-table-column>
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
    <el-tab-pane max-height='52rem' label="GPS信息" name="GPS" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipAllInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="名称" prop="shipName" align="center"></el-table-column>
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
    <el-tab-pane max-height='52rem' label="电池信息" name="battery" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipAllInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="名称" prop="shipName" align="center"></el-table-column>
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
    <el-tab-pane max-height='52rem' label="电机和雷达" name="motor" lazy>
      <el-table border size="mini" fit style="width:100%" 
      :data="allShipAllInfo"
      :default-sort="defaultSort"
      :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="船号" prop="shipId" align="center" sortable></el-table-column>
        <el-table-column fixed label="名称" prop="shipName" align="center"></el-table-column>
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
  <p class="text">
    <span>注释： 白色表示：该船只正常；</span>
    <span style="background-color: #ff828277; color: #ff0000;">红色表示：可能有烟雾、着火、漏水、电机的危险；</span>
    <span style="background-color: #fff78877; color: #b1a500;">黄色表示：可能有撞船、超速、电池的危险；</span>
    <span style="background-color: #707df877; color: #0000ff;">蓝色表示：正在等待会船；</span>
  </p>
  <p class="text">报警级别：
      <span style="background-color: #ff828277; color: #ff0000;">红色</span> > 
      <span style="background-color: #fff78877; color: #b1a500;">黄色</span> > 
      <span style="background-color: #707df877; color: #0000ff;">蓝色</span>
  </p>
</div>
</template>
<script>
import { getAllShipInfo } from '@/api/shipinfo'
export default {
  name: "detail",
  mounted() {
    this.init()
  },
  destroyed() {
    if (window.Timer) {
      clearInterval(window.Timer)
      window.Timer = null
    }
  },
  data() {
    return {
      activeName: 'all',
      defaultSort: { prop: 'shipId', order: 'ascending' },
      allShipAllInfo: [{
        // 状态信息
        shipId: 0,
        shipName: '',
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
      }] // 所有船只的全部信息
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
    // 数据获取函数
    init() {
      getAllShipInfo().then(response => {
        const data = response.data
        if (data === [] || !data || data === null || data.length <= 0) {
          this.notification(2, "数据库中没有船只数据！")
        } else {
          this.allShipAllInfo = data
          this.notification(1, "成功获取所有船只数据！")
          if (window.Timer) {
            clearInterval(window.Timer)
            window.Timer = null
          }
          window.Timer = setInterval(this.loopGetAllShipInfo, 10000)
        }
      })
      return
    },
    loopGetAllShipInfo() {
      getAllShipInfo().then(response => {
        const data = response.data
        if (data === [] || !data || data === null || data.length <= 0) {
          return
        } else {
          this.allShipAllInfo = data
          console.log('*')
          return
        }
      })
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
    }
  }
}
</script>
<style>
#fz-detail{
  margin: 0;
  padding: 5px;
  width: 100%;
  height: auto;
}
#fz-detail .el-table {
  max-height: 54rem;
}
.el-table .warn3-row {
    background-color: #ff828277;
    color: #ff0000;
}
.el-table .warn2-row {
    background-color: #fff78877;
    color: #b1a500;
}
.el-table .warn1-row {
    background-color: #707df877;
    color: #0000ff;
}
#fz-detail .text {
  padding:2px; 
  color: #303133; 
  font-size: 13px; 
  text-align: left;
}
</style>

