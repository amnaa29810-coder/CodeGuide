// موسوعة لغات البرمجة وأطر العمل مقسمة حسب المجال
const programmingCategories = [
    {
        id: "web",
        title: "🌐 تطوير الويب (Web Development)",
        desc: "شامل للواجهات الأمامية والخلفية وأطر العمل الحديثة (Front-end & Back-end)",
        languages: [
            { name: "JavaScript (JS)", desc: "العصب الرئيسي للويب التفاعلي. تُستخدم في Front-end و Back-end بواسطة بيئة Node.js." },
            { name: "HTML5 & CSS3", desc: "أساس الويب: HTML لبناء الهيكل والدلالات (Semantic HTML)، و CSS3 لتنسيق الواجهات والاستجابة (Responsive Design)." },
            { name: "TypeScript (TS)", desc: "تطوير لـ JavaScript يُضيف أنواعاً ثابتة (Static Types) لمنع الأخطاء مبكراً وزيادة جودة المشاريع الضخمة." },
            { name: "React.js", desc: "مكتبة واجهات من Meta تعتمد على المكونات (Components) والـ Virtual DOM لبناء تطبيقات سريعة جداً." },
            { name: "Next.js", desc: "إطار عمل شهير لـ React يدعم العرض من الخادم (SSR) والتوليد الاستاتيكي (SSG) لتحسين الـ SEO والأداء." },
            { name: "Vue.js / Nuxt.js", desc: "إطار عمل سلس وسهل التعلم لبناء الواجهات مع دعم ممتاز لـ SSR عبر Nuxt." },
            { name: "Angular", desc: "إطار عمل متكامل من Google مخصص للتطبيقات الضخمة للمؤسسات (Enterprise Apps)." },
            { name: "Node.js & Express.js", desc: "بيئة تشغيل لـ JS على الخادم لبناء واجهات برمجة التطبيقات (REST APIs & WebSockets) فائقة السرعة." },
            { name: "Python (Django / FastAPI)", desc: "Django لبناء مواقع متكاملة وبسرعة عالية، و FastAPI لبناء APIs فائقة السرعة والإنتاجية." },
            { name: "PHP (Laravel)", desc: "Laravel هو إطار العمل الأكثر شعبية لـ PHP، يوفر معمارية متطورة وأماناً عالياً لبناء المواقع." },
            { name: "Ruby on Rails", desc: "إطار عمل سيرفر معتمد على لغة Ruby يركز على الإنتاجية وتطوير التطبيقات بسرعة." }
        ]
    },
    {
        id: "mobile",
        title: "📱 تطوير تطبيقات الهاتف (Mobile Development)",
        desc: "منصات ولغات بناء التطبيقات لأنظمة Android و iOS والشاشات الذكية",
        languages: [
            { name: "Dart (Flutter)", desc: "لغة وإطار عمل من Google لبناء تطبيقات أصلية الأداء (Native performance) متعددة المنصات بكود واحد." },
            { name: "React Native", desc: "إطار عمل من Meta يسمح ببناء تطبيقات للهواتف باستعمال JavaScript/TypeScript ومكونات أصلية." },
            { name: "Kotlin", desc: "اللغة الحديثة والرسمية من Google لتطوير تطبيقات Android، تمتاز بالإنتاجية ومنع أخطاء Null Pointer." },
            { name: "Swift", desc: "اللغة الرسمية والآمنة من Apple لبناء تطبيقات أجهزة iOS, iPadOS, macOS, و watchOS." },
            { name: "Kotlin Multiplatform (KMP)", desc: "تقنية تسمح بمشاركة كود المنطق (Business Logic) بين تطبيقات Android و iOS بكل سهولة." },
            { name: "Ionic / Capacitor", desc: "تقنية لبناء تطبيقات الهاتف بإنشاء واجهات باستخدام تقنيات الويب (HTML/CSS/JS)." }
        ]
    },
    {
        id: "systems",
        title: "⚙️ الذكاء الاصطناعي، الأنظمة، والألعاب",
        desc: "لغات عالية الكفاءة معالجة للبيانات الضخمة والمحركات الرسومية والبرمجة منخفضة المستوى",
        languages: [
            { name: "Python", desc: "اللغة الأولى عالمياً للذكاء الاصطناعي، تحليل البيانات، وتعلم الآلة بفضل مكتباتها الضخمة." },
            { name: "C++", desc: "لغة عالية الأداء تُستخدم لبناء محركات الألعاب (Unreal Engine)، أنظمة التشغيل، والتطبيقات الحرجة." },
            { name: "C# (.NET)", desc: "لغة متطورة من Microsoft تُستخدم لبناء تطبيقات الشركات، وألعاب 2D/3D عبر محرك Unity." },
            { name: "Rust", desc: "لغة أنظمة حديثة تضمن أمان الذاكرة بدون حاجة لـ Garbage Collector، وبسرعة موازية لـ C++." },
            { name: "Go (Golang)", desc: "لغة من Google تمتاز بالبساطة والأداء العالي جداً في المعالجة المتوازية (Concurrency) وتطوير الأنظمة السحابية." },
            { name: "Java", desc: "لغة عريقة تعتمد مبدأ (اكتب مرة، شغل في أي مكان)، تُستخدم بكثرة في الأنظمة الماليّة والشركات الكبرى." },
            { name: "R", desc: "لغة متخصصة في الحوسبة الإحصائية، تحليل البيانات، والتمثيل البياني المتقدم." }
        ]
    }
];

