import { city } from './city_data.js'
import { Chart } from 'chart.js/auto'
// import "./css/index.css"
// import icons from 'qweather-icons'
function debounce(fn, delay = 1000) {
    let timer
    function _deounce() {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn()
        }, delay)
    }
    return _deounce
}

let local = document.querySelector("#local");
let temp1 = document.querySelector("#temp div:nth-child(1)");
let temp2 = document.querySelector("#temp div:nth-child(2)");
let temp3 = document.querySelector("#temp div:nth-child(3)");
// let temp4 = document.querySelector("#temp div:nth-child(4)");
let img = document.querySelectorAll("#time_weather div img");
let b = document.querySelectorAll("#time_weather div b");
let explore = document.querySelector("#explore")
let quit = document.querySelector("#quit")
let input = document.querySelector("#exp input")
let times = document.querySelectorAll("#time_weather div span")
let todaytemp = document.querySelector("#todaytemp")
let tomorrowtemp = document.querySelector("#tomorrowtemp")
let todaysun = document.querySelector("#todaysun")
let tomorrowsun = document.querySelector("#tomorrowsun")
let daysicon = document.querySelectorAll("#twodays img")
let cts = document.getElementById('linechart')
let then = document.querySelectorAll("#chartthen div")
let iconimg = document.querySelectorAll('#icons img')
let liweather = document.querySelectorAll("#liweather span")
let newchart;
function hourweather(city) {
    fetch(`https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=7324c73a88424435b675e688becae95c`, {
        method: "get"
    }).then(res => {
        return res.json();
    }).then(res => {
        // console.log(res.location[0].id);
        return res.location[0].id
    }).then(res => {
        fetch(`https://devapi.qweather.com/v7/weather/24h?location=${res}&key=7324c73a88424435b675e688becae95c`, {
            method: "get"
        }).then(res => {
            return res.json();
        }).then(res => {
            let n = 0;
            res.hourly.forEach(element => {
                img[n].src = `./node_modules/qweather-icons/icons/${element.icon}-fill.svg`;
                b[n++].innerHTML = element.temp + '°';
            })
            console.log(res.hourly);
        })
    })
}

function get7days(city) {
    fetch(`https://v0.yiketianqi.com/free/week?appid=59947189&appsecret=JTqbLH7A&unescape=1&city=${city}`, {
        method: 'get',
    }).then(res => {
        return res.json()
    }).then(res => {
        let arr = res.data;
        todaytemp.innerHTML = arr[0].tem_day + '/' + arr[0].tem_night + '°';
        tomorrowtemp.innerHTML = arr[1].tem_day + '/' + arr[1].tem_night + '°';
        todaysun.innerHTML = arr[0].wea;
        tomorrowsun.innerHTML = arr[1].wea;
        daysicon[0].src = icon(arr[0].wea_img);
        daysicon[1].src = icon(arr[1].wea_img);
        if (newchart instanceof Chart) {
            newchart.destroy();
        }
        let n = 0;
        arr.forEach(element => {
            then[n].innerHTML = weekDay(element.date);
            iconimg[n].src = `./images/day/${element.wea_img}.png`;
            liweather[n++].innerHTML = element.wea;
        })
        newchart = linechart(arr.map(x => {
            let a = x.date
            return a.slice(5, 10);
        }), arr.map(x => x.tem_day), arr.map(x => x.tem_night), '#feb344', '#4cc1f6');
    })
}

function find() {
    let truecity = new Array;
    let n = 0;
    city.forEach(element => {
        if (element.indexOf(input.value) != -1) {
            truecity[n++] = element;
            // console.log(input.value);

        }
    });
    while (explore.children[1]) {
        explore.removeChild(explore.children[1])
    } if (explore.value != "") {
        truecity.forEach(element => {
            var new1 = document.createElement("div");
            new1.style.height = '25px';
            new1.style.paddingTop = '5px';
            new1.style.paddingLeft = '10px';
            new1.style.borderBottom = '1px solid #e2e2e2'
            new1.innerHTML = element;
            new1.addEventListener('click', () => {
                console.log(element);
                get(element)
                explore.style.maxHeight = '0px'
                hourweather(element);
                get7days(element);
            })
            explore.appendChild(new1)
        })
    }
    // console.log(truecity);
};

