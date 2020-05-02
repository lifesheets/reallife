var interactions = [];
var keys = {};
window.onkeyup = function(e) {
	keys[e.keyCode] = false;
}
window.onkeydown = function(e) {
	keys[e.keyCode] = true;
}

function lerp(value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
}
Math.clamp = function(value, min, max) {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}
	return value;
};
const aspects = {
	width: 150,
	height: 150
}
const circle_line = `rgba(222, 110, 0,0.8)`;
const circle_background = "rgba(242,242,242,1)";
const circle_text = "rgba(100,100,100,1)";
var last_call = 0;
var triggered = [];
var done = [];

function drawInteraction(key, string, x, y, neededTime = 3000, scale = 1) {
	console.log("drawInteraction", key, string);
	requestAnimationFrame(function() {
		if (!triggered[key]) {
			triggered[key] = false;
		}
		x = Math.floor(x * $(window).width());
		y = Math.floor(y * $(window).height());
		if (!interactions[key]) {
			interactions[key] = {
				obj: undefined,
				isPressed: false,
				press_start: 0,
				text: string
			}
		}
		if (done[key]) return;
		let progress = 0;
		let radius = scale * 45;
		let radius_line = scale * 41;
		let keyChar = String.fromCharCode(key);
		let selector = `interaction_${key}`;
		if (interactions[key].obj == undefined) {
			if (!$("#interaction_" + key).length) {
				console.log("create");
				$("#interaction_area").append(`<canvas id="${selector}" width="${aspects.width}" height="${aspects.height}" class="interaction_key show" style="top:${x}px; left:${y}px"> </canvas>`);
				let canvasLocal = document.getElementById(selector)
				let cContext = document.getElementById(selector).getContext('2d');
				interactions[key].context = cContext;
				interactions[key].obj = selector;
				$("#interaction_area").append(`<span id="${selector}_text" class="interaction_info" style="top:${x}px; left:${y}px">${interactions[key].text}</span>`);
				setTimeout(() => {
					$("#interaction_" + key + "_text").addClass("show");
				}, 10);
			}
		}
		if (interactions[key].obj != undefined) {
			if ((interactions[key].press_start == 0) && (keys[key]) && (triggered[key] == false)) {
				interactions[key].press_start = Date.now();
				if ($("#interaction_" + key).hasClass("show")) {
					$("#interaction_" + key).removeClass("show");
				}
				if ($("#interaction_" + key).hasClass("error")) {
					$("#interaction_" + key).removeClass("error");
				}
			}
			progress = 100 / neededTime * (Date.now() - interactions[key].press_start);
			if (!keys[key] && interactions[key].press_start > 0 && (triggered[key] == false)) {
				if (interactions[key].press_start < Date.now()) {
					interactions[key].press_start += neededTime / 50;
				} else {
					interactions[key].press_start = 0;
					$("#interaction_" + key).addClass("error");
				}
			}
			if (progress < 0) progress = 0;
			$("#interaction_" + key).css({
				'left': x + 'px',
				'top': y + 'px'
			});
			$("#interaction_" + key + "_text").css({
				'left': x + aspects.width / 2 + 'px',
				'top': y + 'px'
			});
			let context = interactions[key].context;
			// context.translate(0.5, 0.5);
			let pos = interactions[key].last_pos;
			let centerX = aspects.width / 2;
			let centerY = aspects.height / 2;
			context.clearRect(0, 0, aspects.width, aspects.height);
			context.imageSmoothingEnabled = true;
			if ((progress > 0) && (interactions[key].press_start > 0) && (neededTime > 1)) {
				context.beginPath();
				context.globalAlpha = 1;
				let start = 90 * (Math.PI / 180);
				let end = ((360 / 100 * progress) + 90) * (Math.PI / 180);
				context.arc(centerX, centerY, radius_line, start, end, false);
				context.lineWidth = 15;
				context.shadowBlur = 2;
				context.shadowColor = "rgba(0,0,0,0.5)";
				context.strokeStyle = circle_line;
				context.stroke();
			}
			grd = context.createRadialGradient(centerX, centerY, 5.000, centerX, centerY, radius_line);
			// Add colors
			grd.addColorStop(0.000, circle_background);
			grd.addColorStop(0.200, circle_background);
			grd.addColorStop(1.000, 'rgba(200, 200, 200, 1)');
			// Fill with gradient
			context.fillStyle = grd;
			//context.fillStyle = circle_background;
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			context.fill();
			context.fillStyle = circle_text;
			context.font = "3vh Arial";
			context.textBaseline = "middle";
			context.textAlign = "center";
			context.fillText(keyChar, centerX, centerY);
			if ((progress > 100) && (triggered[key] == false) && (interactions[key].press_start > 0)) {
				console.log("call troggered");
				triggered[key] = true;
				if (!$("#interaction_" + key).hasClass("success")) {
					clearInteraction(key);
				}
			}
		}
		// console.log("progress", progress);
	});
}
//drawInteraction(65, 100, 100, 3000, 1)
function killInteraction(key) {
	done[key] = false;
	interactions[key] = false
	delete interactions[key]
	triggered[key] = false;
	delete triggered[key]
	if (!$("#interaction_" + key).length) {
		$("#interaction_" + key).remove();
		$("#interaction_" + key + "_text").remove();
	}
}

