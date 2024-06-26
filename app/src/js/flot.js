{literal}
// Flot rendering functions
$(document).ready(function() {
	var queryVars, period;
	/* creating data array to hold series information
	 * 1st element is hourly graph data
	 * 2nd element is period graph data
	 * Period graph elements are indexed in the following manner:
	 * [0] This Period
	 * [1] Last Period
	 * [2] This Month
	 * [3] Last Month
	 * [4] Past 30 Days
	 * [5] Past 60 Days
	 * [6] Past 90 Days
	 * [7] This Year
	 * [8] All Time
	 */
	var series_data = {
		'Hourly Data': [],
		'Period Data': [
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			[''],
			['']
		]
	};

	label_series(series_data['Hourly Data']);
	for (var i in series_data['Period Data']) {
		label_series(series_data['Period Data'][i]);
	}

	// maps menu period indices to database period indices
	var period_map = [0, 1, 5, 11, 13, 12, 13, 6, 7];

	// constructs each series element
	function label_series(series) {
		var names = ['Hits', 'Conversions', 'Payout', 'EPC'];
		for (var i in names) {
			series[i] = {
				label: names[i],
				data: []
			};
		}
		return series;
	}

	// AJAX calls for plot data
	function call_data(queryVars) {
		$.getJSON('http://jamesdev.offerit.com/internal_data.php',
			queryVars, function store_data(data) {
				if (data) {
					var retrieved_data, target_series, plot_name;
					if (queryVars['function'] == 'offerit_display_stats') {
						retrieved_data = data.total;
						target_series = series_data['Period Data'][0];
						plot_name = '#p_chart';

					} else {
						retrieved_data = data;
						series_data['Hourly Data'];
						plot_name = '#h_chart';
					}
					target_series = create_axes(retrieved_data, target_series);
					plot_graph(plot_name, target_series);
				}
			});
	}

	// creates the axes from the ajax data and stores them in the appropriate series object
	function create_axes(ajax_data, series) {
		var axes = []
		for (var date in ajax_data) {
			// multiply
			axes.push([date * 1000, ajax_data[date]]);
		}
		// zip x-axis and y-axis values together
		// zip(axes);
		console.log("Axes: " + axes);
		series = axes;
		return series;
	}

	function plot_graph(plot_name, data) {
		var series_options = {
			series: {
				stack: true,
				group: true,
				groupInterval: 1,
				lines: {
					show: true,
					fill: false
				},
				points: {
					show: false
				},
			},
			xaxis: {
				mode: "time",
				timezone: "browser",
				tickLength: 5
			},
			selection: {
				mode: "x"
			},
			grid: {
				color: "slategray",
				borderWidth: 0,
				backgroundColor: "#E6E6E6",
				hoverable: true,
				clickable: false,
				autoHighlight: true
			}
		}
		return ($.plot(plot_name, data, series_options));
	}

	// helper for returning the weekends in a period
	function weekendAreas(axes) {

		var markings = [],
			d = new Date(axes.xaxis.min);

		// go to the first Saturday

		d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
		d.setUTCSeconds(0);
		d.setUTCMinutes(0);
		d.setUTCHours(0);

		var i = d.getTime();

		// when we don't set yaxis, the rectangle automatically
		// extends to infinity upwards and downwards

		do {
			markings.push({
				xaxis: {
					from: i,
					to: i + 2 * 24 * 60 * 60 * 1000
				}
			});
			i += 7 * 24 * 60 * 60 * 1000;
		} while (i < axes.xaxis.max);

		return markings;
	}

	///////////////////////////
	//                       //
	// Default display data  //
	//                       //
	///////////////////////////

	// Initially, display only hourly data 
	// and data from this pay period

	// Period data

	period = 1;
	queryVars = {
		'function': 'offerit_display_stats',
		'period': period,
		'dashboard_summary': 1
	};
	var summary_data = call_data(queryVars);

	// Hourly data
	period = 8;
	queryVars = {
		'function': 'offerit_display_hourly_hits',
		'period': period,
		'return_type': 'json',
		'time_format': 'hour'
	};
	var hourly_hits = call_data(queryVars);
	queryVars['function'] = 'offerit_display_hourly_sales';
	var hourly_sales = call_data(queryVars);


	// Object.keys(series_data['p_series']).forEach(function(key, index) {
	// 	label_series(series_data['p_series'], names);
	// }, series_data['p_series']);

	function flot_test() {
		// flot chart code
		var hits = [];
		var conv = [];
		var payout = [];
		var epc = [];

		// h_plot data + options
		for (var i = 0; i < 40; i += 2) {
			hits.push([i, Math.sin(i) * 10]);
			conv.push([i, Math.pow(i, 1.25)]);
			payout.push([i, Math.sqrt(i) * 20]);
			epc.push([i, i * Math.log(i)]);
		}
		var animator = {
			animator: {
				start: 1000,
				steps: 200,
				duration: 1000
			}
		};
		var h_plot = $.plot("#h_chart", [{
			data: hits,
			label: "Hits",
			animator
		}, {
			data: conv,
			label: "Conv",
			animator
		}, {
			data: payout,
			label: "Payout",
			animator
		}, {
			data: epc,
			label: "EPC",
			animator
		}], {
			series: {
				stack: true,
				group: true,
				groupInterval: 1,
				lines: {
					show: true,
					fill: false
				},
				curvedLines: {
					active: false,
					apply: true,
					monotonicFit: true
				},
				points: {
					show: true
				}
				/*xaxis: {
							max: 1000;
							mode: "time",
							tickLength: 5
						},
						selection: {
							mode: "x"
						},*/
			},
			grid: {
				color: "slategray",
				borderWidth: 0,
				backgroundColor: "#E6E6E6",
				hoverable: true,
				clickable: true,
				autoHighlight: true
			}
		});

		// p_plot data + options
		var d = [
			[1196463600000, 0],
			[1196550000000, 0],
			[1196636400000, 0],
			[1196722800000, 77],
			[1196809200000, 3636],
			[1196895600000, 3575],
			[1196982000000, 2736],
			[1197068400000, 1086],
			[1197154800000, 676],
			[1197241200000, 1205],
			[1197327600000, 906],
			[1197414000000, 710],
			[1197500400000, 639],
			[1197586800000, 540],
			[1197673200000, 435],
			[1197759600000, 301],
			[1197846000000, 575],
			[1197932400000, 481],
			[1198018800000, 591],
			[1198105200000, 608],
			[1198191600000, 459],
			[1198278000000, 234],
			[1198364400000, 1352],
			[1198450800000, 686],
			[1198537200000, 279],
			[1198623600000, 449],
			[1198710000000, 468],
			[1198796400000, 392],
			[1198882800000, 282],
			[1198969200000, 208],
			[1199055600000, 229],
			[1199142000000, 177],
			[1199228400000, 374],
			[1199314800000, 436],
			[1199401200000, 404],
			[1199487600000, 253],
			[1199574000000, 218],
			[1199660400000, 476],
			[1199746800000, 462],
			[1199833200000, 448],
			[1199919600000, 442],
			[1200006000000, 403],
			[1200092400000, 204],
			[1200178800000, 194],
			[1200265200000, 327],
			[1200351600000, 374],
			[1200438000000, 507],
			[1200524400000, 546],
			[1200610800000, 482],
			[1200697200000, 283],
			[1200783600000, 221],
			[1200870000000, 483],
			[1200956400000, 523],
			[1201042800000, 528],
			[1201129200000, 483],
			[1201215600000, 452],
			[1201302000000, 270],
			[1201388400000, 222],
			[1201474800000, 439],
			[1201561200000, 559],
			[1201647600000, 521],
			[1201734000000, 477],
			[1201820400000, 442],
			[1201906800000, 252],
			[1201993200000, 236],
			[1202079600000, 525],
			[1202166000000, 477],
			[1202252400000, 386],
			[1202338800000, 409],
			[1202425200000, 408],
			[1202511600000, 237],
			[1202598000000, 193],
			[1202684400000, 357],
			[1202770800000, 414],
			[1202857200000, 393],
			[1202943600000, 353],
			[1203030000000, 364],
			[1203116400000, 215],
			[1203202800000, 214],
			[1203289200000, 356],
			[1203375600000, 399],
			[1203462000000, 334],
			[1203548400000, 348],
			[1203634800000, 243],
			[1203721200000, 126],
			[1203807600000, 157],
			[1203894000000, 288]
		];
		// first correct the timestamps - they are recorded as the daily
		// midnights in UTC+0100, but Flot always displays dates in UTC
		// so we have to add one hour to hit the midnights in the plot

		for (var i = 0; i < d.length; ++i) {
			d[i][0] += 60 * 60 * 1000;
		}

		// helper for returning the weekends in a period

		function weekendAreas(axes) {

			var markings = [],
				d = new Date(axes.xaxis.min);

			// go to the first Saturday

			d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
			d.setUTCSeconds(0);
			d.setUTCMinutes(0);
			d.setUTCHours(0);

			var i = d.getTime();

			// when we don't set yaxis, the rectangle automatically
			// extends to infinity upwards and downwards

			do {
				markings.push({
					xaxis: {
						from: i,
						to: i + 2 * 24 * 60 * 60 * 1000
					}
				});
				i += 7 * 24 * 60 * 60 * 1000;
			} while (i < axes.xaxis.max);

			return markings;
		}

		var options = {
			series: {

				lines: {
					show: true,
					fill: true
				},
				curvedLines: {
					active: false,
					apply: true,
					monotonicFit: true
				},
				points: {
					show: false
				}
			},
			xaxis: {
				mode: "time",
				tickLength: 5
			},
			selection: {
				mode: "x"
			},
			grid: {
				color: "slategray",
				borderWidth: 0,
				backgroundColor: "#E6E6E6",
				hoverable: true,
				clickable: true,
				autoHighlight: true,
				markings: weekendAreas
			}
		};

		var p_plot = $.plotAnimator("#p_chart", [{
			data: d,
			label: "poops",
			color: "darkorchid",
			animator: {
				start: 100
			}
		}], options);

		// chart tooltip
		$("<div id='tooltip' style='font-weight: bold'></div>").css({
			position: "absolute",
			display: "none",
			border: ".1em solid #fdd",
			padding: ".5em",
			"background-color": "slategray",
			opacity: 0.80
		}).appendTo("body");

		$("#h_chart").bind("plothover", function(event, pos, item) {
			if (item) {
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);
				$("#tooltip").html(item.series.label + " of " + x + " = " + y)
					.css({
						top: item.pageY + 5,
						left: item.pageX + 5
					})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}

		});
		$("#h_chart").bind("plotclick", function(event, pos, item) {
			console.log(item);
			// axis coordinates for other axes, if present, are in pos.x2, pos.x3, ...
			// if you need global screen coordinates, they are pos.pageX, pos.pageY
			if (item) {
				h_plot.highlight(item.series, item.datapoint);
				alert("You clicked a point!");
			}
		});
		$("#p_chart").bind("plothover", function(event, pos, item) {
			if (item) {
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);
				$("#tooltip").html(item.series.label + " of " + x + " = " + y)
					.css({
						top: item.pageY + 5,
						left: item.pageX + 5
					})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}
		});
	}
});
{/literal}