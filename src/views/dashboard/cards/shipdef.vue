<template>
  <div id="def-card">
    <div class="def-title">{{shipInfo.shipId}}号船基本信息</div>
    <div class="def-content">
      <div><span>船只名称：</span><span>{{shipInfo.shipName}}</span></div>
      <div><span>运行状态：</span><span v-if="shipInfo.shipStatus === '1'" key="run">运行中...</span><span v-else key="nrun">未运行.</span></div>
      <div><span>船只描述：</span>{{shipInfo.shipNote}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'def-card',
  props: {
    shipInfo: {
      shipId: 0,
      shipName: '',
      shipNote: '',
      shipStatus: ''
    }
  }
}
</script>
<style scoped>
#def-card{
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
#def-card .def-title{
  padding: 6px 10px;
  background-color: #37445817;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#def-card .def-content{
  padding: 10px;
  background-color: #ffffff;
  height: 350px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: black;
}
.def-content div{
  margin: 5px 0;
  padding: 0px 10px;
}
</style>
