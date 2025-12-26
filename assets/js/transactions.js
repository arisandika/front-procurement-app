// STATE (GLOBAL)
let purchaseCart = {
  supplier: null,
  items: [],
};

let itemsCache = [];

// API LOADERS
function loadPurchasings() {
  apiRequest({
    url: "/admin/purchasings",
    success: function (res) {
      let html = "";

      // SORT DESC BY ID
      res.data.sort((a, b) => b.id - a.id);

      res.data.forEach((p) => {
        html += `
          <tr class="hover:bg-slate-800/50">
            <td class="px-6 py-4">${p.id}</td>
            <td class="px-5 py-4">
              ${new Date(p.date).toLocaleDateString()}
            </td>
            <td class="px-5 py-4">${p.supplier.name}</td>
            <td class="px-5 py-4">${p.user.username}</td>
            <td class="px-5 py-4 font-semibold">
              Rp ${p.grand_total.toLocaleString()}
            </td>
            <td class="px-5 py-4 text-left">
              <button
                onclick='openPurchasingDetail(${JSON.stringify(p)})'
                class="text-blue-500 hover:text-blue-600 font-bold text-xs uppercase cursor-pointer"
              >
                View
              </button>
            </td>
          </tr>
        `;
      });

      $("#purchasingTableBody").html(html);
    },
  });
}

function loadSuppliersForPurchase() {
  apiRequest({
    url: "/admin/suppliers",
    success: function (res) {
      let html = `<option value="">Pilih Supplier</option>`;
      res.data.forEach((s) => {
        html += `<option value="${s.ID}">${s.Name}</option>`;
      });
      $("#purchaseSupplier").html(html);
    },
  });
}

function loadItemsForPurchase() {
  apiRequest({
    url: "/admin/items",
    success: function (res) {
      itemsCache = res.data;

      let html = `<option value="">Pilih Item</option>`;
      res.data.forEach((i) => {
        html += `<option value="${i.ID}">${i.Name}</option>`;
      });

      $("#purchaseItem").html(html);
    },
  });
}

// MODAL HANDLERS
function openPurchaseModal() {
  loadSuppliersForPurchase();
  loadItemsForPurchase();

  $("#purchaseQty").val("");
  $("#itemStockInfo").text("");

  $("#purchaseModal").removeClass("hidden").addClass("flex");
}

function closePurchaseModal() {
  $("#purchaseModal").addClass("hidden").removeClass("flex");
}

$("#cancelPurchaseModal").on("click", closePurchaseModal);

// ITEM SELECTION
$("#purchaseItem").on("change", function () {
  const itemId = Number($(this).val());
  const item = itemsCache.find((i) => i.ID === itemId);

  $("#itemStockInfo").text(item ? `Stock tersedia: ${item.Stock}` : "");
});

// CART LOGIC
$("#addToCart").on("click", function () {
  const supplierId = Number($("#purchaseSupplier").val());
  const itemId = Number($("#purchaseItem").val());
  const qty = Number($("#purchaseQty").val());

  if (!supplierId || !itemId || qty <= 0) {
    return Swal.fire("Error", "Lengkapi semua field", "warning");
  }

  const item = itemsCache.find((i) => i.ID === itemId);
  if (!item) return;

  const supplierName = $("#purchaseSupplier option:selected").text();

  if (!purchaseCart.supplier) {
    purchaseCart.supplier = {
      id: supplierId,
      name: supplierName,
    };
  } else if (purchaseCart.supplier.id !== supplierId) {
    return Swal.fire(
      "Error",
      "Tidak boleh beda supplier dalam satu pembelian",
      "error"
    );
  }

  const existing = purchaseCart.items.find((i) => i.item_id === itemId);

  if (existing) {
    existing.qty += qty;
    existing.sub_total = existing.qty * existing.price;
  } else {
    purchaseCart.items.push({
      item_id: item.ID,
      name: item.Name,
      price: item.Price,
      qty,
      sub_total: qty * item.Price,
    });
  }

  saveCart();
  renderCartSidebar();
  closePurchaseModal();

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Item berhasil ditambahkan ke keranjang",
    timer: 1200,
    showConfirmButton: false,
  }).then(() => {
    resetPurchaseForm();
  });
});

