const studentName = document.getElementById("studentName");
const gradesList = document.getElementById("gradesList");
const encouragement = document.getElementById("encouragement");

let studentsData = [];

// رابط JSON على GitHub
const jsonURL = "https://raw.githubusercontent.com/username/repo/main/grades.json"; // عدّل الرابط

fetch(jsonURL)
  .then(res => res.json())
  .then(data => {
    studentsData = data;
    showGrades();
  });

function showGrades() {
    const civilNumber = localStorage.getItem("civilNumber");
    if (!civilNumber) {
        window.location.href = "login.html";
        return;
    }

    const student = studentsData.find(s => s.civil == civilNumber);
    if (!student) {
        studentName.textContent = "لم يتم العثور على الطالب!";
        gradesList.innerHTML = "";
        encouragement.textContent = "";
        return;
    }

    studentName.innerHTML = `<img src="${student.photo}" alt="صورة الطالب" style="width:60px;border-radius:50%;margin-right:10px;"> ${student.name}`;

    let tableHTML = `<table>
        <tr><th>المادة</th><th>الدرجة</th><th>الحالة</th></tr>`;
    for (const [key, value] of Object.entries(student)) {
        if (["civil","name","photo"].includes(key)) continue;
        const statusIcon = value >= 50 ? "✔️" : "❌";
        tableHTML += `<tr><td>${key}</td><td>${value}</td><td>${statusIcon}</td></tr>`;
    }
    tableHTML += "</table>";
    gradesList.innerHTML = tableHTML;

    const grades = Object.entries(student).filter(([k,v]) => !["civil","name","photo"].includes(k)).map(([k,v])=>v);
    const avg = grades.reduce((a,b)=>a+b,0)/grades.length;
    encouragement.textContent = avg >= 80 ? "عمل رائع! استمر هكذا 👍" : "لا بأس، يمكنك التحسن مع الممارسة 💪";
}

function downloadPDF() {
    html2pdf().from(gradesList).set({margin:1, filename:'تقرير_الطالب.pdf'}).save();
}