function cancelInteraction(key) {
	if (interactions[key]) {
		$("#interaction_" + key + "_text").addClass("fadeleft");
		$("#interaction_" + key).addClass("success");
		done[key] = true;
		triggered[key] = false;
		interactions[key] = false
		setTimeout(() => {
			$("#interaction_" + key).remove();
			$("#interaction_" + key + "_text").remove();
		}, 700);
	}
}

function clearInteraction(key) {
	if (interactions[key]) {
		$("#interaction_" + key + "_text").addClass("fadeleft");
		$("#interaction_" + key).addClass("success");
		done[key] = true;
		triggered[key] = false;
		interactions[key] = false
		mp.trigger("cef:interaction:receive", key);
		setTimeout(() => {
			$("#interaction_" + key).remove();
			$("#interaction_" + key + "_text").remove();
		}, 700);
	}
}
var canvas = document.getElementById("tacho_canvas");
canvas.width = document.getElementById("tacho").clientWidth;
canvas.height = document.getElementById("tacho").clientHeight;

function degreesToRadians(deg) {
	return (deg / 180) * Math.PI;
}

function percentToRadians(percentage, offset = 270) {
	// convert the percentage into degrees
	var degrees = percentage * 360 / 100;
	// and so that arc begins at top of circle (not 90 degrees) we add 270 degrees
	return degreesToRadians(degrees + offset);
}
var engine_image = new Image();
engine_image.src = "./css/engine.svg"
var heading_delta = undefined;
var speed_delta = undefined;
let mul = 0;
var maxRPM = 9000;

function clearTacho() {
	let context = document.getElementById("tacho_canvas").getContext('2d');
	let width = $("#tacho_canvas").width();
	let height = $("#tacho_canvas").height();
	context.clearRect(0, 0, width, height);
}
var toggled = false;
var generic_offset = 150;
var opacity_boot = 1;
var drawn = false;

