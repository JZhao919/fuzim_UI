<template>
<div id="oneship">
<el-row>
  <div id="shiplist">
    <el-scrollbar noresize style="height:100%">
      <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId" :class="{ shipNoRun: shipdef.shipStatus=='0' }"
      type="text" plain size="mini"
      @click.native="submit(shipdef)">
      {{shipdef.shipName}}
      </el-button>
    </el-scrollbar>
  </div>
</el-row>
<el-row>
  <el-col :xs="24" :sm="16" :md="18" :lg="18">
    <mapCard :shipInfo="markerInfo"></mapCard>
  </el-col>
  <el-col :xs="24" :sm="8" :md="6" :lg="6">
    <div id="defcard" class="oneshipinfocard">
      <el-collapse value= 1 >
        <el-collapse-item name="1">
          <template slot="title">{{shipDefInfo.shipName}}基本信息</template>
          <div class="oneshipinfocard-con">
            <div><span>船只名称：</span><span>{{shipDefInfo.shipName}}</span></div>
            <div><span>使用情况：</span><span v-if='shipDefInfo.shipStatus === "0"' key="run">正在使用</span>
            <span v-else-if='shipDefInfo.shipStatus === "1"' key="run">不能使用</span>
            <span v-else key="no">未知</span></div>
            <div><span>船只描述：</span>{{shipDefInfo.shipNote}}</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
