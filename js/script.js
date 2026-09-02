// ==========================================
// トップ3行文字色変化
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        const columns = document.querySelectorAll(".text-column");
        columns.forEach(function (column) {
            column.style.color = "#FFFFFF";
            column.style.fontWeight = "300";
        });
    }, 3400);
});

// ==========================================
// ハンバーガーメニュー
// ==========================================

const burgerBtn = document.querySelector(".burger-btn");
const menuPanel = document.querySelector(".menu-panel");

burgerBtn.addEventListener("click", () => {
    const isOpen = burgerBtn.classList.toggle("is-active");

    menuPanel.classList.toggle("is-open", isOpen);

    burgerBtn.setAttribute("aria-expanded", isOpen);
});


// ==========================================
// ヘッダー：スクロール時にナビを縮小・非表示
// ==========================================

const heroSection = document.querySelector(".hero-section");

window.addEventListener("scroll", () => {
    if (window.scrollY >= heroSection.offsetHeight) {
        header.classList.add("is-scrolled");
    } else {
        header.classList.remove("is-scrolled");
    }
});