const programmingLanguages = [
    { name: "Python (بايثون)", desc: "لغة سهلة وقوية جداً، ممتازة للذكاء الاصطناعي، علم البيانات، وتطوير الويب." },
    { name: "JavaScript (جافاسكريبت)", desc: "لغة الويب الأساسية لتطوير واجهات المواقع وتطبيقات الهواتف والـ Backend عبر Node.js." },
    { name: "Java (جافا)", desc: "لغة قوية ومستقرة تُستخدم في تطبيقات الأندرويد والأنظمة الكبيرة للمؤسسات." },
    { name: "C++ (سي بلس بلس)", desc: "لغة فائقة السرعة للألعاب، برامج النظام، ومحركات الجرافيكس." },
    { name: "Flutter / Dart (فلاتر)", desc: "إطار عمل لبناء تطبيقات أندرويد و iOS من كود واحد بسرعة وكفاءة." }
];

const devTools = [
    { name: "Git & GitHub", desc: "أهم أدوات إدارة ومشاركة المشاريع البرمجية والعمل الجماعي." },
    { name: "Postman", desc: "أداة لاختبار واجهات برمجة التطبيقات (APIs)." },
    { name: "Docker", desc: "أداة لتشغيل البرامج في بيئات معزولة تضمن عملها على أي جهاز." }
];

// قائمة التطبيقات ومحررات تشغيل الأكواد (للهاتف والكمبيوتر والمتصفح)
const executionApps = [
    {
        name: "💻 Visual Studio Code (VS Code)",
        category: "كمبيوتر (Windows / Mac / Linux)",
        desc: "أشهر وأقوى محرر أكواد مجاني في العالم يدعم كل لغات البرمجة مع إضافات لا حصر لها.",
        uses: "HTML/CSS/JS, Python, C++, Java, Flutter, PHP"
    },
    {
        name: "🌐 Replit (موقع + تطبيق للهاتف)",
        category: "المتصفح والهاتف (Android / iOS)",
        desc: "بيئة تطوير سحابية متكاملة تتيح لك كتابة وتشغيل ومشاركة الأكواد مباشرة بدون أي تثبيت على جهازك.",
        uses: "Python, C++, Java, Node.js, HTML/CSS"
    },
    {
        name: "📱 Pydroid 3",
        category: "هواتف أندرويد",
        desc: "أفضل تطبيق لتشغيل وبرمجة أكواد لغة بايثون بدون إنترنت مع دعم مكتبات مثل NumPy و Tkinter.",
        uses: "Python 3"
    },
    {
        name: "📱 Acode / TrebEdit",
        category: "هواتف أندرويد",
        desc: "محرر أكواد خفيف وقوي لتطوير وتجربة صفحات ومواقع الويب مع ميزة المعاينة الحية السريعة.",
        uses: "HTML, CSS, JavaScript"
    },
    {
        name: "📱 Termux",
        category: "هواتف أندرويد",
        desc: "طرفية نظام لينكس كاملة للهاتف تتيح لك تثبيت وتشغيل بايثون، Node.js، C، ومترجمات أخرى احترافية.",
        uses: "بيئة سطر الأوامر (CLI), Python, Node, Git"
    },
    {
        name: "💻 Android Studio",
        category: "كمبيوتر",
        desc: "البيئة الرسمية لتطوير وتصميم وبرمجة تطبيقات الأندرويد.",
        uses: "Java, Kotlin, Flutter"
    },
    {
        name: "🌐 CodeSandbox / StackBlitz",
        category: "المتصفح",
        desc: "منصات سحابية فورية لتجربة مشاريع وتطبيقات الويب (React, Vue, Node) مباشرة من المتصفح.",
        uses: "Frontend & Fullstack Web"
    }
];
