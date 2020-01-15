var interactions = [];
var keys = {};
window.onkeyup = function(e) {
    keys[e.keyCode] = false;
}
window.onkeydown = function(e) {
    keys[e.keyCode] = true;
}
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

function clearTacho() {
    let width = $("#tacho_canvas").width();
    let height = $("#tacho_canvas").height();
    context.clearRect(0, 0, width, height);
}

function drawTacho(speed, fuel = 0, maxSpeed = 250) {
    let context = document.getElementById("tacho_canvas").getContext('2d');
    let width = $("#tacho_canvas").width();
    let height = $("#tacho_canvas").height();
    //console.log(width, height);
    let radius = width / 2.2;
    let line_size = width / width * 7;
    context.globalAlpha = 1;
    let centerX = width / 2;
    let centerY = height / 2;
    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.webkitImageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    /*    context.beginPath();
        context.globalAlpha = 1;
        let start = 90 * (Math.PI / 180);
        let end = ((360 / 100 * speed) + 90) * (Math.PI / 180);
        context.arc(centerX, centerY, radius, start, end, false);
        context.lineWidth = 15;
        context.shadowBlur = 5;
        context.shadowColor = "rgba(0,0,0,0.5)";
        context.strokeStyle = "rgba(222, 0, 0,0.8)";
        context.stroke();
        context.closePath();
    */
    /*Background*/
    let arc_ = 100;
    context.beginPath();
    let start = 90 * (Math.PI / 180);
    let end = ((360 / 100 * arc_) + 90) * (Math.PI / 180);
    context.arc(centerX, centerY, radius - line_size, start, end, false);
    context.lineWidth = 15;
    context.shadowBlur = 5;
    context.shadowColor = "rgba(0,0,0,0.5)";
    //context.fillStyle = 'rgba(0, 0, 0,0.5)';
    grd = context.createRadialGradient(centerX, centerY, 5.000, centerX, centerY, radius);
    // Add colors
    grd.addColorStop(0.000, 'rgba(0, 0, 0,0)');
    grd.addColorStop(0.500, 'rgba(0, 0, 0,0.2)');
    grd.addColorStop(1.000, 'rgba(20, 20, 20,0.4)');
    // Fill with gradient
    context.fillStyle = grd;
    // context.fillStyle = 'rgba(0, 0, 0,0.3)';
    context.fill();
    context.closePath();
    /*Background Arc*/
    context.beginPath();
    let startAngle = 45 * (Math.PI / 180);
    let endAngle = 135 * (Math.PI / 180);
    context.arc(centerX, centerY, radius - line_size / 2, startAngle, endAngle, true);
    context.lineWidth = line_size;
    context.shadowBlur = 5;
    context.shadowColor = "rgba(0,0,0,0.5)";
    context.strokeStyle = `rgba(50, 50, 50,0.4)`;
    context.stroke();
    context.closePath();
    /*Speed Measurements
    let measureCount = 0;



    for (let iTick = 0; iTick < maxSpeed + 20; iTick += 20) {
            let cur_speed_arc = 75 / maxSpeed * iTick;
            var endDegrees = 135 + (360 * (cur_speed_arc / 100));


            let iTickRad = degreesToRadians(endDegrees);
            let x = centerX + (radius/1.21) * Math.cos(iTickRad);
            let y = centerY + (radius/1.21) * Math.sin(iTickRad);
            let mul = 0.018387359836901122;
            if (measureCount > 200) mul = 0.016387359836901122
            context.font = (mul * (width + height)) + 'px sans-serif';
            context.fillStyle = '#f0f1f0';
            context.textAlign = "center";
            context.textBaseline = 'middle';

            context.beginPath();
            context.fillText(measureCount, x, y);
            context.stroke();
            measureCount += 20;
    }
*/
    /*Orange Arc*/
    if (speed > maxSpeed) speed = maxSpeed;
    let cur_speed_arc = 75 / maxSpeed * speed;
    var startDegrees = 135;
    var endDegrees = startDegrees + 360 * (cur_speed_arc / 100);
    // Degrees to radians
    startAngle = startDegrees / 180 * Math.PI;
    endAngle = endDegrees / 180 * Math.PI;
    context.beginPath();
    context.arc(centerX, centerY, radius - line_size / 2, startAngle, endAngle, false);
    context.lineWidth = line_size;
    context.strokeStyle = `rgba(222, 110, 0,0.7)`;
    context.stroke();
    context.closePath();
    /*White Bar*/
    cur_speed_arc = 75 / maxSpeed * speed;
    let speed_degrees_start = startDegrees + 360 * ((cur_speed_arc - 0.15) / 100);
    let speed_degrees_end = startDegrees + 360 * ((cur_speed_arc + 0.15) / 100);
    startAngle = speed_degrees_start / 180 * Math.PI;
    endAngle = speed_degrees_end / 180 * Math.PI;
    context.beginPath();
    context.arc(centerX, centerY, radius - line_size * 2, startAngle, endAngle, false);
    context.lineWidth = line_size * 4;
    context.strokeStyle = `rgba(255, 255, 255,0.9)`;
    context.stroke();
    context.closePath();
    /*
    .icon-engine:before{content:'\0041';}
    .icon-fuel:before{content:'\0042';}
    .icon-light:before{content:'\0043';}

    */
    //engine.svg
    /*Fuel Arc BG*/
    startDegrees = 145;
    endDegrees = startDegrees + 360 * (20 / 100);
    startAngle = startDegrees / 180 * Math.PI;
    endAngle = endDegrees / 180 * Math.PI;
    context.beginPath();
    context.arc(centerX - radius * 0.2, centerY, radius / 1.8, startAngle, endAngle, false);
    context.lineWidth = line_size;
    context.strokeStyle = `rgba(20, 20, 20,0.5)`;
    context.stroke();
    context.closePath();
    /*Fuel Arc*/
    cur_speed_arc = 20 / 100 * fuel;
    startDegrees = 145;
    endDegrees = startDegrees + 360 * (cur_speed_arc / 100);
    startAngle = startDegrees / 180 * Math.PI;
    endAngle = endDegrees / 180 * Math.PI;
    context.beginPath();
    context.arc(centerX - radius * 0.2, centerY, radius / 1.8, startAngle, endAngle, false);
    context.lineWidth = line_size;
    var gradient1 = context.createLinearGradient(0, 800, 0, 0);
    gradient1.addColorStop(0.2, "red");
    gradient1.addColorStop(1.0, "green");
    context.strokeStyle = gradient1; //`rgba(110, 110, 110,0.7)`;
    context.stroke();
    context.closePath();
    context.beginPath();
    context.fillStyle = `rgba(220, 220, 220,0.8)`;
    context.font = (0.035 * (width + height)) + 'px Glyphter';
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.fillText('\u0043', (centerX - radius / 1.7), centerY);
    context.closePath();
    context.beginPath();
    context.fillStyle = `rgba(220, 220, 220,0.8)`;
    context.font = (0.1 * (width + height)) + 'px Technology';
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.shadowBlur = 15;
    context.shadowColor = "rgba(0,0,0,1)";
    context.fillText(Math.floor(speed), centerX, centerY);
    context.closePath();
}
/*
    let cSpeed = 0;
    let cFuel = 100;
    drawTacho(0,20,200)
    setInterval( () => {
        cSpeed += 0.3;
        cFuel -= 0.3;
        if (cSpeed > 220) cSpeed = 0;
        if (cFuel < 0) cFuel = 100;

        drawTacho(cSpeed,cFuel,220)
    },10);
*/
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
});