import('./all.js').then(() => {
    window.addExtraXwX(['list/star.txt']);
    document.title = "甜饼贩卖机";
    document.querySelector('h1').innerText = '首页 | 阿洇の小说站～';
    window.addExtraBooks(['list/list.json']);
});
