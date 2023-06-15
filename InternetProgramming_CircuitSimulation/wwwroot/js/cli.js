const cliLogId = "cli-log";
const cliInputId = "cli-input";
const cliInputPId = "cli-input-p";
const cliInputCursorId = "cli-input-cursor";
const cliCircuitScriptInputId = 'in-circuit-script';

const cliLogEntry = `<p class="cli-log-entry">@value</p>`;
const cliSpan = `<span class="@class">@value</span>`;

const cliSignClass = "cli-input-sign";
const cliSpecialSignClass = "cli-input-special-sign";
const cliModifierClass = "cli-input-mod";
const cliValueClass = "cli-input-value";
const cliCommandClass = "cli-input-cmd";
const cliCursorClass = "cli-input-cursor";
const cliErrorClass = "cli-input-error";
const cliWarningClass = "cli-input-warn";
const cliInfoClass = "cli-input-info";

const cliElectComponentSizePx = 92;
const cliElectComponentContainerMarginPx = 0;
const cliCircuitPadding = 52;

const cliJunctionTemplate = `
        <div class="node junction-node source-node" id="@id" style="left: @left; top: @top;" onclick="guiShowManagementMenu('@menuX', '@menuY', '@id', '@type')">
        </div>
    `;
const cliBranchTemplate = `
        <div class="node branch-node branch-node-@direction" id="@id" style="left: @left; top: @top;" onclick="guiShowManagementMenu('@menuX', '@menuY', '@id', '@type')">
        </div>
    `;

const cliGetStartedWith = {
    "basics": `Basics: The command line interface (CLI) may be used to perform
        all functions. For more details on specific parts of the interface, run the command:
        <i>getStarted -with:section</i>; where <i>section</i> may be one of the following:<br />
        { commands, circuits, components, simulation, circuitInfo, scripts, convenience }`,
        
    "commands": `Commands: For a command to be run, its name must be entered followed by
        all required modifiers (if any) in the format "commandName -modifier1:value1 -modfier2:value2 ...".
        Modifiers may be provided in any order. Any required modifiers will be requested, while
        redundant ones will be ignored.`,

    "circuits": `Circuits: Circuits consist of junctions, branches and components. 
        To start creating a circuit, first a junction must be created (command: 
        "createJunction -id:*id as string* -left:*number of empty grid slots to left* 
        -top:*number of empty grid slots above*"). Once a junction has been created, branches
        that originate from said junction may added (command: "createBranch -id:*id as string* 
        -source:*id of source junction* -direction:*direction in which the initial component 
        will be added*"). Components may be added to any existing branch until it is closed at
        a terminal junction (for information on how to add components, check the "Components" section).
        Branches are automatically closed if the most recently added component terminates at an
        existing branch. A Junction may be also be created at the terminal point of a branch's 
        last component (command: "makeJunctionAtEnd -id:*id of new junction as string*
        -branch:*id of branch to create a junction at*").`,

    "components": `Components: Components can be added to any open branch (one that does not
        currently have a terminal junction). Shared modifiers among components are the id (id as 
        string) and branch (id of the branch the component belongs to). To add components, use: <br />
        &nbsp; &nbsp; &nbsp; &nbsp; addConductor -id:_ -branch:_ <br />
        &nbsp; &nbsp; &nbsp; &nbsp; addResistor -id:_ -branch:_ -resistance:*resistance in Ohms*<br />
        &nbsp; &nbsp; &nbsp; &nbsp; addVoltageSource -id:_ -branch:_ -voltage:*voltage in Volts*<br />`,
        
    "simulation": `Simulation: The circuit can be simulated using the <i>simulate</i> command. Simulating the
        circuit will return information about the current through each branch and potential at
        different points of the circuit. All branches must be closed before the circuit can be simulated.`,

    "circuitInfo": `Getting Circuit Information: Different types of circuit information may be 
        printed in the console. <br />
        &nbsp; &nbsp; &nbsp; &nbsp; To print all present junctions in the circuit, use the command <i>printJunctions</i>. <br />
        &nbsp; &nbsp; &nbsp; &nbsp; To print all present branches and their respective components, use
        the command <i>printBranches</i>. <br />
        &nbsp; &nbsp; &nbsp; &nbsp; To print information about a specific component, use the command <i>componentData -id:*id of the
        component*</i>.<br />`,

    "scripts": `Generating and Using Scripts: Scripts can be used to save and later load circuits.
        Scripts can be used with the following commands: <br />
        &nbsp; &nbsp; &nbsp; &nbsp; initScript &rarr; Initialises script generation. Any commands
            entered into the console will be stored; <br />
        &nbsp; &nbsp; &nbsp; &nbsp; pauseScript &rarr; Pauses script generation. Commands will not
            be stored until script generation is re-initialised; <br />
        &nbsp; &nbsp; &nbsp; &nbsp; clearScript &rarr; Deletes all previously stored script lines; <br />
        &nbsp; &nbsp; &nbsp; &nbsp; printScript &rarr; Prints all currently stored script lines; <br />
        &nbsp; &nbsp; &nbsp; &nbsp; saveScript &rarr; Generates a text file which can be stored
            locally on the user's machine. The parameter <i>-filename</i> may be provided to
            enter the desired name of the output file. <br />
        &nbsp; &nbsp; &nbsp; &nbsp; loadScript &rarr; Allows the user to load and run a locally stored
            script. <br />

        &nbsp; &nbsp; To extend an existing script, script generation may be initialised before
        loading the script so that the script's lines will be stored. Any newly run lines will be 
        added to script and the new script can be saved.`,

    "convenience": `Convenience commands: <br />
        &nbsp; &nbsp; &nbsp; &nbsp; Clearing the console log: <i>clear</i> or <i>cls</i><br />
        &nbsp; &nbsp; &nbsp; &nbsp; Clearing the circuit: <i>clearCircuit</i> or <i>clc</i><br />
        &nbsp; &nbsp; &nbsp; &nbsp; Getting a sample circuit: <i>sampleCircuit -index:*index of circuit as integer*</i>.
        <i>index</i> is optional and, if not provided, will be generated at random<br />
        &nbsp; &nbsp; &nbsp; &nbsp; Setting the console log height: <i>setLogHeight -height:*new height in px*</i><br />
        &nbsp; &nbsp; &nbsp; &nbsp; Printing a greeting: <i>greet -type:*type of greeting (info, warning, error, other...)*</i>`
}

