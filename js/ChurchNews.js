let newsData = [];
const itemsPerPage = 5;
let currentPage = 1;

// JSON 데이터 로드
async function loadNewsData() {
  try {
    // GitHub Pages 환경에서 JSON 파일 경로 설정
    const baseURL = "/testchurchpage/"; // repository-name을 실제 GitHub 리포지토리 이름으로 변경
    const response = await fetch(`${baseURL}News/newsData.json`); // JSON 파일 경로

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const newsData = await response.json(); // JSON 데이터 로드

    // URL 해시 확인
    const hash = window.location.hash.substring(1);
    if (hash.startsWith("news-")) {
      const id = parseInt(hash.replace("news-", ""), 10);
      if (!isNaN(id)) {
        showDetail(id); // 특정 뉴스 상세 보기
        return;
      }
    }

    renderTable(currentPage); // 뉴스 리스트 렌더링
    renderPagination(); // 페이지네이션 렌더링
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 오류 발생:", error);
  }
}

// 테이블 렌더링
function renderTable(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = newsData.slice(startIndex, endIndex);

  const tbody = document.getElementById("news-body");
  tbody.innerHTML = "";

  currentData.forEach((item) => {
    const row = `
            <tr onclick="navigateToDetail(${item.id})">
                <td>${item.no}</td>
                <td>${item.title}</td>
                <td>${item.author}</td>
                <td>${item.date}</td>
            </tr>
        `;
    tbody.innerHTML += row;
  });
}

// 페이지네이션 렌더링
function renderPagination() {
  const totalPages = Math.ceil(newsData.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = `<a href="#" class="${
      i === currentPage ? "active" : ""
    }" onclick="changePage(${i})">${i}</a>`;
    pagination.innerHTML += pageLink;
  }
}

// 페이지 변경
function changePage(page) {
  const totalPages = Math.ceil(newsData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(page);
  renderPagination();
}

function fixImagePaths(content) {
  // 이미지 경로 수정
  return content.replace(/src=['"]\/img\//g, 'src="../News/img/');
}

// 상세 페이지 이동
function navigateToDetail(id) {
  window.location.hash = `news-${id}`; // 해시 값을 #detail-<id> 형태로 변경
  showDetail(id);
}

// 상세 페이지 표시
function showDetail(id) {
  const item = newsData.find((news) => news.id === id);
  if (!item) return;

  // 상세 페이지로 이동
  document.getElementById("news-list").style.display = "none";
  document.getElementById("news-detail").style.display = "block";

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-author").textContent = item.author;
  document.getElementById("detail-date").textContent = item.date;

  // content에 포함된 이미지 경로 수정
  document.getElementById("detail-content").innerHTML = fixImagePaths(
    item.content
  );

  // 첨부파일 처리
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";
  if (item.files && item.files.length > 0) {
    item.files.forEach((file) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `../News/file/${file}`;
      link.textContent = `${file}`;
      link.download = file;
      listItem.appendChild(link);
      fileList.appendChild(listItem);
    });
  } else {
    const noFiles = document.createElement("li");
    noFiles.textContent = "첨부파일이 없습니다.";
    fileList.appendChild(noFiles);
  }
}

// 목록 보기
function showList() {
  window.location.hash = ""; // URL 해시 초기화

  // 목록 페이지를 표시하고, 상세 페이지를 숨깁니다.
  document.getElementById("news-list").style.display = "block";
  document.getElementById("news-detail").style.display = "none";

  // 목록 페이지를 렌더링
  renderTable(currentPage); // 현재 페이지의 데이터를 다시 렌더링합니다.
}

// 초기 데이터 로드
loadNewsData();
