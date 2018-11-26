<template>
<div id="v-video">
  <el-row id="v-shiplist">
    <el-collapse id="v-splcoll">
      <el-collapse-item title="点击打开船只选择列表" name="1">
        <div id="v-splcollcontent">
          <el-scrollbar noresize style="height:100%">
            <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId"
            type="text" plain size="mini" 
            @click.native="select(shipdef.shipId)" :class="{ shipListRun: shipdef.shipStatus==='0' }">
            {{shipdef.shipName}} 
            </el-button>
          </el-scrollbar>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-row>
  <el-row>
    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
      <mainPlayer ref="mainVideo" :shipName="shipDefInfo.shipName" :shipStatus="shipDefInfo.shipStatus" :videoInfo="headVideo"></mainPlayer>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <select1Player ref="selectVideo1" :shipName="shipDefInfo.shipName" :shipStatus="shipDefInfo.shipStatus" :videoInfo="binVideo"></select1Player>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
      <select2Player ref="selectVideo2" :shipName="shipDefInfo.shipName" :shipStatus="shipDefInfo.shipStatus" :videoInfo="tailVideo"></select2Player>
    </el-col>
  </el-row>
</div>
</template>

<script>
import mainPlayer from './mainPlayer'
import select1Player from './select1Player'
import select2Player from './select2Player'
import { getAllShipDefInfo } from '@/api/shipinfo'
export default {
  name: 'v-video',
  components: {
    mainPlayer,
    select1Player,
    select2Player
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      allshipDefInfo: [], // 所有船只定义信息
      shipDefInfo: {
        shipId: 0,
        shipName: 'X',
        shipStatus: '0',
        shipNote: '',
        shipCamheadUrl: "",
        shipCamheadUrlHD: "",
        shipCamcabinUrl: "",
        shipCamcabinUrlHD: "",
        shipCamtailUrl: "",
        shipCamtailUrlHD: ""
      } // 当前船只的定义信
    }
  },
  computed: {
    headVideo: function() {
      return {
        camcaLoca: "头部",
        shipUrl: this.shipDefInfo.shipCamheadUrl,
        shipUrlHD: this.shipDefInfo.shipCamheadUrlHD
      }
    },
    binVideo: function() {
      return {
        camcaLoca: "中部",
        shipUrl: this.shipDefInfo.shipCamcabinUrl,
        shipUrlHD: this.shipDefInfo.shipCamcabinUrlHD
      }
    },
    tailVideo: function() {
      return {
        camcaLoca: "尾部",
        shipUrl: this.shipDefInfo.shipCamtailUrl,
        shipUrlHD: this.shipDefInfo.shipCamtailUrlHD
      }
    }
  },
  watch: {
    headVideo: function() {
      this.$refs.mainVideo.reinit()
    },
    binVideo: function() {
      this.$refs.selectVideo1.reinit()
    },
    tailVideo: function() {
      this.$refs.selectVideo2.reinit()
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
        const data = response.data
        if (data === [] || !data || data === null || data === "") {
          this.notification(2, '数据库中没有船只信息！')
        } else {
          this.allshipDefInfo = data
        }
      })
      return
    },
    select(shipId) {
      for (let i = 0; i < this.allshipDefInfo.length; i++) {
        if (this.allshipDefInfo[i].shipId === shipId) {
          this.shipDefInfo = this.allshipDefInfo[i]
          break
        }
      }
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
