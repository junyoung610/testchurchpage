let sermonData = [];
let filteredData = []; // 🔹 검색된 데이터 (기본은 전체 데이터)
const itemsPerPage = 6;
let currentPage = 1;

// 초기 데이터 로드
async function loadSermonData() {
  try {
    const response = await fetch("../json/sermonData.json"); // JSON 파일 로드
    sermonData = await response.json();

    // 검색 결과 기본값 = 전체 데이터
    filteredData = [...sermonData];

    // URL 해시 확인
    const hash = window.location.hash.substring(1);
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

// 테이블 렌더링 (filteredData 기준)
function renderTable(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const ul = document.getElementById("sermon-body");
  ul.innerHTML = "";

  currentData.forEach((item) => {
    const row = `
      <li class="video-box" onclick="navigateToDetail(${item.id})">
          ${item.img}
          <b class="hidden">${item.id}</b>
          <strong>${item.title}</strong>
          <div class="video-info">
              <div class="user"></div>
              <div class="Writer">
                  <p>${item.author}</p>
                  <p>${item.date}</p>
              </div>
          </div>
      </li>
    `;
    ul.innerHTML += row;
  });

  // 검색 결과 없을 때
  if (currentData.length === 0) {
    ul.innerHTML = `<li style="text-align:center; padding:20px;">검색 결과가 없습니다.</li>`;
  }
}

// 페이지네이션 렌더링
function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
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
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(page);
  renderPagination();
}

// 상세 페이지 이동
function navigateToDetail(id) {
  window.location.hash = `sermon-${id}`;
  showDetail(id);
}

// 상세 페이지 표시
async function showDetail(id) {
  const item = sermonData.find((sermon) => sermon.id === id);
  if (!item) return;

  document.getElementById("sermon-list").style.display = "none";
  document.getElementById("sermon-detail").style.display = "block";

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-author").textContent = item.author;
  document.getElementById("detail-date").textContent = item.date;

  // TXT 파일 로드
  const contentElement = document.getElementById("detail-content");
  try {
    const response = await fetch(`./Sermon/${item.content}`);
    if (!response.ok) throw new Error("TXT 파일 로드 오류");
    const textContent = await response.text();
    contentElement.innerHTML = textContent.replace(/\n/g, "<br>");
  } catch (error) {
    console.error("TXT 파일 로드 오류:", error);
    contentElement.textContent = "설교 내용을 불러오는 중 오류가 발생했습니다.";
  }

  // 첨부파일 처리
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = "";
  if (item.files && item.files.length > 0) {
    item.files.forEach((file) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `./News/file/${file}`;
      link.textContent = file;
      link.download = file;
      listItem.appendChild(link);
      fileList.appendChild(listItem);
    });
  } else {
    const noFiles = document.createElement("li");
    noFiles.textContent = "첨부파일이 없습니다.";
    fileList.appendChild(noFiles);
  }

  // YouTube 동영상
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${item.sermonId}" 
      title="YouTube video player - ${item.title}" frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen></iframe>
  `;
}

// 목록 보기
function showList() {
  window.location.hash = "";
  document.getElementById("sermon-list").style.display = "block";
  document.getElementById("sermon-detail").style.display = "none";
  renderTable(currentPage);
}

// URL 해시 변경 이벤트
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.substring(1);
  if (hash.startsWith("sermon-")) {
    const id = parseInt(hash.replace("sermon-", ""), 10);
    if (!isNaN(id)) {
      showDetail(id);
    }
  } else {
    showList();
  }
});

// 🔎 검색 기능
function searchSermons() {
  const input = document.getElementById("searchInput").value.toLowerCase();

  filteredData = sermonData.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(input) ||
      sermon.author.toLowerCase().includes(input) ||
      (sermon.content && sermon.content.toLowerCase().includes(input))
  );

  currentPage = 1;
  renderTable(currentPage);
  renderPagination();
}

// 초기 데이터 로드
loadSermonData();
