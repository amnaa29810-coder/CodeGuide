// ==========================================
// 1. إدارة مفتاح الـ API وتنقيتها تلقائياً
// ==========================================
function getApiKey() {
    let rawKey = localStorage.getItem("user_gemini_api_key") || "";
    rawKey = rawKey.replace(/^api_key\s*[:=]\s*/i, "").trim();
    return rawKey;
}

function openSettingsModal() {
    const currentKey = getApiKey();
    const htmlContent = `
        <div style="display:flex; flex-direction:column; gap:14px; text-align:right;">
            <p style="font-size:13px; color:#475569; line-height:1.6;">
                أدخلي مفتاح الـ API الخاص بك المخزن.
            </p>
            
            <div style="background:#f8fafc; padding:10px; border-radius:10px; border:1px solid #e2e8f0; font-size:12.5px;">
                🔗 للحصول على مفتاح جديد مجاناً:
                <br><a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#2563eb; font-weight:bold; text-decoration:underline; display:inline-block; margin-top:6px;">اضغط هنا لفتح Google AI Studio</a>
            </div>

            <label style="font-size:13px; font-weight:bold; color:#1e293b;">مفتاح الـ API:</label>
            <input type="text" id="api-key-input" value="${currentKey}" placeholder="ألصقي المفتاح هنا..." 
                   style="width:100%; padding:11px 14px; border:1px solid #cbd5e1; border-radius:10px; outline:none; font-size:13px; background:#f8fafc; direction:ltr; text-align:left;">

            <div style="display:flex; gap:8px; margin-top:5px;">
                <button id="save-api-key-btn" style="flex:1; padding:11px; background:#059669; color:#fff; border:none; border-radius:10px; font-weight:bold; font-size:13px; cursor:pointer;">💾 حفظ المفتاح</button>
                <button id="clear-api-key-btn" style="padding:11px 16px; background:#ef4444; color:#fff; border:none; border-radius:10px; font-weight:bold; font-size:13px; cursor:pointer;">حذف القديم</button>
            </div>
        </div>
    `;
    showModal("⚙️ إعدادات مفتاح الذكاء الاصطناعي", htmlContent);

    document.getElementById("save-api-key-btn").onclick = () => {
        let val = document.getElementById("api-key-input").value.trim();
        val = val.replace(/^api_key\s*[:=]\s*/i, "").trim();
        if (!val) return alert("يرجى إدخال مفتاح صحيح!");
        localStorage.setItem("user_gemini_api_key", val);
        alert("تم تحديث وحفظ المفتاح بنجاح! ✅");
        hideModal();
    };

    document.getElementById("clear-api-key-btn").onclick = () => {
        localStorage.removeItem("user_gemini_api_key");
        document.getElementById("api-key-input").value = "";
        alert("تم حذف المفتاح تماماً.");
    };
}

// ==========================================
// 2. التحكم بالنافذة المنبثقة (Modal)
// ==========================================
function getModalElements() {
    return {
        modal: document.getElementById("modal"),
        closeModal: document.getElementById("close-modal"),
        modalTitle: document.getElementById("modal-title"),
        modalBody: document.getElementById("modal-body")
    };
}

function showModal(title, htmlContent) {
    const { modal, modalTitle, modalBody } = getModalElements();
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.innerText = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.remove("hidden");
}

function hideModal() {
    const { modal } = getModalElements();
    if (modal) {
        modal.classList.add("hidden");
    }
}

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
// 3. الاتصال المطور بـ Gemini API مع معالجة حليفة للنماذج
// ==========================================
async function callGeminiStream(promptText, onChunk) {
    const apiKey = getApiKey();
    if (!apiKey) {
        openSettingsModal();
        throw new Error("⚠️ يرجى إدخال مفتاح الـ API أولاً من زر الإعدادات (⚙️) بالأعلى.");
    }

    // تجربة أحدث النماذج المتاحة بترتيب الاستقرار
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let lastError = "";

    for (const model of models) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتم الحصول على إجابة.";
                if (onChunk) onChunk(fullText);
                return fullText;
            }

            const errData = await response.json().catch(() => ({}));
            lastError = errData.error?.message || `خطأ (${response.status})`;
        } catch (err) {
            lastError = err.message;
        }
    }

    throw new Error(`تعذر الاتصال بالذكاء الاصطناعي: ${lastError}`);
}

