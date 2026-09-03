const partA = "AQ.Ab8RN6LeWJ20BDRn";
const partB = "dr51eHaNYnsFTSzEuM2";
const partC = "WjFjLNK5XwrpYAg";
const GEMINI_API_KEY = partA + partB + partC;

// 1. ربط عناصر الواجهة الرئيسية
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const projectIdea = document.getElementById("project-idea");

// أزرار قسم أدوات وتخطيط المشاريع
const analyzeProjectBtn = document.getElementById("analyze-project-btn");
const btnCalculator = document.getElementById("btn-calculator");
const btnDbGenerator = document.getElementById("btn-db-generator");

// أزرار قسم الموسوعات البرمجية
const btnLanguages = document.getElementById("btn-languages");
const btnTools = document.getElementById("btn-tools");
const btnIdeApps = document.getElementById("btn-ide-apps");
const btnGlossarySidebar = document.getElementById("btn-glossary-sidebar");

// أزرار قسم خرائط طريق المبرمج (Roadmaps)
const btnRoadmapWeb = document.getElementById("btn-roadmap-web");
const btnRoadmapMobile = document.getElementById("btn-roadmap-mobile");
const btnRoadmapAi = document.getElementById("btn-roadmap-ai");

// عناصر النافذة المنبثقة (Modal)
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

// ----------------------------------------------------
// ⚙️ وظائف النافذة المنبثقة والتنسيق
// ----------------------------------------------------
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

// ----------------------------------------------------
// ⚡ الاتصال السريع المباشر بالذكاء الاصطناعي (Streaming & Fast Output)
// ----------------------------------------------------
async function callGeminiStream(promptText, onChunk) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { 
                    maxOutputTokens: 1024, // تقليل الحد لاستجابة فورية وسريعة
                    temperature: 0.2 // إجابات مباشرة ومحددة بدون إطالة
                }
            })
        });

        if (!response.ok) throw new Error("تعذر الاتصال بالخدمة.");

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
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:280px; overflow-y:auto; color:#1e293b; text-align:right;">⚡ جاري جلب الإجابة السريعة...</div>
        </div>
    `);
}

function renderResponseWithTools(rawText, originalContext = "") {
    const formattedHtml = formatMarkdown(rawText);
    
    modalBody.innerHTML = `
        <div style="padding:5px;">
            <div id="response-text-content" style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:14px; line-height:1.6; max-height:280px; overflow-y:auto; color:#1e293b; text-align:right;">
                ${formattedHtml}
            </div>
        </div>

        <div style="margin-top:10px; padding:8px; background:#f1f5f9; border-radius:8px;">
            <div style="display:flex; gap:6px;">
                <input type="text" id="followup-input" placeholder="اسأل متابعة سريعة..." style="flex:1; padding:6px 10px; font-size:13px; border:1px solid #cbd5e1; border-radius:6px; outline:none;">
                <button id="send-followup-btn" style="padding:6px 12px; font-size:13px; background:#0f172a; color:#fff; border:none; border-radius:6px; cursor:pointer;">إرسال</button>
            </div>
        </div>

        <button id="copy-response-btn" style="width:100%; margin-top:8px; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">📋 نسخ الإجابة</button>
    `;

    const copyBtn = document.getElementById("copy-response-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            const textToCopy = document.getElementById("response-text-content").innerText;
            navigator.clipboard.writeText(textToCopy).then(() => alert("تم نسخ النتيجة!"));
        };
    }
}

// ----------------------------------------------------
// 🚀 أزرار قسم أدوات وتخطيط المشاريع
// ----------------------------------------------------

// 1. تحليل الفكرة والتقنيات
if (analyzeProjectBtn) {
    analyzeProjectBtn.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");

        prepareFastModal("💡 تحليل الفكرة والتقنيات");

        const prompt = `قدم تحليلاً سريعاً ومباشراً وموجزاً لفكرة المشروع التالية: "${idea}". اذكر في نقاط مركزة: 1. الأهداف والوظائف الأساسية. 2. التقنيات وقواعد البيانات المقترحة. 3. مراحل التنفيذ المباشرة.`;

        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(idea, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ حدث خطأ أثناء الاتصال، حاول مرة أخرى.</p>`;
        }
    };
}

