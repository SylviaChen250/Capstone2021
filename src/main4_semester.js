// var reader = new jsts.io.WKTReader();
// var a = reader.read('POLYGON ((1 1,5 1,5 5,1 5,0.5 4,1 1))');

// const { string } = require("yargs");

// var b = reader.read('POLYGON ((1 1,5 1,5 5,1 5,1 1))');
var lam = 0.001;
// var difference = a.difference(b);
// console.log(difference);
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzkxZjc2MC03MWY2LTRkYjMtOGJkYy1hNTY5MmQ2MTdiMTgiLCJpZCI6NjEzOTQsImlhdCI6MTYyNjA1MTY2MH0.KU9MmCBbaayiw6PGwuNp7qP0jRphMYWMzCvRQnIMQ9g'
var viewer = new Cesium.Viewer("cesiumContainer");

//环绕飞行
//    var options = {

//                 lng: 144.9678,
//                  lat: -37.81573,
//                  height: 300,
//                  heading: 0.0,
//                  pitch: 0.0,
//                 roll: 0.0
//              };
// var position = Cesium.Cartesian3.fromDegrees(options.lng, options.lat, options.height);
// // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
//     var pitch = Cesium.Math.toRadians(-30);
//     // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
//     var angle = 360 / 30;
//     // 给定相机距离点多少距离飞行，这里取值为5000m
//     var distance = 5000;
//     var startTime = Cesium.JulianDate.fromDate(new Date());

//    // var stopTime = Cesium.JulianDate.addSeconds(startTime, 10, new Cesium.JulianDate());

//     viewer.clock.startTime = startTime.clone();  // 开始时间
//    // viewer.clock.stopTime = stopTime.clone();     // 结速时间
//     viewer.clock.currentTime = startTime.clone(); // 当前时间
//     viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
//     viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
//     // 相机的当前heading
//     var initialHeading = viewer.camera.heading;
//     var Exection = function TimeExecution() {
//             // 当前已经过去的时间，单位s
//             var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
//             var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
//             viewer.scene.camera.setView({
//                 destination :position, // 点的坐标
//                 orientation:{
//                     heading: heading,
//                     pitch : pitch,

//                 }
//             });
//             viewer.scene.camera.moveBackward(distance);

//        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
//                 viewer.clock.onTick.removeEventListener(Exection);
//             }
//     };

//     viewer.clock.onTick.addEventListener(Exection);


// viewer.dataSources.add(ray_dataSource);

// const viewer = new Cesium.Viewer('cesiumContainer', {
//     terrainProvider: Cesium.createWorldTerrain()
//   });
viewer.scene.globe.depthTestAgainstTerrain = true;
// var viewPoint = Cesium.Cartesian3.fromDegrees(144.9678, -37.82117, 10);
// // debugger
// var webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
// var viewPointWebMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(viewPoint));
// console.log('scene',viewer.scene.entities);
// viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.81573, 10000000) });
// setTimeout(() => {
  viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.99053424, -37.81174189, 200) });

// }, 6000);
var instrumentFlag = null;
var calculationStatus = null;
function addAntenna() {
  // createPoint()
  instrumentFlag = 'antenna';
  //console.log(instrumentFlag)
}
function addReceiver() {
  // createPoint()
  instrumentFlag = 'receiver';
  //console.log('?', instrumentFlag)
}
function addRelay() {
  // createPoint()
  instrumentFlag = 'relay';
  //console.log('?', instrumentFlag)
}

var antennaArray = [];
var receiverArray = [];
let relayArray = [];

function handleClickCalculate() {
  calculationStatus = 'ok';
}

// viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.81573, 1000) });

