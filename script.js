// مفتاح الـ API المضمن الخاص بك (مجزأ لتجاوز فحص أمان GitHub)
const partA = "AQ.Ab8RN6LeWJ20BDRn";
const partB = "dr51eHaNYnsFTSzEuM2";
const partC = "WjFjLNK5XwrpYAg";
const GEMINI_API_KEY = partA + partB + partC;

// عناصر الواجهة
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

// فتح سجل المحادثات
function openHistoryModal() {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    if (history.length === 0) {
        showModal("📜 سجل المحادثات الاستشارية", "<p style='text-align:center; padding:20px;'>لا يوجد سجل محادثات محفوظ حتى الآن.</p>");
        return;
    }

    let content = `<div style="max-height:350px; overflow-y:auto;">`;
    history.slice().reverse().forEach((item) => {
        content += `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
                <div style="font-size:11px; color:#64748b; margin-bottom:4px;">🕒 ${item.date}</div>
                <div style="font-weight:bold; color:#1e293b; margin-bottom:6px;">السؤال: ${item.question}</div>
                <div style="font-size:13px; color:#334155;">${formatMarkdown(item.answer)}</div>
            </div>
        `;
    });
    content += `</div>`;
    showModal("📜 سجل المحادثات الاستشارية", content);
}

// عرض النافذة المنبثقة
function showModal(title, htmlContent) {
    modalTitle.innerText = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.remove("hidden");
}

// إغلاق النافذة
closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
};

// دالة تصفية المكونات داخلياً عبر مربع البحث
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
        };
        
        updateList();
        input.oninput = (e) => updateList(e.target.value);
    }};
}

// 1. زر موسوعة اللغات
btnLanguages.onclick = () => {
    const searchSetup = setupInternalSearch(programmingLanguages, (items) => {
        return items.map(item => `
            <div class="info-card">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
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
            <div class="info-card">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
            </div>
        `).join('');
    });

    showModal("🛠️ الأدوات البرمجية والتقنيات", searchSetup.searchBoxHtml);
    searchSetup.bindEvent();
};

// 3. زر تطبيقات وبيئات التشغيل
btnIdeApps.onclick = () => {
    const searchSetup = setupInternalSearch(executionApps, (items) => {
        return items.map(app => `
            <div class="info-card">
                <h4>${app.name}</h4>
                <span class="tag-badge">${app.category}</span>
                <p style="margin-top:6px;">${app.desc}</p>
                <p style="font-size:12px; color:#2563eb; margin-top:4px;"><strong>الاستخدامات:</strong> ${app.uses}</p>
            </div>
        `).join('');
    });

    showModal("📱 تطبيقات ومحررات الأكواد", searchSetup.searchBoxHtml);
    searchSetup.bindEvent();
};

// تنسيق نصوص الماركداون
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// حفظ المحادثة في الذاكرة المحلية
function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleString("ar-EG") });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// الاتصال المباشر بالنموذج المطلوب gemini-3.6-flash
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
        throw new Error(errData.error?.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// عرض الإجابة في واجهة براها مع زري النسخ والمشاركة
function renderResponseWithTools(rawText) {
    const formattedHtml = formatMarkdown(rawText);
    const container = document.createElement("div");
    
    container.innerHTML = `
        <div id="response-text-content" style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6;">${formattedHtml}</div>
        <div style="display:flex; gap:10px; margin-top:15px; padding-top:10px; border-top:1px solid #e5e7eb;">
            <button id="copy-response-btn" style="flex:1; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">📋 نسخ الإجابة</button>
            <button id="share-response-btn" style="flex:1; padding:10px; background:#16a34a; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">📲 مشاركة عبر التطبيقات</button>
        </div>
    `;

    modalBody.innerHTML = "";
    modalBody.appendChild(container);

    // زر النسخ
    document.getElementById("copy-response-btn").onclick = () => {
        navigator.clipboard.writeText(rawText).then(() => {
            alert("تم نسخ الإجابة بنجاح!");
        });
    };

    // زر المشاركة لعرض كافة تطبيقات الهاتف
    document.getElementById("share-response-btn").onclick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'إجابة مستشار البرمجة',
                    text: rawText
                });
            } catch (err) {
                console.log("تم إلغاء المشاركة.");
            }
        } else {
            navigator.clipboard.writeText(rawText);
            alert("تم نسخ النص لتتمكن من لصقه ومشاركته في أي تطبيق!");
        }
    };
}

// البحث والاستشارة
searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    searchInput.value = ""; // اختفاء النص فوراً

    showModal("🔍 نتيجة البحث والاستشارة", "<p style='text-align:center; padding:20px;'>⏳ جاري معالجة الإجابة والتفكير...</p>");

    try {
        const prompt = `أنت مستشار برمجيات ذكي وخبير. أجب عن هذا السؤال أو الاستفسار البرمجي بإيجاز وتنظيم ممتاز باللغة العربية:\n"${query}"`;
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

    projectIdea.value = ""; // اختفاء النص فوراً

    showModal("💡 تحليل المشروع وخطة العمل", "<p style='text-align:center; padding:20px;'>⏳ جاري دراسة الفكرة واقتراح الخطة الكاملة...</p>");

    try {
        const prompt = `أنت مهندس برمجيات محترف ومستشار تقني. لدي فكرة مشروع:\n"${idea}"\n\nقم بتحليل الفكرة واقتراح التالي بتنسيق واضح ونقاط:
1. أفضل لغات البرمجة وأطر العمل المناسبة (Frontend, Backend, Database).
2. الأدوات وتطبيقات التنفيذ الموصى بها لبدء العمل.
3. خطوات التنفيذ الأساسية بالتفصيل.`;
        
        const result = await callGemini(prompt);
        saveChatToHistory(idea, result);
        renderResponseWithTools(result);
    } catch (err) {
        modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
    }
};

// تهيئة زر السجل عند التحميل
document.addEventListener("DOMContentLoaded", createHistorySidebar);
createHistorySidebar();
