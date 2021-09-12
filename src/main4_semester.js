// var reader = new jsts.io.WKTReader();
// var a = reader.read('POLYGON ((1 1,5 1,5 5,1 5,0.5 4,1 1))');
// var b = reader.read('POLYGON ((1 1,5 1,5 5,1 5,1 1))');
var lam = 0.005;
// var difference = a.difference(b);
// console.log(difference);
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzkxZjc2MC03MWY2LTRkYjMtOGJkYy1hNTY5MmQ2MTdiMTgiLCJpZCI6NjEzOTQsImlhdCI6MTYyNjA1MTY2MH0.KU9MmCBbaayiw6PGwuNp7qP0jRphMYWMzCvRQnIMQ9g'
var viewer = new Cesium.Viewer("cesiumContainer");

// const viewer = new Cesium.Viewer('cesiumContainer', {
//     terrainProvider: Cesium.createWorldTerrain()
//   });
viewer.scene.globe.depthTestAgainstTerrain = true;
// var viewPoint = Cesium.Cartesian3.fromDegrees(144.9678, -37.82117, 10);
// // debugger
// var webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
// var viewPointWebMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(viewPoint));
// console.log('scene',viewer.scene.entities);

var instrumentFlag = null;
var calculationStatus = null;
function addAntenna() {
  // createPoint()
  instrumentFlag = 'antenna';
  console.log(instrumentFlag)
}
function addReceiver() {
  // createPoint()
  instrumentFlag = 'receiver';
  console.log('?', instrumentFlag)
}

var antennaArray = [];
var receiverArray = [];

function handleClickCalculate() {
  calculationStatus = 'ok';
}

viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.81573, 1000) });

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

      element.polygon.outline = Cesium.Color.LIGHTGRAY;
      element.polygon.extrudedHeight = element.properties['f_height'];
      element.polygon.material = Cesium.Color.LIGHTGRAY;
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
              pl_set.push([nmal_unit, d_pl]);
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
                pl_set.push([[0, 0, 1], d_pl]);
                // vertex_lt.push(top_vex)
              }

            }
          }




        }

      }
    }




    //88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888

    var entity_array=[];
    
    //createPoint
    var objectsToExclude = [mel];
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    function createPoint(worldPosition) {
      if (instrumentFlag === 'receiver') {
        var point = dataSource.entities.add({
          position: worldPosition,
          point: {
            color: Cesium.Color.BLUE,
            pixelSize: 20,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
        });
        // console.log('point', viewer.entities);
        return point;
      } else {
        var point = dataSource.entities.add({
          position: worldPosition,
          point: {
            color: Cesium.Color.RED,
            pixelSize: 20,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          },
        });
        // console.log('point', viewer.entities);
        return point;
      }
      entity_array.push(point);
    }
    function createLine(dist, r1, r2) {
      if (dist > 0 && dist <= 30) {
        var shape = dataSource.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 3,
            material: Cesium.Color.DEEPPINK,
            glowPower: 0.5,
          },
        });
      } else if (dist > 50 && dist <= 100) {
        var shape = dataSource.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 3,
            material: Cesium.Color.DARKVIOLET,
            glowPower: 0.5,
          },
        });
      } else if(dist > 100 && dist <= 250){
        var shape = dataSource.entities.add({

          polyline: {
            positions: [r1, r2],
            arcType: Cesium.ArcType.NONE,
            clampToGround: false,
            width: 3,
            material: Cesium.Color.DARKTURQUOISE,
            glowPower: 0.5,
          },
        });

      }
      entity_array.push(shape);
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
          console.log(1);
        } else {
          antennaArray.push(earthPosition);
          console.log(2);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);





    handler.setInputAction(function (movement) {
      if (receiverArray.length > 0 && antennaArray.length > 0) {
        receiverArray.forEach((ray_end) => {
          //var PG=math.square(math.divide(lam,math.multiply(math.multiply(4,math.pi),d)))
          var PG_list = [];
          antennaArray.forEach((ray_start) => {
            var PG = 0;
            // ray_start = new Cesium.Cartesian3.fromDegrees(144.9903761, -37.81169252, 6)
            // ray_end = earthPosition
            var ray_dir_los =
              Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(ray_end, ray_start, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            var ray = new Cesium.Ray(ray_start, ray_dir_los);
            var hitPos = viewer.scene.pickFromRay(ray, entity_array);
            console.log('hitpos', hitPos)
            // floatingPoint2 = createPoint(hitPos);
            var start_to_hit = math.distance([ray_start.x, ray_start.y, ray_start.z], [hitPos.position.x, hitPos.position.y, hitPos.position.z])
            var start_to_end = math.distance([ray_start.x, ray_start.y, ray_start.z], [ray_end.x, ray_end.y, ray_end.z])
            console.log([start_to_hit, start_to_end]);
            var point1 = dataSource.entities.add({
              position: hitPos.position,
              point: {
                color: Cesium.Color.LIME,
                pixelSize: 20,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
              },
            });
            if (((hitPos == undefined) && (hitPos == null)) || (start_to_hit > start_to_end)) {
              var PG = math.add(PG, math.square(math.divide(lam, math.multiply(math.multiply(4, math.pi), start_to_end))));

              createLine(start_to_end,ray_start, ray_end);
              
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
              var cur_nmal = pl_set[j][0];
              var cur_d = pl_set[j][1];
              //接收点与发射点的对称点的连线
              var t_dist = math.divide(math.subtract(cur_d, math.dot(trans_pos0, cur_nmal)), math.dot(cur_nmal, cur_nmal));
              var imagPoint_start = math.add(trans_pos0, math.multiply(cur_nmal, math.multiply(t_dist, 2)));
              var imag_degree_start = proj4(toProjection, fromProjection, imagPoint_start);
              var imag_cart3_start = Cesium.Cartesian3.fromDegrees(imag_degree_start[0], imag_degree_start[1], imag_degree_start[2]);
              var ray_dir_imag_start =
                Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(imag_cart3_start, ray_end, new Cesium.Cartesian3()), new Cesium.Cartesian3());
              var ray_imag_start = new Cesium.Ray(ray_end, ray_dir_imag_start);

              var hitPos_imag_start = viewer.scene.pickFromRay(ray_imag_start, entity_array);

              //发射点与接收点的对称点的连线
              var t_dist1 = math.divide(math.subtract(cur_d, math.dot(trans_pos1, cur_nmal)), math.dot(cur_nmal, cur_nmal));
              var imagPoint_end = math.add(trans_pos1, math.multiply(cur_nmal, math.multiply(t_dist1, 2)));
              var imag_degree_end = proj4(toProjection, fromProjection, imagPoint_end);
              var imag_cart3_end = Cesium.Cartesian3.fromDegrees(imag_degree_end[0], imag_degree_end[1], imag_degree_end[2]);
              var ray_dir_imag_end =
                Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(imag_cart3_end, ray_start, new Cesium.Cartesian3()), new Cesium.Cartesian3());
              var ray_imag_end = new Cesium.Ray(ray_start, ray_dir_imag_end);

              var hitPos_imag_end = viewer.scene.pickFromRay(ray_imag_end, entity_array);
              if ((hitPos_imag_start !== undefined) && (hitPos_imag_start !== null) && (hitPos_imag_end !== undefined) && (hitPos_imag_end !== null)) {
                // var temp=hitPos_imag_start.position.x-hitPos_imag_end.postion.x;
                var aaax = hitPos_imag_start.position.x;
                var bbbx = hitPos_imag_end.position.x;
                var aaay = hitPos_imag_start.position.y;
                var bbby = hitPos_imag_end.position.y;
                var aaaz = hitPos_imag_start.position.z;
                var bbbz = hitPos_imag_end.position.z;
                if (math.abs(math.subtract(aaax, bbbx)) <= 0.1 && math.abs(math.subtract(aaay, bbby)) <= 0.1 && math.abs(math.subtract(aaaz, bbbz)) <= 0.1) {
                  var start_to_hit_imag = math.distance([ray_start.x, ray_start.y, ray_start.z], [aaax, aaay, aaaz]);
                  var end_to_hit_imag = math.distance([ray_end.x, ray_end.y, ray_end.z], [aaax, aaay, aaaz]);
                  var fst_ray_len = math.add(start_to_hit_imag, end_to_hit_imag);
                  var PG = math.add(PG, math.square(math.divide(lam, math.multiply(math.multiply(4, math.pi), fst_ray_len))));
                  createLine(math.add(fst_ray_len,15),ray_start, hitPos_imag_end.position);
                  createLine(math.add(fst_ray_len,15),hitPos_imag_end.position, ray_end);
                  
                  
                  



                }
              }

            }

            PG_list.push(PG);

          })
          console.log(math.max(PG_list));

        })



      }
      console.log(entity_array);
      console.log('end');


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

