// بيانات الموسوعات مدمجة مباشرة
const programmingCategories = [
    {
        id: "web",
        title: "🌐 تطوير الويب",
        desc: "اللغات الأساسية لبناء المواقع",
        languages: [
            { name: "HTML & CSS", desc: "الهيكل والتنسيق لصفحات الويب." },
            { name: "JavaScript", desc: "إضافة التفاعلية للمواقع." },
            { name: "PHP", desc: "بناء الخوادم وقواعد البيانات." }
        ]
    },
    {
        id: "mobile",
        title: "📱 تطبيقات الهواتف",
        desc: "لغات بناء التطبيقات",
        languages: [
            { name: "Dart (Flutter)", desc: "بناء تطبيقات للآيفون والأندرويد." },
            { name: "Kotlin", desc: "اللغة الرسمية لتطوير الأندرويد." },
            { name: "Swift", desc: "اللغة الرسمية لتطوير تطبيقات Apple." }
        ]
    }
];

const devTools = [
    { name: "Git & GitHub", desc: "إدارة النسخ وحفظ الكود." },
    { name: "VS Code", desc: "أشهر محرر كود مجاني." },
    { name: "Postman", desc: "اختبار ومعاينة الـ APIs." }
];

const executionApps = [
    { name: "Acode", desc: "محرر كود للأندرويد يدعم HTML/CSS/JS." },
    { name: "Replit", desc: "منصة سحابية لكتابة الكود من المتصفح." },
    { name: "Termux", desc: "بيئة بيش لتشغيل Python و Node.js." }
];

const techGlossary = [
    { name: "API", desc: "واجهة برمجية لربط التطبيقات ببعضها." },
    { name: "Backend", desc: "الجزء الخلفي المسؤول عن السيرفر وقواعد البيانات." },
    { name: "Frontend", desc: "واجهة المستخدم التي يتفاعل معها الزائر." }
];

const roadmapsData = {
    web: "### مسار تطوير الويب:\n1. تعلم HTML & CSS\n2. تعلم JavaScript\n3. تعلم Git & GitHub",
    mobile: "### مسار تطبيقات الهواتف:\n1. تعلم أساسيات البرمجة\n2. تعلم Flutter & Dart",
    ai: "### مسار الذكاء الاصطناعي:\n1. تعلم Python\n2. مكتبات البيانات NumPy & Pandas"
};

// مفتاح API مقسم
const k1 = "AIzaSy";
const k2 = "DAQ_Ab8RN6";
const k3 = "KWkkJN8Q6M";
const k4 = "Wg90V55N1as";
const k5 = "_vvOy2N_aenzh8E4LQBR6kg";

const GEMINI_API_KEY = [k1, k2, k3, k4, k5].join('');

// 1. ربط عناصر الواجهة
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const projectIdea = document.getElementById("project-idea");

const analyzeProjectBtn = document.getElementById("analyze-project-btn");
const btnCalculator = document.getElementById("btn-calculator");
const btnDbGenerator = document.getElementById("btn-db-generator");
const btnCodeTranslator = document.getElementById("btn-code-translator");

const btnLanguages = document.getElementById("btn-languages");
const btnTools = document.getElementById("btn-tools");
const btnIdeApps = document.getElementById("btn-ide-apps");
const btnGlossarySidebar = document.getElementById("btn-glossary-sidebar");

const btnRoadmapWeb = document.getElementById("btn-roadmap-web");
const btnRoadmapMobile = document.getElementById("btn-roadmap-mobile");
const btnRoadmapAi = document.getElementById("btn-roadmap-ai");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

// 2. التحكم بالنافذة المنبثقة
function showModal(title, htmlContent) {
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.innerText = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.remove("hidden");
}

if (closeModal) {
    closeModal.onclick = () => modal.classList.add("hidden");
}

window.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
};

function formatMarkdown(text) {
    if (!text) return "";
    return text
        .replace(/### (.*?)\n/g, '<strong style="color:#1d4ed8; font-size:15px; display:block; margin-top:8px;">$1</strong>')
        .replace(/## (.*?)\n/g, '<strong style="color:#0f172a; font-size:16px; display:block; margin-top:10px;">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/---/g, '<hr style="border:0; border-top:1px solid #e2e8f0; margin:10px 0;">')
        .replace(/\n/g, '<br>');
}

// 3. دالة الاتصال بـ Gemini API
async function callGeminiStream(promptText, onChunk) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتم الحصول على إجابة.";
            onChunk(fullText);
            return fullText;
        }

        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `خطأ في الاتصال (${response.status})`);
    } catch (err) {
        throw err;
    }
}

