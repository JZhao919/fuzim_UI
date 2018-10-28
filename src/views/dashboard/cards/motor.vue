<template>
  <div id="motor-card">
    <div class="motor-title">{{shipInfo.shipId}}号船电机信息</div>
    <div id="motor-info" class="motor-content">
      <div><span>电机电流1：</span><span>{{shipInfo.motorCurrent1}}</span></div>
      <div><span>电机电流2：</span><span>{{shipInfo.motorCurrent2}}</span></div>
      <div><span>电机电压1：</span><span>{{shipInfo.motorVoltage1}}</span></div>
      <div><span>电机电压2：</span><span>{{shipInfo.motorVoltage2}}</span></div>
      <div><span>电机转速1：</span><span>{{shipInfo.motorSpeed1}}</span></div>
      <div><span>电机转速2：</span><span>{{shipInfo.motorSpeed2}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'motor-card',
  props: {
    shipInfo: {
      shipId: 0,
      motorCurrent1: 0,
      motorVoltage1: 0,
      motorSpeed1: 0,
      motorCurrent2: 0,
      motorVoltage2: 0,
      motorSpeed2: 0
    }
  }
}
</script>
<style scoped>
#motor-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#motor-card .motor-title{
  padding: 6px 10px;
  background-color: #eeeff1;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#motor-card .motor-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: #303133;
}
.motor-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
