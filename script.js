const partA = "AQ.Ab8RN6LeWJ20BDRn";
const partB = "dr51eHaNYnsFTSzEuM2";
const partC = "WjFjLNK5XwrpYAg";
const GEMINI_API_KEY = partA + partB + partC;

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const projectIdea = document.getElementById("project-idea");
const analyzeProjectBtn = document.getElementById("analyze-project-btn");

const btnLanguages = document.getElementById("btn-languages");
const btnTools = document.getElementById("btn-tools");
const btnIdeApps = document.getElementById("btn-ide-apps");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

// إنشاء زر السجل الجانبي
function createHistorySidebar() {
    if (document.getElementById("chat-history-trigger")) return;

    const btn = document.createElement("button");
    btn.id = "chat-history-trigger";
    btn.innerHTML = "☰ السجل";
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #1e293b;
        color: #fff;
        border: none;
        padding: 10px 16px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        cursor: pointer;
        z-index: 999;
        font-weight: bold;
        font-size: 14px;
    `;
    document.body.appendChild(btn);
    btn.onclick = openHistoryModal;
}

// السجل - عرض اسم الموضوع فقط
function openHistoryModal() {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    if (history.length === 0) {
        showModal("📜 سجل المحادثات", "<p style='text-align:center; padding:20px;'>لا يوجد سجل محادثات حتى الآن.</p>");
        return;
    }

    let content = `<div style="max-height:350px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">`;
    history.slice().reverse().forEach((item, index) => {
        content += `
            <div class="history-item" data-index="${history.length - 1 - index}" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; cursor:pointer;">
                <div style="font-size:11px; color:#64748b; margin-bottom:2px;">🕒 ${item.date}</div>
                <div style="font-weight:bold; color:#1d4ed8; font-size:14px;">🔍 ${item.question}</div>
            </div>
        `;
    });
    content += `</div>`;
    
    showModal("📜 سجل البحث والمحادثات", content);

    document.querySelectorAll(".history-item").forEach(el => {
        el.onclick = () => {
            const idx = el.getAttribute("data-index");
            const selected = history[idx];
            showModal(`💡 ${selected.question}`, "");
            renderResponseWithTools(selected.answer);
        };
    });
}

function showModal(title, htmlContent) {
    modalTitle.innerText = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
};

// تنسيق نصوص الماركداون
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// دالة تصفية البحث مع زر نسخ لكل عنصر
function setupInternalSearch(dataArray, renderFunction) {
    const searchBoxHtml = `
        <input type="text" id="modal-internal-search" placeholder="🔍 ابحث بالاسم أو التفاصيل..." 
               style="width:100%; padding:8px 12px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-size:13px;">
        <div id="modal-items-container"></div>
    `;
    return { searchBoxHtml, bindEvent: () => {
        const input = document.getElementById("modal-internal-search");
        const container = document.getElementById("modal-items-container");
        
        const updateList = (filterText = "") => {
            const filtered = dataArray.filter(item => 
                item.name.toLowerCase().includes(filterText.toLowerCase()) || 
                (item.desc && item.desc.toLowerCase().includes(filterText.toLowerCase()))
            );
            container.innerHTML = renderFunction(filtered);

            // تفعيل أزرار النسخ المنفردة لكل عنصر
            document.querySelectorAll(".copy-item-btn").forEach(btn => {
                btn.onclick = (e) => {
                    const textToCopy = e.target.getAttribute("data-copy");
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        alert("تم نسخ معلومات هذا العنصر بنجاح!");
                    });
                };
            });
        };
        
        updateList();
        input.oninput = (e) => updateList(e.target.value);
    }};
}

// 1. زر موسوعة اللغات
btnLanguages.onclick = () => {
    const searchSetup = setupInternalSearch(programmingLanguages, (items) => {
        return items.map(item => `
            <div class="info-card" style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:8px; margin-bottom:10px;">
                <h4 style="color:#1d4ed8; margin-bottom:6px;">${item.name}</h4>
                <div style="font-size:13px; color:#334155; line-height:1.5;">${formatMarkdown(item.desc)}</div>
                <button class="copy-item-btn" data-copy="${item.name}\n${item.desc}" 
                        style="margin-top:10px; width:100%; padding:6px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold; color:#1e293b;">
                    📋 نسخ معلومات ${item.name}
                </button>
            </div>
        `).join('');
    });
    showModal("📚 موسوعة لغات البرمجة", searchSetup.searchBoxHtml);
    searchSetup.bindEvent();
};

// 2. زر الأدوات البرمجية
btnTools.onclick = () => {
    const searchSetup = setupInternalSearch(devTools, (items) => {
        return items.map(item => `
            <div class="info-card" style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:8px; margin-bottom:10px;">
                <h4 style="color:#1d4ed8; margin-bottom:6px;">${item.name}</h4>
                <div style="font-size:13px; color:#334155; line-height:1.5;">${formatMarkdown(item.desc)}</div>
                <button class="copy-item-btn" data-copy="${item.name}\n${item.desc}" 
                        style="margin-top:10px; width:100%; padding:6px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold; color:#1e293b;">
                    📋 نسخ معلومات ${item.name}
                </button>
            </div>
        `).join('');
    });
    showModal("🛠️ الأدوات البرمجية والتقنيات", searchSetup.searchBoxHtml);
    searchSetup.bindEvent();
};

// 3. زر تطبيقات وبيئات الأكواد
btnIdeApps.onclick = () => {
    const searchSetup = setupInternalSearch(executionApps, (items) => {
        return items.map(app => `
            <div class="info-card" style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:8px; margin-bottom:10px;">
                <h4 style="color:#1d4ed8; margin-bottom:4px;">${app.name}</h4>
                <span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold;">${app.category}</span>
                <div style="font-size:13px; color:#334155; margin-top:8px; line-height:1.5;">${formatMarkdown(app.desc)}</div>
                <p style="font-size:12px; color:#2563eb; margin-top:4px;"><strong>الاستخدامات:</strong> ${app.uses}</p>
                <button class="copy-item-btn" data-copy="${app.name}\n${app.desc}\nالاستخدامات: ${app.uses}" 
                        style="margin-top:10px; width:100%; padding:6px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold; color:#1e293b;">
                    📋 نسخ معلومات ${app.name}
                </button>
            </div>
        `).join('');
    });
    showModal("📱 تطبيقات ومحررات الأكواد", searchSetup.searchBoxHtml);
    searchSetup.bindEvent();
};

// حفظ المحادثة
function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// طلب الذكاء الاصطناعي
async function callGemini(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || "تعذر الاتصال بالخدمة.");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// عرض نتائج البحث مع زر النسخ العام
function renderResponseWithTools(rawText) {
    const formattedHtml = formatMarkdown(rawText);
    const container = document.createElement("div");
    
    container.innerHTML = `
        <div id="response-text-content" style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6;">${formattedHtml}</div>
        <div style="margin-top:15px; padding-top:10px; border-top:1px solid #e5e7eb;">
            <button id="copy-response-btn" style="width:100%; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">📋 نسخ الإجابة كاملة</button>
        </div>
    `;

    modalBody.innerHTML = "";
    modalBody.appendChild(container);

    document.getElementById("copy-response-btn").onclick = () => {
        navigator.clipboard.writeText(rawText).then(() => {
            alert("تم نسخ النص بنجاح!");
        });
    };
}

// البحث والاستشارة
searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    searchInput.value = "";

    showModal("🔍 نتيجة البحث", "<p style='text-align:center; padding:20px;'>جاري جلب الإجابة...</p>");

    try {
        const prompt = `أجب بإيجاز واحترافية باللغة العربية على:\n"${query}"`;
        const result = await callGemini(prompt);
        saveChatToHistory(query, result);
        renderResponseWithTools(result);
    } catch (err) {
        modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
    }
};

// تحليل فكرة المشروع
analyzeProjectBtn.onclick = async () => {
    const idea = projectIdea.value.trim();
    if (!idea) return;

    projectIdea.value = "";

    showModal("💡 تحليل المشروع وخطة العمل", "<p style='text-align:center; padding:20px;'>جاري تحليل الفكرة...</p>");

    try {
        const prompt = `حلل فكرة المشروع التالية واقترح التقنيات والخطوات بشكل مباشر ومختصر:\n"${idea}"`;
        
        const result = await callGemini(prompt);
        saveChatToHistory(idea, result);
        renderResponseWithTools(result);
    } catch (err) {
        modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
    }
};

document.addEventListener("DOMContentLoaded", createHistorySidebar);
createHistorySidebar();
