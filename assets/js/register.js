$(document).ready(function () {
  $("#registerForm").on("submit", function (e) {
    e.preventDefault();

    const username = $("#username").val().trim();
    const password = $("#password").val().trim();
    const role = $("#role").val();

    // FRONTEND VALIDATION
    if (!username) {
      return Swal.fire("Validation Error", "Username is required", "warning");
    }

    if (!password || password.length < 6) {
      return Swal.fire(
        "Validation Error",
        "Password must be at least 6 characters",
        "warning"
      );
    }

    if (!role) {
      return Swal.fire("Validation Error", "Role must be selected", "warning");
    }

    // PAYLOAD (JSON)
    const payload = {
      username: username,
      password: password,
      role: role,
    };

    // AJAX POST (JSON BODY)
    $.ajax({
      url: BASE_URL + "/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),

      success: function (res) {
        Swal.fire(
          "Success",
          "Register successful, please login",
          "success"
        ).then(() => {
          window.location.href = "index.html";
        });
      },

      error: function (xhr) {
        const msg = xhr.responseJSON?.message || "Register failed";
        Swal.fire("Error", msg, "error");
      },
    });
  });
});
