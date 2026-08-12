function openScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

function getApiKey() {
  return localStorage.getItem('GEMINI_API_KEY') || '';
}

document.getElementById('btnSaveKey').addEventListener('click', () => {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (key) {
    localStorage.setItem('GEMINI_API_KEY', key);
    alert('تم حفظ المفتاح بنجاح!');
    openScreen('mainScreen');
  } else {
    alert('الرجاء إدخال المفتاح أولاً.');
  }
});

async function callGemini(promptText) {
  const apiKey = getApiKey();
  if (!apiKey) {
    alert('يرجى حفظ مفتاح Gemini API أولاً من زر الإعدادات.');
    openScreen('settingsScreen');
    throw new Error('API Key Missing');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error('فشل جلب الرد من الذكاء الاصطناعي');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

document.getElementById('btnQuickSearch').addEventListener('click', async () => {
  const query = document.getElementById('quickQuery').value.trim();
  if (!query) return;

  const loader = document.getElementById('quickLoader');
  const resultBox = document.getElementById('quickResult');

  loader.classList.remove('hidden');
  resultBox.classList.add('hidden');

  try {
    const prompt = `أجب عن السؤال البرمجي التالي باختصار ووضوح وبلهجة مبسطة:\n${query}`;
    const answer = await callGemini(prompt);
    resultBox.innerText = answer;
    resultBox.classList.remove('hidden');
  } catch (err) {
    resultBox.innerText = 'حدث خطأ. تأكد من صحة المفتاح واتصالك بالإنترنت.';
    resultBox.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
  }
});

document.getElementById('btnAnalyzeIdea').addEventListener('click', async () => {
  const idea = document.getElementById('projectIdeaInput').value.trim();
  if (!idea) {
    alert('الرجاء كتابة فكرة المشروع.');
    return;
  }

  const loader = document.getElementById('ideaLoader');
  loader.classList.remove('hidden');

  const prompt = `أنت مهندس برمجيات محترف ومستشار تقني. حلل فكرة المشروع التالية واقترح الحلول المناسبة:
فكرة المشروع: "${idea}"

قدم الإجابة بالترتيب التالي وبشكل منظم:
1. أنسب لغة برمجة للمشروع ولماذا تم اختيارها.
2. المكتبات وأطر العمل (Frameworks) المقترحة.
3. الأدوات وبيئات التطوير (IDEs & Tools).
4. قواعد البيانات والخدمات السحابية المناسبة.
5. نصيحة للمبتدئ عند بدء تنفيذ هذه الفكرة.`;

  try {
    const recommendation = await callGemini(prompt);
    document.getElementById('ideaResultContent').innerText = recommendation;
    openScreen('resultScreen');
  } catch (err) {
    alert('تعذر استخراج التحليل. تأكد من إدخال مفتاح API صحيح في الإعدادات.');
  } finally {
    loader.classList.add('hidden');
  }
});

document.getElementById('btnCopyResult').addEventListener('click', () => {
  const text = document.getElementById('ideaResultContent').innerText;
  navigator.clipboard.writeText(text).then(() => alert('تم نسخ النتيجة بنجاح!'));
});

document.getElementById('btnShareResult').addEventListener('click', () => {
  const text = document.getElementById('ideaResultContent').innerText;
  if (navigator.share) {
    navigator.share({ title: 'الخطة البرمجية لمشروعي', text: text });
  } else {
    navigator.clipboard.writeText(text).then(() => alert('تم نسخ النص لمشاركته.'));
  }
});

function renderLanguages(filter = '') {
  const container = document.getElementById('languagesList');
  container.innerHTML = '';
  languagesData
    .filter(l => l.name.toLowerCase().includes(filter.toLowerCase()) || l.usage.includes(filter))
    .forEach(lang => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <h3>${lang.name} <small style="font-size:12px; color:#555">(${lang.tag})</small></h3>
        <p><strong>نبذة:</strong> ${lang.overview}</p>
        <p><strong>أين تستخدم؟:</strong> ${lang.usage}</p>
        <p><strong>الأدوات التابعة:</strong> ${lang.tools.join(', ')}</p>
        <p><strong>الإيجابيات:</strong> ${lang.pros}</p>
        <p><strong>السلبيات:</strong> ${lang.cons}</p>
      `;
      container.appendChild(card);
    });
}

document.getElementById('langSearchInput').addEventListener('input', (e) => {
  renderLanguages(e.target.value);
});

function renderTools(filter = '') {
  const container = document.getElementById('toolsList');
  container.innerHTML = '';
  toolsData
    .filter(t => t.name.toLowerCase().includes(filter.toLowerCase()) || t.category.includes(filter))
    .forEach(tool => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <h3>${tool.name}</h3>
        <p style="color:#1a73e8; font-size:13px;"><strong>النوع:</strong> ${tool.category}</p>
        <p>${tool.description}</p>
      `;
      container.appendChild(card);
    });
}

document.getElementById('toolsSearchInput').addEventListener('input', (e) => {
  renderTools(e.target.value);
});

renderLanguages();
renderTools();
