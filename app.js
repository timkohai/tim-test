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
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.post('/');
app.listen(8080);

let mockData = require('./public/mock/data.js')

var oldActiveBets = []
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
  const data = require('./public/api/fight-results.js');
  response.send(JSON.stringify(mockData.fightResult));
  // response.send(JSON.stringify(updateBacarat()));
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
  // console.log('request /bets/add', request.body)

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


// var lastWinning = ''
var updateBacarat = function(winner) {
  var bacarat = mockData.fightResult.bacarat
  var standard = mockData.fightResult.default_data
  var meron = mockData.fightResult.meron
  var wala = mockData.fightResult.wala
  var cancel = mockData.fightResult.cancel

  var lastItem = {};
  var maxRows = 5;
  var bacar = []
  
  bacaratData.forEach(item => {
    var bacarLength = bacar.length
    if (!bacarLength) {
      // initial
      bacar.push([ item ])
    } else {
      if (lastItem.side == item.side) {

        if (bacarLength == maxRows) {
          bacar[0].push(item)
        } else {

          if (!bacar[bacarLength +1]) { //
            if (colCounter > 0) {
              for (let i = 0; i < colCounter; i++) {
                bacar[bacarLength + 1].push({})
              }
            }

            bacar.push([item]) // red  

          } else {
            colCounter++              
            bacar[bacarLength + 1].push(item)
          }

        }


      } else {
        bacar[0].push(item) //blue
      }
    }

    lastItem = item
  })

  console.log(bacar)

  mockData.fightResult.bacarat = bacar

  return mockData.fightResult
 
}

var winner = ''


var updateBetsHistory = function() {
  
  if (!oldActiveBets.length) {
    return `<h4 class="text-center py-3">No Bets History</h4>`
  }


  var html = ''
  oldActiveBets.forEach( item => {
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

var draw = 0
var cancel = 0
var wala = 0
var meron = 0;
var count = 1;
var bacaratData = [];
var standardData = [];

let colCounter = 1;
let rowCounter = 0;
let lastWinning = {};


let updateBacarat2 = function(bacaratObject) {

    // var bacarat = [
    //     [{win: 'RED'}, {win: 'BLUE'}],
    //     [{},{win: 'BLUE'},
    //     [], 
    //     [],
    //     [],
    //     [],
    //   ]


    let bacaratCount = mockData.fightResult.bacarat[0].length - 1

    if (!Object.keys(lastWinning).length) {
      mockData.fightResult.bacarat[0].push(bacaratObject);
    } else {
      if (lastWinning.side == bacaratObject.side) {

        if (bacaratCount > 0) {
          for(let i = 0; i < bacaratCount; i++) {
            mockData.fightResult.bacarat[colCounter].push({})
          }
        }

        mockData.fightResult.bacarat[colCounter].push(bacaratObject);
        // colCounter++
      } else {
        mockData.fightResult.bacarat[0].push(bacaratObject);
      }
    }

    lastWinning = bacaratObject;
}

app.use('/reset-demo', function(request, response) {
  d = require('./public/mock/backup.js')
  mockData = d
  activeBets = []
  oldActiveBets = []

  response.send(JSON.stringify({success: true}))
})


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

  var winColor = winner == 'RED' ? 'left' : 'right'

  if (winner == "RED") {
    meron++
  } else {
    wala++
  }

  var bacaratObject = {
              "badge": `badge-fight-${winColor}`,
              "no": count,
              "side": winColor.toUpperCase(),
              "border": ""
          }

  updateBacarat2(bacaratObject)

  bacaratData.push({
              "badge": `badge-fight-${winColor}`,
              "no": count,
              "side": winColor.toUpperCase(),
              "border": ""
          })

  activeBets.forEach( item => {
    item.fight_id = count
  })

  count++

  oldActiveBets = oldActiveBets.concat(activeBets)
  updateBetsHistory();

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


  // // updateFightResults



  // console.log('player-data:', mockData.playerData)
  // console.log('betting-table:', mockData.bettingTable)
  // console.log('active-bets',activeBets)

  // activeBets = []

  response.send(JSON.stringify({}))
})