const cliSampleCircuits = [
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:1 -top:0`;
        cliParseInput(command);
        command = `createJunction -id:J2 -left:1 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J2 -direction:left`;
        cliParseInput(command);
        command = `createBranch -id:B2 -source:J1 -direction:bottom`;
        cliParseInput(command);
        command = `createBranch -id:B3 -source:J1 -direction:right`;
        cliParseInput(command);

        // add components (B1)
        command = `addConductor -id:G1_1 -branch:B1 -direction:irrelevant`;
        cliParseInput(command);
        command = `addVoltageSource -id:U1_1 -branch:B1 -direction:top -voltage:9`;
        cliParseInput(command);
        command = `addResistor -id:R1_1 -branch:B1 -direction:right -resistance:300`;
        cliParseInput(command);

        // add components (B2)
        command = `addResistor -id:R2_1 -branch:B2 -direction:irrelevant -resistance:150`;
        cliParseInput(command);

        // add components (B3)
        command = `addConductor -id:G3_1 -branch:B3 -direction:irrelevant`;
        cliParseInput(command);
        command = `addResistor -id:R3_1 -branch:B3 -direction:bottom -resistance:90`;
        cliParseInput(command);
        command = `addConductor -id:G3_2 -branch:B3 -direction:left`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:1 -top:0`;
        cliParseInput(command);
        command = `createJunction -id:J2 -left:1 -top:1`;
        cliParseInput(command);
        command = `createJunction -id:J3 -left:2 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J2 -direction:left`;
        cliParseInput(command);
        command = `createBranch -id:B2 -source:J1 -direction:bottom`;
        cliParseInput(command);
        command = `createBranch -id:B3 -source:J1 -direction:right`;
        cliParseInput(command);
        command = `createBranch -id:B4 -source:J3 -direction:left`;
        cliParseInput(command);
        command = `createBranch -id:B5 -source:J3 -direction:bottom`;
        cliParseInput(command);

        // add components (B1)
        command = `addConductor -id:G1_1 -branch:B1 -direction:irrelevant`;
        cliParseInput(command);
        command = `addVoltageSource -id:U1_1 -branch:B1 -direction:top -voltage:9`;
        cliParseInput(command);
        command = `addResistor -id:R1_1 -branch:B1 -direction:right -resistance:330`;
        cliParseInput(command);

        // add components (B2)
        command = `addResistor -id:R2_1 -branch:B2 -direction:irrelevant -resistance:150`;
        cliParseInput(command);

        // add components (B3)
        command = `addResistor -id:R3_1 -branch:B3 -direction:irrelevant -resistance:100`;
        cliParseInput(command);
        command = `addResistor -id:R3_2 -branch:B3 -direction:bottom -resistance:450`;
        cliParseInput(command);

        // add components (B4)
        command = `addResistor -id:R4_1 -branch:B4 -direction:irrelevant -resistance:330`;
        cliParseInput(command);

        // add components (B5)
        command = `addVoltageSource -id:U5_1 -branch:B5 -direction:irrelevant -voltage:5`;
        cliParseInput(command);
        command = `addResistor -id:R5_1 -branch:B5 -direction:left -resistance:120`;
        cliParseInput(command);
        command = `addResistor -id:R5_2 -branch:B5 -direction:top -resistance:500`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:0 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J1 -direction:top`;
        cliParseInput(command);

        // add components (B1)
        command = `addVoltageSource -id:U1_1 -branch:B1 -direction:irrelevant -voltage:9`;
        cliParseInput(command);
        command = `addConductor -id:G1_1 -branch:B1 -direction:right`;
        cliParseInput(command);
        command = `addResistor -id:R1_1 -branch:B1 -direction:bottom -resistance:330`;
        cliParseInput(command);
        command = `addConductor -id:G1_2 -branch:B1 -direction:left`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:0 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J1 -direction:top`;
        cliParseInput(command);

        // add components (B1)
        command = `addVoltageSource -id:U1_1 -branch:B1 -direction:irrelevant -voltage:9`;
        cliParseInput(command);
        command = `addResistor -id:R1_1 -branch:B1 -direction:right -resistance:300`;
        cliParseInput(command);
        command = `addResistor -id:R1_2 -branch:B1 -direction:bottom -resistance:150`;
        cliParseInput(command);
        command = `addConductor -id:G1_1 -branch:B1 -direction:left`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:1 -top:0`;
        cliParseInput(command);
        command = `createJunction -id:J2 -left:1 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J2 -direction:left`;
        cliParseInput(command);
        command = `createBranch -id:B2 -source:J1 -direction:bottom`;
        cliParseInput(command);
        command = `createBranch -id:B3 -source:J1 -direction:right`;
        cliParseInput(command);

        // add components (B1)
        command = `addConductor -id:G1_1 -branch:B1 -direction:irrelevant`;
        cliParseInput(command);
        command = `addVoltageSource -id:U1_1 -branch:B1 -direction:top -voltage:9`;
        cliParseInput(command);
        command = `addResistor -id:R1_1 -branch:B1 -direction:right -resistance:300`;
        cliParseInput(command);

        // add components (B2)
        command = `addConductor -id:G2_1 -branch:B2 -direction:irrelevant`;
        cliParseInput(command);

        // add components (B3)
        command = `addConductor -id:G3_1 -branch:B3 -direction:irrelevant`;
        cliParseInput(command);
        command = `addResistor -id:R3_1 -branch:B3 -direction:bottom -resistance:90`;
        cliParseInput(command);
        command = `addConductor -id:G3_2 -branch:B3 -direction:left`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:0 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J1 -direction:top`;
        cliParseInput(command);

        // add components (B1)
        command = `addConductor -id:G1_1 -branch:B1 -direction:irrelevant`;
        cliParseInput(command);
        command = `addConductor -id:G1_2 -branch:B1 -direction:right`;
        cliParseInput(command);
        command = `addConductor -id:G1_3 -branch:B1 -direction:bottom`;
        cliParseInput(command);
        command = `addConductor -id:G1_4 -branch:B1 -direction:left`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:0 -top:1`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J1 -direction:top`;
        cliParseInput(command);

        // add components (B1)
        command = `addVoltageSource -id:U1_1 -branch:B1 -direction:irrelevant -voltage:9`;
        cliParseInput(command);
        command = `addConductor -id:G1_1 -branch:B1 -direction:right`;
        cliParseInput(command);
        command = `addConductor -id:G1_2 -branch:B1 -direction:bottom`;
        cliParseInput(command);
        command = `addConductor -id:G1_3 -branch:B1 -direction:left`;
        cliParseInput(command);
    },
    () => {
        // create junctions
        let command = `createJunction -id:J1 -left:1 -top:0`;
        cliParseInput(command);
        command = `createJunction -id:J2 -left:1 -top:1`;
        cliParseInput(command);
        command = `createJunction -id:J3 -left:2 -top:1`;
        cliParseInput(command);
        command = `createJunction -id:J4 -left:2 -top:2`;
        cliParseInput(command);

        // create branches
        command = `createBranch -id:B1 -source:J2 -direction:left`;
        cliParseInput(command);
        command = `createBranch -id:B2 -source:J1 -direction:bottom`;
        cliParseInput(command);
        command = `createBranch -id:B3 -source:J1 -direction:right`;
        cliParseInput(command);
        command = `createBranch -id:B4 -source:J3 -direction:left`;
        cliParseInput(command);
        command = `createBranch -id:B5 -source:J3 -direction:bottom`;
        cliParseInput(command);
        command = `createBranch -id:B6 -source:J3 -direction:right`;
        cliParseInput(command);
        command = `createBranch -id:B7 -source:J4 -direction:left`;
        cliParseInput(command);

        // add components (B1)
        command = `addConductor -id:G1_1 -branch:B1 -direction:irrelevant`;
        cliParseInput(command);
        command = `addVoltageSourceSin -id:U1_1 -branch:B1 -direction:top -voltageEf:220 -frequency:50 -phase:0`;
        cliParseInput(command);
        command = `addResistor -id:R1_1 -branch:B1 -direction:right -resistance:330`;
        cliParseInput(command);

        // add components (B2)
        command = `addResistor -id:R2_1 -branch:B2 -direction:irrelevant -resistance:150`;
        cliParseInput(command);

        // add components (B3)
        command = `addResistor -id:R3_1 -branch:B3 -direction:irrelevant -resistance:100`;
        cliParseInput(command);
        command = `addResistor -id:R3_2 -branch:B3 -direction:bottom -resistance:450`;
        cliParseInput(command);

        // add components (B4)
        command = `addResistor -id:R4_1 -branch:B4 -direction:irrelevant -resistance:330`;
        cliParseInput(command);

        // add components (B5)
        command = `addVoltageSourceSin -id:U5_1 -branch:B5 -direction:irrelevant -voltageEf:110 -frequency:60 -phase:1.04719755`;
        cliParseInput(command);

        // add components (B6)
        command = `addResistor -id:R6_1 -branch:B6 -direction:irrelevant -resistance:200`;
        cliParseInput(command);
        command = `addVoltageSourceSin -id:U6_1 -branch:B6 -direction:bottom -voltageEf:230 -frequency:50 -phase:2.09439510`;
        cliParseInput(command);
        command = `addResistor -id:R6_2 -branch:B6 -direction:left -resistance:450`;
        cliParseInput(command);

        // add components (B7)
        command = `addResistor -id:R7_1 -branch:B7 -direction:irrelevant -resistance:120`;
        cliParseInput(command);
        command = `addResistor -id:R7_2 -branch:B7 -direction:top -resistance:500`;
        cliParseInput(command);
    }
];

