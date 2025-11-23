function uploadExcel() {
    const fileInput = document.getElementById("excelFile");
    const status = document.getElementById("status");
    const preview = document.getElementById("preview");

    if (!fileInput.files.length) {
        status.style.color = "red";
        status.textContent = "الرجاء اختيار ملف Excel أولاً!";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData.length) {
            status.style.color = "red";
            status.textContent = "الملف فارغ أو غير منسق!";
            return;
        }

        localStorage.setItem("studentsData", JSON.stringify(jsonData));

        preview.textContent = JSON.stringify(jsonData, null, 2);
        status.style.color = "green";
        status.textContent = "تم تحويل الملف بنجاح! يمكنك تحميل JSON ورفعه إلى GitHub.";
    };

    reader.readAsArrayBuffer(file);
}
