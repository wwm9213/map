/*
 * @Date: 2022-03-01 14:24:30
 * @Author: wwm
 * @LastEditTime: 2022-03-02 14:12:25
 * @LastEditors: wwm
 * @Description: ...
 */
import AMapLoader from '@amap/amap-jsapi-loader';

const map = (el, options = {}) => {
  var maps = null;
  AMapLoader.load({
    key: 'ed25f024d0d74976a45d48219883c294', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      maps = new AMap.Map(el, options);
    })
    .catch((e) => {
      console.log(e);
    });

  return maps;
};

export default map
