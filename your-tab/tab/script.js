const body = document.querySelector('body');
const content = document.getElementById('content');
const settingsContainer = document.getElementById('settings-container');
const settingsOpen = document.getElementById('settings-open');

const settings = [
    { name: "settings-icon-hover-only", type: "checkbox", input: document.getElementById("settings-icon-hover"), value: false },
]

const ipAddress = document.getElementById('ip-address');
const percentageIncrease = document.getElementById('percentage-increase');

const config = {
    "type": "root",
    "class": "flex flex-col items-center justify-center gap-4 h-screen w-screen",
    "children": [
        {
            "type": "html",
            "tag": "p",
            "class": "text-2xl font-bold",
            "content": "Good Morning, User!"
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
                            "open": false,
                            "box": true,
                            "children": [
                                {
                                    "type": "html",
                                    "tag": "iframe",
                                    "src": "https://rtd.banenor.no/web_client/std?station=SV&layout=landscape&content=departure&notice=yes&header=no&page=1",
                                    "width": "450px",
                                    "height": "253px",
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
                            "children": [
                                {
                                    "type": "time",
                                    "class": "text-6xl font-bold text-center",
                                    "format": "HH:mm", // HH:mm:ss
                                }
                            ]
                        },
                        {
                            "type": "asset-graph",
                            "ticker": "SOL",
                            "src": "https://api.phantom.app/price-history/v1?token=solana%3A101%2FnativeToken%3A501&type=1D"
                        }
                    ]
                }
            ]
        }
    ]
};

function getSetting(name) {
    return localStorage.getItem(name);
}

function setupSettingsMenu() {
    settingsOpen.addEventListener('click', () => {
        const hidden = settingsContainer.classList.contains('hidden');

        if (hidden) {
            settingsContainer.classList.toggle('hidden');

            settingsContainer.animate([
                { transform: 'translateY(15%)', opacity: 0, backdropFilter: 'blur(0px)', backgroundColor: '#1a1a1a00' },
                { transform: 'translateY(0)', opacity: 1, backdropFilter: 'blur(6px)', backgroundColor: '#0a0a0aA0' },
            ], {
                duration: 300,
                easing: 'ease-in-out',
                fill: 'forwards'
            })
        }
    });

    settingsContainer.addEventListener('click', (e) => {
        if (e.target === settingsContainer) {
            settingsContainer.animate([
                { transform: 'translateY(0)', opacity: 1, backdropFilter: 'blur(6px)', backgroundColor: '#0a0a0aA0' },
                { transform: 'translateY(15%)', opacity: 0, backdropFilter: 'blur(0px)', backgroundColor: '#1a1a1a00' },
            ], {
                duration: 300,
                easing: 'ease-in-out',
                fill: 'forwards'
            }).onfinish = () => {
                settingsContainer.classList.toggle('hidden');
            };
        }
    });
}

function loadSettings() {
    settings.forEach(setting => {
        if (localStorage.getItem(setting.name) === null) {
            localStorage.setItem(setting.name, setting.value);
        }

        switch (setting.type) {
            case "checkbox":
                setting.input.checked = localStorage.getItem(setting.name) === 'true';
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

function parseConfig(config) {
    switch (config.type) {
        case "root":
            content.className = config.class;

            config.children.forEach(child => {
                content.appendChild(parseConfig(child));
            });

            return content;
        case "container":
            const container = document.createElement("div");
            const flexDirection = config.direction == "row" ? "flex-row" : "flex-col";
            const gap = config.gap || 4;
            const height = config.height || "h-fit";

            container.className = `${config.class} ${height} flex ${flexDirection} gap-${gap}`;

            if (config.box) {
                const padding = config.padding || 4;
                container.classList.add("p-" + padding, "bg-highlight", "rounded-md", "shadow-lg", "border", "border-border");
            }

            config.children.forEach(child => {
                container.appendChild(parseConfig(child));
            });

            return container;
        case "dropdown":
            const dropdown = document.createElement("div");
            dropdown.className = "dropdown bg-highlight h-full grow border border-border rounded-md overflow-hidden";

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
                dropdownContent.appendChild(parseConfig(child));
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

        case "time":
            const timeElement = document.createElement("p");
            timeElement.className = config.class;

            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const formattedTime = config.format
                .replace("HH", hours.toString().padStart(2, '0'))
                .replace("mm", minutes.toString().padStart(2, '0'))
                .replace("ss", seconds.toString().padStart(2, '0'));

            timeElement.innerHTML = formattedTime;

            setInterval(() => {
                const date = new Date();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                const formattedTime = config.format
                    .replace("HH", hours.toString().padStart(2, '0'))
                    .replace("mm", minutes.toString().padStart(2, '0'))
                    .replace("ss", seconds.toString().padStart(2, '0'));

                timeElement.innerHTML = formattedTime;
            }, 1000);

            return timeElement;
        case "asset-graph":
            const graphContainer = document.createElement("div");
            graphContainer.className = config.class || `relative bg-highlight h-full h-fit grow border border-border rounded-md flex justify-center overflow-hidden`;

            const tickerInfo = document.createElement("p");
            tickerInfo.className = "absolute top-3 left-3 z-10 font-bold";

            const chartContainer = document.createElement("div");

            const chartOptions = {
                layout: {
                    textColor: '#dcdcdc',
                    lineColor: '#a0a0a0',
                    background: { type: 'solid', color: '#0f0f0f' },
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

function loadConfig(config) {
    parseConfig(config);
    initializeDropdowns();
}

loadSettings();
setupSettingsMenu();

loadConfig(config);