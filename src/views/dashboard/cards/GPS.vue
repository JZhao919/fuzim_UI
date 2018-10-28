<template>
  <div id="GPS-card">
    <div class="GPS-title">{{shipInfo.shipId}}号船GPS信息</div>
    <div id="GPS-info" class="GPS-content">
      <div><span>GPS时间：</span><span>{{shipInfo.gpsTime}}</span></div>
      <div><span>GPS经度：</span><span>{{shipInfo.gpsLondir}}：{{shipInfo.longitude}}</span></div>
      <div><span>GPS纬度：</span><span>{{shipInfo.gpsLatdir}}：{{shipInfo.latitude}}</span></div>
      <div><span>地磁偏角：</span><span>{{shipInfo.gpsVardir}}：{{shipInfo.gpsMagvar}}</span></div>
      <div><span>航向角：</span><span>{{shipInfo.gpsTrackTure}}</span></div>
      <div><span>工作模式：</span><span>{{shipInfo.gpsModeInd}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GPS-card',
  props: {
    shipInfo: {
      shipId: 0,
      gpsTime: 0,
      gpsLondir: "",
      longitude: 0,
      gpsLatdir: "",
      latitude: 0,
      gpsVardir: "",
      gpsMagvar: 0.0,
      gpsTrackTure: 0,
      gpsModeInd: ""
    }
  }
}
</script>
<style scoped>
#GPS-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#GPS-card .GPS-title{
  padding: 6px 10px;
  background-color: #eeeff1;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#GPS-card .GPS-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: #303133;
}
.GPS-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
