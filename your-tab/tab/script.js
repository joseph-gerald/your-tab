const body = document.querySelector('body');

const dropdowns = document.querySelectorAll('.dropdown');
const ipAddress = document.getElementById('ip-address');
const percentageIncrease = document.getElementById('percentage-increase');

dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const dropdownIdentifier = dropdown.querySelector('.dropdown-identifier')

    dropdownToggle.addEventListener('click', () => {
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


const chartContainer = document.getElementById('chart-container');
const chartOptions = {
    layout: { 
        textColor: '#dcdcdc',
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

fetch("https://api.phantom.app/price-history/v1?token=solana%3A101%2FnativeToken%3A501&type=1D").then(response => response.json()).then(data => {
    const priceData = data.history.map(d => ({ time: d.unixTime, value: d.value }));
    const priceSeries = chart.addLineSeries({ color: '#26a69a' });
    const change24h = data.history[data.history.length - 1].value - data.history[0].value;
    const change24hPercentage = (change24h / data.history[0].value) * 100;

    percentageIncrease.innerText = change24hPercentage.toFixed(2) + '%';

    priceSeries.setData(priceData);
    chart.timeScale().fitContent();    
});

fetch("https://api.jooo.tech/ip").then(response => response.json()).then(data => {
    ipAddress.innerText = data.query;

    if (!data.proxy && !data.hosting) {
        ipAddress.innerHTML = `<span class="blur-sm hover:blur-none duration-300">${data.query}</span>`;

        ipAddress.animate([
            { backgroundColor: '#14532d18' }
        ], {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    } else {
        ipAddress.innerText = `❗ ${data.query} / ${data.asname} ❗`;

        ipAddress.animate([
            { backgroundColor: '#7f1d1d18' }
        ], {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    }
});