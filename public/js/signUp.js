document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await axios.post("/user/signUp", {
      name,
      email,
      password,
    });

    if (response.status === 201) {
      alert("Sign-up successful: " + response.data.message);
      window.location.href = "/loginPage.html";

      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    }
  } catch (error) {
    if (error.response.status === 400) {
      alert("Error: " + error.response.data.message);
    } else {
      console.error("Sign-up error:", error.response.data.message);
    }
  }
});
