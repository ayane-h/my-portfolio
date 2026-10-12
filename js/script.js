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
const menuLinks = document.querySelectorAll(".menu-panel-nav a");

// メニューを閉じる処理（ボタン以外からも使うので関数にまとめる）
function closeMenu() {
    burgerBtn.classList.remove("is-active");
    menuPanel.classList.remove("is-open");
    burgerBtn.setAttribute("aria-expanded", false);
}

// ボタンで開閉
burgerBtn.addEventListener("click", () => {
    const isOpen = burgerBtn.classList.toggle("is-active");

    menuPanel.classList.toggle("is-open", isOpen);

    burgerBtn.setAttribute("aria-expanded", isOpen);
});

// メニュー内のリンクを押したら閉じる
menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
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
if (heroSection && divider) {
    window.addEventListener("scroll", () => {
        // ファーストビューを過ぎたかどうか
        const isScrolled = window.scrollY >= heroSection.offsetHeight;
        header.classList.toggle("is-scrolled", isScrolled);

        // 区切り画像がハンバーガーボタンの位置にかぶっているかどうか
        const dividerRect = divider.getBoundingClientRect();
        const isOverDivider = dividerRect.top <= burgerY && dividerRect.bottom >= burgerY;
        header.classList.toggle("is-over-divider", isOverDivider);
    });
}

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

// iOS Safari でタップ時の :active を有効にする
document.addEventListener("touchstart", () => { }, { passive: true });

// ==========================================
// 紹介ページ：スクリーンショットの矢印ボタン
// ==========================================

const galleryTrack = document.querySelector(".detail-gallery__track");

// トップページにはギャラリーがないので、あるときだけ動かす
if (galleryTrack) {
    const prevBtn = document.querySelector(".detail-gallery__arrow--prev");
    const nextBtn = document.querySelector(".detail-gallery__arrow--next");

    // 画像1枚分（幅＋間隔）だけ横に動かす。direction は 1 で次へ、-1 で前へ
    function scrollGallery(direction) {
        const item = galleryTrack.querySelector(".detail-gallery__item");
        const gap = parseFloat(getComputedStyle(galleryTrack).columnGap) || 0;

        galleryTrack.scrollBy({
            left: direction * (item.offsetWidth + gap),
            behavior: "smooth"
        });
    }

    // 端まで来たら、その方向の矢印を隠す
    function updateArrows() {
        const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;

        prevBtn.hidden = galleryTrack.scrollLeft <= 1;
        nextBtn.hidden = galleryTrack.scrollLeft >= maxScroll - 1;
    }

    prevBtn.addEventListener("click", () => scrollGallery(-1));
    nextBtn.addEventListener("click", () => scrollGallery(1));
    galleryTrack.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    updateArrows();

    // ------------------------------------------
    // 掴んで横スクロール
    // ------------------------------------------
    let isDragging = false;
    let startX = 0;          // 掴んだ瞬間のマウス位置
    let startScrollLeft = 0; // 掴んだ瞬間のスクロール位置

    galleryTrack.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX;
        startScrollLeft = galleryTrack.scrollLeft;
        galleryTrack.classList.add("is-dragging");
        e.preventDefault(); // 画像そのものがドラッグされるのを防ぐ
    });

    // 枠の外にマウスが出ても続くよう、window で監視する
    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        galleryTrack.scrollLeft = startScrollLeft - (e.pageX - startX);
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;

        // 離したら、一番近い画像の位置までなめらかに寄せる
        const item = galleryTrack.querySelector(".detail-gallery__item");
        const gap = parseFloat(getComputedStyle(galleryTrack).columnGap) || 0;
        const step = item.offsetWidth + gap;
        const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        const target = Math.min(Math.round(galleryTrack.scrollLeft / step) * step, maxScroll);

        galleryTrack.scrollTo({ left: target, behavior: "smooth" });

        // 寄せ終わってからスナップを戻す（すぐ戻すとカクッと飛ぶため）
        setTimeout(() => galleryTrack.classList.remove("is-dragging"), 500);
    });
}

// ==========================================
// わたしについてページ：LIKES の写真をゆっくり流す
// ・ループ用の2セット目を自動で複製（1セット目と必ず同じになる）
// ・帯の left（位置）を1コマずつ書き換えて流す
//   transform やスクロールで動かすと、iPhoneのSafariが画面外にあった写真を
//   描かないまま流してしまい白く抜けるため、毎コマ描き直される left を使う
// ・速さは「1秒あたり何px動くか」で決める
// ==========================================

const likesTrack = document.querySelector(".me-likes__track");

// LIKES があるページ（about.html）でだけ動かす
if (likesTrack) {
    const likesMarquee = likesTrack.closest(".me-likes__marquee");
    const likesGroup = likesTrack.querySelector(".me-likes__group");

    // 2セット目を作る。読み上げソフトが2回読まないよう aria-hidden を付け、alt を空にする
    const likesClone = likesGroup.cloneNode(true);
    likesClone.setAttribute("aria-hidden", "true");
    likesClone.querySelectorAll("img").forEach((img) => {
        img.alt = "";
    });
    likesTrack.appendChild(likesClone);

    // 1秒に動く距離（px）。小さくするほどゆっくりになる
    const LIKES_SPEED = 25;

    // 動きを減らす設定の人には流さない（CSS側で横スクロールに切り替わる）
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let likesPos = 0;        // 今どれだけ左へ動かしたか
    let loopWidth = 0;       // 1セット分の幅（ここまで来たら最初に戻す）
    let lastTime = null;     // 前のコマの時刻
    let isPaused = false;
    let lastWidth = window.innerWidth;

    // 2セット目の始まり ー 1セット目の始まり ＝ 1セット分の幅
    function measureLikes() {
        loopWidth = likesClone.offsetLeft - likesGroup.offsetLeft;
    }

    // 1コマごとに少しずつ左へ動かす
    function stepLikes(time) {
        if (lastTime === null) lastTime = time;

        // 前のコマからの経過秒数（タブを離れて戻ったときに一気に進まないよう、最大0.1秒）
        const elapsed = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        if (!isPaused && loopWidth > 0) {
            likesPos += LIKES_SPEED * elapsed;

            // 1セット分進んだら、その分だけ戻す（2セット目と1セット目は同じなので、つなぎ目が見えない）
            if (likesPos >= loopWidth) {
                likesPos -= loopWidth;
            }
            likesTrack.style.left = `${-likesPos}px`;
        }

        requestAnimationFrame(stepLikes);
    }

    if (!reduceMotion.matches) {
        measureLikes();
        requestAnimationFrame(stepLikes);

        // 画像の読み込みが終わったあとにも測り直す
        window.addEventListener("load", measureLikes);

        // 画面の「横幅」が変わったときだけ測り直す
        // （スマホはスクロールでアドレスバーが出入りして高さが変わるので、高さの変化では測り直さない）
        window.addEventListener("resize", () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            measureLikes();
        });

        // マウスを乗せている間は止める（マウスが使えるPCだけ）
        if (window.matchMedia("(hover: hover)").matches) {
            likesMarquee.addEventListener("mouseenter", () => {
                isPaused = true;
            });
            likesMarquee.addEventListener("mouseleave", () => {
                isPaused = false;
            });
        }
    }
}
