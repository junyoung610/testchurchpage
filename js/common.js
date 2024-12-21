document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  initializeDropdowns();
});

function loadHeaderFooter() {
  // 헤더 로드
  fetch("../common/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    });

  // 푸터 로드
  fetch("../common/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });
}

function initializeDropdowns() {
  document
    .querySelectorAll("nav ul li.has-dropdown > a")
    .forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        const parentLi = this.parentElement;

        // 이전에 열린 메뉴 닫기
        document
          .querySelectorAll("nav ul li.has-dropdown")
          .forEach(function (otherLi) {
            if (otherLi !== parentLi) {
              otherLi.classList.remove("active");
            }
          });

        // 현재 메뉴 토글
        parentLi.classList.toggle("active");
      });
    });
}

function toggleMenu() {
  const gnb = document.querySelector(".gnb");
  const gnbInfo = document.querySelector(".user-info-M");
  const btn1 = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");

  gnb.classList.toggle("active");
  gnbInfo.classList.toggle("active");

  // 버튼 토글 (classList.toggle 사용으로 개선)
  btn1.classList.toggle("hidden");
  btn2.classList.toggle("block");
}
