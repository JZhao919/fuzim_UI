<template>
  <div id="radar-card">
    <div class="radar-title">{{shipInfo.shipId}}号船雷达信息</div>
    <div id="radar-info" class="radar-content">
      <div><span>雷达距离：</span><span>{{shipInfo.radarRange}}</span></div>
      <div><span>雷达速度：</span><span>{{shipInfo.radarAzimuth}}</span></div>
      <div><span>雷达方位角：</span><span>{{shipInfo.radarVerl}}</span></div>
      <div><span>雷达信噪比：</span><span>{{shipInfo.radarSNR}}</span></div>
      <div><span>硬件保留：</span><span>{{shipInfo.hardware}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'radar-card',
  props: {
    shipInfo: {
      shipId: 0,
      radarRange: "",
      radarAzimuth: "",
      radarVerl: "",
      radarSNR: "",
      hardware: "空"
    }
  }
}
</script>
<style scoped>
#radar-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#radar-card .radar-title{
  padding: 6px 10px;
  background-color: #37445817;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#radar-card .radar-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: black;
}
.radar-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
