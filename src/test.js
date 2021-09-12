class Person {
    constructor(name='tom',age=3) {
        this.name = name;
        this.age=age;
    }
    getName() {
        return this.name;
    }
}

var person1=new Person();
console.log(person1.getName());

// var viewer = new Cesium.Viewer("cesiumContainer");

// var scene = viewer.scene;
// var canvas = viewer.canvas;
// canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
// canvas.onclick = function () {
//   canvas.focus();
// };

// var camera = new Cesium.Camera(scene);
//     camera.position = new Cesium.Cartesian3.fromDegrees(144.9678, -20.81573, 1000);
//     camera.direction = Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_X, new Cesium.Cartesian3.fromDegrees(144.9678, -20.81573, 1000));
//     camera.up = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y);
//     camera.frustum.fov = Cesium.Math.PI_OVER_THREE;
//     camera.frustum.near = 1.0;
//     camera.frustum.far = 2.0;

// var camera = viewer.scene.primitives.add(
//     new Cesium.Camera({
//     position : new Cesium.Cartesian3.fromDegrees(144.9678, -20.81573, 1000),
//     direction : Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_X, new Cesium.Cartesian3.fromDegrees(144.9678, -20.81573, 1000)),
//     up : Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y),
//     frustum:{
//     fov : Cesium.Math.PI_OVER_THREE,
//     near : 1.0,
//     far : 2.0,},
    

//     })
// );

// var shadowMap = viewer.shadowMap;


// console.log(viewer);

// viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.81573, 1000) });

// var scene = new Cesium.Scene({
//     canvas : canvas,
//     contextOptions : {
//       allowTextureFilterAnisotropic : false
//     }
//   });

  // 创建一个沿负z轴向下的，位于原点的，视野为60度的，宽高比为1:1的相机。

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYzkxZjc2MC03MWY2LTRkYjMtOGJkYy1hNTY5MmQ2MTdiMTgiLCJpZCI6NjEzOTQsImlhdCI6MTYyNjA1MTY2MH0.KU9MmCBbaayiw6PGwuNp7qP0jRphMYWMzCvRQnIMQ9g'
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});
// var tileset = viewer.scene.primitives.add(
//     new Cesium.Cesium3DTileset({
//         url: Cesium.IonResource.fromAssetId(96188),
//     })
// );

var orangePolygon = viewer.entities.add({
  name: "Orange polygon with per-position heights and outline",
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
      -108.0,
      40.0,
      100000,
      -106.0,
      40.0,
      100000,
      -106.0,
      42.0,
      100000,
      -108.0,
      42.0,
      100000,
    ]),
    extrudedHeight: 0,
    perPositionHeight: true,
    material: Cesium.Color.ORANGE.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.BLACK,
  },
});

viewer.zoomTo(viewer.entities); 

    

  

//   var redBox = viewer.entities.add({
//     name: "Red box with black outline",
//     position: Cesium.Cartesian3.fromDegrees(144.96, -37.81573, 0),
//     box: {
//       dimensions: new Cesium.Cartesian3(100.0, 200.0, 500.0),
//       material: Cesium.Color.RED.withAlpha(0.5),
//       outline: true,
//       outlineColor: Cesium.Color.BLACK,
//     },
//   });

//   console.log();
// console.log(bluePlane1.position);

// var p0 = new Cesium.Cartesian3(0,1,2);
// var p1 = new Cesium.Cartesian3(3,2,2);
// var direction = 
// Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(p0,p1, new Cesium.Cartesian3()), new Cesium.Cartesian3());
// var ray = new Cesium.Ray(p0, direction);

// var plane = new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0);
// // find the intersection of the line segment from p0 to p1 and the tangent plane at origin.
// intersection=Cesium.IntersectionTests.rayPlane(ray, bluePlane2, new Cesium.Cartesian3());
// console.log(intersection);

 
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
    if (positionData.length >= 2){
    console.log('test',positionData);
    var direction = 
    Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(positionData[1], positionData[0], new Cesium.Cartesian3()), new Cesium.Cartesian3());
    var ray = new Cesium.Ray(positionData[0], direction);
    debugger
    // var  ray = viewer.camera.getPickRay(positionData[0],positionData[1]);
    var hitPos = viewer.scene.pickFromRay(ray, objectsToExclude);
    if ((hitPos !== undefined) && (hitPos !== null)) {
    console.log('hitpoints',hitPos);
    } else {
    console.log('fail',hitPos);
    }
    }
    console.log('trhandke',positionData);
    if (drawingMode === "line") {
    // console.log(positionData)
    if ((hitPos !== undefined) && (hitPos !== null)) {
    shape = viewer.entities.add({
    polyline: {
    positions: [positionData[0],hitPos.position],
    clampToGround: false,
    width: 3,
    material:Cesium.Color.GREEN
    },
    });
    var  shape2 = viewer.entities.add({
    polyline: {
    positions: [hitPos.position,positionData[1]],
    clampToGround: false,
    width: 3,
    material:Cesium.Color.RED
    // material:Cesium.Color.RED.withAlpha(0.01*Cesium.Cartesian3.distance(positionData[0],hitPos.position))
    // material:Cesium.Color.add(red,yellow)
    
    },
    });
    } else {
    shape = viewer.entities.add({
    polyline: {
    positions: positionData,
    clampToGround: false,
    width: 3,
    material:Cesium.Color.GREEN
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
    
    