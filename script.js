// ==========================================
// 1. مفتاح الـ API المشفر وفك التشفير تلقائياً
// ==========================================
const encodedKey = "QVEuQWI4Uk42SzR4N1dmZWhMQngwdzI3WE45eFRmQzU5LTQtREo1SDRmdlNmOFdVY2tyUEE=";
const GEMINI_API_KEY = atob(encodedKey);

// ==========================================
// 2. تهيئة العناصر والتفاعل مع النافذة المنبثقة (Modal)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    // دالة عرض النافذة المنبثقة
    function showModal(title, content) {
        if (modalTitle && modalBody && modal) {
            modalTitle.innerText = title;
            modalBody.innerHTML = content;
            modal.classList.remove('hidden');
        }
    }

    // إغلاق النافذة عند الضغط على زر الإغلاق أو خارج النافذة
    if (closeModal) {
        closeModal.onclick = () => modal.classList.add('hidden');
    }
    window.onclick = (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    };

    // ==========================================
    // 3. ربط أزرار الشريط العلوي والبحث
    // ==========================================
    document.getElementById('btn-glossary-sidebar')?.addEventListener('click', () => {
        showModal('📖 قاموس المصطلحات', `
            <div style="line-height:1.8;">
                <p><b>API:</b> واجهة برمجة التطبيقات لربط البرامج ببعضها.</p>
                <p><b>Frontend:</b> واجهة المستخدم الظاهرة (HTML/CSS/JS).</p>
                <p><b>Backend:</b> الخادم والبرمجية الخلفية وقواعد البيانات.</p>
            </div>
        `);
    });

    document.getElementById('btn-favorites')?.addEventListener('click', () => {
        showModal('⭐ المفضلة', '<p>لا توجد عناصر مضافة للمفضلة حالياً.</p>');
    });

    document.getElementById('btn-history')?.addEventListener('click', () => {
        showModal('📜 سجل العمليات', '<p>سجل الاستعلامات والتحليلات السابقة فارغ حالياً.</p>');
    });

    document.getElementById('search-btn')?.addEventListener('click', () => {
        const query = document.getElementById('search-input')?.value;
        if (!query || !query.trim()) return alert('الرجاء كتابة نص للبحث!');
        showModal(`🔍 نتائج البحث عن: ${query}`, `<p>جارٍ جلب نتائج البحث والمعلومات بخصوص <b>${query}</b>...</p>`);
    });

    // ==========================================
    // 4. ربط أزرار الموسوعات البرمجية
    // ==========================================
    document.getElementById('btn-languages')?.addEventListener('click', () => {
        showModal('💻 لغات البرمجة', `
            <ul>
                <li><b>JavaScript:</b> لغة الويب التفاعلية.</li>
                <li><b>Python:</b> لغة الذكاء الاصطناعي وتحليل البيانات.</li>
                <li><b>Dart / Flutter:</b> لتطوير تطبيقات الجوال لأندرويد وآيفون.</li>
            </ul>
        `);
    });

    document.getElementById('btn-tools')?.addEventListener('click', () => {
        showModal('🛠️ الأدوات والتقنيات', `
            <ul>
                <li><b>Git & GitHub:</b> لإدارة إصدارات الكود والمشاريع.</li>
                <li><b>VS Code:</b> أفضل محرر أكواد برمجي.</li>
                <li><b>Docker:</b> لتغليف البيئات والبرمجيات.</li>
            </ul>
        `);
    });

    document.getElementById('btn-ide-apps')?.addEventListener('click', () => {
        showModal('📱 تطبيقات ومحررات الكود', `
            <ul>
                <li><b>Acode:</b> محرر أكواد ممتازة للجوال.</li>
                <li><b>Android Studio:</b> البيئة الرسمية لتطوير تطبيقات أندرويد.</li>
            </ul>
        `);
    });

    // ==========================================
    // 5. أدوات وتخطيط المشاريع والتحليل الذكي
    // ==========================================
    document.getElementById('analyze-project-btn')?.addEventListener('click', async () => {
        const idea = document.getElementById('project-idea')?.value;
        if (!idea || !idea.trim()) return alert('الرجاء كتابة فكرة المشروع أولاً!');
        
        showModal('💡 تحليل الفكرة والتقنيات', '<p>⏳ جاري تحليل الفكرة واستخراج التقنيات المقترحة...</p>');

        try {
            // استدعاء مباشر لـ Gemini API بواسطة المفتاح الخاص بك
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `قم بتحليل فكرة المشروع التالية واقتراح التقنيات المناسبة وهيكل العمل بشكل مختصر وواضح:\n${idea}` }]
                    }]
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const resultText = data.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
                showModal('💡 تحليل الفكرة والتقنيات', `<div style="line-height:1.8;">${resultText}</div>`);
            } else {
                showModal('💡 تحليل الفكرة', '<p>تعذر الحصول على رد من النموذج، يرجى المحاولة لاحقاً.</p>');
            }
        } catch (error) {
            showModal('💡 تحليل الفكرة', `<p>حدث خطأ أثناء الاتصال: ${error.message}</p>`);
        }
    });

    document.getElementById('btn-calculator')?.addEventListener('click', () => {
        showModal('💰 الميزانية والوقت التقديري', '<p>تقدير متوسط لإنشاء تطبيقات متوسطة: من 3 إلى 6 أسابيع عمل.</p>');
    });

    document.getElementById('btn-db-generator')?.addEventListener('click', () => {
        showModal('🗄️ هيكل قواعد البيانات', '<p>جدول المستخدمين (Users) -> جدول المنتجات/الخدمات -> جدول الطلبات (Orders).</p>');
    });

    document.getElementById('btn-code-translator')?.addEventListener('click', () => {
        showModal('🔄 مترجم الأكواد', '<p>أداة التحويل وتوليد الأكواد بين اللغات المختلفة.</p>');
    });

    // ==========================================
    // 6. خرائط طريق المبرمج (Roadmaps)
    // ==========================================
    document.getElementById('btn-roadmap-web')?.addEventListener('click', () => {
        showModal('🌐 خريطة طريق تطوير الويب', '<p>HTML ➔ CSS ➔ JavaScript ➔ React / Vue ➔ Node.js ➔ SQL / MongoDB</p>');
    });

    document.getElementById('btn-roadmap-mobile')?.addEventListener('click', () => {
        showModal('📱 خريطة طريق تطوير التطبيقات', '<p>أساسيات البرمجة ➔ Dart & Flutter (أو React Native) ➔ التعامل مع APIs ➔ Firebase</p>');
    });

    document.getElementById('btn-roadmap-ai')?.addEventListener('click', () => {
        showModal('🤖 خريطة طريق الذكاء الاصطناعي', '<p>Python ➔ Math & Statistics ➔ Pandas & NumPy ➔ Machine Learning ➔ Deep Learning</p>');
    });

});
