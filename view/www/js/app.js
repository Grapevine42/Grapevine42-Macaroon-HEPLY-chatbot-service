// Dom7
var $$ = Dom7;

var serverurl = 'https://grapevine-chatserver.mybluemix.net/';

var chatbody = $('#messageBody');

// Framework7 App main instance
var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var chatView = app.views.create('#view-chat', {
  url: '/chat/'
});
var settingView = app.views.create('#view-setting', {
  url: '/setting/'
});


// Init Messages
var messages = app.messages.create({
  el: '.messages',

  // // First message rule
  // firstMessageRule: function (message, previousMessage, nextMessage) {
  //   // Skip if title
  //   if (message.isTitle) return false;
  //   /* if:
  //     - there is no previous message
  //     - or previous message type (send/received) is different
  //     - or previous message sender name is different
  //   */
  //   if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
  //   return false;
  // },
  // // Last message rule
  // lastMessageRule: function (message, previousMessage, nextMessage) {
  //   // Skip if title
  //   if (message.isTitle) return false;
  //   /* if:
  //     - there is no next message
  //     - or next message type (send/received) is different
  //     - or next message sender name is different
  //   */
  //   if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
  //   return false;
  // },
  // // Last message rule
  // tailMessageRule: function (message, previousMessage, nextMessage) {
  //   // Skip if title
  //   if (message.isTitle) return false;
  //   /* if (bascially same as lastMessageRule):
  //   - there is no next message
  //   - or next message type (send/received) is different
  //   - or next message sender name is different
  // */
  //   if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
  //   return false;
  // }
});

// Init Messagebar
var messagebar = app.messagebar.create({
  el: '.messagebar'
});

// Response flag
var responseInProgress = false;


// socket io server setting
var socket = io.connect(serverurl);

var myInfo = {
  name: "defualt",
  blood: "O rh+",
  age: "30",
  gender: "female",
  lat: 0,
  lng: 0,
  context: null
};

$$('.sosbutton').on('popup:open', function (e, popup) {

});
$$('.sosbutton').on('popup:opened', function (e, popup) {

});

var dynamicPopup = app.popup.create({
  content: '<div class="popup custom-popup">' +
    '<div class="block">' +
    '<p></p>' +
    '<p><a href="#" class="link popup-close">Close me</a></p>' +
    '</div>' +
    '</div>',
  // Events
  on: {
    open: function (popup) {
      console.log('Popup open');
    },
    opened: function (popup) {
      console.log('Popup opened');
    },
  }
});

var dynamicPopup2 = app.popup.create({
  content:
    '<div class="popup request-help-popup-frame">' +
    '<div class="block">' +
    '<div class="titleGroup"><img class="helpuIcon" src="images/icon_helpyou.png"><div class="requestText">Request for Help</div></div>' +
    '<div class="currentLocationText">Current Location</div>' +
    '<div class="currentLocationInput"><input type="text"></div>' +
    '<div class="currentLocationText">Urgent Message</div>' +
    '<div class="helpTextarea"><textarea rows="5"></textarea></div>' +
    '<div><button class="helpMeBtn">Help me!</button></div>' +
    '</div>' +
    '</div>',
  // Events
  on: {
    open: function (popup) {
      console.log('Popup open');
    },
    opened: function (popup) {
      console.log('Popup opened');
    },
  }
});

// Events also can be assigned on instance later
dynamicPopup.on('close', function (popup) {
  console.log('Popup close');
});
dynamicPopup.on('closed', function (popup) {
  console.log('Popup closed');
});

// Open dynamic popup
$$('.dynamic-popup').on('click', function () {
  dynamicPopup.open();
});

$$('.request-help-popup').on('click', function () {
  dynamicPopup2.open();
});


