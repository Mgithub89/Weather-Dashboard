var lon;
var lat;
var uvIndex;
var city;
let cityArr;
let createdArr = JSON.parse(localStorage.getItem("city")) || "null";
let appid = "766ebec85b2d50f13da7845409212cf2";

//current Weather request url
// function createQueryURL() {
//     var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
//     var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
//     queryParams.q = createdArr[cityArr.length - 1];
//     return queryURL + $.param(queryParams);
// };

//forecast request url
// function forecastQueryURL() {
//     var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";
//     var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
//     queryParams.q = createdArr[cityArr.length - 1];
//     return queryURL + $.param(queryParams);
// };

//UVI request url
// function builduviUrl() {
//     let url = "https://api.openweathermap.org/data/2.5/uvi?";
//     var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
//     queryParams.lat = lat;
//     queryParams.lon = lon;
//     return url + $.param(queryParams);
// };

function currentLocationUpdate(response) {
    let icon = response.weather[0].icon;
    let link = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    $(".list-group-flush").empty();

    //loop through createdArr and create buttonElm , addclass list-group-item
    for (var i = 0; i < createdArr.length; i++) {
        var buttonEl = $("<button>");
        buttonEl.addClass("list-group-item");
        // updating the buttonElm textcontent and prepend it to ul with class list-group-flush
        buttonEl.text(createdArr[i]);
        $(".list-group-flush").prepend(buttonEl);
    }
    //remove d-none class from the div(#card1)
    $("#card1").removeClass("d-none");

    //update the DOM with the response value     
    $("#city-name").html(`${response.name} (${moment().format('L')}) <img src= ${link}>`);
    $(".temp").html("Temperature: " + toFahrenhite(parseFloat(response.main.temp)).toFixed(2) + "&deg;F");
    $(".humid").text(`Humidity: ${response.main.humidity}%`);
    $(".wind").text("Wind Speed: " + response.wind.speed + "MPH");

    //longtuid and latitude from the response 
    lon = response.coord.lon;
    lat = response.coord.lat;

    //uvi request url
    // var uviUrl = builduviUrl();
    let UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${appid}`;
    //ajax call for uvi
    $.ajax({
        // url: uviUrl,
        url: UVQueryURL,
        method: "GET"
    }).then(function (uvdata) {
        uvIndex = uvdata.value;
        //give bg-color based on the returned uvindex value 
        if (uvIndex > 8) {
            $("#uvi").css("background-color", "red");
        }
        else if (uvIndex < 8 && uvIndex > 3) {
            $("#uvi").css("background-color", "yellow");
        }
        else {
            $("#uvi").css("background-color", "green");
        }
        $("#uv-label").text(`UV-Index: `)
        $("#uvi").text(`${uvIndex}`)
    });
};

//function to create 5 day forecast html element 
function forecast(response) {
    var forc = response.list
    var i = 5
    while (i < forc.length) {
        var forecast = forc[i];
        i += 8;
        //accesing the weather conditon icon with src url
        let icon = forecast.weather[0].icon;
        let link = `http://openweathermap.org/img/wn/${icon}.png`;
        // console.log(response);
        //creating html elements for 5 day forecast and giving value
        var cardCol = $("<div class='card col-2 bg-primary'>");
        var cardContent = $("<div class='card-body p-0 '>");
        var h5El = $("<h5>").text(moment(forecast.dt_txt).format('L'));
        var imgEl = $("<img>").attr("src", link);
        var p1El = $("<p>").html("Temp: " + toFahrenhite(parseFloat(forecast.main.temp)).toFixed(2) + "&deg;F");
        var p2El = $("<p>").text(`Humidity: ${forecast.main.humidity}%`);

        //append all the element in to the div with class-card-body
        cardContent.append(h5El);
        cardContent.append(imgEl);
        cardContent.append(p1El);
        cardContent.append(p2El);
        cardCol.append(cardContent);
        $(".card-deck").append(cardCol);
    };

    $("#forecast-title").removeClass("d-none");
};

function updatePage(response) {
    let icon = response.weather[0].icon;
    var link = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    // /update the DOM with the response value 
    $("#card1").removeClass("d-none");
    $("#city-name").html(`${response.name} (${moment().format('L')}) <img src= ${link}>`);
    $(".temp").html("Temperature: " + toFahrenhite(parseFloat(response.main.temp)).toFixed(2) + "&deg;F");
    $(".humid").text(`Humidity: ${response.main.humidity}%`);
    $(".wind").text("Wind Speed: " + response.wind.speed + "MPH");

    lon = response.coord.lon;
    lat = response.coord.lat;

    // var uviUrl = builduviUrl();
    let UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${appid}`;
    $.ajax({
        url: UVQueryURL,
        method: "GET"
    }).then(function (uvdata) {
        uvIndex = uvdata.value;
        if (uvIndex > 8) {
            $("#uvi").css("background-color", "red");
        }
        else if (uvIndex < 8 && uvIndex > 3) {
            $("#uvi").css("background-color", "yellow");
        }
        else {
            $("#uvi").css("background-color", "green");
        }
        $("#uv-label").text(`UV-Index: `)
        $("#uvi").text(`${uvIndex}`)
    });
};

//function to make ajax call by taking last city of the array when the page is refreshed
function renderCity() {

    var lastCity = createdArr[createdArr.length - 1];
    //incase if a user type city name in search box and it exist in the localstorage list replace lastcity with enterd city value
    if (city !== undefined) {
        lastCity = city
    }

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

if (createdArr !== "null") {
    renderCity()
}
//click listener on search button
$("#button1").on("click", function (event) {
    event.preventDefault();
    $(".card-deck").empty();
    // converting city name to uppercase
    city = $("#city").val().trim().toUpperCase();
    if (city === "") {
        alert("pls enter city name ");
        return;
    }
    cityArr = JSON.parse(localStorage.getItem("city"));
    if (!cityArr) {
        cityArr = [];
        //adding uniqe value and not addind diplicate value 
        if (cityArr.indexOf(city) === -1) {
            cityArr.push(city);
            localStorage.setItem("city", JSON.stringify(cityArr));
        }

    } else {
        console.log(city);
        console.log(cityArr);
        if (cityArr.indexOf(city) === -1) {
            cityArr.push(city);
            localStorage.setItem("city", JSON.stringify(cityArr));
        }
    }
    createdArr = JSON.parse(localStorage.getItem("city")) || "null"
    console.log(createdArr);
    renderCity();

});

// click listener on the city buttons
$(document).on("click", ".list-group-item", function (event) {
    event.preventDefault();
    let city = $(this).text();
    $(".card-deck").empty();
    var url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${city}`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${city}`;

    // ajax call for clicked city
    $.ajax({
        url: url,
        method: "GET"
    }).then(updatePage)

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(forecast)

});

// function to change Temp Fahrenhite
function toFahrenhite(K) {
    return ((K - 273.15) * 1.80 + 32)

}
// ======================







