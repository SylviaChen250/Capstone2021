Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzkxZjc2MC03MWY2LTRkYjMtOGJkYy1hNTY5MmQ2MTdiMTgiLCJpZCI6NjEzOTQsImlhdCI6MTYyNjA1MTY2MH0.KU9MmCBbaayiw6PGwuNp7qP0jRphMYWMzCvRQnIMQ9g'
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain()
});
var tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(96188),
  })
);
// 开启地形深度监测
viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.82117, 100000) });

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.primitives.add(tileset);
var parentEntity = viewer.entities.add(new Cesium.Entity());
var viewPoint = Cesium.Cartesian3.fromDegrees(144.9678, -37.82117, 10);
// debugger
var webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
var viewPointWebMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(viewPoint));
var viewPointEntity = viewer.entities.add({
  parent: parentEntity,
  position: viewPoint,
  ellipsoid: {
    radii: new Cesium.Cartesian3(5, 5, 5),
    material: Cesium.Color.GREEN
  }
});

var orangePolygon = viewer.entities.add({
  name: "Orange polygon with per-position heights and outline",
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
      -108.0,
      40.0,
      500000,
      -106.0,
      40.0,
      500000,
      -106.0,
      42.0,
      500000,
      -108.0,
      42.0,
      500000,
    ]),
    extrudedHeight: 0,
    perPositionHeight: true,
    material: Cesium.Color.ORANGE.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.BLACK,
  },
});

var greenPolygon = viewer.entities.add({
  name: "Green polygon with per-position heights and outline",
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
      -108.0,
      34.0,
      1000000,
      -106.0,
      34.0,
      1000000,
      -106.0,
      36.0,
      1000000,
      -108.0,
      36.0,
      1000000,
    ]),
    extrudedHeight: 0,
    perPositionHeight: true,
    material: Cesium.Color.GREEN.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.BLACK,
  },
});

let ov = [[-108, 40, 0, -108, 40, 500000, -106, 40, 0, -106, 40, 500000],
[-108, 40, 500000, -106, 40, 500000, -106, 42, 500000, -108, 42, 500000],
[-108, 42, 500000, -106, 42, 500000, -106, 42, 0, -108, 42, 0],
[-108, 42, 0, -108, 40, 0, 108, 40, 500000, -108, 42, 500000],
[-106, 42, 0, -106, 40, 0, -106, 40, 500000, -106, 42, 500000]
];



let or_plane_set = [];

for (let i = 0; i <= 4; i++) {
  var ov_p1 = new Cesium.Cartesian3.fromDegrees(ov[i][0], ov[i][1], ov[i][2]);
  var ov_p2 = new Cesium.Cartesian3.fromDegrees(ov[i][3], ov[i][4], ov[i][5]);
  var ov_p3 = new Cesium.Cartesian3.fromDegrees(ov[i][6], ov[i][7], ov[i][8]);
  var ov_vc1 = new Cesium.Cartesian3.subtract(ov_p1, ov_p2, new Cesium.Cartesian3());
  var ov_vc2 = new Cesium.Cartesian3.subtract(ov_p1, ov_p3, new Cesium.Cartesian3());
  var ov_normal = new Cesium.Cartesian3.cross(ov_vc1, ov_vc2, new Cesium.Cartesian3());
  var ov_normal_unit = Cesium.Cartesian3.normalize(ov_normal, new Cesium.Cartesian3());
  var ov_d = Cesium.Cartesian3.dot(ov_p1, ov_normal_unit);
  // var p_mid=Cesium.Cartesian3.midpoint(ov_p1, ov_p3, new Cesium.Cartesian3());
  // var p=Cesium.Cartesian3.add(p_mid,Cesium.Cartesian3.multiplyByScalar(ov_normal_unit,10000,new Cesium.Cartesian3()),new Cesium.Cartesian3());
  var p_mid = new Cesium.Cartesian3.fromDegrees(-107, 41, 250000);
  var p1 = (ov_d - Cesium.Cartesian3.dot(p_mid, ov_normal_unit)) / Cesium.Cartesian3.dot(ov_normal_unit, ov_normal_unit);
  console.log(p1);
  var p = Cesium.Cartesian3.add(p_mid, Cesium.Cartesian3.multiplyByScalar(ov_normal_unit, 2 * p1, new Cesium.Cartesian3()), new Cesium.Cartesian3());
  var normal1 = viewer.entities.add({
    polyline: {
      positions: [p_mid, p],
      clampToGround: false,
      width: 3,
      material: Cesium.Color.BLUE
    },
  });
  var plane = new Cesium.Plane(ov_normal_unit, -ov_d);
  or_plane_set.push(plane);


}