function removeCartItem(index) {
  purchaseCart.items.splice(index, 1);

  if (purchaseCart.items.length === 0) {
    purchaseCart.supplier = null;
  }

  saveCart();
  renderCartSidebar();
}

// RENDER UI
function renderCartSidebar() {
  let html = "";
  let grandTotal = 0;

  purchaseCart.items.forEach((i, index) => {
    grandTotal += i.sub_total;

    html += `
    <div class="bg-slate-800 rounded-lg p-3 space-y-1">
        <div class="mb-4">
          <div class="text-xs text-slate-400">Supplier</div>
          <div class="font-semibold text-sm">
            ${purchaseCart.supplier.name}
          </div>
        </div>
        <div class="border-b border-slate-700 mb-2"></div>
        <div class="flex justify-between">
          <div class="font-medium">${i.name}</div>
          <button
            onclick="removeCartItem(${index})"
            class="text-red-400 text-xs hover:text-red-500 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div class="text-xs text-slate-400">
          ${i.qty} x Rp ${i.price.toLocaleString()}
        </div>
        <div class="font-semibold">
          Rp ${i.sub_total.toLocaleString()}
        </div>
      </div>
    `;
  });

  html += `
    <div class="pt-4 border-t border-slate-700 text-right font-bold">
      Total: Rp ${grandTotal.toLocaleString()}
    </div>
  `;

  $("#sidebar-cart .custom-scrollbar").html(html);
}

// SUBMIT PURCHASE
$("#submitPurchase").on("click", function () {
  if (!purchaseCart.supplier || purchaseCart.items.length === 0) {
    return Swal.fire("Error", "Keranjang masih kosong", "warning");
  }

  const payload = {
    supplier_id: purchaseCart.supplier.id,
    user_id: parseJwt(localStorage.getItem("token")).user_id,
    details: purchaseCart.items.map((i) => ({
      item_id: i.item_id,
      qty: i.qty,
    })),
  };

  apiRequest({
    url: "/admin/purchasings",
    method: "POST",
    data: payload,
    success: function () {
      Swal.fire("Success", "Purchasing berhasil dibuat", "success");
      resetCart();
      loadPurchasings();
    },
    error: function (xhr) {
      Swal.fire("Error", xhr.responseJSON?.message || "Failed", "error");
    },
  });
});

function resetCart() {
  purchaseCart = { supplier: null, items: [] };
  clearCartStorage();

  $("#sidebar-cart .custom-scrollbar").html(`
    <p class="text-sm text-slate-400 text-center mt-10">
      Keranjang kosong
    </p>
  `);
}

// PURCHASING DETAIL MODAL
function openPurchasingDetail(p) {
  $("#pdSupplier").text(p.supplier.name);
  $("#pdUser").text(p.user.username);
  $("#pdDate").text(new Date(p.date).toLocaleString());
  $("#pdTotal").text("Rp " + p.grand_total.toLocaleString());

  let itemsHtml = "";
  p.details.forEach((d) => {
    itemsHtml += `
      <tr class="border-b border-slate-800">
        <td class="px-4 py-2">${d.item.name}</td>
        <td class="px-4 py-2">${d.qty}</td>
        <td class="px-4 py-2">Rp ${d.price.toLocaleString()}</td>
        <td class="px-4 py-2 font-semibold">
          Rp ${d.sub_total.toLocaleString()}
        </td>
      </tr>
    `;
  });

  $("#pdItems").html(itemsHtml);
  $("#purchasingDetailModal").removeClass("hidden").addClass("flex");
}

function resetPurchaseForm() {
  $("#purchaseItem").val("");
  $("#purchaseQty").val("");
  $("#itemStockInfo").text("");
}

function closePurchasingDetail() {
  $("#purchasingDetailModal").addClass("hidden").removeClass("flex");
}
