// LOAD ITEMS
function loadItems() {
  apiRequest({
    url: "/admin/items",
    success: function (res) {
      const items = res.data;

      // SORT DESC BY ID
      items.sort((a, b) => b.ID - a.ID);

      let html = "";

      items.forEach((i) => {
        html += `
          <tr class="hover:bg-slate-800/50">
            <td class="px-6 py-4">${i.ID}</td>
            <td class="px-5 py-4 font-medium">${i.Name}</td>
            <td class="px-5 py-4">${i.Stock}</td>
            <td class="px-5 py-4">Rp ${Number(i.Price).toLocaleString()}</td>
            <td class="px-5 py-4 text-right">
              <div class="flex gap-6">
                <button onclick='openViewModal(${JSON.stringify(i)})'
                  class="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 hover:text-blue-500 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer">
                  View
                </button>
                <button onclick='openEditModal(${JSON.stringify(i)})'
                  class="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer">
                  Edit
                </button>
                <button onclick="deleteItem(${i.ID})"
                  class="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      $("#itemTableBody").html(html);
    },
  });
}

// OPEN CREATE MODAL
function openCreateModal() {
  resetModalState();

  $("#modalTitle").text("Create Item");
  $("#itemId").val("");
  $("#itemName, #itemPrice, #itemStock").val("");
  $("#saveItem").show();
  $("#itemModal").removeClass("hidden").addClass("flex");
}

// OPEN VIEW MODAL
function openViewModal(data) {
  resetModalState();

  $("#modalTitle").text("Item Detail");

  $("#itemName").val(data.Name).prop("disabled", true);
  $("#itemPrice").val(data.Price).prop("disabled", true);
  $("#itemStock").val(data.Stock).prop("disabled", true);

  $("#saveItem").hide();
  $("#itemModal").removeClass("hidden").addClass("flex");
}

// OPEN EDIT MODAL
function openEditModal(data) {
  resetModalState();

  $("#modalTitle").text("Edit Item");
  $("#itemId").val(data.ID);

  $("#itemName").val(data.Name).prop("disabled", false);
  $("#itemPrice").val(data.Price).prop("disabled", false);
  $("#itemStock").val(data.Stock).prop("disabled", false);

  $("#saveItem").show();
  $("#itemModal").removeClass("hidden").addClass("flex");
}

// DELETE ITEM
function deleteItem(id) {
  Swal.fire({
    title: "Delete item?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then((result) => {
    if (result.isConfirmed) {
      apiRequest({
        url: `/admin/items/${id}`,
        method: "DELETE",
        success: function () {
          Swal.fire("Deleted", "Item removed", "success");
          loadItems();
        },
        error: function (xhr) {
          Swal.fire("Error", xhr.responseJSON?.message || "Failed", "error");
        },
      });
    }
  });
}

// CREATE & UPDATE ITEM
$("#saveItem").on("click", function () {
  const id = $("#itemId").val();

  const payload = {
    name: $("#itemName").val().trim(),
    price: Number($("#itemPrice").val()),
    stock: Number($("#itemStock").val()),
  };

  if (!payload.name || !payload.price || !payload.stock) {
    return Swal.fire("Validation Error", "All fields are required", "warning");
  }

  // CREATE
  if (!id) {
    apiRequest({
      url: "/admin/items",
      method: "POST",
      data: payload,
      success: function () {
        Swal.fire("Success", "Item created", "success");
        closeModal();
        loadItems();
      },
      error: function (xhr) {
        Swal.fire("Error", xhr.responseJSON?.message || "Failed", "error");
      },
    });
  } else {
    // UPDATE
    apiRequest({
      url: `/admin/items/${id}`,
      method: "PUT",
      data: payload,
      success: function () {
        Swal.fire("Success", "Item updated", "success");
        closeModal();
        loadItems();
      },
      error: function (xhr) {
        Swal.fire("Error", xhr.responseJSON?.message || "Failed", "error");
      },
    });
  }
});

// RESET MODAL ON CLOSE
function resetModalState() {
  $("#modalTitle").text("");
  $("#itemId").val("");

  $("#itemName, #itemPrice, #itemStock").val("").prop("disabled", false);

  $("#saveItem").show();
}

// CLOSE MODAL
function closeModal() {
  $("#itemModal").addClass("hidden").removeClass("flex");
}

$("#closeModal, #cancelModal").on("click", closeModal);
