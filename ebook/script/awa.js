(function() {
    const nameElements = document.querySelectorAll('#bookList .book-item h2');
    const names = Array.from(nameElements).map(el => el.textContent.trim());
    const content = names.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '123.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
    alert(`📚 ${names.length} 个成功`);
})();