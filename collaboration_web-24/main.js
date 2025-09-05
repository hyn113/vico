let currentPage = 1;
const totalPages = 25;
const pageCache = {};

const viewer = document.getElementById("svgViewer");
const fullscreen = document.querySelector(".fullscreen");
const fullscreenImg = document.getElementById("fullscreen-img");
const backBtn = document.querySelector(".back-button");
const cursor = document.querySelector(".cursor-square");

// 페이지 미리 로딩
function preloadPage(pageNum) {
  if (pageNum < 1 || pageNum > totalPages) return;
  if (!pageCache[pageNum]) {
    const img = new Image();
    img.src = `WebP/collaboration(24)-${String(pageNum).padStart(2,"0")}.webp`;
    pageCache[pageNum] = img;
  }
}

// 페이지 표시
function showPage() {
  const img = pageCache[currentPage];
  if (!img) return;
  fullscreenImg.src = img.src;
}

// 다음/이전 페이지
function showNextPage() { 
  if (currentPage < totalPages) { 
    currentPage++; 
    showPage(); 
    preloadPage(currentPage+1); 
  } 
}
function showPreviousPage() { 
  if (currentPage > 1) { 
    currentPage--; 
    showPage(); 
    preloadPage(currentPage-1); 
  } 
}

// 키보드 제어
document.addEventListener("keydown", (e) => {
  if (fullscreen.classList.contains("hidden")) return;
  switch(e.key){
    case "ArrowRight": case "d": case " ":
      showNextPage(); e.preventDefault(); break;
    case "ArrowLeft": case "a": case "Backspace":
      showPreviousPage(); e.preventDefault(); break;
    case "Escape":
      closeFullscreen(); break;
  }
});

// 중앙 이미지 클릭 → 전체화면 페이지 뷰어
viewer.addEventListener("click", ()=>{
  fullscreen.classList.remove("hidden");
  setTimeout(()=> fullscreen.classList.add("visible"), 20);
  currentPage = 1;
  preloadPage(currentPage);
  showPage();
});

// Back 버튼 클릭 → 초기 화면
function closeFullscreen() {
  fullscreen.classList.remove("visible");
  setTimeout(()=>{ fullscreen.classList.add("hidden"); }, 250);
}
backBtn.addEventListener("click", closeFullscreen);

// 화면 클릭으로 페이지 넘김
fullscreen.addEventListener("click", (e) => {
  const rect = fullscreen.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if(x > rect.width / 2) showNextPage();
  else showPreviousPage();
});

// 커스텀 사각형 커서
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Replica 버튼 → replica_web(24) 이동
document.getElementById('bottomRightBtn').addEventListener('click', ()=>{
  window.location.href = "../replica_web(24)/index.html";
});

// Book 버튼 → process book 페이지 이동
document.getElementById('topRightBtn').addEventListener('click', () => {
  window.location.href = "./pages/collaboration process book/index.html";
});
