<template>
<div id="v-video">
  <el-row id="v-shiplist">
    <div id="v-splcollcontent">
      <el-scrollbar noresize style="height:100%">
        <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId"
        type="text" plain size="mini" 
        @click.native="selectShip(shipdef)" :class="{ shipListRun: shipdef.shipStatus==='0' }">
        {{shipdef.shipName}} 
        </el-button>
        <!-- <el-button v-for="shipdef in 200" :key="shipdef"
        type="text" plain size="mini" 
        @click.native="selectShip(shipdef)">
        {{shipdef}} 
        </el-button> -->
      </el-scrollbar>
    </div>
  </el-row>
  <el-row>
    <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <myPlayer ref="headVideo" :shipName="shipDefInfo.shipName" :video="headVideo"></myPlayer>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
      <myPlayer ref="binVideo" :shipName="shipDefInfo.shipName" :video="binVideo"></myPlayer>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
      <myPlayer ref="tailVideo" :shipName="shipDefInfo.shipName" :video="tailVideo"></myPlayer>
    </el-col>
  </el-row>
</div>
</template>

<script>
import myPlayer from './myPlayer'
import { getAllShipDefInfo } from '@/api/shipinfo'
export default {
  name: 'v-video',
  components: {
    myPlayer
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      allshipDefInfo: [], // 所有船只定义信息
      shipDefInfo: {
        shipId: 0,
        shipName: "X",
        shipStatus: '0',
        shipNote: '',
        shipCamheadUrl: "",
        shipCamheadUrlHD: "",
        shipCamcabinUrl: "",
        shipCamcabinUrlHD: "",
        shipCamtailUrl: "",
        shipCamtailUrlHD: ""
      }, // 当前船只的定义信
      headVideo: {
        url: "http://hls.open.ys7.com/1.m3u8",
        urlHD: "http://hls.open.ys7.com/1.hd.m3u8"
      },
      binVideo: {
        url: "http://hls.open.ys7.com/1.m3u8",
        urlHD: "http://hls.open.ys7.com/1.hd.m3u8"
      },
      tailVideo: {
        url: "http://hls.open.ys7.com/1.m3u8",
        urlHD: "http://hls.open.ys7.com/1.hd.m3u8"
      }
    }
  },
  methods: {
    notification(code, string) {
      switch (code) {
        case 0:
          this.$notify.error({
            title: '错误！',
            message: string,
            duration: 1500
          })
          break
        case 1:
          this.$notify({
            title: '成功！',
            message: string,
            type: 'success',
            duration: 1500
          })
          break
        case 2:
          this.$notify({
            title: '注意！',
            message: string,
            type: 'warning',
            duration: 1500
          })
          break
        default:
      }
    },
    init() {
      getAllShipDefInfo().then(response => {
        if (!response.data || response.data === null || response.data === [] || response.data === "") {
          this.allshipDefInfo = [] // 所有船只定义信息置空
          this.notification(0, "当前船只信息为空")
        } else {
          this.allshipDefInfo = response.data
        }
      })
    },
    selectShip(shipdef) {
      this.shipDefInfo = shipdef
      const headVideo = {
        url: shipdef.shipCamheadUrl,
        urlHD: shipdef.shipCamheadUrlHD
      }
      const binVideo = {
        url: shipdef.shipCamcabinUrl,
        urlHD: shipdef.shipCamcabinUrlHD
      }
      const tailVideo = {
        url: shipdef.shipCamtailUrl,
        urlHD: shipdef.shipCamtailUrlHD
      }
      this.$refs.headVideo.switchVideo(headVideo)
      this.$refs.binVideo.switchVideo(binVideo)
      this.$refs.tailVideo.switchVideo(tailVideo)
    }
  }
}
</script>
<style>
#v-video {
  border: 0;
  padding: 0;
}
#v-shiplist {
  margin:0;
  padding: 5px; 
  width: 100%;
  height: auto;
}

#v-splcollcontent {
  height: 100px;
  border: 2px solid #b6b6b6;
  border-radius: 1px;
}
#v-splcollcontent .el-scrollbar__wrap{
  overflow-x:hidden;
  overflow-y: auto;
}
#v-splcollcontent .el-button--mini{
  margin: 3px;
  padding: 3px;
  font-size: 13px;
  border-radius: 1px;
}
#v-splcollcontent .el-button--text{
  color: #303133;
  background: 0 0;
}
#v-splcollcontent .shipListRun {
  color: #b6b6b6;
  background: 0 0;
}
</style>

