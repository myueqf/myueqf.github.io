document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    /* 每日一图 */
    const finalNumber = window.getSeededRandomNumber(month, day, 210001, 210075);
    const bgUrl = `../img/background/swy/${finalNumber}.webp`;
    document.body.style.backgroundImage = `url(${bgUrl})`;
    const bgImg = document.getElementById('bg');
    bgImg.src = bgUrl;
});