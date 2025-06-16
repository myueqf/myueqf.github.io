//////////////////////////////
// ===== seededRandom ===== //
//////////////////////////////
(function() {
    const a = 1664525;
    const c = 1013904223;
    const m = 4294967296;
    /**
     * @param {number} month - 月份 (1-12)
     * @param {number} day - 日期 (1-31)
     * @param {number} min - 范围最小值 (包含)
     * @param {number} max - 范围最大值 (包含)
     * @returns {number} 在 [min, max] 范围内的整数
     */
    window.getSeededRandomNumber = function(month, day, min, max) {
        // 组合种子～
        let seed = (month * 100 * day) + 223921;

        // 生成下一个随机数
        seed = (a * seed + c) % m;

        // 把种子归一化到0-1
        const randomValue0to1 = seed / m;

        // 让结果在 [min, max] 之间～
        let finalNumber = Math.round(randomValue0to1 * (max - min)) + min;
        finalNumber = Math.max(min, Math.min(max, finalNumber));

        return finalNumber;
    };
})();