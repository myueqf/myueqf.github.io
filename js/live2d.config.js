// 初始化Live2D模型
OML2D.loadOml2d({
  models: [{
    path: "js/live2d/models/100007_fotiaoqiang/100007_fotiaoqiang.model.json"
  }],
  mobileDisplay: true,  // 允许在手机端显示
  dockedPosition: "right", // 靠右显示
  menus: { disable: true },
  tips: { disable: true },
  statusBar: { disable: true }
});
