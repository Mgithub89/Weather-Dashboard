var lon;
var lat;
var uvIndex;
var city;
let cityArr;
let createdArr = JSON.parse(localStorage.getItem("city")) || "null";
let lastCity;
let cityClicked = false;

let appid = "766ebec85b2d50f13da7845409212cf2";

function createQueryURL() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

    var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
    queryParams.q = createdArr[cityArr.length - 1];
    return queryURL + $.param(queryParams);
};

function forecastQueryURL() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";

    var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
    queryParams.q = createdArr[cityArr.length - 1];
    return queryURL + $.param(queryParams);
};

function builduviUrl() {
    let url = "https://api.openweathermap.org/data/2.5/uvi?";
    var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
    queryParams.lat = lat;
    queryParams.lon = lon;

    return url + $.param(queryParams);
};

function currentLocationUpdate(response) {

    let icon = response.weather[0].icon;
    let link = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    $(".list-group-flush").empty();

    for (var i = 0; i < createdArr.length; i++) {
        var buttonEl = $("<button>");
        buttonEl.addClass("list-group-item");
        buttonEl.text(createdArr[i]);
        $(".list-group-flush").prepend(buttonEl);
    }

    $("#card1").removeClass("d-none");
    $("#city-name").html(`${response.name} (${moment().format('L')}) <img src= ${link}>`);
    $(".temp").html("Temperature: " + toFahrenhite(parseFloat(response.main.temp)).toFixed(2) + "&deg;F");
    $(".humid").text(`Humidity: ${response.main.humidity}%`);
    $(".wind").text("Wind Speed: " + response.wind.speed + "MPH");

    lon = response.coord.lon;
    lat = response.coord.lat;

    var uviUrl = builduviUrl();

    $.ajax({
        url: uviUrl,
        method: "GET"
    }).then(function (uvdata) {
        uvIndex = uvdata.value;

        if (uvIndex > 8) {
            $("#uvi").addClass("btn-danger");
            $("#uvi").removeClass("btn-warning");
            $("#uvi").removeClass("btn-success");
        }
        else if (uvIndex < 8 && uvIndex > 3) {
            $("#uvi").addClass("btn-warning");
            $("#uvi").removeClass("btn-danger");
            $("#uvi").removeClass("btn-success");
        }
        else {
            $("#uvi").addClass("btn-success");
            $("#uvi").removeClass("btn-danger");
            $("#uvi").removeClass("btn-warning");

        }
        $("#uv-label").text(`UV-Index: `)
        $("#uvi").text(`${uvIndex}`)

    });
};

function updatePage(response) {

    let icon = response.weather[0].icon;
    var link = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    $("#card1").removeClass("d-none");
    $("#city-name").html(`${response.name} (${moment().format('L')}) <img src= ${link}>`);
    $(".temp").html("Temperature: " + toFahrenhite(parseFloat(response.main.temp)).toFixed(2) + "&deg;F");
    $(".humid").text(`Humidity: ${response.main.humidity}%`);
    $(".wind").text("Wind Speed: " + response.wind.speed + "MPH");

    lon = response.coord.lon;
    lat = response.coord.lat;

    var uviUrl = builduviUrl();

    $.ajax({
        url: uviUrl,
        method: "GET"
    }).then(function (uvdata) {
        uvIndex = uvdata.value;
        if (uvIndex > 8) {
            $("#uvi").addClass("btn-danger");
            $("#uvi").removeClass("btn-warning");
            $("#uvi").removeClass("btn-success");
        }
        else if (uvIndex < 8 && uvIndex > 3) {
            $("#uvi").addClass("btn-warning");
            $("#uvi").removeClass("btn-danger");
            $("#uvi").removeClass("btn-success");
        }
        else {
            $("#uvi").addClass("btn-success");
            $("#uvi").removeClass("btn-danger");
            $("#uvi").removeClass("btn-warning");

        }
        $("#uv-label").text(`UV-Index: `)
        $("#uvi").text(`${uvIndex}`)

    });
};

