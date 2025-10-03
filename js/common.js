document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  initializeDropdowns();
  loadSermonData(); // 초기 데이터 로드
  initMenuToggle(); // 메뉴 토글 초기화
});

/* -------------------------------
   헤더/푸터 로드
-------------------------------- */
function loadHeaderFooter() {
  let baseURL = "";

  // GitHub Pages 환경이면 repository 이름 붙이기
  if (window.location.hostname.includes("github.io")) {
    baseURL = "/testchurchpage/";
  }

  // 헤더
  fetch(`${baseURL}common/header.html`)
    .then((response) => {
      if (!response.ok) throw new Error(`Header 로드 실패: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    })
    .catch((error) => console.error("헤더 로드 에러:", error));

  // 푸터
  fetch(`${baseURL}common/footer.html`)
    .then((response) => {
      if (!response.ok) throw new Error(`Footer 로드 실패: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch((error) => console.error("푸터 로드 에러:", error));
}

/* -------------------------------
   설교 데이터 로드
-------------------------------- */
let sermonData = [];
let currentPage = 1;

async function loadSermonData() {
  try {
    let baseURL = "./";

    if (window.location.hostname.includes("github.io")) {
      baseURL = "/testchurchpage/";
    }

    const response = await fetch(`${baseURL}json/sermonData.json`);
    sermonData = await response.json();

    const hash = window.location.hash.substring(1); // URL 해시 확인
    if (hash.startsWith("sermon-")) {
      const id = parseInt(hash.replace("sermon-", ""), 10);
      if (!isNaN(id)) {
        showDetail(id);
        return;
      }
    }

    renderTable(currentPage);
    renderPagination();
  } catch (error) {
    console.error("JSON 로드 오류:", error);
    document.getElementById("sermon-body").innerHTML =
      "데이터를 불러오는 중 오류가 발생했습니다.";
  }
}

/* -------------------------------
   드롭다운 메뉴
-------------------------------- */
function initializeDropdowns() {
  document
    .querySelectorAll("nav ul li.has-dropdown > a")
    .forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        const parentLi = this.parentElement;

        // 다른 드롭다운 닫기
        document
          .querySelectorAll("nav ul li.has-dropdown")
          .forEach((otherLi) => {
            if (otherLi !== parentLi) {
              otherLi.classList.remove("active");
            }
          });

        // 현재 메뉴 토글
        parentLi.classList.toggle("active");
      });
    });
}

/* -------------------------------
   모바일 GNB 토글
-------------------------------- */
function initMenuToggle() {
  const menuButton = document.querySelector(".menu-button");
  const gnb = document.querySelector(".gnb");
  const body = document.body;

  if (menuButton && gnb) {
    menuButton.addEventListener("click", () => {
      gnb.classList.toggle("active");
      body.classList.toggle("no-scroll");
    });
  }

  // gnb 내부 서브메뉴 토글
  document.querySelectorAll(".gnb > ul > li > a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const subMenu = e.target.nextElementSibling;
      if (subMenu && subMenu.classList.contains("sub-gnb")) {
        e.preventDefault();
        subMenu.style.display =
          subMenu.style.display === "block" ? "none" : "block";
      }
    });
  });
}
