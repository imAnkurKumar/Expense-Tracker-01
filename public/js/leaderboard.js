document.addEventListener("DOMContentLoaded", async () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token is missing");
    return;
  }

  const headers = { Authorization: token };

  const createLeaderboardItem = (user, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("leaderboard-item");
    listItem.innerHTML = `
      <span>${index + 1}. ${user.name} - $${user.totalExpenses}</span>
    `;
    return listItem;
  };

  const loadLeaderboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/premium/showLeaderBoard",
        { headers }
      );
      console.log(response);
      const leaderboardData = response.data;
      leaderboardList.innerHTML = "";
      leaderboardData.forEach((user, index) => {
        const listItem = createLeaderboardItem(user, index);
        leaderboardList.appendChild(listItem);
      });
    } catch (error) {
      console.error(
        "Error loading leaderboard:",
        error.response?.data?.message || error.message
      );
    }
  };

  await loadLeaderboard();
});