function geoFindMe(callback) {
  if (!navigator.geolocation) {
    return;
  }

  function success(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    callback(lat, lng);
  }

  function error() {
    console.error("err gps")
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

function setUserData() {
  //     console.log("location ?")
  geoFindMe(function (lat, lng) {
    myInfo.lat = lat;
    myInfo.lng = lng;
    sendMyInfo()
  });
  console.log('chatroom join');
}

function sendMyInfo() {
  socket.emit("enter", myInfo);
  // console.log(myInfo);
}

setUserData();

// Send Message
$$('#tabmap').on('click', function () {
  $("#tabmap").attr("src", "images/tabbar/map_active.png");
  $("#tabmap").attr("class", "tabiconelement_active");

  $("#tabchat").attr("src", "images/tabbar/chaticon.png");
  $("#tabchat").attr("class", "tabiconelement_deactive");

  $("#tabsetting").attr("src", "images/tabbar/settingicon.png");
  $("#tabsetting").attr("class", "tabiconelement_deactive");
});

$$('#tabchat').on('click', function () {
  $("#tabmap").attr("src", "images/tabbar/mapicon.png");
  $("#tabmap").attr("class", "tabiconelement_deactive");

  $("#tabchat").attr("src", "images/tabbar/chat_active.png");
  $("#tabchat").attr("class", "tabiconelement_active");

  $("#tabsetting").attr("src", "images/tabbar/settingicon.png");
  $("#tabsetting").attr("class", "tabiconelement_deactive");

});

$$('#tabsetting').on('click', function () {
  $("#tabmap").attr("src", "images/tabbar/mapicon.png");
  $("#tabmap").attr("class", "tabiconelement_deactive");

  $("#tabchat").attr("src", "images/tabbar/chaticon.png");
  $("#tabchat").attr("class", "tabiconelement_deactive");

  $("#tabsetting").attr("src", "images/tabbar/setting_active.png");
  $("#tabsetting").attr("class", "tabiconelement_active");

});

$("#mcBtn").click(function () {

  fetch('http://localhost:3005/api/speech-to-text/token')
    .then(function(response) {
      console.log(response);
      return response.text();
    }).then(function (token) {
    console.log(token);
    var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
      token: token,
      object_mode: false
    });

    stream.setEncoding('utf8'); // get text instead of Buffers for on data events

    stream.on('data', function(data) {
      var text = data.slice(0, -1);
      console.log(text);
      $("#msgInput").val($("#msgInput").val()+ text);
    });

    stream.on('error', function(err) {
      console.log(err);
    });

    document.querySelector('#stop').onclick = stream.stop.bind(stream);
  }).catch(function(error) {
    console.log(error);
  });
});

$$('.send-link').on('click', function () {
  var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
  // return if empty message
  if (!text.length) return;

  // Clear area
  messagebar.clear();

  // Return focus to area
  messagebar.focus();

  // Add message to messages
  messages.addMessage({
    text: text,
  });

  if (responseInProgress) return;

  socket.emit('message', text);

  var tmp = 0;
  socket.on('message', (data) => {
    if (tmp == 0) {
      receiveMessage(data);
      tmp = tmp + 1;
    }
  });
  tmp = 0;

});


// enter Key
$$('.messagebar').keyup(function (e) {
  enterkey();
});

// enter Key
function enterkey() {
  if (window.event.keyCode == 13) {
    var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
    // return if empty message
    if (!text.length) return;
    // Clear area
    messagebar.clear();

    // Return focus to area
    messagebar.focus();

    // Add message to messages
    messages.addMessage({
      text: text,
    });

    if (responseInProgress) return;
    // Receive dummy message

    socket.emit('message', text);

    var tmp = 0;
    socket.on('message', (data) => {
      if (tmp == 0) {
        receiveMessage(data);
        tmp = tmp + 1;
      }
    });
    tmp = 0;
  }
}

