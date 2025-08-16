/*
 * MIT License
 *
 * Copyright (c) 2024 Jaehong Park
 * Email: jaehong1972@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
function Weather(nx, ny){
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    console.log("minutes: " + minutes)
    $('.weather-date').html(month + "월 " + day + "일 " + week[today.getDay()]+"요일");
 
    if(minutes < 30){
        hours = hours - 1;
        if(hours < 0){
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            minutes = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(minutes<10) {
        minutes='0'+minutes
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

    /* This is old API and In 2020.07.01, changed to new API.
    var _nx = nx,
    _ny = ny,
    apikey = "GsIEPvrEMExP3XquMGH1bYL8tixNTFkfjICqMXpMg3z2%2Fm3GzrMkyvfkwMdk6bidaAPFrsJrojC829XMl0anMQ%3D%3D",
    today = year+""+ minutes +""+day,
    basetime = hours + "00",

    //ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData";
    ForecastGribURL = "http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst";
    ForecastGribURL += "?ServiceKey=" + apikey;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + basetime;
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&numOfRows=7";
    ForecastGribURL += "&_type=json";
    */

    var _nx = nx;
    var _ny = ny;
    var today = year+""+ month +""+day;
    var basetime = hours + "00";

    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst'; /*URL*/
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + KMA_API_KEY; /*Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(today); /**/
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(basetime); /**/
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(_nx); /**/
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(_ny); /**/

    // Avoid CORS.
    //fetch('http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst', {mode: 'no-cors'});

    httpRequest = new XMLHttpRequest();
    //httpRequest.withCredentials = false;
    if(!httpRequest) {
        alert('could not create XML-HTTP instance.');
        return false;
    }

    
    //httpRequest.open("GET", ForecastGribURL, true);
    httpRequest.open('GET', url + queryParams, true);
    
    function alertContents() {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              alert(httpRequest.responseText);
            } else {
              alert('There was a problem with the request.');
            }
          }
        }
        catch( e ) {
          alert('Caught Exception: ' + e.description);
        }
    }

    //httpRequest.onreadystatechange = alertContents;
    httpRequest.onreadystatechange = function() {
        if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status == 200)
        {
            alert(httpRequest.responseText);
            var text = httpRequest.responseText;
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '[' + text + ']';
            
            var jsonObj = JSON.parse(text);
            //console.log(jsonObj);
            if(jsonObj[0].response.body.totalCount != 0){
                var rainsnow = jsonObj[0].response.body.items.item[0].fcstValue;
                var rain_state = jsonObj[0].response.body.items.item[1].fcstValue;
                var rain = jsonObj[0].response.body.items.item[3].fcstValue;
                var sky = jsonObj[0].response.body.items.item[4].fcstValue;
                var temperature = jsonObj[0].response.body.items.item[5].fcstValue;
                
                console.log(rainsnow); // - 
                console.log(rain_state);
                console.log(rain);
                console.log(sky); // -
                console.log(temperature);

                $('.weather-temp').html("Temperature :" + temperature.toFixed(1) + " ℃");
                $('#RN1').html("Rain-capacity per hour : "+ rain +"mm");
            
                if(rain_state != 0) {
                    switch(rain_state) {// when rainny or snowy,
                        case 1:
                        $('.weather-state-text').html("rain");
                            break;
                        case 2:
                            $('.weather-state-text').html("rain/snow");
                            break;
                        case 3:
                            $('.weather-state-text').html("snow");
                            break;
                    }
                }else{
                    switch(sky) { //when not rainny,
                        case 1:
                            $('.weather-state-text').html("good");
                            break;
                        case 2:
                            $('.weather-state-text').html("little cloudy");
                            break;
                        case 3:
                        $('.weather-state-text').html("heavy cloudy");
                            break;
                        case 4:
                        $('.weather-state-text').html("not good");    
                            break;
                    }
                
                    $('.weather-state-text').html("good");  
                }
            }else{
                console.log("Could not get weather info.");
            }
        }
    }

    httpRequest.send('');
}