/////////////////////////////////////
// ===== Live2D Daily Switch ===== //
/////////////////////////////////////

/* 设置 Live2D Cookies */
function setLive2D(type) {
    if (type) {
        Cookies.set('live2d_type', JSON.stringify({ "type": type }), {
            expires: 36500
        });
        return true;
    }
    return false;
}

/* 获取 Live2D Cookies */
function getLive2D() {
    let live2d_local = Cookies.get('live2d_type');
    if (live2d_local && live2d_local !== "{}") {
        return JSON.parse(live2d_local);
    } else {
        const default_cfg = { "type": "1" };
        setLive2D(default_cfg.type);
        return default_cfg;
    }
}

/* 初始化 Live2D */
function initLive2D() {
    const config = getLive2D();
    const type = config.type;

    /* 同步 UI 状态 */
    $(`input[name='live2d-type'][value='${type}']`).prop('checked', true);

    let listUrl = "";
    if (type === "2") {
        listUrl = "https://corsproxy.io/?https://github.com/myueqf/live2d/releases/download/latest/live2dList.txt";
    } else {
        listUrl = "https://cdn.jsdelivr.net/gh/myueqf/live2d@main/starList.txt";
    }
    const baseUrl = "https://cdn.jsdelivr.net/gh/myueqf/live2d@main/";

    /* 请求数据并加载模型 */
    $.ajax({
        url: listUrl,
        type: "GET",
        dataType: "text",
        success: function(data) {
            const modelDirs = data.split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line && !line.endsWith('.md') && !line.endsWith('.txt'));

            if (modelDirs.length === 0) return;

            /* 获取日期 */
            const now = new Date();
            const month = now.getMonth() + 1;
            const day = now.getDate();

            const todayIndex = window.getSeededRandomNumber(month, day, 0, modelDirs.length - 1);
            const selectedModel = modelDirs[todayIndex];
            const modelPath = `${baseUrl}${selectedModel}/${selectedModel}.model.json`;


            OML2D.loadOml2d({
                models: [{ path: modelPath }],
                mobileDisplay: true,
                dockedPosition: "right",
                menus: { disable: true },
                tips: { disable: true },
                statusBar: { disable: true }
            });
        },
        error: function() {
            console.error("列表加载失败：执行回退");
            OML2D.loadOml2d({
                models: [{ path: baseUrl + "100007_fotiaoqiang/100007_fotiaoqiang.model.json" }],
                mobileDisplay: true,
                dockedPosition: "right",
                menus: { disable: true },
                tips: { disable: true },
                statusBar: { disable: true }
            });
        }
    });
}

/* 页面加载完成后的事件绑定 */
$(document).ready(function () {
    /* 执行加载逻辑 */
    initLive2D();

    /* 监听点击切换 */
    $("#live2d-options").on("click", ".set-live2d", function () {
        let type = $(this).val(); // 获取当前点击的 radio 的值
        setLive2D(type);

        iziToast.show({
            icon: "fa-solid fa-wand-magic-sparkles",
            timeout: 2500,
            message: '配置已更改，刷新后生效～',
        });
    });
});