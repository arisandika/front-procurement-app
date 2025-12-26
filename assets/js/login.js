$(document).ready(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const username = $("#username").val().trim();
    const password = $("#password").val().trim();

    // FRONTEND VALIDATION
    if (!username) {
      return Swal.fire("Validation Error", "Username is required", "warning");
    }

    if (!password) {
      return Swal.fire("Validation Error", "Password is required", "warning");
    }

    const payload = {
      username: username,
      password: password,
    };

    // AJAX LOGIN
    $.ajax({
      url: BASE_URL + "/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),

      success: function (res) {
        if (!res.token) {
          return Swal.fire("Error", "Invalid login response", "error");
        }

        // SAVE TOKEN
        localStorage.setItem("token", res.token);

        Swal.fire("Login Success", "Welcome back!", "success").then(() => {
          redirectByRole();
        });
      },
      error: function (xhr) {
        const msg = xhr.responseJSON?.message || "Login failed";
        Swal.fire("Login Failed", msg, "error");
      },
    });
  });
});
