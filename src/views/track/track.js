/* eslint-disable */
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
import { getOneShipInfoByTimeBetween } from '@/api/shipinfo'
import { Notification, Message, Loading } from 'element-ui'
import { dateToInt, intToDate, timestampsToTime } from '@/utils/times'

let trailmap = null // 全局地图对象
let pathSimplifierIns = null // 全局简单轨迹线对象
let trackInfoNotification = null // 轨迹的信息窗口

let selectStartTime = null // 查询轨迹开始运行时间
let selectEndTime = null // 查询结轨迹束运行时间
let runPoints = [] // 运行趟数对象的集合
let dealPoints = [] // 处理之后的趟数对象的集合
/**
 * 地图初始化函数
 */
export function initMap() {
  if (trailmap !== null) {
    trailmap = null
  }
  trailmap = new AMap.Map('trailmap', {
    mapStyle: 'amap://styles/12cb5f735c7e70f55c221548b0e11763', // 设置地图的显示样式
    center: [118.789582, 32.019405],
    zoom: 15,
    // dragEnable: false,
    keyboardEnable: false,
    doubleClickZoom: false
  })
  trailmap.plugin(['AMap.Scale'], () => {
    trailmap.addControl(new AMap.Scale())
  })
}

/**
 * 坐标获取与数量处理与坐标系转换
 * @param number shipId
 * @param number startTime
 * @param number endTime
 * @return Promise Array.<AMap.LngLat> gps
 */
export function getlngLats(shipId, startTime, endTime) {
  // 创建Loading遮罩
  const loadingInstance = Loading.service({
    fullscreen: true,
    lock: true,
    text: '正在获取坐标数据，请稍候...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.8)'
  })
  loadingInstance
  // 初始化全局查询时间
  selectStartTime = startTime
  selectEndTime = endTime
  // 将全局轨迹信息集合清空
  if (runPoints.length > 0) {
    runPoints = []
  }
  if (dealPoints.length > 0) {
    dealPoints = []
  }
  return new Promise((resolve, rejects) => {
    getOneShipInfoByTimeBetween(shipId, dateToInt(startTime), dateToInt(endTime)).then(response => {
      const tracks = [] // 处理后的轨迹对象集合
      const data = response.data // 返回的坐标数据
      if (!data || data === null || data.length <= 0) {
        resolve(tracks) // 返回空轨迹对象集合
      } else {
        countRunNums(data, data.length - 1, 0) // 计算返回数据集合含有多少趟运行数据；结果存在runPoints[]中
        // console.log(runPoints)
        dealPoints = dealRunNums(runPoints) // 清洗运行趟数时间集合并返回覆盖运行运行趟数集合
        // console.log(dealPoints)
        if (dealPoints.length === 0) {
          resolve(tracks) // 运行趟数集合；则返回空数组
        } else {
          var trackNum = 0 // 轨迹编号
          for (let i = 0; i < dealPoints.length; i++) {
            const indexs = dealPoints[i].indexs
            if (indexs.length < 30) { // GPS数据太少的轨迹不绘制
              continue
            } else {
              trackNum++
            }
            const gps = [] // 轨迹中要渲染的坐标数据
            if (indexs.length > 400) { // 对过长的坐标数据长度进行适当的精简，采用等距跳跃采样
              const jump = parseInt(indexs.length / 400 + 1)
              for (let j = 0; j < indexs.length; j += jump) {
                // 坐标不存在或者坐标为[x,0]、[0,x]等数据则跳过
                if (!data[indexs[j]].longitude || data[indexs[j]].longitude === 0 || !data[indexs[j]].latitude || data[indexs[j]].latitude === 0) {
                  continue // 坐标数据不存在跳过
                } else {
                  gps.push(GPS.gcj_encrypt(data[indexs[j]].longitude, data[indexs[j]].latitude)) // 坐标在国外会返回默认值
                }
              }
            } else {
              for (let j = 0; j < indexs.length; j++) {
                if (!data[indexs[j]].longitude || data[indexs[j]].longitude === 0 || !data[indexs[j]].latitude || data[indexs[j]].latitude === 0) {
                  continue // 坐标数据不存在跳过
                } else {
                  gps.push(GPS.gcj_encrypt(data[indexs[j]].longitude, data[indexs[j]].latitude))  // 坐标在国外（[0,0]等数据）会返回默认值
                }
              }
            }
            if (gps.length <= 0) { // 若全是[0,0]则此时gps中没有数据，添加一条默认数据
              gps.push([118.789582, 32.019405])
            }
            var track = {
              name: '第' + trackNum + '条轨迹',
              path: gps
            } // 构建轨迹对象
            // console.log(track)
            tracks.push(track) // 向轨迹对象集合添加轨迹对象
          }
          resolve(tracks)
        }
      }
      loadingInstance.close() // 遮罩关闭
      return
    }).catch(error => {
      loadingInstance.close() // 遮罩关闭
      Message({
        message: '处理数据错误！',
        duration: 3000,
        type: 'error',
        showClose: true
      })
      rejects('获取数据错误：' + error)
    })
  })
}

