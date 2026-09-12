// ==========================================
// موسوعة البيانات الشاملة والمعمقة للمشروع
// ==========================================

// 1. الموسوعات البرمجية الشاملة
const programmingCategories = [
    {
        id: "web",
        title: "🌐 تطوير الويب (Web Development)",
        desc: "التقنيات الأساسية والمتقدمة لبناء المواقع والتطبيقات السحابية",
        languages: [
            { name: "HTML5 & CSS3", desc: "الهيكل البنائي والتنسيق المتقدم، مع دعم التصاميم المتجاوبة (Responsive) والأنيميشن." },
            { name: "JavaScript (ES6+)", desc: "لغة الويب الأساسية للتفاعلية الديناميكية، البرمجة غير المتزامنة (Async/Await)، والتعامل مع DOM." },
            { name: "TypeScript", desc: "Super-set لـ JavaScript يضيف الأنواع الثابتة (Static Typing) لتقليل الأخطاء في المشاريع الضخمة." },
            { name: "React / Vue.js", desc: "أطر عمل واجهات المستخدم لبناء تطبيق الصفحة الواحدة (SPA) وإدارة الحالة (State Management)." },
            { name: "Node.js & Express", desc: "بيئة تشغيل JavaScript على السيرفر لبناء RESTful APIs خفيفة وسريعة." },
            { name: "PHP & Laravel", desc: "منظومة متكاملة لبناء الخلفيات البرمجية (Backend) وإدارة قواعد البيانات والأمان بكفاءة." }
        ]
    },
    {
        id: "mobile",
        title: "📱 تطبيقات الهواتف (Mobile Development)",
        desc: "أدوات ولغات بناء تطبيقات الأنظمة الذكية (Android & iOS)",
        languages: [
            { name: "Dart (Flutter)", desc: "إطار عمل من Google يوفر أداءً يقارب اللغات الأصيلة لبناء تطبيقات للـ iOS والأندرويد بكود واحد." },
            { name: "Kotlin", desc: "اللغة الرسمية الحديثة والمعتمدة من Google لبناء تطبيقات الأندرويد الأصيلة (Native)." },
            { name: "Swift", desc: "لغة Apple السريعة والآمنة لتطوير تطبيقات iOS, iPadOS, و macOS." },
            { name: "React Native", desc: "إطار عمل لتطوير تطبيقات الهواتف باستخدام JavaScript وReact مع المكونات الأصيلة." }
        ]
    },
    {
        id: "ai_data",
        title: "🤖 الذكاء الاصطناعي وعلم البيانات (AI & Data Science)",
        desc: "تقنيات تحليل البيانات، التعلم الآلي، والشبكات العصبيّة",
        languages: [
            { name: "Python", desc: "اللغة الأولى عالمياً للذكاء الاصطناعي بفضل مكتباتها الضخمة وسهولة بنيتها البرمجية." },
            { name: "NumPy & Pandas", desc: "مكتبات معالجة مصفوفات البيانات، التنظيف، والتحليل الإحصائي." },
            { name: "Scikit-Learn", desc: "مكتبة شائعة لتطبيق خوارزميات التعلم الآلي التقليدي (Machine Learning)." },
            { name: "PyTorch / TensorFlow", desc: "أطر عمل بناء وتدريب شبكات التعلم العميق (Deep Learning) والذكاء الاصطناعي التوليدي." }
        ]
    }
];

// 2. أدوات وتقنيات التطوير
const devTools = [
    { name: "Git & GitHub / GitLab", desc: "أنظمة تتبع النسخ (Version Control) لحفظ الأكواد والتعاون الجماعي وإدارة الفروع (Branches)." },
    { name: "Visual Studio Code", desc: "محرر الكود الأكثر انتشاراً المكتظ بالملحقات (Extensions) وأدوات تصحيح الأخطاء (Debugging)." },
    { name: "Postman / Bruno", desc: "أدوات اختبار الـ APIs، إرسال الطلبات (GET/POST)، ومعاينة استجابات JSON." },
    { name: "Docker", desc: "تقنية الحاويات (Containerization) لعزل وتغليف التطبيقات وتبسيط بيئات التشغيل." },
    { name: "Webpack / Vite", desc: "أدوات تجميع وتنسيق الملفات والسكربتات لتحسين أداء سرعة تحميل المواقع." }
];

