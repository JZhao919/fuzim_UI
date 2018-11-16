<template>
<div id="warncard">
  <el-collapse>
    <el-collapse-item title="船只警告信息" name="1">
      <div id="warncardcontent">
        <div>是否超速：<span v-if="shipInfo.overSpeed === '1'" key="wait" class="waring">是</span><span v-else key="nwait">否</span></div>
        <div>碰撞危险：<span v-if="shipInfo.collide === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
        <div>超声距离：<span>{{shipInfo.ultrasonicValue}}</span></div>
        <div>漏水危险：<span v-if="shipInfo.leakage === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
        <div>烟雾危险：<span v-if="shipInfo.overSmog === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
        <div>火光危险：<span v-if="shipInfo.overFire === '1'" key="wait" class="waring">有</span><span v-else key="nwait">无</span></div>
        <div>电机危险：<span v-if="shipInfo.overMotor === '1'" key="wait" class="waring">是</span><span v-else key="nwait">否</span></div>
        <div>电池危险：<span v-if="shipInfo.batteryStatus === '1'" key="wait" class="waring">是</span><span v-else key="nwait">否</span></div>
      </div>
    </el-collapse-item>
  </el-collapse>
</div>
</template>
<script>
export default {
  name: 'warn-card',
  props: {
    shipInfo: {
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
<style>
#warncard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#warncard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#warncard .el-collapse-item__arrow {
  line-height: 30px;
}
#warncard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#warncard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}

#warncardcontent div {
  padding: 0.5rem 0 0 1rem;
}
#warncardcontent .waring {
  color: red;
}
</style>
