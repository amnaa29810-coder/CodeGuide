const partA = "AQ.Ab8RN6LeWJ20BDRn";
const partB = "dr51eHaNYnsFTSzEuM2";
const partC = "WjFjLNK5XwrpYAg";
const GEMINI_API_KEY = partA + partB + partC;

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

// ⚡ دالة الاتصال المباشرة السريعة للغاية مع تحديد حد أقصى للرد الكلمات (Max Tokens)
async function callGeminiStream(promptText, onChunk) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                    maxOutputTokens: 300, // تحديد حجم الإجابة لتظهر فوراً
                    temperature: 0.2 // تقليل وقت التفكير
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
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.5; max-height:280px; overflow-y:auto; color:#1e293b;">⚡ جاري كتابة الإجابة فوراً...</div>
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

// ⚡ الأزرار السريعة
if (searchBtn) {
    searchBtn.onclick = async () => {
        const query = searchInput.value.trim();
        if (!query) return;
        searchInput.value = "";
        prepareFastModal("🔍 نتيجة البحث");

        const prompt = `أجب فوراً في 3 نقاط مقتضبة جداً بدون مقدمات باللغة العربية عن: ${query}`;
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
        const idea = projectIdea.value.trim();
        if (!idea) return alert("اكتبي الفكرة أولاً!");

        prepareFastModal("💡 تحليل الفكرة");
        const prompt = `أعطني ملخص سريع وفوري لفكرة: "${idea}". 1. الهدف 2. التقنيات المقترحة. باختصار شديد دون مقدمات.`;
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