function drawTacho2(speed, fuel, heading, light = false, engine = false, seatbelt = false, kmCounter = 0) {
	console.log("heading", heading);
	let context = document.getElementById("tacho_canvas").getContext('2d');
	let width = $("#tacho_canvas").width();
	let height = $("#tacho_canvas").height();
	let centerX = (width / 2);
	let centerY = (height / 2);
	let radius = height / 2.1;
	let factor = (width + height);
	let line_size = height / height * 9;
	context.clearRect(0, 0, width, height);
	context.imageSmoothingEnabled = true;
	context.webkitImageSmoothingEnabled = true;
	context.imageSmoothingQuality = "high";
	// Total BG
	{
		/*Background*/
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.lineWidth = 15;
		context.shadowBlur = 5;
		context.shadowColor = "rgba(0,0,0,0.5)";
		//context.fillStyle = 'rgba(0, 0, 0,0.5)';
		grd = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
		// Add colors
		grd.addColorStop(0.000, 'rgba(0, 0, 0,0.5)');
		grd.addColorStop(0.100, 'rgba(0, 0, 0,0.25)');
		grd.addColorStop(1.000, 'rgba(20, 20, 20,0.4)');
		// Fill with gradient
		context.fillStyle = grd;
		// context.fillStyle = 'rgba(0, 0, 0,0.3)';
		context.fill();
		context.closePath();
	}
	// Background Circle
	{
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.lineWidth = line_size / 1.2;
		context.shadowBlur = 5;
		context.shadowColor = "rgba(0,0,0,0.5)";
		let gradient = context.createRadialGradient(centerX, centerY, factor * 0.03, centerX, centerY, factor);
		gradient.addColorStop(0, '#2d2b38');
		gradient.addColorStop(0.9, '#262430');
		gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
		context.strokeStyle = gradient;
		context.stroke();
		context.closePath();
	}
	//Speed Measurements
	{
		let measureCount = 0;
		let toAdd = 20;
		let max = 240;
		for (let iTick = 0; iTick <= max; iTick += toAdd) {
			let cur_speed_arc = 55 / 200 * iTick;
			var endDegrees = 150 + (360 * (cur_speed_arc / 100));
			let iTickRad = degreesToRadians(endDegrees);
			let x = centerX + (radius * 0.85) * Math.cos(iTickRad);
			let y = centerY + (radius * 0.85) * Math.sin(iTickRad);
			let mul = 0.024387359836901122;
			if (measureCount > 80) {
				mul = 0.024387359836901122
				toAdd = 20;
			}
			context.font = (mul * factor) + 'px Technology';
			context.fillStyle = '#f0f1f0';
			context.textAlign = "center";
			context.textBaseline = 'middle';
			context.beginPath();
			context.shadowBlur = 4;
			context.shadowColor = "rgba(0,0,0,1)";
			context.fillText(measureCount, x, y);
			context.stroke();
			measureCount += Math.floor(toAdd);
		}
	}
	// Icons
	{
		// Engine
		{
			context.beginPath();
			context.fillStyle = (engine == false) ? `rgba(220, 220, 220,0.2)` : `rgba(100, 250, 100,0.7)`;
			context.font = (0.045 * (width + height)) + 'px Glyphter';
			context.textAlign = "center";
			context.textBaseline = 'middle';
			let iTickRad = degreesToRadians(180);
			let x = centerX + (radius * 0.45) * Math.cos(iTickRad);
			let y = centerY + (radius * 0.45) * Math.sin(iTickRad);
			context.fillText('\u0041', x, y);
			context.closePath();
		}
		// Light
		{
			context.beginPath();
			context.fillStyle = (light == false) ? `rgba(220, 220, 220,0.2)` : `rgba(10, 170, 255,0.7)`;
			context.font = (0.045 * (width + height)) + 'px Glyphter';
			context.textAlign = "center";
			context.textBaseline = 'middle';
			let iTickRad = degreesToRadians(0);
			let x = centerX + (radius * 0.45) * Math.cos(iTickRad);
			let y = centerY + (radius * 0.45) * Math.sin(iTickRad);
			context.fillText('\u0043', x, y);
			context.closePath();
		}
		// Seatbelt
		{
			context.beginPath();
			context.fillStyle = (seatbelt == false) ? `rgba(220, 220, 220,0.2)` : `rgba(250, 20, 20,0.7)`;
			context.font = (0.045 * (width + height)) + 'px Glyphter';
			context.textAlign = "center";
			context.textBaseline = 'middle';
			if (seatbelt == true) {
				context.shadowBlur = 10;
				context.shadowColor = "rgba(250, 20, 20,0.7)";
			}
			let iTickRad = degreesToRadians(140);
			let x = centerX + (radius * 0.45) * Math.cos(iTickRad);
			let y = centerY + (radius * 0.45) * Math.sin(iTickRad);
			context.fillText('\u0044', x, y);
			context.closePath();
		}
	}
	// Fuel
	{
		let height_offset = factor * 0.1;
		let fuel_arc_start = 120;
		// Fuel Arc BG
		// RPM Bg
				context.shadowBlur = 0;
				context.shadowColor = "rgba(0, 0, 0,0)";
		{
			let startAngle = (fuel_arc_start - 88) * (Math.PI / 180);
			let endAngle = (fuel_arc_start + 25) * (Math.PI / 180);
			context.beginPath();
			context.arc(centerX, centerY + height_offset - (factor * 0.01), (radius * 0.4), startAngle, endAngle, false);
			//context.lineWidth = line_size * 7;
			//context.strokeStyle = 'rgba(10, 10, 10,0.3)';
			context.fillStyle = 'rgba(10, 10, 10,0.3)';
			context.lineTo(centerX, centerY + height_offset - (factor * 0.01));
			context.fill();
			//context.stroke();
			context.closePath();
			// Icons Fuel
			{
				context.beginPath();
				context.fillStyle = `rgba(220, 220, 220,0.7)`;
				context.font = (0.022 * (width + height)) + 'px Glyphter';
				context.textAlign = "center";
				context.textBaseline = 'middle';
				let iTickRad = degreesToRadians(90);
				let x = centerX + (radius * 0.6) * Math.cos(iTickRad);
				let y = centerY + (radius * 0.6) * Math.sin(iTickRad);
				context.fillText('\u0042', x, y);
				context.closePath();
			}
			// Left E
			{
				let angle = (fuel_arc_start + 3) * (Math.PI / 180);
				let x = centerX + (radius * 0.32) * Math.cos(angle);
				let y = (centerY + height_offset - (factor * 0.01)) + (radius * 0.32) * Math.sin(angle);
				let mul = 0.030387359836901122;
				context.font = (mul * (width + height)) + 'px Technology';
				context.fillStyle = 'rgba(230,230,230,0.9)';
				context.textAlign = "center";
				context.textBaseline = 'middle';
				context.beginPath();
				context.shadowBlur = 10;
				context.shadowColor = "rgba(0,0,0,1)";
				context.fillText("E", x, y);
				context.stroke();
			}
			// Right F
			{
				let angle = (fuel_arc_start - 67) * (Math.PI / 180);
				let x = centerX + (radius * 0.32) * Math.cos(angle);
				let y = (centerY + height_offset - (factor * 0.01)) + (radius * 0.32) * Math.sin(angle);
				let mul = 0.030387359836901122;
				context.font = (mul * (width + height)) + 'px Technology';
				context.fillStyle = 'rgba(230,230,230,0.9)';
				context.textAlign = "center";
				context.textBaseline = 'middle';
				context.beginPath();
				context.shadowBlur = 10;
				context.shadowColor = "rgba(0,0,0,1)";
				context.fillText("F", x, y);
				context.stroke();
			} {
				let interval = 20;
				for (let iTick = 20; iTick <= 100; iTick += interval) {
					let iTickRad = degreesToRadians((fuel_arc_start - 90) + iTick);
					let fx = centerX + (radius * 0.40) * Math.cos(iTickRad);
					let fy = (centerY + height_offset - (factor * 0.01)) + (radius * 0.40) * Math.sin(iTickRad);
					let x = centerX + (radius * 0.37) * Math.cos(iTickRad);
					let y = (centerY + height_offset - (factor * 0.01)) + (radius * 0.37) * Math.sin(iTickRad);
					context.beginPath();
					context.lineWidth = line_size / 3;
					context.moveTo(fx, fy);
					context.lineTo(x, y);
					context.shadowBlur = 10;
					context.shadowColor = "rgba(0,0,0,1)";
					context.strokeStyle = 'rgba(150,150,150,0.8)';
					if (iTick > 80) context.strokeStyle = 'rgba(170,20,20,0.8)';
					context.stroke();
					context.closePath();
				}
			}
		}
		// Needle
		{
			let iTickRad = degreesToRadians(fuel_arc_start - lerp(-25, 90, 1 / 100 * fuel));
			let tx1 = centerX + (factor * 0.01) * Math.cos(iTickRad + 0.5);
			let ty1 = (centerY + height_offset) + (factor * 0.01) * Math.sin(iTickRad + 0.5);
			let tx2 = centerX + (factor * 0.01) * Math.cos(iTickRad - 0.5);
			let ty2 = (centerY + height_offset) + (factor * 0.01) * Math.sin(iTickRad - 0.5);
			let x = centerX + (radius * 0.3) * Math.cos(iTickRad);
			let y = (centerY + height_offset) + (radius * 0.3) * Math.sin(iTickRad);
			context.shadowBlur = 5;
			context.shadowColor = `rgba(159,0,0,${opacity_boot})`;
			context.beginPath();
			context.lineWidth = line_size / 3;
			context.moveTo(tx1, ty1);
			context.lineTo(x, y); //<
			context.lineTo(tx2, ty2);
			context.strokeStyle = `rgba(219, 38, 29,${opacity_boot})`;
			context.stroke();
			context.fillStyle = `rgba(219, 90, 29,0.3)`;
			context.fill();
			context.closePath();
		}
		// Fuel Needle Center
		{
			context.beginPath();
			context.arc(centerX, centerY + height_offset, factor * 0.02, 0, 2 * Math.PI, false);
			context.shadowBlur = 5;
			context.shadowColor = "rgba(0,0,0,0.7)";
			let gradient = context.createRadialGradient(centerX, centerY, factor * 0.03, centerX, centerY, factor * 0.01);
			gradient.addColorStop(0, '#2d2b38');
			gradient.addColorStop(0.9, '#262430');
			gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
			context.fillStyle = gradient;
			context.fill();
			context.closePath();
			// inner arc
			context.beginPath();
			context.arc(centerX, centerY + height_offset, factor * 0.007, 0, 2 * Math.PI, false);
			context.fillStyle = '#191724';
			context.fill();
			context.closePath();
		}
	}
	// Needle
	{
		let iTickRad = degreesToRadians(generic_offset + speed);
		let tx1 = centerX + (factor * 0.025) * Math.cos(iTickRad + 0.3);
		let ty1 = centerY + (factor * 0.025) * Math.sin(iTickRad + 0.3);
		let tx2 = centerX + (factor * 0.025) * Math.cos(iTickRad - 0.3);
		let ty2 = centerY + (factor * 0.025) * Math.sin(iTickRad - 0.3);
		let x = centerX + (radius * 0.9) * Math.cos(iTickRad);
		let y = centerY + (radius * 0.9) * Math.sin(iTickRad);
		context.shadowBlur = 5;
		context.shadowColor = `rgba(159,0,0,${opacity_boot})`;
		context.beginPath();
		context.moveTo(tx1, ty1);
		context.lineTo(x, y); //
		context.lineTo(tx2, ty2);
		context.lineWidth = line_size / 4;
		context.strokeStyle = `rgba(219, 38, 29,${opacity_boot})`;
		context.stroke();
		context.fillStyle = `rgba(219, 90, 29,0.3)`;
		context.fill();
		context.closePath();
	}
	// Dial Center Bg
	{
		context.beginPath();
		context.arc(centerX, centerY, factor * 0.03, 0, 2 * Math.PI, false);
		context.shadowBlur = 5;
		context.shadowColor = "rgba(0,0,0,0.7)";
		let gradient = context.createRadialGradient(centerX, centerY, factor * 0.03, centerX, centerY, factor * 0.01);
		gradient.addColorStop(0, '#2d2b38');
		gradient.addColorStop(0.9, '#262430');
		gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
		context.fillStyle = gradient;
		context.fill();
		context.closePath();
		// inner arc
		context.beginPath();
		context.arc(centerX, centerY, factor * 0.01, 0, 2 * Math.PI, false);
		context.fillStyle = '#191724';
		context.fill();
		context.closePath();
	}

		{
			let interval = 2;
			let max = 260;
			for (let iTick = 0; iTick < speed ; iTick += interval) {


				let iTickRad = degreesToRadians(150 + iTick);
				let fx = centerX + (radius * 0.95) * Math.cos(iTickRad);
				let fy = centerY + (radius * 0.95) * Math.sin(iTickRad);

				let x = centerX + (radius*0.98) * Math.cos(iTickRad);
				let y = centerY + (radius*0.98) * Math.sin(iTickRad);

				context.beginPath();
				context.lineWidth = line_size/4 ;
				context.moveTo(fx, fy);
				context.lineTo(x, y);
				context.strokeStyle = 'rgba(250,10,10,0.5)';
				context.stroke();
				context.closePath();
			}
		}
}