function renderCity() {

    lastCity = createdArr[createdArr.length - 1];

    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${lastCity}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${lastCity}`;
    $.ajax({
        url: url,
        method: "GET"
    }).then(currentLocationUpdate)

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(forecast)
};
// function refreshCity() {

//     refCity = $("#city-name").text();

//     let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${refCity}`;
//     let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${refCity}`;
//     $.ajax({
//         url: url,
//         method: "GET"
//     }).then(currentLocationUpdate)

//     $.ajax({
//         url: forecastUrl,
//         method: "GET"
//     }).then(forecast)
// };

// if (createdArr !== "null") {
//     refreshCity();
// };

function forecast(response) {

    var forc = response.list
    var i = 5
    while (i < forc.length) {
        var forecast = forc[i];
        i += 8;

        let icon = forecast.weather[0].icon;
        let link = `http://openweathermap.org/img/wn/${icon}.png`;

        var cardCol = $("<div class='card col-2 bg-primary'>");
        var cardBody = $("<div class='card-body p-0 '>");
        var h5El = $("<h5>").text(moment(forecast.dt_txt).format('L'));
        var imgEl = $("<img>").attr("src", link);
        var p1El = $("<p>").html("Temp: " + toFahrenhite(parseFloat(forecast.main.temp)).toFixed(2) + "&deg;F");
        var p2El = $("<p>").text(`Humidity: ${forecast.main.humidity}%`);

        cardBody.append(h5El);
        cardBody.append(imgEl);
        cardBody.append(p1El);
        cardBody.append(p2El);
        cardCol.append(cardBody);
        $(".card-deck").append(cardCol);
    };

    $("#forecast-title").removeClass("d-none");
};

$("#button1").on("click", function (event) {
    event.preventDefault();
    $(".card-deck").empty();

    city = $("#city").val().trim();
    cityArr = JSON.parse(localStorage.getItem("city"));
    if (!cityArr) {
        cityArr = [];
        cityArr.push(city);
        localStorage.setItem("city", JSON.stringify(cityArr));
    } else {
        cityArr.push(city);
        localStorage.setItem("city", JSON.stringify(cityArr));
    }
    createdArr = JSON.parse(localStorage.getItem("city")) || "null"
    // lastCity = createdArr[cityArr.length - 1];
    renderCity();
});

$(document).on("click", ".list-group-item", function (event) {
    event.preventDefault();
    // lastCity = $(this).text();
    let city = $(this).text();
    $(".card-deck").empty();
    cityClicked = true;
    var url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${city}`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${city}`;

    $.ajax({
        url: url,
        method: "GET"
    }).then(updatePage)

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(forecast)

});

function toFahrenhite(K) {
    return ((K - 273.15) * 1.80 + 32)

}
// ======================

// console.log(uvIndex);
        // let cityObj = {
        //     name: cityName,
        //     icon: iconC,
        //     Temp: response.main.temp,
        //     Humid: response.main.humidity,
        //     windSpeed: response.wind.speed,
        //     uvIndex: uvIndex
        // };

        // cityArr = JSON.parse(localStorage.getItem("city"));
        // if (!cityArr) {
        //     cityArr = [];
        //     cityArr.push({
        //         name: cityName,
        //         icon: iconC,
        //         Temp: response.main.temp,
        //         Humid: response.main.humidity,
        //         windSpeed: response.wind.speed,
        //         uvIndex: uvIndex
        //     });
        //     localStorage.setItem("city", JSON.stringify(cityArr));
        // } else {
        //     cityArr.push(cityObj);
        //     localStorage.setItem("city", JSON.stringify(cityArr));
        // }
// let cityObj = {
//     name: city,
//     icon: icon,
//     Temp: response.main.temp,
//     Humid: response.main.humidity,
//     windSpeed: response.wind.speed,
//     uvIndex: uvIndex
// };
// var url = createQueryURL();
// var forcastUrl = forecastQueryURL();
// $.ajax({
//     url: url,
//     method: "GET"
// }).then(currentLocationUpdate)

// $.ajax({
//     url: forcastUrl,
//     method: "GET"
// }).then(forecast)
// var cityArr = JSON.parse(localStorage.getItem("city"));
// let myCity = cityArr[cityArr.length - 1];
// var iconC = myCity.icon;
// var link = `http://openweathermap.org/img/wn/${iconC}@2x.png`
// var buttonEl = $("<button>");
// buttonEl.addClass("list-group-item");
// buttonEl.text(myCity.name);
// $(".list-group-flush").prepend(buttonEl);
// $("#card1").removeClass("d-none");

// $("#city-name").html(`${myCity.name} (${moment().format('L')}) <img src= ${link}>`);
// $(".temp").html(`Temperature: ${toFahrenhite(parseFloat(myCity.Temp)).toFixed(2)}&deg;F`);
// $(".humid").text(`Humidity: ${myCity.Humid}%`);
// $(".wind").text(`Wind Speed: ${myCity.windSpeed}MPH`);

//in forecast fun////

// for (var i = 5; i < response.list.length; i + 8) {
    //     var forc = response.list[i];
    //     let icon = forc.weather[0].icon;
    //     let link = `http://openweathermap.org/img/wn/${icon[i]}.png`;

    //     console.log(forc);
    //     console.log(icon);
    //     console.log(link);
    // }

    // var forc1 = response.list[5];
    // var forc2 = response.list[13];
    // var forc3 = response.list[21];
    // var forc4 = response.list[29];
    // var forc5 = response.list[37];

    // let icon1 = forc1.weather[0].icon;
    // let icon2 = forc2.weather[0].icon;
    // let icon3 = forc3.weather[0].icon;
    // let icon4 = forc4.weather[0].icon;
    // let icon5 = forc5.weather[0].icon;

    // let link1 = `http://openweathermap.org/img/wn/${icon1}.png`
    // let link2 = `http://openweathermap.org/img/wn/${icon2}.png`
    // let link3 = `http://openweathermap.org/img/wn/${icon3}.png`
    // let link4 = `http://openweathermap.org/img/wn/${icon4}.png`
    // let link5 = `http://openweathermap.org/img/wn/${icon5}.png`

    // console.log(forc1.dt_txt);

    // $(".1st-day").text(moment(forc1.dt_txt).format('L'));
    // $("#icon1").attr("src", link1);
    // $("#temp1").html("Temp: " + toFahrenhite(parseFloat(forc1.main.temp)).toFixed(2) + "&deg;F");
    // $("#humidity1").text(`Humidity: ${forc1.main.humidity}%`);

    // $(".2nd-day").text(moment(forc2.dt_txt).format('L'));
    // $("#icon2").attr("src", link2);
    // $("#temp2").html("Temp: " + toFahrenhite(parseFloat(forc2.main.temp)).toFixed(2) + "&deg;F");
    // $("#humidity2").text(`Humidity: ${forc2.main.humidity}%`);

    // $(".3rd-day").text(moment(forc3.dt_txt).format('L'));
    // $("#icon3").attr("src", link3);
    // $("#temp3").html("Temp: " + toFahrenhite(parseFloat(forc3.main.temp)).toFixed(2) + "&deg;F");
    // $("#humidity3").text(`Humidity: ${forc3.main.humidity}%`);

    // $(".4th-day").text(moment(forc4.dt_txt).format('L'));
    // $("#icon4").attr("src", link4);
    // $("#temp4").html("Temp: " + toFahrenhite(parseFloat(forc4.main.temp)).toFixed(2) + "&deg;F");
    // $("#humidity4").text(`Humidity: ${forc4.main.humidity}%`);

    // $(".5th-day").text(moment(forc5.dt_txt).format('L'));
    // $("#icon5").attr("src", link5);
    // $("#temp5").html("Temp: " + toFahrenhite(parseFloat(forc5.main.temp)).toFixed(2) + "&deg;F");
    // $("#humidity5").text(`Humidity: ${forc5.main.humidity}%`);







