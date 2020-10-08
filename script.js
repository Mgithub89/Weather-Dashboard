function createQueryURL() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

    var queryParams = { "appid": "492de008a881601e8295898b5b2a2a1d" };


    queryParams.q = $("#city").val().trim();
    // queryParams.q = "seattle";
    return queryURL + $.param(queryParams);
};
// console.log(createQueryURL());
function forcastQueryURL() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forcast?";

    var queryParams = { "appid": "492de008a881601e8295898b5b2a2a1d" };


    queryParams.q = $("#city").val().trim();
    // queryParams.q = "seattle";
    return queryURL + $.param(queryParams);
};
// $.ajax({
//     url: createQueryURL(),
//     method: "GET"
// }).then(function (response) {
//     console.log(response)
// });

function currentLocationUpdate(response) {
    // event.preventDefault();
    var cityName = $("#city").val();
    var cityName = response.name;
    var iconC = response.weather[0].icon;

    var iconurl = "http://openweathermap.org/img/wn/" + iconC + "@2x" + ".png";
    var link = `http://openweathermap.org/img/wn/${iconC}@2x.png`
    // $('#wicon').attr('src', girma);
    // var Temp = response.temp;
    console.log(link);
    console.log(iconC);
    console.log(iconurl);
    console.log(cityName);
    var liEl = $("<li>");
    liEl.addClass("list-group-item");
    liEl.text(cityName);
    $(".list-group-flush").append(liEl);

    $("#city-name").html(`${cityName} (${moment().format('L')}) <img src= ${link}>`);
    $(".temp").html("Tempreature: " + toFahrenhite(parseFloat(response.main.temp)).toFixed(2) + "&deg;F");
    $(".humid").text(`Humidity: ${response.main.humidity}%`);
    $(".wind").text("Wind Speed: " + response.wind.speed + "MPH");
    $(".uv").text(`UV index: 0`)
}
$("#button1").on("click", function (event) {
    event.preventDefault();

    var url = createQueryURL();

    $.ajax({
        url: url,
        method: "GET"
    }).then(currentLocationUpdate)

});

function toFahrenhite(K) {
    return ((K - 273.15) * 1.80 + 32)

}












// var currentDate = moment()
// $("#currentDay").text(currentDate.format("llll"));