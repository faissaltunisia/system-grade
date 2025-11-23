const studentName = document.getElementById("studentName");
const gradesList = document.getElementById("gradesList");
const encouragement = document.getElementById("encouragement");

// عدّل هذا الرابط إلى رابط JSON في مستودعك
const jsonURL = "https://raw.githubusercontent.com/faissaltunisia/system-grade/refs/heads/main/grades.json";

let studentsData = [];

// جلب بيانات الطلاب
fetch(jsonURL)
  .then(res => res.json())
  .then(data => { studentsData = data; showGrades(); })
  .catch(err => { studentName.textContent = "حدث خطأ في تحميل البيانات!"; console.error(err); });

function showGrades() {
    const civilNumber = localStorage.getItem("civilNumber");
    if (!civilNumber) { window.location.href = "login.html"; return; }

    const student = studentsData.find(s => s.civil == civilNumber);

    if (!student) {
        alert("الرقم المدني غير موجود. الرجاء المحاولة مرة أخرى.");
        localStorage.removeItem("civilNumber");
        window.location.href = "login.html";
        return;
    }

    // عرض صورة واسم الطالب
    studentName.innerHTML = `<img src="${student.photo}" alt="صورة الطالب" style="width:60px;border-radius:50%;margin-right:10px;"> ${student.name}`;

    // إنشاء جدول الدرجات
    let tableHTML = `<table><tr><th>المادة</th><th>الدرجة</th><th>الحالة</th></tr>`;
    for (const [key, value] of Object.entries(student)) {
        if (["civil","name","photo"].includes(key)) continue;
        const statusIcon = value >= 50 ? "✔️" : "❌";
        tableHTML += `<tr><td>${key}</td><td>${value}</td><td>${statusIcon}</td></tr>`;
    }
    tableHTML += "</table>";
    gradesList.innerHTML = tableHTML;

    // رسالة تشجيعية حسب المتوسط
    const grades = Object.entries(student).filter(([k,v])=>!["civil","name","photo"].includes(k)).map(([k,v])=>v);
    const avg = grades.reduce((a,b)=>a+b,0)/grades.length;
    encouragement.textContent = avg >= 80 ? "عمل رائع! استمر هكذا 👍" : "لا بأس، يمكنك التحسن مع الممارسة 💪";
}

// تحميل التقرير PDF بشكل واضح
function downloadPDF() {
    const element = gradesList;

    const opt = {
        margin:       [10,10,10,10],      // أقل من قبل
        filename:     'تقرير_الطالب.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1.5, useCORS: true }, // تقليل الدقة قليلاً لتلائم الصفحة
        jsPDF:        { unit: 'px', format: 'a4', orientation: 'portrait' }
    };

    // قبل التحويل: تصغير حجم الجدول إذا كان كبير
    element.style.width = "100%";
    element.querySelectorAll("th, td").forEach(td => {
        td.style.fontSize = "12px";       // تصغير الخط داخل PDF
        td.style.padding = "5px";         // تقليل الحشو لتلائم الصفحة
    });

    html2pdf().set(opt).from(element).save();
}


