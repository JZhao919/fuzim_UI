<template>
  <div id="fz-trail">
    <el-row id="DateTime">
      <el-col :xs="12" :sm="12" :md="6">
        <el-date-picker type="datetime" clearable size="mini" placeholder="开始时间(必选)" format="yyyyMMddHHmmss"
          v-model="begDT" default-time="10:00:00">
        </el-date-picker>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-date-picker type="datetime" clearable size="mini" placeholder="结束时间(默认当前)" format="yyyyMMddHHmmss"
          v-model="endDT" default-time="21:00:00">
        </el-date-picker>
      </el-col>
      <el-col :xs=12 :sm="12" :md="6">
        <el-select id="shipnum" v-model="shipId" size="mini" filterable clearable placeholder="输入或选择游船名称(必选)"
        no-data-text="当前没有船只" no-match-text="没有相匹配的船只">
          <el-option
            v-for="item in allShipDefInfo" :key="item.shipId" :label="item.shipName" :value="item.shipId">
          </el-option>
        </el-select>
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
import { getAllShipDefInfo } from "@/api/shipinfo"
import { initMap, getlngLats, initTrack, clearTrack, trackInfo, clearTrackInfoWid } from './track.js'
export default {
  name: 'trail',
  mounted() {
    initMap()
    this.init()
  },
  data() {
    return {
      allShipDefInfo: [{}], // 所有船只的定义信息
      shipId: null, // 查询的船只编号
      begDT: null, // 查询开始时间
      endDT: null // 查询结束时间
    }
  },
  destroyed() {
    clearTrack()
    clearTrackInfoWid()
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
      clearTrack()
      clearTrackInfoWid()
      if (this.shipId === null || !this.shipId) {
        this.messages(0, '船只名称有误,请重新输入！')
        return
      }
      const startTime = this.begDT // 查询开始时间
      let endTime = this.endDT // 查询结束时间
      if (startTime === null) {
        this.messages(0, '请务必设置轨迹的开始时间！')
        return
      }
      if (endTime === null) { // 只有开始时间
        endTime = new Date() // 当前时间为结束时间
      }
      const startstamps = startTime.getTime()
      const endstamps = endTime.getTime()
      if (startstamps >= endstamps) {
        this.messages(0, '起始时间要小于结束时间,请重新输入！')
        return
      } else if (endstamps - startstamps > 86400000) {
        this.messages(0, '最长的时间间隔为一天,请重新输入！')
        return
      } else {
        getlngLats(this.shipId, startTime, endTime).then(response => {
          if (response.length <= 0) {
            this.messages(2, '轨迹数据为空！')
          } else {
            initTrack(response)
            trackInfo()
          }
        })
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
#fz-trail .el-select{
  width: 100%;
}
#trailmap{
  width: 100%;
  height: 52rem;
  border-radius: 5px;
}
</style>
