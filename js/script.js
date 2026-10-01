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
// スクロール時のヘッダー制御
// ・ファーストビューを過ぎたらナビを非表示（is-scrolled）
// ・区切り画像の上ではハンバーガーを白に（is-over-divider）
// ==========================================

// 【修正】header を明示的に取得（id名がそのまま変数として使える仕組みに頼らない）
const header = document.querySelector("#header");
const heroSection = document.querySelector(".hero-section");
const divider = document.querySelector(".section-divider");
const burgerY = 55;

// 【整理】同じ処理が2つの scroll イベントに分かれていたので1つにまとめた
window.addEventListener("scroll", () => {
    // ファーストビューを過ぎたかどうか
    const isScrolled = window.scrollY >= heroSection.offsetHeight;
    header.classList.toggle("is-scrolled", isScrolled);

    // 区切り画像がハンバーガーボタンの位置にかぶっているかどうか
    const dividerRect = divider.getBoundingClientRect();
    const isOverDivider = dividerRect.top <= burgerY && dividerRect.bottom >= burgerY;
    header.classList.toggle("is-over-divider", isOverDivider);
});

// ==========================================
// トップページに戻るボタン
// ==========================================

const pageTop = document.querySelector(".page-top");

pageTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================
// スクロールでふわっと浮かび上がる
// ==========================================

const fadeTargets = document.querySelectorAll(".js-fadein");

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // 一度出たら監視をやめる（1回だけ）
        }
    });
}, {
    rootMargin: "0px 0px -10% 0px" // 画面下から10%入ったところで発火
});

fadeTargets.forEach((target) => {
    fadeObserver.observe(target);
});