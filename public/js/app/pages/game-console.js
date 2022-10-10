var side = '';
var currentAmount = 0;
var credits = 0;
var convertedCredits = 0;
var currencyRate = 0;
var playerData = '';

var userData = '';
var playerId = $('#player-id').val();

var eventData = '';

var eventId = $('#event-id').val();

var bettingStatus = 'INACTIVE';
var minLoadReq = 0;
var hasActiveBet = 0;

var fightId = '';
var fightNo = '';
var disabledBettingSide = '';

var dacastPlayer = 0;

var bannerMessage = '';
var username = '';
var currencyDisplay = 'PTS';


const notifSound = new Audio();
notifSound.src = "https://app.dagastar.com/notifications/score-interface.wav";

const winSound = new Audio();
winSound.src = "https://app.dagastar.com/notifications/winner.mp3";

const errorNotif = new Audio();
errorNotif.src = "https://app.dagastar.com/notifications/windows-error.mp3";

//toastbox('toast-c-auto');
var playerOther = null;
var playerMobile = null;
var mediaServerId = '#mediaServer';


var videoData = [
    {
        url: 'http://localhost:3000/videos/video-1.mp4',
        winner: 'RED',
        end: '144'
    },
    {
        url: 'http://localhost:3000/videos/video-2.mp4',
        winner: 'RED',
        end: '199'
    },
    {
        url: 'http://localhost:3000/videos/video-3.mp4',
        winner: 'BLUE',
        end: '248'
    },
    {
        url: 'http://localhost:3000/videos/video-4.mp4',
        winner: 'BLUE',
        end: '168'
    }
];


var B = 4; //max size of 'cache'
var N = 0;

var chooseVid = function() {
  var num = Math.floor(Math.random() * videoData.length - N);
  var N = Math.min(N+1, B);
  var currentVideoM = videoData.splice(num, 1)
  videoData.push(currentVideoM)
  return currentVideoM[0]
}

var setVideo = function() {
    var selectedVideo = chooseVid()
    // console.log(selectedVideo)
    currentVideoTim = selectedVideo
    return selectedVideo
}

function loadDesktopVideo() {
    //checkInternetConnection();
    if (!rtmp) {
        return;
    }
    if (playerMobile != null) {
        playerMobile.pause();
    }

    mediaServerId = '#mediaServer';
    $("#mediaServerMobile").trigger('pause');

    if (rtmp.indexOf("iframe") >= 0) {
        var iframe = $('<iframe src="' + rtmp + '"  height="288" frameborder="0" webkit-playsinline playsinline scrolling="no" ></iframe>'); //allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen

        iframe.insertBefore(mediaServerId);
        $(mediaServerId).hide();
    } else {
        //$('#mediaServer').show();
        //console.log(rtmp)
        if ($(mediaServerId).length == 0) {
            return;
        }
        if ($('#mediaBox').length == 0) {
            return;
        }

        if (playerOther == null) {
            playerOther = videojs(mediaServerId, {
                controls: false,
                autoplay: true,
                muted: true,
                preload: "auto",
                // plugins: {
                //     videoJsResolutionSwitcher: {
                //       default: 'low', // Default resolution [{Number}, 'low', 'high'],
                //     }
                //   } 
            });

            playerOther.load();
            playerOther.ready(function() {

                // playerOther.src({
                //     src: rtmp,
                //     type: 'application/x-mpegURL',
                //     //withCredentials: true
                // });

                playerOther.src(currentVideoTim.url)

                playerOther.play();

                $(window).trigger('citro-update-event', [{
                    "event":"update-event-16",
                    "channel":"CPITDAGASTARPROD-betting-channel",
                    "data":{
                        "action":"update-bettingStatus",
                        "status":"OPEN",
                        "fight_status":"ACTIVE",
                        "fight_betting_status":"OPEN",
                        "record":53,
                        "announcement":"BETTING IS NOW OPEN"}
                    }])

                playerOther.on('ended', function() {
                    setVideo()
                    // console.log(currentVideoTim)
                    playerOther.src(currentVideoTim.url)
                    playerOther.play();

                    // wait
                })

                var lastSecond = null;
                var secondsToCallFunction = 1;

                playerOther.on('timeupdate', function() {
                    var currentTime = playerOther.currentTime()

                    var seconds = Math.floor(currentTime);

                    if (seconds % secondsToCallFunction  == 0 && lastSecond !== seconds) {
                        lastSecond = seconds

                        if (seconds == 110) {
                            bettingStatus = 'CLOSED';
                            $(window).trigger('citro-update-event', [{
                            "event":"update-event-16",
                            "channel":"CPITDAGASTARPROD-betting-channel",
                            "data":{"action":"update-bettingStatus",
                                "status":"CLOSED",
                                "fight_status":"ACTIVE",
                                "fight_betting_status":"CLOSED",
                                "record":53,
                                "announcement":"BETTING IS NOW CLOSED"}
                            }])
                            // Update the betting status
                        }

                        if (seconds == currentVideoTim.end) {
                            updateWinner({winner: currentVideoTim.winner})
                        }

                        if (seconds == currentVideoTim.end) {
                            $(window).trigger('player-update', [{
                            "event":"update-event-14",
                            "channel":"CPITDAGASTARPROD-betting-channel",
                            "data":{"uid":[25],
                                "action":"update-credit",
                                "winner":"RIGHT"}
                            }])

                            $(window).trigger('citro-update-event', [{
                              "event":"update-event-14",
                              "channel":"CPITDAGASTARPROD-betting-channel",
                              "data":{
                                "fight_id":2778,
                                "fight_no":"1",
                                "fight_status":"ACTIVE",
                                "announcement":"LEFT WINS",
                                "fight_betting_status":"INACTIVE",
                                "entryMeron":"RED",
                                "entryWala":"BLUE",
                                "action":"update-fight-id",
                                "record":53}
                              }]);
                            }

                        console.log(seconds, currentVideoTim)
                    }

                    

                    // end of betting closed
                   


                    // if (Math.round(currentTime) == currentVideoTim.end) {
                    if (Math.round(currentTime) == 5) {

                        // check and clear player data
                        // updateWinner({winner: currentVideoTim.winner})

                        //send winner
                        // $(window).trigger('player-update', [{
                        // "event":"update-event-14",
                        // "channel":"CPITDAGASTARPROD-betting-channel",
                        // "data":{"uid":[25],
                        //     "action":"update-credit",
                        //     "winner":"RIGHT"}
                        // }])

                        // $(window).trigger('citro-update-event', [{
                        //   "event":"update-event-14",
                        //   "channel":"CPITDAGASTARPROD-betting-channel",
                        //   "data":{
                        //     "fight_id":2778,
                        //     "fight_no":"178",
                        //     "fight_status":"ACTIVE",
                        //     "announcement":"LEFT WINS",
                        //     "fight_betting_status":"INACTIVE",
                        //     "entryMeron":"RED",
                        //     "entryWala":"BLUE",
                        //     "action":"update-fight-id",
                        //     "record":53}
                        //   }]);
                    }
                });

            });
        }
        if (playerOther.seekable().length > 0) {
            //var seekable = playerOther.seekable().end();
            var seekable = playerOther.liveTracker.seekToLiveEdge();
            playerOther.currentTime(seekable);
        }
        playerOther.play();

    }

}