const cliComponentTypeUnits = {
    "RESISTOR": "&Omega;",
    "VOLTAGESOURCEDC": "V"
};

var cliInputFocused = false;
var cliHistory = Array();
var cliHistoryIndex = -1;
var cliScriptLines = Array();
var cliGeneratingScript = false;

var details;

let cliCircuitBranches = Array();
let cliCircuitJunctions = Array();
let cliCircuitRegime = "static-dc";

var cliExpanded = true;
var cliUnviewedWarnings = 0;
var cliUnviewedErrors = 0;

function cliLogTimestamped(level, info) {
    let date = new Date();
    let seconds = date.getSeconds() + (date.getMilliseconds() / 1000.0);
    let time = `${date.getHours()}:${date.getMinutes()}:${seconds.toFixed(3)}`;
    let timestampedInfo = `[${time}]: ${info}`;
    cliLog(level, timestampedInfo)
}

function cliLog(level, info) {
    let html = cliLogEntry.replace("@value", cliSpan.replace("@value", info));
    level = level.toUpperCase();
    if (level == "INFO" || level == "INFORMATION") {
        html = html.replace("@class", cliInfoClass);
    }
    else if (level == "WARN" || level == "WARNING") {
        html = html.replace("@class", cliWarningClass);
        if (!cliExpanded)
            cliUnviewedWarnings++;
    }
    else if (level == "ERROR") {
        html = html.replace("@class", cliErrorClass);
        if (!cliExpanded)
            cliUnviewedErrors++;
    }

    let cliLog = document.getElementById(cliLogId);
    cliLog.innerHTML += html;
}

function cliTestParams(params) {
    for (let i in params) {
        if (params[i] == undefined) {
            cliLogTimestamped("ERROR", `Missing parameter <i>${i}</i>.`);
            return false;
        }
    }

    return true;
}

function cliTestDirections(direction) {
    if (direction !== "left" && direction !== "right" && direction !== "top" && direction !== "bottom") {
        cliLogTimestamped("ERROR", `Invalid value for parameter <i>direction</i>.
            Valid values are { "left", "top", "right", "bottom" }.`);
        return false;
    }

    return true;
}

function cliFindBranchIndex(branchId) {
    for (let i in cliCircuitBranches) {
        if (cliCircuitBranches[i]["id"] == branchId)
            return i;
    }
}

function cliGetParentBranchIndex(componentId) {
    for (let i in cliCircuitBranches) {
        for (let j in cliCircuitBranches[i]["components"]) {
            if (cliCircuitBranches[i]["components"][j]["id"] == componentId)
                return i;
        }
    }
}

function cliFindJunctionIndex(junctionId) {
    for (let i in cliCircuitJunctions) {
        if (cliCircuitJunctions[i]["id"] == junctionId)
            return i;
    }
}

function cliGetPotentialAtJunction(junctionId) {
    for (let i in cliCircuitBranches) {
        if (cliCircuitBranches[i]["sourceJunction"] !== junctionId)
            continue;

        return cliCircuitBranches[i]["components"][0]["inPotential"];
    }

    return undefined;
}

function cliGetComponentData(componentId) {
    let value, type, inPotential, outPotential, current;
    for (let i in cliCircuitBranches) {
        for (let j in cliCircuitBranches[i]["components"]) {
            if (cliCircuitBranches[i]["components"][j]["id"] !== componentId)
                continue;

            current = cliCircuitBranches[i]["current"];
            value = cliCircuitBranches[i]["components"][j]["value"];
            type = cliCircuitBranches[i]["components"][j]["type"];
            inPotential = cliCircuitBranches[i]["components"][j]["inPotential"];
            j = Number.parseInt(j);
            outPotential = cliCircuitBranches[i]["components"][j + 1] !== undefined ?
                cliCircuitBranches[i]["components"][j + 1]["inPotential"] :
                cliGetPotentialAtJunction(cliCircuitBranches[i]["terminalJunction"]);

            return [type, value, inPotential, outPotential, current];
        }
    }

    return undefined;
}

function cliTestBranchAddition(branchId, direction) {
    let index = cliFindBranchIndex(branchId);

    if (cliCircuitBranches[index]["isClosed"] == true) {
        cliLogTimestamped("ERROR", `The branch <i>${branchId}</i> is closed. No further components can be added.`);
        return false;
    }
    if (cliCircuitBranches[index]["impossibleDirection"] == direction) {
        cliLogTimestamped("ERROR", `Cannot add a component in the ${direction} direction.`);
        return false;
    }

    return true;
}

function cliCheckComponentId(id, method) {
    for (let i in cliCircuitBranches) {
        for (let j in cliCircuitBranches[i]["components"]) {
            if (cliCircuitBranches[i]["components"][j]["id"] === id) {
                if (method !== "no-log")
                    cliLogTimestamped("ERROR", `Branch <i>${cliCircuitBranches[i]["id"]}</i> contains a component with the id <i>${id}</i>. Enter the command <i>details</i> for more information.`);
                details = `
                    The circuit may only contain a single component with the id <i>${id}</i>.
                    Consider using another id to add a new component.
                    To view all existing components along with their parent branches, enter the command <i>printBranches<i>.
                `;
                return false;
            }
        }
    }

    return true;
}

