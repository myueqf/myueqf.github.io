// 定义多个弹窗内容
const messages = [
    "：真，真的吗 ᵒ̴̶̷̥́ㅂᵒ̴̶̷̣̥̀",
    "：师尊没有骗我，对吗？",
    "：没有在随随便便答应对吗",
    "：师尊真的想好了吗",
    "：如果和我在一起的话，一辈子也不能离开我..."
];

// 用于存储原始文本内容
let originalQuestionText;
let originalYesButtonText;
let originalNoButtonText;

// 点击拒绝按钮的次数
let rejectClickCount = 0;
// 标记是否点击过拒绝按钮
let hasRejected = false;

// 确认按钮点击事件
function handleYesClick() {
    if (rejectClickCount >= 3) {
        alert("师尊是在逗我玩吗🥺🥺");
        // 重置拒绝次数
        rejectClickCount = 0;
        return;
    }
    let index = 0;

    function showNextMessage() {
        if (index < messages.length) {
            alert(messages[index]);
            index++;
            setTimeout(showNextMessage, 500);
        } else {
            if (hasRejected) {
                showFinalAlert();
            } else {
                showNewLastConfirmAlert();
            }
        }
    }
    showNextMessage();
}

function handleRejectClick() {
    rejectClickCount++;
    hasRejected = true;
    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');

    // 显示心碎值+1弹窗
    const heartbreakAlert = document.createElement('div');
    heartbreakAlert.id = 'tempAlert';
    heartbreakAlert.textContent = '心碎值+1';
    document.body.appendChild(heartbreakAlert);
    setTimeout(() => {
        document.body.removeChild(heartbreakAlert);
    }, 1000);

    // 切换图片
    const romanticImage = document.getElementById('romanticImage');
    if (rejectClickCount === 8) {
        romanticImage.src = "images/师尊我爆辣.png";
    } else {
        romanticImage.src = "images/情绪不好.png";
    }

    switch (rejectClickCount) {
        case 1:
            noButton.innerText = '我是直男';
            break;
        case 2:
            noButton.innerText = '...';
            yesButton.innerText = '真的不可以吗';
            // 弹出主能源切断权限弹窗
            const mainPowerAlert = document.createElement('div');
            mainPowerAlert.id ='mainPowerAlert';
            mainPowerAlert.textContent = '主能源切断了权限，贵方暂时无法说话噢';
            document.body.appendChild(mainPowerAlert);
            setTimeout(() => {
                document.body.removeChild(mainPowerAlert);
            }, 2000);
            break;
        case 3:
            noButton.innerText = '🥺';
            break;
        case 4:
            noButton.innerText = '不要选';
            break;
        case 5:
            noButton.innerText = '好吧';
            break;
        case 6:
            noButton.innerText = '真的吗';
            break;
        case 7:
            noButton.innerText = '选项禁止';
            break;
        case 8:
            showEightRejectAlert();
            break;
    }

    // 让拒绝按钮随机移位
    const bodyRect = document.body.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    const maxX = bodyRect.width - buttonRect.width;
    const maxY = bodyRect.height - buttonRect.height;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    noButton.style.position = 'absolute';
    noButton.style.left = randomX + 'px';
    noButton.style.top = randomY + 'px';
}

function showEightRejectAlert() {
    const eightRejectAlert = document.createElement('div');
    eightRejectAlert.id = 'eightRejectAlert';
    eightRejectAlert.textContent = '师尊，我不会放手的^^';
    document.body.appendChild(eightRejectAlert);
    setTimeout(() => {
        document.body.removeChild(eightRejectAlert);
        showFinalAlert();
    }, 2000);
}

function showFinalAlert() {
    const finalAlert = document.createElement('div');
    finalAlert.id = 'finalAlert';
    finalAlert.innerHTML = `
        <p>永远在一起</p>
        <button onclick="closeFinalAlertAndShowLastConfirm()">确认</button>
    `;
    document.body.appendChild(finalAlert);
    // 修改背景颜色为红色
    document.body.style.backgroundColor ='red';

    // 存储原始文本内容
    const question = document.getElementById('question');
    const yesButton = document.getElementById('yes');
    const noButton = document.getElementById('no');
    originalQuestionText = question.textContent;
    originalYesButtonText = yesButton.textContent;
    originalNoButtonText = noButton.textContent;

    // 将其他元素的文本内容替换为乱码
    question.textContent = generateRandomChars(originalQuestionText.length);
    yesButton.textContent = generateRandomChars(originalYesButtonText.length);
    noButton.textContent = generateRandomChars(originalNoButtonText.length);
}

function closeFinalAlertAndShowLastConfirm() {
    const finalAlert = document.getElementById('finalAlert');
    if (finalAlert) {
        document.body.removeChild(finalAlert);
        // 不恢复背景颜色和文本，保持当前状态
        // 显示新的确认弹窗
        showLastConfirmAlert();
    }
}

function showLastConfirmAlert() {
    const lastConfirmAlert = document.createElement('div');
    lastConfirmAlert.id = 'lastConfirmAlert';
    lastConfirmAlert.innerHTML = `
        <p>师尊，我会来找你的</p>
        <button onclick="closeLastConfirmAlert()">确认</button>
    `;
    document.body.appendChild(lastConfirmAlert);
}

function showNewLastConfirmAlert() {
    const lastConfirmAlert = document.createElement('div');
    lastConfirmAlert.id = 'lastConfirmAlert';
    lastConfirmAlert.innerHTML = `
        <p>记得定期检查冰箱里食物的生产日期，师尊，我会来找你的</p>
        <button onclick="closeNewLastConfirmAlert()">确认</button>
    `;
    document.body.appendChild(lastConfirmAlert);
}

function closeLastConfirmAlert() {
    const lastConfirmAlert = document.getElementById('lastConfirmAlert');
    if (lastConfirmAlert) {
        document.body.removeChild(lastConfirmAlert);
        // 结局 2：点击拒绝后续在点击确认
        // 播放门铃音效
        const doorbellSound = document.getElementById('doorbellSound');
        doorbellSound.play();

        // 在背景排满白色的开门字体
        const bodyRect = document.body.getBoundingClientRect();
        const fontSize = 20;
        const spacing = 50;

        for (let x = 0; x < bodyRect.width; x += spacing) {
            for (let y = 0; y < bodyRect.height; y += spacing) {
                const openDoorText = document.createElement('div');
                openDoorText.classList.add('open-door-text');
                openDoorText.textContent = '开门';
                openDoorText.style.left = x + 'px';
                openDoorText.style.top = y + 'px';
                document.body.appendChild(openDoorText);
            }
        }
    }
}

function closeNewLastConfirmAlert() {
    const lastConfirmAlert = document.getElementById('lastConfirmAlert');
    if (lastConfirmAlert) {
        document.body.removeChild(lastConfirmAlert);
        // 结局 1：直接点击确认
        // 移除背景选项
        const question = document.getElementById('question');
        const buttons = document.getElementById('buttons');
        if (question) {
            question.style.display = 'none';
        }
        if (buttons) {
            buttons.style.display = 'none';
        }

        // 显示爱心
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '💖';
        document.body.appendChild(heart);
    }
}

function generateRandomChars(length) {
    let result = '';
    const characters = '!@#$%^&*()_+-=[]{}|;:\",./<>?';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
