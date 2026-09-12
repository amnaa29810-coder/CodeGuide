// ==========================================
// إدارة سجل البحث والمشاهدات المحلية
// ==========================================
let searchHistory = JSON.parse(localStorage.getItem("app_history") || "[]");

function addToHistory(type, title) {
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    searchHistory.unshift({ type, title, time });
    if (searchHistory.length > 20) searchHistory.pop();
    localStorage.setItem("app_history", JSON.stringify(searchHistory));
}

// ==========================================
// عناصر الواجهة والتحكم بالنافذة
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
const btnHistory = document.getElementById("btn-history");

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

if (closeModal) closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

function formatMarkdown(text) {
    if (!text) return "";
    return text
        .replace(/### (.*?)\n/g, '<strong style="color:#2563eb; font-size:15px; display:block; margin-top:8px;">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// ==========================================
// محاكي إجابات الذكاء الاصطناعي مع الحفظ
// ==========================================
function processLocalAI(promptType, inputData, extraParam = "") {
    let result = "";
    if (promptType === "translate") {
        const targetLang = extraParam || "Java";
        result = `### 🔄 تحويل الكود إلى (${targetLang}):\n\n\`\`\`${targetLang.toLowerCase()}\n// الكود المحول لـ ${targetLang}\npublic class Main {\n    public static void main(String[] args) {\n        // ${inputData}\n    }\n}\n\`\`\``;
        addToHistory("تحويل كود", `${inputData.substring(0, 15)}... ➔ ${targetLang}`);
    } else if (promptType === "generate") {
        const lang = extraParam || "JavaScript";
        result = `### ✨ كود توليد آلي (${lang}):\n\n\`\`\`${lang.toLowerCase()}\n// الطلب: ${inputData}\nfunction startProcess() {\n    console.log("تم التنفيذ بنجاح");\n}\n\`\`\``;
        addToHistory("توليد كود", `${inputData.substring(0, 15)}... (${lang})`);
    } else if (promptType === "analyze") {
        result = `### 💡 تحليل فكرة: ${inputData}\n- **التقنيات:** HTML, CSS, JS, Node.js, Database\n- **الخطة:** إعداد قاعدة البيانات -> برمجة الواجهة -> الربط بـ API.`;
        addToHistory("تحليل مشروع", inputData.substring(0, 20));
    } else if (promptType === "budget") {
        result = `### 💰 ميزانية ووقت: ${inputData}\n- **الوقت التقديري:** 2 إلى 4 أسابيع\n- **التكلفة المعتادة:** $200 - $500`;
        addToHistory("تقدير ميزانية", inputData.substring(0, 20));
    } else if (promptType === "database") {
        result = `### 🗄️ قواعد بيانات: ${inputData}\n- **جدول المستخدمين:** id, name, email\n- **جدول العمليات:** id, user_id, details, created_at`;
        addToHistory("قواعد بيانات", inputData.substring(0, 20));
    } else {
        result = `### 🔍 نتيجة البحث عن: ${inputData}\nتعتبر هذه التقنية من الأساسيات المهمة لمجال البرمجة والتطوير.`;
        addToHistory("بحث سريع", inputData);
    }

    modalBody.innerHTML = `
        <div style="padding:5px; text-align:right;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:13px; line-height:1.6; color:#1e293b;">
                ${formatMarkdown(result)}
            </div>
            <button id="copy-btn" style="width:100%; margin-top:10px; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">📋 نسخ النتيجة</button>
        </div>
    `;

    document.getElementById("copy-btn").onclick = () => {
        navigator.clipboard.writeText(result).then(() => alert("تم النسخ بنجاح!"));
    };
}

// ==========================================
// نافذة الموسوعات مع خيار البحث الداخلي
// ==========================================
function renderSearchableList(title, itemsList) {
    const contentHtml = `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="text" id="inner-search" placeholder="🔍 ابحث هنا داخل المجموعات..." style="padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px;">
            <div id="inner-list-container" style="display:flex; flex-direction:column; gap:8px;">
                ${generateItemsHtml(itemsList)}
            </div>
        </div>
    `;
    showModal(title, contentHtml);

    document.getElementById("inner-search").oninput = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = itemsList.filter(item => 
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.desc && item.desc.toLowerCase().includes(query)) ||
            (item.title && item.title.toLowerCase().includes(query))
        );
        document.getElementById("inner-list-container").innerHTML = generateItemsHtml(filtered);
    };
}

