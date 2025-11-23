function convertExcel() {
    const fileInput = document.getElementById("excelFile");
    const status = document.getElementById("status");
    if (!fileInput.files.length) { status.textContent = "اختر ملف Excel أولاً."; return; }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data,{type:"binary"});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const jsonBlob = new Blob([JSON.stringify(jsonData,null,2)], {type:"application/json"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(jsonBlob);
        a.download = "grades.json";
        a.click();
        status.textContent = "تم توليد ملف JSON. يمكنك رفعه على GitHub الآن.";
    };
    reader.readAsBinaryString(file);
}
