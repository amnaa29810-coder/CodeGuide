// 1. فتح وإغلاق القائمة الجانبية لعرض المحادثات القديمة
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        renderHistory();
    }
}

// 2. عرض المحادثات المحفوظة
function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('savedChats')) || [];

    history.forEach((item) => {
        const li = document.createElement('li');
        li.innerText = item.prompt.substring(0, 30) + (item.prompt.length > 30 ? '...' : '');
        li.onclick = () => {
            alert(`السؤال: ${item.prompt}\n\nالإجابة:\n${item.response}`);
            toggleSidebar();
        };
        list.appendChild(li);
    });
}

// 3. حفظ المحادثات في ذاكرة الهاتف
function saveChatToMemory(prompt, response) {
    let history = JSON.parse(localStorage.getItem('savedChats')) || [];
    history.unshift({ prompt, response, time: new Date() });
    localStorage.setItem('savedChats', JSON.stringify(history));
}

// 4. إضافة أزرار النسخ والمشاركة تحت الإجابة
function addActionButtons(container, text) {
    const existingActions = container.querySelector('.action-buttons-wrapper');
    if (existingActions) existingActions.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'action-buttons-wrapper';

    // زر النسخ
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-sub-action';
    copyBtn.innerText = '📋 نسخ';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        alert('تم نسخ النص!');
    };

    // زر المشاركة لجميع التطبيقات
    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn-sub-action';
    shareBtn.innerText = '📲 مشاركة';
    shareBtn.onclick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'مستشار البرمجة الذكي',
                    text: text
                });
            } catch (err) {}
        } else {
            navigator.clipboard.writeText(text);
            alert('تم نسخ النص لعدم دعم المشاركة المباشرة في هذا المتصفح.');
        }
    };

    wrapper.appendChild(copyBtn);
    wrapper.appendChild(shareBtn);
    container.appendChild(wrapper);
}

// 5. دالة تحليل المشروع (سريعة بدون انتظار طويل)
async function analyzeProject() {
    const input = document.getElementById('projectInput');
    const resultBox = document.getElementById('projectResult');
    const text = input.value.trim();

    if (!text) return;

    resultBox.style.display = 'block';
    resultBox.innerText = 'جاري التحليل فوراً...';

    try {
        // يمكنك ربط هذه الجزئية بالـ API الخاص بك مباشرة
        let responseText = "تم تحليل مشروعك بنجاح! نقترح استخدام HTML, CSS, JavaScript للواجهة و Python/Node.js للخلفية.";
        
        // إظهار الإجابة فوراً
        resultBox.innerText = responseText;

        // إضافة أزرار النسخ والمشاركة
        addActionButtons(resultBox, responseText);

        // حفظ الشات
        saveChatToMemory(text, responseText);

    } catch (error) {
        resultBox.innerText = '❌ حدث خطأ أثناء التحليل.';
    }
}

// 6. دالة البحث السريع
async function handleSearch() {
    const input = document.getElementById('searchInput');
    const resultBox = document.getElementById('searchResult');
    const text = input.value.trim();

    if (!text) return;

    resultBox.style.display = 'block';
    resultBox.innerText = 'جاري البحث...';

    let responseText = `نتائج البحث عن: ${text}`;
    resultBox.innerText = responseText;

    addActionButtons(resultBox, responseText);
    saveChatToMemory(text, responseText);
}
