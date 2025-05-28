// READ GEOJSON OBJECT####
export let gjson = await fetch('../data/file.geojson')
    .then(response => response.json()) // Parse JSON

// CREATE A BASE MAP####
export let map = L.map('map').setView([gjson.features[0].geometry.coordinates[1], gjson.features[0].geometry.coordinates[0]], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Disable Scroll====
map.scrollWheelZoom.disable();
// ADD THE GEOJSON TO MAP####

// ADD A SMALL WORLD MAP####
// Create Another Div within the Map====
const minimap_div = document.getElementById("minimap");
let mini_style = minimap_div.style;
mini_style.width = "100%";
mini_style.height = "30%";
mini_style.margin = "auto";
console.log(minimap_div.style.height);


// When Button is Pressed Move to Another Place====
export let map2 = L.map("minimap", {
    zoomControl: false
}).setView([gjson.features[0].geometry.coordinates[1], gjson.features[0].geometry.coordinates[0]], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2);
map2.scrollWheelZoom.disable();

// map2.setMaxBounds(map2.getBounds());

// CREATE POPUP####
let prev_marker;
let geom;
let prev_marker2;

function show_popup(cur_idx){
    if (prev_marker !== undefined){
        map.removeLayer(prev_marker)
        map2.removeLayer(prev_marker2)
    }

    const cur_ft = gjson.features[cur_idx]
    geom = [cur_ft["geometry"]["coordinates"][1], cur_ft["geometry"]["coordinates"][0]]
    let prop = cur_ft.properties
    let txt = `<p><b>${prop.name}</b></p><p>${prop.year_start}~ ${prop.year_end}</p><p>${prop.description}</p>`

    prev_marker = L.marker(geom);
    prev_marker.addTo(map).bindPopup(txt).openPopup();
    prev_marker2 = L.marker(geom);
    prev_marker2.addTo(map2)

}

show_popup(0);

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
    map2.setView(new L.LatLng(geom[0], geom[1]), 4);

}
export function move_next(){
    if (idx === gjson.features.length - 1){
        idx = 0
    }else{
        idx = idx + 1
    }

    show_popup(idx);
    map.panTo(new L.LatLng(geom[0], geom[1]));
    map2.setView(new L.LatLng(geom[0], geom[1]), 4);
}





/*Customize the move function here???? 
But w/o popups
Pins only one place
*/