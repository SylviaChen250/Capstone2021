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
viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(144.9678, -37.81573, 1000) });

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

// 初始化



var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
var viewshed
handler.setInputAction(function (event) {
    // 分析参数
    var viewModel = { verticalAngle: 90, horizontalAngle: 120, distance: 10 };

    // 添加可视域
    viewshed = new Cesium.ViewShed3D(viewer, {
        horizontalAngle: Number(viewModel.horizontalAngle),
        verticalAngle: Number(viewModel.verticalAngle),
        distance: Number(viewModel.distance),
        calback: function () {
            viewModel.distance = viewshed.distance
        }
    });
    window.alert("view shed created.");
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);