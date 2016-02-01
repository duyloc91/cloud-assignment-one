mapboxgl.accessToken = 'pk.eyJ1IjoiZHV5bG9jOTEiLCJhIjoiY2lqd2tra3FqMGhzMXZ3a2liMjVlOGhldiJ9.krs0HXEmlBg1mR8EjaRdaQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [1.352083, 103.819836],
    zoom: 12
});

map.on('style.load', function () {
    map.addSource("route", {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [1.352068, 103.819836],
                    [1.352069, 103.819836],
                    [1.352070, 103.819836],
                    [1.352072, 103.819836],
                    [1.352075, 103.819836],
                    [1.352077, 103.819836],
                    [1.352083, 103.819836],
                    [1.352085, 103.819836],
                    [1.352089, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                    [1.352083, 103.819836],
                ]
            }
        }
    });

    map.addLayer({
        "id": "route",
        "type": "line",
        "source": "route",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 8
        }
    });
});