function prepareFastModal(title) {
    showModal(title, `
        <div style="padding:5px;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:350px; overflow-y:auto; color:#1e293b; text-align:right;">⚡ جاري التحميل...</div>
        </div>
    `);
}

function renderResponseWithTools(rawText) {
    const formattedHtml = formatMarkdown(rawText);
    if (!modalBody) return;
    modalBody.innerHTML = `
        <div style="padding:5px;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:350px; overflow-y:auto; color:#1e293b; text-align:right;">
                ${formattedHtml}
            </div>
        </div>
        <button id="copy-response-btn" style="width:100%; margin-top:8px; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">📋 نسخ النتيجة</button>
    `;

    const copyBtn = document.getElementById("copy-response-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            const textToCopy = document.getElementById("response-text-content").innerText;
            navigator.clipboard.writeText(textToCopy).then(() => alert("تم النسخ!"));
        };
    }
}

// 4. أزرار تحليل وتخطيط المشاريع
if (analyzeProjectBtn) {
    analyzeProjectBtn.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");
        prepareFastModal("💡 تحليل الفكرة والتقنيات");
        try {
            const result = await callGeminiStream(`تحليل شامل لفكرة: ${idea}`, (txt) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(txt);
            });
            renderResponseWithTools(result);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; padding:10px; text-align:center;">${err.message}</p>`;
        }
    };
}

if (btnCalculator) {
    btnCalculator.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");
        prepareFastModal("💰 الميزانية والوقت");
        try {
            const result = await callGeminiStream(`تقدير الميزانية والوقت لمشروع: ${idea}`, (txt) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(txt);
            });
            renderResponseWithTools(result);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; padding:10px; text-align:center;">${err.message}</p>`;
        }
    };
}

if (btnDbGenerator) {
    btnDbGenerator.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");
        prepareFastModal("🗄️ هيكل قواعد البيانات");
        try {
            const result = await callGeminiStream(`تصميم قواعد بيانات لمشروع: ${idea}`, (txt) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(txt);
            });
            renderResponseWithTools(result);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; padding:10px; text-align:center;">${err.message}</p>`;
        }
    };
}

// 5. زر مترجم ومولد لغات البرمجة
if (btnCodeTranslator) {
    btnCodeTranslator.onclick = () => {
        showModal("🔄 مترجم ومولد الكود", `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:right;">
                <textarea id="translator-input" placeholder="اكتبي الكود أو الطلب هنا..." style="width:100%; height:80px; padding:8px; border:1px solid #cbd5e1; border-radius:6px;"></textarea>
                <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثل Java)" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                <button id="exec-convert-btn" style="padding:10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">تنفيذ</button>
            </div>
        `);

        document.getElementById("exec-convert-btn").onclick = async () => {
            const code = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!code) return alert("يرجى إدخال النص أو الكود!");
            
            prepareFastModal("🔄 جاري معالجة الكود...");
            try {
                const result = await callGeminiStream(`حُوّل أو انشئ الكود التالي إلى ${lang}:\n${code}`, (txt) => {
                    const textElem = document.getElementById("response-text-content");
                    if (textElem) textElem.innerHTML = formatMarkdown(txt);
                });
                renderResponseWithTools(result);
            } catch (err) {
                modalBody.innerHTML = `<p style="color:#ef4444; padding:10px; text-align:center;">${err.message}</p>`;
            }
        };
    };
}

// 6. زر البحث
if (searchBtn) {
    searchBtn.onclick = async () => {
        const query = searchInput ? searchInput.value.trim() : "";
        if (!query) return;
        prepareFastModal("🔍 نتيجة البحث");
        try {
            const result = await callGeminiStream(`إجابة سريعة عن: ${query}`, (txt) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(txt);
            });
            renderResponseWithTools(result);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; padding:10px; text-align:center;">${err.message}</p>`;
        }
    };
}
