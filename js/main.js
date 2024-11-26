
//弹窗样式
iziToast.settings({
    timeout: 10000,
    progressBar: false,
    close: false,
    closeOnEscape: true,
    position: 'topCenter',
    transitionIn: 'bounceInDown',
    transitionOut: 'flipOutX',
    displayMode: 'replace',
    layout: '1',
    backgroundColor: '#00000040',
    titleColor: '#efefef',
    messageColor: '#efefef',
    icon: 'Fontawesome',
    iconColor: '#efefef',
});

/* 鼠标样式 */
const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfAlementWidth = element.offsetWidth / 2;
const halfAlementWidth2 = element2.offsetWidth / 2;

function setPosition(x, y) {
    element2.style.transform = `translate(${x - halfAlementWidth2 + 1}px, ${y - halfAlementWidth2 + 1}px)`;
}

body.addEventListener('mousemove', (e) => {
    window.requestAnimationFrame(function () {
        setPosition(e.clientX, e.clientY);
    });
});



//加载完成后执行
window.addEventListener('load', function () {

    //载入动画
    $('#loading-box').attr('class', 'loaded');
    $('#bg').css("cssText", "transform: scale(1);filter: blur(0px);transition: ease 1.5s;");
    $('.cover').css("cssText", "opacity: 1;transition: ease 1.5s;");
    $('#section').css("cssText", "transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important");

    //用户欢迎
    setTimeout(function () {
        iziToast.show({
            timeout: 2500,
            icon: false,
            title: hello,
            message: '(∠・ω< )⌒☆'
        });
    }, 800);

    //延迟加载音乐播放器
    let element = document.createElement("script");
    element.src = "./js/music.js";
    document.body.appendChild(element);

    //中文字体缓加载-此处写入字体源文件 （暂时弃用）
    //先行加载简体中文子集，后续补全字集
    //由于压缩过后的中文字体仍旧过大，可转移至对象存储或 CDN 加载
    // const font = new FontFace(
    //     "MiSans",
    //     "url(" + "./font/MiSans-Regular.woff2" + ")"
    // );
    // document.fonts.add(font);

    //移动端去除鼠标样式
    if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
        $('#g-pointer-2').css("display", "none");
    }

}, false)

setTimeout(function () {
    $('#loading-text').html("一会，再一会就好啦～别急嘛QwQ")
}, 3000);

// 新春灯笼 （ 需要时可取消注释 ）
// new_element=document.createElement("link");
// new_element.setAttribute("rel","stylesheet");
// new_element.setAttribute("type","text/css");
// new_element.setAttribute("href","./css/lantern.css");
// document.body.appendChild(new_element);

// new_element=document.createElement("script");
// new_element.setAttribute("type","text/javascript");
// new_element.setAttribute("src","./js/lantern.js");
// document.body.appendChild(new_element);

//获取一言
//fetch('https://v1.hitokoto.cn?max_length=24')
//    .then(response => response.json())
//    .then(data => {
//        $('#hitokoto_text').html(data.hitokoto)
//        $('#from_text').html(data.from)
//    })
//    .catch(console.error)
//
//let times = 0;
//$('#hitokoto').click(function () {
//    if (times == 0) {
//        times = 1;
//        let index = setInterval(function () {
//            times--;
//            if (times == 0) {
//                clearInterval(index);
//            }
//        }, 1000);
//        fetch('https://v1.hitokoto.cn?max_length=24')
//            .then(response => response.json())
//            .then(data => {
//                $('#hitokoto_text').html(data.hitokoto)
//                $('#from_text').html(data.from)
//            })
//            .catch(console.error)
//    } else {
//        iziToast.show({
//            timeout: 1000,
//            icon: "fa-solid fa-circle-exclamation",
//            message: '你点太快了吧'
//        });
//    }
//});


