const mmDisplayId = "mm-ssd-digit";
const mmSegmentOnColour = "#000000";
const mmSegmentOffColour = "#A1CF9F";

var mmActiveClamp = "";
var mmClamps = Object;
var mmModeIndex = 0;
var mmModes = [
    { mode: "off", mul: 0 },
    { mode: "voltmeter-ac", mul: 1E0 },     // 1
    { mode: "voltmeter-ac", mul: 100E0 },   // 100
    { mode: "voltmeter-ac", mul: 1E3 },     //   1k
    { mode: "amperemeter", mul: 10E-6 },    //   1u
    { mode: "amperemeter", mul: 1E-3 },     //   1m
    { mode: "amperemeter", mul: 10E-3 },    //  10m
    { mode: "amperemeter", mul: 1E0 },      //   1
    { mode: "amperemeter", mul: 10E0 },     //  10
    { mode: "ohmmeter", mul: 1E6 },         //   1M
    { mode: "ohmmeter", mul: 100E3 },       // 100k
    { mode: "ohmmeter", mul: 1E3 },         //   1k
    { mode: "ohmmeter", mul: 100E0 },       // 100
    { mode: "ohmmeter", mul: 10E0 },        //  10
    { mode: "voltmeter", mul: 1E3 },        //   1
    { mode: "voltmeter", mul: 100E0 },      // 100
    { mode: "voltmeter", mul: 1E0 },        //   1
    { mode: "voltmeter", mul: 100E-3 },     // 100m
    { mode: "voltmeter", mul: 10E-3 },      //  10m
    { mode: "voltmeter", mul: 1E-3 }        //   1m
];

function mmFillDisplay(id, digitCount, value) {
    mmReset7SegmentDisplay(id, digitCount);

    if (digitCount < 3)
        return;

    if (typeof (value) === "string") {
        if (value.length > digitCount) {
            mmFillDisplay(id, digitCount, "ERR");
            return;
        }

        for (let i = 0; i < digitCount && i < value.length; i++) {
            let digitId = `${id}-${i}`;
            let char = value[value.length - i - 1];
            let code = mmGet7SegmentCode(char);
            mmFill7SegmentDisplay(digitId, code);
        }

        return;
    }

    if (typeof (value) === "number") {
        if (value >= Math.pow(10, digitCount) || -value >= Math.pow(10, digitCount - 1)) {
            mmFillDisplay(id, digitCount, "ERR");
            return;
        }

        let printLeadingZero = Math.abs(value) < 1;
        let printNegativeSign = value < 0;
        let negativeSignLocation;
        let offset = Math.ceil(Math.log10(Math.pow(10, digitCount) / Math.abs(value))) - 1;
        value = Math.round(Math.abs(value) * Math.pow(10, offset));
        while (value % 10 === 0 && offset > 0) {
            value /= 10;
            offset--;
        }

        for (let i = 0; i < digitCount && (value > 0 || i < offset); i++, value = Math.floor(value / 10)) {
            let digitId = `${id}-${i}`;
            let char = value % 10;
            let code = mmGet7SegmentCode(char);
            if (i == offset) code++; // show decimal point
            mmFill7SegmentDisplay(digitId, code);
            negativeSignLocation = i + 1;
        }

        if (printLeadingZero) {
            code = mmGet7SegmentCode(0) + 1;
            mmFill7SegmentDisplay(`${id}-${offset}`, code);
        }
        if (printNegativeSign) {
            code = mmGet7SegmentCode('-');
            if (printLeadingZero) negativeSignLocation++;
            mmFill7SegmentDisplay(`${id}-${negativeSignLocation}`, code);
        }

        return;
    }
}

function mmFill7SegmentDisplay(id, code) {
    let display = document.querySelector(`#${id}`);
    for (let segment = 0; segment <= 7; segment++) {
        let segmentId = mmGetSegmentIdByIndex(7 - segment);
        let segmentElement = display.querySelector(`.ssd-segment-${segmentId}`);
        let fill = Math.floor((code / Math.pow(2, segment))) % 2 == 0
            ? mmSegmentOffColour
            : mmSegmentOnColour;
        segmentElement.style.fill = fill;
    }
}

function mmGetSegmentIdByIndex(index) {
    switch (index) {
        case 0: return 'a'; break;
        case 1: return 'b'; break;
        case 2: return 'c'; break;
        case 3: return 'd'; break;
        case 4: return 'e'; break;
        case 5: return 'f'; break;
        case 6: return 'g'; break;
        case 7: return 'h'; break;
    }
}

