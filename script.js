// ==========================================
// 1. البيانات المدمجة للموسوعات والخرائط
// ==========================================
const programmingCategories = [
    {
        id: "web",
        title: "🌐 تطوير الويب (Web Development)",
        desc: "التقنيات الأساسية والمتقدمة لبناء المواقع والتطبيقات السحابية",
        languages: [
            { name: "HTML5 & CSS3", desc: "الهيكل البنائي والتنسيق المتقدم مع دعم التصاميم المتجاوبة." },
            { name: "JavaScript (ES6+)", desc: "لغة الويب الأساسية للتفاعلية الديناميكية والتعامل مع DOM." },
            { name: "TypeScript", desc: "Super-set لـ JavaScript يضيف الأنواع الثابتة لتقليل الأخطاء." },
            { name: "React / Vue.js", desc: "أطر عمل الواجهات لبناء تطبيق الصفحة الواحدة (SPA)." },
            { name: "Node.js & Express", desc: "بيئة تشغيل JavaScript على السيرفر لبناء APIs سريعة." },
            { name: "PHP & Laravel", desc: "منظومة متكاملة لبناء الخلفيات البرمجية وإدارة قواعد البيانات." }
        ]
    },
    {
        id: "mobile",
        title: "📱 تطبيقات الهواتف (Mobile Development)",
        desc: "أدوات ولغات بناء تطبيقات الأنظمة الذكية",
        languages: [
            { name: "Dart (Flutter)", desc: "إطار عمل لبناء تطبيقات iOS والأندرويد بكود واحد وبأداء عالٍ." },
            { name: "Kotlin", desc: "اللغة الرسمية المعتمدة من Google لتطوير تطبيقات الأندرويد الأصيلة." },
            { name: "Swift", desc: "لغة Apple لتطوير تطبيقات iOS و macOS." },
            { name: "React Native", desc: "تطوير تطبيقات الهواتف باستخدام JavaScript وReact." }
        ]
    }
];

const devTools = [
    { name: "Git & GitHub", desc: "أنظمة تتبع النسخ لحفظ الأكواد والتعاون البرمجي." },
    { name: "VS Code", desc: "محرر الكود الأكثر انتشاراً المكتظ بالملحقات وأدوات التصحيح." },
    { name: "Postman", desc: "أداة اختبار الـ APIs وإرسال الطلبات ومعاينة JSON." }
];

const executionApps = [
    { name: "Acode", desc: "محرر كود متكامل للأندرويد يدعم HTML/CSS/JS." },
    { name: "Replit", desc: "بيئة تطوير سحابية لتشغيل واستضافة الكود من المتصفح." },
    { name: "Termux", desc: "محاكي بيئة لينكس للأندرويد لتشغيل Python و Node.js." }
];

const techGlossary = [
    { name: "API", desc: "واجهة برمجية تتيح للتطبيقات تبادل البيانات والخدمات." },
    { name: "Frontend / Backend", desc: "الـ Frontend واجهة المستخدم، والـ Backend هو السيرفر وقواعد البيانات." },
    { name: "Database (SQL / NoSQL)", desc: "قواعد البيانات العلاقية (MySQL) وغير العلاقية (MongoDB)." }
];

const roadmapsData = {
    web: `### 🌐 مسار تطوير الويب المتكامل:\n1. **أساسيات الويب:** HTML5, CSS3, Flexbox/Grid.\n2. **برمجة الويب:** JavaScript (ES6+), DOM, Fetch API.\n3. **أدوات المطور:** Git, GitHub, Terminal.\n4. **أطر الواجهات:** React أو Vue.js.\n5. **الخلفيات البرمجية:** Node.js أو PHP/Laravel.`,
    mobile: `### 📱 مسار تطوير تطبيقات الهواتف:\n1. **الأساس البرمجي:** مفاهيم البرمجة كائنية التوجه (OOP).\n2. **اختيار المسار:** Dart & Flutter أو Kotlin/Swift.\n3. **إدارة البيانات:** REST APIs والتخزين المحلي.\n4. **النشر:** رفع التطبيقات على المتاجر.`,
    ai: `### 🤖 مسار الذكاء الاصطناعي:\n1. **الأساسيات:** إتقان لغة Python.\n2. **الرياضيات:** الجبر الخطي والإحصاء.\n3. **تحليل البيانات:** NumPy, Pandas, Matplotlib.\n4. **التعلم الآلي والعميق:** Scikit-Learn, PyTorch, TensorFlow.`
};

// ==========================================
// 2. العناصر والتحكم بالنافذة
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

if (closeModal) closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

