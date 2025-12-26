function apiRequest(options) {
  const token = localStorage.getItem("token");

  $.ajax({
    url: BASE_URL + options.url,
    method: options.method || "GET",
    contentType: "application/json",
    data: options.data ? JSON.stringify(options.data) : null,
    headers: {
      Authorization: token ? "Bearer " + token : "",
    },
    success: options.success,
    error: function (xhr) {
      if (xhr.status === 401) {
        Swal.fire("Session Expired", "Please login again", "warning").then(
          () => {
            localStorage.removeItem("token");
            window.location.href = "index.html";
          }
        );
      } else {
        options.error && options.error(xhr);
      }
    },
  });
}
