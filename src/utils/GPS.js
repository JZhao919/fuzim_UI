
var GPS = {
  PI: 3.14159265358979324,
  x_pi: 3.14159265358979324 * 3000.0 / 180.0,
  delta: function(lon, lat) {
    var a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
    var dLat = this.transformLat(lon - 105.0, lat - 35.0)
    var dLon = this.transformLon(lon - 105.0, lat - 35.0)
    var radLat = lat / 180.0 * this.PI
    var magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI)
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI)
    return { 'lon': dLon, 'lat': dLat }
  },

  // WGS-84 to GCJ-02
  gcj_encrypt: function(wgsLon, wgsLat) {
    if (this.outOfChina(wgsLon, wgsLat)) {
      console.log('outOfChina')
      console.log(wgsLon + wgsLat)
      // return {'lat': wgsLat, 'lon': wgsLon }
      // return [wgsLon, wgsLat]
      return [118.789582, 32.019405]
    }
    var d = this.delta(wgsLon, wgsLat)
    // return { 'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon }
    return [wgsLon + d.lon, wgsLat + d.lat]
  },
  // GCJ-02 to WGS-84
  gcj_decrypt: function(gcjLon, gcjLat) {
    if (this.outOfChina(gcjLon, gcjLat)) {
      return { 'lon': gcjLon, 'lat': gcjLat }
    }
    var d = this.delta(gcjLat, gcjLon)
    return { 'lon': gcjLon - d.lon, 'lat': gcjLat - d.lat }
  },
  // GCJ-02 to WGS-84 exactly
  gcj_decrypt_exact: function(gcjLon, gcjLat) {
    var initDelta = 0.01
    var threshold = 0.000000001
    var dLat = initDelta
    var dLon = initDelta
    var mLat = gcjLat - dLat
    var mLon = gcjLon - dLon
    var pLat = gcjLat + dLat
    var pLon = gcjLon + dLon
    var wgsLat, wgsLon
    var i = 0
    // eslint-disable-next-line
    while (i) {
      wgsLat = (mLat + pLat) / 2
      wgsLon = (mLon + pLon) / 2
      var tmp = this.gcj_encrypt(wgsLat, wgsLon)
      dLat = tmp.lat - gcjLat
      dLon = tmp.lon - gcjLon
      if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) { break }
      if (dLat > 0) { pLat = wgsLat } else { mLat = wgsLat }
      if (dLon > 0) { pLon = wgsLon } else { mLon = wgsLon }
      if (++i > 10000) { break }
    }
    return { 'lon': wgsLon, 'lat': wgsLat }
  },
  // GCJ-02 to BD-09
  bd_encrypt: function(gcjLon, gcjLat) {
    var x = gcjLon
    var y = gcjLat
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi)
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi)
    var bdLon = z * Math.cos(theta) + 0.0065
    var bdLat = z * Math.sin(theta) + 0.006
    return { 'lon': bdLon, 'lat': bdLat }
  },
  // BD-09 to GCJ-02
  bd_decrypt: function(bdLon, bdLat) {
    var x = bdLon - 0.0065
    var y = bdLat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi)
    var gcjLon = z * Math.cos(theta)
    var gcjLat = z * Math.sin(theta)
    return { 'lon': gcjLon, 'lat': gcjLat }
  },
  // WGS-84 to Web mercator
  // mercatorLat -> y mercatorLon -> x
  mercator_encrypt: function(wgsLon, wgsLat) {
    var x = wgsLon * 20037508.34 / 180.0
    var y = Math.log(Math.tan((90.0 + wgsLat) * this.PI / 360.0)) / (this.PI / 180.0)
    y = y * 20037508.34 / 180.0
    return { 'lon': x, ' lat': y }
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorLon -> x
  mercator_decrypt: function(mercatorLon, mercatorLat) {
    var x = mercatorLon / 20037508.34 * 180.0
    var y = mercatorLat / 20037508.34 * 180.0
    y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.0)) - this.PI / 2)
    return { 'lon': x, 'lat': y }
  },
  // two point's distance
  distance: function(lonA, latA, lonB, latB) {
    var earthR = 6371000.0
    var x = Math.cos(latA * this.PI / 180.0) * Math.cos(latB * this.PI / 180.0) * Math.cos((lonA - lonB) * this.PI / 180.0)
    var y = Math.sin(latA * this.PI / 180.0) * Math.sin(latB * this.PI / 180.0)
    var s = x + y
    if (s > 1) s = 1
    if (s < -1) s = -1
    var alpha = Math.acos(s)
    var distance = alpha * earthR
    return distance
  },
  // outOfChina
  outOfChina: function(lon, lat) {
    if (lon < 72.004 || lon > 137.8347) { return true }
    if (lat < 0.8293 || lat > 55.8271) { return true }
    return false
  },
  transformLat: function(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0
    return ret
  },
  transformLon: function(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0
    return ret
  }
}
export default GPS
