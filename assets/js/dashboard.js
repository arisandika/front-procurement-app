function loadDashboardSummary() {
  // Supplier count
  apiRequest({
    url: "/admin/suppliers",
    success: function (res) {
      $("#totalSuppliers").text(res.data.length);
    },
  });

  // Item count
  apiRequest({
    url: "/admin/items",
    success: function (res) {
      $("#totalItems").text(res.data.length);
    },
  });

  // Purchasing count + total revenue
  apiRequest({
    url: "/admin/purchasings",
    success: function (res) {
      $("#totalPurchasings").text(res.data.length);

      const totalRevenue = res.data.reduce((acc, p) => acc + p.grand_total, 0);
      $("#totalRevenue").text("Rp " + totalRevenue.toLocaleString());
    },
  });
}

// Call on dashboard page load
$(document).ready(function () {
  loadDashboardSummary();
});
