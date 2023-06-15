const circuitCanvas = document.getElementById("circuit-canvas");
const managementMenuId = "management-menu";
const addComponentPopupId = "add-component-popup";
const addBranchPopupId = "add-branch-popup";
const nodeInfoParagraphId = "node-info";
const nodeOpsParagraphId = "node-ops";
const measuringDevicesContainerId = "measuring-devices-container";
const branchTemplate = `
        <div class="node junction-node source-node" id="@id" style="left: @left; top: @top;" onclick="guiShowManagementMenu('@menuX', '@menuY', '@directions')">
        </div>
    `;
const infoTemplate = `
        <span style="display: block">@value</span>
    `;
const opTemplateWithCustomOnclick = `
        <p class="management-menu-option" onclick="@onClick">@value</p>
    `;
const opAddComponentTemplate = `
        <p class="management-menu-option" onclick="guiShowAddComponentPopup('@branchId');">@value</p>
    `;
const opAddBranchTemplate = `
        <p class="management-menu-option" onclick="guiShowAddBranchPopup('@junctionId');">@value</p>
    `;
const opCancelTemplate = `
        <p class="management-menu-option" onclick="">Cancel</p>
    `;

const allAddComponentTabs = [
    "conductor",
    "resistor",
    "voltage-source",
    "voltage-source-sin"
];

const componentRequirements = {
    "conductor": [
        "direction"
    ],
    "resistor": [
        "resistance",
        "direction"
    ],
    "voltage-source": [
        "voltage",
        "direction"
    ],
    "voltage-source-sin": [
        "voltageEf",
        "frequency",
        "phase",
        "direction"
    ]
};

const componentCommands = {
    "conductor": "addConductor",
    "resistor": "addResistor",
    "voltage-source": "addVoltageSource",
    "voltage-source-sin": "addVoltageSourceSin"
}

var guiBranchToAddTo;
var guiJunctionToAddTo;

async function guiShowManagementMenu(menuX, menuY, id, type) {
    let managementMenu = document.getElementById(managementMenuId);
    let infoParagraph = document.getElementById(nodeInfoParagraphId);
    let opsParagraph = document.getElementById(nodeOpsParagraphId);
    let componentText;

    switch (type.toUpperCase()) {
        case "TERMINAL":
            let branchIndex = cliGetParentBranchIndex(id);
            let branchId = cliCircuitBranches[branchIndex]["id"];
            componentText = id.length > 10 ? "Component" : id;
            guiBranchToAddTo = branchId;

            infoParagraph.innerHTML = infoTemplate.replace("@value", `${componentText}:`);

            opsParagraph.innerHTML = opAddComponentTemplate
                .replace("@branchId", branchId)
                .replace("@value", "Add Component");
            opsParagraph.innerHTML += opTemplateWithCustomOnclick
                .replace("@onClick", `
                    let cmd = 'makeJunctionAtEnd -branch:${branchId} -id:*';
                    cliParseInput(cmd);
                `)
                .replace("@value", "Make Junction");    // TODO: Make this work (make terminal node branch)

            opsParagraph.innerHTML += opCancelTemplate;
            break;

        case "BRANCH":
            let index = cliFindBranchIndex(id);
            let current = cliCircuitBranches[index]["current"];
            let branchText = id.length > 10 ? "" : id;
            guiBranchToAddTo = id;

            infoParagraph.innerHTML = infoTemplate.replace("@value", `Branch ${branchText}:`);
            infoParagraph.innerHTML += infoTemplate.replace("@value",
                `I = ${formatValue(current)}A`);

            if (cliCircuitBranches[index]["components"].length > 0) {
                let component = cliCircuitBranches[index]["components"][0];
                let id = component["id"];
                let componentText = id.length > 10 ? "Component" : id;
                [_, _, inPotential, outPotential, _] = cliGetComponentData(id);

                infoParagraph.innerHTML += infoTemplate.replace("@value", `${componentText}:`);
                infoParagraph.innerHTML += infoTemplate.replace("@value",
                    `&phi;<sub>in</sub> = ${formatValue(inPotential)}V`);
                infoParagraph.innerHTML += infoTemplate.replace("@value",
                    `&phi;<sub>out</sub> = ${formatValue(outPotential)}V`);
                infoParagraph.innerHTML += infoTemplate.replace("@value",
                    `U = ${formatValue(inPotential - outPotential)}V`);
            }

            opsParagraph.innerHTML = opAddComponentTemplate
                .replace("@branchId", id)
                .replace("@value", "Add Component");

            opsParagraph.innerHTML += opCancelTemplate;

            break;

        case "JUNCTION":
            let potential = cliGetPotentialAtJunction(id);
            let junctionText = id.length > 10 ? "" : id;
            guiJunctionToAddTo = id;
            infoParagraph.innerHTML = infoTemplate.replace("@value", `Junction ${junctionText}:`);
            infoParagraph.innerHTML += infoTemplate.replace("@value",
                `&phi; = ${formatValue(potential)}V`);

            opsParagraph.innerHTML = opAddBranchTemplate
                .replace("@junctionId", id)
                .replace("@value", "Create Branch");

            opsParagraph.innerHTML += opCancelTemplate;
            break;

        case "COMPONENT":
            [_, _, inPotential, outPotential, _] = cliGetComponentData(id);
            componentText = id.length > 10 ? "Component" : id;
            infoParagraph.innerHTML = infoTemplate.replace("@value", `${componentText}:`);
            infoParagraph.innerHTML += infoTemplate.replace("@value",
                `&phi;<sub>in</sub> = ${formatValue(inPotential)}V`);
            infoParagraph.innerHTML += infoTemplate.replace("@value",
                `&phi;<sub>out</sub> = ${formatValue(outPotential)}V`);
            infoParagraph.innerHTML += infoTemplate.replace("@value",
                `U = ${formatValue(inPotential - outPotential)}V`);
            break;
    }

    managementMenu.style.display = "inline-block";
    await delay(5); // make sure menu is displayed before opacity adjusted
    managementMenu.style.opacity = "1";
    managementMenu.style.left = menuX;
    managementMenu.style.top = menuY;
}