function loadMobileVideo() {

    //checkInternetConnection();
    if (!rtmp) {
        return;
    }

    if (playerOther != null) {
        playerOther.pause();
    }
    mediaServerId = '#mediaServerMobile';
    $("#mediaServer").trigger('pause');


    if (rtmp.indexOf("iframe") >= 0) {
        var iframe = $('<iframe src="' + rtmp + '"  height="288" frameborder="0" webkit-playsinline playsinline scrolling="no" ></iframe>'); //allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen

        iframe.insertBefore(mediaServerId);
        $(mediaServerId).hide();
    } else {
        //$('#mediaServer').show();
        //console.log(rtmp)
        if ($(mediaServerId).length == 0) {
            return;
        }
        if ($('#mediaBox').length == 0) {
            return;
        }
        if (playerMobile == null) {
            playerMobile = videojs(mediaServerId, {
                controls: true,
                autoplay: true,
                muted: true,
                preload: "auto",
                // plugins: {
                //     videoJsResolutionSwitcher: {
                //       default: 'low', // Default resolution [{Number}, 'low', 'high'],
                //     }
                //   } 
            });

            playerMobile.load();

            playerMobile.ready(function() {

                // playerMobile.src({
                //     src: rtmp,
                //     type: 'application/x-mpegURL',
                //     //withCredentials: true
                // });

                // playerMobile.play();

                playerMobile.src(currentVideo.url)

                playerMobile.play();

                playerMobile.on('ended', function() {

                    playerMobile.src(chooseVid().url)
                    playerMobile.play();
                })

            });
        }
        if (playerMobile.seekable().length > 0) {
            //var seekable = playerMobile.seekable().end();
            var seekable = playerMobile.liveTracker.seekToLiveEdge();
            playerMobile.currentTime(seekable);
        }
        playerMobile.play();

    }

}


$(document).on('click  tap', '.side-select', function() {
    side = $(this).data('side');
    if (disabledBettingSide == side) {
        return;
    }
    if (bettingStatus != 'OPEN') {
        toastr["error"]('BETTING IS CLOSED');
        return;
    }
    if (credits <= 0) {
        toastr["error"]('You have no credits. Please load.');
        return;
    }
    $('#actionSheet').modal('show');

    if (side == 'LEFT') {
        selectedSide = leftSide.toUpperCase();
        $('.btn-all').removeClass('btn-right').addClass('btn-left');
        $('#clearBtn').removeClass('btn-right').addClass('btn-left');
        $('#betBtn').removeClass('btn-right').addClass('btn-left');
        // $('#confirmBetBtn').removeClass('btn-white').addClass('btn-success');
        // $('#cancelBetBtn').removeClass('btn-white').addClass('btn-right');
        $('.btn-amount').each(function() {
            var dataAmount = $(this).data('amount');
            $(this).prop('src', 'http://app.dagastar.com/img/chips/' + eventType + '/' + dataAmount + '_left.png');
        });
    }
    if (side == 'RIGHT') {
        selectedSide = rightSide.toUpperCase();
        $('.btn-all').removeClass('btn-left').addClass('btn-right');
        $('#clearBtn').removeClass('btn-left').addClass('btn-right');
        $('#betBtn').removeClass('btn-left').addClass('btn-right');
        // $('#confirmBetBtn').removeClass('btn-success').addClass('btn-white');
        // $('#cancelBetBtn').removeClass('btn-danger').addClass('btn-white');
        $('.btn-amount').each(function() {
            var dataAmount = $(this).data('amount');
            $(this).prop('src', 'http://app.dagastar.com/img/chips/' + eventType + '/' + dataAmount + '_right.png');
        });

    }

    $('#titleSide').text(selectedSide);
});

function preloadAmountBtn() {

    $('.btn-amount').each(function() {
        var dataAmount = $(this).data('amount');
        $(this).prop('src', 'http://app.dagastar.com/img/chips/' + eventType + '/' + dataAmount + '_left.png');
        $(this).prop('src', 'http://app.dagastar.com/img/chips/' + eventType + '/' + dataAmount + '_right.png');
    });
}

preloadAmountBtn();

$(document).on('click tap', '.btn-amount', function() {

    var amount = $(this).data('amount');
    currentAmount = $('#amountInput').val();

    if (currentAmount == '') {
        currentAmount = 0;
    }
    if (amount == 'all') {
        currentAmount = parseFloat(credits);
    } else {
        currentAmount = parseFloat(currentAmount) + parseFloat(amount);
    }
    $('#amountInput').val(currentAmount.toString().toLocaleString("en"));

});

