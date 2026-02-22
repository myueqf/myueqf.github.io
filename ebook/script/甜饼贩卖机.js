import('./all.js').then(() => {
    window.addExtraXwX(['list/甜饼贩卖机.txt']);
    document.title = "甜饼贩卖机";
    document.querySelector('h1').innerText = '甜饼贩卖机 | 阿洇の小说站～';
    window.addExtraBooks(['list/list.json']);
});
