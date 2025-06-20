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
                downloadLink.textContent = '下载';
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
