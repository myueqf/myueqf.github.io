document.addEventListener('DOMContentLoaded', () => {
    const bookListContainer = document.getElementById('bookList');
    const jsonUrls = [
        'js/booklist.json',
        'js/booklist1.json'
    ];

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
                renderBooks(books);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const renderBooks = (books) => {
        if (!books || books.length === 0) return;
        const loadingMsg = bookListContainer.querySelector('.loading-message');
        if (loadingMsg) {
            bookListContainer.innerHTML = '';
        }

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
            downloadLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>`;
            downloadLink.download = `${book.name} 作者：${book.author}.txt`;

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
});