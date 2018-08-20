<template>
  <div id="status-card">
    <div class="status-title">{{shipInfo.shipId}}号船状态信息</div>
    <div id="status-info" class="status-content">
      <div>进出次数：<span>{{shipInfo.ioTimes}}</span></div>
      <div>运行状态：<span v-if="shipInfo.runStatus === '1'" key="run">运行中...</span><span v-else key="nrun">未运行.</span></div>
      <div>会船提醒：<span v-if="shipInfo.wait === '1'" key="wait">等待会船...</span><span v-else key="nwait">不需会船.</span></div>
      <div>上次离岸时间：<span>{{shipInfo.startRunTime}}</span></div>
      <div>上次靠岸时间：<span>{{shipInfo.endRunTime}}</span></div>
      <div>运行时间：<span>{{shipInfo.runTime}}</span></div>
      <div>运行速度：<span>{{shipInfo.speed}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'status-card',
  props: {
    shipInfo: {
      shipId: 0,
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
<style scoped>
#status-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#status-card .status-title{
  padding: 6px 10px;
  background-color: #37445817;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#status-card .status-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: black;
}
.status-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