// 一言～
const hitokotoArray = [
    ["天官赐福", "为你战死，是我至高无上的荣耀。"],
    ["七芒星", "撕开云雾，你就是光"],
    ["撒野", "我会喜欢到你不喜欢我为止"],
    ["全球高考", "世界灿烂盛大，欢迎回家"],
    ["附加遗产", "我说过很多谎，但我爱你是真的"],
    ["一醉经年", "你点到即止，我一醉方休"],
    ["撒野", "希望我们都能像对方一样勇敢"],
    ["AWM绝地求生", "你是我的AWM，你是我的可遇不可求"],
    ["相见欢", "手握山河剑，愿为君司南"],
    ["杀破狼", "经年痴心妄想，一时走火入魔"],
    ["犹记斐然", "待君归来时，共饮长生酒。"],
    ["魔道祖师", "你特别好，我喜欢你。"],
    ["刺青", "希望你永远快乐，任何选择之后都洒脱。"],
    ["穿成万人迷文里的替身", "你救我一命，我还你长生。"],
    ["伪装学渣", "一起去啊，更远的地方。"],
    ["帝王攻略", "江山是我的责任，你才是我的牵挂。"],
    ["判官", "他跪坐其间，吻了红尘。"],
    ["这题超纲了", "喜欢总是轰轰烈烈，想摘星也总是义无反顾。"],
    ["天官赐福", "殿下，风光无限的是你，跌落尘埃的也是你，重点是你，而不是怎样的你。"],
    ["默读", "哄你高兴就是最重要的事情。"],
    ["犹记斐然", "待君归来时，共饮长生酒。"],
    ["魔道祖师", "你特别好，我喜欢你。"],
    ["刺青", "希望你永远快乐，任何选择之后都洒脱。"],
    ["穿成万人迷文里的替身", "你救我一命，我还你长生。"],
    ["伪装学渣", "一起去啊，更远的地方。"],
    ["帝王攻略", "江山是我的责任，你才是我的牵挂。"],
    ["判官", "他跪坐其间，吻了红尘。"],
    ["这题超纲了", "喜欢总是轰轰烈烈，想摘星也总是义无反顾。"],
    ["天官赐福", "殿下，风光无限的是你，跌落尘埃的也是你，重点是你，而不是怎样的你。"],
    ["默读", "哄你高兴就是最重要的事情。"],
    ["天官赐福", "天下无不散之筵席，但我永远不会离开你。"],
    ["天官赐福", "为你灯明三千，为你花开满城，为你所向披靡。"],
    ["我喜欢你的信息素", "人闲车马慢，路遥星亦辞"],
    ["将进酒", "先生授我以诗书，我为先生杀宿仇。"],
    ["将进酒", "红梅覆雪，兰舟笼香，一笑千金值。"],
    ["将进酒", "你坐明堂上，不要沾风雪。"],
    ["将进酒", "今日起，我的兰舟就是天下共主，天下五十六万大军尽归你麾下。名堂高殿你随意出入，我萧策安刀挂前堂，替你镇守八方豪雄。"],
    ["全球高考", "两千三百一十二天，他们在寒风朔雪中，以为是相遇，其实是重逢。"],
    ["默读", "未经允许，擅自特别喜欢你，不好意思了。"],
    ["某某", "十七岁那年，蝉鸣声响，白马梧桐。十七岁少年，轻狂奔跑，仲夏荒原。他们发着光，也流着汗。他们无坚不摧，也无所不能。"],
    ["天官赐福", "上元佳节，神武大街，惊鸿一瞥，百世沦陷。"],
    ["凤于九天", "天下壮丽江山,吾与你共享。世间轰烈快事,吾与你分尝。唯有灾难,吾一人独挡。"],
    ["过门", "天地间羁旅客，离别三十余年，到头来，终有一聚。"],
    ["全球高考", "我不是来救你的，我是来爱你的。"],
    ["破云", "再次相聚之前，谢谢你带我回到这人世间。"],
    ["碎玉投珠", "汉白玉佩珍珠扣，朝夕与共到白头。"],
    ["FOG", "不喜欢的人的心机才是心机，喜欢的人的心机，那叫撒娇。"],
    ["我只喜欢你的人设", "只有玫瑰与你相称。"],
    ["撒野", "满怀希望就会所向披靡。"],
    ["天官赐福", "我有一个心爱之人还在这世上，我想保护他，我愿永不安息。"],
    ["天官赐福", "若无所谓畏惧，便无所谓勇敢。"],
    ["这题超纲了", "强扭的瓜，不试试怎么知道甜不甜。"],
    ["我喜欢你的信息素", "如果你有喜欢的人，或者暗恋的人，他很优秀，优秀到常人难以企及的地步。那就好好高考，走到他的未来去。"],
    ["我喜欢你的信息素", "见过你之后，风花雪月都黯淡无光。"],
    ["碎玉投珠", "一盏月亮，一花糕，一地玫瑰，换印章。"],
    ["天官赐福", "我愿供灯千盏，照彻长夜，即便飞蛾扑火，也在所不辞。"],
    ["提灯看刺刀", "我看到他的第一眼，就喜欢的连自己叫什么都忘了。"],
    ["尖锐沉默", "我永远向你承诺，在这斗争岁月里，只有吻你的时候，我才会低头。"],
    ["君有疾否", "一愿社稷昌，二愿黎民安，三愿我所爱无忧无患，岁岁长安"],
    ["白日事故", "他来时风尘仆仆，停时依旧是光。而他朝他一笑，梦都在晃。"]
];

