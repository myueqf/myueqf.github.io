// 背景图片 Cookies
function setBgImg(bg_img) {
    if (bg_img) {
        Cookies.set('bg_img', bg_img, {
            expires: 36500
        });
        return true;
    }
    return false;
};

// 获取背景图片 Cookies
function getBgImg() {
    let bg_img_local = Cookies.get('bg_img');
    if (bg_img_local && bg_img_local !== "{}") {
        return JSON.parse(bg_img_local);
    } else {
        setBgImg(bg_img_preinstall);
        return bg_img_preinstall;
    }
}

let bg_img_preinstall = {
    "type": "1", // 1:默认背景 2:每日一图 3:扩展图集0 4:扩展图集1
    "2": "#", // 每日一图
    "3": "#", // 扩展图集0
    "4": "#"  // 扩展图集1
};

// 更改背景图片
function setBgImgInit() {
    let bg_img = getBgImg();
    $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();

    switch (bg_img["type"]) {
        case "1":
            $('#bg').attr('src', `./img/background/${1 + ~~(Math.random() * 11)}.png`) //随机默认壁纸
            break;
        case "2":
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const finalNumber = window.getSeededRandomNumber(month, day, 1, 23);
            $('#bg').attr('src', `./img/background/2/${finalNumber}.jpg`); // 每日一图
            console.log(`Case 2: Daily image. Date: ${year}-${month}-${day}, Image number: ${finalNumber}`);
            break;
        case "3":
            $('#bg').attr('src', `./img/background/0/${1 + ~~(Math.random() * 6)}.jpg`); // 扩展图集0
            break;
        case "4":
            $('#bg').attr('src', `./img/background/1/${1 + ~~(Math.random() * 10)}.jpg`); // 扩展图集1
            break;
    }
};

$(document).ready(function () {
    // 壁纸数据加载
    setBgImgInit();
    // 设置背景图片
    $("#wallpaper").on("click", ".set-wallpaper", function () {
        let type = $(this).val();
        let bg_img = getBgImg();
        bg_img["type"] = type;
        iziToast.show({
            icon: "fa-solid fa-image",
            timeout: 2500,
            message: '壁纸设置成功，刷新后生效',
        });
        setBgImg(bg_img);
    });
});