function mmGet7SegmentCode(char) {
    switch (char) {
        //        --abcdefgh; h is decimal point
        case "o":
        case "O":
        case 0:
        case "0": return 0b11111100; break;
        case 1:
        case "1": return 0b01100000; break;
        case 2:
        case "2": return 0b11011010; break;
        case 3:
        case "3": return 0b11110010; break;
        case 4:
        case "4": return 0b01100110; break;
        case 5:
        case "5": return 0b10110110; break;
        case 6:
        case "6": return 0b10111110; break;
        case 7:
        case "7": return 0b11100000; break;
        case 8:
        case "8": return 0b11111110; break;
        case 9:
        case "9": return 0b11110110; break;
        case "e":
        case "E": return 0b10011110; break;
        case "r":
        case "R": return 0b00001010; break;
        case "l":
        case "L": return 0b00011100; break;
        case ".": return 0b00000001; break;
        case "-": return 0b00000010; break;
        default:  return 0b00000000; break;
    }
}

function mmReset7SegmentDisplay(id, digitCount) {
    for (let i = 0; i < digitCount; i++) {
        let digitId = `${id}-${i}`;
        let code = 0;
        mmFill7SegmentDisplay(digitId, code);
    }
}

function mmClampMove(e, clampId, offsetLeft) {
    let left = e.pageX - $(`#circuit-canvas`).offset().left - offsetLeft;
    let top = e.pageY - $(`#circuit-canvas`).offset().top;

    document.getElementById(clampId).style.left = `${left}px`;
    document.getElementById(clampId).style.top = `${top}px`;
}

async function mmClampClick(clampId, offsetLeft) {
    $(document).mousemove(function (e) {
        mmClampMove(e, clampId, offsetLeft);
    });
    document.querySelector("body").setAttribute("style", "cursor: none !important");
    document.getElementById(clampId).style.cursor = "none";
    let componentContainers = document.querySelectorAll(".electric-component-container");
    for (let i = 0; i <= componentContainers.length - 1; i++) {
        componentContainers[i].style.cursor = "none";
    }
    mmActiveClamp = clampId;
    //cliLogTimestamped("INFO", "Moving clamp");
}

function mmClampUnclick() {
    $(document).unbind("mousemove");
    document.querySelector("body").style.cursor = "default";
    document.getElementById(mmActiveClamp).style.cursor = "pointer";
    let componentContainers = document.querySelectorAll(".electric-component-container");
    for (let i = 0; i <= componentContainers.length - 1; i++) {
        componentContainers[i].style.cursor = "pointer";
    }
    //cliLogTimestamped("INFO", "Not moving clamp");
}

function mmEngageMultimeterMode() {
    let elements = document.querySelectorAll(".node");
    for (let i = 0; i <= elements.length - 1; i++) {
        elements[i].style.display = "none";
    }
    elements = document.querySelectorAll(".node-mm");
    for (i = 0; i <= elements.length - 1; i++) {
        elements[i].style.display = "inline-block";
    }
}

function mmDisengageMultimeterMode() {
    let elements = document.querySelectorAll(".node");
    for (let i = 0; i <= elements.length - 1; i++) {
        elements[i].style.display = "inline-block";
    }
    elements = document.querySelectorAll(".node-mm");
    for (i = 0; i <= elements.length - 1; i++) {
        elements[i].style.display = "none";
    }
}

function mmSetActiveClamp(nodeId) {
    if (mmActiveClamp === "")
        return;
    mmClampUnclick();
    mmClamps[mmActiveClamp] = {
        node: nodeId,
        connected: true
    }
    mmActiveClamp = "";
    mmCheckConnected();
}

function mmDropActiveClamp() {
    if (mmActiveClamp === "")
        return;
    mmClampUnclick();
    mmClamps[mmActiveClamp] = {
        node: "",
        connected: false
    }
    let clamp = document.getElementById(mmActiveClamp);
    clamp.style.top = "242px";
    clamp.style.left = null;
    clamp.style.right = mmActiveClamp.endsWith("r") ? "257px" : "362px";  
    mmActiveClamp = "";
    mmCheckConnected();
}

