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

function setupInternalSearch(dataArray, renderFunction) {
    const searchBoxHtml = `
        <input type="text" id="modal-internal-search" placeholder="🔍 بحث سريع..." 
               style="width:100%; padding:10px 12px; margin-bottom:14px; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-size:13px;">
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
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        alert("تم النسخ!");
                    });
                };
            });
        };
        
        updateList();
        if (input) input.oninput = (e) => updateList(e.target.value);
    }};
}

// 💻 لعرض أقسام ولغات البرمجة
if (btnLanguages) {
    btnLanguages.onclick = () => {
        if (typeof programmingCategories === 'undefined') return;
        let categoriesHtml = `
            <p style="font-size:14px; color:#64748b; margin-bottom:15px; text-align:center;">اختر المجال المُراد لعرض كافة اللغات والشرح التفصيلي الخاص بها:</p>
            <div style="display:flex; flex-direction:column; gap:12px;">
        `;

        programmingCategories.forEach(cat => {
            categoriesHtml += `
                <button class="cat-select-btn" data-id="${cat.id}" style="text-align:right; width:100%; justify-content:start; background: linear-gradient(145deg, #ffffff, #f1f5f9); color: #1e293b; border: 1px solid #cbd5e1; padding: 14px; border-radius:12px;">
                    <div style="font-size:16px; font-weight:bold; color:#1d4ed8;">${cat.title}</div>
                    <div style="font-size:12px; color:#64748b; font-weight:normal; margin-top:4px;">${cat.desc}</div>
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
                            <button class="copy-item-btn" data-copy="${item.name}\n${item.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px;">📋 نسخ معلومات اللغة</button>
                        </div>
                    `).join('');
                });

                const fullViewHtml = `
                    <button id="back-to-cats" style="margin-bottom:12px; padding:6px 12px; font-size:12px; background:#64748b;">⬅ العودة للأقسام</button>
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
                    <button class="copy-item-btn" data-copy="${item.name}\n${item.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px;">📋 نسخ</button>
                </div>
            `).join('');
        });
        showModal("🛠️ موسوعة الأدوات والتقنيات", searchSetup.searchBoxHtml);
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
                    <button class="copy-item-btn" data-copy="${app.name}\n${app.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px;">📋 نسخ</button>
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
                    <button class="copy-item-btn" data-copy="${item.name}: ${item.desc}" style="margin-top:8px; width:100%; padding:6px; font-size:12px; background:linear-gradient(145deg, #10b981, #059669);">📋 نسخ المصطلح</button>
                </div>
            `).join('');
        });
        showModal("📖 قاموس مصطلحات المطورين", searchSetup.searchBoxHtml);
        searchSetup.bindEvent();
    };
}

// الخرائط البرمجية
if (btnRoadmapWeb) {
    btnRoadmapWeb.onclick = () => {
        if (typeof roadmapsData === 'undefined') return;
        showModal("🌐 خارطة طريق الويب", "");
        renderResponseWithTools(roadmapsData.web, "خارطة طريق الويب");
    };
}

if (btnRoadmapMobile) {
    btnRoadmapMobile.onclick = () => {
        if (typeof roadmapsData === 'undefined') return;
        showModal("📱 خارطة طريق التطبيقات", "");
        renderResponseWithTools(roadmapsData.mobile, "خارطة طريق التطبيقات");
    };
}

if (btnRoadmapAi) {
    btnRoadmapAi.onclick = () => {
        if (typeof roadmapsData === 'undefined') return;
        showModal("🤖 خارطة طريق الذكاء الاصطناعي", "");
        renderResponseWithTools(roadmapsData.ai, "خارطة طريق الذكاء الاصطناعي");
    };
}

function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ question, answer, date: new Date().toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// 🛠️ دالة الاتصال المحدثة مع نموذج gemini-3.6-flash المطلوب
async function callGemini(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("تفاصيل الخطأ:", errorData);
            throw new Error(errorData.error?.message || "تعذر الاتصال بالخدمة.");
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Error fetching Gemini API:", err);
        throw err;
    }
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

    const sendFollowupBtn = document.getElementById("send-followup-btn");
    if (sendFollowupBtn) {
        sendFollowupBtn.onclick = async () => {
            const input = document.getElementById("followup-input");
            const query = input.value.trim();
            if (!query) return;

            const currentText = document.getElementById("response-text-content").innerText;
            showModal("⚡ جاري الرد...", "<p style='text-align:center; padding:15px;'>لحظات...</p>");

            try {
                const prompt = `السياق: "${currentText}"\nالسؤال: "${query}"\nأجب بسرعة وفي نقاط موجزة جداً باللغة العربية.`;
                const result = await callGemini(prompt);
                
                const updatedAnswer = `${currentText}\n\n---\n📌 **سؤال:** ${query}\n💡 **الجواب:**\n${result}`;
                saveChatToHistory(`متابعة: ${query}`, updatedAnswer);
                renderResponseWithTools(updatedAnswer, originalContext);
            } catch (err) {
                modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
            }
        };
    }

    const copyBtn = document.getElementById("copy-response-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            const textToCopy = document.getElementById("response-text-content").innerText;
            navigator.clipboard.writeText(textToCopy).then(() => alert("تم النسخ!"));
        };
    }
}

