/* -------------------------------
   전역 변수
-------------------------------- */
let sermonData = [];
let currentPage = 1;

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
async function loadSermonData() {
  try {
    let baseURL = "./";
    if (window.location.hostname.includes("github.io")) {
      baseURL = "/testchurchpage/";
    }

    const response = await fetch(`./json/sermonData.json`);
    sermonData = await response.json();

    renderTable(currentPage);
    renderPagination();
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 오류 발생:", error);
    const body = document.getElementById("sermon-body");
    if (body) body.innerHTML = "데이터를 불러오는 중 오류가 발생했습니다.";
  }
}

/* -------------------------------
   페이지네이션 출력
-------------------------------- */
function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const itemsPerPage = 6;
  const totalPages = Math.ceil(sermonData.length / itemsPerPage);

  let buttons = "";
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button onclick="goToPage(${i})" ${
      i === currentPage ? "class='active'" : ""
    }>${i}</button>`;
  }

  pagination.innerHTML = buttons;
}

function goToPage(page) {
  currentPage = page;
  renderTable(page);
  renderPagination();
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