async function mmCheckConnected() {
    if (mmModes[mmModeIndex].mode == "off") {
        mmReset7SegmentDisplay(mmDisplayId, 6);
        return;
    }

    try {
        if (mmClamps["clamp-r"].connected !== true || mmClamps["clamp-b"].connected !== true) {
            mmFillDisplay(mmDisplayId, 6, "OL");
            return;
        }
    }
    catch {
        mmFillDisplay(mmDisplayId, 6, "OL");
        return;
    }

    let from = mmClamps["clamp-b"].node;
    let to = mmClamps["clamp-r"].node;
    let res;
    let params = {
        from: from,
        to: to
    };
    switch (mmModes[mmModeIndex].mode) {
        case "off":
            return;

        case "voltmeter-ac":
            res = await cliVoltmeterAC(params);
            break;

        case "voltmeter":
            res = await cliVoltmeter(params);
            break;

        case "amperemeter":
            res = await cliAmperemeter(params);
            break;

        case "ohmmeter":
            res = await cliOhmmeter(params);
            break;
    }
    res = Math.round(res * 100 / mmModes[mmModeIndex].mul) / 100;
    if (isNaN(res))
        res = "Err";
    if (res == 0)
        res = "OL";
    mmFillDisplay(mmDisplayId, 6, res);
}

async function mmShowMe() {
    mmEngageMultimeterMode();
    document.getElementById(`multimeter-container`).style.display = "inline-block";
    await delay(30); // make sure it shows
    //document.getElementById(measuringDevicesContainerId).style.height = "284px";
    document.getElementById(`multimeter-container`).style.right = "0px";
    document.getElementById(`clamp-r`).style.display = "inline-block";
    document.getElementById(`clamp-b`).style.display = "inline-block";
    document.getElementById(`clamp-r`).style.right = "257px";
    document.getElementById(`clamp-b`).style.right = "362px";
}

async function mmHideMe() {
    mmDisengageMultimeterMode();
    //document.getElementById(measuringDevicesContainerId).style.height = "34px";
    document.getElementById(`multimeter-container`).style.right = "-250px";
    await delay(510);
    document.getElementById(`multimeter-container`).style.display = "none";
    document.getElementById(`clamp-r`).style.display = "none";
    document.getElementById(`clamp-b`).style.display = "none";
    document.getElementById(`clamp-r`).style.right = "-250px";
    document.getElementById(`clamp-b`).style.right = "-250px";
}

async function mmSetMode(index) {
    index = (index % mmModes.length + 20) % mmModes.length; // set to valid index (positive & <modes.count)
    let rotType;
    if (mmModeIndex == 0 && index == mmModes.length - 1)
        rotType = "0>last";
    else if (mmModeIndex == mmModes.length - 1 && index == 0)
        rotType = "last>0";
    else
        rotType = "irrelevant";
    mmModeIndex = index;
    if (mmModes[mmModeIndex].mode == "off")
        mmReset7SegmentDisplay(mmDisplayId, 6);
    else
        mmFillDisplay(mmDisplayId, 6, "OL");

    let mode = document.getElementById("multimeter-mode");
    let unit = document.getElementById("multimeter-unit");
    switch (mmModes[mmModeIndex].mode) {
        case "off":
            mode.innerHTML = "";
            unit.innerHTML = "";
            break;
        case "voltmeter-ac":
            mode.innerHTML = "AC";
            unit.innerHTML = "V";
            break;
        case "voltmeter":
            mode.innerHTML = "DC";
            unit.innerHTML = "V";
            break;
        case "amperemeter":
            mode.innerHTML = "DC";
            unit.innerHTML = "A";
            break;
        case "ohmmeter":
            mode.innerHTML = "";
            unit.innerHTML = "&Omega;";
            break;
    }

    let rot = index * (360 / mmModes.length);
    let dial = document.getElementById("multimeter-dial");
    switch (rotType) {
        case "irrelevant":
            dial.style.transform = `rotate(${rot}deg)`;
            break;

        case "0>last":
            dial.style.transition = "none";
            await delay(5);
            dial.style.transform = "rotate(359deg)";
            await delay(5);
            dial.style.transition = "0.1s transform ease-in";
            await delay(5);
            dial.style.transform = `rotate(${rot}deg)`;
            break;

        case "last>0":
            dial.style.transform = "rotate(359deg)";
            await delay(100);
            dial.style.transition = "none";
            await delay(5);
            dial.style.transform = `rotate(${rot}deg)`;
            await delay(5);
            dial.style.transition = "0.1s transform ease-in";
            break;
    }

    mmCheckConnected();

}