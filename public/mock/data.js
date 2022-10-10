var mockState = {
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
	        "no": "01",
	        "meron_entry_name": "",
	        "wala_entry_name": "",
	        "betting_status": "INACTIVE"
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
	        [{
	            "badge": "badge-fight-cancel",
	            "no": "1",
	            "side": "CANCEL",
	            "border": ""
	        }]
	    ],
	    "default_data": [
	        [{
	            "badge": "badge-secondary",
	            "no": "1",
	            "side": "CANCEL",
	            "border": ""
	        }]
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
	    "meron_odds": "1.86",
	    "wala_odds": "1.86",
	    "meron_amount": 5,
	    "wala_amount": 5,
	    "player_meron_amount": 0,
	    "player_wala_amount": 0,
	    "result": "OK"
	}
}