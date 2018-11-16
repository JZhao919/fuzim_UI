<template>
<div id="batterycard">
  <el-collapse>
    <el-collapse-item title="船只电池信息" name="1">
      <div id="batterycardcontent">
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
    </el-collapse-item>
  </el-collapse>
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
<style>
#batterycard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#batterycard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#batterycard .el-collapse-item__arrow {
  line-height: 30px;
}
#batterycard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#batterycard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}

#batterycardcontent div {
  padding: 2px 0 0 1rem;
}
</style>
