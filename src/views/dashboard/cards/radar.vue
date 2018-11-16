<template>
<div id="radarcard">
<el-collapse>
  <el-collapse-item title="船只雷达信息" name="1">
    <div id="radarcardcontent">
      <div><span>雷达距离：</span><span>{{shipInfo.radarRange}}</span></div>
      <div><span>雷达速度：</span><span>{{shipInfo.radarAzimuth}}</span></div>
      <div><span>雷达方位角：</span><span>{{shipInfo.radarVerl}}</span></div>
      <div><span>雷达信噪比：</span><span>{{shipInfo.radarSNR}}</span></div>
      <div><span>硬件保留：</span><span>{{shipInfo.hardware}}</span></div>
    </div>
  </el-collapse-item>
</el-collapse>
</div>
</template>

<script>
export default {
  name: 'radar-card',
  props: {
    shipInfo: {
      radarRange: "",
      radarAzimuth: "",
      radarVerl: "",
      radarSNR: "",
      hardware: "空"
    }
  }
}
</script>
<style>
#radarcard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#radarcard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#radarcard .el-collapse-item__arrow {
  line-height: 30px;
}
#radarcard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#radarcard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 340px;
  font-size: 13px;
  text-align: left;
}

#radarcardcontent div {
  padding: 0.5rem 0 0 1rem;
}
</style>