function receiveMessage(msg) {

  console.log(msg);

  var img = 'images/botImg.png';
  responseInProgress = true;
  setTimeout(function () {
    setTimeout(function () {

      if (msg.text != '..') {
        var body = defaultTxt(msg.text);

        chatbody.append(body);
      }

      if (msg.option) {

        var btnList = '';

        for (var i = 0; i < msg.option.length; i++) {
          console.log(msg.option[i].label);
          btnList = btnList + makeBtn(msg.option[i].label, msg.option[i].value.input.text) + '\n';
        }

        var optionList = '<div data-space-between="20" data-slides-per-view="4" class="swiper-container1 swiper-init demo-swiper" style="height: 35px;">' +
          '              <div class="swiper-wrapper" style="padding-left: 50px; height: 32px">'
          + btnList + '</div>\n' +
          '            </div>';

        chatbody.append(optionList);

        var swiper1 = new Swiper('.swiper-container1', {
          slidesPerView: 4,
          spaceBetween: 1,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });


      }


      if (msg.type == 'map') {
        socket.emit('message', 'event');

        var tmpMap = "<div id=map_google1 hidden></div>";

        chatbody.append(tmpMap);


        initMap(function (call) {

          var info = call.split(";");

          console.log(info);

          var body = closeShelMsg(info[0], info[1]);
          chatbody.append(body);
          initMap2();

        });


        var tmp = 0;
        socket.on('message', (data) => {
          if (tmp == 0) {
            receiveMessage(data);
            tmp = tmp + 1;
          }
        });
        tmp = 0;
      }


      if (msg.type == 'preview') {
        socket.emit('message', 'event');
        var body = information();

        chatbody.append(body);

        var tmp = 0;
        socket.on('message', (data) => {
          if (tmp == 0) {
            receiveMessage(data);
            tmp = tmp + 1;
          }
        });
        tmp = 0;
      }

      else if (msg.type == 'imageList') {


        socket.emit('message', 'event');


        var body = slider(msg.pType);

        console.log('start');
        chatbody.append(body);

        var swiper = new Swiper('.swiper-container', {
          slidesPerView: 1.8,
          spaceBetween: 2,
          pagination: {
            el: '.swiper-pagination',
          },
        });

        var tmp = 0;
        socket.on('message', (data) => {
          if (tmp == 0) {
            receiveMessage(data);
            tmp = tmp + 1;
          }
        });
        tmp = 0;
      }

      else if (msg.type == 'article') {
        socket.emit('message', 'event');

        var body = article();

        chatbody.append(body);

        var tmp = 0;
        socket.on('message', (data) => {
          if (tmp == 0) {
            receiveMessage(data);
            tmp = tmp + 1;
          }
        });
        tmp = 0;
      }

      messages.hideTyping();
      responseInProgress = false;
      // initMap();
    }, 200);
  }, 1000);
  $("#messageBody").scrollTop($("#messageBody")[0].scrollHeight);

}

function makeBtn(label, value) {


  return "<div class=\"swiper-slide\" style=\"width: 50px; height: 36px; border: none; background-color: #fafafa\">\n" +
    "<button class=\"myBtn\"" +
    "onclick=\"btnClick('" + value + "')\">" +
    label +
    "</button>\n" +
    "</div>"
}

function btnClick(value) {
  console.log(value);
  socket.emit('message', value);

  var tmp = 0;
  socket.on('message', (data) => {
    if (tmp == 0) {
      receiveMessage(data);
      tmp = tmp + 1;
    }
  });
  tmp = 0;
}

// 구글맵 관련 함수 정리
function initMap(callback) {
  map = new google.maps.Map(document.getElementById('map_google1'), {
    center: {lat: -34.397, lng: 150.644},
    disableDefaultUI: true,
    zoom: 10
  });

  var orig = {
    lat: 0,
    lng: 0
  };

  var dest = {
    lat: 0,
    lng: 0
  };

  closeShel(function (shelInfo) {
    orig.lat = myInfo.lat;
    orig.lng = myInfo.lng;

    dest.lat = Number(shelInfo.lat);
    dest.lng = Number(shelInfo.lng);

    //
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;


    directionsDisplay.setMap(map);
    //

    calculateAndDisplayRoute(directionsService, directionsDisplay, orig, dest);

    getCalInfo(orig, dest, function (call) {
      console.log(call.destinationAddresses);
      console.log(call.rows[0].elements[0].distance.text);
      console.log(call.rows[0].elements[0].duration.text);
      callback(call.destinationAddresses + ';' + call.rows[0].elements[0].duration.text);
    })
  });
}

