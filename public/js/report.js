document.addEventListener("DOMContentLoaded", async () => {
  const showDailyButton = document.getElementById("showDailyReport");
  const tbodyDaily = document.getElementById("tbodyDailyId");
  const tfootDaily = document.getElementById("tfootDailyId");

  const showWeeklyButton = document.getElementById("showWeeklyReport");
  const tbodyWeekly = document.getElementById("tbodyWeeklyId");
  const tfootWeekly = document.getElementById("tfootWeeklyId");

  const showMonthlyButton = document.getElementById("showMonthlyReport");
  const tbodyMonthly = document.getElementById("tbodyMonthlyId");
  const tfootMonthly = document.getElementById("tfootMonthlyId");

  const showYearlyButton = document.getElementById("showYearlyReport");
  const tbodyYearly = document.getElementById("tbodyId");
  const tfootYearly = document.getElementById("tfootYearlyId");

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token is missing");
    return;
  }

  const headers = { Authorization: token };

  showDailyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const selectedDate = document.getElementById("date").value;
      let totalAmount = 0;
      const response = await axios.post(
        "http://13.127.206.146/reports/dailyReports",
        { date: selectedDate },
        { headers }
      );
      tbodyDaily.innerHTML = "";
      response.data.forEach((expense) => {
        totalAmount += expense.amount;
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${expense.amount}</td>
      `;
        tbodyDaily.appendChild(row);
      });
      tfootDaily.innerHTML = `
      <tr>
        <td></td>
        <td>Total</td>
        <td id="dailyTotalAmount">${totalAmount}</td>
      </tr>
    `;
    } catch (err) {
      console.log("Getting errror>", err);
    }
  });
  showWeeklyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const selectedWeek = document.getElementById("week").value;
      let totalAmount = 0;
      const response = await axios.post(
        "http://13.127.206.146/reports/weeklyReports",
        { week: selectedWeek },
        { headers }
      );
      tbodyWeekly.innerHTML = "";
      response.data.forEach((expense) => {
        totalAmount += expense.amount;
        const createdAt = new Date(expense.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();
        const row = document.createElement("tr");
        row.innerHTML = `  
        <td>${formattedDate} - ${formattedTime}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${expense.amount}</td>
      `;
        tbodyWeekly.appendChild(row);
      });
      tfootWeekly.innerHTML = `
      <tr>
        <td></td>
        <td></td>
        <td>Total</td>
        <td id="weeklyTotalAmount">${totalAmount}</td>
      </tr>
    `;
    } catch (err) {
      console.log("Getting error>", err);
    }
  });

  showMonthlyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const selectedMonth = document.getElementById("month").value;
      const response = await axios.post(
        "http://13.127.206.146/reports/monthlyReports",
        { month: selectedMonth },
        { headers }
      );
      tbodyMonthly.innerHTML = "";
      let totalAmount = 0;
      response.data.forEach((expense) => {
        totalAmount += expense.amount;
        const createdAt = new Date(expense.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();
        const row = document.createElement("tr");
        row.innerHTML = `
       <td>${formattedDate} ${formattedTime}</td>
       <td>${expense.category}</td>
       <td>${expense.description}</td>
       <td>${expense.amount}</td>
     `;
        tbodyMonthly.appendChild(row);
      });
      tfootMonthly.innerHTML = `
     <tr>
       <td></td>
       <td></td>
       <td>Total</td>
       <td id="monthlyTotalAmount">${totalAmount}</td>
     </tr>
   `;
    } catch (err) {
      console.log(err);
    }
  });

  showYearlyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const selectedYear = document.getElementById("year-input").value;
      const response = await axios.post(
        "http://13.127.206.146/reports/yearlyReports",
        { year: selectedYear },
        { headers }
      );
      tbodyYearly.innerHTML = "";
      let totalAmount = 0;
      response.data.forEach((monthlyExpense) => {
        totalAmount += monthlyExpense.amount;
        const row = document.createElement("tr");
        row.innerHTML = `
       <td>${monthlyExpense.month}</td>
       <td>${monthlyExpense.amount}</td>
     `;
        tbodyYearly.appendChild(row);
      });
      tfootYearly.innerHTML = `<tr>
    <td>Total</td>
    <td>${totalAmount}</td>
    </tr>`;
    } catch (err) {
      console.log(err);
    }
  });
});
