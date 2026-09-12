let searchHistory = JSON.parse(localStorage.getItem("app_history") || "[]");

function addToHistory(type, title) {
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    searchHistory.unshift({ type, title, time });
    if (searchHistory.length > 20) searchHistory.pop();
    localStorage.setItem("app_history", JSON.stringify(searchHistory));
}

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
        .replace(/### (.*?)\n/g, '<strong style="color:#2563eb; font-size:14px; display:block; margin-top:8px;">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// دالة عرض النتيجة ومرفق معها حقل الاستفسار والأسئلة الإضافية
function renderResultWithFollowUp(title, initialText, typeLabel) {
    addToHistory(typeLabel, title);
    
    const renderContent = (text) => {
        modalBody.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:right;">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:10px; font-size:13px; line-height:1.6; max-height:260px; overflow-y:auto; color:#1e293b;">
                    ${formatMarkdown(text)}
                </div>
                
                <div style="border-top:1px solid #f1f5f9; padding-top:10px; margin-top:4px;">
                    <label style="font-size:12px; font-weight:bold; color:#64748b; margin-bottom:6px; display:block;">💬 هل لديك استفسار حول هذه الإجابة؟</label>
                    <div style="display:flex; gap:6px;">
                        <input type="text" id="follow-up-input" placeholder="اكتب استفسارك هنا..." style="flex:1; padding:8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;">
                        <button id="follow-up-btn" style="background:#2563eb; color:white; border:none; padding:8px 12px; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer;">إرسال</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("follow-up-btn").onclick = () => {
            const query = document.getElementById("follow-up-input").value.trim();
            if (!query) return;
            const updatedText = text + `\n\n### ❓ استفسارك: ${query}\n- **الإجابة:** بناءً على استفسارك، يتم تطبيق المفهوم عبر التأكد من ضبط المتغيرات وقواعد الربط بشكل صحيح.`;
            renderContent(updatedText);
        };
    };

    showModal(title, "");
    renderContent(initialText);
}

// عرض الخرائط مع صندوق الاستفسار والبحث الخاص بها
function showRoadmapWithSearch(title, roadmapData, typeLabel) {
    addToHistory(typeLabel, title);
    
    const renderRoadmap = (dataText) => {
        modalBody.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:right;">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px; border-radius:8px;">
                    <input type="text" id="roadmap-query" placeholder="🔍 اسأل عن أي خطوة في هذه الخريطة..." style="width:100%; padding:8px; font-size:12px; border:1px solid #cbd5e1; border-radius:6px;">
                    <button id="roadmap-ask-btn" style="width:100%; margin-top:6px; background:#10b981; color:white; border:none; padding:8px; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer;">اسأل حول الخريطة</button>
                </div>

                <div id="roadmap-content" style="background:#ffffff; border:1px solid #e2e8f0; padding:12px; border-radius:10px; font-size:13px; line-height:1.6; max-height:260px; overflow-y:auto; color:#1e293b;">
                    ${formatMarkdown(dataText)}
                </div>
            </div>
        `;

        document.getElementById("roadmap-ask-btn").onclick = () => {
            const q = document.getElementById("roadmap-query").value.trim();
            if(!q) return;
            const newContent = dataText + `\n\n### 💡 توضيح خاص بـ (${q}):\nتتطلب هذه الخطوة التركيز على التطبيق العملي والمشاريع الصغيرة لترسيخ المفاهيم.`;
            renderRoadmap(newContent);
        };
    };

    showModal(title, "");
    renderRoadmap(roadmapData);
}

// ==========================================
// الأزرار والعمليات
// ==========================================
if (btnCodeTranslator) {
    btnCodeTranslator.onclick = () => {
        showModal("🔄 مترجم لغات البرمجة", `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:right;">
                <textarea id="translator-input" placeholder="اكتب الكود للتحويل أو اطلب كوداً جديداً..." style="width:100%; height:75px; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px; resize:none;"></textarea>
                <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثل: Java, Python)" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:8px; font-size:12px;">
                <button id="exec-btn" style="padding:10px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:12px;">تنفيذ الطلب</button>
            </div>
        `);

        document.getElementById("exec-btn").onclick = () => {
            const code = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim() || "Java";
            if (!code) return alert("اكتب الكود أو الطلب أولاً!");
            
            const res = `### 🔄 النتيجة بـ (${lang}):\n\`\`\`${lang.toLowerCase()}\n// تنفيذ الكود المطلوب\nconsole.log("${code}");\n\`\`\``;
            renderResultWithFollowUp(`ترجمة/توليد إلى ${lang}`, res, "تحويل كود");
        };
    };
}

