//////////////////////////////
// ===== displayLunar ===== //
//////////////////////////////

 /**
 * 子时：23:00 - 0:59
 * 丑时：1:00 - 2:59
 * 寅时：3:00 - 4:59
 * 卯时：5:00 - 6:59
 * 辰时：7:00 - 8:59
 * 巳时：9:00 - 10:59
 * 午时：11:00 - 12:59
 * 未时：13:00 - 14:59
 * 申时：15:00 - 16:59
 * 酉时：17:00 - 18:59
 * 戌时：19:00 - 20:59
 * 亥时：21:00 - 22:59
 */

function getShiChen() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 定义时辰映射表，包含时辰名称和其对应的起始小时（左闭右开区间）
    const shiChenMap = [
        { name: '子时', start: 23, end: 1 },  // 23:00 - 0:59
        { name: '丑时', start: 1, end: 3 },  // 1:00 - 2:59
        { name: '寅时', start: 3, end: 5 },
        { name: '卯时', start: 5, end: 7 },
        { name: '辰时', start: 7, end: 9 },
        { name: '巳时', start: 9, end: 11 },
        { name: '午时', start: 11, end: 13 },
        { name: '未时', start: 13, end: 15 },
        { name: '申时', start: 15, end: 17 },
        { name: '酉时', start: 17, end: 19 },
        { name: '戌时', start: 19, end: 21 },
        { name: '亥时', start: 21, end: 23 }
    ];

    let currentShiChen = '';
    let offsetMinutes = 0;

    for (const sc of shiChenMap) {
        if (sc.name === '子时') {
            // 子时特殊的处理：23:00～23:59 (是昨天的子时)，0:00-0:59 (是今天的子时)
            if (hour === 23) {
                currentShiChen = sc.name;
                offsetMinutes = minute; // 23:00 - 23:59
                break;
            } else if (hour === 0) {
                currentShiChen = sc.name;
                offsetMinutes = 60 + minute; // 0:00 - 0:59
                break;
            }
        } else if (hour >= sc.start && hour < sc.end) {
            currentShiChen = sc.name;
            offsetMinutes = (hour - sc.start) * 60 + minute;
            break;
        }
    }

    let detail = '';
    if (currentShiChen) {
        if (offsetMinutes < 40) {
            detail = '初';
        } else if (offsetMinutes < 80) {
            detail = '半';
        } else {
            detail = '末';
        }
    }

    return currentShiChen + detail;
}


document.addEventListener('DOMContentLoaded', function() {
    const date = Lunar.fromDate(new Date());
    document.getElementById('lunar_month_text').textContent = date.getMonthInChinese();
    document.getElementById('lunar_day_text').textContent = date.getDayInChinese();

    const shiChenElement = document.getElementById('shi_chen_text');
    shiChenElement.textContent = getShiChen();

    setInterval(function() {
        shiChenElement.textContent = getShiChen();
    }, 60 * 1000);
});