import AMap from 'AMap'
import AMapUI from 'AMapUI'
import { getAllGPSByIdTime, getAllGPSByIdTimeBetween } from "@/api/GPSinfo"
let trailmap // 全局地图
let pathSimplifierIns // 全局简单轨迹线

// 地图初始化函数
export function initMap() {
  trailmap = new AMap.Map('trailmap', {
    center: [118.789582, 32.019405],
    zoom: 16
  })
  trailmap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
    trailmap.addControl(new AMap.ToolBar())
    trailmap.addControl(new AMap.Scale())
  })
}

/**
 * 坐标获取与数量处理
 * @param number shipId
 * @param number startTime
 * @return Promise Array.<AMap.LngLat> gps
 */
function getlngLats1(shipId, startTime) {
  const gps = [] // 处理后的坐标组
  return new Promise((resolve, rejects) => {
    getAllGPSByIdTime(shipId, startTime).then(response => {
      const data = response.data // 返回的坐标数据
      const gpslength = data.length
      if (data && data !== null && gpslength > 0) {
        if (gpslength > 70) {
          const jump = parseInt(gpslength / 70)
          for (let i = 0; i < gpslength; i += jump) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(new AMap.LngLat(data[i].longitude, data[i].latitude))
            }
          }
        } else {
          for (let i = 0; i < gpslength; i++) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(new AMap.LngLat(data[i].longitude, data[i].latitude))
            }
          }
        }
        // console.log(gps)
        resolve(gps)
        return
      } else {
        rejects('获取数据为空')
      }
    }).catch(errer => {
      rejects('获取数据为空')
    })
  })
}

function getlngLats2(shipId, startTime, endTime) {
  const gps = [] // 处理后的坐标组
  return new Promise((resolve, rejects) => {
    getAllGPSByIdTimeBetween(shipId, startTime, endTime).then(response => {
      const data = response.data // 返回的坐标数据
      const gpslength = data.length
      if (data && data !== null && gpslength > 0) {
        if (gpslength > 70) {
          const jump = parseInt(gpslength / 70)
          for (let i = 0; i < gpslength; i += jump) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(new AMap.LngLat(data[i].longitude, data[i].latitude))
            }
          }
        } else {
          for (let i = 0; i < gpslength; i++) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(new AMap.LngLat(data[i].longitude, data[i].latitude))
            }
          }
        }
        // console.log(gps)
        resolve(gps)
        return
      } else {
        rejects('获取数据为空')
      }
    }).catch(errer => {
      rejects('获取数据为空')
    })
  })
}

/** 坐标批量转换函数
 * Promise
 * @param Array.<AMap.LngLat> gps
 * @resolve <AMap.LngLat> gdlngLats
 **/
function lngLatsTrans(gps) {
  return new Promise((resolve, rejects) => {
    AMap.convertFrom(gps, 'gps', (status, result) => {
      if (result.info === 'ok') {
        const lngLats = result.locations // Array.<LngLat>
        resolve(lngLats)
      }
    })
  })
}

/**
 * 轨迹绘制函数
 * @param Array.<AMap.LngLat>||AMap.LngLat lngLats
 */
function trailMaker(lngLats) {
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
    if (pathSimplifierIns) {
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
        return pathData.name + '，点数量：' + pathData.path.length + '，播放速度：300km/h'
      },
      renderOptions: defaultRenderOptions
    })
    // window.pathSimplifierIns = pathSimplifierIns;
    // 设置数据构建一条简单的轨迹
    pathSimplifierIns.setData([
      {
        name: '船只的运行轨迹',
        path: lngLats
      }
    ])
    // 创建一个巡航器，关联第1条轨迹（轨迹1）
    var navg = pathSimplifierIns.createPathNavigator(0, {
      loop: true, // 循环播放
      speed: 300 // 巡航速度，单位千米/小时
    })
    navg.start()
  }
}
/**
 * 绘制轨迹函数
 * @param number shipId 船号
 * @param number startTime 开始时间
 */
export function makeTrail1(shipId, startTime) {
  getlngLats1(shipId, startTime).then(response => {
    lngLatsTrans(response).then(response => {
      trailMaker(response)
    }).catch(errer => console.log(errer))
  }).catch(errer => {
    console.log(errer)
  })
}

export function makeTrail2(shipId, startTime, endTime) {
  getlngLats2(shipId, startTime, endTime).then(response => {
    lngLatsTrans(response).then(response => {
      trailMaker(response)
    }).catch(errer => console.log(errer))
  }).catch(errer => {
    console.log(errer)
  })
}

/**
 * 时间格式化函数
 * @param {Date} datetime
 * @return Int datetime yyyyMMddHHmmss
 */
export function dateToInt(datetime) {
  datetime = new Date(datetime)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 // js从0开始取
  var date = datetime.getDate()
  var hour = datetime.getHours()
  var minutes = datetime.getMinutes()
  var second = datetime.getSeconds()
  year = String(year)
  String(month).length < 2 ? month = '0' + month : month
  String(date).length < 2 ? date = '0' + date : date
  String(hour).length < 2 ? hour = '0' + hour : hour
  String(minutes).length < 2 ? minutes = '0' + minutes : minutes
  String(second).length < 2 ? second = '0' + second : second
  var time = year + month + date + hour + minutes + second // '20090612171805'
  return parseInt(time)
}
