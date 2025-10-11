let newsData = [];
const itemsPerPage = 5;
let currentPage = 1;

// 초기 데이터 로드
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

async function showDetail(id) {
  const item = newsData.find((news) => news.id === id);
  if (!item) return;

  // 상세 페이지 전환
  document.getElementById("news-list").style.display = "none";
  document.getElementById("news-detail").style.display = "block";

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-author").textContent = item.author;
  document.getElementById("detail-date").textContent = item.date;

  const contentElement = document.getElementById("detail-content");

  // ✅ TXT 파일이면 fetch로 내용 불러오기
  if (item.content.endsWith(".txt")) {
    try {
      const response = await fetch(`./News/${item.content}`);
      if (!response.ok) throw new Error("TXT 파일 로드 오류");
      const textContent = await response.text();
      contentElement.innerHTML = textContent.replace(/\n/g, "<br>");
    } catch (error) {
      console.error("TXT 파일 로드 오류:", error);
      contentElement.textContent = "내용을 불러오는 중 오류가 발생했습니다.";
    }
  } else {
    // HTML 형식 콘텐츠는 그대로 삽입
    contentElement.innerHTML = item.content;
  }

  // 첨부파일
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

// ✅ 초기 로드
loadNewsData();