function initMap2() {
  map = new google.maps.Map(document.getElementById('map_google2'), {
    center: {lat: -34.397, lng: 150.644},
    disableDefaultUI: true,
    zoom: 10
  });

  var orig = {
    lat: 0,
    lng: 0
  };

  var dest = {
    lat: 0,
    lng: 0
  };

  closeShel(function (shelInfo) {
    orig.lat = myInfo.lat;
    orig.lng = myInfo.lng;

    dest.lat = Number(shelInfo.lat);
    dest.lng = Number(shelInfo.lng);

    //
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;


    directionsDisplay.setMap(map);
    //

    calculateAndDisplayRoute(directionsService, directionsDisplay, orig, dest);

    getCalInfo(orig, dest, function (call) {
      console.log(call.destinationAddresses);
      console.log(call.rows[0].elements[0].distance.text);
      console.log(call.rows[0].elements[0].duration.text);
    })
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, orig, dest) {
  console.log(orig);
  console.log(dest);
  directionsService.route({
    origin: orig,
    destination: dest,

    travelMode: 'WALKING'
  }, function (response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function getCalInfo(orig, dest, callbackFunc) {
  var service = new google.maps.DistanceMatrixService;

  var origin = orig;
  var destination = dest;

  service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: 'WALKING',
    unitSystem: google.maps.UnitSystem.METRIC
  }, function (response, status) {
    if (status !== 'OK') {
      alert('Error was: ' + status);
    } else {

      callbackFunc(response);
    }
  });
}

function closeShel(callbackFunc) {
  var shelInfo = {
    name: '',
    lat: 0,
    lag: 0
  };

  axios.post(serverurl + 'closeShel',
    {
      x: myInfo.lat,
      y: myInfo.lng
    })
    .then(function (res) {

      var data = res.data;

      shelInfo.name = data.name;
      shelInfo.lat = data.x;
      shelInfo.lng = data.y;
      callbackFunc(shelInfo);
    })
    .catch(function (error) {
      console.log(error);
    });
  return shelInfo;
}


function slider(type) {
  var slideList =
    '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/tmp/preview1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/tmp/preview2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/tmp/preview3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/tmp/preview2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/tmp/preview1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
  ;


  if (type == 'driving') {
    slideList = drivingImg();
  }
  else if (type == 'noTable') {
    slideList = noTable();
  }
  else if (type == 'withChild') {
    slideList = withChild();
  }
  else if (type == 'afterD') {
    slideList = afterD();
  }
  else if (type == 'prepareD') {
    slideList = prepareD();
  }
  else if (type == 'theater') {
    slideList = theater();
  }
  else if (type == 'homeAlone') {
    slideList = homeAlone();
  }
  else if (type == 'shower') {
    slideList = shower();
  }
  else if (type == 'oceanInfo') {
    slideList = oceanInfo();
  }


  var optionList =
    '                  <div data-pagination=\'{"el": ".swiper-pagination"}\' data-space-between="2" data-slides-per-view="auto"\n' +
    '                       data-slides-per-view="auto" data-centered-slides="true"\n' +
    '                       class="swiper-container swiper-init demo-swiper demo-swiper-auto"\n' +
    '                       style="height: 300px; width: 400px; background-color: #fafafa; margin-left: 100px">\n' +
    '                    <div class="swiper-wrapper">'
    + slideList + '</div>\n' +
    '            </div>';


  return optionList;
}


function information() {
  return "<div class=\"message message-received\">\n" +
    "              <div class=\"message-avatar\" style=\"background-image:url(images/botImg.png);\"></div>\n" +
    "              <div class=\"message-content\">\n" +
    "                <div class=\"message-bubble elevation-2\">\n" +
    "                  <div class=\"selectQuestion\">\n" +
    "                    <table>\n" +
    "                      <thead>\n" +
    "                      <tr>\n" +
    "                        <th colspan=\"2\" class=\"label-cell currentDisasterInfo\">The current Disaster Info.</th>\n" +
    "                      </tr>\n" +
    "                      </thead>\n" +
    "                      <tbody>\n" +
    "                      <tr>\n" +
    "                        <th colspan=\"2\" class=\"label-cell detailDisaster\">Earthquakes Info.</th>\n" +
    "                      </tr>\n" +
    "                      <tr>\n" +
    "                        <td class=\"disasterInfoIcon\" rowspan=\"2\"><span style=\"font-size: 50px\">😀</span></td>\n" +
    "                        <td class=\"disasterinfoEmotion\">Advisory</td>\n" +
    "                      </tr>\n" +
    "                      <tr>\n" +
    "                        <td class=\"disasterInfoLocationText\">Utd Street, Seattle, WA, USA</td>\n" +
    "                      </tr>\n" +
    "                      </tbody>\n" +
    "                    </table>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </div>"
}

function defaultTxt(inputTxt) {
  return "<div class=\"message message-received\">\n" +
    "              <div class=\"message-avatar\" style=\"background-image:url(images/botImg.png);\"></div>\n" +
    "              <div class=\"message-content\">\n" +
    "                <div class=\"message-bubble\">\n" +
    inputTxt +
    "                </div>\n" +
    "              </div>\n" +
    "            </div>"
}

function article() {
  return "<div class=\"card chatCard\">\n" +
    "              <div class=\"card-footer currentDisasterInfo\">Articles</div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <table>\n" +
    "                  <tr>\n" +
    "                    <th class=\"currentDisasterInfo\">￼Deadly Earthquake Hits Japan, <br>Adding to Summer of Misery</th>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td class=\"detailDisaster\">Just five days before a powerful...</td>\n" +
    "                  </tr>\n" +
    "                  <img src=\"images/article/article1.jpg\" style=\"width: 56px; height: 44px; float: right;\">\n" +
    "                </table>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <table>\n" +
    "                  <img src=\"images/article/article2.jpg\" style=\"width: 56px; height: 44px; float: right;\">\n" +
    "                  <tr>\n" +
    "                    <th class=\"currentDisasterInfo\">￼In Quake-Prone California, <br>Alarm at Scant Insurance\n" +
    "                    </th>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td class=\"detailDisaster\">“I go to sleep praying that there...</td>\n" +
    "                  </tr>\n" +
    "                </table>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <table>\n" +
    "                  <tr>\n" +
    "                    <th class=\"currentDisasterInfo\">￼Deadly Earthquake Hits Japan, <br>Adding to Summer of Misery</th>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td class=\"detailDisaster\">A powerful earthquake struck...</td>\n" +
    "                  </tr>\n" +
    "                  <img src=\"images/article/article3.jpg\" style=\"width: 56px; height: 44px; float: right;\">\n" +
    "                </table>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\" style=\"background-image: linear-gradient(#5ee7ff, #00cdff)\">\n" +
    "                <a href=\"#\" class=\"link\" style=\"color: white; font-family: d1m; margin-right: auto; margin-left: auto;\">View\n" +
    "                  Detail</a>\n" +
    "              </div>\n" +
    "            </div>"
}

function closeShelMsg(location, time) {
  return "<div class=\"card chatCard\">\n" +
    "              <div class=\"card-footer currentDisasterInfo\">Refuge Info.</div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <table class=\"helpYouTable1 margin-vertical\">\n" +
    "                  <th colspan=\"2\">\n" +
    "                    <div id=\"map_google2\"></div>\n" +
    "                  </th>\n" +
    "                  <tr>\n" +
    "                    <td style=\"font-family: d1b;\">Location</td>\n" +
    "                    <td style=\"font-family: d1b;\">Total Time</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td id=\"helpYouLocation1\" style=\"width: 110px;\">" +
    location +
    "</td>\n" +
    "                   <td id=\"helpYouTime1\">" +
    time +
    "</td>\n" +
    "                  </tr>\n" +
    "                </table>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\" style=\"background-image: linear-gradient(#5ee7ff, #00cdff);\">\n" +
    "                <a href=\"#\" class=\"link\" style=\"color: white; font-family: d1m; margin-right: auto; margin-left: auto;\">View\n" +
    "                  Detail</a>\n" +
    "              </div>\n" +
    "            </div>"
}






// ImageList

function noTable() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/no_table_info/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/no_table_info/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/no_table_info/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/no_table_info/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function drivingImg() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/driving_car_info/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/driving_car_info/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/driving_car_info/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/driving_car_info/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/driving_car_info/5.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function withChild() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_withchild/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_withchild/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_withchild/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_withchild/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_withchild/5.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function afterD() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/after_disaster_tip/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/after_disaster_tip/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/after_disaster_tip/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/after_disaster_tip/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/after_disaster_tip/5.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/after_disaster_tip/6.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function prepareD() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/prepare_disaster_tip/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/prepare_disaster_tip/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/prepare_disaster_tip/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/prepare_disaster_tip/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/prepare_disaster_tip/5.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function theater() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/theater_info/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/theater_info/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/theater_info/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/theater_info/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function homeAlone() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_alone/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_alone/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_alone/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_alone/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/home_alone/5.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function oceanInfo() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/ocean_info/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/ocean_info/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/ocean_info/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/ocean_info/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}

function shower() {
  return '<div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/shower_info/1.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/shower_info/2.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/shower_info/3.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/shower_info/4.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"><img\n' +
    '              src="images/imagelist/shower_info/5.png" style="width: 215px; height: 278px"></div>\n' +
    '            <div class="swiper-slide" style="width: 215px; border: none; background-color: #fafafa"></div>'
    ;
}
