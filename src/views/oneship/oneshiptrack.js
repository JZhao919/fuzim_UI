import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
let oneshipmap = null // 全局单船地图变量
let oneshipSimplifier = null // 单船简单轨迹线对象
let oneshipNavigator = null // 单船轨迹巡航器对象
let oneshipIconUrl = null // 单船轨迹图标链接
let oneshipTrackData = [] // 单船轨迹坐标数据组
let oneshipTrackIndex = 0 // 单船轨迹坐标索引
var tracks = [{
  name: '轨迹巡航',
  path: oneshipTrackData
}] // 单船简单轨迹线数据

/**
* 地图初始化函数
*/
export function initmap() {
  if (oneshipmap !== null) {
    oneshipmap = null
  }
  oneshipmap = new AMap.Map('oneshipmap', {
    mapStyle: 'amap://styles/12cb5f735c7e70f55c221548b0e11763', // 设置地图的显示样式
    center: [118.789279, 32.019657],
    zoom: 16,
    // dragEnable: false,
    keyboardEnable: false,
    doubleClickZoom: false
  })
  oneshipmap.plugin(['AMap.Scale'], function() {
    oneshipmap.addControl(new AMap.Scale())
  })
}
/**
 * 初始化绘制轨迹
 * @param {LngLat[]} LngLat
 * @param {String} iconUrl
 */
function initTrack(iconUrl) {
  // 加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
  AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！')
      return
    }
    // 启动页面
    initPage(PathSimplifier)
  })
  function initPage(PathSimplifier) {
    function pathNavigatorStyle() {
      return {
        initRotateDegree: 0,
        width: 16,
        height: 16,
        autoRotate: true,
        lineJoin: "round",
        content: PathSimplifier.Render.Canvas.getImageContent(iconUrl, function onload() { oneshipSimplifier.renderLater() }, function onerror(e) { }),
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
    } // 巡航器样式
    // 轨迹线的样式
    var defaultRenderOptions = {
      renderAllPointsIfNumberBelow: 100, // 绘制路线节点，如不需要可设置为-1
      pathNavigatorStyle: pathNavigatorStyle()
    }
    // 创建组件实例
    if (oneshipSimplifier === null) {
      // console.log('初始化轨迹')
      oneshipSimplifier = new PathSimplifier({
        zIndex: 100,
        // autoSetFitView:false,
        map: oneshipmap, // 所属的地图实例
        getPath: function(pathData, pathIndex) {
          // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
          return pathData.path
        },
        getHoverTitle: function(pathData, pathIndex, pointIndex) {
          // 返回鼠标悬停时显示的信息
          if (pointIndex >= 0) {
            return pathData.name + '，当前点：' + (pointIndex + 1) + '/' + pathData.path.length // 鼠标悬停在某个轨迹节点上
          }
          // 鼠标悬停在节点之间的连线上
          return pathData.name + '，点数量：' + pathData.path.length + '，播放速度：50km/h'
        },
        renderOptions: defaultRenderOptions,
        // 设置轨迹数据
        data: tracks
      })
      // 创建一个巡航器 // 关联第1条轨迹
      if (oneshipNavigator !== null) {
        oneshipNavigator.destroy()
        oneshipNavigator = null
      }
      oneshipNavigator = oneshipSimplifier.createPathNavigator(0, {
        loop: false, // 循环播放
        speed: 50
      })
      oneshipNavigator.start()
    } else {
      // console.log('重置轨迹')
      if (oneshipNavigator === null) { // 巡航器不存在 // 重新创建巡航器
        oneshipSimplifier.setData(tracks) // 重新绘制路径
        oneshipNavigator = oneshipSimplifier.createPathNavigator(0, {
          pathNavigatorStyle: pathNavigatorStyle(), // 重新绘制巡航器样式
          loop: false, // 循环播放
          speed: 50
        })
        oneshipNavigator.start()
      } else { // 巡航器存在
        oneshipTrackIndex = oneshipNavigator.getCursor().clone() // 保存巡航器的位置
        // const status = oneshipNavigator.getNaviStatus() // 保存巡航器状态
        oneshipNavigator.destroy() // 销毁巡航器
        oneshipSimplifier.setData(tracks) // 重新绘制路径
        oneshipNavigator = oneshipSimplifier.createPathNavigator(0, {
          pathNavigatorStyle: pathNavigatorStyle(),
          loop: false, // 循环播放
          speed: 50
        })
        oneshipNavigator.start()
        // 恢复巡航器的位置
        oneshipNavigator.moveToPoint(oneshipTrackIndex.idx, oneshipTrackIndex.tail)
      }
    }
  }
}

// 绘制轨迹
export function drowTrack(longitude, latitude, iconUrl) {
  let lngLat
  if (longitude === 0 || latitude === 0 || !longitude || !latitude) {
    lngLat = [118.789381, 32.019571]
  } else {
    lngLat = GPS.gcj_encrypt(longitude, latitude) // 转换坐标
  }
  if (oneshipTrackData.length === 0) {
    oneshipIconUrl = iconUrl
    oneshipTrackData.push(lngLat)
  } else {
    const lastlnglat = oneshipTrackData[oneshipTrackData.length - 1]
    if (lastlnglat[0] !== lngLat[0] || lastlnglat[1] !== lngLat[1]) { // 比较当前坐标有无变动
      oneshipIconUrl = iconUrl
      oneshipTrackData.push(lngLat)
    } else {
      if (oneshipIconUrl === iconUrl) {
        // console.log('no-change')
        return
      }
    }
  }
  tracks[0].path = oneshipTrackData
  initTrack(iconUrl)
}
/**
 * 清除轨迹
 */
export function clearTracks() {
  if (oneshipSimplifier !== null) {
    oneshipSimplifier.clearPathNavigators()
    oneshipSimplifier.setData(null)
    oneshipSimplifier = null
  }
  if (oneshipNavigator !== null) {
    oneshipNavigator = null
  }
  if (oneshipTrackData.length !== 0) {
    oneshipTrackData = []
  }
  oneshipTrackIndex = 0
}
/**
 * 清除地图
 */
export function clearMap() {
  if (oneshipmap !== null) {
    oneshipmap.clearMap()
    oneshipmap.destroy()
    oneshipmap = null
  }
}
