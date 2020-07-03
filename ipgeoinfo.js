function getIpGeoLocation(){
    var ipLocURL = "https://ipinfo.io/";
    ipLocURL += "json";
       
    httpRequest = new XMLHttpRequest();
    if(!httpRequest) {
        alert('could not XML-HTTP instance.');
        //return false;
    }
    httpRequest.open("GET", ipLocURL, true);
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
    httpRequest.onreadystatechange = function(response) {
        //if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status == 200)
        if(httpRequest.readyState === XMLHttpRequest.DONE)
        {
            //console.log("response: ", response);
            //alert(httpRequest.responseText);
            var text = httpRequest.responseText;
            console.log("responseText: ",text);
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '[' + text + ']';

            var jsonObj = JSON.parse(text);
            console.log("jsonObj: ",jsonObj);
            var ip = jsonObj[0].ip;
            var city = jsonObj[0].city;
            var region = jsonObj[0].region;
            var country = jsonObj[0].country;
            var loc = jsonObj[0].loc;
            var org = jsonObj[0].org;

            var lats = loc.split(',')[0];
            var lngs = loc.split(',')[1];
            
          /*    
            var ip = response.ip;
            var city = response.city;
            var region = response.region;
            var country = response.country;
            var lats = response.loc.split(',')[0];
            var lngs = response.loc.split(',')[1];
            var org = response.org;
          */  
            console.log("ip: ", ip);
            console.log("city: ", city);
            console.log("region: ", region);
            console.log("country: ", country);
            console.log("organization: ", org);
            console.log("latitude: ", lats);
            console.log("logitude: ", lngs);
            

            var contentTextip = document.getElementById('ip');
            contentTextip.innerHTML = "# IP주소: " + ip;

            var contentTextcity = document.getElementById('city');
            contentTextcity.innerHTML = "# 도시: " + city;

            var contentTextregion = document.getElementById('region');
            contentTextregion.innerHTML = "# 지역: " + region;

            var contentTextcountry = document.getElementById('country');
            contentTextcountry.innerHTML = "# 국가: " + country;

            var contentTextorg = document.getElementById('org');
            contentTextorg.innerHTML = "# IP 제공기관: " + org;

            var contentTextloc = document.getElementById('loc');
            contentTextloc.innerHTML = "# 위도: " + lats + ", 경도: " + lngs;

        
        }
    }
    httpRequest.send();
}