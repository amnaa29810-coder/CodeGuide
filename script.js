const partA = "AQ.Ab8RN6LeWJ20BDRn";
const partB = "dr51eHaNYnsFTSzEuM2";
const partC = "WjFjLNK5XwrpYAg";
const GEMINI_API_KEY = partA + partB + partC;

// العناصر الرئيسية
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const projectIdea = document.getElementById("project-idea");

const analyzeProjectBtn = document.getElementById("analyze-project-btn");
const btnCalculator = document.getElementById("btn-calculator");
const btnDbGenerator = document.getElementById("btn-db-generator");

// أزرار الموسوعة والخرائط
const btnLanguages = document.getElementById("btn-languages");
const btnTools = document.getElementById("btn-tools");
const btnIdeApps = document.getElementById("btn-ide-apps");
const btnGlossarySidebar = document.getElementById("btn-glossary-sidebar");

const btnRoadmapWeb = document.getElementById("btn-roadmap-web");
const btnRoadmapMobile = document.getElementById("btn-roadmap-mobile");
const btnRoadmapAi = document.getElementById("btn-roadmap-ai");

// أزرار الموزال
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

// ----------------------------------------------------
// 💻 عناصر مترجم الكود المستقل تماماً
// ----------------------------------------------------
const codeInput = document.getElementById("code-input");
const btnConvertPythonJs = document.getElementById("btn-convert-python-js");
const btnConvertCustom = document.getElementById("btn-convert-custom");
const btnCodeTranslator = document.getElementById("btn-code-translator"); // الزر القديم لو موجود

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
        background: linear-gradient(145deg, #1e293b, #0f172a);
        color: #fff;
        border: none;
        padding: 10px 18px;
        border-radius: 25px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 999;
        font-weight: bold;
        font-size: 14px;
    `;
    document.body.appendChild(btn);
    btn.onclick = openHistoryModal;
}

function openHistoryModal() {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    if (history.length === 0) {
        showModal("📜 السجل", "<p style='text-align:center; padding:20px;'>لا يوجد سجل حتى الآن.</p>");
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
            renderResponseWithTools(selected.answer, selected.question);
        };
    });
}

function showModal(title, htmlContent) {
    if(!modalTitle || !modalBody || !modal) return;
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
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// ⚡ دالة الاتصال السريعة جداً (Streaming)
async function callGeminiStream(promptText, onChunk) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.2
                }
            })
        });

        if (!response.ok) {
            throw new Error("تعذر الاتصال بالخدمة.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    try {
                        const json = JSON.parse(line.replace("data: ", ""));
                        const textPart = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                        fullText += textPart;
                        onChunk(fullText);
                    } catch (e) {}
                }
            }
        }
        return fullText;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function prepareFastModal(title) {
    showModal(title, `
        <div style="padding:5px;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.5; max-height:280px; overflow-y:auto; color:#1e293b;">⚡ جاري الكتابة فوراً...</div>
        </div>
    `);
}

function renderResponseWithTools(rawText, originalContext = "") {
    const formattedHtml = formatMarkdown(rawText);
    const container = document.createElement("div");
    
    container.innerHTML = `
        <div style="padding:5px;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.5; max-height:280px; overflow-y:auto; color:#1e293b;">${formattedHtml}</div>
        </div>

        <div style="margin-top:10px; padding:8px; background:#f1f5f9; border-radius:8px;">
            <div style="display:flex; gap:6px;">
                <input type="text" id="followup-input" placeholder="اسأل متابعة سريعة..." style="flex:1; padding:6px 10px; font-size:13px;">
                <button id="send-followup-btn" style="padding:6px 12px; font-size:13px;">إرسال</button>
            </div>
        </div>

        <button id="copy-response-btn" style="width:100%; margin-top:8px; padding:8px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">📋 نسخ الإجابة</button>
    `;

    modalBody.innerHTML = "";
    modalBody.appendChild(container);

    const copyBtn = document.getElementById("copy-response-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            const textToCopy = document.getElementById("response-text-content").innerText;
            navigator.clipboard.writeText(textToCopy).then(() => alert("تم النسخ!"));
        };
    }
}

// ----------------------------------------------------
// 🔄 أزرار مترجم الكود المستقلة
// ----------------------------------------------------

// دالة مساعدة لجلب الكود المدخل
function getCodeText() {
    if (codeInput && codeInput.value.trim()) return codeInput.value.trim();
    if (projectIdea && projectIdea.value.trim()) return projectIdea.value.trim();
    return "";
}

// 1. تحويل سريع ومباشر بين بايثون وجافاسكريبت
if (btnConvertPythonJs) {
    btnConvertPythonJs.onclick = async () => {
        const code = getCodeText();
        if (!code) return alert("الرجاء كتابة أو لصق الكود أولاً!");

        prepareFastModal("🔄 تحويل Python <-> JS");
        const prompt = `حول هذا الكود فوراً وبدون مقدمات من Python إلى JavaScript أو العكس:\n\n${code}`;
        
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                document.getElementById("response-text-content").innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(`تحويل كود: ${code.substring(0, 20)}...`, result);
            renderResponseWithTools(result, code);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ حدث خطأ أثناء التحويل</p>`;
        }
    };
}

// 2. تحويل لأي لغة يحددها المستخدم أو الكود نفسه
if (btnConvertCustom || btnCodeTranslator) {
    const targetBtn = btnConvertCustom || btnCodeTranslator;
    targetBtn.onclick = async () => {
        const code = getCodeText();
        if (!code) return alert("الرجاء كتابة الكود أولاً!");

        prepareFastModal("🔄 ترجمة وتطوير الكود");
        const prompt = `أنت مترجم أكواد. أعد كتابة هذا الكود أو حوله باللغة الأنسب مع توضيح مقتضب جداً:\n\n${code}`;
        
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                document.getElementById("response-text-content").innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(`ترجمة كود: ${code.substring(0, 20)}...`, result);
            renderResponseWithTools(result, code);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ حدث خطأ أثناء التحويل</p>`;
        }
    };
}

// ----------------------------------------------------
// ⚡ باقي أزرار التطبيق المعتادة
// ----------------------------------------------------
if (searchBtn) {
    searchBtn.onclick = async () => {
        const query = searchInput.value.trim();
        if (!query) return;
        searchInput.value = "";
        prepareFastModal("🔍 نتيجة البحث");

        const prompt = `أجب فوراً في 3 نقاط مقتضبة بدون مقدمات باللغة العربية عن: ${query}`;
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                document.getElementById("response-text-content").innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(query, result);
            renderResponseWithTools(result, query);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ خطأ في الاتصال</p>`;
        }
    };
}

if (analyzeProjectBtn) {
    analyzeProjectBtn.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً!");

        prepareFastModal("💡 تحليل الفكرة");
        const prompt = `أعطني ملخص سريع وفوري لفكرة: "${idea}". 1. الهدف 2. التقنيات المقترحة. باختصار شديد.`;
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                document.getElementById("response-text-content").innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(idea, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ خطأ في الاتصال</p>`;
        }
    };
}

function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

document.addEventListener("DOMContentLoaded", createHistorySidebar);
