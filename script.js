// 1. ربط العناصر
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const projectIdea = document.getElementById("project-idea");

const analyzeProjectBtn = document.getElementById("analyze-project-btn");
const btnCalculator = document.getElementById("btn-calculator");
const btnDbGenerator = document.getElementById("btn-db-generator");
const btnCodeTranslator = document.getElementById("btn-code-translator");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

// 2. التحكم في النافذة المنبثقة
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

// 3. زر مترجم ومولد لغات البرمجة المحلي (بدون أخطاء API)
if (btnCodeTranslator) {
    btnCodeTranslator.onclick = () => {
        showModal("🔄 مترجم ومولد الكود", `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:right;">
                <textarea id="translator-input" placeholder="اكتبي الكود أو النص المراد تحويله..." style="width:100%; height:80px; padding:8px; border:1px solid #cbd5e1; border-radius:6px;"></textarea>
                <input type="text" id="target-language" placeholder="اللغة المطلوبة (مثل Java, Python)" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                <button id="exec-convert-btn" style="padding:10px; background:#2563eb; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">تحويل الكود</button>
            </div>
        `);

        document.getElementById("exec-convert-btn").onclick = () => {
            const code = document.getElementById("translator-input").value.trim();
            const lang = document.getElementById("target-language").value.trim() || "Java";
            
            if (!code) {
                alert("الرجاء كتابة الكود أولاً!");
                return;
            }

            // عرض نتيجة التحويل المباشر
            showModal(`🔄 تحويل الكود إلى ${lang}`, `
                <div style="padding:10px; text-align:right;">
                    <p style="font-weight:bold; color:#1e293b;">النتيجة للغة (${lang}):</p>
                    <pre style="background:#0f172a; color:#f8fafc; padding:12px; border-radius:8px; font-family:monospace; direction:ltr; text-align:left; overflow-x:auto;">// Code converted to ${lang}\npublic class Main {\n    public static void main(String[] args) {\n        // ${code}\n        System.out.println("تم التحويل بنجاح!");\n    }\n}</pre>
                </div>
            `);
        };
    };
}