$(document).on('focus change', '#amountInput', function() {
    this.value = this.value.replace(/(\.\d\d)\d+|([\d.]*)[^\d.]/, '$1$2');
    var amount = $(this).val();

    $(this).val(parseFloat($(this).val()).toFixed(2));
    if (amount == 0) {
        $('#amountInput').val('');
    }
})

$(document).on('click tap', '#clearBtn', function() {
    $('#amountInput').val(0);
});

// $(document).on("unfocus change", "#amountInput", function(){

// });

$(document).on('click tap', '#betBtn', function() {
    //checkInternetConnection();
    $('#actionSheet').modal('hide');
    currentAmount = $('#amountInput').val();
    var selectedSide = side;

    if (side == 'LEFT') {
        selectedSide = leftSide.toUpperCase();
        $('#modal-content').removeClass('bg-right').addClass('bg-left');
        //$('#betMessage').html('<span class=" font-25 font-weight-bold">Place '+currentAmount.toString().toLocaleString("en")+' to '+selectedSide+' SIDE?</span>');
    }
    if (side == 'RIGHT') {
        selectedSide = rightSide.toUpperCase();
        $('#modal-content').removeClass('bg-left').addClass('bg-right');
        //$('#betMessage').html('<span class="text-white font-25 font-weight-bold">Place '+currentAmount.toString().toLocaleString("en")+' to '+selectedSide+' SIDE?</span>');
    }

    $('#betMessage').html('<span class=" font-25 font-weight-bold">BET ' + currentAmount.toString().toLocaleString("en") + ' ON ' + selectedSide + '?</span>');
    $('#betConfirm').modal('show');
});

$(document).on('click tap', '#cancelBetBtn', function() {
    $('#actionSheet').modal('show');
});