var destPoints = [];
var radius = 750;
for (var i = 0; i <= 360; i++) {
  // 度数转弧度
  var radians = Cesium.Math.toRadians(i);
  // 计算目标点
  var toPoint = new Cesium.Cartesian3(viewPointWebMercator.x + radius * Math.cos(radians), viewPointWebMercator.y + radius * Math.sin(radians), 30);
  // 投影坐标转世界坐标
  toPoint = webMercatorProjection.unproject(toPoint);
  destPoints.push(Cesium.Cartographic.toCartesian(toPoint.clone()));
  var transform = Cesium.Transforms.eastNorthUpToFixedFrame(viewPoint);
  var modelMatrixPrimitive = viewer.scene.primitives.add(new Cesium.DebugModelMatrixPrimitive({
    modelMatrix: transform,
    length: 750.0
  }));
  var objectsToExclude = [viewPointEntity, modelMatrixPrimitive];
  // 添加排除的辅助对象
  objectsToExclude.push(viewer.entities.add({
    parent: parentEntity,
    name: i,
    position: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(toPoint.longitude), Cesium.Math.toDegrees(toPoint.latitude), 30),
    ellipsoid: {
      radii: new Cesium.Cartesian3(0, 0, 0),
      material: Cesium.Color.RED
    }
  }));
}

// Draw  a line
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
  Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
);
function createPoint(worldPosition) {
  var point = viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return point;
}
var drawingMode = "line";
function drawShape(positionData) {
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
      shape = viewer.entities.add({
        polyline: {
          positions: [positionData[0], hitPos.position],
          clampToGround: false,
          width: 3,
          material: Cesium.Color.GREEN
        },
      });
      var shape2 = viewer.entities.add({
        polyline: {
          positions: [hitPos.position, positionData[1]],
          clampToGround: false,
          width: 3,
          material: Cesium.Color.RED
          // material:Cesium.Color.RED.withAlpha(0.01*Cesium.Cartesian3.distance(positionData[0],hitPos.position))
          // material:Cesium.Color.add(red,yellow)

        },
      });
      for (let j = 0; j <= 5; j++) {
        var current_plane = or_plane_set[j];
        var current_d = Cesium.Cartesian3.dot(hitPos.position, current_plane.normal);
        console.log(current_plane.distance);
        console.log(current_d);
        if (Cesium.Math.greaterThan(current_d, current_plane.distance, 20) || Cesium.Math.lessThan(current_d, current_plane.distance, 20)) {
          console.log(j);
          var t_dist = (current_plane.distance - Cesium.Cartesian3.dot(positionData[0], current_plane.normal)) / Cesium.Cartesian3.dot(current_plane.normal, current_plane.normal);
          var imagPoint = Cesium.Cartesian3.add(positionData[0], Cesium.Cartesian3.multiplyByScalar(current_plane.normal, 2 * t_dist, new Cesium.Cartesian3()), new Cesium.Cartesian3());
          var imag_to_hit = Cesium.Cartesian3.subtract(hitPos.position, imagPoint, new Cesium.Cartesian3());
          var ref_dir = Cesium.Cartesian3.normalize(imag_to_hit, new Cesium.Cartesian3());
          var ref_pt = Cesium.Cartesian3.add(hitPos.position, Cesium.Cartesian3.multiplyByScalar(ref_dir, -2 * 80000, new Cesium.Cartesian3()), new Cesium.Cartesian3());
          break
        };

      }



      // var dist1=Cesium.Cartesian3.distance(positionData[0],projectPoint);
      // console.log('dist1',dist1);
      // var imagPoint=Cesium.Cartesian3.add(positionData[0],Cesium.Cartesian3.multiplyByScalar(bp1_normal_unit,2*dist,new Cesium.Cartesian3()),new Cesium.Cartesian3());
      // console.log('getimag',imagPoint);
      // var direction1 = 
      // Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(hitPos.position, imagPoint, new Cesium.Cartesian3()), new Cesium.Cartesian3());
      // var ray_ref = new Cesium.Ray(hitPos.position, direction1);
      var shape3 = viewer.entities.add({
        polyline: {
          positions: [positionData[0], imagPoint],
          clampToGround: false,
          width: 3,
          material: Cesium.Color.YELLOW
        },
      });
    } else {
      shape = viewer.entities.add({
        polyline: {
          positions: positionData,
          clampToGround: false,
          width: 3,
          material: Cesium.Color.GREEN
        },
      });
    }
  } else if (drawingMode === "polygon") {
    shape = viewer.entities.add({
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


// 初始化



// var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
// var viewshed
// handler.setInputAction(function (event) {
//     // 分析参数
//     var viewModel = { verticalAngle: 90, horizontalAngle: 120, distance: 10 };

//     // 添加可视域
//     viewshed = new Cesium.ViewShed3D(viewer, {
//         horizontalAngle: Number(viewModel.horizontalAngle),
//         verticalAngle: Number(viewModel.verticalAngle),
//         distance: Number(viewModel.distance),
//         calback: function () {
//             viewModel.distance = viewshed.distance
//         }
//     });
//     window.alert("view shed created.");
// }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);