// 3. تطبيقات ومحررات الكود على الموبايل والسحاب
const executionApps = [
    { name: "Acode", desc: "محرر كود متكامل للأندرويد يدعم HTML/CSS/JS معTerminal مدمج ودعم لـ Git." },
    { name: "Replit", desc: "بيئة تطوير سحابية (Cloud IDE) تتيح كتابة وتشغيل واستضافة الكود مباشرة من المتصفح." },
    { name: "Termux", desc: "محاكي بيئة لينكس (Terminal) قوي للأندرويد لتشغيل حزم Python, Node.js, و Git." },
    { name: "GitHub Mobile", desc: "تطبيق رسمي لمتابعة المستودعات، مراجعة الأكواد (Code Review)، وإدارة الـ Issues." }
];

// 4. قاموس المصطلحات التقنية المعمق
const techGlossary = [
    { name: "API (Application Programming Interface)", desc: "جسر تواصل يتيح لتطبيقين مختلفين تبادل البيانات والخدمات بشكل آمن." },
    { name: "Frontend vs Backend", desc: "الـ Frontend هو كل ما يراه المستخدم ويتفاعل معه، بينما الـ Backend هو السيرفر وقواعد البيانات والعمليات الخلفية." },
    { name: "RESTful Web Services", desc: "معمارية برمجية قياسية لتصميم الـ APIs تعتمد على بروتوكول HTTP." },
    { name: "Database (SQL vs NoSQL)", desc: "قواعد البيانات المجدولة والعلاقية (مثل MySQL) مقابل قواعد البيانات غير المجدولة المرنة (مثل MongoDB)." },
    { name: "CI/CD Pipeline", desc: "التكامل والتسليم المستمر؛ عملية أتمتة اختبار ونشر الكود تلقائياً عند التعديل." },
    { name: "Environment Variables (.env)", desc: "ملفات خفية تُستخدم لتخزين البيانات الحساسة مثل مفاتيح API وكلمات سر قواعد البيانات." }
];

// 5. خرائط طريق المبرمج التفصيلية (Roadmaps)
const roadmapsData = {
    web: `### 🌐 مسار تطوير الويب المتكامل:
1. **أساسيات الويب:** تعلم HTML5, CSS3, و Flexbox/Grid.
2. **برمجة الويب:** إتقان JavaScript (ES6+), DOM, و Fetch API.
3. **أدوات المطور:** تعلّم Git, GitHub, وخط الأوامر (Terminal).
4. **أطر الواجهات (Frontend Framework):** اختيار React أو Vue.js.
5. **الخلفيات البرمجية (Backend):** تعلّم Node.js مع Express أو Python مع Django.
6. **قواعد البيانات:** التعامل مع PostgreSQL أو MongoDB.`,

    mobile: `### 📱 مسار تطوير تطبيقات الهواتف:
1. **الأساس البرمجي:** تعلم مفاهيم البرمجة كائنية التوجه (OOP).
2. **اختيار المسار:**
   - **Cross-Platform:** تعلم Dart & Flutter (موصى به).
   - **Android Native:** تعلم Kotlin & Jetpack Compose.
   - **iOS Native:** تعلم Swift & SwiftUI.
3. **إدارة البيانات:** التعامل مع REST APIs و SQLite/Hive للتخزين المحلي.
4. **النشر:** رفع التطبيق على Google Play Store و Apple App Store.`,

    ai: `### 🤖 مسار الذكاء الاصطناعي وعلم البيانات:
1. **الأساسيات البرمجية:** إتقان لغة Python بشكل عميق.
2. **الرياضيات:** التركيز على الجبر الخطي، التفاضل، والإحصاء الاحتمالي.
3. **تحليل البيانات:** استخدام NumPy, Pandas, و Matplotlib.
4. **التعلم الآلي (Machine Learning):** دراسة خوارزميات Scikit-Learn.
5. **التعلم العميق (Deep Learning):** بناء الشبكات العصبيّة باستخدام PyTorch أو TensorFlow.`
};