var melmodel;
var mel = Cesium.GeoJsonDataSource.load('../src/smallData.json', {
  clampToGround: true
}).then(function (dataSource) {

  viewer.dataSources.add(dataSource).then(res => {
    // viewer.zoomTo(dataSources);
    test = res;
    test.name = '测试';
    var entities = dataSource.entities.values;
    melmodel = entities;

    entities.forEach(element => {

      element.polygon.outline = Cesium.Color.fromCssColorString('#41b6c4');
      element.polygon.extrudedHeight = element.properties['f_height'];
      element.polygon.material = Cesium.Color.fromCssColorString('#41b6c4');
      // console.log(entities.geometry.coordinates[0][0]);

    });







    var fromProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
    var toProjection = '+proj=utm +zone=55 +south +datum=WGS84 +units=m +no_defs';
    var transformPoint = proj4(fromProjection, toProjection, [-108.0, 40.0]);
    // var inv_pos=proj4(toProjection, fromProjection,transformPoint);
    // console.log(inv_pos);
    // console.log(transformPoint);
    // console.log(Cesium.Cartesian3.fromDegrees(-108.0, 40.0, 100000));


    var pl_set = [];
    // var plg_set=[];
    // var vertex_lt = [];
    //直接按照geojson的格式获取建筑物底面平面的顶点
    window.onload = function () {
      var url = '../src/smallData.json'/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
      var request = new XMLHttpRequest();
      request.open("get", url);/*设置请求方法与路径*/
      request.send(null);/*不发送数据到服务器*/
      request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
          var json = JSON.parse(request.responseText);
          // for(var i=0;i<json.length;i++){
          //     // console.log(json[i]);
          // }
          // var test1=proj4(fromProjection, toProjection,json.features[0].geometry.coordinates[0][0][1]);
          // var test2=proj4(fromProjection, toProjection,json.features[0].geometry.coordinates[0][0][2]);
          // test1.push(0);
          // test2.push(0);
          // var v11=[test1[0]-test2[0],test1[1]-test2[1]];
          // console.log(v11);
          // var ppt1=Cesium.Cartesian3.fromDegrees(json.features[0].geometry.coordinates[0][0][0][0],json.features[0].geometry.coordinates[0][0][0][1]);
          // var ppt2=Cesium.Cartesian3.fromDegrees(json.features[0].geometry.coordinates[0][0][1][0],json.features[0].geometry.coordinates[0][0][1][1]);
          // var shape3 = viewer.entities.add({
          //     polyline: {
          //       positions: [ppt1,ppt2],
          //       clampToGround: false,
          //       width: 3,
          //       material: Cesium.Color.BLUE
          //     },
          //   });

          // console.log(json.features[84].geometry.coordinates[0][0][0]);
          // console.log(json.features[84].properties.f_height);


          //888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
          //计算前20个建筑物的面参数
          var ent_len = json.features.length
          for (let ent_len_id = 0; ent_len_id <= ent_len - 1; ent_len_id++) {
            // var top_vex=[]
            //console.log('gggg',json.features[ent_len_id].material)
            var matrl = json.features[ent_len_id].material
            var num_pt = json.features[ent_len_id].geometry.coordinates[0][0].length;
            //循环建筑物底面的每个顶点
            for (let i = 0; i <= num_pt - 2; i++) {
              var heit = json.features[ent_len_id].properties.f_height;
              //pt1,pt2是当前面的其中两个顶点，都在地上，pt3是当前面的另一个顶点，就是在pt1的基础上加了个height
              var pt1 = proj4(fromProjection, toProjection, json.features[ent_len_id].geometry.coordinates[0][0][i]);
              var pt2 = proj4(fromProjection, toProjection, json.features[ent_len_id].geometry.coordinates[0][0][i + 1]);
              pt1.push(0);
              pt2.push(0);
              var pt3 = [pt1[0], pt1[1], heit];
              var pt3h = [pt2[0], pt2[1], heit];
              // top_vex.push(pt3[0])
              // top_vex.push(pt3[1])
              // top_vex.push(pt3[2])
              // top_vex.push(pt3h[0])
              // top_vex.push(pt3h[1])
              // top_vex.push(pt3h[2])
              // vertex_lt.push([pt1[0],pt1[1],pt1[2],pt2[0],pt2[1],pt2[2],pt3[0],pt3[1],pt3[2],pt3h[0],pt3h[1],pt3h[2]])
              // plg_set.push([pt1,pt2,pt3,pt4]);
              // top_lt.push(pt3);
              //vc1和vc2就是pt1到pt2，和pt1到pt3的两个向量，都在当前平面上
              var vc1 = math.subtract(pt2, pt1);
              var vc2 = math.subtract(pt3, pt1);
              //nmal就是vc1和vc2叉乘之后得到的当前平面的法向量
              var nmal = math.cross(vc1, vc2);
              //下面这两步是把法向量变成单位法向量
              var len_nmal = math.sqrt(math.dot(nmal, nmal));
              var nmal_unit = math.divide(nmal, len_nmal);
              //下面这行是算出ax+by+cz=d中的d（等式中（a，b，c）是法向量）
              var d_pl = math.dot(nmal_unit, pt1);
              //console.log(d_pl);
              //把当前面的法向量和d参数都存在pl_set中
              pl_set.push([nmal_unit, d_pl, matrl]);
              //试一下每个面的normal算对没有
              var pt4 = math.divide(math.add(pt2, pt3), 2);
              var pt5 = math.add(pt4, nmal_unit);
              var pt44 = proj4(toProjection, fromProjection, pt4);
              var pt55 = proj4(toProjection, fromProjection, pt5);
              var pt444 = new Cesium.Cartesian3.fromDegrees(pt44[0], pt44[1], pt44[2]);
              var pt555 = new Cesium.Cartesian3.fromDegrees(pt55[0], pt55[1], pt55[2]);
              // console.log('jjj',[pt44,pt55]);
              // shape4 = dataSource.entities.add({
              //   polyline: {
              //     positions: [pt444, pt555],
              //     arcType: Cesium.ArcType.NONE,
              //     clampToGround: false,
              //     width: 3,
              //     material: Cesium.Color.BLUE
              //   },
              // });
              //最后再在pl_set中存一个顶面参数(循环到最后一个点时)
              if (i == num_pt - 2) {
                var d_pl = math.dot([0, 0, 1], math.subtract(pt3, pt3h));
                pl_set.push([[0, 0, 1], d_pl, matrl]);
                // vertex_lt.push(top_vex)
              }

            }
          }




        }

      }
    }




    //88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888

    var entity_array = [];

    //createPoint
    var objectsToExclude = [mel];
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    var count_receiver = 0;
    var count_antenna = 0;
    var count_relay = 0;
    function createPoint(worldPosition) {
      if (instrumentFlag === 'receiver') {
        count_receiver += 1;
        var point = viewer.entities.add({
          position: worldPosition,
          point: {
            color: Cesium.Color.BLUE,
            pixelSize: 10,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
          label: {
            text: 'receiver' + count_receiver,
            font: '500 50px Helvetica',
            scale: 0.5,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.BLUE,
            pixelOffset: new Cesium.Cartesian2(-8, -35),
            showBackgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
          }
        });
        // console.log('point', viewer.entities);
        return point;
      } else if (instrumentFlag === 'antenna') {
        count_antenna += 1;
        var point = viewer.entities.add({
          position: worldPosition,
          point: {
            color: Cesium.Color.RED,
            pixelSize: 10,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
          label: {
            text: 'Antenna' + count_antenna,
            font: '500 50px Helvetica',
            scale: 0.5,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.RED,
            pixelOffset: new Cesium.Cartesian2(-8, -35),
            showBackgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
          }
        });
        // console.log('point', viewer.entities);
        return point;
      } else if (instrumentFlag === 'relay') {
        count_relay += 1
        var point = viewer.entities.add({
          position: worldPosition,
          point: {
            color: Cesium.Color.YELLOW,
            pixelSize: 10,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
          label: {
            text: 'Relay' + count_relay,
            font: '500 50px Helvetica',
            scale: 0.5,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.YELLOW,
            pixelOffset: new Cesium.Cartesian2(-8, -35),
            showBackgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
          }
        });
        // console.log('point', viewer.entities);
        return point;
      }
      entity_array.push(point);
    }
    function createLine(dist, r1, r2) {
      //-105dB
      if (dist > 0 && dist <= 14) {
        var shape = viewer.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 5,
            material: Cesium.Color.fromCssColorString('#7a0177'),
            glowPower: 0.5,
          },
        });
        //105-110dB
      } else if (dist > 14 && dist <= 25) {
        var shape = viewer.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 5,
            material: Cesium.Color.fromCssColorString('#c51b8a'),
            glowPower: 0.5,
          },
        });
        //110-120dB
      } else if (dist > 25 && dist <= 80) {
        var shape = viewer.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 5,
            material: Cesium.Color.fromCssColorString('#f768a1'),
            glowPower: 0.5,
          },
        });
        //120-130dB
      } else if (dist > 80 && dist <= 250) {
        var shape = viewer.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 5,
            material: Cesium.Color.fromCssColorString('#fbb4b9'),
            glowPower: 0.5,
          },
        });

      }
      entity_array.push(shape);
    }

    
    function dfs(final_path, AR_result, node_start, receiver) {
      var is_in = 0;
      // debugger;
      //找final_path里还有没有node_start
      for (let i = 0; i <= final_path.length - 1; i++) {
          if (final_path[i].indexOf(node_start) !== -1) {
            is_in = 1;
              
            break;
          }
      }
     
      if (is_in === 0) {
       
        AR_result.pop();
        
        return;
      }
      
  
      for (let i = 0; i <= final_path.length - 1; i++) {
          if (final_path[i].indexOf(node_start) != -1) {
              //算对应的end_node
              var end_node = final_path[i].filter((node) => {
                  // console.log(node);
                  return node!==node_start
              });
              //删掉next_path在final_path中的这一行
              AR_result.push(final_path[i]);
              final_path[i]=[0,0];
              if (end_node[0] === receiver) {
                  is_receive=1;
                  final_result=AR_result.slice(0,AR_result.length);
                  console.log(final_result);
                  for (let i=0; i<=final_result.length-1;i++){
                    var shape = viewer.entities.add({
                      polyline: {
                        positions: [final_result[i][0], final_result[i][1]],
                        arcType: Cesium.ArcType.NONE,
                        clampToGround: false,
                        width: 3,
                        material: Cesium.Color.GREEN,
                        glowPower: 0.5,
                      },
                    });
                    // createLine(20, final_result[i][0], final_result[i][1]);
                  }
                  break;
              }
              dfs(final_path, AR_result, end_node[0], receiver);
              
          }
      }
      
      AR_result.pop();
      
      
  
  }  
      
    

    //交互
    var activeShapePoints = [];
    var activeShape;
    var floatingPoint;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (event) {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      var earthPosition = viewer.scene.pickPosition(event.position);
      var temp = viewer.scene.globe.ellipsoid.cartesianToCartographic(earthPosition);
      var lat = Cesium.Math.toDegrees(temp.latitude);
      var lng = Cesium.Math.toDegrees(temp.longitude);
      var alt = temp.height;

      temp2 = Cesium.Cartesian3.fromDegrees(lng, lat, temp.height + 2.1);
      earthPosition = temp2;



      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {

        floatingPoint = createPoint(earthPosition);

        // console.log('ep', earthPosition)
        if (instrumentFlag === 'receiver') {
          receiverArray.push(earthPosition);
          // console.log(1);
        } else if (instrumentFlag === 'antenna') {
          antennaArray.push(earthPosition);
          // console.log(2);
        } else if (instrumentFlag === 'relay') {
          relayArray.push(earthPosition);
          // console.log(2);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);



    var nodeArray = [];

    handler.setInputAction(function (movement) {

      if (receiverArray.length > 0 && antennaArray.length > 0) {
        if (relayArray.length == 0) {
          console.log('hhhhhhhh');
          PL_list_all = []
          receiverArray.forEach((ray_end) => {
            //var PL=math.square(math.divide(lam,math.multiply(math.multiply(4,math.pi),d)))
            var PL_list = [];
            antennaArray.forEach((ray_start) => {
              var PL = 0;
              var PL_dB = 0
              var start_to_end = math.distance([ray_start.x, ray_start.y, ray_start.z], [ray_end.x, ray_end.y, ray_end.z]);
              if (start_to_end < 500) {


                // ray_start = new Cesium.Cartesian3.fromDegrees(144.9903761, -37.81169252, 6)
                // ray_end = earthPosition
                var ray_dir_los =
                  Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(ray_end, ray_start, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                var ray = new Cesium.Ray(ray_start, ray_dir_los);
                var hitPos = viewer.scene.pickFromRay(ray, []);
                console.log('hitpos', hitPos)
                // floatingPoint2 = createPoint(hitPos);
                var start_to_hit = math.distance([ray_start.x, ray_start.y, ray_start.z], [hitPos.position.x, hitPos.position.y, hitPos.position.z])
                console.log([start_to_hit, start_to_end]);
                // var point1 = viewer.entities.add({
                //   position: hitPos.position,
                //   point: {
                //     color: Cesium.Color.LIME,
                //     pixelSize: 10,
                //     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                //   },
                // });
                if (((hitPos == undefined) && (hitPos == null)) || (start_to_hit > start_to_end) || math.abs(math.subtract(start_to_hit, start_to_end)) < 0.1) {
                  var PL = math.add(PL, math.square(math.divide(math.multiply(math.multiply(4, math.pi), start_to_end), lam)));
                  var PL_dB = math.multiply(10, math.log10(PL))
                  // debugger
                  createLine(start_to_end, ray_start, ray_end);

                }
                //转换发射点的坐标到proj4
                var l_pos0 = viewer.scene.globe.ellipsoid.cartesianToCartographic(ray_start);
                var pt0_lon = Cesium.Math.toDegrees(l_pos0.longitude);
                var pt0_lat = Cesium.Math.toDegrees(l_pos0.latitude);
                var trans_pos0 = proj4(fromProjection, toProjection, [pt0_lon, pt0_lat, l_pos0.height]);
                //转换接收点的坐标到proj4
                var l_pos1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(ray_end);
                var pt1_lon = Cesium.Math.toDegrees(l_pos1.longitude);
                var pt1_lat = Cesium.Math.toDegrees(l_pos1.latitude);
                var trans_pos1 = proj4(fromProjection, toProjection, [pt1_lon, pt1_lat, l_pos1.height]);
               
                for (let j = 0; j <= pl_set.length - 1; j++) {
                  // console.log('gggggggg');
                  var cur_nmal = pl_set[j][0];
                  var cur_d = pl_set[j][1];

                  //接收点与发射点的对称点的连线
                  var t_dist = math.divide(math.subtract(cur_d, math.dot(trans_pos0, cur_nmal)), math.dot(cur_nmal, cur_nmal));
                  var imagPoint_start = math.add(trans_pos0, math.multiply(cur_nmal, math.multiply(t_dist, 2)));
                  var imag_degree_start = proj4(toProjection, fromProjection, imagPoint_start);
                  var imag_cart3_start = Cesium.Cartesian3.fromDegrees(imag_degree_start[0], imag_degree_start[1], imag_degree_start[2]);
                  var end_to_start_imag = math.distance([ray_end.x, ray_end.y, ray_end.z], [imag_cart3_start.x, imag_cart3_start.y, imag_cart3_start.z]);
                  
                  if (end_to_start_imag < 1000) {
                    
                    // debugger
                    // console.log('hhhhh',end_to_start_imag);
                    var ray_dir_imag_start =
                      Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(imag_cart3_start, ray_end, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    var ray_imag_start = new Cesium.Ray(ray_end, ray_dir_imag_start);

                    var hitPos_imag_start = viewer.scene.pickFromRay(ray_imag_start, []);

                    //发射点与接收点的对称点的连线
                    var t_dist1 = math.divide(math.subtract(cur_d, math.dot(trans_pos1, cur_nmal)), math.dot(cur_nmal, cur_nmal));
                    var imagPoint_end = math.add(trans_pos1, math.multiply(cur_nmal, math.multiply(t_dist1, 2)));
                    var imag_degree_end = proj4(toProjection, fromProjection, imagPoint_end);
                    var imag_cart3_end = Cesium.Cartesian3.fromDegrees(imag_degree_end[0], imag_degree_end[1], imag_degree_end[2]);
                    var ray_dir_imag_end =
                      Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(imag_cart3_end, ray_start, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    var ray_imag_end = new Cesium.Ray(ray_start, ray_dir_imag_end);

                    var hitPos_imag_end = viewer.scene.pickFromRay(ray_imag_end, []);
                    if ((hitPos_imag_start !== undefined) && (hitPos_imag_start !== null) && (hitPos_imag_end !== undefined) && (hitPos_imag_end !== null)) {
                      // var temp=hitPos_imag_start.position.x-hitPos_imag_end.postion.x;
                      var aaax = hitPos_imag_start.position.x;
                      var bbbx = hitPos_imag_end.position.x;
                      var aaay = hitPos_imag_start.position.y;
                      var bbby = hitPos_imag_end.position.y;
                      var aaaz = hitPos_imag_start.position.z;
                      var bbbz = hitPos_imag_end.position.z;
                      var matrl_ref = pl_set[j][2]
                      if (math.abs(math.subtract(aaax, bbbx)) <= 0.1 && math.abs(math.subtract(aaay, bbby)) <= 0.1 && math.abs(math.subtract(aaaz, bbbz)) <= 0.1) {
                        var start_to_hit_imag = math.distance([ray_start.x, ray_start.y, ray_start.z], [aaax, aaay, aaaz]);
                        var end_to_hit_imag = math.distance([ray_end.x, ray_end.y, ray_end.z], [aaax, aaay, aaaz]);
                        var fst_ray_len = math.add(start_to_hit_imag, end_to_hit_imag);
                        var PL = math.square(math.divide(math.multiply(math.multiply(4, math.pi), fst_ray_len), lam));
                        var PL_dB = math.add(PL_dB, math.multiply(10, math.log10(PL)) + matrl_ref);
                       
                        createLine(math.add(fst_ray_len, 15), ray_start, hitPos_imag_end.position);
                        createLine(math.add(fst_ray_len, 15), hitPos_imag_end.position, ray_end);






                      }
                    }
                  }

                }

                PL_list.push(math.multiply(10, math.log10(PL)));
              }

            })
            PL_list_all.push(PL_list)
            //console.log(math.max(PL_list));

          })




          console.log('path_loss_list', PL_list_all)
          // console.log(entity_array);
          console.log('end');
        } else {
          receiverArray.forEach((ray_end) => {
            antennaArray.forEach((ray_start) => {
              var min_dist = 0;
              relayArray.push(ray_end);
              console.log('relayarray', relayArray);
              // console.log('relayArray',relayArray);
              // var nodeArray=new Array(relayArray[0],relayArray[1],relayArray[2]);
              let nodeArray = relayArray.slice(0, relayArray.length);
              // let nodeArray=relayArray;

              // relayArray.forEach((rl) => {
              //   nodeArray.push(rl);
              // });
              console.log('first_nodearray', nodeArray);
              var compl_nodes = [];
              var dist_nodes = new Array(nodeArray.length).fill(Infinity);
              var last_node = new Array(nodeArray.length).fill(Infinity);
              compl_nodes.push(ray_start);
              var is_break = 0;
              while (compl_nodes.indexOf(ray_end) === -1) {
                var start_now = compl_nodes[math.subtract(compl_nodes.length, 1)];

                console.log('compl_nodes', compl_nodes);

                nodeArray.forEach((node) => {
                  if (node !== Infinity) {
                    console.log('node', node);
                    console.log('start_now', start_now);
                    var ray_dir_los = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(node, start_now, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    var ray = new Cesium.Ray(start_now, ray_dir_los);
                    console.log('ray_dir_los', ray_dir_los);
                    var hitPos = viewer.scene.pickFromRay(ray, []);

                    // console.log('start_now',start_now);
                    // console.log('hitPos',hitPos.position);
                    var start_to_hit = math.distance([start_now.x, start_now.y, start_now.z], [hitPos.position.x, hitPos.position.y, hitPos.position.z]);
                    var start_to_end = math.distance([start_now.x, start_now.y, start_now.z], [node.x, node.y, node.z]);
                    if (((hitPos == undefined) && (hitPos == null)) || (start_to_hit > start_to_end) || math.abs(math.subtract(start_to_hit, start_to_end)) < 0.1) {
                      var start_to_node = min_dist + start_to_end;
                      console.log('44444444', start_to_node);
                      console.log('55555555', dist_nodes[relayArray.indexOf(node)]);
                      if (start_to_node < dist_nodes[relayArray.indexOf(node)]) {
                        dist_nodes[relayArray.indexOf(node)] = start_to_node;
                        last_node[relayArray.indexOf(node)] = compl_nodes[math.subtract(compl_nodes.length, 1)];
                        console.log('222222', compl_nodes[compl_nodes.length - 1]);
                        console.log('3333333', [relayArray[0], relayArray[1], relayArray[2]]);
                      }
                    }
                    console.log('dist_nodes', dist_nodes);
                  }

                })
                //

                var min_dist = math.min(dist_nodes);
                if (min_dist !== Infinity) {
                  compl_nodes.push(relayArray[dist_nodes.indexOf(min_dist)]);
                  console.log('min_dist', min_dist);
                  //在nodeArray中pop掉当前遍历到的node
                  nodeArray[dist_nodes.indexOf(min_dist)] = Infinity;
                  // nodeArray.splice(dist_nodes.indexOf(min_dist),1);
                  console.log('nodearray', nodeArray);

                  dist_nodes[dist_nodes.indexOf(min_dist)] = Infinity;
                } else {
                  var is_break = 1;
                  break;
                }
              }
              //

              if (is_break === 1) {
                console.log('NO ROUTE!!!')
              } else {
                console.log('dist_nodes', dist_nodes);
                console.log('last_node', last_node);
                var route_array = [];
                route_array.push(ray_end);
                var route_node = last_node[last_node.length - 1];
                route_array.push(route_node);
                while (route_node !== ray_start) {
                  var index_now = relayArray.indexOf(route_node);
                  route_node = last_node[index_now];
                  route_array.push(route_node);


                }
                console.log('route_array', route_array);
                var PL = math.square(math.divide(math.multiply(math.multiply(4, math.pi), min_dist), lam));
                var PL_dB = math.multiply(10, math.log10(PL))
                console.log('pathloss(dB) for shortest distance', PL_dB);
                for (let i = 0; i <= route_array.length - 2; i++) {
                  // console.log('i and i+1',route_array[i],route_array[i+1]);
                  createLine(min_dist, route_array[i], route_array[i + 1]);
                }
              }

            })

          })
          // 88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888/
          receiverArray.forEach((ray_end) => {
            antennaArray.forEach((ray_start) => {

              //存每条边的list和他们相应的长度
              var path_list=[];
              var path_len_list=[];
              var old_node_list=[];

              var result_path=[];
              var group_list=[];

              var cur_ant_min=Infinity;
              var cur_ant_min_id=0;

              var count=0;

  
              let node_list=relayArray.slice(0, relayArray.length);
              node_list.push(ray_start);
              node_list.push(ray_end);
              console.log(node_list,'node_list');
              for (let i = 0; i <= node_list.length-1; i++) {
                var node1=node_list[i];
                for (let j = 0; j <= node_list.length-1; j++) {
                  var node2=node_list[j];
                  if (node2!==node1 && (old_node_list.indexOf(node2)===-1)){
                    // console.log('node1111',node1);
                    var ray_dir_los = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(node2, node1, new Cesium.Cartesian3()), new Cesium.Cartesian3());
                    var ray = new Cesium.Ray(node1, ray_dir_los);
                    var hitPos = viewer.scene.pickFromRay(ray, []);
                    // var point1 = viewer.entities.add({
                    //   position: hitPos.position,
                    //   point: {
                    //   color: Cesium.Color.LIME,
                    //   pixelSize: 10,
                    //   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    //   },
                    // });
                    var start_to_hit = math.distance([node1.x, node1.y, node1.z], [hitPos.position.x, hitPos.position.y, hitPos.position.z]);
                    var start_to_end = math.distance([node1.x, node1.y, node1.z], [node2.x, node2.y, node2.z]);
                    console.log('[node1,node2]',[node1,node2]);
                    console.log('hitPos',hitPos);
                    console.log('hit_len',[start_to_hit,start_to_end]);
                    if (((hitPos == undefined) && (hitPos == null)) || (start_to_hit > start_to_end) || math.abs(math.subtract(start_to_hit, start_to_end)) < 0.1){
                      console.log('[node1,node2] in path_list',[node1,node2]);
                      path_list.push([node1,node2]);
                      count=count+1; 
                      var node_dist=math.distance([node1.x,node1.y,node1.z],[node2.x,node2.y,node2.z]);
                      path_len_list.push(node_dist);
                      if (node1===ray_start || node2===ray_start){
                        if (node_dist<cur_ant_min){
                          cur_ant_min=node_dist;
                          cur_ant_min_id=count-1;
                          console.log('ray_start_min_id',cur_ant_min_id);
                        }
                      }
                    } 
                  } 
                }
                old_node_list.push(node1);     
              }
              console.log('path_list',path_list);
              console.log('path_len_list',path_len_list);
              result_path.push(path_list[cur_ant_min_id]);
              group_list.push(path_list[cur_ant_min_id]);
              path_len_list[cur_ant_min_id]=Infinity;
              
              
              while (true){
                var cur_min_path=math.min(path_len_list); //找当前最小path
                if (cur_min_path===Infinity){
                  alert('oops, no result!');
                  break;
                }
                var cur_min_id=path_len_list.indexOf(cur_min_path);
                var cur_node1=path_list[cur_min_id][0];
                var cur_node2=path_list[cur_min_id][1];
                var not_new=0;
                console.log('group_list',group_list);
                for (let k = 0; k <= group_list.length-1; k++){  //循环group_list，找node1或node2存在的行
                  
                  // console.log('cur_node1',cur_node1);
                  // console.log('group_list[k]',group_list[k]);
                
                  if (group_list[k].indexOf(cur_node1)!==-1){   //如果node1先出现
                    not_new=1;
                    console.log('11111');
                    if (group_list[k].indexOf(cur_node2)===-1){  //如果node1的行没有node2
                      group_list[k].push(cur_node2);
                      for (let k1=k+1;  k1 <= group_list.length-1; k1++){  //循环接下来的group_list,看接下来的组里有没有node2
                        if (group_list[k1].indexOf(cur_node2)!==-1){
                          group_list[k1].forEach((node)=>{  //有的话就合并k和k1
                            if (node!==cur_node2){
                              group_list[k].push(node);
                              group_list.splice(k1,1); //并删掉被合并的k1
                            }
                          })
                        }

                      }
                      result_path.push(path_list[cur_min_id]); //接下来的group有咩有node都把path加到result里
                      path_len_list[cur_min_id]=Infinity;
                      break;
                    }else{
                      path_len_list[cur_min_id]=Infinity;
                      break;
                    }
                  }else if(group_list[k].indexOf(cur_node2)!==-1){   //如果node2先出现
                    not_new=1;
                    console.log('222222')
                    if (group_list[k].indexOf(cur_node1)===-1){  //如果node2的行没有node1
                      group_list[k].push(cur_node1);
                      for (let k1=k+1;  k1 <= group_list.length-1; k1++){  //循环接下来的group_list,看接下来的组里有没有node2
                        if (group_list[k1].indexOf(cur_node1)!==-1){
                          group_list[k1].forEach((node)=>{  //有的话就合并k和k1
                            if (node!==cur_node1){
                              group_list[k].push(node);
                              group_list.splice(k1,1); //并删掉被合并的k1
                            }
                          })
                        }

                      }
                      result_path.push(path_list[cur_min_id]); //接下来的group有咩有node都把path加到result里
                      path_len_list[cur_min_id]=Infinity;
                      break;
                    }else{
                      path_len_list[cur_min_id]=Infinity;
                      break;
                    }
                  }

               
                 
                 
                }
                if (not_new===0){
                  console.log('3333')
                  result_path.push(path_list[cur_min_id]); 
                  path_len_list[cur_min_id]=Infinity;
                  group_list.push(path_list[cur_min_id]);
                }
                // console.log('ray_end',ray_end);
                // console.log('group_list[0]',group_list[0]);
                if (group_list[0].indexOf((ray_end))!==-1){
                  break;
                }
                
              }
              // console.log('group_list',group_list);
              console.log('result_path',result_path);
              // for (let i=0; i<=result_path.length-1;i++){
              //   createLine(20, result_path[i][0], result_path[i][1]);
              // } 


              var final_path=[];
              for (let i=0; i<=result_path.length-1;i++){
                var a=result_path[i].slice(0,2);
                final_path.push(a);
              }
              console.log('final_path', final_path);
              var AR_result = [];
              var final_result=[];
              var is_receive=0;
              dfs(final_path, AR_result, ray_start, ray_end);
              console.log('final_result',final_result);
              // for (let i=0; i<=final_result.length-1;i++){
              //   createLine(20, final_result[i][0], final_result[i][1]);
              // } 
               
            })
          })
        }
      }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    var options = [
      {
        text: "Draw Lines",
        onselect: function () {
          if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            window.alert(
              "This browser does not support polylines on terrain."
            );
          }

          terminateShape();
          drawingMode = "line";
        },
      },
      {
        text: "Draw Polygons",
        onselect: function () {
          terminateShape();
          drawingMode = "polygon";
        },
      },
    ];


  });



});

 