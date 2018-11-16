<template>
<div id="motorcard">
<el-collapse>
  <el-collapse-item title="船只电机信息" name="1">
    <div id="motorcardcontent">
      <div>电机电流1：<span>{{shipInfo.motorCurrent1}}</span></div>
      <div>电机电流2：<span>{{shipInfo.motorCurrent2}}</span></div>
      <div>电机电压1：<span>{{shipInfo.motorVoltage1}}</span></div>
      <div>电机电压2：<span>{{shipInfo.motorVoltage2}}</span></div>
      <div>电机转速1：<span>{{shipInfo.motorSpeed1}}</span></div>
      <div>电机转速2：<span>{{shipInfo.motorSpeed2}}</span></div>
    </div>
  </el-collapse-item>
</el-collapse>
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
<style>
#motorcard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#motorcard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#motorcard .el-collapse-item__arrow {
  line-height: 30px;
}
#motorcard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#motorcard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}

#motorcardcontent div {
  padding: 0.5rem 0 0 1rem;
}
</style>