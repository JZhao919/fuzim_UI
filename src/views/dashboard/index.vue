<template>
<div id="dashboard">
  <el-collapse id="db-coll">
    <el-collapse-item title="选择船只" name="1">
      <div class="coll-shipdef">
        <el-scrollbar id="sd-scrollbar" noresize style="height:100%">
          <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId"
          type="text" plain size="mini" 
          @click.native="submit(shipdef.shipId)">
          {{shipdef.shipName}}
          </el-button>
        </el-scrollbar>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div id="db-info">
    <el-row>
      <el-col :xs="24" :sm="24" :md="16" :lg="12">
        <mapCard :shipInfo="shipAllInfo"></mapCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">   
        <defCard :shipInfo="shipDefInfo"></defCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <statusCard :shipInfo="shipAllInfo"></statusCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4">
        <warnCard :shipInfo="shipAllInfo"></warnCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="5">
        <GPSCard :shipInfo="shipAllInfo"></GPSCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="5">
        <batteryCard :shipInfo="shipAllInfo"></batteryCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="5">
        <motorCard :shipInfo="shipAllInfo"></motorCard>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="5">
        <radarCard :shipInfo="shipAllInfo"></radarCard>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import { defCard, statusCard, warnCard, GPSCard, batteryCard, motorCard, radarCard, mapCard } from './cards'
import { getAllShipDefInfo, getOneShipInfo } from '@/api/shipinfo'
export default {
  name: 'dashboard',
  components: {
    defCard,
    statusCard,
    warnCard,
    GPSCard,
    batteryCard,
    motorCard,
    radarCard,
    mapCard
  },
  mounted() {
    this.getInfo()
  },
  data() {
    return {
      shipDefInfo: {
        shipId: 0,
        shipName: '',
        shipNote: '',
        shipStatus: ''
      }, // 当前船只的基本信息
      allshipDefInfo: [], // 所有船只基本信息
      shipAllInfo: {
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
      } // 当前船只的所有信息
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
    },
    getInfo() {
      getAllShipDefInfo().then(response => {
        const data = response.data
        if (data !== []) {
          this.allshipDefInfo = data
          return
        } else {
          this.notification(2, '数据库中没有船只信息！')
          return
        }
      })
      return
    },
    submit(shipId) {
      for (let i = 0; i < this.allshipDefInfo.length; i++) {
        ((n) => {
          if (this.allshipDefInfo[n].shipId === shipId) {
            this.shipDefInfo = this.allshipDefInfo[n]
            this.break
          }
        })(i)
      }
      getOneShipInfo(shipId).then(response => {
        const data = response.data
        if (data !== '') {
          this.shipAllInfo = data
          this.notification(1, '成功获取该船当前数据！')
          return
        } else {
          this.notification(2, '该船当前没有数据！')
          return
        }
      })
      return
    }
  }
}
</script>
<style>
#db-coll .el-collapse-item__header{
  background-color: #37445817;
  border: 0;
  padding-left: 10px; 
  height: 30px;
  font-size: 13px;
  text-align: left;
  color: #000000;
  line-height: 30px;
}
#db-coll .el-collapse-item__arrow{
  line-height: 30px;
}
#db-coll .el-collapse-item__wrap {
  border: 0;
  background-color: #ffffff88;
}
#db-coll .el-collapse-item__content {
  border: 0;
  padding: 0;
  font-size: 13px;
  color: #ffffff;
}
#coll-shipdef .el-scrollbar__wrap{
  overflow-x:auto;
}
#coll-shipdef .el-button--mini{
  margin: 3px;
  padding: 2px 2px;
  color: #1570f8b6;
}
#sd-scrollbar .el-button+.el-button{
  margin: 0 10px 0 0;
}
</style>
<style scoped>
  #dashboard{
    border: 0;
    background-color: #eff0f4;
    padding: 10px;
  }
  #db-coll{
    position: absolute;
    z-index: 2;
    margin: 10px 0px 0px 10px;
    width: 35%;
    height: auto;
    background-color: #37445817;
  }
  #db-coll .coll-shipdef{
    height: 300px;
  }
</style>