// موسوعة الأدوات، التقنيات، والخدمات السحابية
const devTools = [
    { name: "Git & GitHub / GitLab", desc: "نظام التتبع وإدارة إصدارات الكود الذكي، والتعاون بين فرق البرمجة عالمياً." },
    { name: "Docker & Kubernetes", desc: "Docker لتغليف التطبيقات في حاويات (Containers)، و Kubernetes لإدارة وتوسيع هذه الحاويات تلقائياً." },
    { name: "Postman & Bruno", desc: "أدوات احترافية باختبار طلبات واستجابات واجهات APIs (REST, GraphQL, gRPC)." },
    { name: "PostgreSQL & MySQL", desc: "أنظمة قواعد بيانات علاقية (RDBMS) تمتاز بالاستقرار والأمان وسرعة استعلامات SQL." },
    { name: "MongoDB / Redis", desc: "MongoDB قاعدة بيانات NoSQL مرنة للملفات (JSON)، و Redis قاعدة بيانات فائقة السرعة تُخزن في الذاكرة (In-Memory Cache)." },
    { name: "AWS / Google Cloud / Azure", desc: "أشهر منصات الخدمات السحابية لاستضافة السيرفرات، قواعد البيانات، والخدمات الذكية." },
    { name: "Linux / Bash Scripting", desc: "نظام التشغيل القياسي لخوادم الويب، وأوامر Shell للتحكم التلقائي بالسيرفرات." },
    { name: "CI/CD Pipelines", desc: "أتمتة عمليات بناء واختبار ونشر الأكواد تلقائياً لضمان جودة التطبيقات عند تحديثها." }
];

// تطبيقات ومحررات وبيئات الكود
const executionApps = [
    { name: "Visual Studio Code (VS Code)", desc: "المحرر الأكثر استخداماً عالمياً المطور من Microsoft والغني بالإضافات لجميع اللغات." },
    { name: "JetBrains Suite (PyCharm, IntelliJ, WebStorm)", desc: "أقوى البيئات المتكاملة (IDEs) الاحترافية المليئة بأدوات التصحيح والتحليل الذكي." },
    { name: "Android Studio", desc: "بيئة التطوير الرسمية والمعتمدة لتطوير واختبار تطبيقات Android." },
    { name: "Xcode", desc: "البيئة الشاملة والمحتكرة لتطوير وتصميم واختبار تطبيقات أجهزة Apple." },
    { name: "Acode / Termux (Mobile)", desc: "أدوات المبرمج على الهواتف: Acode لتحرير الأكواد، و Termux لتشغيل بيئة Linux حقيقية على Android." },
    { name: "Cursor / Windsurf", desc: "محررات أكواد حديثة قائمة على الذكاء الاصطناعي التوليدي لسرعة كتابة وتصحيح الكود." }
];

