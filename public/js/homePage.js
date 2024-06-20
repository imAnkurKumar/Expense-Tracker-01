document.addEventListener("DOMContentLoaded", async () => {
  const elements = {
    expenseForm: document.getElementById("expense-form"),
    expenseList: document.getElementById("expenses"),
    buyPremiumButton: document.getElementById("premium-btn"),
    premiumStatusDiv: document.getElementById("premium-status"),
    leaderboardButton: document.getElementById("leaderboard-btn"),
    reportButton: document.getElementById("report-btn"),
    downloadButton: document.getElementById("download-btn"),
    downloadHistoryButton: document.getElementById("download-history-btn"),
    downloadList: document.getElementById("download-history"),
    expensePerPage: document.getElementById("expensesPerPage"),
    currentPageDisplay: document.getElementById("currentPage"),
    prevPageBtn: document.getElementById("prevPageBtn"),
    nextPageBtn: document.getElementById("nextPageBtn"),
  };

  let currentPage = 1;
  let totalPages;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token is missing");
    return;
  }

  const headers = { Authorization: token };

  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const showPremiumStatus = () => {
    elements.premiumStatusDiv.textContent = "You are a Premium User!";
    elements.premiumStatusDiv.classList.add("premium-message");
    elements.buyPremiumButton.style.display = "none";
    elements.leaderboardButton.style.display = "inline-block";
    elements.reportButton.style.display = "inline-block";
    elements.downloadButton.style.display = "inline-block";
    elements.downloadHistoryButton.style.display = "inline-block";
  };

  const createExpenseItem = (expense, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("expense-item");
    listItem.innerHTML = `
      <span>${index}. $${expense.amount} - ${expense.category} - ${expense.description}</span>
      <button class="delete-btn" data-id="${expense.id}">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;
    return listItem;
  };

  const getSelectedPerPage = () => {
    const expensePerPageSelect = elements.expensePerPage;
    const selectedPerPage = parseInt(expensePerPageSelect.value, 10);
    localStorage.setItem("expensesPerPage", selectedPerPage);
    return selectedPerPage;
  };

  const loadExpenses = async (page) => {
    try {
      const perPage = getSelectedPerPage();
      const decodedToken = parseJwt(token);
      if (decodedToken.isPremiumUser) showPremiumStatus();

      const response = await axios.get(
        `http://13.127.206.146:3000/expense/getAllExpense?page=${page}&perPage=${perPage}`,
        { headers }
      );
      const { expenses, totalExpenses } = response.data;
      elements.expenseList.innerHTML = "";
      const startingIndex = (page - 1) * perPage + 1;
      expenses.forEach((expense, index) => {
        elements.expenseList.appendChild(
          createExpenseItem(expense, startingIndex + index)
        );
      });
      totalPages = Math.ceil(totalExpenses / perPage);
      elements.currentPageDisplay.innerHTML = `Page ${page} of ${totalPages}`;
      elements.prevPageBtn.disabled = page === 1;
      elements.nextPageBtn.disabled = page === totalPages;
    } catch (error) {
      console.error(
        "Error loading expenses:",
        error.response?.data?.message || error.message
      );
    }
  };

  const addExpense = async (amount, description, category) => {
    try {
      const response = await axios.post(
        "http://13.127.206.146:3000/expense/addExpense",
        { amount, description, category },
        { headers }
      );

      if (response.status === 201) {
        loadExpenses(currentPage);
        elements.expenseForm.reset();
        alert(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      const response = await axios.delete(
        `http://13.127.206.146:3000/expense/deleteExpense/${expenseId}`,
        { headers }
      );
      if (response.status === 200) {
        alert(response.data.message);
        loadExpenses(currentPage);
      }
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  const buyPremium = async () => {
    try {
      const response = await axios.get(
        "http://13.127.206.146:3000/purchase/premiumMembership",
        { headers }
      );
      const options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (response) {
          const res = await axios.post(
            "http://13.127.206.146:3000/purchase/updateTransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers }
          );
          alert("You are a Premium User Now");
          localStorage.setItem("token", res.data.token);
          showPremiumStatus();
        },
      };
      new Razorpay(options).open();
    } catch (error) {
      console.error(
        "Error during premium purchase:",
        error.response?.data?.message || error.message
      );
      alert("Something went wrong during the premium purchase");
    }
  };

  const showLeaderboard = () => window.open("leaderboard.html", "_blank");
  const showReport = () => window.open("report.html", "_blank");

  const downloadExpense = async () => {
    try {
      const response = await axios.get(
        "http://13.127.206.146:3000/expense/downloadExpense",
        { headers }
      );
      if (response.status === 200) {
        const a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error("Error downloading Expense:", err);
    }
  };

  const fetchDownloadHistory = async () => {
    try {
      const response = await axios.get(
        "http://13.127.206.146:3000/expense/downloadHistory",
        { headers }
      );
      elements.downloadList.innerHTML = "";
      response.data.forEach((download, index) => {
        const downloadDate = new Date(download.downloadDate);
        const formattedDate = downloadDate.toLocaleDateString();
        const formattedTime = downloadDate.toLocaleTimeString();
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${index + 1}.</span><a href="${
          download.fileURL
        }" target="_blank">${formattedDate} ${formattedTime}</a>`;
        elements.downloadList.appendChild(listItem);
      });
    } catch (err) {
      console.error("Error fetching download history:", err);
    }
  };

  await loadExpenses(currentPage);

  elements.prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadExpenses(currentPage);
    }
  });

  elements.nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadExpenses(currentPage);
    }
  });

  elements.expensePerPage.addEventListener("change", () => {
    const selectedPerPage = getSelectedPerPage();
    localStorage.setItem("expensesPerPage", selectedPerPage);
    loadExpenses(currentPage);
  });

  elements.expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("expense-amount").value;
    const description = document.getElementById("expense-description").value;
    const category = document.getElementById("expense-category").value;
    await addExpense(amount, description, category);
  });

  elements.expenseList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      const expenseId = deleteButton.dataset.id;
      deleteExpense(expenseId);
    }
  });

  elements.buyPremiumButton.addEventListener("click", (e) => {
    e.preventDefault();
    buyPremium();
  });

  elements.leaderboardButton.addEventListener("click", (e) => {
    e.preventDefault();
    showLeaderboard();
  });

  elements.reportButton.addEventListener("click", (e) => {
    e.preventDefault();
    showReport();
  });

  elements.downloadButton.addEventListener("click", (e) => {
    e.preventDefault();
    downloadExpense();
  });

  elements.downloadHistoryButton.addEventListener("click", (e) => {
    e.preventDefault();
    fetchDownloadHistory();
  });
});