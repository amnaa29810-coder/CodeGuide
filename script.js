const _k = ["QVEuQWI4Uk42TGVX", "SjIwQkRSbmRyNTFl", "SGFOWW5zRlRTemV1", "TTJXakZqTE5LNVh3", "cnBZQWc="].join("");
const GEMINI_API_KEY = atob(_k);

// منطق القائمة الجانبية
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("close-sidebar");
const historyList = document.getElementById("history-list");

menuBtn.onclick = () => sidebar.classList.add("active");
closeSidebar.onclick = () => sidebar.classList.remove("active");

function addToHistory(query, response) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift({ query, response });
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 15)));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    historyList.innerHTML = history.map(item => `<div class='hist-item'><strong>${item.query}</strong></div>`).join('');
}
loadHistory();

// منطق المشاركة
const shareBtn = document.getElementById("share-btn");
shareBtn.onclick = () => {
    const text = document.getElementById("response-content").innerText;
    if (navigator.share) {
        navigator.share({ title: 'مستشار البرمجة', text: text });
    }
};

// البحث مع مسح المربع
searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    aiResponse.classList.remove("hidden");
    const content = document.getElementById("response-content");
    content.innerHTML = "⏳ جاري البحث...";

    try {
        const result = await callGemini(query);
        content.innerHTML = formatText(result);
        addToHistory(query, result);
        searchInput.value = ""; // مسح النص بعد البحث
    } catch (err) {
        content.innerHTML = "❌ خطأ في الاتصال";
    }
};

// بقية الدوال (callGemini, formatText, etc...) تبقى كما هي..