function cliGetAddComponentData(branchId, direction) {
    let index = cliFindBranchIndex(branchId);
    let left = cliCircuitBranches[index]["nextLeft"];
    let top = cliCircuitBranches[index]["nextTop"];
    let rotation = 0;

    switch (direction) {
        case "left":
            left -= cliElectComponentSizePx;
            top -= cliElectComponentSizePx / 2;
            rotation = 180;

            cliCircuitBranches[index]["nextLeft"] -= cliElectComponentSizePx;
            cliCircuitBranches[index]["impossibleDirection"] = "right";
            break;

        case "top":
            top -= cliElectComponentSizePx;
            left -= cliElectComponentSizePx / 2;
            rotation = 270;

            cliCircuitBranches[index]["nextTop"] -= cliElectComponentSizePx
            cliCircuitBranches[index]["impossibleDirection"] = "bottom";
            break;

        case "right":
            top -= cliElectComponentSizePx / 2;
            rotation = 0;

            cliCircuitBranches[index]["nextLeft"] += cliElectComponentSizePx;
            cliCircuitBranches[index]["impossibleDirection"] = "left";
            break;

        case "bottom":
            left -= cliElectComponentSizePx / 2;
            rotation = 90;

            cliCircuitBranches[index]["nextTop"] += cliElectComponentSizePx;
            cliCircuitBranches[index]["impossibleDirection"] = "top";
            break;
    }

    return [left, top, rotation];
}

function cliGreet(params) {
    let type = params["type"];

    let requiredParams = {
        type: type
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }

    cliLogTimestamped(type, "Hello World!");
}

function cliClear(params) {
    let cliLog = document.getElementById(cliLogId);
    cliLog.innerHTML = "";
}

function cliInvertDirection(direction) {
    switch (direction) {
        case "left": return "right";
        case "top": return "bottom";
        case "right": return "left";
        case "bottom": return "top";
        default: return "-error-";
    }
}

function cliTestBranchClosed(branchId, direction) {
    let index = cliFindBranchIndex(branchId);
    let left = cliCircuitBranches[index]["left"];
    let top = cliCircuitBranches[index]["top"];
    let nextLeft = cliCircuitBranches[index]["nextLeft"];
    let nextTop = cliCircuitBranches[index]["nextTop"];

    direction = cliInvertDirection(direction);

    // Closes at the source junction
    if (nextLeft == left - cliElectComponentContainerMarginPx + 4 &&
        nextTop == top - cliElectComponentContainerMarginPx + 4) {

        let junctionIndex = cliFindJunctionIndex(cliCircuitBranches[index]["sourceJunction"]);
        cliCircuitJunctions[junctionIndex]["taken-directions"].push(direction);
        cliCircuitBranches[index]["isClosed"] = true;
        cliCircuitBranches[index]["terminalJunction"] = cliCircuitBranches[index]["sourceJunction"];
        cliLogTimestamped("WARNING", `The branch <i>${branchId}</i> has been closed at its source junction <i>${cliCircuitBranches[index]["sourceJunction"]}</i>. No further components can be added.`);
        return;
    }

    // Closes at other junction
    for (let j in cliCircuitJunctions) {
        let jLeft = cliCircuitJunctions[j]["left"];
        let jTop = cliCircuitJunctions[j]["top"];

        if (jLeft + 4 != nextLeft || jTop + 4 != nextTop)
            continue;

        // Closes at j
        cliCircuitJunctions[j]["taken-directions"].push(direction);
        cliCircuitBranches[index]["isClosed"] = true;
        cliCircuitBranches[index]["terminalJunction"] = cliCircuitJunctions[j]["id"];
        cliLogTimestamped("WARNING", `The branch <i>${branchId}</i> has been closed with terminal junction <i>${cliCircuitJunctions[j]["id"]}</i>. No further components can be added.`);
    }
}

function cliRenderComponent(componentData) {
    renderViewComponent(
        "ViewComponent/ElectricItem",
        componentData,
        "circuit-canvas");
}

