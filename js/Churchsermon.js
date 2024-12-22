let sermonData = [];
const itemsPerPage = 6;
let currentPage = 1;

// 초기 데이터 로드
async function loadSermonData() {
  try {
    // GitHub Pages 환경에서 JSON 파일 경로 설정
    const baseURL = "/testchurchpage/"; // repository-name을 실제 GitHub 리포지토리 이름으로 변경
    const response = await fetch(`${baseURL}json/sermonData.json`); // JSON 파일 경로

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const sermonData = await response.json(); // JSON 데이터 로드

    // URL 해시 확인
    const hash = window.location.hash.substring(1);
    if (hash.startsWith("sermon-")) {
      const id = parseInt(hash.replace("sermon-", ""), 10);
      if (!isNaN(id)) {
        showDetail(id); // 특정 설교 상세 보기
        return;
      }
    }

    renderTable(currentPage); // 설교 리스트 렌더링
    renderPagination(); // 페이지네이션 렌더링
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 오류 발생:", error);
    document.getElementById("sermon-body").innerHTML =
      "데이터를 불러오는 중 오류가 발생했습니다."; // 사용자에게 오류 메시지 표시
  }
}

// 테이블 렌더링
function renderTable(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sermonData.slice(startIndex, endIndex);

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
}

// 페이지네이션 렌더링
function renderPagination() {
  const totalPages = Math.ceil(sermonData.length / itemsPerPage);
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
  const totalPages = Math.ceil(sermonData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(page);
  renderPagination();
}

// 상세 페이지 이동
function navigateToDetail(id) {
  window.location.hash = `sermon-${id}`; // 해시 값을 #sermon-<id> 형태로 변경
  showDetail(id);
}

// 상세 페이지 표시
async function showDetail(id) {
  const item = sermonData.find((sermon) => sermon.id === id);
  if (!item) return;

  // 상세 페이지로 이동
  document.getElementById("sermon-list").style.display = "none";
  document.getElementById("sermon-detail").style.display = "block";

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-author").textContent = item.author;
  document.getElementById("detail-date").textContent = item.date;

  // TXT 파일 로드 및 표시
  const contentElement = document.getElementById("detail-content");
  try {
    const response = await fetch(`../sermon/${item.content}`);
    if (!response.ok) {
      throw new Error("TXT 파일을 로드하는 중 오류 발생");
    }
    const textContent = await response.text();
    contentElement.innerHTML = textContent.replace(/\n/g, "<br>"); // 줄바꿈 처리
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

  // YouTube 동영상 표시
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${item.sermonId}" 
        title="YouTube video player - ${item.title}" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>
    `;
}

// 이미지 경로 수정
function fixImagePaths(content) {
  return content.replace(/src=['"]\/img\//g, 'src="../News/img/');
}

// 목록 보기
function showList() {
  window.location.hash = ""; // URL 해시 초기화

  // 목록 페이지를 표시하고, 상세 페이지를 숨깁니다.
  document.getElementById("sermon-list").style.display = "block";
  document.getElementById("sermon-detail").style.display = "none";

  // 목록 페이지를 렌더링
  renderTable(currentPage); // 현재 페이지의 데이터를 다시 렌더링합니다.
}

// URL 해시 변경 이벤트 처리
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

// 초기 데이터 로드
loadSermonData();