if (analyzeProjectBtn) analyzeProjectBtn.onclick = () => {
    const val = projectIdea ? projectIdea.value.trim() : "";
    if (!val) return alert("اكتبي الفكرة أولاً!");
    renderResultWithFollowUp("💡 تحليل الفكرة", `### تحليل فكرة: ${val}\n- **التقنيات المقترحة:** HTML/CSS, JS, Node.js\n- **قواعد البيانات:** PostgreSQL\n- **الخطوات:** تصميم الواجهات ثم إعداد السيرفر.`, "تحليل مشروع");
};

if (btnCalculator) btnCalculator.onclick = () => {
    const val = projectIdea ? projectIdea.value.trim() : "";
    if (!val) return alert("اكتبي الفكرة أولاً!");
    renderResultWithFollowUp("💰 الميزانية والوقت", `### تقدير المشروع: ${val}\n- **الوقت المتوقع:** 3 أسابيع\n- **الميزانية التقديرية:** 250$ - 400$`, "الميزانية والوقت");
};

if (btnDbGenerator) btnDbGenerator.onclick = () => {
    const val = projectIdea ? projectIdea.value.trim() : "";
    if (!val) return alert("اكتبي الفكرة أولاً!");
    renderResultWithFollowUp("🗄️ قواعد البيانات", `### تصميم البيانات لـ: ${val}\n- **جدول المستخدمين:** id, name, email\n- **جدول الطلبات:** id, user_id, status`, "قواعد البيانات");
};

if (searchBtn) searchBtn.onclick = () => {
    const val = searchInput ? searchInput.value.trim() : "";
    if (!val) return;
    renderResultWithFollowUp("🔍 نتيجة البحث", `### نتيجة البحث عن: ${val}\nتعتبر هذه التقنية أساسية ومهمة للبدء في تطوير التطبيقات الحديثة.`, "بحث سريع");
};

// الموسوعات القادمة من data.js
if (btnLanguages) btnLanguages.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    programmingCategories.forEach(c => {
        html += `<strong style="color:#2563eb; font-size:13px;">${c.title}</strong>`;
        c.languages.forEach(l => html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; font-size:12px;"><strong>${l.name}:</strong> ${l.desc}</div>`);
    });
    showModal("💻 لغات البرمجة", html + '</div>');
};

if (btnTools) btnTools.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    devTools.forEach(t => html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; font-size:12px;"><strong>${t.name}:</strong> ${t.desc}</div>`);
    showModal("🛠️ الأدوات والتقنيات", html + '</div>');
};

if (btnIdeApps) btnIdeApps.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    executionApps.forEach(a => html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; font-size:12px;"><strong>${a.name}:</strong> ${a.desc}</div>`);
    showModal("📱 تطبيقات الكود", html + '</div>');
};

if (btnGlossarySidebar) btnGlossarySidebar.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    techGlossary.forEach(g => html += `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; font-size:12px;"><strong>${g.name}:</strong> ${g.desc}</div>`);
    showModal("📖 قاموس المصطلحات", html + '</div>');
};

// سجل البحث الأسود
if (btnHistory) {
    btnHistory.onclick = () => {
        if (!searchHistory.length) return showModal("≡ السجل", "<p style='text-align:center; color:#94a3b8; font-size:13px;'>السجل فارغ حالياً.</p>");
        const html = searchHistory.map(h => `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:6px; margin-bottom:6px; text-align:right; font-size:12px;">
                <div style="display:flex; justify-content:space-between; color:#64748b; font-size:10px;"><span>${h.type}</span><span>${h.time}</span></div>
                <strong>${h.title}</strong>
            </div>
        `).join('');
        showModal("≡ سجل العمليات", html);
    };
}

// خرائط الطريق المزودة بمربع بحث
if (btnRoadmapWeb) btnRoadmapWeb.onclick = () => showRoadmapWithSearch("🌐 تطوير الويب", roadmapsData.web, "خريطة طريق");
if (btnRoadmapMobile) btnRoadmapMobile.onclick = () => showRoadmapWithSearch("📱 تطوير التطبيقات", roadmapsData.mobile, "خريطة طريق");
if (btnRoadmapAi) btnRoadmapAi.onclick = () => showRoadmapWithSearch("🤖 الذكاء الاصطناعي", roadmapsData.ai, "خريطة طريق");
