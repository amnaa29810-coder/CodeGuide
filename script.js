const _k = ["QVEuQWI4Uk42TGVX", "SjIwQkRSbmRyNTFl", "SGFOWW5zRlRTemV1", "TTJXakZqTE5LNVh3", "cnBZQWc="].join("");
const GEMINI_API_KEY = atob(_k);

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const aiResponse = document.getElementById("ai-response");
const responseContent = document.getElementById("response-content");

const projectIdea = document.getElementById("project-idea");
const analyzeProjectBtn = document.getElementById("analyze-project-btn");
const projectResponse = document.getElementById("project-response");

const btnLanguages = document.getElementById("btn-languages");
const btnTools = document.getElementById("btn-tools");
const btnIdeApps = document.getElementById("btn-ide-apps");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("close-sidebar");
const historyList = document.getElementById("history-list");
const shareBtn = document.getElementById("share-btn");

// فتح وإغلاق القائمة الجانبية
menuBtn.onclick = () => sidebar.classList.add("active");
closeSidebar.onclick = () => sidebar.classList.remove("active");

// سجل البحث
function addToHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!history.includes(query)) {
        history.unshift(query);
        localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
        loadHistory();
    }
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    historyList.innerHTML = history.map(q => `<div class='hist-item'>🔍 ${q}</div>`).join('');
}
loadHistory();

// المشاركة
shareBtn.onclick = async () => {
    const text = responseContent.innerText;
    if (navigator.share) {
        try {
            await navigator.share({ title: 'مستشار البرمجة الذكي', text: text });
        } catch (e) {}
    } else {
        navigator.clipboard.writeText(text);
        alert("تم نسخ الإجابة بنجاح!");
    }
};

// النوافذ المنبثقة
function openModal(title, contentHtml) {
    modalTitle.innerText = title;
    modalBody.innerHTML = contentHtml;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

btnLanguages.onclick = () => {
    let html = "<div>";
    programmingLanguages.forEach(item => {
        html += `<div class='app-card'><h3>${item.name}</h3><p>${item.desc}</p></div>`;
    });
    html += "</div>";
    openModal("📚 موسوعة لغات البرمجة", html);
};

btnTools.onclick = () => {
    let html = "<div>";
    devTools.forEach(item => {
        html += `<div class='app-card'><h3>${item.name}</h3><p>${item.desc}</p></div>`;
    });
    html += "</div>";
    openModal("🛠️ الأدوات البرمجية", html);
};

btnIdeApps.onclick = () => {
    let html = "<div>";
    executionApps.forEach(app => {
        html += `<div class='app-card'><h3>${app.name} <span class='badge'>${app.category}</span></h3><p>${app.desc}</p><small><b>الاستخدام:</b> ${app.uses}</small></div>`;
    });
    html += "</div>";
    openModal("📱 تطبيقات تنفيذ الأكواد", html);
};

// الاتصال بالذكاء الاصطناعي
async function callGemini(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (!response.ok) throw new Error("خطأ بالاتصال");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function formatText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    aiResponse.classList.remove("hidden");
    responseContent.innerHTML = "⏳ جاري التفكير...";

    try {
        const result = await callGemini(`أنت مستشار برمجيات. أجب بإيجاز: ${query}`);
        responseContent.innerHTML = formatText(result);
        addToHistory(query);
        searchInput.value = ""; // تفريغ المربع
    } catch (err) {
        responseContent.innerHTML = "❌ تعذر الحصول على إجابة، تأكد من الإنترنت.";
    }
};

analyzeProjectBtn.onclick = async () => {
    const idea = projectIdea.value.trim();
    if (!idea) return;

    projectResponse.classList.remove("hidden");
    projectResponse.innerHTML = "⏳ جاري تحليل الفكرة...";

    try {
        const result = await callGemini(`حلل فكرة المشروع واقترح التقنيات المناسبة: ${idea}`);
        projectResponse.innerHTML = formatText(result);
        projectIdea.value = "";
    } catch (err) {
        projectResponse.innerHTML = "❌ خطأ أثناء التحليل.";
    }
};
