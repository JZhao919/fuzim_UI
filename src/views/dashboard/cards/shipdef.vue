<template>
<div id="defcard">
<el-collapse value= 1 >
  <el-collapse-item title="船只基本信息" name="1">
    <div id="defcardcontent">
      <div><span>船只名称：</span><span>{{shipInfo.shipName}}</span></div>
      <div><span>使用情况：</span><span v-if="shipInfo.shipStatus === '1'" key="run">正在使用</span><span v-else key="nrun">不能使用</span></div>
      <div><span>船只描述：</span>{{shipInfo.shipNote}}</div>
    </div>
  </el-collapse-item>
</el-collapse>
</div>
  <!-- <div id="def-card">
    <div class="def-title">{{shipInfo.shipName}}号船基本信息</div>
    <div class="def-content">
      <div><span>船只名称：</span><span>{{shipInfo.shipName}}</span></div>
      <div><span>使用情况：</span><span v-if="shipInfo.shipStatus === '1'" key="run">正在使用</span><span v-else key="nrun">不能使用</span></div>
      <div><span>船只描述：</span>{{shipInfo.shipNote}}</div>
    </div>
  </div> -->
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
    },
    shipAInfo: {
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
#defcard {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#defcard .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#defcard .el-collapse-item__arrow {
  line-height: 30px;
}
#defcard .el-collapse-item__wrap {
  border:0;
  background-color: #ffffff;
}
#defcard .el-collapse-item__content {
  border: 0;
  padding: 1rem;
  height: 440px;
  font-size: 13px;
  text-align: left;
}

#defcardcontent div {
  padding: 0.5rem 0 0 1rem;
}
</style>