// 获取随机内容的函数
function getRandomHitokoto() {
    const randomIndex = Math.floor(Math.random() * hitokotoArray.length);
    return hitokotoArray[randomIndex];
}

// 初始化第一个文本
const initialHitokoto = getRandomHitokoto();
$('#hitokoto_text').html(initialHitokoto[1]);
$('#from_text').html(initialHitokoto[0]);

let times = 0;
$('#hitokoto').click(function () {
    if (times === 0) {
        times = 1;
        let index = setInterval(function () {
            times--;
            if (times === 0) {
                clearInterval(index);
            }
        }, 1000);
        
        // 获取新的一言
        const newHitokoto = getRandomHitokoto();
        $('#hitokoto_text').html(newHitokoto[1]);
        $('#from_text').html(newHitokoto[0]);
        
    } else {
        iziToast.show({
            timeout: 1000,
            icon: "fa-solid fa-circle-exclamation",
            message: '别点这么快嘛QAQ'
        });
    }
});




//获取天气
//请前往 https://www.mxnzp.com/doc/list 申请 app_id 和 app_secret
//请前往 https://dev.qweather.com/ 申请 key
//const add_id = "wrknltonr0foslhs"; // app_id
//const app_secret = "Nlh1c0F6d0ZDU2pDR0J3YVBVbkhudz09"; // app_secret
//const key = "433f0c48615a48dfaf2f2b2444297e79" // key
//function getWeather() {
//    fetch("https://www.mxnzp.com/api/ip/self?app_id=" + add_id + "&app_secret=" + app_secret)
//        .then(response => response.json())
//        .then(data => {
//            let str = data.data.city
//            let city = str.replace(/市/g, '')
//            $('#city_text').html(city);
//            fetch("https://geoapi.qweather.com/v2/city/lookup?location=" + city + "&number=1&key=" + key)
//                .then(response => response.json())
//                .then(location => {
//                    let id = location.location[0].id
//                    fetch("https://devapi.qweather.com/v7/weather/now?location=" + id + "&key=" + key)
//                        .then(response => response.json())
//                        .then(weather => {
//                            $('#wea_text').html(weather.now.text)
//                            $('#tem_text').html(weather.now.temp + "°C&nbsp;")
//                            $('#win_text').html(weather.now.windDir)
//                            $('#win_speed').html(weather.now.windScale + "级")
//                        })
//                })
//        })
//        .catch(console.error);
//}
//
//getWeather();
//
//let wea = 0;
//$('#upWeather').click(function () {
//    if (wea == 0) {
//        wea = 1;
//        let index = setInterval(function () {
//            wea--;
//            if (wea == 0) {
//                clearInterval(index);
//            }
//        }, 60000);
//        getWeather();
//        iziToast.show({
//            timeout: 2000,
//            icon: "fa-solid fa-cloud-sun",
//            message: '实时天气已更新'
//        });
//    } else {
//        iziToast.show({
//            timeout: 1000,
//            icon: "fa-solid fa-circle-exclamation",
//            message: '请稍后再更新哦'
//        });
//    }
//});

//获取时间
let t = null;
t = setTimeout(time, 1000);

function time() {
    clearTimeout(t);
    dt = new Date();
    let y = dt.getYear() + 1900;
    let mm = dt.getMonth() + 1;
    let d = dt.getDate();
    let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let day = dt.getDay();
    let h = dt.getHours();
    let m = dt.getMinutes();
    let s = dt.getSeconds();
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    $("#time").html(y + "&nbsp;年&nbsp;" + mm + "&nbsp;月&nbsp;" + d + "&nbsp;日&nbsp;" + "<span class='weekday'>" + weekday[day] + "</span><br>" + "<span class='time-text'>" + h + ":" + m + ":" + s + "</span>");
    t = setTimeout(time, 1000);
}

//链接提示文字
$("#social").mouseover(function () {
    $("#social").css({
        "background": "rgb(0 0 0 / 25%)",
        'border-radius': '6px',
        "backdrop-filter": "blur(5px)"
    });
    $("#link-text").css({
        "display": "block",
    });
}).mouseout(function () {
    $("#social").css({
        "background": "none",
        "border-radius": "6px",
        "backdrop-filter": "none"
    });
    $("#link-text").css({
        "display": "none"
    });
});

