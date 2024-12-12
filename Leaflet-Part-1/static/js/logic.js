//Set up the Base Map in grayscale
let baseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

let map = L.map("map", {center: [34, -95], zoom: 5});




baseMap.addTo(map);


//Fetch the earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data){

    //Set function and styles info
    function styleInfo(feature) {
        return {
            fillColor: getColour(feature.geometry.coordinates[2]), 
            radius: getSize(feature.properties.mag),
            stroke: true
        };
    }
    function getSize(magnitude) {
        if (magnitude=== 0) {
            return 1;

        } return magnitude * 4;
    }
    function getColour(depth) {
        switch (true) {
            case depth > 90: 
                return "purple";
            case depth > 70:
                return "red";
            case depth > 50:
                return "orangered";
            case depth > 30:
                return "orange";
            case depth > 10:
                return "yellow"; 
            
            default:
               return "green";
        }

    }
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
          );
        }
      }).addTo(map);
// Add legend and placement
let legend = L.control({
    position: "bottomright" 
});

legend.onAdd = function () {
    // Create a container div for the legend
    let div = L.DomUtil.create("div", "info legend");

    // Add a title to the legend
    div.innerHTML += "<h4>Earthquake Depth</h4>";

    // Define depth ranges and corresponding colors
    const depths = [-10, 10, 30, 50, 70, 90];
    const colors = ["green", "yellow", "orange", "orangered", "red", "purple"];

    // Add the depth ranges and colors to the legend
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background: ${colors[i]}"></i> ` +
            `${depths[i]}${(depths[i + 1] ? `&ndash;${depths[i + 1]}` : "+")} km<br>`;
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);


});