function get(city) {
    fetch(`https://v0.yiketianqi.com/free/day?appid=59947189&appsecret=JTqbLH7A&unescape=1&city=${city}`, {
        method: 'get',
        // appid: "59947189",
        // appsecret: "JTqbLH7A",
        // ip: current_ip,
        // unescape: 1,
        // city: "重庆"
    }).then(res => {
        return res.json()
    }).then(res => {
        console.log(res);
        local.innerHTML = res.city
        temp1.innerHTML = res.tem + "°"
        temp2.innerHTML = res.wea
        temp3.innerHTML = res.win + res.win_speed
    })
}

function icon(weather) {

    return `./images/day/${weather}.png`
}

function linechart(arr1, arr2, arr3, color1, color2) {

    const data = {
        labels: arr1,
        datasets: [{
            label: '',
            data: arr2,
            fill: false,
            borderColor: color1,
            tension: 0.1,
        }, {
            label: '',
            data: arr3,
            fill: false,
            borderColor: color2,
            tension: 0.1,
        }]
    };

    var options = {
        scales: {
            y: {
                beginAtZero: true,
                display: false,

            },
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },

        },
        title: '',
        plugins: {
            legend: {
                display: false // 去掉图例框
            },
        }
    };

    var chart = new Chart(cts, {
        type: 'line',
        data: data,
        options: options
    });

    return chart
}

const weekDay = function (time) {
    let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
    return datelist[new Date(time).getDay()];
}

fetch("https://v0.yiketianqi.com/free/week?appid=59947189&appsecret=JTqbLH7A&unescape=1", {
    method: 'get',
}).then(res => {
    return res.json()
}).then(res => {
    console.log(res);
    let arr = res.data;
    todaytemp.innerHTML = arr[0].tem_day + '/' + arr[0].tem_night + '°';
    tomorrowtemp.innerHTML = arr[1].tem_day + '/' + arr[1].tem_night + '°';
    todaysun.innerHTML = arr[0].wea;
    tomorrowsun.innerHTML = arr[1].wea;
    daysicon[0].src = icon(arr[0].wea_img);
    daysicon[1].src = icon(arr[1].wea_img);
    if (newchart instanceof Chart) {
        newchart.destroy();
    }
    let n = 0;
    arr.forEach(element => {
        then[n].innerHTML = weekDay(element.date);
        iconimg[n].src = `./images/day/${element.wea_img}.png`;
        liweather[n++].innerHTML = element.wea;
    })
    newchart = linechart(arr.map(x => {
        let a = x.date
        return a.slice(5, 10);
    }), arr.map(x => x.tem_day), arr.map(x => x.tem_night), '#feb344', '#4cc1f6');
})



fetch(`https://v0.yiketianqi.com/free/day?appid=59947189&appsecret=JTqbLH7A&unescape=1`, {
    method: 'get',
}).then(res => {
    return res.json()
}).then(res => {
    console.log(res);
    local.innerHTML = res.city
    temp1.innerHTML = res.tem + "°"
    temp2.innerHTML = res.wea
    temp3.innerHTML = res.win + res.win_speed
})
hourweather(local.innerHTML);

local.addEventListener("click", () => {
    explore.style.maxHeight = '5000px'
})
quit.addEventListener('click', () => {
    explore.style.maxHeight = '0px'
})


const _debounce = debounce(find, 1000);
input.addEventListener("input", () => {
    _debounce();
})

var myDate = new Date();
let current_time = myDate.getHours();

for (let i = 0; i < 24; i++) {
    // console.log(times[0]);             
    times[i].innerHTML = `${current_time % 24}:00`;
    current_time++
}


