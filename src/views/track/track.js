import AMap from 'AMap'
import AMapUI from 'AMapUI'
import { getAllGPSByIdTime, getAllGPSByIdTimeBetween } from "@/api/GPSinfo"
let trailmap // 全局地图
let pathSimplifierIns // 全局简单轨迹线

// 地图初始化函数
export function initMap() {
  trailmap = new AMap.Map('trailmap', {
    center: [118.789582, 32.019405],
    zoom: 19
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
function getlngLats(shipId, startTime, endTime) {
  const gps = [] // 处理后的坐标组
  const params = arguments.length
  return new Promise((resolve, rejects) => {
    if (params < 3) {
      getAllGPSByIdTime(shipId, startTime).then(response => {
        const data = response.data // 返回的坐标数据
        const gpslength = data.length
        if (data !== null && gpslength !== 0) {
          if (gpslength > 40) {
            const num = gpslength / 40
            for (let i = 0; i < gpslength; i += num) {
              ((i) => {
                gps.push(new AMap.LngLat(data[i].longitude / 100, data[i].latitude / 100))
              })(i)
            }
          } else {
            for (let i = 0; i < gpslength; i++) {
              ((i) => {
                gps.push(new AMap.LngLat(data[i].longitude / 100, data[i].latitude / 100))
              })(i)
            }
          }
          resolve(gps)
        } else {
          console.log('获取数据为空')
          rejects('获取数据为空')
        }
      }).catch(errer => {
        rejects(errer)
      })
    } else {
      getAllGPSByIdTimeBetween(shipId, startTime, endTime).then(response => {
        const data = response.data // 返回的坐标数据
        const gpslength = data.length
        if (data !== null && gpslength !== 0) {
          if (gpslength > 40) {
            const num = gpslength / 40
            for (let i = 0; i < gpslength; i += num) {
              ((i) => {
                gps.push(new AMap.LngLat(data[i].longitude / 100, data[i].latitude / 100))
              })(i)
            }
          } else {
            for (let i = 0; i < gpslength; i++) {
              ((i) => {
                gps.push(new AMap.LngLat(data[i].longitude / 100, data[i].latitude / 100))
              })(i)
            }
          }
          resolve(gps)
        } else {
          console.log('获取数据为空')
          rejects('获取数据为空')
        }
      }).catch(errer => {
        rejects(errer)
      })
    }
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
  AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier, $) => {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！')
      return
    }
    initPage(PathSimplifier)
  })
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
          return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length // 鼠标悬停在某个轨迹节点上
        }
        // 鼠标悬停在节点之间的连线上
        return pathData.name + '，点数量' + pathData.path.length
      },
      renderOptions: { // 轨迹线的样式
        renderAllPointsIfNumberBelow: 100 // 绘制路线节点，如不需要可设置为-1
      }
    })
    // window.pathSimplifierIns = pathSimplifierIns;
    // 设置数据构建一条简单的轨迹
    pathSimplifierIns.setData([
      {
        name: '运行轨迹',
        path: lngLats
      }
    ])
    // 创建一个巡航器，关联第1条轨迹（轨迹1）
    var navg1 = pathSimplifierIns.createPathNavigator(0, {
      loop: true, // 循环播放
      speed: 250 // 巡航速度，单位千米/小时
    })
    navg1.start()
  }
}
/**
 * 绘制轨迹函数
 * @param number shipId 船号
 * @param number startTime 开始时间
 */
export function makeTrail(shipId, startTime, endTime) {
  getlngLats(shipId, startTime, endTime).then(response => {
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
 * @return String datetime yyyyMMddHHmmss
 */
export function dateToStr(datetime) {
  datetime = new Date(datetime)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 // js从0开始取
  var date = datetime.getDate()
  var hour = datetime.getHours()
  var minutes = datetime.getMinutes()
  var second = datetime.getSeconds()
  if (month < 10) {
    month = "0" + month
  }
  if (date < 10) {
    date = "0" + date
  }
  if (hour < 10) {
    hour = "0" + hour
  }
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  if (second < 10) {
    second = "0" + second
  }
  var time = year + month + date + hour + minutes + second // 20090612171805
  return time
}