function startEngine() {
	let cSpeed = 0;
	let cFuel = 50;
	let m1 = false;
	let m2 = false;
	let engine = true;
	let km = 0;
	let seatbelt = false;
	drawTacho2(cSpeed, cFuel, 220);
	setTimeout(() => {
		setInterval(() => {
			cSpeed = (m2 == false) ? cSpeed - 1 : cSpeed + 1;
			cFuel = (m1 == false) ? cFuel - 0.2 : cFuel + 0.2;
			//if (cFuel < 0) cFuel = 0;
			if (cFuel < 0) m1 = true;
			if (cFuel > 100) m1 = false;
			if (cSpeed < 0) {
				m2 = true;
				engine = true
			};
			if (cSpeed > 250) {
				m2 = false;
				engine = false
			};
			drawTacho2(cSpeed, cFuel, 220, true, engine, seatbelt, km)
		}, 10);
	}, 1000);
}
//clearInteraction(65)
Date.prototype.timeNow = function() {
	return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}
Date.prototype.today = function() {
	return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "." + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "." + this.getFullYear();
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
		const negativeSign = amount < 0 ? "-" : "";
		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;
		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e)
	}
};

function updateTime() {
	var currentdate = new Date();
	$("#player_hud > .world > .time").text(currentdate.timeNow());
	$("#player_hud > .world > .date").text(currentdate.today());
}
var last_hunger = 0;

