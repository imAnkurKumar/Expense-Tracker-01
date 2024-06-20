document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordForm = document.getElementById("forgot-password-form");

  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    try {
      const response = await axios.post(
        "http://13.127.206.146:3000/password/forgotPassword",
        {
          email,
        }
      );
      if (response.status === 200) {
        alert(response.data.message);
      }
      forgotPasswordForm.reset();
    } catch (error) {
      console.error(
        "Error during password reset request:",
        error.response?.data?.message || error.message
      );
      alert("Failed to send password reset request. Please try again.");
    }
  });
});
