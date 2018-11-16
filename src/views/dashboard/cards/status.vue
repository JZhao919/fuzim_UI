<template>
<div id="statuscard">
<el-collapse>
  <el-collapse-item title="船只状态信息" name="1">
    <div id="statuscardcontent">
      <div>船只进出次数：<span>{{shipInfo.ioTimes}}</span></div>
      <div>船只运行状态：
        <span v-if="shipInfo.runStatus === '1'" key="runing">正在运行.</span>
        <span v-else-if="shipInfo.runStatus === '2'" key="runwait">正在等待.</span>
        <span v-else key="norun">没有运行.</span></div>
      <div>是否等待会船：
        <span v-if="shipInfo.wait === '1'" key="waiting">等待会船.</span>
        <span v-else key="nowait">不需会船.</span></div>
      <div>上次离岸时间：<span>{{shipInfo.startRunTime}}</span></div>
      <div>上次靠岸时间：<span>{{shipInfo.endRunTime}}</span></div>
      <div>船只运行时间：<span>{{shipInfo.runTime}}</span></div>
      <div>船只运行速度：<span>{{shipInfo.speed}}</span></div>
    </div>
  </el-collapse-item>
</el-collapse>
</div>
</template>

<script>
export default {
  name: 'status-card',
  props: {
    shipInfo: {
      ioTimes: 0,
      runStatus: '',
      startRunTime: 0,
      endRunTime: 0,
      runTime: 0,
      wait: '',
      speed: 0
    }
  }
}
</script>
<style>
#statuscard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#statuscard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#statuscard .el-collapse-item__arrow {
  line-height: 30px;
}
#statuscard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#statuscard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}

#statuscardcontent div {
  padding: 0.5rem 0 0 1rem;
}
</style>
