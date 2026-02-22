window.addExtraBooks(['js/booklist.json','js/booklist1.json']);
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get('list');
    if (paramValue === 'all') {
        alert(`awa`);
    }
})();