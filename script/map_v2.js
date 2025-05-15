// READ GEOJSON OBJECT####
export let gjson = await fetch('../data/file.geojson')
    .then(response => response.json()) // Parse JSON

// CREATE A BASE MAP####
export let map = L.map('map').setView([gjson.features[0].geometry.coordinates[1], gjson.features[0].geometry.coordinates[0]], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ADD THE GEOJSON TO MAP####
let gjson2 = L.geoJSON(gjson).addTo(map)

// CREATE POPUP####
let prev_marker;
let geom;

function show_popup(cur_idx){
    if (prev_marker !== undefined){
        map.removeLayer(prev_marker)
    }

    const cur_ft = gjson.features[cur_idx]
    geom = [cur_ft["geometry"]["coordinates"][1], cur_ft["geometry"]["coordinates"][0]]
    let prop = cur_ft.properties
    let txt = `<p><b>${prop.name}</b></p><p>${prop.year_start}~ ${prop.year_end}</p><p>${prop.description}</p>`

    prev_marker = L.marker(geom);
    prev_marker.addTo(map).bindPopup(txt).openPopup();
}

show_popup(0);
console.log(gjson.features);
// MOVE TO PREVIOUS/ NEXT WHEN BUTTON IS PRESSED (OPEN THE SELECTED ONE; CLOSE THE OTHERS)####
let idx = 0
export function move_prv(){
    if (idx === 0){
        idx = gjson.features.length - 1
    }else{
        idx = idx - 1
    }

    show_popup(idx);
    map.panTo(new L.LatLng(geom[0], geom[1]));
}
export function move_next(){
    if (idx === gjson.features.length - 1){
        idx = 0
    }else{
        idx = idx + 1
    }

    show_popup(idx);
    map.panTo(new L.LatLng(geom[0], geom[1]));
}