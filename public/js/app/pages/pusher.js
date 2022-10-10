Pusher.log = function(message) {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};


// custom binding
$(window).bind('citro-update-event', function(event, item) {

  var data = item.data

  if(data.action == 'update-fight-id') {
      fightId = data.fight_id;
      
      notifSound.play();
      reloadData();
      var announcement = '';

      if(data.ignore != 'YES')
      {
        announcement = data.announcement;
      } else {
        return;
      }
      if(data.announcement == "LEFT WINS")
      {
        announcement = leftSide.toUpperCase()+' WINS';
      }
      if(data.announcement == "RIGHT WINS") 
      {
        announcement = rightSide.toUpperCase()+' WINS';
      }
      if(data.announcement == "FIGHT RESULT IS DRAW")
      {
      }
      if(data.announcement == "FIGHT RESULT IS CANCEL")
      {
      }
      
      toastr["success"](announcement);  
            
  }
  
  if(data.action == 'update-bettingStatus') {
      bettingStatus = data.status;
      updateBettingStatusDisplay(bettingStatus);
      //activeBets();
      if(bettingStatus == 'CLOSED')
      {
        getEventData();
        activeBets();
        $('#walaEntryDiv').removeClass("pulse-wala");
        $('#meronEntryDiv').removeClass("pulse-meron")
      } else {
        clearBettingTable(); //getBettingTable();
      }
  }

  if(data.action == 'update-bettingStatus-loop') {
      bettingStatus = data.fight_betting_status;
      updateBettingStatusDisplayPush(bettingStatus);
  }


    if(data.action == 'last-call') {
      bannerMessage = data.announcement;
      displayBannerMessage();
      flashLastCall('#bannerMessage');
    }

    if(data.action == 'disable-betting') {
      disabledBettingSide = data.side;
      disableBettingBtn(disabledBettingSide);
    }

    if(data.action == 'update-banner') {
      bannerMessage = data.message;
      displayBannerMessage();
    }

});

$(window).bind('player-update', function(event, item) {
  var data = item.data
  //update player data which includes credits
  if( data.action == 'data-update' || data.action == 'update-credit') {
        getPlayerData();
        if(data.hasOwnProperty('winner'))
        {
          winSound.play();
          dropConfetti();
        }
  }
})


// CPITDAGASTARPROD-betting-channel
var channel = pusher.subscribe(pusherDomain+'-betting-channel');