</el-row>
<el-row>
  <el-col :xs="24" :sm="12" :md="8" :lg="8">
    <div class="oneshipinfocard">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">{{shipAllInfo.shipName}}状态信息</template>
          <div class="oneshipinfocard-con">
            <div>船只进出次数：<span>{{shipAllInfo.ioTimes}}</span></div>
            <div>船只运行状态：
              <span v-if="shipAllInfo.runStatus === '0'" key="runing" class="runing">正在行驶</span>
              <span v-else-if="shipAllInfo.runStatus === '1'" key="runwait">暂停行驶</span>
              <span v-else-if="shipAllInfo.runStatus === '2'" key="noruning">停在码头</span>
              <span v-else key="norun">...</span></div>
            <div>是否等待会船：
              <span v-if="shipAllInfo.wait === '1'" key="waiting" class="waiting">等待会船.</span>
              <span v-else key="nowait">不需会船.</span></div>
            <div>上次离岸时间：<span>{{shipAllInfo.startRunTime}}</span></div>
            <div>上次靠岸时间：<span>{{shipAllInfo.endRunTime}}</span></div>
            <div>船只运行时间：<span>{{shipAllInfo.runTime}}</span></div>
            <div>船只运行速度：<span>{{shipAllInfo.speed}}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
      </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="8" :lg="8">
    <div class="oneshipinfocard">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">{{shipAllInfo.shipName}}警告信息</template>
          <div class="oneshipinfocard-con">
            <div>是否超速：<span v-if="shipAllInfo.overSpeed === '1'" key="wait" class="waring">是</span><span v-else key="nwait">否</span></div>
            <div>碰撞危险：<span v-if="shipAllInfo.collide === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
            <div>超声距离：<span>{{shipAllInfo.ultrasonicValue}}</span></div>
            <div>漏水危险：<span v-if="shipAllInfo.leakage === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
            <div>烟雾危险：<span v-if="shipAllInfo.overSmog === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
            <div>火光危险：<span v-if="shipAllInfo.overFire === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
            <div>电机危险：<span v-if="shipAllInfo.overMotor === '1'" key="wait" class="waring">是</span><span v-else key="nwait">否</span></div>
            <div>电池危险：<span v-if="shipAllInfo.batteryStatus === '1'" key="wait" class="waring">是</span><span v-else key="nwait">否</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="8" :lg="8">
    <div class="oneshipinfocard">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">{{shipAllInfo.shipName}}GPS信息</template>
          <div class="oneshipinfocard-con">
            <div>GPS时间：<span>{{shipAllInfo.gpsTime}}</span></div>
            <div>GPS经度：<span>{{shipAllInfo.gpsLondir}}：{{shipAllInfo.longitude}}</span></div>
            <div>GPS纬度：<span>{{shipAllInfo.gpsLatdir}}：{{shipAllInfo.latitude}}</span></div>
            <div>地磁偏角：<span>{{shipAllInfo.gpsVardir}}：{{shipAllInfo.gpsMagvar}}</span></div>
            <div>地航向角：<span>{{shipAllInfo.gpsTrackTure}}</span></div>
            <div>工作模式：<span>{{shipAllInfo.gpsModeInd}}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="8" :lg="8">
    <div class="oneshipinfocard">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">{{shipAllInfo.shipName}}电池信息</template>
          <div class="oneshipinfocard-con">
            <div><span>集总SOC：</span><span>{{shipAllInfo.batterySOC}}</span></div>
            <div><span>总电压值：</span><span>{{shipAllInfo.batteryTotalVolt}}</span></div>
            <div><span>总电流值：</span><span>{{shipAllInfo.batteryTotalCurr}}</span></div>
            <div><span>正电阻值：</span><span>{{shipAllInfo.batteryTotalRP}}</span></div>
            <div><span>负电阻值：</span><span>{{shipAllInfo.batteryTotalRN}}</span></div>
            <div><span>高电压序号：</span><span>{{shipAllInfo.batteryMaxVoltSN}}</span></div>
            <div><span>高电压值：</span><span>{{shipAllInfo.batteryMaxVolt}}</span></div>
            <div><span>低电压序号：</span><span>{{shipAllInfo.batteryMinVoltSN}}</span></div>
            <div><span>低电压值：</span><span>{{shipAllInfo.batteryMinVolt}}</span></div>
            <div><span>高温度序号：</span><span>{{shipAllInfo.batteryMaxTEMPSN}}</span></div>
            <div><span>高温度值：</span><span>{{shipAllInfo.batteryMaxTEMP}}</span></div>
            <div><span>低温度序号：</span><span>{{shipAllInfo.batteryMinTEMPSN}}</span></div>
            <div><span>低温度值：</span><span>{{shipAllInfo.batteryMinTEMP}}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="8" :lg="8">
    <div class="oneshipinfocard">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">{{shipAllInfo.shipName}}电机信息</template>
          <div class="oneshipinfocard-con">
            <div>电机电流1：<span>{{shipAllInfo.motorCurrent1}}</span></div>
            <div>电机电流2：<span>{{shipAllInfo.motorCurrent2}}</span></div>
            <div>电机电压1：<span>{{shipAllInfo.motorVoltage1}}</span></div>
            <div>电机电压2：<span>{{shipAllInfo.motorVoltage2}}</span></div>
            <div>电机转速1：<span>{{shipAllInfo.motorSpeed1}}</span></div>
            <div>电机转速2：<span>{{shipAllInfo.motorSpeed2}}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="8" :lg="8">
    <div class="oneshipinfocard">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">{{shipAllInfo.shipName}}雷达信息</template>
          <div class="oneshipinfocard-con">
            <div><span>雷达距离：</span><span>{{shipAllInfo.radarRange}}</span></div>
            <div><span>雷达速度：</span><span>{{shipAllInfo.radarAzimuth}}</span></div>
            <div><span>雷达方位角：</span><span>{{shipAllInfo.radarVerl}}</span></div>
            <div><span>雷达信噪比：</span><span>{{shipAllInfo.radarSNR}}</span></div>
            <div><span>硬件保留：</span><span>{{shipAllInfo.hardware}}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-col>