function prepareFastModal(title) {
    showModal(title, `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; text-align:center; color:#64748b; font-size:14px;">
            ⚡ جاري جلب البيانات والتحليل...
        </div>
    `);
}

// ==========================================
// 4. إدارة المفضلة والسجل
// ==========================================
function getFavorites() {
    return JSON.parse(localStorage.getItem("appFavorites") || "[]");
}

function toggleFavorite(title, content) {
    let favorites = getFavorites();
    const index = favorites.findIndex(item => item.title === title);

    if (index > -1) {
        favorites.splice(index, 1);
        alert("تمت الإزالة من المفضلة ⭐");
    } else {
        favorites.push({ title, content, date: new Date().toLocaleDateString("ar-EG") });
        alert("تمت الإضافة إلى المفضلة ⭐");
    }

    localStorage.setItem("appFavorites", JSON.stringify(favorites));
}

function openHistoryModal() {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    if (history.length === 0) {
        showModal("📜 السجل", "<p style='text-align:center; padding:20px; color:#64748b;'>لا يوجد سجل محادثات حتى الآن.</p>");
        return;
    }

    let content = `<div style="max-height:350px; overflow-y:auto; display:flex; flex-direction:column; gap:10px;">`;
    history.slice().reverse().forEach((item, index) => {
        content += `
            <div class="history-item" data-index="${history.length - 1 - index}" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px; cursor:pointer; text-align:right;">
                <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">🕒 ${item.date}</div>
                <div style="font-weight:bold; color:#1d4ed8; font-size:13.5px;">🔍 ${item.question}</div>
            </div>
        `;
    });
    content += `</div>`;

    showModal("📜 سجل البحث والمحادثات", content);

    document.querySelectorAll(".history-item").forEach(el => {
        el.onclick = () => {
            const idx = el.getAttribute("data-index");
            const selected = history[idx];
            renderAIResponse(`💡 ${selected.question}`, selected.answer);
        };
    });
}

function saveChatToHistory(question, answer) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ 
        question, 
        answer, 
        date: new Date().toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'}) 
    });
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

// ==========================================
// 5. عرض نتائج وتفاعلات الذكاء الاصطناعي
// ==========================================
function renderAIResponse(title, rawText) {
    const formattedHtml = formatMarkdown(rawText);
    const htmlContent = `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:12px; font-size:13.5px; color:#1e293b; line-height:1.7; text-align:right; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
            <div id="ai-response-box">${formattedHtml}</div>
        </div>

        <div style="display:flex; gap:8px; background:#f1f5f9; padding:6px; border-radius:12px; margin-bottom:10px; align-items:center;">
            <button id="followup-send-btn" style="background:#2563eb; color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:13px; cursor:pointer;">إرسال</button>
            <input type="text" id="followup-input" placeholder="اسأل متابعة سريعة..." style="flex:1; border:none; background:transparent; font-size:13px; outline:none; text-align:right; padding:4px 8px;">
        </div>

        <div style="display:flex; gap:8px;">
            <button id="fav-ai-response-btn" style="flex:1; padding:12px; background:#f59e0b; color:#fff; border:none; border-radius:12px; font-weight:bold; font-size:13px; cursor:pointer;">
                ⭐ المفضلة
            </button>
            <button id="copy-ai-response-btn" style="flex:1; padding:12px; background:#2563eb; color:#fff; border:none; border-radius:12px; font-weight:bold; font-size:13px; cursor:pointer;">
                📋 نسخ الإجابة
            </button>
        </div>
    `;

    showModal(title, htmlContent);

    const copyBtn = document.getElementById("copy-ai-response-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            const textToCopy = document.getElementById("ai-response-box").innerText;
            navigator.clipboard.writeText(textToCopy).then(() => alert("تم نسخ الإجابة بنجاح!"));
        };
    }

    const favBtn = document.getElementById("fav-ai-response-btn");
    if (favBtn) {
        favBtn.onclick = () => toggleFavorite(title, rawText);
    }

    const followupBtn = document.getElementById("followup-send-btn");
    const followupInput = document.getElementById("followup-input");
    if (followupBtn && followupInput) {
        followupBtn.onclick = async () => {
            const query = followupInput.value.trim();
            if (!query) return;

            const box = document.getElementById("ai-response-box");
            box.innerHTML += `<hr style="margin:12px 0; border:0; border-top:1px solid #e2e8f0;"><strong style="color:#2563eb;">سؤالك: ${query}</strong><br>⚡ جاري التحميل...`;
            followupInput.value = "";

            try {
                const prompt = `بناءً على التوضيح السابق، أجب على هذا السؤال المتابع باختصار: ${query}`;
                const newRes = await callGeminiStream(prompt);
                box.innerHTML = box.innerHTML.replace("⚡ جاري التحميل...", formatMarkdown(newRes));
            } catch (err) {
                alert(err.message);
            }
        };
    }
}