/**
 * 轨迹绘制函数
 * @param Array.<AMap.LngLat>||AMap.LngLat lngLats
 */
export function initTrack(tracks) {
  if (!tracks || tracks.length === 0) {
    return
  }
  AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function(PathSimplifier, $, utils) {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！')
      return
    }
    initPage(PathSimplifier)
  })
  // 轨迹线的样式
  var defaultRenderOptions = {
    renderAllPointsIfNumberBelow: 100, // 绘制路线节点，如不需要可设置为-1
    pathNavigatorStyle: {
      initRotateDegree: 0,
      width: 16,
      height: 16,
      autoRotate: true,
      lineJoin: "round",
      content: "defaultPathNavigator",
      fillStyle: "#fff000",
      strokeStyle: "#ff0000",
      lineWidth: 1,
      pathLinePassedStyle: {
        lineWidth: 2,
        strokeStyle: "#ff0000",
        borderWidth: 1,
        borderStyle: "#ffc200",
        dirArrowStyle: true
      }
    }
  }
  function initPage(PathSimplifier) {
    // 创建组件实例
    if (pathSimplifierIns !== null) {
      pathSimplifierIns.clearPathNavigators()
      pathSimplifierIns.setData(null)
      pathSimplifierIns = null
    }
    pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      // autoSetFitView:false,
      map: trailmap, // 所属的地图实例
      getPath: function(pathData, pathIndex) {
        // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path
      },
      getHoverTitle: function(pathData, pathIndex, pointIndex) {
        // 返回鼠标悬停时显示的信息
        if (pointIndex >= 0) {
          return pathData.name + '，当前点：' + pointIndex + '/' + pathData.path.length // 鼠标悬停在某个轨迹节点上
        }
        // 鼠标悬停在节点之间的连线上
        return pathData.name + '，点数量：' + pathData.path.length + '，播放速度：100km/h'
      },
      renderOptions: defaultRenderOptions,
      // 设置数据
      data: tracks
    })
    // console.log(tracks.length) // 输出轨迹条数
    // 创建一个巡航器，关联（轨迹1）
    for (let i = 0; i < tracks.length; i++) {
      var navg = pathSimplifierIns.createPathNavigator(i, {
        loop: false, // 循环播放
        speed: 100 // 巡航速度，单位千米/小时
      })
      navg.start()
    }
    pathSimplifierIns.on('pathClick pointClick', () => {
      clearTrackInfoWid()
      trackInfo()
    })
  }
}
/**
 * 绘制轨迹信息窗口
 */
export function trackInfo() {
  const allSelctTime = selectEndTime.getTime() - selectStartTime.getTime() // 选择的总时间毫秒
  const runInfo = countRunTime(dealPoints, selectStartTime, selectEndTime)
  // 实例化轨迹弹出信息窗口
  const htmlMSG = '<p>运行次数：' + (runInfo.count + runInfo.halfCount) + '次</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  // if (runInfo.count !== 0) {
  //   if (runInfo.halfCount !== 0) {
  //     htmlMSG = '<p>运行趟数：' + runInfo.count + '个整趟,' + runInfo.halfCount + '个半趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  //   } else {
  //     htmlMSG = '<p>运行趟数：' + runInfo.count + '整趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  //   }
  // } else {
  //   htmlMSG = '<p>运行趟数：' + runInfo.halfCount + '个半趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  // }
  const title = '在' + timestampsToTime(allSelctTime) + '内的轨迹信息：'
  trackInfoNotification = Notification({
    title: title,
    dangerouslyUseHTMLString: true,
    message: htmlMSG,
    duration: 0,
    position: 'top-right',
    offset: 0
  })
}
/**
 * 清除轨迹信息窗口
 */
export function clearTrackInfoWid() {
  if (trackInfoNotification !== null) {
    trackInfoNotification.close()
    trackInfoNotification = null
  }
}
/**
 * 清除轨迹
 */
export function clearTrack() {
  // console.log(123)
  if (pathSimplifierIns !== null) {
    pathSimplifierIns.clearPathNavigators()
    pathSimplifierIns.setData(null)
    pathSimplifierIns = null
  }
  if (runPoints.length > 0) {
    runPoints = []
  }
  if (dealPoints.length > 0) {
    dealPoints = []
  }
}
/**
 * 计算运行次数 runPoints集合的长度即代表运行次数
 * @param {Array} list 数据列表
 * @param {Number} sd 循环查询列表的起始点 初始为list.length - 1
 * @param {Number} ed 循环查询列表的结束点 默认为0
 * @param {Array} runPoints 运行时间节点对象的集合
 */