// قاموس مصطلحات المطورين والمفاهيم الهندسية
const techGlossary = [
    { name: "API (RESTful / GraphQL)", desc: "واجهة برمجة التطبيقات: بروتوكول التواصل ونقل البيانات بين النظام ومختلف التطبيقات." },
    { name: "Microservices vs Monolith", desc: "Monolith بناء التطبيق ككتلة واحدة، بينما Microservices تقسيم النظام لتطبيقات صغيرة مستقلة." },
    { name: "CI/CD", desc: "التكامل والتسليم المستمر: نظام آلي يقوم باختبار الكود ونشره للسيرفر فور رفع التحديثات." },
    { name: "ORM (Object-Relational Mapping)", desc: "تقنية تتيح لك التعامل مع قاعدة البيانات بكود البرمجة دون كتابة أوامر SQL مباشرة (مثل Prisma أو Sequelize)." },
    { name: "JWT (JSON Web Token)", desc: "وسيلة آمنة لتشغيل الجلسات والتحقق من هوية المستخدمين والتصريح عبر الأجهزة." },
    { name: "Clean Architecture & SOLID", desc: "مبادئ ومعايير هندسية لكتابة كود مرن، سهل الاختبار، وسهل الصيانة والتوسع مستقبلاً." },
    { name: "Agile & Scrum", desc: "منهجيات إدارة مشاريع البرمجيات تعتمد على التطوير التدريجي والسريع والتجاوب مع التغيرات." },
    { name: "WebSockets", desc: "بروتوكول اتصالات يتيح التبادل اللحظي والمزدوج للبيانات بين السيرفر والمستعرض (مثل الشات والمحادثات)." }
];

// خرائط الطريق (Roadmaps) المحدثة والمفصلة
const roadmapsData = {
    web: `**🌐 خارطة طريق تطوير الويب المتكاملة:**
1. **الأساسيات:** HTML5 المتقدم، CSS3 (Flexbox/Grid/Responsive)، وأساسيات JavaScript (ES6+).
2. **التحكم بالإصدارات:** Git و التعامل مع GitHub.
3. **الواجهات الأمامية:** TypeScript ثم إطار عمل قوي مثل (React.js أو Vue.js) ومكتبات التنسيق مثل Tailwind CSS.
4. **تطوير الخلفية (Back-end):** تعلم Node.js (Express) أو Python (FastAPI/Django).
5. **قواعد البيانات:** التعامل مع PostgreSQL (SQL) و MongoDB (NoSQL) واستعمال ORM مثل Prisma.
6. **النشر والأمن:** استضافة التطبيقات عبر Vercel أو Docker وتأمين واجهات APIs باستخدام JWT و CORS.`,

    mobile: `**📱 خارطة طريق تطوير التطبيقات:**
1. **الأساسيات البرمجية:** إتقان البرمجة الكائنية (OOP) والمفاهيم المتقدمة.
2. **تحديد المسار:**
   - **Cross-Platform (الخيار الأسرع):** تعلم Dart وإطار عمل Flutter أو React Native.
   - **Native (الخيار الأقوى):** Kotlin لـ Android أو Swift لـ iOS.
3. **إدارة الحالة (State Management):** إتقان أدوات مثل Bloc / Provider في Flutter أو Redux / Zustand.
4. **التعامل مع البيانات:** استهلاك واجهات REST APIs والتخزين المحلي باستخدام Hive أو Room/SQLite.
5. **النشر:** إعداد الحسابات ونشر التطبيقات على Google Play Store و Apple App Store.`,

    ai: `**🤖 خارطة طريق الذكاء الاصطناعي وتعلم الآلة:**
1. **الأساسيات البرمجية:** الاحتراف في لغة Python والتعامل مع سطر الأوامر Linux.
2. **الرياضيات:** أساسيات الجبر الخطي، التفاضل والتكامل، والاحتمالات والإحصاء.
3. **معالجة البيانات:** معالجة المصفوفات والمجموعات بـ NumPy، تحليل البيانات بـ Pandas، وتصورها بـ Matplotlib/Seaborn.
4. **تعلم الآلة التقليدي (ML):** فهم خوارزميات التصنيف والأنحدار باستخدام Scikit-Learn.
5. **التعلم العميق (Deep Learning):** الشبكات العصبية الإصطناعية (ANNs, CNNs, RNNs) باستعمال PyTorch أو TensorFlow.
6. **الذكاء الاصطناعي التوليدي (GenAI):** التعامل مع نماذج اللغة الضخمة (LLMs) وأطر العمل الحديثة مثل LangChain.`
};
