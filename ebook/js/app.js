document.addEventListener('DOMContentLoaded', () => {
    const bookListContainer = document.getElementById('bookList');
    const jsonUrls = [
        'js/booklist.json',
        'js/booklist1.json'
    ];

    const fetchPromises = jsonUrls.map(url =>
        fetch(url).then(response => response.json())
    );

    Promise.all(fetchPromises)
        .then(results => {
            const books = results.flat();
            // 清空加载消息
            bookListContainer.innerHTML = '';

            if (books.length === 0) {
                bookListContainer.innerHTML = '<p class="loading-message">没有找到书籍。。猫猫哭哭QAQ</p>';
                return;
            }

            // 遍历书籍列表并创建HTML元素
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
                downloadLink.download = `${book.name} 作者：${book.author}.txt`; // 设置下载文件名

                bookItem.appendChild(bookName);
                bookItem.appendChild(bookAuthor);
                bookItem.appendChild(bookOverview);
                bookItem.appendChild(downloadLink);

                bookListContainer.appendChild(bookItem);
            });
        })
        .catch(error => {
            console.error('Error loading the book list:', error);
            bookListContainer.innerHTML = '<p class="loading-message" style="color: red;">内容被猫猫叼走啦。。。</p>';
        });
});