// ==========================================
// 6. دوال الموسوعات وقواميس المساعدة
// ==========================================
function showCategoryLanguages(category) {
    let html = `
        <input type="text" id="lang-internal-search" placeholder="🔍 بحث سريع..." 
               style="width:100%; padding:10px 14px; margin-bottom:14px; border:1px solid #cbd5e1; border-radius:10px; outline:none; font-size:13px; text-align:right;">
        <div id="lang-items-list" style="display:flex; flex-direction:column; gap:12px;"></div>
    `;

    showModal(category.title, html);

    const renderLangs = (filter = "") => {
        const container = document.getElementById("lang-items-list");
        const filtered = category.languages.filter(l => l.name.toLowerCase().includes(filter.toLowerCase()) || l.desc.toLowerCase().includes(filter.toLowerCase()));

        if (filtered.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#94a3b8; font-size:13px;">لا توجد نتائج مطابقة.</p>`;
            return;
        }

        container.innerHTML = filtered.map(lang => `
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:14px; text-align:right; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <h4 style="color:#1d4ed8; font-size:14px; margin-bottom:6px;">${lang.name}</h4>
                <p style="color:#334155; font-size:12.5px; line-height:1.6;">${formatMarkdown(lang.desc)}</p>
            </div>
        `).join('');
    };

    renderLangs();
    document.getElementById("lang-internal-search").oninput = (e) => renderLangs(e.target.value);
}

