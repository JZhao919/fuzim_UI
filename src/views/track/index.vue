<template>
  <div id="fz-trail">
    <el-row id="DateTime">
      <el-col :xs="12" :sm="12" :md="6">
        <el-date-picker type="datetime" clearable size="mini" placeholder="选择开始日期时间" format="yyyyMMddHHmmss"
          v-model="begDT" default-time="9:00:00">
        </el-date-picker>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-date-picker type="datetime" clearable size="mini" placeholder="选择结束日期时间" format="yyyyMMddHHmmss"
          v-model="endDT" default-time="22:00:00">
        </el-date-picker>
      </el-col>
      <el-col :xs=12 :sm="12" :md="6">
        <el-input id="shipnum" clearable size="mini" v-model="shipName" placeholder="请输入要查询的游船名称"></el-input>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-button id="submit" plain size="mini" type="info" icon="el-icon-check" v-on:click="submit">确认</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="trailmap" class="trail-box"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// eslint-disable-next-line
import { initMap, makeTrail1, makeTrail2, dateToInt } from './track.js'
import { getAllShipDefInfo } from '@/api/shipinfo'
export default {
  name: 'trail',
  mounted() {
    initMap()
    this.init()
  },
  data() {
    return {
      allShipDefInfo: [{}],
      shipId: null, // 选择的船只编号
      shipName: '', // 输入的船只名称
      begDT: null, // 开始日期时间
      endDT: null // 结束日期时间
    }
  },
  methods: {
    notification(code, string) {
      switch (code) {
        case 1:
          this.$notify({
            title: '成功！',
            message: string,
            type: 'success'
          })
          break
        case 0:
          this.$notify.error({
            title: '错误！',
            message: string
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
          this.allShipDefInfo = []
        } else {
          this.allShipDefInfo = data
        }
      })
      return
    },
    // 提交查询函数
    submit() {
      if (this.begDT === null) {
        this.notification(0, '请务必设置轨迹的开始时间！')
        return
      }
      for (let i = 0; i < this.allShipDefInfo.length; i++) {
        if (this.allShipDefInfo[i].shipName === this.shipName) {
          this.shipId = this.allShipDefInfo[i].shipId
          break
        }
      }
      if (this.shipId === null || !this.shipId) {
        this.notification(0, '船只名称有误,请重新输入！')
        return
      }
      if (this.endDT === null) {
        const startTime = dateToInt(this.begDT)
        this.notification(1, '将获取' + startTime + '后的轨迹数据！')
        makeTrail1(this.shipId, startTime)
        this.shipId = null
        this.begDT = null
      } else {
        const startTime = dateToInt(this.begDT)
        const endTime = dateToInt(this.endDT)
        this.notification(1, '将获取' + startTime + '与' + endTime + '之间的轨迹数据！')
        makeTrail2(this.shipId, startTime, endTime)
        this.shipId = null
        this.begDT = null
        this.endDT = null
      }
      return
    }
  }
}
</script>
<style>
#fz-trail {
  margin: 0;
  border: 1px;
  padding: 5px;
  width: 100%;
  height: auto;
}
#fz-trail #DateTime {
  margin-bottom: 4px;
}
#fz-trail .el-date-editor.el-input{
  width: 100%;
}
#fz-trail #submit{
  width: 100%;
}
#fz-trail #shipnum{
  width: 100%;
}
#trailmap{
  width: 100%;
  height: 54rem;
  border-radius: 5px;
}
</style>
