// ==========================================
// 1. مفتاح Gemini API المجزأ للحماية
// ==========================================
const k1 = "AIzaSy";
const k2 = "DAQ_Ab8RN6";
const k3 = "KWkkJN8Q6M";
const k4 = "Wg90V55N1as";
const k5 = "_vvOy2N_aenzh8E4LQBR6kg";

const GEMINI_API_KEY = [k1, k2, k3, k4, k5].join('');

// ==========================================
// 2. ربط عناصر الواجهة والتحكم بالنافذة
// ==========================================
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

// ==========================================
// 3. دالة الاتصال بـ Gemini API
// ==========================================
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
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:350px; overflow-y:auto; color:#1e293b; text-align:right;">⚡ جاري معالجة الطلب...</div>
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

// ==========================================
// 4. نافذة مترجم ومولد لغات البرمجة (مطابقة للصورة)
// ==========================================
if (btnCodeTranslator) {
    btnCodeTranslator.onclick = () => {
        showModal("🔄 مترجم ومولد لغات البرمجة", `
            <div style="display:flex; flex-direction:column; gap:12px; text-align:right; font-family:sans-serif;">
                <label style="font-weight:bold; font-size:14px; color:#334155;">اكتبي الكود للتحويل أو اطلبي كود جديد:</label>
                
                <textarea id="translator-input" placeholder="مثال للتحويل: print('Hello World')\nأو مثال للطلب: اكتب لي كود اتصال بـ MySQL في PHP" style="width:100%; height:90px; padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:#f8fafc; font-size:13px; resize:none; font-family:inherit;"></textarea>
                
                <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثال: Java, Python, C++)" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:inherit; text-align:right;">
                
                <div style="display:flex; gap:10px; margin-top:5px;">
                    <button id="exec-convert-btn" style="flex:1; padding:12px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; gap:5px;">
                        🔄 تحويل الكود
                    </button>
                    <button id="exec-generate-btn" style="flex:1; padding:12px; background:#10b981; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; gap:5px;">
                        ✨ توليد كود جديد
                    </button>
                </div>
            </div>
        `);

        // تحويل الكود
        document.getElementById("exec-convert-btn").onclick = async () => {
            const code = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!code) return alert("يرجى كتابة الكود المطلوب تحويله!");
            
            prepareFastModal(`🔄 تحويل الكود إلى ${lang || "اللغة المطلوبة"}`);
            try {
                const prompt = `حول الكود التالي إلى لغة ${lang || "المناسبة"}:\n${code}`;
                const result = await callGeminiStream(prompt, (txt) => {
                    const textElem = document.getElementById("response-text-content");
                    if (textElem) textElem.innerHTML = formatMarkdown(txt);
                });
                renderResponseWithTools(result);
            } catch (err) {
                modalBody.innerHTML = `<p style="color:#ef4444; padding:10px; text-align:center;">${err.message}</p>`;
            }
        };

        // توليد كود جديد
        document.getElementById("exec-generate-btn").onclick = async () => {
            const promptReq = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!promptReq) return alert("يرجى كتابة وصف الكود المطلوب توليده!");

            prepareFastModal(`✨ توليد كود جديد (${lang || "برمجي"})`);
            try {
                const prompt = `اكتب كود برمجياً بناءً على الطلب التالي: ${promptReq} ${lang ? 'بلغة ' + lang : ''}`;
                const result = await callGeminiStream(prompt, (txt) => {
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

// ==========================================
// 5. أزرار الذكاء الاصطناعي (التخطيط والبحث)
// ==========================================
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

// ==========================================
// 6. قراءة أزرار الموسوعات من ملف data.js
// ==========================================
if (btnLanguages) {
    btnLanguages.onclick = () => {
        if (typeof programmingCategories === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        let html = '<div style="display:flex; flex-direction:column; gap:10px; text-align:right;">';
        programmingCategories.forEach(cat => {
            html += `<h4 style="color:#2563eb; margin-bottom:4px;">${cat.title}</h4>`;
            cat.languages.forEach(lang => {
                html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px; margin-bottom:4px;"><strong>${lang.name}:</strong> ${lang.desc}</div>`;
            });
        });
        html += '</div>';
        showModal("💻 لغات البرمجة", html);
    };
}

if (btnTools) {
    btnTools.onclick = () => {
        if (typeof devTools === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
        devTools.forEach(tool => {
            html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${tool.name}:</strong> ${tool.desc}</div>`;
        });
        html += '</div>';
        showModal("🛠️ الأدوات والتقنيات", html);
    };
}

if (btnIdeApps) {
    btnIdeApps.onclick = () => {
        if (typeof executionApps === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
        executionApps.forEach(app => {
            html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${app.name}:</strong> ${app.desc}</div>`;
        });
        html += '</div>';
        showModal("📱 تطبيقات ومحررات الكود", html);
    };
}

if (btnGlossarySidebar) {
    btnGlossarySidebar.onclick = () => {
        if (typeof techGlossary === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
        techGlossary.forEach(item => {
            html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${item.name}:</strong> ${item.desc}</div>`;
        });
        html += '</div>';
        showModal("📖 قاموس المصطلحات", html);
    };
}

if (btnRoadmapWeb) {
    btnRoadmapWeb.onclick = () => {
        if (typeof roadmapsData === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        showModal("🌐 تطوير الويب", formatMarkdown(roadmapsData.web));
    };
}

if (btnRoadmapMobile) {
    btnRoadmapMobile.onclick = () => {
        if (typeof roadmapsData === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        showModal("📱 تطوير التطبيقات", formatMarkdown(roadmapsData.mobile));
    };
}

if (btnRoadmapAi) {
    btnRoadmapAi.onclick = () => {
        if (typeof roadmapsData === 'undefined') return alert("ملف data.js غير محمل بنجاح!");
        showModal("🤖 الذكاء الاصطناعي", formatMarkdown(roadmapsData.ai));
    };
}
