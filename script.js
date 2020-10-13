var lon;
var lat;
var uvIndex;
var city;
let cityArr;
let lastSearched = localStorage.getItem("lastSearched");
let createdArr = JSON.parse(localStorage.getItem("city")) || "null";
let appid = "766ebec85b2d50f13da7845409212cf2";

// UVI request url
function builduviUrl() {
    let url = "https://api.openweathermap.org/data/2.5/uvi?";
    var queryParams = { "appid": "766ebec85b2d50f13da7845409212cf2" };
    queryParams.lat = lat;
    queryParams.lon = lon;
    return url + $.param(queryParams);
};

function currentLocationUpdate(response) {
    let icon = response.weather[0].icon;
    let link = `https://openweathermap.org/img/wn/${icon}@2x.png`;
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
    var uviUrl = builduviUrl();
    // let UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${appid}`;
    //ajax call for uvi
    $.ajax({
        url: uviUrl,
        // url: UVQueryURL,
        method: "GET"
    }).then(function (uvdata) {
        uvIndex = uvdata.value;
        //give bg-color based on the returned uvindex value by comaring with standard uvi level
        //to show the user uvi level
        if (uvIndex > 8) {
            $("#uvi").css("backgroundColor", "#d9534f");
        }
        else if (uvIndex < 8 && uvIndex > 3) {
            $("#uvi").css("backgroundColor", "#f0ad4e");
        }
        else {
            $("#uvi").css("backgroundColor", "#5cb85c");
        }
        $("#uv-label").text(`UV-Index: `)
        $("#uvi").text(`${uvIndex}`)
    });
};

//function to create 5 day forecast html element 
function forecast(response) {
    var forc = response.list
    var i = 5
    // loop through response.list , i starts forc[5] and increment by 8 to get 5 day forecast
    while (i < forc.length) {
        var forecast = forc[i];
        i += 8;
        //accesing the weather conditon icon with src url
        let icon = forecast.weather[0].icon;
        let link = `https://openweathermap.org/img/wn/${icon}.png`;
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
    //remove d-none class from h3 with #forecast-title
    $("#forecast-title").removeClass("d-none");
};

//function to make ajax call by taking newcity (user entered city)
function renderCity(newCity) {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${newCity}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${newCity}`;

    //ajax call for current weather
    $.ajax({
        url: url,
        method: "GET"
    }).then(currentLocationUpdate)
    //ajax call for forecast weather
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(forecast)
};

//refreshe the page with the lastSearched city when a user refresh the page
if (lastSearched) {
    renderCity(lastSearched);
}

//click listener on search button
$("#button1").on("click", function (event) {
    event.preventDefault();
    $(".card-deck").empty();
    // converting city name to uppercase
    city = $("#city").val().trim().toUpperCase();
    if (city === "") {
        //alert the user and remove all displayed data
        alert("pls enter city name ");
        $("#card1").addClass("d-none");
        $("#forecast-title").addClass("d-none");
        return;
    }

    if (city !== "") {
        lastSearched = city;
        localStorage.setItem("lastSearched", lastSearched);
    }
    lastSearched = localStorage.getItem("lastSearched");
    cityArr = JSON.parse(localStorage.getItem("city"));
    if (!cityArr) {
        cityArr = [];
        //adding only new  value 
        if (cityArr.indexOf(city) === -1) {
            cityArr.push(city);
            localStorage.setItem("city", JSON.stringify(cityArr));
        }
    } else {
        if (cityArr.indexOf(city) === -1) {
            cityArr.push(city);
            localStorage.setItem("city", JSON.stringify(cityArr));
        }
    }
    createdArr = JSON.parse(localStorage.getItem("city"))
    let lastCity = createdArr[createdArr.length - 1];
    //invoke renderCity function by passing lastSearched 
    renderCity(lastSearched);

});

// click listener on the city buttons
$(document).on("click", ".list-group-item", function (event) {
    event.preventDefault();
    let chosenCity = $(this).text();

    lastSearched = chosenCity;
    localStorage.setItem("lastSearched", lastSearched)
    lastSearched = localStorage.getItem("lastSearched");
    $(".card-deck").empty();
    //invoke renderCity fun by passing chosenCity
    renderCity(chosenCity);
});

// function  change Temp to Fahrenhite
function toFahrenhite(K) {
    return ((K - 273.15) * 1.80 + 32)

}
// ======================