$("#github").mouseover(function () {
    $("#link-text").html("去 Github 康康噢～");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#qq").mouseover(function () {
    $("#link-text").html("有什么事嘛？");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#email").mouseover(function () {
    $("#link-text").html("来封 Email");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#bilibili").mouseover(function () {
    $("#link-text").html("来 B 站看看 ~");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});
$("#telegram").mouseover(function () {
    $("#link-text").html("你懂的 ~");
}).mouseout(function () {
    $("#link-text").html("通过这里联系我");
});

//自动变灰
//let myDate = new Date;
//let mon = myDate.getMonth() + 1;
//let date = myDate.getDate();
//let days = ['4.4', '5.12', '7.7', '9.9', '9.18', '12.13'];
//for (let day of days) {
//    let d = day.split('.');
//    if (mon == d[0] && date == d[1]) {
//        document.write(
//            '<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}</style>'
//        );
//        $("#change").html("Silence&nbsp;in&nbsp;silence");
//        $("#change1").html("今天是中国国家纪念日，全站已切换为黑白模式");
//        window.addEventListener('load', function () {
//            setTimeout(function () {
//                iziToast.show({
//                    timeout: 14000,
//                    icon: "fa-solid fa-clock",
//                    message: '今天是中国国家纪念日'
//                });
//            }, 3800);
//        }, false);
//    }
//}

//更多页面切换
let shoemore = false;
$('#switchmore').on('click', function () {
    shoemore = !shoemore;
    if (shoemore && $(document).width() >= 990) {
        $('#container').attr('class', 'container mores');
        $("#change").html("Oops&nbsp;!");
        $("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
    } else {
        $('#container').attr('class', 'container');
        $("#change").html("Hello&nbsp;World&nbsp;!");
        $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");
    }
});

//更多页面关闭按钮
$('#close').on('click', function () {
    $('#switchmore').click();
});

//移动端菜单栏切换
let switchmenu = false;
$('#switchmenu').on('click', function () {
    switchmenu = !switchmenu;
    if (switchmenu) {
        $('#row').attr('class', 'row menus');
        $("#menu").html("<i class='fa-solid fa-xmark'></i>");
    } else {
        $('#row').attr('class', 'row');
        $("#menu").html("<i class='fa-solid fa-bars'></i>");
    }
});

//更多弹窗页面
$('#openmore').on('click', function () {
    $('#box').css("display", "block");
    $('#row').css("display", "none");
    $('#more').css("cssText", "display:none !important");
});
$('#closemore').on('click', function () {
    $('#box').css("display", "none");
    $('#row').css("display", "flex");
    $('#more').css("display", "flex");
});

//监听网页宽度
window.addEventListener('load', function () {
    window.addEventListener('resize', function () {
        //关闭移动端样式
        if (window.innerWidth >= 600) {
            $('#row').attr('class', 'row');
            $("#menu").html("<i class='fa-solid fa-bars'></i>");
            //移除移动端切换功能区
            $('#rightone').attr('class', 'row rightone');
        }

        if (window.innerWidth <= 990) {
            //移动端隐藏更多页面
            $('#container').attr('class', 'container');
            $("#change").html("Hello&nbsp;World&nbsp;!");
            $("#change1").html("一个建立于 21 世纪的小站，存活于互联网的边缘");

            //移动端隐藏弹窗页面
            $('#box').css("display", "none");
            $('#row').css("display", "flex");
            $('#more').css("display", "flex");
        }
    })
})

//移动端切换功能区
let changemore = false;
$('#changemore').on('click', function () {
    changemore = !changemore;
    if (changemore) {
        $('#rightone').attr('class', 'row menus mobile');
    } else {
        $('#rightone').attr('class', 'row menus');
    }
});

//更多页面显示关闭按钮
$("#more").hover(function () {
    $('#close').css("display", "block");
}, function () {
    $('#close').css("display", "none");
})

//屏蔽右键
document.oncontextmenu = function () {
    iziToast.show({
        timeout: 2000,
        icon: "fa-solid fa-circle-exclamation",
        message: '右键被猫猫叼走了啦～'
    });
    return false;
}

//控制台输出
//console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
let styleTitle2 = `
font-size:12px;
color: rgb(244,167,89);
`
let styleContent = `
color: rgb(30,152,255);
`
let title1 = '真的有人会注意到这一行字嘛？'
let title2 = `
#
`
let content = `
#
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)
