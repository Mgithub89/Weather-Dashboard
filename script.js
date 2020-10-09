var lon;
var lat;

function createQueryURL() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

    var queryParams = { "appid": "492de008a881601e8295898b5b2a2a1d" };


    queryParams.q = $("#city").val().trim();
    // queryParams.q = "seattle";
    return queryURL + $.param(queryParams);
};
// console.log(createQueryURL());
function forecastQueryURL() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";

    var queryParams = { "appid": "492de008a881601e8295898b5b2a2a1d" };


    queryParams.q = $("#city").val().trim();
    // queryParams.q = "seattle";
    return queryURL + $.param(queryParams);
};


function builduviUrl() {
    let url = "https://api.openweathermap.org/data/2.5/uvi?";
    var queryParams = { "appid": "492de008a881601e8295898b5b2a2a1d" };
    queryParams.lat = lat;
    queryParams.lon = lon;

    return url + $.param(queryParams);
}

// $.ajax({
//     url: createQueryURL(),
//     method: "GET"
// }).then(function (response) {
//     console.log(response)
// });

function currentLocationUpdate(response) {
    // event.preventDefault();
    // var cityName = $("#city").val();
    var cityName = response.name;
    var iconC = response.weather[0].icon;

    // var iconurl = "http://openweathermap.org/img/wn/" + iconC + "@2x" + ".png";
    var link = `http://openweathermap.org/img/wn/${iconC}@2x.png`

    var liEl = $("<li>");
    liEl.addClass("list-group-item");
    liEl.text(cityName);
    $(".list-group-flush").append(liEl);

    $("#city-name").html(`${cityName} (${moment().format('L')}) <img src= ${link}>`);
    $(".temp").html("Temperature: " + toFahrenhite(parseFloat(response.main.temp)).toFixed(2) + "&deg;F");
    $(".humid").text(`Humidity: ${response.main.humidity}%`);
    $(".wind").text("Wind Speed: " + response.wind.speed + "MPH");
    // $(".uv").text(`UV index: 0`)
    lon = response.coord.lon;
    lat = response.coord.lat;

    var uviUrl = builduviUrl();

    $.ajax({
        url: uviUrl,
        method: "GET"
    }).then(function (response) {
        var uvIndex = response.value;
        console.log(uvIndex);
        if (uvIndex > 10.00) {
            $("#uvi").addClass("btn-danger");
            $("#uvi").removeClass("btn-success");
        } else {
            $("#uvi").addClass("btn-success");
            $("#uvi").removeClass("btn-danger");
        }
        $("#uv-label").text(`UV-Index: `)
        $("#uvi").text(`${uvIndex}`)
    })

}


function forcast(response) {
    console.log(response);
    var forc1 = response.list[5];
    var forc2 = response.list[13];
    var forc3 = response.list[21];
    var forc4 = response.list[29];
    var forc5 = response.list[37];

    let icon1 = forc1.weather[0].icon;
    let icon2 = forc2.weather[0].icon;
    let icon3 = forc3.weather[0].icon;
    let icon4 = forc4.weather[0].icon;
    let icon5 = forc5.weather[0].icon;

    let link1 = `http://openweathermap.org/img/wn/${icon1}.png`
    let link2 = `http://openweathermap.org/img/wn/${icon2}.png`
    let link3 = `http://openweathermap.org/img/wn/${icon3}.png`
    let link4 = `http://openweathermap.org/img/wn/${icon4}.png`
    let link5 = `http://openweathermap.org/img/wn/${icon5}.png`

    console.log(forc1.dt_txt);

    $(".1st-day").text(moment(forc1.dt_txt).format('L'));
    $("#icon1").attr("src", link1);
    $("#temp1").html("Temp: " + toFahrenhite(parseFloat(forc1.main.temp)).toFixed(2) + "&deg;F");
    $("#humidity1").text(`Humidity: ${forc1.main.humidity}%`);

    $(".2nd-day").text(moment(forc2.dt_txt).format('L'));
    $("#icon2").attr("src", link2);
    $("#temp2").html("Temp: " + toFahrenhite(parseFloat(forc2.main.temp)).toFixed(2) + "&deg;F");
    $("#humidity2").text(`Humidity: ${forc2.main.humidity}%`);

    $(".3rd-day").text(moment(forc3.dt_txt).format('L'));
    $("#icon3").attr("src", link3);
    $("#temp3").html("Temp: " + toFahrenhite(parseFloat(forc3.main.temp)).toFixed(2) + "&deg;F");
    $("#humidity3").text(`Humidity: ${forc3.main.humidity}%`);

    $(".4th-day").text(moment(forc4.dt_txt).format('L'));
    $("#icon4").attr("src", link4);
    $("#temp4").html("Temp: " + toFahrenhite(parseFloat(forc4.main.temp)).toFixed(2) + "&deg;F");
    $("#humidity4").text(`Humidity: ${forc4.main.humidity}%`);

    $(".5th-day").text(moment(forc5.dt_txt).format('L'));
    $("#icon5").attr("src", link5);
    $("#temp5").html("Temp: " + toFahrenhite(parseFloat(forc5.main.temp)).toFixed(2) + "&deg;F");
    $("#humidity5").text(`Humidity: ${forc5.main.humidity}%`);


}

$("#button1").on("click", function (event) {
    event.preventDefault();

    var url = createQueryURL();
    var forcastUrl = forecastQueryURL();
    $.ajax({
        url: url,
        method: "GET"
    }).then(currentLocationUpdate)

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(forcast)

});

function toFahrenhite(K) {
    return ((K - 273.15) * 1.80 + 32)

}












// var currentDate = moment()
// $("#currentDay").text(currentDate.format("llll"));