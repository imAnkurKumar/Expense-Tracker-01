document.addEventListener("DOMContentLoaded", () => {
  const resetPasswordForm = document.getElementById("reset-password-form");

  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      const res = await axios.post(
        "http://13.127.206.146:3000/password/resetPassword",
        {
          password: newPassword,
        }
      );
      if (res.status === 200) {
        alert(res.data.message);
      }
      window.location.href = "/loginPage.html";
    } catch (error) {
      console.log(error);
      alert("Failed to reset password. Please try again.");
    }
  });
});
