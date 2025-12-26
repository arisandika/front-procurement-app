function requireAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire("Unauthorized", "Please login first", "warning").then(() => {
      window.location.href = "../index.html";
    });
    return false;
  }
  return true;
}

function redirectByRole() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = parseJwt(token);
  if (!payload) return;

  if (payload.role === "admin") {
    window.location.href = "admin/dashboard.html";
  } else {
    window.location.href = "home.html";
  }
}

function blockAuthPages() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = parseJwt(token);

  if (!payload) return;

  if (payload.role === "admin") {
    window.location.href = "admin/dashboard.html";
  } else {
    window.location.href = "home.html";
  }
}

function handleLogout() {
  $("#logoutButton").on("click", function () {
    Swal.fire({
      title: "Logout?",
      text: "Your session will be ended",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        Swal.fire("Logged Out", "You have been logged out", "success").then(
          () => {
            window.location.href = "../index.html";
          }
        );
      }
    });
  });
}
