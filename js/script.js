document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        const columns = document.querySelectorAll(".text-column");
        columns.forEach(function (column) {
            column.style.color = "#FFFFFF";
            column.style.fontWeight = "300";
        });
    }, 3400);
});