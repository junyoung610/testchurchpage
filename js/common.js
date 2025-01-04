document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  initializeDropdowns();
});
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
});

function loadHeaderFooter() {
  const baseURL = "/testchurchpage/"; // repository-name을 GitHub 리포지토리 이름으로 변경
  fetch(`${baseURL}common/header.html`)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Header 파일 로드 실패: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    })
    .catch((error) => console.error("헤더 로드 에러:", error));

  fetch(`${baseURL}common/footer.html`)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Footer 파일 로드 실패: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch((error) => console.error("푸터 로드 에러:", error));
}

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

// 초기 데이터 로드
async function loadSermonData() {
  try {
    const response = await fetch("../json/sermonData.json"); // JSON 파일 경로
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
    console.error("JSON 데이터를 로드하는 중 오류 발생:", error);
    document.getElementById("sermon-body").innerHTML =
      "데이터를 불러오는 중 오류가 발생했습니다.";
  }
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

const menuButton = document.querySelector(".menu button");
const gnb = document.querySelector(".gnb");
const body = document.body;

menuButton.addEventListener("click", () => {
  gnb.classList.toggle("active");
  body.classList.toggle("no-scroll");
});

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
