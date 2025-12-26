const CART_KEY = "purchase_cart";

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(purchaseCart));
}

function loadCart() {
  const data = localStorage.getItem(CART_KEY);
  if (data) {
    purchaseCart = JSON.parse(data);
    renderCartSidebar();
  }
}

function clearCartStorage() {
  localStorage.removeItem(CART_KEY);
}

window.addEventListener("storage", function (event) {
  if (event.key === CART_KEY) {
    const before = purchaseCart.items?.length || 0;

    if (event.newValue) {
      purchaseCart = JSON.parse(event.newValue);
    } else {
      purchaseCart = { supplier: null, items: [] };
    }

    renderCartSidebar();

    const after = purchaseCart.items.length;

    if (after > before) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Cart updated from another tab",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }
});