function countRunNums(list, sd, ed) {
  // console.log('countRunNums++')
  if (sd === ed) {
    return
  } // 结束运行条件
  let nsd = sd // 下一次查询的起始位置
  // console.log('countRunNums++' + sd + '|' + ed)
  var runPoint = {
    flag: null, // 标志位表明是否运行完: 0:没有 1:完成
    startPoint: null, // 本次运行时间段的起始时间点
    endPoint: null,
    indexs: [] // 本次运行时间段内包含的坐标数据在数据列表中的索引集合
  } // 运行时间节点对象
  // 起始点数据显示正在运行中
  if (list[sd].endRunTime === '0') {
    let startRunTimes = list[sd].startRunTime // 初始化该趟运行的起始时间
    runPoint.startPoint = new Date(startRunTimes)
    runPoint.indexs.push(sd)
    // 该点数据的gps时间与开始时间差在10秒内认为该点是本趟运行起始点，否则认为是运行的中间点
    if (intToDate(list[sd].gpsTime).getTime() - new Date(startRunTimes).getTime() < 10000) {
      runPoint.flag = 1
    } else {
      runPoint.flag = 0
    }
    // 寻找本趟运行的结束时间点
    for (let i = sd - 1; i >= ed; i--) {
      // 首先确定该条数据是否为本趟运行内数据（依靠startRunTime来判断，startRunTime与本趟运行起始时间相同则为该趟内数据）
      if (list[i].startRunTime + '' === startRunTimes + '') {
        runPoint.indexs.push(i)
        if (list[i].endRunTime !== '0') { // 使用endRunTime !== 0 表示运行停止
          runPoint.endPoint = new Date(list[i].endRunTime) // 获取运行的结束时间点
          runPoints.push(runPoint) // 收录运行节点
          nsd = i - 1 // 设置下一此查找的起始点
          break
        } else { // list[i].endRunTime === '0'
          if (i === ed) { // 遍历完数据集合仍没有结束运行
            runPoint.endPoint = intToDate(list[i].gpsTime) // 用该条（最后一条）数据的gps时间代替;注意转换数据格式
            runPoint.flag = 0
            runPoints.push(runPoint) // 收录运行节点
            nsd = ed
            return
          }
        }
      } else {
        // 确定该条数据属于下一趟运行的起始数据（该条数据startRunTime与本趟运行起始时间不相同）
        // 此情况只会存在于两条包含不同的startRunTime数据之间没有endRunTime（结束运行时间）的情况，若之间存在endRunTime则会归属于上面的情况中
        // 因此使用该条数据索引的上一条数据的gpsTime作为该趟运行的endRunTime
        runPoint.endPoint = intToDate(list[i + 1].gpsTime) // 获取运行的结束时间点;注意转换数据格式
        runPoint.flag = 0
        runPoints.push(runPoint) // 收录运行节点
        nsd = i // 设置下一此查找的起始点
        break
      }
    }
    // 判断条件递归运行下一次查询
    if (nsd > ed) {
      countRunNums(list, nsd, ed)
    }
  } else { // 起始点数据显示未运行
    let tempsd = null
    let startRunTimes = ''
    // 寻找开始运行的第一条数据
    for (let i = sd - 1; i >= ed; i--) {
      if (list[i].endRunTime === '0') { // endRunTime===‘0’表示运行中
        startRunTimes = list[i].startRunTime
        runPoint.startPoint = new Date(startRunTimes)
        runPoint.indexs.push(i)
        runPoint.flag = 1
        tempsd = i - 1
        break
      }
      if (i === ed && list[i].endRunTime === '0') { // 遍历完数据仍没有开始运行 即该段数据全是未运行
        tempsd = ed
        return
      }
    }
    if (tempsd <= ed) { // 最后一条数据为开始点则不收录不再寻找结束点
      nsd = ed
      return
    }
    // 寻找运行的结束时间点
    for (let i = tempsd; i >= ed; i--) {
      if (list[i].startRunTime + '' === startRunTimes + '') {
        runPoint.indexs.push(i)
        if (list[i].endRunTime !== '0') {
          runPoint.endPoint = new Date(list[i].endRunTime)
          runPoints.push(runPoint)
          nsd = i - 1
          break
        } else { // list[i].endRunTime === '0'
          if (i === ed) {
            runPoint.endPoint = intToDate(list[i].gpsTime)
            runPoint.flag = 0
            runPoints.push(runPoint)
            nsd = ed
            return
          }
        }
      } else {
        runPoint.endPoint = intToDate(list[i + 1].gpsTime)
        runPoint.flag = 0
        runPoints.push(runPoint)
        nsd = i
        break
      }
    }
    if (nsd > ed) {
      countRunNums(list, nsd, ed)
    }
  }
}
/**
 * 运行趟数数据处理函数，主要是处理时间错位问题，并返回处理之后的运行趟数对象集合
 * @param {List[runPoint{}]} points
 * @returns {List[runPoint{}]} dealPoints
 */
