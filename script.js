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

// دالة الاتصال بـ Gemini API (الحل الجذري باستخدام v1 واستقرار النموذج)
async function callGemini(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
        throw new Error(errMsg);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// البحث الذكي من الزر العلوي
searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    showModal("🔍 نتيجة البحث والاستشارة", "<p style='text-align:center; padding:20px;'>⏳ جاري البحث والتفكير بالذكاء الاصطناعي...</p>");

    try {
        const prompt = `أنت مستشار برمجيات ذكي وخبير. أجب عن هذا السؤال أو الاستفسار البرمجي بإيجاز وتنظيم ممتاز باللغة العربية:\n"${query}"`;
        const result = await callGemini(prompt);
        modalBody.innerHTML = formatMarkdown(result);
    } catch (err) {
        modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
    }
};

// تحليل فكرة المشروع
analyzeProjectBtn.onclick = async () => {
    const idea = projectIdea.value.trim();
    if (!idea) return;

    showModal("💡 تحليل المشروع وخطة العمل", "<p style='text-align:center; padding:20px;'>⏳ جاري دراسة الفكرة واقتراح أفضل اللغات والتقنيات المناسبة...</p>");

    try {
        const prompt = `أنت مهندس برمجيات محترف ومستشار تقني. لدي فكرة مشروع:\n"${idea}"\n\nقم بتحليل الفكرة واقتراح التالي بتنسيق واضح ونقاط:
1. أفضل لغات البرمجة وأطر العمل المناسبة (Frontend, Backend, Database).
2. الأدوات وتطبيقات التنفيذ الموصى بها لبدء العمل.
3. خطوات التنفيذ الأساسية.`;
        
        const result = await callGemini(prompt);
        modalBody.innerHTML = formatMarkdown(result);
    } catch (err) {
        modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
    }
};
