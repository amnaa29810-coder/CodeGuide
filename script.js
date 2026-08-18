// فتح وإغلاق القائمة الجانبية وعرض الشات المحفوظ
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        renderHistory();
    }
}

// عرض قائمة المحادثات القديمة
function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('myChatHistory')) || [];

    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerText = item.question.substring(0, 30) + (item.question.length > 30 ? '...' : '');
        li.onclick = () => loadHistoryItem(index);
        list.appendChild(li);
    });
}

// تحميل محادثة قديمة عند الضغط عليها
function loadHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('myChatHistory')) || [];
    const item = history[index];
    if (!item) return;

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';

    appendMessage('user', item.question);
    const aiMsgDiv = appendMessage('ai', item.answer);
    addActions(aiMsgDiv, item.answer);

    toggleSidebar();
}

// حفظ المحادثة في الـ LocalStorage
function saveChat(question, answer) {
    let history = JSON.parse(localStorage.getItem('myChatHistory')) || [];
    history.push({ question, answer });
    localStorage.setItem('myChatHistory', JSON.stringify(history));
}

// إضافة أزرار النسخ والمشاركة تحت كل إجابة
function addActions(container, text) {
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-buttons';

    // زر النسخ
    const copyBtn = document.createElement('button');
    copyBtn.innerText = 'نسخ';
    copyBtn.className = 'action-btn';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        alert('تم النسخ!');
    };

    // زر المشاركة لفتح جميع تطبيقات الهاتف
    const shareBtn = document.createElement('button');
    shareBtn.innerText = 'مشاركة';
    shareBtn.className = 'action-btn';
    shareBtn.onclick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'إجابة',
                    text: text
                });
            } catch (e) {}
        } else {
            navigator.clipboard.writeText(text);
            alert('تم نسخ النص لعدم دعم المشاركة المباشرة في المتصفح.');
        }
    };

    actionDiv.appendChild(copyBtn);
    actionDiv.appendChild(shareBtn);
    container.appendChild(actionDiv);
}

// إضافة رسالة للواجهة
function appendMessage(sender, text) {
    const chatBox = document.getElementById('chatBox');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// إرسال السؤال ومعالجة الإجابة المباشرة (السرعة)
async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    // إنشاء عنصر لإجابة الذكاء الاصطناعي
    const aiMsgDiv = appendMessage('ai', '');

    try {
        // إذا كنت تستخدمين API يدعم الـ Streaming لتظهر الإجابة فوراً:
        // يتم إضافة النص فور وصوله مباشرة بدون انتظار التكميل
        
        /* 
           ملاحظة: استبدلي الجزء التالي بكود الـ API الخاص بكِ للـ Streaming
           إذا كان عندك دالة جاهزة في data.js استخدميها مباشرة.
        */

        // مثال محاكاة للاستجابة السريعة البث المباشر (تعدل حسب الـ API الخاص بك)
        let fullResponse = "هذه الإجابة تظهر فوراً وبشكل سريع بدون انتظار طويل..."; 
        aiMsgDiv.innerText = fullResponse;

        // إضافة أزرار النسخ والمشاركة بعد ظهور الإجابة
        addActions(aiMsgDiv, fullResponse);

        // حفظ الشات
        saveChat(text, fullResponse);

    } catch (error) {
        aiMsgDiv.innerText = "حدث خطأ أثناء الحصول على الإجابة.";
    }
}
