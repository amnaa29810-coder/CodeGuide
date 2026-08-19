// script.js - كل المنطق الجديد

// ===== 1. البحث الفوري وعرض البطاقات =====
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const questionCard = document.getElementById('questionCard');
const questionText = document.getElementById('questionText');

// عرض كل البيانات عند تحميل الصفحة
window.onload = function() {
  displayAllItems();
  loadArchive();
};

searchInput.addEventListener('input', function(e) {
  const query = e.target.value.trim().toLowerCase();
  
  if (query === '') {
    // إذا كان الحقل فارغاً، اخفي مربع السؤال واعرض كل العناصر
    questionCard.classList.remove('active');
    displayAllItems();
    return;
  }

  // اظهر مربع السؤال
  questionCard.classList.add('active');

  // ابحث في قاعدة البيانات
  let foundItems = [];
  dataBase.categories.forEach(cat => {
    cat.items.forEach(item => {
      if (item.toLowerCase().includes(query)) {
        foundItems.push({ name: item, category: cat.name });
      }
    });
  });

  if (foundItems.length > 0) {
    displayResults(foundItems);
  } else {
    // إذا لم يجد، اعرض رسالة مع إبقاء مربع السؤال ظاهراً
    resultsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; background:rgba(255,0,0,0.1); border-radius:15px;">❌ لا توجد نتائج لـ "${query}"، لكن يمكنك كتابة سؤالك في المربع أعلاه.</div>`;
  }
});

function displayAllItems() {
  let allItems = [];
  dataBase.categories.forEach(cat => {
    cat.items.forEach(item => {
      allItems.push({ name: item, category: cat.name });
    });
  });
  displayResults(allItems);
}

function displayResults(items) {
  resultsContainer.innerHTML = items.map(item => `
    <div>
      <div style="font-size:20px;">${item.name}</div>
      <small style="color:#aaa; font-size:12px;">${item.category}</small>
    </div>
  `).join('');
}

// ===== 2. حفظ الأسئلة (الأرشيف) =====
function saveQuestion() {
  const text = questionText.value.trim();
  if (text === '') {
    alert('يرجى كتابة السؤال أولاً!');
    return;
  }

  let archive = JSON.parse(localStorage.getItem('questionArchive')) || [];
  archive.push({ 
    text: text, 
    date: new Date().toLocaleString('ar-EG') 
  });
  localStorage.setItem('questionArchive', JSON.stringify(archive));
  
  questionText.value = ''; // افرغ الحقل
  loadArchive(); // حدث القائمة
  alert('✅ تم حفظ السؤال بنجاح!');
}

function loadArchive() {
  const archiveList = document.getElementById('archiveList');
  let archive = JSON.parse(localStorage.getItem('questionArchive')) || [];
  
  if (archive.length === 0) {
    archiveList.innerHTML = '<p style="color:#aaa;">لا توجد أسئلة محفوظة بعد.</p>';
    return;
  }

  archiveList.innerHTML = archive.map((q, index) => `
    <div class="archive-item">
      <strong>📌 ${q.text}</strong> 
      <span style="color:#888; font-size:12px; display:block;">${q.date}</span>
      <button onclick="deleteArchive(${index})" style="background:red; color:#fff; border:none; border-radius:10px; padding:5px 10px; margin-top:5px; cursor:pointer;">حذف</button>
    </div>
  `).join('');
}

function deleteArchive(index) {
  let archive = JSON.parse(localStorage.getItem('questionArchive')) || [];
  archive.splice(index, 1);
  localStorage.setItem('questionArchive', JSON.stringify(archive));
  loadArchive();
}

function toggleArchive() {
  const list = document.getElementById('archiveList');
  list.classList.toggle('hidden');
}

// ===== 3. المشاركة ونسخ الرابط =====
function shareContent() {
  const text = questionText.value.trim() || 'مرحباً، هذا سؤالي عن البرمجة:';
  if (navigator.share) {
    navigator.share({
      title: 'سؤال برمجي',
      text: text,
    }).catch(err => console.log('تم الإلغاء'));
  } else {
    // بديل للمتصفحات التي لا تدعم المشاركة
    copyLink(text);
  }
}

function copyLink() {
  const text = questionText.value.trim() || 'رابط مشاركة سؤال برمجي';
  // محاكاة رابط (أو استخدم الرابط الحقيقي للصفحة)
  const dummyLink = window.location.href + '?q=' + encodeURIComponent(text);
  
  navigator.clipboard.writeText(dummyLink).then(() => {
    alert('✅ تم نسخ الرابط بنجاح!');
  }).catch(() => {
    // طريقة بديلة للنسخ
    const textarea = document.createElement('textarea');
    textarea.value = dummyLink;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('✅ تم نسخ الرابط!');
  });
}