// 2. الميزانية والوقت
if (btnCalculator) {
    btnCalculator.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");

        prepareFastModal("💰 الميزانية والوقت");
        const prompt = `أعط تقدير مالي وزمني مبسط ومباشر بالدولار والأسابيع لتنفيذ: "${idea}".`;
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(`ميزانية: ${idea}`, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ خطأ في الاتصال</p>`;
        }
    };
}

// 3. هيكل قواعد البيانات
if (btnDbGenerator) {
    btnDbGenerator.onclick = async () => {
        const idea = projectIdea ? projectIdea.value.trim() : "";
        if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");

        prepareFastModal("🗄️ هيكل قواعد البيانات");
        const prompt = `اقترح بشكل مباشر وسريع جداً الجداول والحقول الأساسية (Database Schema) لتطبيق: "${idea}".`;
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(`Schema: ${idea}`, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ خطأ في الاتصال</p>`;
        }
    };
}

// ----------------------------------------------------
// 📚 أزرار موسوعات البرمجة للبيانات المخزنة
// ----------------------------------------------------
function setupInternalSearch(dataArray, renderFunction) {
    const searchBoxHtml = `
        <input type="text" id="modal-internal-search" placeholder="🔍 بحث سريع..." 
               style="width:100%; padding:10px 12px; margin-bottom:14px; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-size:13px; box-sizing:border-box;">
        <div id="modal-items-container"></div>
    `;
    return { searchBoxHtml, bindEvent: () => {
        const input = document.getElementById("modal-internal-search");
        const container = document.getElementById("modal-items-container");
        
        const updateList = (filterText = "") => {
            if (!dataArray) return;
            const filtered = dataArray.filter(item => 
                item.name.toLowerCase().includes(filterText.toLowerCase()) || 
                (item.desc && item.desc.toLowerCase().includes(filterText.toLowerCase()))
            );
            container.innerHTML = renderFunction(filtered);

            document.querySelectorAll(".copy-item-btn").forEach(btn => {
                btn.onclick = (e) => {
                    const textToCopy = e.target.getAttribute("data-copy");
                    navigator.clipboard.writeText(textToCopy).then(() => alert("تم النسخ!"));
                };
            });
        };
        
        updateList();
        if (input) input.oninput = (e) => updateList(e.target.value);
    }};
}

