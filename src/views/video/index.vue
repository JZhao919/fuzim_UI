<template>
<div id="v-video">
  <el-row id="v-shiplist">
    <el-collapse id="v-splcoll">
      <el-collapse-item title="点击打开船只选择列表" name="1">
        <div id="v-splcollcontent">
          <el-scrollbar noresize style="height:100%">
            <el-button v-for="shipdef in allshipDefInfo" :key="shipdef.shipId"
            type="text" plain size="mini" 
            @click.native="submit(shipdef.shipId)">
            {{shipdef.shipName}}
            </el-button>
          </el-scrollbar>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-row>
  <el-row>
    <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
      <!-- 主要播放区 -->
      <myplayer ref="mainVideo" :videoInfo="shipHeadCamca"></myplayer>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
      <!-- 次级选择播放区 -->
      <el-col :xs="24" :sm="12" :md="12" :lg="24" :xl="24">
        <myplayer ref="select1Video" :videoInfo="shipBinCamca"></myplayer>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="24" :xl="24">
        <myplayer ref="select2Video" :videoInfo="shipTailCamca"></myplayer>
      </el-col>
    </el-col>
  </el-row>
</div>
</template>

<script>
import myplayer from './myPlayer'
import { getAllShipDefInfo } from '@/api/shipinfo'
export default {
  name: 'v-video',
  components: {
    myplayer
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      allshipDefInfo: [], // 所有船只定义信息
      shipDefInfo: {
        shipId: 0,
        shipName: '',
        shipStatus: '',
        shipNote: '',
        shipCamheadUrl: "",
        shipCamheadUrlHD: "",
        shipCamcabinUrl: "",
        shipCamcabinUrlHD: "",
        shipCamtailUrl: "",
        shipCamtailUrlHD: ""
      } // 当前船只的定义信息
    }
  },
  computed: {
    shipHeadCamca: function() {
      return {
        shipName: this.shipDefInfo.shipName,
        camcaLoca: "头部",
        shipStatus: this.shipDefInfo.shipStatus,
        shipUrl: this.shipDefInfo.shipCamheadUrl,
        shipUrlHD: this.shipDefInfo.shipCamheadUrlHD
      }
    },
    shipBinCamca: function() {
      return {
        shipName: this.shipDefInfo.shipName,
        camcaLoca: "中部",
        shipStatus: this.shipDefInfo.shipStatus,
        shipUrl: this.shipDefInfo.shipCamcabinUrl,
        shipUrlHD: this.shipDefInfo.shipCamcabinUrlHD
      }
    },
    shipTailCamca: function() {
      return {
        shipName: this.shipDefInfo.shipName,
        camcaLoca: "尾部",
        shipStatus: this.shipDefInfo.shipStatus,
        shipUrl: this.shipDefInfo.shipCamtailUrl,
        shipUrlHD: this.shipDefInfo.shipCamtailUrlHD
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
        const data = response.data
        if (data === [] || !data || data === null || data === "") {
          this.notification(2, '数据库中没有船只信息！')
        } else {
          this.allshipDefInfo = data
        }
      })
      console.log(this.shipDefInfo)
      return
    },
    submit(shipId) {
      for (let i = 0; i < this.allshipDefInfo.length; i++) {
        if (this.allshipDefInfo[i].shipId === shipId) {
          this.shipDefInfo = this.allshipDefInfo[i]
          console.log(this.shipDefInfo)
          break
        }
      }
      this.$refs.mainVideo
      this.$refs.select1Video
      this.$refs.select2Video
      return
    }
  }
}
</script>
<style>
#v-video {
  border: 0;
  padding: 5px;
}
#v-shiplist {
  padding:10px;
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
  color: #ffffff;
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
  color: #000000;
  background: 0 0;
}
</style>

<style scoped>

</style>
