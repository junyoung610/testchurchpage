let newsData = [];
const itemsPerPage = 5;
let currentPage = 1;

// 초기 데이터 로드 (중복 함수 정의 제거)
async function loadNewsData() {
  try {
    const response = await fetch("./News/newsData.json"); // JSON 파일 경로
    newsData = await response.json();

    const hash = window.location.hash.substring(1); // URL 해시 확인
    if (hash.startsWith("news-")) {
      const id = parseInt(hash.replace("news-", ""), 10);
      if (!isNaN(id)) {
        showDetail(id);
        return;
      }
    }

    renderTable(currentPage);
    renderPagination();
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 오류 발생:", error);
    document.getElementById("news-body").innerHTML =
      "데이터를 불러오는 중 오류가 발생했습니다.";
  }
}

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

function navigateToDetail(id) {
  window.location.hash = `news-${id}`;
  showDetail(id);
}

// 이미지 경로 수정 함수는 newsData.json에서 이미 상대 경로를 사용하고 있으므로 제거

function showDetail(id) {
  const item = newsData.find((news) => news.id === id);
  if (!item) return;

  // 상세 페이지로 이동
  document.getElementById("news-list").style.display = "none";
  document.getElementById("news-detail").style.display = "block";

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-author").textContent = item.author;
  document.getElementById("detail-date").textContent = item.date;

  // content에 포함된 이미지 경로를 그대로 사용
  document.getElementById("detail-content").innerHTML = item.content;

  // 첨부파일 처리
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";
  if (item.files && item.files.length > 0) {
    item.files.forEach((file) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `./News/file/${file}`;
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

function showList() {
  window.location.hash = "";
  document.getElementById("news-list").style.display = "block";
  document.getElementById("news-detail").style.display = "none";
  renderTable(currentPage);
}

// loadNewsData(); // <--- 이 부분이 제거됨
