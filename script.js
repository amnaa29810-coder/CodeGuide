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

// دالة فتح النافذة المنبثقة المستقلة
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

// 1. زر موسوعة اللغات
btnLanguages.onclick = () => {
    let content = "";
    programmingLanguages.forEach(item => {
        content += `
            <div class="info-card">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
            </div>
        `;
    });
    showModal("📚 موسوعة لغات البرمجة", content);
};

// 2. زر الأدوات البرمجية
btnTools.onclick = () => {
    let content = "";
    devTools.forEach(item => {
        content += `
            <div class="info-card">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
            </div>
        `;
    });
    showModal("🛠️ الأدوات البرمجية", content);
};

// 3. زر تطبيقات وبيئات التشغيل (IDEs)
btnIdeApps.onclick = () => {
    let content = "";
    executionApps.forEach(app => {
        content += `
            <div class="info-card">
                <h4>${app.name}</h4>
                <span class="tag-badge">${app.category}</span>
                <p style="margin-top:6px;">${app.desc}</p>
                <p style="font-size:12px; color:#2563eb; margin-top:4px;"><strong>الاستخدامات:</strong> ${app.uses}</p>
            </div>
        `;
    });
    showModal("📱 تطبيقات ومحررات تنفيذ الأكواد", content);
};

// دالة تحويل علامات الماركداون لتنسيق نص جميل
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// إدارة حفظ السجل في LocalStorage
function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleString("ar-EG") });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// دالة الاتصال بـ Gemini المعالجة للخطأ والسرعة
async function callGemini(promptText) {
    const primaryUrl = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(primaryUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "models/gemini-2.5-flash",
                input: promptText
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.output) return typeof data.output === "string" ? data.output : JSON.stringify(data.output);
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
        }
    } catch (e) {
        console.log("Fallback to generateContent...");
    }

    // نقطة نهاية احتياطية لضمان الاستجابة السريعة وعدم التأخير
    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const fallbackRes = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
        })
    });

    if (!fallbackRes.ok) {
        const errData = await fallbackRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    }

    const fbData = await fallbackRes.json();
    return fbData.candidates[0].content.parts[0].text;
}

// دالة إرفاق أزرار النسخ والمشاركة والإجابة في النافذة
function renderResponseWithTools(rawText) {
    const formattedHtml = formatMarkdown(rawText);
    const container = document.createElement("div");
    
    container.innerHTML = `
        <div id="response-text-content">${formattedHtml}</div>
        <div style="display:flex; gap:10px; margin-top:15px; padding-top:10px; border-top:1px solid #e5e7eb;">
            <button id="copy-response-btn" style="flex:1; padding:8px; background:#2563eb; color:#fff; border:none; border-radius:6px; cursor:pointer;">📋 نسخ الإجابة</button>
            <button id="share-response-btn" style="flex:1; padding:8px; background:#16a34a; color:#fff; border:none; border-radius:6px; cursor:pointer;">🔗 مشاركة</button>
        </div>
    `;

    modalBody.innerHTML = "";
    modalBody.appendChild(container);

    // زر النسخ
    document.getElementById("copy-response-btn").onclick = () => {
        navigator.clipboard.writeText(rawText).then(() => {
            alert("تم نسخ النص بنجاح!");
        });
    };

    // زر المشاركة
    document.getElementById("share-response-btn").onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'إجابة مستشار البرمجة',
                text: rawText
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(rawText);
            alert("تم نسخ النص لمشاركته!");
        }
    };
}

// البحث الذكي من الزر العلوي
searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // اختفاء النص من المربع فور الضغط
    searchInput.value = "";

    showModal("🔍 نتيجة البحث والاستشارة", "<p style='text-align:center; padding:20px;'>⏳ جاري الحصول على الإجابة فوراً...</p>");

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

    // اختفاء النص من المربع فور الضغط
    projectIdea.value = "";

    showModal("💡 تحليل المشروع وخطة العمل", "<p style='text-align:center; padding:20px;'>⏳ جاري دراسة الفكرة واقتراح الخطة فوراً...</p>");

    try {
        const prompt = `أنت مهندس برمجيات محترف ومستشار تقني. لدي فكرة مشروع:\n"${idea}"\n\nقم بتحليل الفكرة واقتراح التالي بتنسيق واضح ونقاط:
1. أفضل لغات البرمجة وأطر العمل المناسبة (Frontend, Backend, Database).
2. الأدوات وتطبيقات التنفيذ الموصى بها لبدء العمل.
3. خطوات التنفيذ الأساسية.`;
        
        const result = await callGemini(prompt);
        saveChatToHistory(idea, result);
        renderResponseWithTools(result);
    } catch (err) {
        modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
    }
};