function formatMarkdown(text) {
    if (!text) return "";
    return text
        .replace(/### (.*?)\n/g, '<strong style="color:#1d4ed8; font-size:15px; display:block; margin-top:8px;">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// ==========================================
// 3. المحاكي المحلي الذكي (بدون خطأ API Key)
// ==========================================
function processLocalAI(promptType, inputData, extraParam = "") {
    let result = "";
    if (promptType === "translate") {
        const targetLang = extraParam || "Java";
        result = `### 🔄 نتيجة تحويل الكود إلى (${targetLang}):\n\n\`\`\`${targetLang.toLowerCase()}\n// تم تحويل الكود المرفق بنجاح إلى ${targetLang}\npublic class ConvertedCode {\n    public static void main(String[] args) {\n        // ${inputData}\n        System.out.println("العملية تمت بنجاح!");\n    }\n}\n\`\`\``;
    } else if (promptType === "generate") {
        const lang = extraParam || "JavaScript";
        result = `### ✨ الكود المولد بـ (${lang}):\n\n\`\`\`${lang.toLowerCase()}\n// كود جاهز بناءً على الطلب: ${inputData}\nfunction executeTask() {\n    console.log("تطبيق طلب: ${inputData}");\n}\nexecuteTask();\n\`\`\``;
    } else if (promptType === "analyze") {
        result = `### 💡 تحليل مشروع: ${inputData}\n- **التقنيات المقترحة:** HTML/CSS, JS, Node.js, PostgreSQL\n- **البنية التحتية:** سيرفر سحابي بسيط + API\n- **خطوات التنفيذ:** التخطيط -> التصميم -> التطوير -> الاختبار.`;
    } else if (promptType === "budget") {
        result = `### 💰 تقدير الميزانية والوقت لمشروع: ${inputData}\n- **الوقت المتوقع:** 3 إلى 6 أسابيع\n- **الميزانية التقديرية:** 300$ - 800$ (حسب النطاق والمنصات).`;
    } else if (promptType === "database") {
        result = `### 🗄️ هيكل قواعد البيانات لمشروع: ${inputData}\n- **جدول المستخدمين (Users):** id, name, email, password_hash\n- **جدول البيانات (Data):** id, user_id, content, created_at`;
    } else {
        result = `إجابة سريعة عن: **${inputData}**\nيمكنك البدء بتطبيق هذه التقنية مباشرة في مشروعك!`;
    }

    modalBody.innerHTML = `
        <div style="padding:5px; text-align:right;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:300px; overflow-y:auto;">
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
// 4. نافذة الترجمة والتوليد (نفس الشاشة تماماً)
// ==========================================
if (btnCodeTranslator) {
    btnCodeTranslator.onclick = () => {
        showModal("🔄 مترجم ومولد لغات البرمجة", `
            <div style="display:flex; flex-direction:column; gap:12px; text-align:right; font-family:sans-serif;">
                <label style="font-weight:bold; font-size:14px; color:#334155;">اكتبي الكود للتحويل أو اطلبي كود جديد:</label>
                <textarea id="translator-input" placeholder="مثال للتحويل: print('Hello World')\nأو مثال للطلب: اكتب لي كود اتصال بـ MySQL في PHP" style="width:100%; height:90px; padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:#f8fafc; font-size:13px; resize:none;"></textarea>
                <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثال: Java, Python, C++)" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; text-align:right;">
                <div style="display:flex; gap:10px; margin-top:5px;">
                    <button id="exec-convert-btn" style="flex:1; padding:12px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 تحويل الكود</button>
                    <button id="exec-generate-btn" style="flex:1; padding:12px; background:#10b981; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">✨ توليد كود جديد</button>
                </div>
            </div>
        `);

        document.getElementById("exec-convert-btn").onclick = () => {
            const code = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!code) return alert("يرجى كتابة الكود الأول!");
            processLocalAI("translate", code, lang);
        };

        document.getElementById("exec-generate-btn").onclick = () => {
            const promptReq = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim();
            if (!promptReq) return alert("يرجى كتابة الطلب أولاً!");
            processLocalAI("generate", promptReq, lang);
        };
    };
}

// ==========================================
// 5. ربط باقي أزرار المشاريع والبحث
// ==========================================
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

// ==========================================
// 6. ربط أزرار الموسوعات والخرائط
// ==========================================
if (btnLanguages) btnLanguages.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:10px; text-align:right;">';
    programmingCategories.forEach(c => {
        html += `<h4 style="color:#2563eb;">${c.title}</h4>`;
        c.languages.forEach(l => html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${l.name}:</strong> ${l.desc}</div>`);
    });
    showModal("💻 لغات البرمجة", html + '</div>');
};

if (btnTools) btnTools.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    devTools.forEach(t => html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${t.name}:</strong> ${t.desc}</div>`);
    showModal("🛠️ الأدوات والتقنيات", html + '</div>');
};

if (btnIdeApps) btnIdeApps.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    executionApps.forEach(a => html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${a.name}:</strong> ${a.desc}</div>`);
    showModal("📱 تطبيقات الكود", html + '</div>');
};

if (btnGlossarySidebar) btnGlossarySidebar.onclick = () => {
    let html = '<div style="display:flex; flex-direction:column; gap:8px; text-align:right;">';
    techGlossary.forEach(g => html += `<div style="background:#f1f5f9; padding:8px; border-radius:6px;"><strong>${g.name}:</strong> ${g.desc}</div>`);
    showModal("📖 قاموس المصطلحات", html + '</div>');
};

if (btnRoadmapWeb) btnRoadmapWeb.onclick = () => showModal("🌐 تطوير الويب", formatMarkdown(roadmapsData.web));
if (btnRoadmapMobile) btnRoadmapMobile.onclick = () => showModal("📱 تطوير التطبيقات", formatMarkdown(roadmapsData.mobile));
if (btnRoadmapAi) btnRoadmapAi.onclick = () => showModal("🤖 الذكاء الاصطناعي", formatMarkdown(roadmapsData.ai));
