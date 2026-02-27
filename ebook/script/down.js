(async function() {
    const zip = new JSZip();
    const bookItems = document.querySelectorAll('#bookList .book-item');

    console.log(`📦 ${bookItems.length}`);

    for (let i = 0; i < bookItems.length; i++) {
        const item = bookItems[i];
        const name = item.querySelector('h2').textContent.trim();
        const author = item.querySelector('.author').textContent.replace('作者：', '').trim();
        const url = item.querySelector('a').href;

        try {
            if (url.startsWith('javascript:') || url.includes('?')) continue;

            const response = await fetch(url);
            const blob = await response.blob();
            zip.file(`${name} - ${author}.txt`, blob);
            console.log(`✅：${name}`);
        } catch (err) {
            console.error(`失败：${name}`);
        }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `书籍合集_${new Date().getTime()}.zip`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    alert('🎉 打包下载完成！');
})();