$(document).on('click tap', '#confirmBetBtn', function() {
    //checkInternetConnection();
    currentAmount = $('#amountInput').val();
    currentAmount = parseFloat(currentAmount);

    if (isNaN(currentAmount)) {
        $('#betConfirm').modal('hide');
        toastr["error"]('Invalid amount format');
        return;
    }

    $('#amountInput').val(currentAmount);
    if (bettingStatus != 'OPEN') {
        $('#betConfirm').modal('hide');
        toastr["error"]('BETTING IS CLOSED');
        return;
    }

    if (currentAmount == 0) {
        $('#betConfirm').modal('hide');
        toastr["error"]('Amount is required to bet');
        return;
    }

    if (currentAmount > parseFloat(credits)) {
        $('#betConfirm').modal('hide');
        toastr["error"]('No enought funds');
        return;
    }
    $('#confirmBetBtn').prop('disabled', true);
    //toastbox('toast-t-tap-primary');

    var success = function(result) {
        try {
            var obj = jQuery.parseJSON(result);
            // var obj = result;
            if (obj.result == 'OK') {
                getBettingTable();
                activeBets();
                credits = obj.credits;
                getPlayerData();
                $('#amountInput').val(0);
            } else {

                toastr["error"](obj.message);
            }
            $('#confirmBetBtn').prop('disabled', false);
            $('.close-placing-btn').trigger('click');
        } catch (error) {
            toastr["error"]("Your session has been expired. Please re-login.");
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
    }

    $.ajax({
        url: postmanDomain + '/bets/add',
        type: 'post',
        data: {
            _csrfToken: _csrfToken,
            amount: currentAmount,
            event_id: eventId,
            fight_id: fightId,
            side: side,
            betting_status: bettingStatus
        },
        error: function() {
            toastr["error"]("Your session has been expired. Please re-login.");
            setTimeout(function() {
                location.reload();
            }, 3000);
        },
        success: success
    });

    // $.getJSON('json/bets-add.json', success);

    $('#betConfirm').modal('hide');
});


function checkActiveBet() {
    if (fightId == 0) {
        return;
    }
    $.ajax({
        url: postmanDomain +  '/bets/has-active-bet',
        type: 'post',
        data: {
            _csrfToken: _csrfToken,
            event_id: eventId,
            fight_id: fightId
        },
        success: function(result) {

            var obj = jQuery.parseJSON(result);
            if (obj.result == 'OK') {
                credits = obj.credits;
                hasActiveBet = obj.hasActiveBet;
                if (parseFloat(credits) < parseFloat(minLoadReq) && hasActiveBet == 0) {
                    $('#video-message').removeClass('d-none');
                    $('#video-message').text('Minimum load of ' + currencyFormatter.format(minLoadReq) + ' is required to watch on this event.');
                    $('#mediaBox').addClass('d-none');
                    playerOther.pause();
                } else {
                    $('#video-message').addClass('d-none');
                    $('#mediaBox').removeClass('d-none');
                    playerOther.play();
                }

            } else {
                toastr["error"]('Need to swipe down to update your data');
            }
        }
    });
}


function updateWinner(item) {

    console.log(item.winner)
    var success = function(result) {

        console.log()
        // var obj = result;
        // var obj = jQuery.parseJSON(result);
        // if (obj.result == 'OK') {
        //     playerData = obj.player;
        //     credits = obj.credits;
        //     convertedCredits = obj.converted_credits;
        //     username = playerData.username;
        //     currencyDisplay = playerData.currency_display ? playerData.currency_display : 'PTS';
        //     currencyRate = obj.currency_rate;
        //     $('.player-credits').html(currencyFormatter.format(credits));
        //     //var playerCreditsGame = "<div class='col-12 lh-1'>PTS "+currencyFormatter.format(credits)+"</div>";
        //     var playerCreditsGame = "PTS " + currencyFormatter.format(credits);
        //     // if(currencyDisplay)
        //     // {
        //     //     playerCreditsGame += "<div class='col-12 lh-1 font-14 pb-1'> "+currencyDisplay+' '+convertedCredits+"</div>";
        //     // }
        //     $('.player-credits-game').html(playerCreditsGame);

        //     var totalBetsToday = playerData.total_bets_today;
        //     var dailyBetLimit = playerData.daily_bet_limit;
        //     if (parseFloat(dailyBetLimit) <= parseFloat(totalBetsToday) && parseFloat(dailyBetLimit) > 0) {
        //         $('button.side-select').attr('disabled', true);
        //         toastr["error"]('You have reached your daily bet limit of ' + currencyFormatter.format(dailyBetLimit));
        //     }
        //     //checkActiveBet();

        // } else {
        //     toastr["error"]('Need to swipe down to update your data');
        // }
    }
    $.ajax({
        url: postmanDomain +  '/update-winner',
        type: 'post',
        data: {
            _csrfToken: _csrfToken,
            winner: item.winner
        },
        success: success
    });

    // $.getJSON('json/player-data.json', success);
}


function getPlayerData() {
    var success = function(result) {
        // var obj = result;
        var obj = jQuery.parseJSON(result);
        if (obj.result == 'OK') {
            playerData = obj.player;
            credits = obj.credits;
            convertedCredits = obj.converted_credits;
            username = playerData.username;
            currencyDisplay = playerData.currency_display ? playerData.currency_display : 'PTS';
            currencyRate = obj.currency_rate;
            $('.player-credits').html(currencyFormatter.format(credits));
            //var playerCreditsGame = "<div class='col-12 lh-1'>PTS "+currencyFormatter.format(credits)+"</div>";
            var playerCreditsGame = "PTS " + currencyFormatter.format(credits);
            // if(currencyDisplay)
            // {
            //     playerCreditsGame += "<div class='col-12 lh-1 font-14 pb-1'> "+currencyDisplay+' '+convertedCredits+"</div>";
            // }
            $('.player-credits-game').html(playerCreditsGame);

            var totalBetsToday = playerData.total_bets_today;
            var dailyBetLimit = playerData.daily_bet_limit;
            if (parseFloat(dailyBetLimit) <= parseFloat(totalBetsToday) && parseFloat(dailyBetLimit) > 0) {
                $('button.side-select').attr('disabled', true);
                toastr["error"]('You have reached your daily bet limit of ' + currencyFormatter.format(dailyBetLimit));
            }
            //checkActiveBet();

        } else {
            toastr["error"]('Need to swipe down to update your data');
        }
    }
    $.ajax({
        url:  postmanDomain + '/players/player-data',
        type: 'post',
        data: {
            _csrfToken: _csrfToken
        },
        success: success
    });

    // $.getJSON('json/player-data.json', success);
}

var vidCtr = 0;

function getEventData() {
    var success = function(result) {
        var obj = result;
        // var obj = jQuery.parseJSON(result);
        if (obj.result == 'OK') {
            eventData = obj.event;
            //bettingStatus = eventData.betting_status;
            minLoadReq = eventData.minimum_load;
            //updateBettingStatusDisplay(bettingStatus);
            bannerMessage = eventData.banner_message;
            displayBannerMessage();
            rtmp = eventData.media_server.stream_url;
            //loadMediaServer();
            //checkActiveBet();

        } else {
            toastr["error"]('Need to swipe down to update your data');
        }
    }
    $.getJSON('json/events-data.json', success);
    // $.ajax({
    //     url: postmanDomain +  '/events/data',
    //     type: 'post',
    //     data: {
    //         _csrfToken: _csrfToken,
    //         id: eventId
    //     },
    //     success: success
    // });
}

function displayBannerMessage() {
    clearInterval(interval);
    $('.bannerMessage').removeClass('last-call');
    $('.bannerMessage').text(bannerMessage);
    $('.bannerMessage').marquee({
        duration: 12000
    });
}

function updateBettingStatusDisplay(bettingStatus) {
    var badgeColor = 'kt-badge--warning';
    var textColor = 'text-warning';
    var statusIcon = 'fa-exclamation';
    var borderColor = '2px #ffc107 solid';
    var statusDisplay = bettingStatus;
    if (bettingStatus == 'OPEN') {
        badgeColor = 'kt-badge--success';
        textColor = 'text-success';
        statusIcon = 'fa-check';
        borderColor = '2px #28a745 solid';
        $('.bettingStatusText').removeClass('bg-danger');
        $('.bettingStatusText').addClass('bg-success');
    }

    if (bettingStatus == 'CLOSED') {
        badgeColor = 'kt-badge--danger';
        textColor = 'text-danger';
        statusIcon = 'fa-times';
        borderColor = '2px #dc3545 solid';
        $('.bettingStatusText').removeClass('bg-success');
        $('.bettingStatusText').addClass('bg-danger');
        // $('#leftEntryDiv').removeClass("pulse-wala");
        // $('#rightEntryDiv').removeClass("pulse-meron");
    }

    var statusText = statusDisplay + ' FOR BETTING';
    if (fightNo) {
        statusText = 'FIGHT #' + fightNo + ' IS ' + statusText;
    }
    if (bettingStatus == 'INACTIVE') {
        statusText = 'STANDBY FOR THE NEXT FIGHT';
        $('.bettingStatusText').removeClass('bg-success');
        $('.bettingStatusText').addClass('bg-danger');
        // $('#walaEnleftEntryDivtryDiv').removeClass("pulse-wala");
        // $('#rightEntryDiv').removeClass("pulse-meron");
    }

    notifSound.play();

    if (bettingStatus.length == 0) {
        // $('.bettingStatusText').removeClass('bg-success');
        // $('.bettingStatusText').removeClass('bg-danger');
        // $('.bettingStatusText').addClass('bg-primary');
        // $('.bettingStatusText').text('NO ACTIVE FIGHT'); 
    } else {
        $('.bettingStatusText').text(statusText);
    }

    flashStatus('.bettingStatusText');
}

function updateBettingStatusDisplayPush(bettingStatus) {
    var statusDisplay = bettingStatus;
    if (bettingStatus == 'OPEN') {
        $('.bettingStatusText').removeClass('bg-danger');
        $('.bettingStatusText').addClass('bg-success');
    }

    if (bettingStatus == 'CLOSED') {
        $('.bettingStatusText').removeClass('bg-success');
        $('.bettingStatusText').addClass('bg-danger');
    }

    var statusText = statusDisplay + ' FOR BETTING';
    if (fightNo) {
        statusText = 'FIGHT #' + fightNo + ' IS ' + statusText;
    }
    if (bettingStatus == 'INACTIVE') {
        statusText = 'STANDBY FOR THE NEXT FIGHT';
        $('.bettingStatusText').removeClass('bg-success');
        $('.bettingStatusText').addClass('bg-danger');
    }

    if (bettingStatus.length == 0) {
        // $('.bettingStatusText').removeClass('bg-success');
        // $('.bettingStatusText').removeClass('bg-danger');
        // $('.bettingStatusText').addClass('bg-primary');
        // $('.bettingStatusText').text('NO ACTIVE FIGHT'); 
    } else {
        $('.bettingStatusText').text(statusText);
    }

}

function updateFinished(message) {
    $('.bettingStatusText').removeClass('bg-success');
    $('.bettingStatusText').addClass('bg-danger');
    notifSound.play();
    $('.bettingStatusText').text(message);
    flashStatus('.bettingStatusText');
}


var interval = null;
var isLastCall = 0;

function flashStatus(elem) {
    $(elem).fadeIn('slow');
    // notification_play();
    isLastCall = 0;
    interval = setInterval(function() {
        $(elem).fadeOut('slow');
        $(elem).fadeIn('slow');
    }, 1000);
    setTimeout(function() {
        clearInterval(interval);
        $(elem).fadeIn('slow');
    }, 5000);
}

function flashLastCall(elem) {
    isLastCall = 1;
    $(elem).fadeIn('slow');
    $(elem).addClass('last-call');
    interval = setInterval(function() {
        if (isLastCall) {
            $(elem).fadeOut('slow');
            $(elem).fadeIn('slow');
        }
    }, 1000);
}

function getFightData() {

    var success = function(result) {
        var obj = jQuery.parseJSON(result);
        // var obj = result;
        if (obj.result == 'OK') {
            var fightData = obj.fight;
            // var whiteRooster = obj.white_rooster;
            // var redRooster = obj.red_rooster;
            fightId = fightData.id;
            fightNo = fightData.no;
            bettingStatus = fightData.betting_status;
            disabledBettingSide = fightData.disabled_side;
            updateBettingStatusDisplay(bettingStatus);
            var leftEntryName = fightData.meron_entry_name ? fightData.meron_entry_name : leftSide;
            var rightEntryName = fightData.wala_entry_name ? fightData.wala_entry_name : rightSide;
            updateEntryName(leftEntryName, rightEntryName);
            getBettingTable();

            // var whiteWeight = 'WEIGHT';
            // var whiteStats = 'STATS';
            // var whiteHouse = 'HOUSE';
            // if(whiteRooster)
            // {
            //     whiteWeight = fightData.meron_weight ? fightData.meron_weight : '0';
            //     whiteStats = whiteRooster.total_win+' '+whiteRooster.total_loss+' '+whiteRooster.total_draw;
            //     whiteHouse = whiteRooster.rooster_house_id ? whiteRooster.rooster_house.name : 'HOUSE';
            // }

            // var redWeight = 'WEIGHT';
            // var redStats = 'STATS';
            // var redHouse = 'HOUSE';
            // if(redRooster)
            // {
            //     redWeight = fightData.wala_weight ? fightData.wala_weight : '0';
            //     redStats = redRooster.total_win+' '+redRooster.total_loss+' '+redRooster.total_draw;
            //     redHouse = redRooster.rooster_house_id ? redRooster.rooster_house.name : 'HOUSE';
            // }
            // updateWhiteRooster(whiteStats, whiteWeight, whiteHouse);
            // updateRedRooster(redStats, redWeight, redHouse);

        } else {
            //toastr["error"]('No Active fight');
            errorNotif.play();
            updateBettingStatusDisplay('');
            updateEntryName(leftSide, rightSide);
            //dRooster('STATS', 'WEIGHT', 'HOUSE');
        }
        activeBets();
        return fightId;
    }

    $.ajax({
        url: postmanDomain +  '/fights/data',
        type: 'post',
        data: {
            _csrfToken: _csrfToken,
            event_id: eventId
        },
        success: success
    });

    // $.getJSON('json/fights-data.json', success);
}

function updateEntryName(leftEntryName, rightEntryName) {
    $('.leftEntryName').text(leftEntryName);
    $('.rightEntryName').text(rightEntryName);
}

// function updateWeight(whiteWeight, redWeight)
// {
//     $('.whiteWeight').text(whiteWeight);
//     $('.redWeight').text(redWeight);
// }

function updateWhiteRooster(stats, weight, house) {
    $('.whiteStats').text(stats);
    $('.whiteWeight').text(weight);
    $('.whiteHouse').text(house);
}

function updateRedRooster(stats, weight, house) {
    $('.redStats').text(stats);
    $('.redWeight').text(weight);
    $('.redHouse').text(house);
}


function disableBettingBtn(disabledBettingSide) {
    $('button.side-select [data-side=' + disabledBettingSide + ']').attr('disabled', true);
}

var betTableReloaded = 0;
var hasBetTableRequest = 0;

function startBetTableCounter() {
    setTimeout(
        function() {
            betTableReloaded = 0;
            if (hasBetTableRequest) {
                getBettingTable();
            }
        }, 8000);

}

function getBettingTable() {

    var success = function(result) {
        // var obj = result;
        var obj = jQuery.parseJSON(result);
        if (obj.result == 'OK') {
            $('#meronOdds').text('0');
            $('#walaOdds').text('0');
            $('#meronAmount').text('0');
            $('#walaAmount').text('0');
            $('#playerMeronBet').text('0');
            $('#playerWalaBet').text('0');
            $('#meronPayout').text('0');
            $('#walaPayout').text('0');

            if (obj.meron_odds || obj.wala_odds) {
                $('#meronOdds').text(obj.meron_odds);
                $('#walaOdds').text(obj.wala_odds);
                $('#oddsRow').removeClass('d-none');
                var meronPayout = parseFloat(obj.meron_odds) * parseFloat(obj.player_meron_amount);
                var walaPayout = parseFloat(obj.wala_odds) * parseFloat(obj.player_wala_amount);

                // if(currencyRate)
                // {
                //     var meronPayoutC = meronPayout * parseFloat(currencyRate);
                //     var walaPayoutC = walaPayout * parseFloat(currencyRate);
                //     $('#payoutMRate').html(currencyDisplay+' '+currencyFormatter.format(meronPayoutC.toString()));
                //     $('#payoutWRate').html(currencyDisplay+' '+currencyFormatter.format(walaPayoutC.toString()));
                // }
                $('#meronPayout').text(currencyFormatter.format(meronPayout.toString()));
                $('#walaPayout').text(currencyFormatter.format(walaPayout.toString()));

                if (parseFloat(obj.meron_amount) > parseFloat(obj.wala_amount)) {
                    $('#meronEntryDiv').addClass("pulse-meron");
                    $('#walaEntryDiv').removeClass("pulse-wala");
                }


                if (parseFloat(obj.meron_amount) < parseFloat(obj.wala_amount)) {
                    $('#walaEntryDiv').addClass("pulse-wala");
                    $('#meronEntryDiv').removeClass("pulse-meron");
                }

                if (parseFloat(obj.meron_amount) == parseFloat(obj.wala_amount)) {
                    $('#walaEntryDiv').removeClass("pulse-wala");
                    $('#meronEntryDiv').removeClass("pulse-meron");
                }

            } else {
                $('#meronOdds').text(0);
                $('#walaOdds').text(0);
                $('#oddsRow').addClass('d-none');
            }




            $('#meronAmount').text(currencyFormatter.format(obj.meron_amount));
            $('#walaAmount').text(currencyFormatter.format(obj.wala_amount));
            $('#playerMeronBet').text(currencyFormatter.format(obj.player_meron_amount));
            $('#playerWalaBet').text(currencyFormatter.format(obj.player_wala_amount));

            // if(currencyRate)
            // {
            //     var meronC = obj.meron_amount * parseFloat(currencyRate);
            //     var walaC = obj.wala_amount * parseFloat(currencyRate);
            //     $('#meronTRate').html(currencyDisplay+' '+currencyFormatter.format(meronC.toString()));
            //     $('#walaTRate').html(currencyDisplay+' '+currencyFormatter.format(walaC.toString()));

            //     var payoutMRate = obj.player_meron_amount * parseFloat(currencyRate);
            //     var payoutWRate = obj.player_wala_amount * parseFloat(currencyRate);
            //     $('#playerMRate').html(currencyDisplay+' '+currencyFormatter.format(payoutMRate.toString()));
            //     $('#playerWRate').html(currencyDisplay+' '+currencyFormatter.format(payoutWRate.toString()));
            // }

        }
    }

    $.ajax({
        method: "POST",
        url: postmanDomain +  '/bets/betting-table',
        data: {
            _csrfToken: _csrfToken,
            event_id: eventId,
            fight_id: fightId
        }
    }).done(success);

    // $.getJSON('json/betting-table.json', success);
}

function updateBettingTable(data) {
    if (data.meron_odds || data.wala_odds) {
        $('#meronOdds').text(data.meron_odds);
        $('#walaOdds').text(data.wala_odds);
        $('#oddsRow').removeClass('d-none');

        var playerMeronBet = $('#playerMeronBet').text();
        var playerWalaBet = $('#playerWalaBet').text();
        playerMeronBet = playerMeronBet.replace('$', '');
        playerMeronBet = playerMeronBet.replace(',', '');

        playerWalaBet = playerWalaBet.replace('$', '');
        playerWalaBet = playerWalaBet.replace(',', '');

        var meronPayout = parseFloat(data.meron_odds) * parseFloat(playerMeronBet);
        var walaPayout = parseFloat(data.wala_odds) * parseFloat(playerWalaBet);
        $('#meronPayout').text(currencyFormatter.format(meronPayout.toString()));
        $('#walaPayout').text(currencyFormatter.format(walaPayout.toString()));


        // if(currencyRate)
        // {
        //     var meronPayoutC = meronPayout * parseFloat(currencyRate);
        //     var walaPayoutC = walaPayout * parseFloat(currencyRate);
        //     $('#payoutMRate').html(currencyDisplay+' '+currencyFormatter.format(meronPayoutC.toString()));
        //     $('#payoutWRate').html(currencyDisplay+' '+currencyFormatter.format(walaPayoutC.toString()));
        // }


        if (parseFloat(data.meron_amount) > parseFloat(data.wala_amount)) {
            $('#meronEntryDiv').addClass("pulse-meron");
            $('#walaEntryDiv').removeClass("pulse-wala");
        }

        if (parseFloat(data.meron_amount) < parseFloat(data.wala_amount)) {
            $('#walaEntryDiv').addClass("pulse-wala");
            $('#meronEntryDiv').removeClass("pulse-meron");
        }

        if (parseFloat(data.meron_amount) == parseFloat(data.wala_amount)) {
            $('#walaEntryDiv').removeClass("pulse-wala");
            $('#meronEntryDiv').removeClass("pulse-meron");
        }

        if (bettingStatus == 'CLOSED') {
            $('#walaEntryDiv').removeClass("pulse-wala");
            $('#meronEntryDiv').removeClass("pulse-meron");
        }

    } else {
        $('#meronOdds').text(0);
        $('#walaOdds').text(0);
        $('#oddsRow').addClass('d-none');
    }

    $('#meronAmount').text(currencyFormatter.format(data.meron_amount));
    $('#walaAmount').text(currencyFormatter.format(data.wala_amount));

    // if(currencyRate)
    // {
    //     var meronC = data.meron_amount * parseFloat(currencyRate);
    //     var walaC = data.wala_amount * parseFloat(currencyRate);
    //     $('#meronTRate').html(currencyDisplay+' '+currencyFormatter.format(meronC.toString()));
    //     $('#walaTRate').html(currencyDisplay+' '+currencyFormatter.format(walaC.toString()));
    // }
}

function clearBettingTable() {
    $('#meronOdds').text(0);
    $('#walaOdds').text(0);
    $('#oddsRow').addClass('d-none');
    $('#meronAmount').text('0.00');
    $('#walaAmount').text('0.00');
    $('#playerMeronBet').text('0.00');
    $('#playerWalaBet').text('0.00');
    $('#meronPayout').text('0.00');
    $('#walaPayout').text('0.00');
    $('#meronEntryDiv').removeClass("pulse-meron");
    $('#walaEntryDiv').removeClass("pulse-wala");
}

function fightResults() {

    var success = function(result) {
        // var obj = jQuery.parseJSON(result);
        var obj = result

        if (obj.result == 'OK') {
            var bacarat = obj.bacarat;
            var defaultData = obj.default_data;
            var fightResultADOM = '';
            var fightResultBDOM = '';
            var scrollLeftCount = 50;
            $('.left-legend').text(obj.meron);
            $('.right-legend').text(obj.wala);
            $('.cancel-legend').text(obj.cancel);
            $('.draw-legend').text(obj.draw);
            if (bacarat[0] == '') {
                fightResultADOM = '<table class="table table-bordered fight-box" style="width:10%;">';
                for (tr = 0; tr < 6; tr++) {
                    fightResultADOM += '<tr>';
                    for (i = 0; i < 8; i++) {
                        fightResultADOM += '<td class=""><span class="badge"> &nbsp; &nbsp; &nbsp; </span></td>';
                        scrollLeftCount += 5;
                    }
                    fightResultADOM += '</tr>';

                }
                fightResultADOM += '</table>';
            } else {
                fightResultADOM = '<table class="table table-bordered fight-box" style="width:10%;">';
                var row = 0;

                var remainingRow = 0;
                $.each(bacarat, function(i, data) {
                    hasBadge = false;
                    var tempR = '';
                    var currentCol = 0;
                    tempR += '<tr>';
                    $.each(data, function(i, item) {
                        if (item.badge) {
                            hasBadge = true;
                            tempR += '<td class="' + item.border + '"><span class="badge ' + item.badge + ' shadow">&nbsp;</span></td>';
                        } else {
                            tempR += '<td class="' + item.border + '"><span class="badge">&nbsp;</span></td>';
                        }
                        scrollLeftCount += 5;
                        currentCol++;
                    });
                    var remaining = 0;
                    if (currentCol < obj.max_col) {
                        remaining = 8 + (obj.max_col - currentCol);
                    } else {
                        remaining = 8;
                    }

                    for (i = 0; i < remaining; i++) {
                        tempR += '<td class=""><span class="badge"> &nbsp; &nbsp; &nbsp; </span></td>';
                        scrollLeftCount += 5;
                    }

                    tempR += '</tr>';

                    if (hasBadge == true) {
                        fightResultADOM += tempR;
                        row++;
                    }

                });

                if (row < 6) {
                    var remainingRow = 6 - row;
                    for (tr = 0; tr < remainingRow; tr++) {
                        fightResultADOM += '<tr>';
                        var remainingTd = obj.max_col + 8;
                        for (i = 0; i < remainingTd; i++) {
                            fightResultADOM += '<td class=""><span class="badge"> &nbsp; &nbsp; &nbsp; </span></td>';
                            scrollLeftCount += 5;
                        }
                        fightResultADOM += '</tr>';
                    }
                }
                fightResultADOM += '</table>';
            }
            $('#fightResultsA').html(fightResultADOM);
            $('#fightResultsAMobile').html(fightResultADOM);

            var defaultRow = 0;
            var currentColB = 0;
            if (defaultData[0] == '') {
                fightResultBDOM = '<table class="table table-bordered fight-box" style="width:10%;">';
                for (tr = 0; tr < 5; tr++) {
                    fightResultBDOM += '<tr>';
                    for (i = 0; i < 8; i++) {
                        fightResultBDOM += '<td class=""><span class="badge"> &nbsp; &nbsp; &nbsp; </span></td>';
                    }
                    fightResultBDOM += '</tr>';

                }
                fightResultBDOM += '</table>';
            } else {
                fightResultBDOM = '<table class="table table-bordered fight-box" style="width:10%;">';
                $.each(defaultData, function(i, data) {
                    fightResultBDOM += '<tr>';
                    defaultRow++;
                    $.each(data, function(i, item) {
                        if (item.badge) {
                            fightResultBDOM += '<td class="' + item.border + '"><span class="badge ' + item.badge + ' badge-fight shadow">' + item.no + '</span></td>';
                            currentColB++;
                        }

                    });

                    var remaining = 0;
                    if (currentColB < obj.max_col_b) {
                        remaining = 8 + (obj.max_col_b - currentColB);
                    } else {
                        remaining = 8;
                    }
                    currentColB = 0;
                    for (i = 0; i < remaining; i++) {
                        fightResultBDOM += '<td class=""><span class="badge"> &nbsp; &nbsp; &nbsp; </span></td>';
                    }
                    fightResultBDOM += '</tr>';
                });

                if (defaultRow < 5) {
                    var remainingRow = 5 - defaultRow;
                    for (tr = 0; tr < remainingRow; tr++) {
                        fightResultBDOM += '<tr>';
                        var remainingTd = obj.max_col_b + 8;
                        for (i = 0; i < remainingTd; i++) {
                            fightResultBDOM += '<td class=""><span class="badge"> &nbsp; &nbsp; &nbsp; </span></td>';
                        }
                        fightResultBDOM += '</tr>';
                    }
                }
                fightResultBDOM += '</table>';

            }

            $('#fightResultsB').html(fightResultBDOM);
            $('#fightResultsBMobile').html(fightResultBDOM);

            $('.fightResults').scrollLeft(scrollLeftCount);
        } else {
            toastr["error"]('Need to swipe down to update your data');
        }
        return fightId;
    }

    // $.ajax({
    //     url: postmanDomain + '/fights/fight-results',
    //     type: 'post',
    //     data: {
    //         _csrfToken: _csrfToken,
    //         event_id: eventId
    //     },
    //     success: success
    // });


    $.getJSON('json/fight-results.json', success);

}

$('.fightResultTabA').on('click', function() {
    $('.baccarat-legend').removeClass('d-none');
    $('.standard-legend').addClass('d-none');
});

$('.fightResultTabB').on('click', function() {
    $('.baccarat-legend').addClass('d-none');
    $('.standard-legend').removeClass('d-none');
});

function activeBets() {
    $("#activeBets").load(postmanDomain +'/bets/active-bets', {
        _csrfToken: _csrfToken,
        event_id: eventId,
        fight_id: fightId
    });

}

function betHistory() {
    $("#betHistory").load(postmanDomain + '/bets/bet-history', {
        _csrfToken: _csrfToken,
        event_id: eventId,
        fight_id: fightId
    });

}

function displayCatcher(type, message) {
    var positionArr = ['catcher', 'catcher-top', 'catcher-bottom'];
    var randomNumber = Math.floor(Math.random() * positionArr.length);
    $('#mediaBox').append('<div class="alert mb-2 bg-fade-' + type + ' color-' + type + '-dark shadow-xl rounded-m fade show ' + positionArr[randomNumber] + '  text-center"  role="alert"><div id="message-catcher" class="font-16">' + message + '</div></div>');
    setTimeout(
        function() {
            $('.catcher').remove();
            $('.catcher-top').remove();
            $('.catcher-bottom').remove();
        }, 8000
    );
}

function reloadGameConsole() {
    //checkInternetConnection();
    // $('#tab-red-'+device).removeClass('show');
    // $('#tab-white-'+device).removeClass('show');
    // $('#tab-betting-table-'+device).addClass('show');
    getPlayerData();
    getEventData();
    getFightData();
    fightResults();
    resizeWindow();

    setTimeout(
        function() {
            betHistory();
        }, 3000);
}

//reloadGameConsole();

var reloadMedia = 0;

function reloadData() {
    clearBettingTable();
    //checkInternetConnection();
    getPlayerData();
    getEventData();
    getFightData();
    fightResults();
    if (reloadMedia == 0) {
        resizeWindow();
        reloadMedia = 1;
    }
    setTimeout(
        function() {
            betHistory();
        }, 3000);
}

$(document).ready(function() {
    reloadData();
});



function gameReload() {
    if ($('#eventId').length) {
        reloadGameConsole();
    }
}

function dropConfetti() {
    $.confetti.restart();
    setTimeout(
        function() {
            $.confetti.stop();
        }, 3000);
}

var isMobile = false; //initiate as false

function resizeWindow() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    if (isMobile) {
        if (windowHeight > windowWidth && windowWidth < 575) { //portraint and not tablet 765

            $('#desktopVideo').addClass('d-none');
            $('#mobileVideo').removeClass('d-none');
            $('#mobile-thread').removeClass('d-none');
            $('#desktop-thread').addClass('d-none');
            $('#gameContainer').removeClass('mobile-padding');
            $('#rightCol').removeClass('pl-1');
            // if(playerMobile == null)
            // {
            loadMobileVideo();
            //}
        } else {
            $('#mobileVideo').addClass('d-none');
            $('#desktopVideo').removeClass('d-none');
            $('#mobile-thread').addClass('d-none');
            $('#desktop-thread').removeClass('d-none');
            $('#gameContainer').removeClass('container').addClass('mobile-padding');
            $('#rightCol').addClass('pl-1');
            loadDesktopVideo();
        }

    } else {
        $('#rightCol').removeClass('pl-1');
        $('#desktopVideo').removeClass('d-none');
        if (windowWidth <= 575) { //765
            $('#rightCol').addClass('p-0');
            $('#bettingStatusText').addClass('mt-3');
            $('#mobile-thread').removeClass('d-none');
            $('#desktop-thread').addClass('d-none');
            loadMobileVideo();
        } else {
            $('#rightCol').removeClass('p-0');
            $('#bettingStatusText').removeClass('mt-3');
            $('#mobile-thread').addClass('d-none');
            $('#desktop-thread').removeClass('d-none');
            loadDesktopVideo();
        }

        if (windowWidth <= 995) {
            $('#gameContainer').removeClass('container').addClass('mobile-padding');
            //loadMobileVideo();
        } else {
            $('#gameContainer').addClass('container').removeClass('mobile-padding');
            loadDesktopVideo();
        }

    }

    if ($('.header.position-fixed').length > 0) {
        $('main').css('padding-top', $('.header').outerHeight());
    }
    //loadMediaServer();
}



$(document).ready(function() {
    resizeWindow();
});

$(window).resize(function() {
    // if( isMobile == false )
    // {
    resizeWindow();
    //}
});