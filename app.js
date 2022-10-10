/*
 * Copyright 2022 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.post('/');
app.listen(8080);


var mockData = {
  betsAdd: {
      "result": "FAILED",
      "message": "Betting is already closed. No fight is active.",
      "credits": "100.00"
  },
  playerData: {
      "result": "OK",
      "player": {
          "username": "Guest",
          "currency_display": "USD",
          "credits": "100.00",
          "total_bets_today": "0.00",
          "daily_bet_limit": null
      },
      "credits": "100.00",
      "converted_credits": "100.00",
      "currency_rate": "1"
  },
  fightsData: {
    "result": "OK",
    "fight": {
        "id": 2715,
        "no": "1",
        "meron_entry_name": "",
        "wala_entry_name": "",
        "betting_status": "OPEN"
    },
    "white_rooster": null,
    "red_rooster": null
  },
  eventsData: {
      "result": "OK",
      "event": {
          "id": 13,
          "created": "2022-10-04T12:13:14-07:00",
          "modified": "2022-10-05T12:01:19-07:00",
          "name": "Cockfighting Events",
          "date_time": "2022-10-06T03:00:00-07:00",
          "date": "2022-10-06",
          "time": "2022-10-06T03:00:00-07:00",
          "status": "LIVE",
          "arena_id": 1,
          "media_server_id": 6,
          "minimum_bet": "5.00",
          "maximum_bet": "300.00",
          "minimum_load": "5.00",
          "first_declaration_start": "2022-10-06T03:00:00-07:00",
          "last_declaration_end": null,
          "total_rake": "0.00",
          "total_surplus": "0",
          "total_commission": "0.00",
          "total_commission_surplus": "0",
          "net_rake": "0.00",
          "count_meron": 0,
          "count_wala": 0,
          "count_draw": 0,
          "count_cancel": 0,
          "sum_meron": "0.00",
          "sum_wala": "0.00",
          "banner_message": "FIGHTS WITH ODDS BELOW 1.20 WILL BE CANCELLED.",
          "banner_message_open": "FIGHTS WITH ODDS BELOW 1.20 WILL BE CANCELLED.",
          "banner_message_close": "FIGHTS WITH ODDS BELOW 1.20 WILL BE CANCELLED.",
          "banner_message_declaration": "FIGHTS WITH ODDS BELOW 1.20 WILL BE CANCELLED.",
          "is_bet_migrated": "NO",
          "is_fight_migrated": "NO",
          "status_agent_commission": "INACTIVE",
          "status_event_report": "INACTIVE",
          "no_fights": "200",
          "operator_rake": "0.00",
          "system_rake": "0.00",
          "content_rake": "0.00",
          "event_type_id": 2,
          "eleft_name": "RED",
          "eright_name": "BLUE",
          "api_event_token": null,
          "media_server": {
              "id": 6,
              "created": "2022-08-04T08:14:36-07:00",
              "modified": "2022-08-04T08:14:52-07:00",
              "name": "defaultpldt",
              "stream_url": " https://live.cockpitgaming.io/citroftest01/citrofstream02-manifest.m3u8",
              "status": "ENABLED"
          }
      }
  },
  fightResult: {
      "result": "OK",
      "type": null,

      "bacarat": [
          []
      ],
      "default_data": [
          []
      ],
      "max_col": 10,
      "max_col_b": 18,
      "meron": 0,
      "wala": 0,
      "cancel": 0,
      "draw": 0
  },
  bettingTable: {
      "action": "update-bettingTable",
      "betting_status": "OPEN",
      "camera_side": "",
      "meron_odds": "0",
      "wala_odds": "0",
      "meron_amount": 0,
      "wala_amount": 0,
      "player_meron_amount": 0,
      "player_wala_amount": 0,
      "result": "OK"
  }
}

var activeBets = []

var getActiveBets = function(content) {

  if (!activeBets.length) { 
    return `<h4 class="text-center py-3">No Active Bets</h4>`
  }

  var fightId = mockData.fightsData.fight.id

  var tr = (data) => `<tr>
            <td class="right">
                <p class="font-12">FIGHT # ${fightId}</p>
                <p class="font-14">BET ON <span class="text-side-${data.colorClass}">${data.color}</span></p>
            </td>
            <td class="right text-center">
                <p class="font-14">${data.amount}</p>
                <p class="font-12 text-side-${data.colorClass}">AMOUNT</p>
            </td>
                </tr>`

  var html = ''
  activeBets.forEach( item => {
    var color = item.side == 'LEFT' ? 'RED' : 'BLUE'
    var colorClass = item.side.toLowerCase();
    var amount = parseFloat(item.amount).toFixed(2);
    html += tr({color, colorClass, amount})
  })

  return `<table class="active-bet-table">
        ${html}
    </table>`;
}

var updateBettingTable = function() {
  var meronAmount = 0
  var walaAmount = 0

  activeBets.forEach(item => {
    if (item.side == "LEFT") {
      meronAmount += parseInt(item.amount)
    } else {
      walaAmount += parseInt(item.amount)
    }
  })

  mockData.bettingTable.meron_amount =  meronAmount
  mockData.bettingTable.player_meron_amount = meronAmount
  mockData.bettingTable.wala_amount = walaAmount
  mockData.bettingTable.player_wala_amount = walaAmount
  
  //calculate odds
}

var calculate = {
  creditPlayer: (amount) => {
    mockData.playerData.player.credits = mockData.playerData.player.credits + amount
    mockData.playerData.credits = mockData.playerData.credits + amount
  },
  debitPlayer: (amount) => {
    mockData.playerData.player.credits = mockData.playerData.player.credits - amount
    mockData.playerData.credits = mockData.playerData.credits - amount
  }
}

app.post("/players/player-data", function (request, response) {
  // const data = require('./public/api/player-data.js');

  response.send(JSON.stringify(mockData.playerData));
});

app.post("/fights/data", function (request, response) {
  // const data = require('./public/api/fights-data.js');
  response.send(JSON.stringify(mockData.fightsData));
});

app.post("/fights/fight-results", function (request, response) {
  // const data = require('./public/api/fight-results.js');
  response.send(JSON.stringify(mockData.fightResult));
});

app.post("/bets/betting-table", function (request, response) {
  response.send(JSON.stringify(mockData.bettingTable));
});

app.post("/bets/active-bets", function (request, response) {
  response.send(getActiveBets());
});

app.post("/bets/bet-history", function (request, response) {
  // response.sendFile(__dirname + "/public/api/bets-history.html");
  response.send(updateBetsHistory());
});

app.post("/bets/add", function (request, response) {
  console.log('request /bets/add', request.body)

  var success = {
    "result":"OK",
    "message":"Success",
    "credits": mockData.playerData.credits
  }
  
  var failed = {
    "result": "FAILED",
    "message": "Betting is already closed. No fight is active.",
    "credits": mockData.playerData.credits
  }

  var data = request.body.betting_status == 'OPEN' ? success : failed

  if (request.body.betting_status == 'OPEN') {
    activeBets.push(request.body)
    calculate.debitPlayer(request.body.amount)
    updateBettingTable()
  }

  // const data = require('./public/api/bets-add.js');
  response.send(JSON.stringify(data));
});

app.post("/events/data", function (request, response) {
  response.send(JSON.stringify(mockData.eventsData));
});


var lastWinning = ''
var updateBacarat = function(winner) {
  var bacarat = mockData.fightResult.bacarat
  var standard = mockData.fightResult.default_data
  var meron = mockData.fightResult.meron
  var wala = mockData.fightResult.wala
  var cancel = mockData.fightResult.cancel

  
  var win = winner == 'RED' ? 'LEFT' : 'RIGHT'
  lastWinning = win

  if (!bacarat.length) {
      bacarat.push([{
          "badge": `badge-fight-${win.toLowerCase()}`,
          "no": "1",
          "side": `${win}`,
          "border": ""
      }])
  } 
}

var winner = ''
var updateBetsHistory = function() {

  var html = ''
  activeBets.forEach( item => {
    var color = item.side == 'LEFT' ? 'RED' : 'BLUE'
    if (winner == color) {

      html += `<tr>
          <td class="pl-1 pr-1 text-center">
              <span class="badge badge-${item.side.toLowerCase()} badge-result">${item.fight_id}</span>
          </td>
          <td class="pl-1 pr-1 text-center">
              <p ><b><span class="text-side-${item.side.toLowerCase()} ls-02 btn-light btn-sm" >${color}</span></b></p>
              <p class="text-success"><b><i class="text-success bi bi-check-circle-fill"></i> WIN 2</b></p>
          </td>
          <td class="pl-1 pr-1 text-end">
              <p class="-ls-02 font-15"><b>${item.amount}</b></p>
              <p class="- ls-02   font-15"><b>${item.amount * 2} </b></p>
          </td>
      </tr>`

    } else {
      html += `<tr>
          <td class="pl-1 pr-1 text-center">
              <span class="badge badge-${item.side.toLowerCase()} badge-result">${item.fight_id}</span>
          </td>
          <td class="pl-1 pr-1 text-center">
              <p ><b><span class="text-side-${item.side.toLowerCase()} ls-02 btn-light btn-sm" >${color}</span></b></p>
              <p class="text-danger"><b><i class="text-danger bi bi-x-circle-fill"></i> LOSE </b></p>
          </td>
          <td class="pl-1 pr-1 text-end">
              <p class="-ls-02 font-15"><b>${item.amount}</b></p>
              <p class="- ls-02   font-15"><b>${item.amount * 2} </b></p>
          </td>
      </tr>`
    }
    
    
  })


  return `<div class="table-responsive mt-1" >
      <table class="table" id="betHistoryDT">
          <thead>
              <tr>
                  <td></td><td></td> <td></td>
              </tr>
          </thead>
          <tbody>
            ${html}
          </tbody>
      </table>
  </div>
  <script>
    $('#betHistoryDT').DataTable( {
        retrieve: true,
        "order": [[ 0, "desc" ]],
        "drawCallback": function() {
            $(this.api().table().header()).hide();
        }
    } );
</script>
`

}


app.post('/update-winner', function(request, response) {

  console.log('winner:', request.body.winner)

  if (mockData.bettingTable.player_wala_amount || mockData.bettingTable.player_meron_amount) {
    if (request.body.winner == 'RED' && mockData.bettingTable.player_meron_amount) {
      calculate.creditPlayer(mockData.bettingTable.player_meron_amount * 2)
    } else if (request.body.winner == 'BLUE' && mockData.bettingTable.player_wala_amount) {
      calculate.creditPlayer(mockData.bettingTable.player_wala_amount * 2)
    }
  }

  // updateBacarat(request.body.winner)
  // updateStandard(request.body.winner)

  winner = request.body.winner


  activeBets = []
  mockData.bettingTable = {
      "action": "update-bettingTable",
      "betting_status": "OPEN",
      "camera_side": "",
      "meron_odds": "0",
      "wala_odds": "0",
      "meron_amount": 0,
      "wala_amount": 0,
      "player_meron_amount": 0,
      "player_wala_amount": 0,
      "result": "OK"
  }
  updateBettingTable();
  updateBetsHistory(request.body.winner);

  // // updateFightResults



  // console.log('player-data:', mockData.playerData)
  // console.log('betting-table:', mockData.bettingTable)
  // console.log('active-bets',activeBets)

  // activeBets = []

  response.send(JSON.stringify({}))
})


