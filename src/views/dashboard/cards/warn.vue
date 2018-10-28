<template>
  <div id="warn-card">
    <div class="warn-title">{{shipInfo.shipId}}号船警告信息</div>
    <div id="warn-info" class="warn-content">
      <div>是否超速：<span v-if="shipInfo.overSpeed === '1'" key="wait">是</span><span v-else key="nwait">否</span></div>
      <div>碰撞危险：<span v-if="shipInfo.collide === '1'" key="wait">有</span><span v-else key="nwait">无</span></div>
      <div>超声距离：<span>{{shipInfo.ultrasonicValue}}</span></div>
      <div>漏水危险：<span v-if="shipInfo.leakage === '1'" key="wait">有</span><span v-else key="nwait">无</span></div>
      <div>烟雾危险：<span v-if="shipInfo.overSmog === '1'" key="wait">有</span><span v-else key="nwait">无</span></div>
      <div>火光危险：<span v-if="shipInfo.overFire === '1'" key="wait">有</span><span v-else key="nwait">无</span></div>
      <div>电机危险：<span v-if="shipInfo.overMotor === '1'" key="wait">是</span><span v-else key="nwait">否</span></div>
      <div>电池危险：<span v-if="shipInfo.batteryStatus === '1'" key="wait">是</span><span v-else key="nwait">否</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'warn-card',
  props: {
    shipInfo: {
      shipId: 0,
      overSpeed: "",
      collide: "",
      ultrasonicValue: "0|0",
      leakage: "",
      overSmog: "",
      overFire: "",
      overMotor: "",
      batteryStatus: ""
    }
  }
}
</script>
<style scoped>
#warn-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#warn-card .warn-title{
  padding: 6px 10px;
  background-color: #eeeff1;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#warn-card .warn-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: #303133;
}
.warn-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
