const programmingCategories = [
    {
        id: "web",
        title: "🌐 تطوير الويب (Web Development)",
        desc: "التقنيات الأساسية والمتقدمة لبناء المواقع والتطبيقات السحابية",
        languages: [
            { name: "HTML5 & CSS3", desc: "الهيكل البنائي والتنسيق المتقدم، مع دعم التصاميم المتجاوبة (Responsive) والأنيميشن." },
            { name: "JavaScript (ES6+)", desc: "لغة الويب الأساسية للتفاعلية الديناميكية، البرمجة غير المتزامنة، والتعامل مع DOM." },
            { name: "TypeScript", desc: "إضافة متقدمة لـ JavaScript توفر الأنواع الثابتة (Static Typing) للمشاريع الضخمة." },
            { name: "React / Vue.js", desc: "أطر عمل واجهات المستخدم لبناء تطبيقات الصفحة الواحدة (SPA) وإدارة الحالة." },
            { name: "Node.js & Express", desc: "بيئة تشغيل JavaScript على السيرفر لبناء RESTful APIs خفيفة وسريعة." },
            { name: "PHP & Laravel", desc: "منظومة متكاملة لبناء الخلفيات البرمجية وإدارة قواعد البيانات بأمان." }
        ]
    },
    {
        id: "mobile",
        title: "📱 تطبيقات الهواتف (Mobile Development)",
        desc: "أدوات ولغات بناء تطبيقات الأنظمة الذكية (Android & iOS)",
        languages: [
            { name: "Dart (Flutter)", desc: "إطار عمل ممتاز من Google يوفر أداءً عالياً لبناء تطبيقات للأنظمة المختلفة بكود واحد." },
            { name: "Kotlin", desc: "اللغة الرسمية الحديثة والمعتمدة لبناء تطبيقات الأندرويد الأصيلة (Native)." },
            { name: "Swift", desc: "لغة Apple السريعة والآمنة لتطوير تطبيقات iOS, iPadOS, و macOS." },
            { name: "React Native", desc: "إطار عمل لبناء تطبيقات الموبايل باستخدام JavaScript والمكونات الأصلية." }
        ]
    },
    {
        id: "ai_data",
        title: "🤖 الذكاء الاصطناعي وعلم البيانات",
        desc: "تقنيات تحليل البيانات، التعلم الآلي، والشبكات العصبيّة",
        languages: [
            { name: "Python", desc: "اللغة الأولى عالمياً للذكاء الاصطناعي بفضل مكتباتها الضخمة وسهولتها." },
            { name: "NumPy & Pandas", desc: "مكتبات معالجة البيانات والمصفوفات، التنظيف، والتحليل الإحصائي." },
            { name: "PyTorch / TensorFlow", desc: "أطر عمل بناء وتدريب شبكات التعلم العميق والذكاء الاصطناعي التوليدي." }
        ]
    }
];

const devTools = [
    { name: "Git & GitHub / GitLab", desc: "أنظمة تتبع النسخ لحفظ الأكواد والتعاون الجماعي وإدارة الفروع." },
    { name: "Visual Studio Code", desc: "محرر الكود الأكثر انتشاراً المحشو بالملحقات وأدوات التتبع." },
    { name: "Postman / Bruno", desc: "أدوات اختبار الـ APIs وإرسال الطلبات ومعاينة النتائج." },
    { name: "Docker", desc: "تقنية الحاويات لعزل وتغليف التطبيقات وتبسيط بيئات التشغيل." }
];

const executionApps = [
    { name: "Acode", desc: "محرر كود متكامل للأندرويد يدعم HTML/CSS/JS مع Terminal مدمج." },
    { name: "Replit", desc: "بيئة تطوير سحابية (Cloud IDE) تتيح كتابة وتشغيل الكود من المتصفح مباشرة." },
    { name: "Termux", desc: "محاكي بيئة لينكس للأندرويد لتشغيل Python, Node.js, و Git." },
    { name: "GitHub Mobile", desc: "تطبيق رسمي لمتابعة المستودعات ومراجعة الأكواد وإدارة المشاريع." }
];

const techGlossary = [
    { name: "API (Application Programming Interface)", desc: "جسر تواصل يتيح للتطبيقات تبادل البيانات والخدمات بشكل آمن." },
    { name: "Frontend vs Backend", desc: "الـ Frontend واجهة المستخدم الفعلية، والـ Backend هو السيرفر وقواعد البيانات." },
    { name: "RESTful Services", desc: "معمارية برمجية قياسية لتصميم الخدمات والـ APIs عبر بروتوكول HTTP." },
    { name: "CI/CD Pipeline", desc: "عملية أتمتة اختبار ونشر الكود تلقائياً عند التطوير." }
];

const roadmapsData = {
    web: `### 🌐 مسار تطوير الويب المتكامل:\n1. **أساسيات الويب:** HTML5, CSS3, Flexbox/Grid.\n2. **البرمجة:** JavaScript (ES6+), DOM, Fetch API.\n3. **أدوات المطور:** Git, GitHub, Terminal.\n4. **الواجهات:** React أو Vue.js.\n5. **الخلفيات البرمجية:** Node.js أو PHP/Laravel.`,
    mobile: `### 📱 مسار تطوير تطبيقات الهواتف:\n1. **الأساس البرمجي:** مفاهيم البرمجة كائنية التوجه (OOP).\n2. **التقنيات:** Flutter أو Kotlin / Swift.\n3. **إدارة البيانات:** التعامل مع APIs والتخزين المحلي.\n4. **النشر:** رفع التطبيق على المتاجر الرسمية.`,
    ai: `### 🤖 مسار الذكاء الاصطناعي:\n1. **الأساسيات:** إتقان لغة Python.\n2. **الرياضيات:** الجبر الخطي والإحصاء الاحتمالي.\n3. **البيانات:** NumPy, Pandas, Matplotlib.\n4. **التعلم العميق:** PyTorch أو TensorFlow.`
};