function generateItemsHtml(items) {
    if(!items.length) return `<div style="text-align:center; color:#94a3b8; padding:10px;">لا توجد نتائج مطابقة</div>`;
    return items.map(item => {
        if(item.languages) {
            return `
                <div style="margin-bottom:8px;">
                    <strong style="color:#2563eb; font-size:13px; display:block; margin-bottom:4px;">${item.title}</strong>
                    ${item.languages.map(l => `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; margin-bottom:4px; font-size:12px;"><strong>${l.name}:</strong> ${l.desc}</div>`).join('')}
                </div>
            `;
        }
        return `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; font-size:12px;"><strong>${item.name}:</strong> ${item.desc}</div>`;
    }).join('');
}

// ==========================================
// ربط الأحداث والأزرار
// ==========================================
if (btnCodeTranslator) {
    btnCodeTranslator.onclick = () => {
        showModal("🔄 مترجم ومولد لغات البرمجة", `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:right;">
                <label style="font-weight:bold; font-size:13px; color:#334155;">ادخلي الكود أو اطلبي كوداً جديداً:</label>
                <textarea id="translator-input" placeholder="مثال: print('Hello') أو اكتب كود حاسبة بـ Python" style="width:100%; height:80px; padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:#f8fafc; font-size:12px; resize:none;"></textarea>
                <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثال: Java, C++, Python)" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px;">
                <div style="display:flex; gap:8px;">
                    <button id="exec-convert-btn" style="flex:1; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">🔄 تحويل الكود</button>
                    <button id="exec-generate-btn" style="flex:1; padding:10px; background:#10b981; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">✨ توليد كود جديد</button>
                </div>
            </div>
        `);

        document.getElementById("exec-convert-btn").onclick = () => {
            const code = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!code) return alert("اكتبي الكود أولاً!");
            processLocalAI("translate", code, lang);
        };

        document.getElementById("exec-generate-btn").onclick = () => {
            const promptReq = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!promptReq) return alert("اكتبي وصف الكود أولاً!");
            processLocalAI("generate", promptReq, lang);
        };
    };
}

if (analyzeProjectBtn) analyzeProjectBtn.onclick = () => {
    const val = projectIdea ? projectIdea.value.trim() : "";
    if (!val) return alert("اكتبي الفكرة أولاً!");
    showModal("💡 تحليل الفكرة", ""); processLocalAI("analyze", val);
};

if (btnCalculator) btnCalculator.onclick = () => {
    const val = projectIdea ? projectIdea.value.trim() : "";
    if (!val) return alert("اكتبي الفكرة أولاً!");
    showModal("💰 الميزانية والوقت", ""); processLocalAI("budget", val);
};

if (btnDbGenerator) btnDbGenerator.onclick = () => {
    const val = projectIdea ? projectIdea.value.trim() : "";
    if (!val) return alert("اكتبي الفكرة أولاً!");
    showModal("🗄️ قواعد البيانات", ""); processLocalAI("database", val);
};

if (searchBtn) searchBtn.onclick = () => {
    const val = searchInput ? searchInput.value.trim() : "";
    if (!val) return;
    showModal("🔍 نتيجة البحث", ""); processLocalAI("search", val);
};

// تشغيل القواميس مع البحث الداخلي
if (btnLanguages) btnLanguages.onclick = () => renderSearchableList("💻 لغات البرمجة", programmingCategories);
if (btnTools) btnTools.onclick = () => renderSearchableList("🛠️ الأدوات والتقنيات", devTools);
if (btnIdeApps) btnIdeApps.onclick = () => renderSearchableList("📱 تطبيقات ومحررات الكود", executionApps);
if (btnGlossarySidebar) btnGlossarySidebar.onclick = () => renderSearchableList("📖 قاموس المصطلحات", techGlossary);

// زر عرض سجل البحث
if (btnHistory) {
    btnHistory.onclick = () => {
        if (!searchHistory.length) {
            showModal("🕒 سجل البحث", "<p style='text-align:center; color:#94a3b8;'>السجل فارغ حالياً.</p>");
            return;
        }
        const html = searchHistory.map(h => `
            <div class="history-item">
                <div style="display:flex; justify-content:space-between; color:#64748b; font-size:11px; margin-bottom:2px;">
                    <span>${h.type}</span>
                    <span>${h.time}</span>
                </div>
                <strong style="color:#0f172a;">${h.title}</strong>
            </div>
        `).join('');
        showModal("🕒 سجل البحث والعمليات", html);
    };
}

if (btnRoadmapWeb) btnRoadmapWeb.onclick = () => { showModal("🌐 تطوير الويب", formatMarkdown(roadmapsData.web)); addToHistory("خريطة طريق", "تطوير الويب"); };
if (btnRoadmapMobile) btnRoadmapMobile.onclick = () => { showModal("📱 تطوير التطبيقات", formatMarkdown(roadmapsData.mobile)); addToHistory("خريطة طريق", "تطوير التطبيقات"); };
if (btnRoadmapAi) btnRoadmapAi.onclick = () => { showModal("🤖 الذكاء الاصطناعي", formatMarkdown(roadmapsData.ai)); addToHistory("خريطة طريق", "الذكاء الاصطناعي"); };
