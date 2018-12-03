<template>
<div id="v-video">
  <el-row id="v-shiplist">
    <el-collapse id="v-splcoll">
      <el-collapse-item title="点击打开船只选择列表" name="1">
        <div id="v-splcollcontent">
          <el-scrollbar noresize style="height:100%">
            <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId"
            type="text" plain size="mini" 
            @click.native="selectShip(shipdef.shipId)" :class="{ shipListRun: shipdef.shipStatus==='1' }">
            {{shipdef.shipName}} 
            </el-button>
          </el-scrollbar>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-row>
  <el-row>
    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
      <myPlayer ref="headVideo" :shipName="shipDefInfo.shipName" :camcaLoca="'头部'" :video="headVideo"></myPlayer>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <myPlayer ref="binVideo" :shipName="shipDefInfo.shipName" :camcaLoca="'中部'" :video="binVideo"></myPlayer>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <myPlayer ref="tailVideo" :shipName="shipDefInfo.shipName" :camcaLoca="'尾部'" :video="tailVideo"></myPlayer>
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
        shipId: 2,
        shipName: "永熙号",
        shipStatus: '0',
        shipNote: '',
        shipCamheadUrl: "http://hls.open.ys7.com/openlive/af6cda72ed224f6386dfd92b6521f27b.m3u8",
        shipCamheadUrlHD: "http://hls.open.ys7.com/openlive/af6cda72ed224f6386dfd92b6521f27b.hd.m3u8",
        shipCamcabinUrl: "http://hls.open.ys7.com/openlive/ddf892f123154f7b971b43b872146502.m3u8",
        shipCamcabinUrlHD: "http://hls.open.ys7.com/openlive/ddf892f123154f7b971b43b872146502.hd.m3u8",
        shipCamtailUrl: "http://hls.open.ys7.com/openlive/d5db3d8ddd8c41f385a9e09580956c48.m3u8",
        shipCamtailUrlHD: "http://hls.open.ys7.com/openlive/d5db3d8ddd8c41f385a9e09580956c48.hd.m3u8"
      }, // 当前船只的定义信 
      shipNoneDefInfo: {
        shipId: 0,
        shipName: "X",
        shipStatus: '0',
        shipNote: '',
        shipCamheadUrl: "http://hls.1.m3u8",
        shipCamheadUrlHD: "http://hls.1.hd.m3u8",
        shipCamcabinUrl: "http://hls.1.m3u8",
        shipCamcabinUrlHD: "http://hls.1.hd.m3u8",
        shipCamtailUrl: "http://hls.1.m3u8",
        shipCamtailUrlHD: "http://hls.1.hd.m3u8"
      } // 默认船只的定义信
    }
  },
  computed: {
    headVideo: function() {
      return {
        url: this.shipDefInfo.shipCamheadUrl,
        urlHD: this.shipDefInfo.shipCamheadUrlHD
      }
    },
    binVideo: function() {
      return {
        url: this.shipDefInfo.shipCamcabinUrl,
        urlHD: this.shipDefInfo.shipCamcabinUrlHD
      }
    },
    tailVideo: function() {
      return {
        url: this.shipDefInfo.shipCamtailUrl,
        urlHD: this.shipDefInfo.shipCamtailUrlHD
      }
    }
  },
  methods: {
    notification(code, string) {
      switch (code) {
        case 0:
          this.$notify.error({
            title: '错误！',
            message: string
          })
          break
        case 1:
          this.$notify({
            title: '成功！',
            message: string,
            type: 'success'
          })
          break
        case 2:
          this.$notify({
            title: '注意！',
            message: string,
            type: 'warning'
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
    selectShip(shipId) {
      for (let i = 0; i < this.allshipDefInfo.length; i++) {
        if (this.allshipDefInfo[i].shipId === shipId) {
          if (this.allshipDefInfo[i].shipCamheadUrl !== "" || this.allshipDefInfo[i].shipCamcabinUrl !== "" || this.allshipDefInfo[i].shipCamtailUrl !== "") {
            this.shipDefInfo = this.allshipDefInfo[i]
            break
          } else {
            this.notification(0, "当前船只没有视频")
            this.shipDefInfo = this.shipNoneDefInfo // 当前船只视频信息置空
            break
          }
        }
      }
      this.$refs.headVideo.reinit()
      this.$refs.binVideo.reinit()
      this.$refs.tailVideo.reinit()
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
  padding: 10px 5px 10px 5px; 
  width: 100%;
  height: auto;
}
#v-splcoll {
  width: 100%;
  height: auto;
  background-color: #ffffff;
}
#v-splcoll .el-collapse-item__header{
  border: 0;
  padding:0;
  background-color: #eeeff1;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 30px;
}
#v-splcoll .el-collapse-item__arrow{
  line-height: 30px;
}
#v-splcoll .el-collapse-item__wrap {
  border: 0;
  background-color: #ffffff;
}
#v-splcoll .el-collapse-item__content {
  border: 0;
  padding: 0;
  font-size: 13px;
  color: #303133;
}

#v-splcollcontent {
  height: 200px;
}
#v-splcollcontent .el-scrollbar__wrap{
  overflow-x:hidden;
  overflow-y: auto;
}
#v-splcollcontent .el-button--mini{
  margin: 4px;
  padding: 4px;
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
<style scoped>

</style>
