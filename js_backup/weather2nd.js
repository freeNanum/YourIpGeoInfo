function Weather2(nx, ny) {
    
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
 
    $('.weather-date').html(month +"월 " + day + "일 " + week[today.getDay()]+"요일");
 
    /*
     * Korean Weather agency release, every 30 minute.
     */
    if(minutes < 30){
        // When minutes < 30, hours should be set value ealier than 1 hour.
        hours = hours - 1;
        if(hours < 0){
            // When hours < 0, day should be set value of ealier day.
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            month = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    
    if(hours < 10) {
        hours = '0'+hours;
    }
    if(month < 10) {
        month = '0' + month;
    }    
    if(day < 10) {
        day = '0' + day;
    } 
 
    today = year+""+month+""+day;
    
    /* 
    ** test for hours because of items's count 
    ** Could not get weather info. when from 05:30 to 08:29.
    */
    //hours = '05';
    
    /* 좌표 */
    var _nx = nx; 
    var _ny = ny;
    var apikey = "API-Key";
    ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData";
    ForecastGribURL += "?ServiceKey=" + apikey;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + hours +"00";
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&numOfRows=7";
    ForecastGribURL += "&_type=json";
 
$.ajax({
    url: ForecastGribURL
    ,type: 'get'
    ,success: function(msg) { 
        //var text = msg.responseText;
        var text = JSON.stringify(msg);
        //console.log(text);
        text = text.replace(/(<([^>]+)>)/ig,""); // all HTML tag -> space. 
        text = '[' + text + ']';
        
        var jsonObj = $.parseJSON(text);
        //console.log(jsonObj);
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
        
        $('.weather-temp').html(temperature.toFixed(1) + " ℃");
        $('#RN1').html("시간당강수량 : "+ rain +"mm");
       
        if(rain_state != 0) {
            switch(rain_state) {//0
                case 1:
                $('.weather-state-text').html("비");
                    break;
                case 2:
                    $('.weather-state-text').html("비/눈");
                    break;
                case 3:
                    $('.weather-state-text').html("눈");
                    break;
            }
        }else{
            switch(sky) { //20
                case 1:
                    $('.weather-state-text').html("맑음");
                    break;
                case 2:
                    $('.weather-state-text').html("구름조금");
                    break;
                case 3:
                $('.weather-state-text').html("구름많음");
                    break;
                case 4:
                $('.weather-state-text').html("흐림");    
                    break;
            }
        $('.weather-state-text').html("맑음");    
        } //if
    } //success
  })    
}

