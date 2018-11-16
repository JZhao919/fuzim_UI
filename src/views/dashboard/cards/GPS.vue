<template>
<div id="GPScard">
  <el-collapse>
    <el-collapse-item title="船只GPS信息" name="1">
      <div id="GPScardcontent">
        <div>GPS时间：<span>{{shipInfo.gpsTime}}</span></div>
        <div>GPS经度：<span>{{shipInfo.gpsLondir}}：{{shipInfo.longitude}}</span></div>
        <div>GPS纬度：<span>{{shipInfo.gpsLatdir}}：{{shipInfo.latitude}}</span></div>
        <div>地磁偏角：<span>{{shipInfo.gpsVardir}}：{{shipInfo.gpsMagvar}}</span></div>
        <div>地航向角：<span>{{shipInfo.gpsTrackTure}}</span></div>
        <div>工作模式：<span>{{shipInfo.gpsModeInd}}</span></div>
      </div>
    </el-collapse-item>
  </el-collapse>
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
<style>
#GPScard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#GPScard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#GPScard .el-collapse-item__arrow {
  line-height: 30px;
}
#GPScard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#GPScard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}

#GPScardcontent div {
  padding: 0.5rem 0 0 1rem;
}
</style>
