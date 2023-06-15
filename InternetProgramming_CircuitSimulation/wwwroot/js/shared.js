var multipliers = {
    "-24": "y", // yocto
    "-21": "z", // zepto
    "-18": "a", // atto
    "-15": "f", // femto
    "-12": "p", // pico
    "-9": "n", // nano
    "-6": "&mu;", // micro
    "-3": "m", // milli
    "0": "", // -
    "3": "k", // kilo
    "6": "M", // mega
    "9": "G", // giga
    "12": "T", // tera
    "15": "P", // peta
    "18": "E", // exa
    "21": "Z", // zetta
    "24": "Y", // yotta
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function newUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

async function renderViewComponent(url, data, elementId) {
    let x;
    await $.ajax({
        url: url,
        processData: true,
        data: data,
        success: html => {
            x = html;
        }
    });

    document.getElementById(elementId).innerHTML += x;
}

async function getJson(url, data) {
    let x;
    await $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: json => {
            x = json;
        },
        error: response => {
            x = response;
        }
    });

    return x;
}

function formatValue(value) {
    if (value === undefined) {
        return " &lang;N/A&rang; ";
    }

    try {
        value = Number.parseFloat(value);
    }
    catch {
        return " &lang;N/A&rang; ";
    }

    if (value === Infinity)
        return "&infin; ";
    if (value === -Infinity)
        return "-&infin; ";
    if (value === 0)
        return "0 ";

    let degree = 0;
    while (Math.abs(value) < 1) {
        value *= 1000.0;
        degree -= 3;
    }
    while (Math.abs(value) >= 1000) {
        value /= 1000.0;
        degree += 3;
    }

    return `${value.toFixed(2)} ${multipliers[degree]}`;
}