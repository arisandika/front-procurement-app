$(document).ready(function () {
  // INIT ICONS
  lucide.createIcons();

  // MAIN SIDEBAR LOGIC
  $("#toggle-sidebar").click(function () {
    $("body").toggleClass("sidebar-collapsed");
  });

  $("#close-sidebar").click(function () {
    $("body").addClass("sidebar-collapsed");
  });

  // CART SIDEBAR LOGIC
  $("#toggle-cart").click(function () {
    $("body").toggleClass("sidebar-cart-collapsed");
  });

  $("#close-cart-sidebar").click(function () {
    $("body").addClass("sidebar-cart-collapsed");
  });

  // EVENT BINDINGS
  $(".nav-section-toggle").click(function () {
    const section = $(this).next(".nav-section-content");

    section.slideToggle(300);

    $(this).toggleClass("collapsed");
  });

  // RESPONSIVE HANDLER
  if ($(window).width() < 1024) {
    $("body").addClass("sidebar-collapsed");
    $("body").addClass("sidebar-cart-collapsed");
  }

  $(window).resize(function () {
    if ($(window).width() >= 1024) {
      $("body").removeClass("sidebar-collapsed");
      $("body").removeClass("sidebar-cart-collapsed");
    } else {
      $("body").addClass("sidebar-collapsed");
      $("body").addClass("sidebar-cart-collapsed");
    }
  });
});
