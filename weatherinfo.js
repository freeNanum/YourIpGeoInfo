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
/* LCC DFS 좌표변환을 위한 기초 자료 */
var RE = 6371.00877;    // 지구 반경(km)
var GRID = 5.0;         // 격자 간격(km)
var SLAT1 = 30.0;       // 투영 위도1(degree)
var SLAT2 = 60.0;       // 투영 위도2(degree)
var OLON = 126.0;       // 기준점 경도(degree)
var OLAT = 38.0;        // 기준점 위도(degree)
var XO = 43;            // 기준점 X좌표(GRID)
var YO = 136;           // 기1준점 Y좌표(GRID)

/* 
**   LCC DFS 좌표변환 
**   - code: "toXY" [ 위경도      -> 기상청 좌표, v1:위도, v2:경도 ]
**   - code: "toLL" [ 기상청 좌표 -> 위경도,      v1:x,    v2:y   ]
*/
function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;
 
    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;
 
    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
 
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['nx'] = v1;
        rs['ny'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
 
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}

function locationSuccess(p){
	var latitude = p.coords.latitude,
    longitude = p.coords.longitude;
    console.log("latitude: ", latitude, "longitude: ", longitude);

    // 위도/경도 -> 기상청 좌표x / 좌표 y 변환
    var rs = dfs_xy_conv("toXY",latitude,longitude);
    console.log("x: ", rs.nx, "y: ",rs.ny);
    
    //Weather1(rs.nx, rs.ny);
    //Weather2(rs.nx, rs.ny);
    //Weather3(rs.nx, rs.ny);
    //Weather(rs.nx, rs.ny);
}

 function locationError(error){
	var errorTypes = {
		0 : "Unkown error",
		1 : "unaceptable",
		2 : "fail to get location info.",
		3 : "response tiemout"
	};
	var errorMsg = errorTypes[error.code];
	console.log(errorMsg)
}

var geo_options = {
	enableHighAccuracy: true,
	maximumAge        : 30000,
	timeout           : 27000
};

function getWeatherInfo(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);
    }else{
        console.log("There is not location info.")
    }
};