function updateHunger(progress) {
	$("#hunger_progress >.fill").animate({
		width: progress + "%"
	}, 100);
	last_hunger = progress;
}
let c_transactions = 0;

function addCashTransaction(cashChange) {
	if (c_transactions > 5) return;
	let id = "transaction-" + Date.now() + 1;
	let tag = cashChange > 0 ? "green" : "red";
	let cash_amt = formatMoney(parseInt(cashChange).toString().replace("-", ""), 0, ",", ".");
	let prefix = cashChange > 0 ? ("$" + cash_amt) : ("$-" + cash_amt);
	$("#player_hud > .cash > .actions").css({
		"left": "0px",
		"bottom": $("#hand_cash").height() + "px"
	})
	$("#player_hud > .cash > .actions").append(`<span style="transform:translate(0,100%);opacity:0;" id="${id}" class="${tag}">${prefix}</span>`)
	setTimeout((attrId) => {
		if ($("#" + attrId)) {
			$("#" + attrId).attr('style', '');
		}
	}, 10, id);
	c_transactions += 1;
	setTimeout((attrId) => {
		if ($("#" + attrId)) {
			$("#" + attrId).remove();
		}
		c_transactions -= 1;
	}, 1000, id);
}
var cur_cash = 0;

function updateCash(nCash) {
	jQuery({
		value: cur_cash
	}).animate({
		value: nCash
	}, {
		duration: 500,
		easing: 'linear',
		step: function(stepValue) {
			$("#hand_cash").html("$" + formatMoney(stepValue, 0, ",", "."));
		}
	});
	cur_cash = nCash;
}

function toggleHUD(state) {
	$("#player_hud").css("display", (state ? "block" : "none"));
}
var time_interval;

function init(minimap) {
	let height = $(window).height();
	let width = $(window).width();
	let offset = {
		top: 0,
		left: 25
	}
	let cell = 0;
	console.log("load minimap", minimap);
	$("#player_hud").css({
		top: (minimap.topY) * height,
		left: (minimap.rightX) * width + offset.left
	})
	$("#hunger_progress").css({
		width: ((minimap.width * width) / 3.5) + "px"
	})
	if (time_interval) {
		clearInterval(time_interval)
	};
	time_interval = setInterval(updateTime, 1000)
	/*
	cell += 1;
	$("#thirst").css({
	    top: (minimap.bottomY) * height - (cHeight) + offset.top,
	    left: (minimap.rightX) * width + (cWidth * cell) + offset.left
	})
	cell += 1;
	$("#energy").css({
	    top: (minimap.bottomY) * height - (cHeight) + offset.top,
	    left: (minimap.rightX) * width + (cWidth * cell) + offset.left
	})*/
}
$(document).ready(function(event) {
	mp.trigger("cef:hud:ready");
	//startEngine()
});