let newsData = [];
const itemsPerPage = 5;
let currentPage = 1;

async function loadNewsData() {
  try {
    const baseURL = "/testchurchpage/";
    const response = await fetch(
      `${baseURL}News/newsData.json?cache-bust=${Date.now()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    newsData = await response.json();

    const hash = window.location.hash.substring(1);
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

function fixImagePaths(content) {
  // 이미지 경로를 수정: src="/img/" 형태를 src="../News/img/" 형태로 변경
  return content.replace(/src=['"]\/img\//g, 'src="../News/img/');
}

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

loadNewsData();
