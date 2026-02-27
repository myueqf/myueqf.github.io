const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
import('./all.js').then(() => {
    window.addExtraXwX(['list/甜饼贩卖机.txt']);
    document.title = "甜饼贩卖机";
    document.querySelector('h1').innerText = '甜饼贩卖机 | 阿洇の小说站～';
    (async () => {
        await sleep(1000);
        window.addExtraBooks(['list/林泠的大冒险.json']);
    })();
});