// update-event-14
channel.bind('update-event-'+eventId, function(data) {
  
    if(data.action == 'update-fight-id') {
        fightId = data.fight_id;
        
        notifSound.play();
        reloadData();
        var announcement = '';

        if(data.ignore != 'YES')
        {
          announcement = data.announcement;
        } else {
          return;
        }
        if(data.announcement == "LEFT WINS")
        {
          announcement = leftSide.toUpperCase()+' WINS';
        }
        if(data.announcement == "RIGHT WINS") 
        {
          announcement = rightSide.toUpperCase()+' WINS';
        }
        if(data.announcement == "FIGHT RESULT IS DRAW")
        {
        }
        if(data.announcement == "FIGHT RESULT IS CANCEL")
        {
        }
        
        toastr["success"](announcement);  
              
    }

    if(data.action == 'update-bettingStatus-loop') {
        bettingStatus = data.fight_betting_status;
        updateBettingStatusDisplayPush(bettingStatus);
    }

    if(data.action == 'disable-betting-buttons') {
        if(data.status) {
            bettingStatus = data.status;
            getEventData();
        }
    }

    if(data.action == 'update-fight-duration') {
      fightResults();
    }

    if(data.action == 'last-call') {
      bannerMessage = data.announcement;
      displayBannerMessage();
      flashLastCall('#bannerMessage');
    }

    if(data.action == 'disable-betting') {
      disabledBettingSide = data.side;
      disableBettingBtn(disabledBettingSide);
    }

    if(data.action == 'update-banner') {
      bannerMessage = data.message;
      displayBannerMessage();
    }

    if(data.action == 'update-credit') {
      if( data.hasOwnProperty('uid') ) { //&& data.hasOwnProperty('with_agent')
        var uid = data.uid;
        var uidArr = uid.toString().split(",");
        if(jQuery.inArray(playerId, uidArr) !== -1) {
            getPlayerData();
            if(data.hasOwnProperty('winner') )
            {
              winSound.play();
              var message = 'Congratulations '+username+'!';
              displayCatcher('blue', message);
              dropConfetti();
            } 
          
        } else {
          var message = 'Stand by for the next fight '+username;
          displayCatcher('red', message);
        }
      }
    }

    // if( data.action == 'data-update' ) {
    //   if(data.hasOwnProperty('uid') ) {
    //     if(data.uid == playerId) {
    //       getPlayerData();
    //       if( data.hasOwnProperty('winner') ) //&& data.hasOwnProperty('with_agent')
    //       {
    //         winSound.play();
    //         dropConfetti();
            
    //       }
    //     }
    //   }
    // }

    if(data.action == 'update-entry-name') {
      updateEntryName(data.meron_name, data.wala_name);
    }

    if(data.action == 'update-rooster') {
      // if( data.side == 'white' )
      // {
      //   updateWhiteRooster(data.stats, data.weight, data.house);
      // }
      // if( data.side == 'red' )
      // {
      //   updateRedRooster(data.stats, data.weight, data.house);
      // }
      getFightData();
    }
    

    if(data.action == 'update-activeBets-bettingTable') {
            if(betTableReloaded == 0)
            {
              betTableReloaded = 1;
              getBettingTable();
              startBetTableCounter();
            } else {
              hasBetTableRequest = 1;
            } 
              activeBets();
              getPlayerData();
              
        if(data.announcement){ 
          toastr["error"](data.announcement); 
        }
    }
    
    if(data.action == 'update-bettingTable') {
        bettingStatus = data.betting_status;
        updateBettingTable(data);
    }

    if(data.action == 'update-bettingPushTable') {
      updateBettingTable(data);
      if(bettingStatus != data.betting_status)
      {
        bettingStatus = data.betting_status;
        updateBettingStatusDisplay(bettingStatus);
      }
    }
    
    if(data.action == 'update-bettingStatus') {
        bettingStatus = data.status;
        updateBettingStatusDisplay(bettingStatus);
        //activeBets();
        if(bettingStatus == 'CLOSED')
        {
          getEventData();
          activeBets();
          $('#walaEntryDiv').removeClass("pulse-wala");
          $('#meronEntryDiv').removeClass("pulse-meron")
        } else {
          clearBettingTable(); //getBettingTable();
        }
     
    }

    if(data.action == 'update-fight-no') {
      fightNo = data.fight_no;
      updateBettingStatusDisplay(bettingStatus);
    }

    if(data.action == 'event-finished') {
      updateFinished(data.message);
      toastShow('error', 'tc',  data.message);
    }
    
    if(data.action == 'update-closeBetting') {
      bannerMessage = data.announcement;
      displayBannerMessage();
      flashStatus('#bannerMessage');
      setTimeout(
        function() 
        {
          bettingStatus = data.status;
        }, 2000);
    }

    if(data.action == 'enable-betting-buttons') {
        if(data.status) {
            bettingStatus = data.status;
            updateBettingStatusDisplay(bettingStatus);
        }
    }

 
    if(data.action == 'reload-page') {
      reloadGameConsole(); 
    }

});

// CPITDAGASTARPROD-85-channel
var playerChannel = pusher.subscribe(pusherDomain+'-'+playerId+'-channel');

playerChannel.bind('player-update-'+eventId, function(data) {
  //update player data which includes credits
  if( data.action == 'data-update' || data.action == 'update-credit') {
        getPlayerData();
        if(data.hasOwnProperty('winner'))
        {
          winSound.play();
          dropConfetti();
        }
  }

});