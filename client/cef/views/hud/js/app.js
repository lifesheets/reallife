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
//clearInteraction(65)
function init(minimap) {
    let height = $(window).height();
    let width = $(window).width();
    let offset = {
        top: 0,
        left: 15
    }
    let cell = 0;
    /* $("#hunger").css({
         top: (minimap.bottomY) * height - (cHeight) + offset.top,
         left: (minimap.rightX) * width + (cWidth * cell) + offset.left
     })
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
    // mp.trigger("HUD:Ready");
});