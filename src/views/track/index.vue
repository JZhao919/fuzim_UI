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
        <el-select id="shipnum" v-model="shipId" size="mini" filterable clearable placeholder="请输入要查询的游船名称"
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
import { dateToInt } from '@/utils/times'
import { getAllShipDefInfo } from "@/api/shipinfo"
import { initMap, getlngLatsOne, getlngLatsTwo, initTrack, clearTrack } from './track.js'
export default {
  name: 'trail',
  mounted() {
    initMap()
    this.init()
  },
  data() {
    return {
      allShipDefInfo: [{}], // 所有船只的定义信息
      shipId: null, // 匹配的船只编号
      begDT: null, // 开始日期时间
      endDT: null // 结束日期时间
    }
  },
  destory() {
    clearTrack()
  },
  methods: {
    notification(code, string) {
      switch (code) {
        case 1:
          this.$notify({
            title: '成功！',
            message: string,
            type: 'success',
            duration: 2000
          })
          break
        case 0:
          this.$notify.error({
            title: '错误！',
            message: string,
            duration: 2000
          })
          break
        case 2:
          this.$notify({
            title: '注意！',
            message: string,
            type: 'warning',
            duration: 2000
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
      if (this.shipId === null || !this.shipId) {
        this.notification(0, '船只名称有误,请重新输入！')
        clearTrack()
        return
      }
      if (this.begDT === null) {
        this.notification(0, '请务必设置轨迹的开始时间！')
        return
      }
      if (this.endDT === null) { // 只有开始时间
        const nowTime = dateToInt(new Date())
        const startTime = dateToInt(this.begDT)
        if (startTime >= nowTime) {
          this.notification(0, '起始时间大于当前,请重新输入！')
          return
        } else if (nowTime - startTime > 235959) {
          this.notification(0, '起始时间最早为一天之前,请重新输入！')
          return
        } else {
          this.notification(2, '开始获取轨迹数据，请稍候！')
          getlngLatsOne(this.shipId, startTime).then(response => {
            if (response.length <= 0) {
              this.notification(2, '轨迹数据为空！')
              clearTrack()
            } else {
              this.notification(1, '开始绘制轨迹！')
              initTrack(response)
            }
          })
        }
        this.shipId = null
        this.begDT = null
        this.endDT = null
      } else {
        const startTime = dateToInt(this.begDT)
        const endTime = dateToInt(this.endDT)
        if (startTime > endTime) {
          this.notification(0, '起始时间大于结束时间,请重新输入！')
          return
        } else if (endTime - startTime > 235959) {
          this.notification(0, '最长时间的间隔为一天,请重新输入！')
          return
        } else {
          this.notification(2, '开始获取轨迹数据，请稍候！')
          getlngLatsTwo(this.shipId, startTime, endTime).then(response => {
            if (response.length <= 0) {
              this.notification(2, '轨迹数据为空！')
              clearTrack()
            } else {
              this.notification(1, '开始绘制轨迹！')
              initTrack(response)
            }
          })
        }
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
#fz-trail .el-select{
  width: 100%;
}
#trailmap{
  width: 100%;
  height: 54rem;
  border-radius: 5px;
}
</style>
