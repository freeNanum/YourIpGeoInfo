
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
function rplLine(value){
    if (value != null && value != "") {
        return value.replace(/\n/g, "\\n");
    }else{
        return value;
    }
}

function Weather1(nx, ny){
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    console.log("minutes: " + minutes)
 
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
    fileName = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData";
    fileName += "?ServiceKey=" + apikey;
    fileName += "&base_date=" + today;
    fileName += "&base_time=" + basetime;
    fileName += "&nx=" + _nx + "&ny=" + _ny;
    fileName += "&pageNo=1&numOfRows=7";
    fileName += "&_type=json";
 
    $.ajax({
        url: fileName,
        type: 'GET',
        cache: false,
        success: function(data) {
            //console.log(data);
            //var myXML = rplLine(data.responseText);
            var myXML = JSON.stringify(data);
            var indexS = myXML.indexOf('"body":{"items":{');
            var indexE = myXML.indexOf("}]}");
            var result = myXML;
            //console.log(myXML);
            //result = myXML.substring(indexS, indexE);

            var jsonObj = $.parseJSON('[' + result + ']');
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
                      
            var contentText = document.getElementById('allweather');
            contentText.innerHTML = "Sky: " + sky + " / RainSnow: " + rainsnow + " / Temperature : " + temperature;
        },
        error:function(request,status,error){
            alert("Please try again.\n" + "code: "+request.status+"\n"+"message: "+request.responseText+"\n"+"error: "+error);
        }
    });
 
}