// البحث السريع
if (searchBtn) {
    searchBtn.onclick = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchInput.value = "";
        showModal("🔍 نتيجة البحث", "<p style='text-align:center; padding:15px;'>⚡ جاري الإجابة السريعة...</p>");

        try {
            const prompt = `أجب بإيجاز وسرعة شديدة وفي نقاط مباشرة باللغة العربية على:\n"${query}"`;
            const result = await callGemini(prompt);
            saveChatToHistory(query, result);
            renderResponseWithTools(result, query);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
        }
    };
}

if (analyzeProjectBtn) {
    analyzeProjectBtn.onclick = async () => {
        const idea = projectIdea.value.trim();
        if (!idea) {
            alert("يرجى كتابة الفكرة أولاً في صندوق النص أعلاه!");
            return;
        }

        showModal("💡 تحليل الفكرة", "<p style='text-align:center; padding:15px;'>⚡ جاري التحليل السريع...</p>");

        try {
            const prompt = `حلل فكرة المشروع التالية واقترح التقنيات والخطوات بشكل مختصر وسريع جداً:\n"${idea}"`;
            const result = await callGemini(prompt);
            saveChatToHistory(idea, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
        }
    };
}

if (btnCalculator) {
    btnCalculator.onclick = async () => {
        const idea = projectIdea.value.trim();
        if (!idea) {
            alert("يرجى كتابة فكرة المشروع في صندوق النص أعلاه أولاً للحساب مباشرة!");
            return;
        }

        showModal("💰 التكلفة والوقت", "<p style='text-align:center; padding:15px;'>⚡ جاري الحساب السريع...</p>");

        try {
            const prompt = `قدم تقدير مالي وزمني مختصر جداً بالدولار والأسابيع للفكرة التالية:\n"${idea}"`;
            const result = await callGemini(prompt);
            saveChatToHistory(`ميزانية: ${idea}`, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
        }
    };
}

if (btnDbGenerator) {
    btnDbGenerator.onclick = async () => {
        const idea = projectIdea.value.trim();
        if (!idea) {
            alert("يرجى كتابة فكرة المشروع في صندوق النص أعلاه أولاً لتوليد القواعد مباشرة!");
            return;
        }

        showModal("🗄️ قواعد البيانات", "<p style='text-align:center; padding:15px;'>⚡ جاري توليد الجداول والعلاقات...</p>");

        try {
            const prompt = `أعطني جداول وعلاقات قواعد البيانات (Schema) بشكل موجز ومباشر للفكرة التالية:\n"${idea}"`;
            const result = await callGemini(prompt);
            saveChatToHistory(`Schema: ${idea}`, result);
            renderResponseWithTools(result, idea);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
        }
    };
}

if (btnCodeTranslator) {
    btnCodeTranslator.onclick = async () => {
        const codeText = projectIdea.value.trim();
        if (!codeText) {
            alert("يرجى كتابة الكود أو تحديد اللغات المراد الترجمة إليها في صندوق النص أعلاه (مثال: حول هذا الكود من Python إلى JavaScript...)");
            return;
        }

        showModal("🔄 ترجمة الكود البرمجي", "<p style='text-align:center; padding:15px;'>⚡ جاري ترجمة الكود وإعادة صياغته...</p>");

        try {
            const prompt = `أنت مترجم أكواد برمجة محترف. قُم ببرمجة أو ترجمة الكود التالي للغة المطلوبة بشكل نظيف ومباشر مع شرح مختصر جداً:\n"${codeText}"`;
            const result = await callGemini(prompt);
            saveChatToHistory(`ترجمة كود: ${codeText.substring(0, 30)}...`, result);
            renderResponseWithTools(result, codeText);
        } catch (err) {
            modalBody.innerHTML = `<p style="color:#ef4444; font-weight:700;">❌ ${err.message}</p>`;
        }
    };
}

document.addEventListener("DOMContentLoaded", createHistorySidebar);
createHistorySidebar();
