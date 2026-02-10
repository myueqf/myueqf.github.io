(function() {
    document.addEventListener('keydown', function(e) {
        if (e.key === '/') {
            const activeTag = document.activeElement.tagName.toUpperCase();
            if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement.isContentEditable) {
                return;
            }
            e.preventDefault();

            const input = prompt(">_");
            if (!input) return;
            handleScriptExecution(input.trim());
        }
    });

    function handleScriptExecution(cmd) {
        let scriptPath = '';
        if (cmd.includes('/')) {
            scriptPath = cmd;
        } else {
            const filename = cmd.endsWith('.js') ? cmd : cmd + '.js';
            scriptPath = 'script/' + filename;
        }
        loadScript(scriptPath);
    }

    function loadScript(url) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            console.log(`[INFO] 脚本载入成功: ${url}`);
            document.body.removeChild(script);
        };
        script.onerror = function() {
            alert(`致命错误：文件不存在 ${url}`);
            document.body.removeChild(script);
        };
        document.body.appendChild(script);
    }
})();