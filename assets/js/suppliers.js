// LOAD SUPPLIERS
function loadSuppliers() {
  apiRequest({
    url: "/admin/suppliers",
    success: function (res) {
      const suppliers = res.data;

      // SORT DESC BY ID
      suppliers.sort((a, b) => b.ID - a.ID);

      let html = "";

      suppliers.forEach((s, i) => {
        html += `
                <tr class="hover:bg-slate-800/50">
                    <td class="px-6 py-4">${s.ID}</td>
                    <td class="px-5 py-4 font-medium">${s.Name}</td>
                    <td class="px-5 py-4 text-slate-400">${s.Email}</td>
                    <td class="px-5 py-4">${s.Address}</td>
                    <td class="px-5 py-4 text-right">
                        <div class="flex gap-6">
                            <button onclick='openViewModal(${JSON.stringify(
                              s
                            )})'
                                class="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 hover:text-blue-500 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
                            >
                                View
                            </button>
                            <button onclick='openEditModal(${JSON.stringify(
                              s
                            )})'
                                class="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
                            >
                                Edit
                            </button>
                            <button onclick="deleteSupplier(${s.ID})"
                                class="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
                `;
      });

      $("#supplierTableBody").html(html);
    },
  });
}

// OPEN CREATE MODAL
function openCreateModal() {
  resetModalState();

  $("#modalTitle").text("Create Supplier");
  $("#supplierId").val("");
  $("#supplierName, #supplierEmail, #supplierAddress").val("");
  $("#supplierModal").removeClass("hidden").addClass("flex");
}

// OPEN VIEW MODAL
function openViewModal(data) {
  resetModalState();

  $("#modalTitle").text("Supplier Detail");

  $("#supplierName").val(data.Name).prop("disabled", true);
  $("#supplierEmail").val(data.Email).prop("disabled", true);
  $("#supplierAddress").val(data.Address).prop("disabled", true);

  $("#saveSupplier").hide();
  $("#supplierModal").removeClass("hidden").addClass("flex");
}

// OPEN EDIT MODAL
function openEditModal(data) {
  resetModalState();

  $("#modalTitle").text("Edit Supplier");
  $("#supplierId").val(data.ID);
  console.log(data.ID);
  $("#supplierName").val(data.Name).prop("disabled", false);
  $("#supplierEmail").val(data.Email).prop("disabled", false);
  $("#supplierAddress").val(data.Address).prop("disabled", false);

  $("#supplierModal").removeClass("hidden").addClass("flex");
}

// DELETE SUPPLIER
function deleteSupplier(id) {
  Swal.fire({
    title: "Delete supplier?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then((result) => {
    if (result.isConfirmed) {
      apiRequest({
        url: `/admin/suppliers/${id}`,
        method: "DELETE",
        success: function () {
          Swal.fire("Deleted", "Supplier removed", "success");
          loadSuppliers();
        },
        error: function (xhr) {
          Swal.fire("Error", xhr.responseJSON?.message || "Failed", "error");
        },
      });
    }
  });
}

// CREATE AND UPDATE SUPPLIER
$("#saveSupplier").on("click", function () {
  const id = $("#supplierId").val();

  const payload = {
    name: $("#supplierName").val().trim(),
    email: $("#supplierEmail").val().trim(),
    address: $("#supplierAddress").val().trim(),
  };

  // FE validation
  if (!payload.name || !payload.email || !payload.address) {
    return Swal.fire("Validation Error", "All fields are required", "warning");
  }

  // CREATE
  if (!id) {
    apiRequest({
      url: "/admin/suppliers",
      method: "POST",
      data: payload,
      success: function () {
        Swal.fire("Success", "Supplier created", "success");
        closeModal();
        loadSuppliers();
      },
      error: function (xhr) {
        Swal.fire("Error", xhr.responseJSON?.message || "Failed", "error");
      },
    });
  } else {
    // UPDATE
    apiRequest({
      url: `/admin/suppliers/${id}`,
      method: "PUT",
      data: payload,
      success: function () {
        Swal.fire("Success", "Supplier updated", "success");
        closeModal();
        loadSuppliers();
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
  $("#supplierId").val("");

  $("#supplierName, #supplierEmail, #supplierAddress")
    .val("")
    .prop("disabled", false);

  $("#saveSupplier").show();
}

// CLOSE MODAL
function closeModal() {
  $("#supplierModal").addClass("hidden").removeClass("flex");
}

$("#closeModal, #cancelModal").on("click", closeModal);