function dealRunNums(points) {
  // console.log('dealRunNums')
  const length = points.length
  // 参数内容为空；则返回空集合
  if (length === 0) {
    return []
  }
  let tempPoints = [] // 处理后的运行趟数对象集合
  // 第1遍清洗，将时间差小于4秒（误操作产生的碎片数据）的对象标记删除‘x’
  for (let i = 0; i < length; i++) {
    if (points[i] === 'x') { continue }
    if (points[i].endPoint.getTime() - points[i].startPoint.getTime() <= 3000) { // 小于3秒的轨迹舍去
      points[i] = 'x'
    }
  }
  // 第2遍清洗，将开始(结束)时间相同、结束(开始)时间错位的数据做相应延拓和标记
  for (let i = 0; i < length; i++) {
    if (points[i] === 'x') { continue }
    for (let j = 0; j < length; j++) {
      if (j === i) { continue }
      if (points[j] === 'x') { continue }
      if (points[j].startPoint.getTime() === points[i].startPoint.getTime()) { // 起始时间相同保留停止时间大的
        if (points[j].endPoint.getTime() <= points[i].endPoint.getTime()) {
          points[i].indexs.push(...points[j].indexs)
          points[i].flag = points[j].flag
          points[j] = 'x'
        } else {
          points[i].endPoint = points[j].endPoint
          points[i].indexs.push(...points[j].indexs)
          points[i].flag = points[j].flag
          points[j] = 'x'
        }
      }
    }
  }

  // 第3编清洗，处理相互不完全嵌套的数据
  for (let i = 0; i < length; i++) {
    if (points[i] === 'x') { continue }
    for (let j = 0; j < length; j++) {
      if (j === i) { continue }
      if (points[j] === 'x') { continue }
      if (points[j].startPoint.getTime() >= points[i].startPoint.getTime()) {
        if (points[j].startPoint.getTime() < points[i].endPoint.getTime()) {
          // 数据存在粘连，调整起止时间并将提供调整数据的对象打删除标记，保留被调整对象
          if (points[j].endPoint.getTime() > points[i].endPoint.getTime()) {
            points[i].indexs.push(...points[j].indexs)
            points[i].endPoint = points[j].endPoint
            points[i].flag = points[j].flag
            points[j] = 'x'
          } else { // 数据嵌套删除嵌套内数据
            points[i].indexs.push(...points[j].indexs)
            points[i].flag = points[j].flag
            points[j] = 'x'
          }
        }
      }
    }
  }
  // 遍历趟数对象集合，将打删除标记的对象清除，并更新处理后的趟数对象集合
  for (let i = 0; i < length; i++) {
    if (points[i] === 'x') { continue}
    tempPoints.push(points[i])
  }
  function sortFun (a,b) { // 反向比较
    // console.log(a,b)
    return b-a
  }
  // 将indexs反向排序
  for (let i = 0; i < tempPoints.length; i++) {
    tempPoints[i].indexs.sort(sortFun)
  }
  return tempPoints
}
/**
 * 计算运行时间
 * @param {Array} runPoints 运行时间节点对象的集合
 * @param {timestamps} seletTime 用户选择的时间长度时间长度毫秒
 * @returns {runInfo} runInfo 运行信息对象{次数，半次数，运行时间，停止时间}
 */
function countRunTime(dealPoints, selectStartTime, selectEndTime) {
  const StartTime = selectStartTime.getTime()
  const EndTime = selectEndTime.getTime()
  const length = dealPoints.length
  // 返回的运行信息对象
  const runInfo = {
    halfCount: 0,
    count: 0,
    runTime: 0,
    stopTime: 0
  }
  // 运行次数集合为空则返回：运行次数为0,运行时间为0
  if (length === 0) {
    return runInfo
  }
  for (let i = 0; i < length; i++) {
    const runPoint = dealPoints[i]
    var strT, endT
    if (runPoint.startPoint === null || runPoint.endPoint === null) {
      continue
    }
    strT = runPoint.startPoint.getTime()
    endT = runPoint.endPoint.getTime()
    if (strT < StartTime) {
      strT = StartTime
    }
    if (endT > EndTime) {
      endT = EndTime
    }
    runInfo.runTime = runInfo.runTime + (endT - strT)
    if (runPoint.indexs.length > 30) { // 坐标数据少的不算轨迹次数
      if (runPoint.flag === 1) {
        runInfo.count++
      } else {
        runInfo.halfCount++
      }
    }
  }
  runInfo.stopTime = (EndTime - StartTime) - runInfo.runTime
  return runInfo
}
