document.addEventListener('DOMContentLoaded', () => {
    const bookListContainer = document.getElementById('bookList');
    const jsonUrls = [];

    let extraList = [];
    let extraListMode = null; // null=无过滤, 'whitelist'=白名单, '0'=黑名单移末尾, '1'=黑名单直接移除
    let currentBooks = [];

    /**
     * @param {string[]} urls - JSON 文件路径数组
     */
    window.addExtraBooks = (urls) => {
        const fetchPromises = urls.map(url =>
            fetch(url).then(response => response.json())
        );

        return Promise.all(fetchPromises)
            .then(results => {
                const books = results.flat().filter(book => {return book.url && !book.url.endsWith('123.txt')});
                // 追加新书籍，根据 URL 去重
                const existingUrls = new Set(currentBooks.map(b => b.url));
                const newBooks = books.filter(b => !existingUrls.has(b.url));
                currentBooks = [...currentBooks, ...newBooks];
                applyFilterAndRender();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    /**
     * @param {string[]} urls - 黑名单路径
     * @param {string} [mode] - '0' 黑名单移末尾, '1' 黑名单直接移除, 不传则为白名单
     */
    window.addExtraXwX = (urls, mode) => {
        const fetchPromises = urls.map(url =>
            fetch(url)
                .then(response => response.text())
                .then(text => {
                    return text.split('\n').map(line => line.trim()).filter(line => line);
                })
                .catch(() => [])
        );

        return Promise.all(fetchPromises)
            .then(results => {
                extraList = results.flat();

                if (mode === '0') {
                    extraListMode = '0';
                } else if (mode === '1') {
                    extraListMode = '1';
                } else {
                    extraListMode = 'whitelist';
                }

                applyFilterAndRender();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const applyFilterAndRender = () => {
        if (!currentBooks || currentBooks.length === 0) return;

        let filteredBooks = [...currentBooks];

        if (extraListMode === 'whitelist') {
            // 只显示白名单内的
            filteredBooks = currentBooks.filter(book => {
                return extraList.some(entry =>
                    entry === book.name || entry === book.author
                );
            });
        } else if (extraListMode === '0') {
            // 移到末尾
            const blacklisted = [];
            const whitelisted = [];

            currentBooks.forEach(book => {
                if (extraList.some(entry =>
                    entry === book.name || entry === book.author
                )) {
                    blacklisted.push(book);
                } else {
                    whitelisted.push(book);
                }
            });

            filteredBooks = [...whitelisted, ...blacklisted];
        } else if (extraListMode === '1') {
            // 直接移除
            filteredBooks = currentBooks.filter(book => {
                return !extraList.some(entry =>
                    entry === book.name || entry === book.author
                );
            });
        }

        renderBooks(filteredBooks);
    };

    const renderBooks = (books) => {
        if (!books || books.length === 0) return;
        console.log(`📚：${books.length}`);
        bookListContainer.innerHTML = '';

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            const bookName = document.createElement('h2');
            bookName.textContent = book.name;

            const bookAuthor = document.createElement('p');
            bookAuthor.classList.add('author');
            bookAuthor.textContent = `作者：${book.author}`;

            const bookOverview = document.createElement('p');
            bookOverview.classList.add('overview');
            bookOverview.textContent = book.overview;

            const downloadLink = document.createElement('a');
            downloadLink.href = book.url;
            //downloadLink.textContent = '下载';

            if (book.url && book.url.startsWith('?')) {
                downloadLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = book.url;
                });
                downloadLink.textContent = '-->';
            } else {
                downloadLink.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>`;
                downloadLink.download = `${book.name} 作者：${book.author}.txt`;

                // 如果有patch字段，添加patch选择功能
                if (book.patch) {
                    downloadLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        showPatchDialog(book);
                    });
                }
            }

            bookItem.appendChild(bookName);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookOverview);
            bookItem.appendChild(downloadLink);

            bookListContainer.appendChild(bookItem);
        });
    };

    // --- 初始化加载 ---
    window.addExtraBooks(jsonUrls).then(() => {
        if (bookListContainer.children.length === 0) {
            bookListContainer.innerHTML = '<p class="loading-message">内容消失了。。猫猫哭哭QAQ</p>';
        }
    });

    /**
     * 显示patch选择对话框
     * @param {Object} book - 书籍对象
     */
    function showPatchDialog(book) {
        const dialog = document.createElement('div');
        dialog.className = 'patch-dialog-overlay';
        dialog.innerHTML = `
            <div class="patch-dialog">
                <h3>下载选项 - ${book.name}</h3>
                <p class="patch-info">${book.patch_info || '这本小说似乎包含补丁。。?'}</p>
                <div class="patch-options">
                    <button class="patch-option-btn original-btn">下载原版</button>
                    <button class="patch-option-btn patched-btn">${book.patch_name}</button>
                    <button class="patch-option-btn cancel-btn">取消</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 事件处理
        const originalBtn = dialog.querySelector('.original-btn');
        const patchedBtn = dialog.querySelector('.patched-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');

        originalBtn.addEventListener('click', () => {
            downloadOriginal(book);
            dialog.remove();
        });

        patchedBtn.addEventListener('click', async () => {
            patchedBtn.disabled = true;
            patchedBtn.textContent = '应用补丁中...';

            try {
                await downloadPatched(book);
            } catch (error) {
                console.error('应用补丁失败:', error);
                alert('应用补丁失败');
            } finally {
                patchedBtn.disabled = false;
                dialog.remove();
            }
        });

        cancelBtn.addEventListener('click', () => {
            dialog.remove();
        });

        // 点击背景关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    /**
     * 下载原版
     * @param {Object} book - 书籍对象
     */
    function downloadOriginal(book) {
        const a = document.createElement('a');
        a.href = book.url;
        a.download = `${book.name} 作者：${book.author}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    }

    /**
     * 下载补丁版
     * @param {Object} book - 书籍对象
     */
    async function downloadPatched(book) {
        // 加载diff库
        const diffModule = await loadDiffModule();

        // 获取原始内容
        const originalResponse = await fetch(book.url);
        const originalText = await originalResponse.text();

        // 获取补丁内容
        const patchResponse = await fetch(book.patch);
        const patchText = await patchResponse.text();

        // 解析并应用补丁
        const patches = diffModule.parsePatch(patchText);
        const patchedText = diffModule.applyPatch(originalText, patches);

        if (patchedText === false) {
            throw new Error('应用补丁失败');
        }

        // 创建并下载文件
        const blob = new Blob([patchedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `「${book.patch_name}」${book.name} 作者：${book.author}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * 加载diff模块
     */
    async function loadDiffModule() {
        // 如果已经加载，直接返回
        if (window.Diff && window.Diff.applyPatch) {
            return window.Diff;
        }

        // 否则动态加载diff.js
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/diff.js';
            script.onload = () => {
                // diff.js通过UMD暴露到全局
                if (typeof window.Diff !== 'undefined') {
                    resolve(window.Diff);
                } else {
                    reject(new Error('diff.js加载失败，未找到Diff对象'));
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
});