</el-row>
</div>
</template>
<script>
import mapCard from './map'
import { getAllShipDefInfo, getOneShipInfo } from '@/api/shipinfo'
import { clearTracks } from './oneshiptrack.js'
export default {
  name: 'dashboard',
  components: {
    mapCard
  },
  mounted() {
    this.init()
  },
  destroyed() {
    if (window.Timer !== null) {
      clearInterval(window.Timer)
      window.Timer = null
    }
  },
  data() {
    return {
      shipId: null, // 当前选择的船只
      shipDefInfo: { // 当前船只的定义信息
        shipId: 0,
        shipName: '',
        shipNote: '',
        shipStatus: ''
      },
      allshipDefInfo: [], // 所有船只定义信息
      shipNoneInfo: {
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
      }, // 默认船只的所有信息
      shipAllInfo: {
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
      } // 当前船只的所有信息
    }
  },
  computed: {
    markerInfo: function() {
      return {
        shipName: this.shipAllInfo.shipName,
        gpsTime: this.shipAllInfo.gpsTime,
        runStatus: this.shipAllInfo.runStatus,
        longitude: this.shipAllInfo.longitude,
        latitude: this.shipAllInfo.latitude
      }
    }
  },
  methods: {
    messages(code, string) {
      switch (code) {
        case 1:
          this.$message({
            message: string,
            type: 'success',
            duration: 1500,
            showClose: true
          })
          break
        case 0:
          this.$message({
            message: string,
            type: 'error',
            duration: 1500,
            showClose: true
          })
          break
        case 2:
          this.$message({
            message: string,
            type: 'warning',
            duration: 1500,
            showClose: true
          })
          break
        case 3:
          this.$message({
            message: string,
            type: 'info',
            duration: 1500,
            showClose: true
          })
          break
        default:
      }
    },
    init() {
      this.shipAllInfo = this.shipNoneInfo
      getAllShipDefInfo().then(response => {
        const data = response.data
        if (data === [] || !data || data === null || data === "") {
          this.messages(2, '数据库中没有船只信息！')
          this.allshipDefInfo = {}
        } else {
          this.allshipDefInfo = data
        }
      })
      return
    },
    submit(shipdef) {
      this.shipId = shipdef.shipId
      this.shipDefInfo = shipdef
      clearTracks()
      getOneShipInfo(this.shipId).then(response => {
        const data = response.data
        if (!data || data === null || data.length <= 0) {
          this.shipAllInfo = this.shipNoneInfo
          this.messages(2, '该船当前没有详细数据！')
        } else {
          this.shipAllInfo = data
        }
      })
      if (window.Timer !== null) {
        clearInterval(window.Timer)
        window.Timer = null
      }
      window.Timer = setInterval(this.loopGetOneShipInfo, 10000)
    },
    loopGetOneShipInfo() {
      if (this.shipId === null || !this.shipId) {
        return
      } else {
        getOneShipInfo(this.shipId).then(response => {
          const data = response.data
          if (!data || data === null || data.length <= 0) {
            this.shipAllInfo = this.shipNoneInfo
          } else {
            this.shipAllInfo = data
            console.log(this.shipId)
          }
        })
      }
    }
  }
}
</script>
<style>
#oneship {
  border: 0;
  padding: 5px;
  color: #303133;
}
/* 船只列表信息卡 */
#shiplist {
  padding:5px;
  width: 100%;
  height: 100px;
  border: 2px solid #b6b6b6;
  border-radius: 1px;
}
#shiplist .el-scrollbar__wrap{
  overflow-x:hidden;
  overflow-y: auto;
}
#shiplist .el-button{
  margin: 3px;
  padding: 3px;
  font-size: 13px;
  border-radius: 1px;
}
#shiplist .el-button:hover{
  margin: 3px;
  padding: 3px;
  color: #0000ff;
  font-size: 15px;
  border-color:#ff0000;
  border-radius: 1px;
}
#shiplist .el-button:active{
  margin: 3px;
  padding: 3px;
  color: #0000ff;
  font-size: 16px;
  border-color:#ff0000;
  border-radius: 1px;
}
#shiplist .el-button:focus{
  margin: 3px;
  padding: 3px;
  color: #0000ff;
  font-size: 16px;
  border-color:#ff0000;
  border-radius: 1px;
}
#shiplist .el-button--text{
  color: black;
  background: 0 0;
}

/* 船只定义信息卡 */
#defcard .el-collapse-item__content {
  height: 440px;
}

/* 船只运行信息卡 */
.oneshipinfocard {
  padding: 5px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
.oneshipinfocard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
.oneshipinfocard .el-collapse-item__arrow {
  line-height: 30px;
}
.oneshipinfocard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
.oneshipinfocard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}
.oneshipinfocard-con div {
  padding: 0.5rem 0 0 1rem;
}
</style>