function cliAddResistor(params) {
    let resistance = params["resistance"];
    let direction = params["direction"];
    let branchId = params["branch"];
    let id = params["id"];
    let branchIndex = cliFindBranchIndex(branchId);

    let branch;
    if (branchId !== undefined) {
        branch = cliCircuitBranches[branchIndex];
        if (!branch["hasNodes"]) {
            direction = branch["immediateDirection"];
            cliLogTimestamped("WARNING", `The branch <i>${branchId}</i> does not contain any components. 
            The component will be added in the branch's immediate direction (${direction}).`);
        }
    }

    let requiredParams = {
        id: id,
        resistance: resistance,
        direction: direction,
        branch: branchId
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (id == "*")
        id = newUUID();
    if (!cliTestDirections(direction)) {
        return;
    }
    if (!cliTestBranchAddition(branchId, direction)) {
        return;
    }
    if (!cliCheckComponentId(id)) {
        return;
    }

    let [left, top, rotation] = cliGetAddComponentData(branchId, direction);

    cliRenderComponent({
        id: id,
        component: "Resistor",
        rotation: rotation,
        left: left,
        top: top,
        value: `${resistance}Ω`
    });

    cliCircuitBranches[branchIndex]["hasNodes"] = true;
    cliCircuitBranches[branchIndex]["components"].push({
        id: id,
        type: "Resistor",
        value: resistance
    });

    cliTestBranchClosed(branchId, direction);
}

function cliAddVoltageSourceSin(params) {
    let voltageEf = params["voltageEf"];
    let frequency = params["frequency"];
    let phase = params["phase"];
    let direction = params["direction"];
    let branchId = params["branch"];
    let id = params["id"];
    let branchIndex = cliFindBranchIndex(branchId);

    let branch;
    if (branchId !== undefined) {
        branch = cliCircuitBranches[branchIndex];
        if (!branch["hasNodes"]) {
            direction = branch["immediateDirection"];
            cliLogTimestamped("WARNING", `The branch <i>${branchId}</i> does not contain any components. 
            The component will be added in the branch's immediate direction (${direction}).`);
        }
    }

    let requiredParams = {
        id: id,
        voltageEf: voltageEf,
        frequency: frequency,
        phase: phase,
        direction: direction,
        branch: branchId
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (id == "*")
        id = newUUID();
    if (!cliTestDirections(direction)) {
        return;
    }
    if (!cliTestBranchAddition(branchId, direction)) {
        return;
    }
    if (!cliCheckComponentId(id)) {
        return;
    }

    let [left, top, rotation] = cliGetAddComponentData(branchId, direction);

    let value = `${voltageEf * Math.sqrt(2)} sin(${2 * Math.PI * frequency}t + ${phase})V`;
    cliRenderComponent({
        id: id,
        component: "VoltageSourceSin",
        rotation: rotation,
        left: left,
        top: top,
        value: value
    });

    cliCircuitBranches[branchIndex]["hasNodes"] = true;
    cliCircuitBranches[branchIndex]["components"].push({
        id: id,
        type: "VoltageSourceSin",
        value: `${voltageEf}|${frequency}|${phase}`,
        valueFunction: t => voltageEf * Math.sqrt(2) * Math.sin(2 * Math.PI * frequency * t + phase)
    });

    cliTestBranchClosed(branchId, direction);
}

function cliAddVoltageSource(params) {
    let voltage = params["voltage"];
    let direction = params["direction"];
    let branchId = params["branch"];
    let id = params["id"];
    let branchIndex = cliFindBranchIndex(branchId);

    let branch;
    if (branchId !== undefined) {
        branch = cliCircuitBranches[branchIndex];
        if (!branch["hasNodes"]) {
            direction = branch["immediateDirection"];
            cliLogTimestamped("WARNING", `The branch <i>${branchId}</i> does not contain any components. 
            The component will be added in the branch's immediate direction (${direction}).`);
        }
    }

    let requiredParams = {
        id: id,
        voltage: voltage,
        direction: direction,
        branch: branchId
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (id == "*")
        id = newUUID();
    if (!cliTestDirections(direction)) {
        return;
    }
    if (!cliTestBranchAddition(branchId, direction)) {
        return;
    }
    if (!cliCheckComponentId(id)) {
        return;
    }

    let [left, top, rotation] = cliGetAddComponentData(branchId, direction);

    cliRenderComponent({
        id: id,
        component: "VoltageSourceDC",
        rotation: rotation,
        left: left,
        top: top,
        value: `${voltage}V`
    });

    cliCircuitBranches[branchIndex]["hasNodes"] = true;
    cliCircuitBranches[branchIndex]["components"].push({
        id: id,
        type: "VoltageSourceDC",
        value: voltage
    });

    cliTestBranchClosed(branchId, direction);
}

function cliAddConductor(params) {
    let direction = params["direction"];
    let branchId = params["branch"];
    let id = params["id"];
    let branchIndex = cliFindBranchIndex(branchId);

    let branch;
    if (branchId !== undefined) {
        branch = cliCircuitBranches[branchIndex];
        if (!branch["hasNodes"]) {
            direction = branch["immediateDirection"];
            cliLogTimestamped("WARNING", `The branch <i>${branchId}</i> does not contain any components. 
            The component will be added in the branch's immediate direction (${direction}).`);
        }
    }

    let requiredParams = {
        id: id,
        direction: direction,
        branch: branchId
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (id == "*")
        id = newUUID();
    if (!cliTestDirections(direction)) {
        return;
    }
    if (!cliTestBranchAddition(branchId, direction)) {
        return;
    }
    if (!cliCheckComponentId(id)) {
        return;
    }

    let [left, top, rotation] = cliGetAddComponentData(branchId, direction);

    cliRenderComponent({
        id: id,
        component: "Conductor",
        rotation: rotation,
        left: left,
        top: top,
        value: ``
    });

    cliCircuitBranches[branchIndex]["hasNodes"] = true;
    cliCircuitBranches[branchIndex]["components"].push({
        id: id,
        type: "Conductor"
    });

    cliTestBranchClosed(branchId, direction);
}

function cliCreateJunction(params) {
    let circuitCanvas = document.getElementById("circuit-canvas");
    let left = parseInt(Math.abs(params["left"])) * cliElectComponentSizePx + cliCircuitPadding;
    let top = parseInt(Math.abs(params["top"])) * cliElectComponentSizePx + cliCircuitPadding;
    let id = params["id"];

    let requiredParams = {
        id: id,
        left: left,
        top: top
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (id == "*")
        id = newUUID();

    if (isNaN(left)) {
        cliLogTimestamped("ERROR", "Missing parameter <i>left</i>.");
        return;
    }
    if (isNaN(top)) {
        cliLogTimestamped("ERROR", "Missing parameter <i>top</i>.");
        return;
    }
    if (cliCircuitJunctions[id] !== undefined) {
        cliLogTimestamped("ERROR", `A junction with the id <i>${id}</i> already exists. Enter the command <i>details</i> for more information.`);
        details = `
            The circuit may only contain a single junction with the id <i>${id}</i>.
            Consider using another id to add a new junction.
            To view all existing junctions, enter the command <i>printJunctions<i>.
        `;
        return;
    }

    let node = cliJunctionTemplate
        .replaceAll("@id", id)
        .replace("@left", `${left}px`)
        .replace("@top", `${top}px`)
        .replace("@menuX", `calc(${left}px + 10px)`)
        .replace("@menuY", `calc(${top}px + 10px)`)
        .replace("@type", "junction");
    circuitCanvas.innerHTML += node;

    cliCircuitJunctions.push({
        id: id,
        left: left,
        top: top,
        "taken-directions": Array()
    });
}

function cliCreateBranch(params) {
    let circuitCanvas = document.getElementById("circuit-canvas");
    let sourceJunction = params["source"];
    let direction = params["direction"];
    let id = params["id"];

    let requiredParams = {
        id: id,
        direction: direction,
        source: sourceJunction
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (id == "*")
        id = newUUID();
    if (!cliTestDirections(direction)) {
        return;
    }

    let index = cliFindJunctionIndex(sourceJunction);
    let branchIndex = cliFindBranchIndex(id);

    if (cliCircuitJunctions[index] == undefined) {
        cliLogTimestamped("ERROR", `There is no junction with the id <i>${sourceJunction}</i>. Enter the command <i>details</i> for more information.`);
        details = `
            A junction with the id <i>${sourceJunction}</i> has not been added.
            Make sure you have entered the corrent junction id and, if so, 
            try adding it with the command <i>createJunction</i>.
            To view all existing junctions, enter the command <i>printJunctions<i>.
        `;
        return;
    }
    if (cliCircuitBranches[branchIndex] !== undefined) {
        cliLogTimestamped("ERROR", `A branch with the id <i>${id}</i> already exists. Enter the command <i>details</i> for more information.`);
        details = `
            The circuit may only contain a single branch with the id <i>${id}</i>.
            Consider using another id to add a new branch.
            To view all existing branches, enter the command <i>printBranches<i>.
        `;
        return;
    }

    if (cliCircuitJunctions[index]["taken-directions"].includes(direction)) {
        cliLogTimestamped("ERROR", `The junction <i>${sourceJunction}</i> already has a branch in the <i>${direction}</i> direction.`);
        return;
    }

    cliCircuitJunctions[index]["taken-directions"].push(direction);

    let left = cliCircuitJunctions[index]["left"];
    let top = cliCircuitJunctions[index]["top"];

    cliCircuitBranches.push({
        id: id,
        left: left,
        top: top,
        immediateDirection: direction,
        sourceJunction: sourceJunction,
        hasNodes: false,
        nextLeft: left - cliElectComponentContainerMarginPx + 4,// 4 -> half node width
        nextTop: top - cliElectComponentContainerMarginPx + 4,  // 4 -> half node height
        components: Array()
    });

    switch (direction) {
        case "left":
            left -= 10;
            break;

        case "top":
            top -= 10;
            break;

        case "right":
            left += 10;
            break;

        case "bottom":
            top += 10;
            break;
    }

    let node = cliBranchTemplate
        .replaceAll("@id", id)
        .replace("@left", `${left}px`)
        .replace("@top", `${top}px`)
        .replace("@menuX", `calc(${left}px + 10px)`)
        .replace("@menuY", `calc(${top}px + 10px)`)
        .replace("@direction", direction)
        .replace("@type", "branch");
    circuitCanvas.innerHTML += node;
}

function cliMakeJunctionAtEnd(params) {
    let branchId = params["branch"];
    let junctionId = params["id"];

    let requiredParams = {
        branch: branchId,
        id: junctionId
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (junctionId == "*")
        junctionId = newUUID();

    let branchIndex = cliFindBranchIndex(branchId);
    let left = cliCircuitBranches[branchIndex]["nextLeft"] - 4;
    left = (left - cliCircuitPadding) / cliElectComponentSizePx;
    let top = cliCircuitBranches[branchIndex]["nextTop"] - 4;
    top = (top - cliCircuitPadding) / cliElectComponentSizePx;

    cliCreateJunction({
        left: left,
        top: top,
        id: junctionId
    });

    cliTestBranchClosed(branchId, cliCircuitBranches[branchIndex]["impossibleDirection"]);
}

function cliDetails(params) {
    if (details !== undefined) {
        cliLogTimestamped("DEFAULT", details);
        return;
    }

    cliLogTimestamped("WARNING", "There are no further details for the last entered command");
}

function cliPrintDictionary(dict, leadingString) {
    for (let key in dict) {
        if (typeof (dict[key]) == "object") {
            cliLog("DEFAULT", `${leadingString}<span class="${cliModifierClass}">${key}</span>: {`);
            cliPrintDictionary(dict[key], leadingString + " &nbsp; &nbsp;");
            cliLog("DEFAULT", `${leadingString}}`);
            continue;
        }
        cliLog("DEFAULT", `${leadingString}<span class="${cliSignClass}">${key}</span>: <span class="${cliValueClass}">${dict[key]}</span>`);
    }
}

function cliPrintJunctions(params) {
    for (let i in cliCircuitJunctions) {
        cliLogTimestamped("DEFAULT", "");   // print timestamp
        cliPrintDictionary(cliCircuitJunctions, "");
        return;
    }
    cliLogTimestamped("WARNING", "The circuit does not contain any junctions.");
}

function cliPrintBranches(params) {
    for (let i in cliCircuitBranches) {
        cliLogTimestamped("DEFAULT", "");   // print timestamp
        cliPrintDictionary(cliCircuitBranches, "");
        return;
    }
    cliLogTimestamped("WARNING", "The circuit does not contain any branches.");
}

function cliComponentData(params) {
    let componentId = params["id"];

    let requiredParams = {
        id: componentId
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    if (cliCheckComponentId(componentId, "no-log")) {
        cliLogTimestamped("ERROR", `There is no component with the id <i>${componentId}</i> in the circuit.`);
        return;
    }

    [type, value, inPotential, outPotential, current] = cliGetComponentData(componentId);
    let info = {
        type: type,
        value: formatValue(value) + cliComponentTypeUnits[type.toUpperCase()],
        inPotential: `${formatValue(inPotential)}V`,
        outPotential: `${formatValue(outPotential)}V`,
        voltage: `${formatValue(inPotential - outPotential)}V`,
        current: `${formatValue(current)}A`
    }

    cliPrintDictionary(info, "");
}

function cliSampleCircuit(params) {
    let index = parseInt(params["index"]);
    if (index == undefined || isNaN(index)) {
        index = Math.random() * 1000;
    }
    index = Math.floor(index % cliSampleCircuits.length);

    cliSampleCircuits[index]();
}

function cliSetLogHeight(params) {
    let height = params["height"];

    let requiredParams = {
        height: height
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }

    if (!height.endsWith("px")) {
        cliLogTimestamped("ERROR", `Provided height must be in px i.e., must end with "px" (e.g. 1024px).`);
        return;
    }

    let cliLogDiv = document.getElementById(cliLogId);
    cliLogDiv.style.height = height;
}

function cliClearCircuit(params) {
    let circuitCanvas = document.getElementById("circuit-canvas");
    circuitCanvas.innerHTML = "";
    cliCircuitBranches = Array();
    cliCircuitJunctions = Array();
    cliLogTimestamped("INFO", "The circuit has been cleared");

    renderViewComponent(
        "ViewComponent/ManagementMenu",
        null,
        "circuit-canvas");
    renderViewComponent(
        "ViewComponent/MeasuringDevices",
        null,
        "circuit-canvas");
    addMultimeterClampsToCanvas();
}

function cliGetStarted(params) {
    let w = params["with"];
    if (w == undefined) {
        w = "basics"
    }
    if (cliGetStartedWith[w] == undefined) {
        cliLogTimestamped("ERROR", `
            Unkwown section ${w}. To get all sections that have information, enter
            <i>getStarted</i> or <i>getStarted -with:basics</i>.`);
        return;
    }
    cliLog("DEFAULT", `&nbsp; &nbsp; ${cliGetStartedWith[w]}`);
}

async function cliSimulate(params) {
    let response = await getJson("Home/Simulate", {
        junctions: cliCircuitJunctions,
        branches: cliCircuitBranches,
        circuitRegime: cliCircuitRegime
    });

    if (response["error"] === true) {
        cliLogTimestamped("ERROR", response["message"]);
        return;
    }

    for (let i in response) {
        let branch = response[i];
        let j = cliFindBranchIndex(branch["branchId"]);

        cliCircuitBranches[j]["current"] = branch["current"];

        for (let k in cliCircuitBranches[j]["components"]) {
            cliCircuitBranches[j]["components"][k]["inPotential"] = branch["components"][k]["inPotential"];
            if (cliCircuitBranches[j]["components"][k]["id"] !== branch["components"][k]["componentId"]) {
                cliLogTimestamped("ERROR", `
                    Component Id mismatch!
                    Component id at index <i>${k}</i> in response was <i>${branch["components"][k]["componentId"]}</i>,
                    while in the circuit, it is <i>${cliCircuitBranches[j]["components"][k]["id"]}</i>. Continuing...`);
            }
        }
    }

    cliLogTimestamped("INFO", "The circuit has been simulated");

    //cliPrintDictionary(response, "");
}

function cliSaveScript(params) {
    let name = params["filename"] !== undefined ?
        params["filename"] :
        "script.txt";

    // Create element with <a> tag
    const link = document.createElement("a");

    // Create a blog object with the file content which you want to add to the file
    const file = new Blob(cliScriptLines, { type: 'text/plain' });

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = name;

    // Add click event to <a> tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}

function cliLoadScript(params) {
    document.getElementById(cliCircuitScriptInputId).click();
}

function cliRunScript(script) {
    let lines = script.split('\n');

    for (let i = 0; i <= lines.length - 1; i++) {
        cliParseInput(lines[i]);
    }
}

function cliInitScript(params) {
    cliGeneratingScript = true;
    cliLogTimestamped("INFO", `
        Circuit script generation has been initialised. Any commands you enter will be stored.
        For more info, enter <i>getStarted -with:scripts</i>.`);
}

function cliPauseScript(params) {
    cliGeneratingScript = false;
    cliLogTimestamped("INFO", `
        Circuit script generation has been paused. None of the commands you enter will be stored
        until script is reinitialied. For more info, enter <i>getStarted -with:scripts</i>.`);
}

function cliPrintScript(params) {
    if (cliScriptLines.length == 0) {
        cliLogTimestamped("WARNING", "There are no scripts lines saved");
        return;
    }

    cliLogTimestamped("DEFAULT", "");
    for (let i = 0; i <= cliScriptLines.length - 1; i++) {
        cliLog("DEFAULT", `[${i}]: ${cliColourInput(cliScriptLines[i])}`);
    }
}

function cliClearScript(params) {
    cliScriptLines = Array();
    cliLogTimestamped("INFO", `All script lines have been deleted.`);
}

function cliSetCircuitRegime(params) {
    let regime = params["regime"];

    let requiredParams = {
        regime: regime
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }
    switch (regime) {
        case "static-dc":
        case "dynamic-dc":
        case "static-ac":
        case "dynamic-ac":
            cliCircuitRegime = regime;
            break;

        default:
            cliLogTimestamped("ERROR", `
                Unknown circuit regime <i>${regime}</i>. The current regime will remain as <i>${cliCircuitRegime}</i>.
                Possible regimes are: { "static-dc", "dynamic-dc", "static-ac", "dynamic-ac" }.
            `);
            return;
    }

    cliLogTimestamped("INFO", `Circuit regime has been set to <i>${cliCircuitRegime}</i>.`);
}

function cliViewCircuitRegime(params) {
    cliLogTimestamped("DEFAULT", cliCircuitRegime);
}

function cliFormatMeterConnType(type) {
    switch (type) {
        case "src":
            return "ToComponentSourceNode";

        case "ter":
            return "ToComponentTerminalNode";

        case "jun":
            return "ToJunction";

        default:
            throw `Unknown connection type <i>${type}</i>`;
    }
}

async function cliOhmmeter(params) {
    let from = params["from"];
    let to = params["to"];

    let requiredParams = {
        from: from,
        to: to
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }

    let fromType = from.split(">>")[0];
    let fromId = from.split(">>")[1];
    let toType = to.split(">>")[0];
    let toId = to.split(">>")[1];
    
    try {
        fromType = cliFormatMeterConnType(fromType);
        toType = cliFormatMeterConnType(toType);
    }
    catch (ex) {
        cliLogTimestamped("ERROR", ex);
        return;
    }
    
    let clamp1 = {
        connectionId: fromId,
        connectionType: fromType
    };
    let clamp2 = {
        connectionId: toId,
        connectionType: toType
    };
    
    let response = await getJson("Home/MeasureValue", {
        junctions: cliCircuitJunctions,
        branches: cliCircuitBranches,
        clamp1: clamp1,
        clamp2: clamp2,
        type: "MultimeterResistance"
    });

    if (response["error"] === true) {
        cliLogTimestamped("ERROR", response["message"]);
        return;
    }

    cliLogTimestamped("DEFAULT", `${formatValue(response)}&Omega;`);
    return response;
}

async function cliVoltmeterAC(params) {
    let from = params["from"];
    let to = params["to"];

    let requiredParams = {
        from: from,
        to: to
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }

    let fromType = from.split(">>")[0];
    let fromId = from.split(">>")[1];
    let toType = to.split(">>")[0];
    let toId = to.split(">>")[1];
    
    try {
        fromType = cliFormatMeterConnType(fromType);
        toType = cliFormatMeterConnType(toType);
    }
    catch (ex) {
        cliLogTimestamped("ERROR", ex);
        return;
    }
    
    let clamp1 = {
        connectionId: fromId,
        connectionType: fromType
    };
    let clamp2 = {
        connectionId: toId,
        connectionType: toType
    };
    
    let response = await getJson("Home/MeasureValue", {
        junctions: cliCircuitJunctions,
        branches: cliCircuitBranches,
        clamp1: clamp1,
        clamp2: clamp2,
        type: "MultimeterVoltageAC"
    });

    if (response["error"] === true) {
        cliLogTimestamped("ERROR", response["message"]);
        return;
    }

    cliLogTimestamped("DEFAULT", `${formatValue(response)}V`);
    return response;
}

async function cliVoltmeter(params) {
    let from = params["from"];
    let to = params["to"];

    let requiredParams = {
        from: from,
        to: to
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }

    let fromType = from.split(">>")[0];
    let fromId = from.split(">>")[1];
    let toType = to.split(">>")[0];
    let toId = to.split(">>")[1];
    
    try {
        fromType = cliFormatMeterConnType(fromType);
        toType = cliFormatMeterConnType(toType);
    }
    catch (ex) {
        cliLogTimestamped("ERROR", ex);
        return;
    }
    
    let clamp1 = {
        connectionId: fromId,
        connectionType: fromType
    };
    let clamp2 = {
        connectionId: toId,
        connectionType: toType
    };
    
    let response = await getJson("Home/MeasureValue", {
        junctions: cliCircuitJunctions,
        branches: cliCircuitBranches,
        clamp1: clamp1,
        clamp2: clamp2,
        type: "MultimeterVoltage"
    });

    if (response["error"] === true) {
        cliLogTimestamped("ERROR", response["message"]);
        return;
    }

    cliLogTimestamped("DEFAULT", `${formatValue(response)}V`);
    return response;
}

async function cliAmperemeter(params) {
    let from = params["from"];
    let to = params["to"];

    let requiredParams = {
        from: from,
        to: to
    };

    if (!cliTestParams(requiredParams)) {
        return;
    }

    let fromType = from.split(">>")[0];
    let fromId = from.split(">>")[1];
    let toType = to.split(">>")[0];
    let toId = to.split(">>")[1];

    try {
        fromType = cliFormatMeterConnType(fromType);
        toType = cliFormatMeterConnType(toType);
    }
    catch (ex) {
        cliLogTimestamped("ERROR", ex);
        return;
    }

    let clamp1 = {
        connectionId: fromId,
        connectionType: fromType
    };
    let clamp2 = {
        connectionId: toId,
        connectionType: toType
    };

    let response = await getJson("Home/MeasureValue", {
        junctions: cliCircuitJunctions,
        branches: cliCircuitBranches,
        clamp1: clamp1,
        clamp2: clamp2,
        type: "MultimeterCurrent"
    });

    if (response["error"] === true) {
        cliLogTimestamped("ERROR", response["message"]);
        return;
    }

    cliLogTimestamped("DEFAULT", `${formatValue(response)}A`);
    return response;
}

function cliFixWildcards(input) {
    // random id
    if (input.includes("-id:*")) {
        input = input.replace("-id:*", `-id:${newUUID()}`);
    }

    return input;
}

function cliParseInput(input) {
    if (input === '')
        return;
    input = cliFixWildcards(input);

    let params = new Array();
    let splitInput = input.split(' -');
    let functionName = splitInput[0];

    for (let i = 1; i <= splitInput.length - 1; i++) {
        let paramName = splitInput[i].split(':')[0];
        let paramVal = splitInput[i].split(':')[1];
        params[paramName] = paramVal;
    }

    if (cliGeneratingScript && !functionName.endsWith("Script")) {
        cliScriptLines.push(`${input}\n`);
    }

    if (functionName !== "details")
        details = undefined;
    switch (functionName) {
        case "runFunc":
            cliRunFunc();
            break;

        case "ohmmeter":
            cliOhmmeter(params);
            break;

        case "voltmeter":
            cliVoltmeter(params);
            break;

        case "amperemeter":
        case "ammeter":
            cliAmperemeter(params);
            break;

        case "viewCircuitRegime":
            cliViewCircuitRegime(params);
            break;

        case "setCircuitRegime":
            cliSetCircuitRegime(params);
            break;

        case "initScript":
            cliInitScript(params);
            break;

        case "pauseScript":
            cliPauseScript(params);
            break;

        case "clearScript":
            cliClearScript(params);
            break;

        case "printScript":
            cliPrintScript(params);
            break;

        case "saveScript":
            cliSaveScript(params);
            break;

        case "loadScript":
            cliLoadScript(params);
            break;

        case "getStarted":
            cliGetStarted(params);
            break;

        case "componentData":
            cliComponentData(params);
            break;

        case "simulate":
            cliSimulate(params);
            break;

        case "setLogHeight":
            cliSetLogHeight(params);
            break;

        case "sampleCircuit":
            cliSampleCircuit(params);
            break;
            
        case "greet":
            cliGreet(params);
            break;

        case "clc":
        case "clearCircuit":
            cliClearCircuit(params);
            break;

        case "cls":
        case "clear":
            cliClear(params);
            break;

        case "printJunctions":
            cliPrintJunctions(params);
            break;

        case "printBranches":
            cliPrintBranches(params);
            break;

        case "details":
            cliDetails(params);
            break;
            
        case "createBranch":
            cliCreateBranch(params);
            break;
            
        case "createJunction":
            cliCreateJunction(params);
            break;

        case "makeJunctionAtEnd":
            cliMakeJunctionAtEnd(params);
            break;

        case "addResistor":
            cliAddResistor(params);
            break;

        case "addVoltageSource":
            cliAddVoltageSource(params);
            break;

        case "addVoltageSourceSin":
            cliAddVoltageSourceSin(params);
            break;

        case "addConductor":
            cliAddConductor(params);
            break;

        default:
            cliLogTimestamped("ERROR", `The command <i>${functionName}</i> does not exist.`);
            break;
    }

    cliScrollToEnd();
}

function cliColourInput(input) {
    let hyphenIndex = input.indexOf(' -');
    let colonIndex = input.indexOf(':');

    while (hyphenIndex >= 0) {
        let nextHyphen = input.indexOf(' -', hyphenIndex + 1);
        if (nextHyphen == -1)
            nextHyphen = input.length;

        if (nextHyphen > -1 && nextHyphen < colonIndex) {
            let substring = input.substring(hyphenIndex + 1, nextHyphen);
            input = [
                input.slice(0, hyphenIndex + 1),
                input.slice(nextHyphen)]
                .join(`@modifierSpan${substring}@closeSpan`);

            hyphenIndex = input.indexOf(' -', hyphenIndex + 1);
            colonIndex = input.indexOf(':', hyphenIndex + 1);
            continue;
        }

        if (colonIndex > -1) {
            let substring = input.substring(hyphenIndex + 1, colonIndex);
            input = [
                input.slice(0, hyphenIndex + 1),
                input.slice(colonIndex)]
                .join(`@modifierSpan${substring}@closeSpan`);

            colonIndex = input.indexOf(':', hyphenIndex + 1);
            nextHyphen = input.indexOf(' -', hyphenIndex + 1);
            if (nextHyphen == -1)
                nextHyphen = input.length;

            substring = input.substring(colonIndex + 1, nextHyphen);
            input = [
                input.slice(0, colonIndex + 1),
                input.slice(nextHyphen)]
                .join(`@valueSpan${substring}@closeSpan`);

            hyphenIndex = input.indexOf(' -', hyphenIndex + 1);
            colonIndex = input.indexOf(':', hyphenIndex + 1);
            continue;
        }

        let substring = input.substring(hyphenIndex + 1);
        input = `${input.slice(0, hyphenIndex + 1)}@modifierSpan${substring}@closeSpan`;
        hyphenIndex = input.indexOf(' -', hyphenIndex + 1);
        colonIndex = input.indexOf(':', hyphenIndex + 1);
    }

    input = input.replaceAll('-', cliSpan.replace("@class", cliSignClass).replace("@value", "-"));
    input = input.replaceAll(':', cliSpan.replace("@class", cliSignClass).replace("@value", ":"));
    input = input.replaceAll('*', cliSpan.replace("@class", cliSpecialSignClass).replace("@value", "*"));
    input = input.replaceAll('>>', cliSpan.replace("@class", cliSpecialSignClass).replace("@value", ">>"));
    input = input.replaceAll('@modifierSpan', `<span class=${cliModifierClass}>`);
    input = input.replaceAll('@valueSpan', `<span class=${cliValueClass}>`);
    input = input.replaceAll('@closeSpan', `</span>`);
    //input += `<span class="${cliCursorClass}">|</span>`;

    return input;
}

function cliCopyInput() {
    let cliInput = document.getElementById(cliInputId);
    let cliInputP = document.getElementById(cliInputPId);
    let cliInputCursor = document.getElementById(cliInputCursorId);
    let input = cliInput.value;
    let cursorPosition = cliInput.selectionStart;

    cliInputCursor.innerHTML = "&nbsp;".repeat(cursorPosition) + "_";
    cliInputP.innerHTML = cliColourInput(input);
}

function focusCliInput() {
    if (!cliInputFocused) {
        //let cliInputP = document.getElementById(cliInputPId);
        //cliInputP.innerHTML += `<span class="${cliCursorClass}">|</span>`;
        let cliInput = document.getElementById(cliInputId);
        let cliInputCursor = document.getElementById(cliInputCursorId);
        let cursorPosition = cliInput.selectionStart;
        cliInputCursor.innerHTML = "&nbsp;".repeat(cursorPosition) + "_";
        cliInputCursor.style.display = "inline-block";
        cliInputFocused = true;
    }
}

function focusOutCliInput() {
    //let cliInputP = document.getElementById(cliInputPId);
    //cliInputP.innerHTML = cliInputP.innerHTML.split(`<span class="${cliCursorClass}">|</span>`)[0];
    let cliInputCursor = document.getElementById(cliInputCursorId);
    cliInputCursor.style.display = "none";
    cliInputFocused = false;
}

function parseCliInput(e) {
    let cliInput = document.getElementById(cliInputId);
    let cliInputP = document.getElementById(cliInputPId);

    if (e.key.toUpperCase() == "ENTER") {
        let cliLog = document.getElementById(cliLogId);
        cliLog.innerHTML += `
            <p class="cli-log-entry">${cliInputP.innerHTML}</p>
        `;
        cliParseInput(cliInput.value);

        cliHistoryIndex = -1;
        if (cliHistory.length == 10) {
            cliHistory.shift(); // drop oldest command
        }
        cliHistory.push(cliInput.value);

        cliInput.value = "";
        cliInputP.innerHTML = "";
        cliInputFocused = false;
        focusCliInput();
        return;
    }

    if (e.key.toUpperCase() == "ARROWUP") {
        if (cliHistory.length == 0) {
            return;
        }
        if (cliHistoryIndex == -1) {
            cliHistoryIndex = cliHistory.length;
        }
        let cmd = cliHistory[--cliHistoryIndex];
        if (cmd == undefined) {
            return;
        }
        cliInput.value = cmd;
        cliCopyInput();
        return;
    }

    if (e.key.toUpperCase() == "ARROWDOWN") {
        if (cliHistory.length == 0) {
            return;
        }
        let cmd = cliHistory[++cliHistoryIndex];
        if (cmd == undefined) {
            return;
        }
        cliInput.value = cmd;
        cliCopyInput();
        return;
    }

    cliCopyInput();
}

function cliScrollToEnd() {
    let log = document.getElementById("cli-log-container");
    log.scrollTop = log.scrollHeight;
}

cliCopyInput();
focusOutCliInput();
cliScrollToEnd();
cliLog("DEFAULT", "For basic information, enter the command <i>getStarted</i>");


document.getElementById(cliCircuitScriptInputId)
    .addEventListener('change', function () {

        var fr = new FileReader();
        fr.onload = function () {
            cliRunScript(fr.result);
        }

        fr.readAsText(this.files[0]);
    });