function Weather3(nx, ny){
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    console.log("minutes: " + minutes)
 
    if(minutes < 30){
        hours = hours - 1;
        if(hours < 0){
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            month = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(month<10) {
        month='0'+month
    }
    if(day<10) {
        day='0'+day
    }

    /* 
    ** test for hours because of items's count 
    ** Could not get weather info. when from 05:30 to 08:29.
    */
    //hours = '05';
    console.log(hours);

    var _nx = nx,
    _ny = ny,
    apikey = "API-Key",
    today = year+""+month+""+day,
    basetime = hours + "00",
    ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData";
    ForecastGribURL += "?ServiceKey=" + apikey;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + basetime;
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&numOfRows=7";
    ForecastGribURL += "&_type=json";

    var xhr = new XMLHttpRequest();
    //xhr.open("GET" , encodeURI(ForecastGribURL) , true);
    xhr.open("GET" , ForecastGribURL , true);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            alert(xhr.responseText);
            var text = xhr.responseText;
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '[' + text + ']';
            
            var jsonObj = JSON.parse(text);
            if(jsonObj[0].response.body.totalCount != 0){
                var rainsnow = jsonObj[0].response.body.items.item[0].fcstValue;
                var rain_state = jsonObj[0].response.body.items.item[1].fcstValue;
                var rain = jsonObj[0].response.body.items.item[3].fcstValue;
                var sky = jsonObj[0].response.body.items.item[4].fcstValue;
                var temperature = jsonObj[0].response.body.items.item[5].fcstValue;
            }else{
                console.log("Could not get weather info.");
            }
            
            console.log(rainsnow);
            console.log(rain_state);
            console.log(rain);
            console.log(sky);
            console.log(temperature);
        }
    }
    xhr.send();
}