if (btnLanguages) {
    btnLanguages.onclick = () => {
        if (typeof programmingCategories === 'undefined') return;
        let categoriesHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px; text-align:center;">اختر المجال لعرض اللغات الخاصة به:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
        `;

        programmingCategories.forEach(cat => {
            categoriesHtml += `
                <button class="cat-select-btn" data-id="${cat.id}" style="text-align:right; width:100%; background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; padding: 12px; border-radius:10px; cursor:pointer;">
                    <div style="font-size:15px; font-weight:bold; color:#1d4ed8;">${cat.title}</div>
                    <div style="font-size:12px; color:#64748b; margin-top:3px;">${cat.desc}</div>
                </button>
            `;
        });
        categoriesHtml += `</div>`;

        showModal("💻 موسوعة أقسام لغات البرمجة", categoriesHtml);

        document.querySelectorAll(".cat-select-btn").forEach(btn => {
            btn.onclick = () => {
                const catId = btn.getAttribute("data-id");
                const selectedCat = programmingCategories.find(c => c.id === catId);
                
                const searchSetup = setupInternalSearch(selectedCat.languages, (items) => {
                    return items.map(item => `
                        <div style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:10px; margin-bottom:10px;">
                            <h4 style="color:#1d4ed8; margin-bottom:6px;">${item.name}</h4>
                            <div style="font-size:13px; color:#334155; line-height:1.6;">${formatMarkdown(item.desc)}</div>
                            <button class="copy-item-btn" data-copy="${item.name}\n${item.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;">📋 نسخ المعلومات</button>
                        </div>
                    `).join('');
                });

                const fullViewHtml = `
                    <button id="back-to-cats" style="margin-bottom:12px; padding:6px 12px; font-size:12px; background:#64748b; color:#fff; border:none; border-radius:6px; cursor:pointer;">⬅ العودة للأقسام</button>
                    ${searchSetup.searchBoxHtml}
                `;
                
                showModal(selectedCat.title, fullViewHtml);
                searchSetup.bindEvent();

                const backBtn = document.getElementById("back-to-cats");
                if (backBtn) backBtn.onclick = () => btnLanguages.click();
            };
        });
    };
}

if (btnTools) {
    btnTools.onclick = () => {
        if (typeof devTools === 'undefined') return;
        const searchSetup = setupInternalSearch(devTools, (items) => {
            return items.map(item => `
                <div style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:10px; margin-bottom:10px;">
                    <h4 style="color:#1d4ed8; margin-bottom:6px;">${item.name}</h4>
                    <div style="font-size:13px; color:#334155; line-height:1.6;">${formatMarkdown(item.desc)}</div>
                    <button class="copy-item-btn" data-copy="${item.name}\n${item.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;">📋 نسخ</button>
                </div>
            `).join('');
        });
        showModal("🛠️ الأدوات والتقنيات", searchSetup.searchBoxHtml);
        searchSetup.bindEvent();
    };
}

if (btnIdeApps) {
    btnIdeApps.onclick = () => {
        if (typeof executionApps === 'undefined') return;
        const searchSetup = setupInternalSearch(executionApps, (items) => {
            return items.map(app => `
                <div style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:10px; margin-bottom:10px;">
                    <h4 style="color:#1d4ed8; margin-bottom:4px;">${app.name}</h4>
                    <div style="font-size:13px; color:#334155; line-height:1.6;">${formatMarkdown(app.desc)}</div>
                    <button class="copy-item-btn" data-copy="${app.name}\n${app.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;">📋 نسخ</button>
                </div>
            `).join('');
        });
        showModal("📱 تطبيقات ومحررات الكود", searchSetup.searchBoxHtml);
        searchSetup.bindEvent();
    };
}

if (btnGlossarySidebar) {
    btnGlossarySidebar.onclick = () => {
        if (typeof techGlossary === 'undefined') return;
        const searchSetup = setupInternalSearch(techGlossary, (items) => {
            return items.map(item => `
                <div style="background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:10px; margin-bottom:10px;">
                    <h4 style="color:#059669; margin-bottom:6px;">📌 ${item.name}</h4>
                    <div style="font-size:13px; color:#334155; line-height:1.6;">${formatMarkdown(item.desc)}</div>
                    <button class="copy-item-btn" data-copy="${item.name}: ${item.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px; background:#059669; color:#fff; border:none; border-radius:6px; cursor:pointer;">📋 نسخ المصطلح</button>
                </div>
            `).join('');
        });
        showModal("📖 قاموس المصطلحات", searchSetup.searchBoxHtml);
        searchSetup.bindEvent();
    };
}

// 🗺️ أزرار خرائط الطريق
if (btnRoadmapWeb) {
    btnRoadmapWeb.onclick = () => {
        if (typeof roadmapsData === 'undefined') return;
        showModal("🌐 تطوير الويب", "");
        renderResponseWithTools(roadmapsData.web, "خارطة طريق الويب");
    };
}

if (btnRoadmapMobile) {
    btnRoadmapMobile.onclick = () => {
        if (typeof roadmapsData === 'undefined') return;
        showModal("📱 تطوير التطبيقات", "");
        renderResponseWithTools(roadmapsData.mobile, "خارطة طريق التطبيقات");
    };
}

if (btnRoadmapAi) {
    btnRoadmapAi.onclick = () => {
        if (typeof roadmapsData === 'undefined') return;
        showModal("🤖 الذكاء الاصطناعي", "");
        renderResponseWithTools(roadmapsData.ai, "خارطة طريق الذكاء الاصطناعي");
    };
}

// 🔍 شريط البحث العلوي
if (searchBtn) {
    searchBtn.onclick = async () => {
        const query = searchInput.value.trim();
        if (!query) return;
        searchInput.value = "";
        prepareFastModal("🔍 نتيجة البحث");

        const prompt = `أجب فوراً بإيجاز وسرعة في نقاط عن: ${query}`;
        try {
            const result = await callGeminiStream(prompt, (currentText) => {
                const textElem = document.getElementById("response-text-content");
                if (textElem) textElem.innerHTML = formatMarkdown(currentText);
            });
            saveChatToHistory(query, result);
            renderResponseWithTools(result, query);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444;">❌ خطأ في الاتصال</p>`;
        }
    };
}

// 📜 دالة زر السجل
function createHistorySidebar() {
    if (document.getElementById("chat-history-trigger")) return;

    const btn = document.createElement("button");
    btn.id = "chat-history-trigger";
    btn.innerHTML = "☰ السجل";
    btn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px;
        background: linear-gradient(145deg, #1e293b, #0f172a);
        color: #fff; border: none; padding: 10px 18px;
        border-radius: 25px; box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        cursor: pointer; z-index: 999; font-weight: bold; font-size: 14px;
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

function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

document.addEventListener("DOMContentLoaded", createHistorySidebar);
