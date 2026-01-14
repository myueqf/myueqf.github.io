/////////////////////////////////////
// ===== Live2D Daily Switch ===== //
/////////////////////////////////////

(function() {
    const listUrl = "https://corsproxy.io/?https://github.com/myueqf/live2d/releases/download/latest/live2dList.txt";
    const baseUrl = "https://cdn.jsdelivr.net/gh/myueqf/live2d@main/";

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
            const month = now.getMonth() + 1; // getMonth 返回 0-11
            const day = now.getDate();

            const todayIndex = window.getSeededRandomNumber(month, day, 0, modelDirs.length - 1);

            const selectedModel = modelDirs[todayIndex];

            const modelPath = `${baseUrl}${selectedModel}/${selectedModel}.model.json`;
            console.log("今日随机模型索引:", todayIndex, "模型名称:", selectedModel);

            /* 初始化 Live2D */
            OML2D.loadOml2d({
                models: [{
                    path: modelPath
                }],
                mobileDisplay: true,
                dockedPosition: "right",
                menus: { disable: true },
                tips: { disable: true },
                statusBar: { disable: true }
            });
        },
        error: function() {
            console.error("列表加载失败惹。。。回退至默认模型");
                    setTimeout(function () {
                        iziToast.info({
                            timeout: 8000,
                            icon: "fa-solid fa-circle-exclamation",
                            displayMode: 'replace',
                            message: '每日自动切换管家失败XwX'
                        });
                    }, 3800);
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
})();