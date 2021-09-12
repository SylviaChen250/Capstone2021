// var reader = new jsts.io.WKTReader();
// var a = reader.read('POLYGON ((1 1,5 1,5 5,1 5,0.5 4,1 1))');
// var b = reader.read('POLYGON ((1 1,5 1,5 5,1 5,1 1))');

// var difference = a.difference(b);
// console.log(difference);

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

      element.polygon.outline = true;
      element.polygon.extrudedHeight = element.properties['f_height'];
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
    var top_lt = [];
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

          console.log(json.features[84].geometry.coordinates[0][0][0]);
          console.log(json.features[84].properties.f_height);


          //888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
          //计算前20个建筑物的面参数
          var ent_len = json.features.length
          for (let ent_len_id = 0; ent_len_id <= ent_len-1; ent_len_id++) {
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
              // plg_set.push([pt1,pt2,pt3,pt4]);
              top_lt.push(pt3);
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
              shape4 = dataSource.entities.add({
                polyline: {
                  positions: [pt444, pt555],
                  arcType: Cesium.ArcType.NONE,
                  clampToGround: false,
                  width: 3,
                  material: Cesium.Color.BLUE
                },
              });
              //最后再在pl_set中存一个顶面参数(循环到最后一个点时)
              if (i == num_pt - 2) {
                var d_pl = math.dot([0, 0, 1], math.subtract(pt3, pt3h));
                pl_set.push([[0, 0, 1], d_pl]);

              }

            }
          }
          
          var objectsToExclude = [];
          ray_start=new Cesium.Cartesian3.fromDegrees(144.9903761, -37.81169252, 3)
          ray_end=new Cesium.Cartesian3(-4132339.0155300326,2894581.67902991,-3888942.840490218)
          var ray_dir_los =
          Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(ray_end, ray_start, new Cesium.Cartesian3()), new Cesium.Cartesian3());
          var ray = new Cesium.Ray(ray_start, ray_dir_los);
          console.log(ray)
          var hitPos = viewer.scene.pickFromRay(ray, melmodel);
          console.log(hitPos)
          if ((hitPos == undefined) && (hitPos == null)){
            shape = dataSource.entities.add({
              polyline: {
                positions: [ray_start, ray_end],
                arcType: Cesium.ArcType.NONE,
                clampToGround: false,
                width: 3,
                material: Cesium.Color.GREEN
              },
            });
                
          }
          
          //随机hitpos测试
          // var hp=new Cesium.Cartesian3(-4131990.60211955,2894582.559516074,-3889310.8150809735);
          // var l_hitPos = viewer.scene.globe.ellipsoid.cartesianToCartographic(hp);
          // var hp_lon=Cesium.Math.toDegrees(l_hitPos.longitude);
          // var hp_lat=Cesium.Math.toDegrees(l_hitPos.latitude);
          // var hpp=proj4(fromProjection, toProjection, [hp_lon,hp_lat,l_hitPos.height]);
          // console.log([hp_lon,hp_lat,l_hitPos.height]);
          // for (let j = 0; j < 9; j++) {
          //   var cur_nmal = pl_set[j][0];
          //   var cur_d = pl_set[j][1];
          //   var test_d = math.dot(cur_nmal, math.subtract(hpp,top_lt[j]));
          //   console.log('testdddd', [cur_d, test_d]);

        }
        // top_lt.push(top_lt[0]);
        // plg_set.push(top_lt);



        // console.log(top_lt[4]);
      }
    }


    // console.log(pl_set);

    //88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888





    // var reader = new jsts.io.WKTReader();
    // var a = reader.read('POINT (-20 0)');
    // var b = reader.read('POINT (20 0)');

    // console.log(a);

    // proj4.defs("EPSG:32755","+proj=utm +zone=55 +south +datum=WGS84 +units=m +no_defs");


    // Draw  a line
    var objectsToExclude = [mel];
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    function createPoint(worldPosition) {
      var point = dataSource.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
      });
      console.log('point', viewer.entities);
      return point;
    }
    var drawingMode = "line";
    function drawShape(positionData) {


      // cartographic.height=cartographic.height+1;
      // positionData[0]=Cesium.Cartesian3.fromDegrees(cartographic.longitude,cartographic.latitude,cartographic.height) ;
      var shape;
      if (positionData.length >= 2) {
        console.log('test', positionData);
        var direction =
          Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(positionData[1], positionData[0], new Cesium.Cartesian3()), new Cesium.Cartesian3());
        var ray = new Cesium.Ray(positionData[0], direction);
        debugger
        // var  ray = viewer.camera.getPickRay(positionData[0],positionData[1]);

        var hitPos = viewer.scene.pickFromRay(ray, objectsToExclude);
        if ((hitPos !== undefined) && (hitPos !== null)) {
          console.log('hitpoints', hitPos);
        } else {
          console.log('fail', hitPos);
        }
      }
      console.log('trhandke', positionData);
      if (drawingMode === "line") {
        // console.log(positionData)
        if ((hitPos !== undefined) && (hitPos !== null)) {
          shape = dataSource.entities.add({
            polyline: {
              positions: [positionData[0], hitPos.position],
              arcType: Cesium.ArcType.NONE,
              clampToGround: false,
              width: 3,
              material: Cesium.Color.GREEN
            },
          });
          var shape2 = dataSource.entities.add({
            polyline: {
              positions: [hitPos.position, positionData[1]],
              arcType: Cesium.ArcType.NONE,
              clampToGround: false,
              width: 3,
              material: Cesium.Color.RED
              // material:Cesium.Color.RED.withAlpha(0.01*Cesium.Cartesian3.distance(positionData[0],hitPos.position))
              // material:Cesium.Color.add(red,yellow)

            },
          });
          //8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
          //从这里开始判断hitpos在哪个平面上并对此做出反射
          var l_hitPos = viewer.scene.globe.ellipsoid.cartesianToCartographic(hitPos.position);
          var hp_lon = Cesium.Math.toDegrees(l_hitPos.longitude);
          var hp_lat = Cesium.Math.toDegrees(l_hitPos.latitude);
          var trans_hitPos = proj4(fromProjection, toProjection, [hp_lon, hp_lat, l_hitPos.height]);
          var l_pos0 = viewer.scene.globe.ellipsoid.cartesianToCartographic(positionData[0]);
          var pt0_lon = Cesium.Math.toDegrees(l_pos0.longitude);
          var pt0_lat = Cesium.Math.toDegrees(l_pos0.latitude);
          var trans_pos0 = proj4(fromProjection, toProjection, [pt0_lon, pt0_lat, l_pos0.height]);

          for (let j = 0; j < 9; j++) {
            var cur_nmal = pl_set[j][0];
            var cur_d = pl_set[j][1];
            var test_d = math.dot(cur_nmal, trans_hitPos);
            // console.log('testdddd', [cur_d, test_d]);
            //就是下面这个注释掉的里面可能有问题我正在改
            if (math.abs(math.subtract(cur_d, test_d)) <= 0.001) {
              // console.log('trans_pos0',trans_pos0);
              var t_dist = math.divide(math.subtract(cur_d, math.dot(trans_pos0, cur_nmal)), math.dot(cur_nmal, cur_nmal));
              // console.log('t_dist', t_dist);
              var imagPoint = math.add(trans_pos0, math.multiply(cur_nmal, math.multiply(t_dist, 2)));
              // var img_l = proj4(toProjection, fromProjection, imagPoint);
              // console.log('img_l',img_l);
              // var img_car =Cesium.Cartesian3.fromDegrees(img_l[0], img_l[1], img_l[2]);
              // console.log(' img_car', img_car);
              var imag_to_hit = math.subtract(trans_hitPos, imagPoint);
              var len_ref = math.sqrt(math.dot(imag_to_hit, imag_to_hit));
              var ref_dir = math.divide(imag_to_hit, len_ref);
              var ref_pt = math.add(trans_hitPos, math.multiply(ref_dir, 30));
              var inv_ref_pt = proj4(toProjection, fromProjection, ref_pt);
              var f_pt = new Cesium.Cartesian3.fromDegrees(inv_ref_pt[0], inv_ref_pt[1], inv_ref_pt[2]);
              var shape3 = viewer.entities.add({
                polyline: {
                  positions: [hitPos.position, f_pt],
                  clampToGround: false,
                  width: 3,
                  material: Cesium.Color.YELLOW
                },
              });
              break
            }

          }

          //888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
        } else {
          shape = dataSource.entities.add({
            polyline: {
              positions: positionData,
              arcType: Cesium.ArcType.NONE,
              clampToGround: false,
              width: 3,
              material: Cesium.Color.GREEN
            },
          });
        }
      } else if (drawingMode === "polygon") {
        shape = dataSource.entities.add({
          polygon: {
            hierarchy: positionData,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.WHITE.withAlpha(0.7)
            ),
          },
        });
      }
      // console.log('trhandke',  Cesium.Cartesian3.distance(positionData[0],positionData[1]));

      return shape;
    }
    var activeShapePoints = [];
    var activeShape;
    var floatingPoint;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (event) {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      var earthPosition = viewer.scene.pickPosition(event.position);
      var earthPosition = viewer.scene.pickPosition(event.position);
      var temp = viewer.scene.globe.ellipsoid.cartesianToCartographic(earthPosition);
      var lat = Cesium.Math.toDegrees(temp.latitude);
      var lng = Cesium.Math.toDegrees(temp.longitude);
      var alt = temp.height;

      temp2 = Cesium.Cartesian3.fromDegrees(lng, lat, temp.height + 0.1);
      earthPosition = temp2;
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          floatingPoint = createPoint(earthPosition);
          activeShapePoints.push(earthPosition);
          var dynamicPositions = new Cesium.CallbackProperty(function () {
            if (drawingMode === "polygon") {
              return new Cesium.PolygonHierarchy(activeShapePoints);
            }
            return activeShapePoints;
          }, false);
          activeShape = drawShape(dynamicPositions);
        }
        activeShapePoints.push(earthPosition);
        createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (event) {
      if (Cesium.defined(floatingPoint)) {
        var newPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          floatingPoint.position.setValue(newPosition);
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // Redraw the shape so it's not dynamic and remove the dynamic shape.
    function terminateShape() {
      activeShapePoints.pop();
      drawShape(activeShapePoints);
      viewer.entities.remove(floatingPoint);
      viewer.entities.remove(activeShape);
      floatingPoint = undefined;
      activeShape = undefined;
      activeShapePoints = [];
    }
    handler.setInputAction(function (event) {
      terminateShape();
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

