const body = document.querySelector('body');
const content = document.getElementById('content');
const settingsContainer = document.getElementById('settings-container');
const settingsOpen = document.getElementById('settings-open');

const configSelect = document.getElementById('config-select');
const configName = document.getElementById('config-name');
const configSave = document.getElementById('config-save');
const configDelete = document.getElementById('config-delete');
const config = document.getElementById('config');

const settings = [
    { name: "settings-icon-hover-only", type: "checkbox", input: document.getElementById("settings-icon-hover"), value: false },
    { name: "config-selected", type: "select", input: configSelect, value: "default" },
]

const ipAddress = document.getElementById('ip-address');
const percentageIncrease = document.getElementById('percentage-increase');

let boxClasses = "bg-highlight border border-border rounded-md";

const defaultConfig = {
    "type": "root",
    "box_class": "bg-[#000000b0] backdrop-blur-md shadow-lg p-4",
    "body_class": "bg-[url(https://up.jooo.tech/1625)] bg-cover text-text font-body text-xs",
    "class": "flex flex-col items-center justify-center gap-4 h-screen w-screen",
    "children": [
        {
            "type": "greeting",
            "mode": "good_time_of_day",
            "class": "text-2xl font-bold text-white",
            "name": "User"
        },
        {
            "type": "container",
            "direction": "row",
            "children": [
                {
                    "type": "container",
                    "children": [
                        {
                            "type": "dropdown",
                            "label": "Departures from Sandvika",
                            "class": "p-0",
                            "open": true,
                            "box": true,
                            "children": [
                                {
                                    "type": "html",
                                    "tag": "iframe",
                                    "src": "https://rtd.banenor.no/rtd.html#/?id=SV-RTD%2FDeparture&page=0&pageCount=1&hideNotice=false&noPassengerDisplay=false&header=false&wrapperName=landscape&display=rtd",
                                    "width": "450px",
                                    "height": "282px"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "container",
                    "children": [
                        {
                            "type": "container",
                            "box": true,
                            "gap": 1,
                            "children": [
                                {
                                    "type": "date",
                                    "class": "text-2xl text-center",
                                    "format": "DD MONTH_NAME YYYY"
                                },
                                {
                                    "type": "time",
                                    "class": "text-6xl font-bold text-center",
                                    "format": "HH:MM:SS"
                                }
                            ]
                        },
                        {
                            "type": "asset-graph",
                            "ticker": "SOL",
                            "background": "FFFFFF00",
                            "src": "https://api.phantom.app/price-history/v1?token=solana%3A101%2FnativeToken%3A501&type=1D",
                            "ws_stream": "wss://history.oraclesecurity.org/trading-view/stream",
                            "ws_initiator": JSON.stringify({
                                "a": "subscribe",
                                "ch": [
                                    "solusd"
                                ]
                            }),
                            "ws_handler": "selector:p,multiplier:0.00000001"
                        }
                    ]
                }
            ]
        }
    ]
};

function getConfigs() {
    return JSON.parse(localStorage.getItem('configs')) || {};
}

function saveConfig(name) {
    const configs = getConfigs();
    configs[name] = JSON.parse(config.value);
    localStorage.setItem('configs', JSON.stringify(configs));
}

function deleteConfig(name) {
    const configs = getConfigs();
    delete configs[name];
    localStorage.setItem('configs', JSON.stringify(configs));
}

configSave.addEventListener('click', () => {
    saveConfig(configName.value);
    notify("Configs", `${configName.value} has been saved`, 2500, ["border-l-green-900"])
    loadConfig(getConfigs()[configName.value]);
});

configDelete.addEventListener('click', () => {
    deleteConfig(configName.value);
    configName.value = "default";
    notify("Configs", `${configName.value} has been deleted`, 2500, ["border-l-red-900"])
});

configSelect.addEventListener('change', () => {
    editConfig(configSelect.value);

    localStorage.setItem("config-selected", configSelect.value);
    loadConfig(getConfigs()[configSelect.value]);
});

function editConfig(name) {
    config.value = JSON.stringify(getConfigs()[name], null, 4);
    configName.value = name;
}

function getSetting(name) {
    return localStorage.getItem(name);
}

function setupSettingsMenu() {
    settingsOpen.addEventListener('click', () => {
        const hidden = settingsContainer.classList.contains('hidden');

        if (hidden) {
            settingsContainer.classList.toggle('hidden');

            settingsContainer.animate([
                { paddingTop: "100px", opacity: 0, backdropFilter: 'blur(0px)', backgroundColor: '#1a1a1a00', filter: 'blur(6px)' },
                { paddingTop: "0", opacity: 1, backdropFilter: 'blur(6px)', backgroundColor: '#0a0a0aA0', filter: 'blur(0px)' },
            ], {
                duration: 200,
                easing: 'ease-out',
                fill: 'forwards'
            })
        }
    });

    settingsContainer.addEventListener('click', (e) => {
        if (e.target === settingsContainer) {
            settingsContainer.animate([
                { paddingTop: "0", opacity: 1, backdropFilter: 'blur(6px)', backgroundColor: '#0a0a0aA0', filter: 'blur(0px)' },
                { paddingTop: "100px", opacity: 0, backdropFilter: 'blur(0px)', backgroundColor: '#1a1a1a00', filter: 'blur(6px)' },
            ], {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards'
            }).onfinish = () => {
                settingsContainer.classList.toggle('hidden');
            };
        }
    });
}

function loadSettings() {
    const configs = getConfigs();

    if (Object.keys(configs).length === 0) {
        localStorage.setItem('configs', JSON.stringify({ default: defaultConfig }));
    }

    for (const key in configs) {
        const option = document.createElement('option');
        option.value = key;
        option.innerHTML = key;
        configSelect.appendChild(option);
    }

    settings.forEach(setting => {
        if (localStorage.getItem(setting.name) === null) {
            localStorage.setItem(setting.name, setting.value);
        }

        switch (setting.type) {
            case "checkbox":
                setting.input.checked = localStorage.getItem(setting.name) === 'true';
                break;
            case "select":
                setting.input.value = localStorage.getItem(setting.name);
                break;
        }

        setting.input.addEventListener('change', () => {
            switch (setting.type) {
                case "checkbox":
                    localStorage.setItem(setting.name, setting.input.checked);
                    break;
            }
        });
    });

    editConfig(getSetting("config-selected"));

    if (getSetting("settings-icon-hover-only") === 'true') {
        settingsOpen.classList.add('-translate-x-14', 'hover:translate-x-0', 'pr-14', 'hover:pr-0');
        setTimeout(() => {
            settingsOpen.classList.add('duration-300');
        }, 0);
    }
}

function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const dropdownIdentifier = dropdown.querySelector('.dropdown-identifier')

        dropdownToggle.addEventListener('click', () => {
            dropdownContent.style.height = 'auto';
            const originalHeight = dropdownContent.scrollHeight;
            const hide = dropdown.classList.contains('hide');

            if (hide) {
                dropdown.classList.remove('hide');

                dropdownContent.animate([
                    { height: '0px' },
                    { height: `${originalHeight}px` }
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });

                dropdownIdentifier.animate([
                    { rotate: '-90deg' },
                    { rotate: '90deg' },
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
            } else {
                dropdown.classList.add('hide');

                dropdownContent.animate([
                    { height: `${originalHeight}px` },
                    { height: '0px' }
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });

                dropdownIdentifier.animate([
                    { rotate: '90deg' },
                    { rotate: '-90deg' },
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
            }
        });
    });
}

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

function loadConfig(config) {
    switch (config.type) {
        case "root":
            content.innerHTML = "";
            content.className = config.class;

            boxClasses = config.box_class || boxClasses;
            body.className = config.body_class || "bg-background text-text font-body";

            config.children.forEach(child => {
                content.appendChild(loadConfig(child));
            });

            initializeDropdowns();
            return content;
        case "container":
            const container = document.createElement("div");
            const flexDirection = config.direction == "row" ? "flex-row" : "flex-col";
            const gap = config.gap || 4;
            const height = config.height || "h-fit";

            container.className = `${config.class} ${height} flex ${flexDirection} gap-${gap}`;

            if (config.box) {
                const padding = config.padding || 4;
                container.classList.add("p-" + padding, "shadow-lg");
                container.classList.add(...boxClasses.split(" "));
            }

            config.children.forEach(child => {
                container.appendChild(loadConfig(child));
            });

            return container;
        case "dropdown":
            const dropdown = document.createElement("div");
            dropdown.className = "dropdown" + (config.box ? " h-full grow overflow-hidden " + boxClasses : "") + " " + (config.class || "");
            dropdown.style.padding = "0px";

            const dropdownToggle = document.createElement("div");
            dropdownToggle.className = "dropdown-toggle flex justify-between select-none cursor-pointer p-3";
            dropdownToggle.innerHTML = `<h6>${config.label}</h6><p class="dropdown-identifier" style="rotate: 90deg">></p>`;

            dropdown.appendChild(dropdownToggle);

            const dropdownContent = document.createElement("div");
            dropdownContent.className = "dropdown-content bg-black overflow-hidden h-full grow h-fit";

            if (!config.open) {
                dropdown.classList.add("hide");
                dropdownContent.style.height = "0px";
                dropdownToggle.querySelector('.dropdown-identifier').animate([
                    { rotate: '90deg' },
                    { rotate: '-90deg' },
                ], {
                    duration: 0,
                    fill: 'forwards'
                });
            }

            config.children.forEach(child => {
                dropdownContent.appendChild(loadConfig(child));
            });

            dropdown.appendChild(dropdownContent);

            return dropdown;
        case "html":
            const element = document.createElement(config.tag);
            element.className = config.class;
            element.innerHTML = config.content;

            for (const key in config) {
                if (key !== "type" && key !== "tag" && key !== "class" && key !== "content") {
                    element[key] = config[key];
                }
            }

            return element;

        case "greeting":
            {
                const greetingElement = document.createElement("p");
                greetingElement.className = config.class;

                const date = new Date();

                switch (config.mode) {
                    case "good_time_of_day":
                        const hours = date.getHours();
                        const timeOfDay = Math.floor(hours / 6);

                        switch (timeOfDay) {
                            case 0:
                                greetingElement.innerHTML = `Good night, ${config.name}!`;
                                break;
                            case 1:
                                greetingElement.innerHTML = `Good morning, ${config.name}!`;
                                break;
                            case 2:
                                greetingElement.innerHTML = `Good afternoon, ${config.name}!`;
                                break;
                            case 3:
                                greetingElement.innerHTML = `Good evening, ${config.name}!`;
                                break;
                            default:
                                greetingElement.innerHTML = `Hello, ${config.name}!`;
                                break;
                        }
                        break;
                    default:
                        greetingElement.innerHTML = `Hello, ${config.name}!`;
                        break;
                }

                return greetingElement;
            }
        case "time":
            const timeElement = document.createElement("p");
            timeElement.className = config.class;

            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const formattedTime = config.format
                .replace("HH", hours.toString().padStart(2, '0'))
                .replace("MM", minutes.toString().padStart(2, '0'))
                .replace("SS", seconds.toString().padStart(2, '0'));

            timeElement.innerHTML = formattedTime;

            let lastSeconds = -1;
            function update() {
                const date = new Date();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                if (seconds === lastSeconds) {
                    return requestAnimationFrame(update);
                }
                lastSeconds = seconds;

                const formattedTime = config.format
                    .replace("HH", hours.toString().padStart(2, '0'))
                    .replace("MM", minutes.toString().padStart(2, '0'))
                    .replace("SS", seconds.toString().padStart(2, '0'));

                timeElement.innerHTML = formattedTime;

                requestAnimationFrame(update);
            }
            update();

            return timeElement;
        case "date":
            {
                const dateElement = document.createElement("p");
                dateElement.className = config.class;

                const date = new Date();
                const day = date.getDate();
                const dayOfTheWeek = date.getDay();
                const month = date.getMonth();
                const year = date.getFullYear();

                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const dayNames = config.day_names || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                const formattedDate = config.format
                    .replace("DD", day.toString().padStart(2, '0'))
                    .replace("WW", date.getWeekNumber())
                    .replace("MM", (month + 1).toString().padStart(2, '0'))
                    .replace("YYYY", year.toString())
                    .replace("DAY_NAME", dayNames[dayOfTheWeek])
                    .replace("MONTH_NAME", monthNames[month])

                dateElement.innerHTML = formattedDate;

                return dateElement;
            }
        case "asset-graph":
            const graphContainer = document.createElement("div");
            graphContainer.className = config.class || `relative h-full h-fit grow flex justify-center overflow-hidden ${boxClasses}`;

            const tickerInfo = document.createElement("p");
            tickerInfo.className = "absolute top-3 left-3 z-10 font-bold";

            let socket = null;

            if (config.ws_stream) {
                socket = new WebSocket(config.ws_stream);

                socket.onopen = () => {
                    socket.send(config.ws_initiator);
                };
            }

            const chartContainer = document.createElement("div");
            const textColor = config.text_color || "#dcdcdc";

            const chartOptions = {
                layout: {
                    textColor: textColor,
                    lineColor: '#a0a0a0',
                    background: { type: 'solid', color: '#' + config.background || '00000000' },
                    attributionLogo: false
                },
                grid: {
                    vertLines: {
                        color: '#a0a0a010',
                    },
                    horzLines: {
                        color: '#a0a0a010',
                    },
                },
                width: 300,
                height: 150,
            };

            const chart = LightweightCharts.createChart(chartContainer, chartOptions);

            window.onresize = () => {
                chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);
            };

            fetch(config.src).then(response => response.json()).then(data => {
                const priceData = data.history.map(d => ({ time: d.unixTime, value: d.value }));
                const change24h = data.history[data.history.length - 1].value - data.history[0].value;
                const change24hPercentage = (change24h / data.history[0].value) * 100;

                const priceSeries = chart.addBaselineSeries({
                    baseValue: {
                        type: 'price',
                        price: data.history[0].value
                    },
                    topLineColor: 'rgba( 38, 166, 154, 1)',
                    topFillColor1: 'rgba( 38, 166, 154, 0.28)',
                    topFillColor2: 'rgba( 38, 166, 154, 0.05)',
                    bottomLineColor: 'rgba( 239, 83, 80, 1)',
                    bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
                    bottomFillColor2: 'rgba( 239, 83, 80, 0.28)'
                });

                chart.timeScale().applyOptions({
                    borderColor: '#a0a0a010',
                    barSpacing: 10,
                })

                chart.priceScale("right").applyOptions({
                    borderColor: "#a0a0a010",
                });

                tickerInfo.innerHTML = config.ticker + " / " + change24hPercentage.toFixed(2) + "%";

                priceSeries.setData(priceData);
                chart.timeScale().fitContent();

                const selector = config.ws_handler.split(",")[0].split(":")[1].split(".");
                const multiplier = parseFloat(config.ws_handler.split(",")[1].split(":")[1]);

                if (socket) {
                    socket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        let tempData = data;

                        for (let i = 0; i < selector.length; i++) {
                            tempData = tempData[selector[i]];
                        }

                        tempData = parseFloat(tempData) * multiplier;

                        const lastData = priceSeries.data().slice(-1)[0];
                        lastData.value = tempData;
                        priceSeries.update(lastData);
                    }
                }
            });

            graphContainer.appendChild(tickerInfo);
            graphContainer.appendChild(chartContainer);

            return graphContainer;

        default:
            const error = document.createElement("div");
            error.className = "text-red-500";
            error.innerHTML = "Error: unknown config type: " + config.type;
            return error;
    }
}

loadSettings();
setupSettingsMenu();

loadConfig(getConfigs()[getSetting("config-selected")] || defaultConfig);

// UTILS

function notify(title, message, duration = 2500, classes = []) {
    const notification = document.createElement("notification");
    let notifications = document.getElementById("notifications");

    if (!notifications) {
        notifications = document.createElement("div");
        notifications.id = "notifications";
        notifications.classList.add("fixed", "bottom-3", "right-3", "m-4", "z-50");
        document.body.appendChild(notifications);
    }

    notification.classList.add("bg-[#10101090]", "hover:bg-[#101010A0]", "backdrop-blur-lg", "w-full", "sm:min-w-[275px]", "flex", "flex-col");
    notification.classList.add("duration-500", "blur-sm", "opacity-0", "translate-x-[calc(100%+2rem)]", "scale-x-1/2", "h-0", "overflow-y-hidden");
    notification.classList.add("border", "border-[#00000030]", "border-l-accent")
    notification.classList.add("shadow-md", ...classes);

    setTimeout(() => {
        notification.classList.add("h-[76px]", "p-4", "py-3", "mt-2", "cursor-pointer");
        notification.classList.remove("opacity-0", "blur-sm", "translate-x-[calc(100%+2rem)]", "scale-x-1/2", "h-0");
    }, 25);

    notification.innerHTML = `
        <span class="flex justify-between"><h3 class="text-xl font-semibold">${title}</h3> <small>${(duration / 1000).toFixed(0)}s</small></span>
        <p class="opacity-80">${message}</p>
    `;

    notifications.appendChild(notification);

    classes.forEach(klass => notification.classList.add(klass));

    const timerIncrementMS = 1000;

    const callback = () => {
        const timer = notification.querySelector("small");
        const timeLeft = parseFloat(timer.textContent) - (timerIncrementMS / 1000);

        if (notification.matches(":hover") && timeLeft > 0) return;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            notification.classList.add("translate-x-[calc(100%+2rem)]", "scale-x-1/2", "blur-sm", "opacity-0");
            setTimeout(() => {
                notification.remove();
            }, 1000);
        } else {
            timer.textContent = timeLeft.toFixed(Math.max(4 - timerIncrementMS.toString().split("0").length, 0)) + "s";
        }
    }

    const timerInterval = setInterval(callback, timerIncrementMS);

    notification.addEventListener("click", () => {
        notification.querySelector("small").textContent = "0s";

        callback();
        clearInterval(timerInterval);
    });
}