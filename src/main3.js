

var viewer = new Cesium.Viewer("cesiumContainer");

// let viewer = new Cesium.Viewer("cesiumContainer", {
//     terrainProvider: Cesium.createWorldTerrain(),
//     animation: false //左下角图案
//   });

viewer.scene.globe.depthTestAgainstTerrain = true;

viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.81573, 1000) });

var melmodel;
var mel = Cesium.GeoJsonDataSource.load('../src/smallData.json',{
    clampToGround: true}).then(function (dataSource) {

    viewer.dataSources.add(dataSource).then(res => {
        test = res;
        test.name = '测试';
       
        var entities = dataSource.entities.values;
        // melmodel=entities;
        entities.forEach(element => {
            element.polygon.outline = true;
            element.polygon.extrudedHeight = element.properties['f_height'];
            // console.log(entities.geometry.coordinates[0][0]);
        });
    });

});
console.log('debte',viewer.entities)


var fromProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
var toProjection='+proj=utm +zone=55 +south +datum=WGS84 +units=m +no_defs';
var transformPoint_start = proj4(fromProjection, toProjection, [-108.0, 40.0]);
var transformPoint_end = proj4(fromProjection, toProjection, [-108.0, 39.998]);

console.log('transformpoint',transformPoint_start);
console.log('transformpointEnd',transformPoint_end);

console.log('Cartesian3',Cesium.Cartesian3.fromDegrees(-108.0, 40.0, 100000));


let or_plane_set = mel;
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
            console.log('coordinate',json.features[0].geometry.coordinates[0][0][0]);
            console.log('f_height',json.features[0].properties.f_height);

        //计算2018.1号建筑物的面参数
        var num_pt=json.features[0].geometry.coordinates[0][0].length;
        for (let i = 0; i <= num_pt-2; i++) {
            var heit=json.features[0].properties.f_height;
            var pt1=proj4(fromProjection, toProjection,json.features[0].geometry.coordinates[0][0][i]);
            var pt2=proj4(fromProjection, toProjection,json.features[0].geometry.coordinates[0][0][i+1]);
            pt1.push(0);
            pt2.push(0);
            var pt3=[pt1[0],pt1[1],heit];
            
        }

            
        }
    }
}

// const proj4=require('proj4');



// console.log(jsts.version);

// var reader = new jsts.io.WKTReader();
// var a = reader.read('POINT (-20 0)');
// var b = reader.read('POINT (20 0)');

// console.log(a);
var objectsToExclude = [mel];
// proj4.defs("EPSG:32755","+proj=utm +zone=55 +south +datum=WGS84 +units=m +no_defs");
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
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    },
    });
    var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(worldPosition);
    console.log('pointPosition',cartographic)
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
    // debugger
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
    // var plane1=new Cesium.Plane.fromPointNormal(hitPos.position,bluePlane1._plane._plane._value.normal, new Cesium.Plane());
    dist=Cesium.Plane.getPointDistance(plane1, positionData[0]);
    console.log('dist',dist);
    var projectPoint= new Cesium.Plane.projectPointOntoPlane(plane1, positionData[0], new Cesium.Cartesian3());
    console.log('getproj',projectPoint);
    // var dist1=Cesium.Cartesian3.distance(positionData[0],projectPoint);
    // console.log('dist1',dist1);
    var imagPoint=Cesium.Cartesian3.add(positionData[0],Cesium.Cartesian3.multiplyByScalar(bp1_normal_unit,2*dist,new Cesium.Cartesian3()),new Cesium.Cartesian3());
    console.log('getimag',imagPoint);
    // var direction1 = 
    // Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(hitPos.position, imagPoint, new Cesium.Cartesian3()), new Cesium.Cartesian3());
    // var ray_ref = new Cesium.Ray(hitPos.position, direction1);
    var shape3 = viewer.entities.add({
        polyline: {
        positions: [imagPoint,hitPos.position],
        clampToGround: false,
        width: 3,
        material:Cesium.Color.YELLOW
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
    var temp=viewer.scene.globe.ellipsoid.cartesianToCartographic(earthPosition);
    var lat=Cesium.Math.toDegrees(temp.latitude);
    var lng=Cesium.Math.toDegrees(temp.longitude);
    var alt=temp.height; 

    temp2=Cesium.Cartesian3.fromDegrees(lng,lat, temp.height+0.1);
    earthPosition=temp2;
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
    
