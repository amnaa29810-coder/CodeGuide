const programmingCategories = [
    {
        id: "web",
        title: "🌐 تطوير الويب",
        desc: "اللغات الأساسية لبناء المواقع",
        languages: [
            { name: "HTML & CSS", desc: "الهيكل والتنسيق لصفحات الويب." },
            { name: "JavaScript", desc: "إضافة التفاعلية للمواقع." },
            { name: "PHP", desc: "بناء الخوادم وقواعد البيانات." }
        ]
    },
    {
        id: "mobile",
        title: "📱 تطبيقات الهواتف",
        desc: "لغات بناء التطبيقات",
        languages: [
            { name: "Dart (Flutter)", desc: "بناء تطبيقات للآيفون والأندرويد بكود واحد." },
            { name: "Kotlin", desc: "اللغة الرسمية لتطوير الأندرويد." },
            { name: "Swift", desc: "اللغة الرسمية لتطوير تطبيقات Apple." }
        ]
    }
];

const devTools = [
    { name: "Git & GitHub", desc: "إدارة النسخ وحفظ الكود." },
    { name: "VS Code", desc: "أشهر محرر كود مجاني." },
    { name: "Postman", desc: "اختبار ومعاينة الـ APIs." }
];

const executionApps = [
    { name: "Acode", desc: "محرر كود للأندرويد يدعم HTML/CSS/JS." },
    { name: "Replit", desc: "منصة سحابية لكتابة الكود من المتصفح." },
    { name: "Termux", desc: "بيئة بيش لتشغيل Python و Node.js على الأندرويد." }
];

const techGlossary = [
    { name: "API", desc: "واجهة برمجية لربط التطبيقات ببعضها." },
    { name: "Backend", desc: "الجزء الخلفي المسؤول عن السيرفر وقواعد البيانات." },
    { name: "Frontend", desc: "واجهة المستخدم التي يتفاعل معها الزائر." }
];

const roadmapsData = {
    web: "### مسار تطوير الويب:\n1. تعلم HTML & CSS\n2. تعلم JavaScript\n3. تعلم Git & GitHub",
    mobile: "### مسار تطبيقات الهواتف:\n1. تعلم أساسيات البرمجة\n2. تعلم Flutter & Dart",
    ai: "### مسار الذكاء الاصطناعي:\n1. تعلم Python\n2. مكتبات البيانات NumPy & Pandas"
};
