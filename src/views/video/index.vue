<template>
<div id="v-video">
  <el-row id="v-shiplist">
    <div id="v-content">
      <el-scrollbar noresize style="height:100%">
        <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId"
        type="text" plain size="mini" 
        @click.native="selectShip(shipdef)">
        {{shipdef.shipName}} 
        </el-button>
         <!-- :class="{ shipListRun: shipdef.shipStatus==='0' }" -->
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
  beforeDestroy() {
    this.destroy()
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
        url: "",
        urlHD: ""
      },
      binVideo: {
        url: "",
        urlHD: ""
      },
      tailVideo: {
        url: "",
        urlHD: ""
      } // http://hls.open.ys7.com/1.m3u8
    }
  },
  methods: {
    messages(code, string) {
      switch (code) {
        case 1:
          this.$message({
            message: string,
            type: 'success',
            duration: 1500,
            showClose: true
          })
          break
        case 0:
          this.$message({
            message: string,
            type: 'error',
            duration: 1500,
            showClose: true
          })
          break
        case 2:
          this.$message({
            message: string,
            type: 'warning',
            duration: 1500,
            showClose: true
          })
          break
        case 3:
          this.$message({
            message: string,
            type: 'info',
            duration: 1500,
            showClose: true
          })
          break
        default:
      }
    },
    init() {
      getAllShipDefInfo().then(response => {
        if (!response.data || response.data === null || response.data === [] || response.data === "") {
          this.allshipDefInfo = [] // 所有船只定义信息置空
          this.messages(0, "当前船只视频信息为空")
        } else {
          const data = this.allshipDefInfo = response.data
          for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].shipCamheadUrl || data[i].shipCamcabinUrl || data[i].shipCamtailUrl) { // 随机选择一个存在视频链接的
              this.selectShip(data[i])
            }
          }
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
    },
    destroy() {
      this.$refs.headVideo.destroyed()
      this.$refs.binVideo.destroyed()
      this.$refs.tailVideo.destroyed()
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
#v-content {
  height: 100px;
  border: 2px solid #b6b6b6;
  border-radius: 1px;
}
#v-content .el-scrollbar__wrap{
  overflow-x:hidden;
  overflow-y: auto;
}
#v-content .el-button{
  margin: 3px;
  padding: 3px;
  font-size: 13px;
  border-radius: 1px;
}
#v-content .el-button:hover{
  margin: 3px;
  padding: 3px;
  color: #0000ff;
  font-size: 15px;
  border-color:#ff0000;
  border-radius: 1px;
}
#v-content .el-button:active{
  margin: 3px;
  padding: 3px;
  color: #0000ff;
  font-size: 16px;
  border-color:#ff0000;
  border-radius: 1px;
}
#v-content .el-button:focus{
  margin: 3px;
  padding: 3px;
  color: #0000ff;
  font-size: 16px;
  border-color:#ff0000;
  border-radius: 1px;
}
#v-content .el-button--text{
  color: black;
  background: 0 0;
}
</style>
