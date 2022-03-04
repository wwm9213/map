<template>
  <div class="wrap">
    <div id="container" class="container"></div>
    <button class="btn" ref="start">开始编辑</button>
    <button class="btn" ref="end">结束编辑</button>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "ed25f024d0d74976a45d48219883c294", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          "AMap.ToolBar",
          "AMap.Scale",
          "AMap.HawkEye",
          "AMap.MapType",
          "AMap.Geolocation",
          "AMap.CircleEditor",
          "AMap.PolygonEditor",
        ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          const map = new AMap.Map("container", {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            terrain: true, // 开启地形图
            zoom: 15, //初始化地图级别
          });

          window.AMap = AMap;

          map.addControl(new AMap.ToolBar());

          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale());

          // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
          map.addControl(new AMap.HawkEye({ isOpen: true }));

          // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          map.addControl(new AMap.MapType());

          // 定位
          // AMap.plugin("AMap.Geolocation", function () {
          //   var geolocation = new AMap.Geolocation({
          //     enableHighAccuracy: true, //是否使用高精度定位，默认:true
          //     timeout: 10000, //超过10秒后停止定位，默认：无穷大
          //     maximumAge: 0, //定位结果缓存0毫秒，默认：0
          //     convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          //     showButton: true, //显示定位按钮，默认：true
          //     buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          //     buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          //     showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          //     showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          //     panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          //     zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          //   });

          //   geolocation.getCurrentPosition(function (status, result) {
          //     console.log(status, result);
          //   });
          // });

          this.map = map;

          // 圆形区域
          this.createCircle();

          // 多边形区域
          this.createPolygon();

          this.mapEventCenter(this.map);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // 事件分发中心
    mapEventCenter(map) {
      map.on("complete", this.mapComplete);
      map.on("click", this.mapClick);
      map.on("movestart", this.mapMovestart);
      map.on("mapmove", this.mapMove);
      map.on("moveend", this.mapMoveend);
    },

    // 地图加载完成
    mapComplete(e) {
      console.log("地图加载完成", e, this.map);
      console.log(this.map.getCenter());
      this.map.getCity((res) => {
        console.log(res);
      });
    },

    mapClick(e) {
      console.log("点击地图", `[${e.lnglat.getLng()},${e.lnglat.getLat()}]`);
    },

    mapMovestart(e) {
      console.log("地图开始移动", e);
    },

    mapMove() {
      // console.log("地图移动中", e);
    },

    mapMoveend(e) {
      console.log("地图停止移动", e);
    },

    // 创建圆形区域
    createCircle() {
      const AMap = window.AMap;
      const map = this.map;

      const circle = new AMap.Circle({
        center: [116.433322, 39.900255],
        radius: 1000, //半径
        borderWeight: 3,
        // strokeColor: "#FF33FF",
        // strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        strokeStyle: "dashed",
        strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: "#1791fc",
        zIndex: 999,
      });

      map.add(circle);
      // 缩放地图到合适的视野级别
      map.setFitView([circle]);

      const circleEditor = new AMap.CircleEditor(map, circle);

      circleEditor.on("move", function (e) {
        console.info("触发事件：move", e.target);
      });

      circleEditor.on("adjust", function (e) {
        console.info("触发事件：adjust", e.target);
      });

      circleEditor.on("end", function (e) {
        console.info("触发事件： end", e.target);
        // event.target 即为编辑后的圆形对象
      });

      this.$refs.start.onclick = function () {
        circleEditor.open();
      };

      this.$refs.end.onclick = function () {
        circleEditor.close();
      };
    },

    // 创建多边形区域
    createPolygon() {
      const AMap = window.AMap;
      const map = this.map;
      const path = [
        [116.403322, 39.920255],
        [116.410703, 39.897555],
        [116.402292, 39.892353],
        [116.389846, 39.891365],
      ];

      const polygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: "#1791fc",
        zIndex: 50,
        bubble: true,
      });

      map.add([polygon]);

      // 缩放地图到合适的视野级别
      map.setFitView();

      const polyEditor = new AMap.PolygonEditor(map, polygon);

      polyEditor.open();
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.container {
  width: 80%;
  height: 80%;
}
</style>
