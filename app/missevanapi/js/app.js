const fmIdInput = document.getElementById('fm-id');
const generateBtn = document.getElementById('generate-btn');
const btnText = document.getElementById('btn-text');
const loader = document.getElementById('loader');
const statusMessage = document.getElementById('status-message');
const resultsContainer = document.getElementById('results-container');
const lrcOutput = document.getElementById('lrc-output');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');

// --- Event Listeners ---

generateBtn.addEventListener('click', handleGenerate);
copyBtn.addEventListener('click', handleCopy);
downloadBtn.addEventListener('click', handleDownload);
fmIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGenerate();
    }
});


// --- Core Functions ---

/**
 * Main handler to start the generation process.
 */
async function handleGenerate() {
    const fmId = fmIdInput.value.trim();
    if (!fmId) {
        showStatus('请输入有效的 Sound ID。', 'error');
        return;
    }

    // Reset UI and show loader
    setLoading(true);
    resultsContainer.classList.add('hidden');
    hideStatus();

    try {
        // 1. Fetch XML data
        const xmlContent = await getPage(fmId);
        if (!xmlContent) return; // Error handled in getPage

        // 2. Parse XML to a list of danmaku objects
        const danmakuList = getList(xmlContent);

        // 3. Filter out white danmaku
        const filteredDanmaku = filterWhiteDanmaku(danmakuList);

        if (filteredDanmaku.length === 0) {
            showStatus('未找到有色弹幕，无法生成 LRC 文件。', 'warning');
            setLoading(false);
            return;
        }

        // 4. Sort by time and format to LRC lines
        const lrcLines = sortAndFormat(filteredDanmaku);

        // 5. Display results
        const lrcContent = lrcLines.join('\n');
        lrcOutput.value = lrcContent;
        resultsContainer.classList.remove('hidden');
        
    } catch (error) {
        console.error('发生错误:', error);
        showStatus(`处理失败: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Fetches danmaku XML content from Missevan via a CORS proxy.
 * @param {string} fmId - The sound ID.
 * @returns {Promise<string|null>} The XML content as a string, or null on failure.
 */
async function getPage(fmId) {
    // Using a CORS proxy to bypass browser's cross-origin restrictions.
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = `https://www.missevan.com/sound/getdm?soundid=${fmId}`;
    const url = `${proxyUrl}${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`网络请求失败，状态码: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('获取页面内容时出错:', error);
        showStatus('获取弹幕数据失败，请检查 ID 或网络连接。', 'error');
        setLoading(false);
        return null;
    }
}

/**
 * Parses XML danmaku data into a structured array.
 * @param {string} xmlContent - The XML content.
 * @returns {Array<Object>} An array of danmaku objects {time, color, content}.
 */
function getList(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    const danmakuElements = xmlDoc.querySelectorAll('d');
    const danmakuList = [];

    danmakuElements.forEach(d => {
        const pValue = d.getAttribute('p');
        const content = d.textContent;
        if (pValue && content) {
            const pParts = pValue.split(',');
            danmakuList.push({
                time: parseFloat(pParts[0]), // time
                color: pParts[3],          // color
                content: content
            });
        }
    });
    return danmakuList;
}

/**
 * Filters out white danmaku (color code 16777215).
 * @param {Array<Object>} danmakuList - The list of danmaku objects.
 * @returns {Array<Object>} The filtered list.
 */
function filterWhiteDanmaku(danmakuList) {
    const whiteColorCode = '16777215'; // 0xFFFFFF in decimal
    return danmakuList.filter(danmaku => danmaku.color !== whiteColorCode);
}

/**
 * Formats seconds into LRC time format [mm:ss.xx].
 * @param {number} seconds - The time in seconds.
 * @returns {string} The formatted time string.
 */
function formatLrcTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ssxx = remainingSeconds.toFixed(2).padStart(5, '0');
    return `[${mm}:${ssxx}]`;
}

/**
 * Sorts the danmaku list by time and formats each line for LRC.
 * @param {Array<Object>} danmakuList - The list of danmaku objects.
 * @returns {Array<string>} An array of LRC-formatted strings.
 */
function sortAndFormat(danmakuList) {
    // Sort by time ascending
    danmakuList.sort((a, b) => a.time - b.time);
    
    // Format each entry into an LRC line
    return danmakuList.map(danmaku => {
        const timeTag = formatLrcTime(danmaku.time);
        return `${timeTag}${danmaku.content}`;
    });
}

// --- UI Helper Functions ---

/**
 * Toggles the loading state of the generate button.
 * @param {boolean} isLoading - True to show loader, false to show text.
 */
function setLoading(isLoading) {
    if (isLoading) {
        generateBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
    } else {
        generateBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

/**
 * Displays a status message to the user.
 * @param {string} message - The message to display.
 * @param {'error'|'success'|'warning'} type - The type of message for styling.
 */
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'text-white');
    
    let colorClass = 'bg-blue-500'; // default info
    if (type === 'error') colorClass = 'bg-red-500';
    if (type === 'success') colorClass = 'bg-green-500';
    if (type === 'warning') colorClass = 'bg-yellow-500';

    statusMessage.classList.add(colorClass, 'text-white');
}

/**
 * Hides the status message.
 */
function hideStatus() {
    statusMessage.classList.add('hidden');
}

/**
 * Handles copying the LRC content to the clipboard.
 */
function handleCopy() {
    const textToCopy = lrcOutput.value;
    if (!textToCopy) return;

    // A method that works well inside iframes
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showStatus('已成功复制到剪贴板！', 'success');
    } catch (err) {
        showStatus('复制失败，请手动复制。', 'error');
        console.error('复制失败:', err);
    }
    document.body.removeChild(textArea);

    // Revert message after a short delay
    setTimeout(hideStatus, 2000);
}

/**
 * Handles downloading the LRC content as a .lrc file.
 */
function handleDownload() {
    const fmId = fmIdInput.value.trim() || 'danmaku';
    const textToSave = lrcOutput.value;
    if (!textToSave) return;
    
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `danmaku_${fmId}.lrc`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
