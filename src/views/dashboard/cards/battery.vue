<template>
  <div id="battery-card">
    <div class="battery-title">{{shipInfo.shipId}}号船电池信息</div>
    <div id="battery-info" class="battery-content">
        <div><span>集总SOC：</span><span>{{shipInfo.batterySOC}}</span></div>
        <div><span>总电压值：</span><span>{{shipInfo.batteryTotalVolt}}</span></div>
        <div><span>总电流值：</span><span>{{shipInfo.batteryTotalCurr}}</span></div>
        <div><span>正电阻值：</span><span>{{shipInfo.batteryTotalRP}}</span></div>
        <div><span>负电阻值：</span><span>{{shipInfo.batteryTotalRN}}</span></div>
        <div><span>高电压序号：</span><span>{{shipInfo.batteryMaxVoltSN}}</span></div>
        <div><span>高电压值：</span><span>{{shipInfo.batteryMaxVolt}}</span></div>
        <div><span>低电压序号：</span><span>{{shipInfo.batteryMinVoltSN}}</span></div>
        <div><span>低电压值：</span><span>{{shipInfo.batteryMinVolt}}</span></div>
        <div><span>高温度序号：</span><span>{{shipInfo.batteryMaxTEMPSN}}</span></div>
        <div><span>高温度值：</span><span>{{shipInfo.batteryMaxTEMP}}</span></div>
        <div><span>低温度序号：</span><span>{{shipInfo.batteryMinTEMPSN}}</span></div>
        <div><span>低温度值：</span><span>{{shipInfo.batteryMinTEMP}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'battery-card',
  props: {
    shipInfo: {
      shipId: 0,
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
      batteryMinTEMP: ""
    }
  }
}
</script>
<style scoped>
#battery-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#battery-card .battery-title{
  padding: 6px 10px;
  background-color: #37445817;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#battery-card .battery-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: black;
}
.battery-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