async function guiHideManagementMenu() {
    let managementMenu = document.getElementById(managementMenuId);
    let infoParagraph = document.getElementById(nodeInfoParagraphId);
    managementMenu.style.opacity = "0";
    await delay(500); // make sure menu is fully hidden before display adjusted
    managementMenu.style.display = "none";
    infoParagraph.innerHTML = "";
}

async function guiShowAddComponentPopup(branchId) {
    let addComponentPopup = document.getElementById(addComponentPopupId);
    addComponentPopup.style.display = "flex";
    await delay(5); // make sure menu is displayed before opacity adjusted
    addComponentPopup.style.opacity = "1";
}

async function guiShowAddBranchPopup(junctionId) {
    let addBranchPopup = document.getElementById(addBranchPopupId);
    addBranchPopup.style.display = "flex";
    await delay(5); // make sure menu is displayed before opacity adjusted
    addBranchPopup.style.opacity = "1";
}

async function guiHidePopup(popupId) {
    let popup = document.getElementById(popupId);
    popup.style.opacity = "0";
    await delay(500); // make sure menu is fully hidden before display adjusted
    popup.style.display = "none";
}

async function guiShowAddComponentTab(tab) {
    for (let i = 0; i <= allAddComponentTabs.length - 1; i++) {
        document.getElementById(`add-comp-tab-${allAddComponentTabs[i]}`).style.display = "none";
    }

    document.getElementById(`add-comp-tab-${tab}`).style.display = "block";
}

async function guiCheckComponentMultiplier(type, param, value) {
    try {
        let mul = document.getElementById(`add-${type}-${param}-multiplier`).value;
        if (mul % 1 == 0)
            return `${value}E${mul}`;

        value = parseFloat(value) * Math.pow(10, mul);
        return value.toString();
    }
    catch {
        return value;
    }
}

async function guiAddComponent(type) {
    let params = componentRequirements[type];
    let command = componentCommands[type];

    for (let i = 0; i <= params.length - 1; i++) {
        let value = document.getElementById(`add-${type}-${params[i]}`).value;
        value = await guiCheckComponentMultiplier(type, params[i], value);
        command += ` -${params[i]}:${value}`;
    }

    command += ` -id:* -branch:${guiBranchToAddTo}`;

    await delay(550);   // To make sure add component popup is fully hidden
    cliParseInput(command);
}

async function guiCreateBranch() {
    let direction = document.getElementById("add-branch-direction").value;
    let command = `createBranch -id:* -direction:${direction} -source:${guiJunctionToAddTo}`;
    await delay(550);   // To make sure add branch popup is fully hidden
    cliParseInput(command);
}

async function guiShowMeasuringDevice(device) {
    switch (device) {
        case "multimeter":
            mmShowMe();
            break;
    }
    document.getElementById(`${device}-tab-button`).onclick = function () {
        guiHideMeasuringDevice(device);
    };
}

async function guiHideMeasuringDevice(device) {
    switch (device) {
        case "multimeter":
            mmHideMe();
            break;
    }
    document.getElementById(`${device}-tab-button`).onclick = function () {
        guiShowMeasuringDevice(device);
    };
}

function guiCreateRootJunction() {
    if (cliCircuitJunctions.filter(x => x.id = "gui-root-branch").length > 0) {
        cliLogTimestamped("WARNING", "A root branch has already been generated.");
        return;
    }

    cliParseInput("createJunction -id:gui-root-branch -left:1 -top:1");
}

function guiToggleScripting() {
    let toggle = document.getElementById("scripting-toggle");
    if (cliGeneratingScript) {
        cliPauseScript();
        toggle.innerHTML = `
            <span class="add-component-popup-tab-icon" style="background-image: url('/images/icons/init_script.svg')"></span>
            Initiate Scripting`;
    }
    else {
        cliInitScript();
        toggle.innerHTML = `
            <span class="add-component-popup-tab-icon" style="background-image: url('/images/icons/pause_script.svg')"></span>
            Pause Scripting`;;
    }
}

function guiSaveScript() {
    cliParseInput("saveScript");
}

function guiLoadScript() {
    cliLoadScript();
}

function guiClearScript() {
    cliClearScript();
}

function guiPrintScript() {
    cliPrintScript();
}

function guiSimulate() {
    cliSimulate();
}

function guiClearCircuit() {
    cliClearCircuit();
}