function showGlossaryStyleModal(title, dataList) {
    let html = `
        <input type="text" id="generic-search-input" placeholder="🔍 بحث سريع..." 
               style="width:100%; padding:10px 14px; margin-bottom:14px; border:1px solid #e2e8f0; border-radius:10px; outline:none; font-size:13px; text-align:right; background:#f8fafc;">
        <div id="generic-list-container" style="display:flex; flex-direction:column; gap:12px;"></div>
    `;

    showModal(title, html);

    const renderList = (filter = "") => {
        const container = document.getElementById("generic-list-container");
        const filtered = dataList.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()) || item.desc.toLowerCase().includes(filter.toLowerCase()));

        if (filtered.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#94a3b8; font-size:13px;">لا توجد نتائج مطابقة.</p>`;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:14px; text-align:right; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <h4 style="color:#1d4ed8; font-size:14px; margin-bottom:6px;">${item.name}</h4>
                <p style="color:#334155; font-size:12.5px; line-height:1.6;">${formatMarkdown(item.desc)}</p>
            </div>
        `).join('');
    };

    renderList();
    document.getElementById("generic-search-input").oninput = (e) => renderList(e.target.value);
}

// ==========================================
// 7. ربط وتفعيل كافة الأزرار عند التحميل
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const { closeModal, modal } = getModalElements();
    if (closeModal) closeModal.onclick = hideModal;
    if (modal) {
        window.onclick = (e) => {
            if (e.target === modal) hideModal();
        };
    }

    const btnSettings = document.getElementById("btn-settings");
    if (btnSettings) {
        btnSettings.onclick = openSettingsModal;
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

    const btnRoadmapWeb = document.getElementById("btn-roadmap-web");
    const btnRoadmapMobile = document.getElementById("btn-roadmap-mobile");
    const btnRoadmapAi = document.getElementById("btn-roadmap-ai");
    const btnHistory = document.getElementById("btn-history");

    if (searchBtn) {
        searchBtn.onclick = async () => {
            const query = searchInput ? searchInput.value.trim() : "";
            if (!query) return;
            if (searchInput) searchInput.value = "";
            prepareFastModal("🔍 نتيجة البحث");
            try {
                const prompt = `أجب فوراً بإيجاز وسرعة في نقاط عن: ${query}`;
                const result = await callGeminiStream(prompt);
                saveChatToHistory(query, result);
                renderAIResponse("🔍 نتيجة البحث", result);
            } catch (err) {
                showModal("خطأ", `<p style="color:#ef4444; text-align:center;">${err.message}</p>`);
            }
        };
    }

    if (analyzeProjectBtn) {
        analyzeProjectBtn.onclick = async () => {
            const idea = projectIdea ? projectIdea.value.trim() : "";
            if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");
            prepareFastModal("💡 تحليل الفكرة والتقنيات");
            try {
                const prompt = `أعط تحليلاً سريعاً ومباشراً لفكرة المشروع: "${idea}". اذكر الأهداف، التقنيات المناسبة، ومراحل العمل المباشرة في نقاط.`;
                const result = await callGeminiStream(prompt);
                saveChatToHistory(idea, result);
                renderAIResponse("💡 تحليل الفكرة والتقنيات", result);
            } catch (err) {
                showModal("خطأ", `<p style="color:#ef4444; text-align:center;">${err.message}</p>`);
            }
        };
    }

    if (btnCalculator) {
        btnCalculator.onclick = async () => {
            const idea = projectIdea ? projectIdea.value.trim() : "";
            if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");
            prepareFastModal("💰 الميزانية والوقت");
            try {
                const prompt = `قدم تقدير مالي وزمني مقتضب بالدولار والأسابيع لتنفيذ: "${idea}".`;
                const result = await callGeminiStream(prompt);
                saveChatToHistory(`ميزانية: ${idea}`, result);
                renderAIResponse("💰 الميزانية والوقت", result);
            } catch (err) {
                showModal("خطأ", `<p style="color:#ef4444; text-align:center;">${err.message}</p>`);
            }
        };
    }

    if (btnDbGenerator) {
        btnDbGenerator.onclick = async () => {
            const idea = projectIdea ? projectIdea.value.trim() : "";
            if (!idea) return alert("اكتبي الفكرة أولاً في المربع!");
            prepareFastModal("🗄 هيكل قواعد البيانات");
            try {
                const prompt = `صمم هيكل قواعد بيانات مبسط لمشروع: "${idea}".`;
                const result = await callGeminiStream(prompt);
                saveChatToHistory(`Schema: ${idea}`, result);
                renderAIResponse("🗄️ هيكل قواعد البيانات", result);
            } catch (err) {
                showModal("خطأ", `<p style="color:#ef4444; text-align:center;">${err.message}</p>`);
            }
        };
    }

    if (btnCodeTranslator) {
        btnCodeTranslator.onclick = () => {
            const translatorHtml = `
                <div style="display:flex; flex-direction:column; gap:12px; text-align:right;">
                    <label style="font-size:13px; font-weight:bold; color:#334155;">اكتبي الكود للتحويل أو اطلبي كود جديد:</label>
                    <textarea id="translator-input" placeholder="مثال للتحويل: print('Hello World')" 
                              style="width:100%; height:95px; padding:10px; border:1px solid #cbd5e1; border-radius:10px; resize:none; font-size:13px; outline:none; background:#f8fafc; font-family:monospace; text-align:left; dir:ltr;"></textarea>
                    <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثال: Java, Python, C++)" 
                           style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; outline:none; background:#fff; text-align:right;">
                    <div style="display:flex; gap:8px; margin-top:5px;">
                        <button id="exec-convert-btn" style="flex:1; padding:10px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 تحويل الكود</button>
                        <button id="exec-generate-btn" style="flex:1; padding:10px; background:#10b981; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">✨ توليد كود جديد</button>
                    </div>
                </div>
            `;
            showModal("🔄 مترجم ومولد لغات البرمجة", translatorHtml);

            document.getElementById("exec-convert-btn").onclick = async () => {
                const code = document.getElementById("translator-input").value.trim();
                const lang = document.getElementById("target-language").value.trim();
                if (!code || !lang) return alert("يرجى إدخال الكود وتحديد اللغة المستهدفة!");
                prepareFastModal(`🔄 تحويل الكود إلى ${lang}`);
                try {
                    const prompt = `قم بتحويل الكود التالي بدقة إلى لغة (${lang}):\n\`\`\`\n${code}\n\`\`\``;
                    const result = await callGeminiStream(prompt);
                    saveChatToHistory(`تحويل كود لـ ${lang}`, result);
                    renderAIResponse(`🔄 تحويل الكود إلى ${lang}`, result);
                } catch (err) {
                    showModal("خطأ", `<p style="color:#ef4444; text-align:center;">${err.message}</p>`);
                }
            };

            document.getElementById("exec-generate-btn").onclick = async () => {
                const request = document.getElementById("translator-input").value.trim();
                const lang = document.getElementById("target-language").value.trim();
                if (!request) return alert("يرجى كتابة الكود المطلوب!");
                prepareFastModal("✨ توليد الكود المطلوب");
                try {
                    const prompt = `اكتب كوداً برمجياً بـ ${lang ? "لغة " + lang : "اللغة المناسبة"} لإنجاز:\n${request}`;
                    const result = await callGeminiStream(prompt);
                    saveChatToHistory(`طلب كود: ${request.slice(0, 15)}...`, result);
                    renderAIResponse("✨ توليد الكود المطلوب", result);
                } catch (err) {
                    showModal("خطأ", `<p style="color:#ef4444; text-align:center;">${err.message}</p>`);
                }
            };
        };
    }

    if (btnLanguages) {
        btnLanguages.onclick = () => {
            if (typeof programmingCategories === 'undefined') return alert("تأكدي من وجود data.js!");
            let html = `<p style="text-align:center; color:#64748b; font-size:13px; margin-bottom:14px;">اختر المجال لعرض كافة اللغات:</p><div style="display:flex; flex-direction:column; gap:12px;">`;
            programmingCategories.forEach(cat => {
                html += `
                    <div class="cat-card-item" data-id="${cat.id}" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:14px 16px; cursor:pointer; text-align:center;">
                        <h3 style="color:#1d4ed8; font-size:15px; font-weight:bold; margin-bottom:6px;">${cat.title}</h3>
                        <p style="color:#64748b; font-size:12px;">${cat.desc}</p>
                    </div>
                `;
            });
            html += `</div>`;
            showModal("💻 موسوعة أقسام لغات البرمجة", html);

            document.querySelectorAll(".cat-card-item").forEach(card => {
                card.onclick = () => {
                    const catId = card.getAttribute("data-id");
                    const selectedCat = programmingCategories.find(c => c.id === catId);
                    showCategoryLanguages(selectedCat);
                };
            });
        };
    }

    if (btnGlossarySidebar) {
        btnGlossarySidebar.onclick = () => {
            if (typeof techGlossary === 'undefined') return alert("تأكدي من وجود data.js!");
            showGlossaryStyleModal("📖 قاموس مصطلحات المطورين", techGlossary);
        };
    }

    if (btnTools) {
        btnTools.onclick = () => {
            if (typeof devTools === 'undefined') return;
            showGlossaryStyleModal("🛠️ الأدوات والتقنيات", devTools);
        };
    }

    if (btnIdeApps) {
        btnIdeApps.onclick = () => {
            if (typeof executionApps === 'undefined') return;
            showGlossaryStyleModal("📱 تطبيقات ومحررات الكود", executionApps);
        };
    }

    if (btnRoadmapWeb) {
        btnRoadmapWeb.onclick = () => {
            if (typeof roadmapsData === 'undefined') return;
            renderAIResponse("🌐 خارطة طريق الويب", roadmapsData.web);
        };
    }
    if (btnRoadmapMobile) {
        btnRoadmapMobile.onclick = () => {
            if (typeof roadmapsData === 'undefined') return;
            renderAIResponse("📱 خارطة طريق التطبيقات", roadmapsData.mobile);
        };
    }
    if (btnRoadmapAi) {
        btnRoadmapAi.onclick = () => {
            if (typeof roadmapsData === 'undefined') return;
            renderAIResponse("🤖 خارطة طريق الذكاء الاصطناعي", roadmapsData.ai);
        };
    }

    if (btnHistory) {
        btnHistory.onclick = openHistoryModal;
    }
});
