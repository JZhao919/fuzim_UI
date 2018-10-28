<template>
<div id="dashboard">
  <el-row id="shiplist">
    <el-collapse id="spl-coll">
      <el-collapse-item title="点击打开船只选择列表" name="1">
        <div id="splcollcontent">
          <el-scrollbar noresize style="height:100%">
            <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId" :class="{ shipListRun: shipdef.shipStatus=='1' }"
            type="text" plain size="mini"
            @click.native="submit(shipdef.shipId)">
            {{shipdef.shipName}}
            </el-button>
          </el-scrollbar>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-row>
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
    this.shipAllInfo = this.shipNoneInfo
    this.getInfo()
  },
  data() {
    return {
      shipId: 0, // 当前船只的编号
      shipDefInfo: {
        shipId: 0,
        shipName: '',
        shipNote: '',
        shipStatus: ''
      }, // 当前船只的定义信息
      allshipDefInfo: [], // 所有船只定义信息
      shipNoneInfo: {
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
      }, // 默认船只的所有信息
      shipAllInfo: {
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
        if (data === [] || !data || data === null || data === "") {
          this.notification(2, '数据库中没有船只信息！')
          this.shipAllInfo = {}
          return
        } else {
          this.allshipDefInfo = data
          return
        }
      })
      return
    },
    submit(shipId) {
      this.shipId = shipId
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
        if (data === [] || !data || data === null || data.length <= 0) {
          this.notification(2, '该船当前没有详细数据！')
          this.shipAllInfo = this.shipNoneInfo
          return
        } else {
          this.shipAllInfo = data
          this.notification(1, '成功获取该船当前数据！')
          return
        }
      })
      return
    }
  }
}
</script>
<style>
#dashboard {
  border: 0;
  padding: 5px;
  color: #303133;
}
#shiplist {
  padding:10px;
  width: 100%;
  height: auto;
}
#spl-coll {
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#spl-coll .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#spl-coll .el-collapse-item__arrow{
  line-height: 30px;
}
#spl-coll .el-collapse-item__wrap {
  border: 0;
  background-color: #ffffff;
}
#spl-coll .el-collapse-item__content {
  border: 0;
  padding: 0;
  font-size: 13px;
  color: #ffffff;
}

#splcollcontent {
  height: 200px;
}
#splcollcontent .el-scrollbar__wrap{
  overflow-x:hidden;
  overflow-y: auto;
}
#splcollcontent .el-button--mini{
  margin: 4px;
  padding: 4px;
  font-size: 13px;
  border-radius: 1px;
}
#splcollcontent .el-button--text{
  color: #303133;
  background: 0 0;
}
#splcollcontent .shipListRun {
  color: #00ff0d;
}
</style>
