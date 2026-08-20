const partA = "AQ.Ab8RN6LeWJ20BDRn";
const partB = "dr51eHaNYnsFTSzEuM2";
const partC = "WjFjLNK5XwrpYAg";
const GEMINI_API_KEY = partA + partB + partC;

// التعديل الهام: استخدام النموذج الأسرع والأصح
const API_MODEL = "gemini-1.5-flash"; 

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const projectIdea = document.getElementById("project-idea");
const analyzeProjectBtn = document.getElementById("analyze-project-btn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

// تفعيل الوضع الليلي
const themeToggleBtn = document.getElementById("theme-toggle-btn");
if (themeToggleBtn) {
    themeToggleBtn.onclick = () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeToggleBtn.innerText = isDark ? "☀️ الوضع الفاتح" : "🌙 الوضع الليلي";
    };
}

function showModal(title, htmlContent) {
    modalTitle.innerText = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");

function formatMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
}

async function callGemini(promptText) {
    // التعديل: استخدام النموذج الصحيح
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    // إجبار النموذج على السرعة والاختصار
    const optimizedPrompt = `أجب بإيجاز شديد وبشكل مباشر. لا تطل الكلام.:\n${promptText}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: optimizedPrompt }] }] })
    });

    if (!response.ok) throw new Error("تعذر الاتصال بالخدمة.");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// عرض الاستجابة مع PDF والنسخ
function renderResponseWithTools(rawText, originalContext = "") {
    const formattedHtml = formatMarkdown(rawText);
    const container = document.createElement("div");
    
    container.innerHTML = `
        <div id="pdf-export-area" style="padding:10px;">
            <div id="response-text-content" style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:300px; overflow-y:auto; color:#1e293b;">${formattedHtml}</div>
        </div>

        <div style="margin-top:12px; padding:10px; background:#f1f5f9; border-radius:8px; border:1px solid #cbd5e1;">
            <label style="font-size:12px; font-weight:bold; color:#334155; display:block; margin-bottom:5px;">💬 استفسار إضافي:</label>
            <div style="display:flex; gap:6px;">
                <input type="text" id="followup-input" placeholder="اكتب سؤالك..." style="flex:1; padding:8px 10px; border:1px solid #94a3b8; border-radius:6px; font-size:13px; outline:none;">
                <button id="send-followup-btn" style="padding:8px 14px; background:#1d4ed8; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">إرسال</button>
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:10px;">
            <button id="export-pdf-btn" style="flex:1; padding:10px; background:#059669; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">📄 تصدير PDF</button>
            <button id="copy-response-btn" style="flex:1; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">📋 نسخ</button>
        </div>
    `;

    modalBody.innerHTML = "";
    modalBody.appendChild(container);

    // تفعيل إرسال الاستفسار
    document.getElementById("send-followup-btn").onclick = async () => {
        const input = document.getElementById("followup-input");
        const query = input.value.trim();
        if (!query) return;
        const currentText = document.getElementById("response-text-content").innerText;
        showModal("💡 جاري التوضيح...", "...");
        try {
            const result = await callGemini(`السياق:\n${currentText}\nسؤال المتابعة:\n${query}`);
            const updatedAnswer = `${currentText}\n\n📌 **سؤال:** ${query}\n💡 **الجواب:**\n${result}`;
            saveChatToHistory(`متابعة: ${query}`, updatedAnswer);
            renderResponseWithTools(updatedAnswer, originalContext);
        } catch (err) { modalBody.innerHTML = "❌ خطأ في الاتصال"; }
    };

    // تصدير PDF بطريقة أكثر ثباتاً
    document.getElementById("export-pdf-btn").onclick = () => {
        if (typeof html2pdf === 'undefined') {
            alert("مكتبة PDF غير محملة، تأكد من الاتصال بالإنترنت!");
            return;
        }
        const element = document.getElementById('pdf-export-area');
        const opt = {
            margin: 10,
            filename: 'تحليل_المشروع.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    document.getElementById("copy-response-btn").onclick = () => {
        navigator.clipboard.writeText(document.getElementById("response-text-content").innerText).then(() => alert("تم النسخ!"));
    };
}

// الأزرار الرئيسية
searchBtn.onclick = async () => {
    const query = searchInput.value.trim();
    if (!query) return;
    showModal("🔍 نتيجة البحث", "جاري الجلب...");
    try {
        const result = await callGemini(query);
        saveChatToHistory(query, result);
        renderResponseWithTools(result, query);
    } catch (err) { showModal("خطأ", "تعذر الاتصال"); }
};

analyzeProjectBtn.onclick = async () => {
    const idea = projectIdea.value.trim();
    if (!idea) return;
    showModal("💡 تحليل الفكرة", "جاري التحليل...");
    try {
        const result = await callGemini(`حلل فكرة المشروع التالية واقترح التقنيات والخطوات:\n"${idea}"`);
        saveChatToHistory(idea, result);
        renderResponseWithTools(result, idea);
    } catch (err) { showModal("خطأ", "تعذر الاتصال"); }
};
