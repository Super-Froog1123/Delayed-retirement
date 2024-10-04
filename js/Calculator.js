// 初始化 flatpickr，设置为月-年格式，隐藏具体日期
flatpickr("#birthdate", {
    plugins: [
        new monthSelectPlugin({
            shorthand: true, // 使用简写格式（Jan, Feb...）
            dateFormat: "Y-m", // 保存的格式为年-月
            altFormat: "F Y", // 显示的格式为月-年（January 2024）
            theme: "light" // 使用 light 主题
        })
    ]
});

let retirementData = [];

// 加载 JSON 文件
window.onload = function() {
    fetch('c.json') // JSON 文件与 HTML 文件在同一目录下
        .then(response => response.json())
        .then(data => {
            retirementData = data;
            console.log(retirementData); // 查看 JSON 数据
        });
};

// 计算退休年龄
function calculateRetirement() {
    const birthdate = document.getElementById('birthdate').value;
    const category = document.getElementById('employeeCategory').value;
    const resultDiv = document.getElementById('result');

    // 判断是否选择了出生年月
    if (!birthdate) {
        resultDiv.innerHTML = '<p>Please select your date of birth.</p>';
        return;
    }

    const [year, month] = birthdate.split("-");
    const birthYear = parseInt(year);
    const birthMonth = month.padStart(2, '0');  // 确保月份始终是两位数
    const formattedDate = `${String(birthYear)}-${String(birthMonth).padStart(2, '0')}`;

    // 男职工逻辑处理
    if (category === "Male Employee" && birthYear < 1965) {
        const retirementAge = 60;
        const retirementYear = birthYear + retirementAge;
        resultDiv.innerHTML = `
            <p>The statutory retirement age remains ${retirementAge} years.</p>
            <p>Reformed retirement date: ${retirementYear}-${birthMonth}</p>
            <p>Delay in months: 0 months</p>
        `;
    } else if (category === "Male Employee" && (birthYear > 1976 || (birthYear === 1976 && birthMonth > 12))) {
        const retirementAge = 63;
        const retirementYear = birthYear + retirementAge;
        resultDiv.innerHTML = `
            <p>The statutory retirement age changes to ${retirementAge} years.</p>
            <p>Reformed retirement date: ${retirementYear}-${birthMonth}</p>
            <p>Delay in months: 36 months</p>
        `;
    } 
    // 原法定退休年龄55周岁的女职工逻辑处理
    else if (category === "Female Emplyee (55 retirement)" && birthYear < 1970) {
        const retirementAge = 55;
        const retirementYear = birthYear + retirementAge;
        resultDiv.innerHTML = `
            <p>The statutory retirement age remains ${retirementAge} years.</p>
            <p>Reformed retirement date: ${retirementYear}-${birthMonth}</p>
            <p>Delay in months: 0 months</p>
        `;
    } else if (category === "Female Emplyee (55 retirement)" && (birthYear > 1981 || (birthYear === 1981 && birthMonth > 12))) {
        const retirementAge = 58;
        const retirementYear = birthYear + retirementAge;
        resultDiv.innerHTML = `
            <p>The statutory retirement age changes to ${retirementAge} years.</p>
            <p>Reformed retirement date: ${retirementYear}-${birthMonth}</p>
            <p>Delay in months: 36 months</p>
        `;
    }
    // 原法定退休年龄50周岁的女职工逻辑处理
    else if (category === "Female Emplyee (50 retirement)" && birthYear < 1975) {
        const retirementAge = 50;
        const retirementYear = birthYear + retirementAge;
        resultDiv.innerHTML = `
            <p>The statutory retirement age remains ${retirementAge} years.</p>
            <p>Reformed retirement date: ${retirementYear}-${birthMonth}</p>
            <p>Delay in months: 0 months</p>
        `;
    } else if (category === "Female Emplyee (50 retirement)" && (birthYear > 1984 || (birthYear === 1984 && birthMonth > 12))) {
        const retirementAge = 55;
        const retirementYear = birthYear + retirementAge;
        resultDiv.innerHTML = `
            <p>The statutory retirement age changes to ${retirementAge} years.</p>
            <p>Reformed retirement date: ${retirementYear}-${birthMonth}</p>
            <p>Delay in months: 60 months</p>
        `;
    } 


    // 其他情况下查找退休数据
    else {
        const record = retirementData.find(item => {
            return item["Date of birth"] === birthdate && item["Employee Category"] === category;
        });

        // 显示结果或错误信息
        if (record) {
            const reformRetirementYear = record["Retirement time after reform"].split('-')[0];  
            const reformRetirementMonth = record["Retirement time after reform"].split('-')[1];

            resultDiv.innerHTML = `
                <p>The statutory retirement age changes to ${record["Legal retirement age after reform"]}.</p>
                <p>Reformed retirement date: ${reformRetirementYear}-${reformRetirementMonth}</p>
                <p>Delay in months: ${record["Delayed months"]} months</p>
            `;
        } else {
            resultDiv.innerHTML = '<p>No matching data found for the selected date of birth and employee category.</p>';
        }
    }

}