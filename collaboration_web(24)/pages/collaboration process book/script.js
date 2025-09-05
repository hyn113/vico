// -----------------
// Custom Cursor
// -----------------
const cursor = document.querySelector(".cursor-square");
document.addEventListener("mousemove", (e) => {
  if (!cursor) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// -----------------
// Page List + WebP Loader
// -----------------
const pageList = document.getElementById("pageList");
const svgContainer = document.getElementById("svgContainer");
const totalPages = 15; // 1 ~ 15
const imgCache = {};
let currentPage = 1;
const filePrefix = "collaboration-process-book-";

// ✅ WebP 로드 함수
function loadImage(index) {
  if (!svgContainer) return;
  if (index < 1 || index > totalPages) return;

  if (imgCache[index]) {
    svgContainer.innerHTML = imgCache[index];
    return;
  }

  const fileName = `WebP/${filePrefix}${index}.webp`;

  const html = `<img src="${fileName}" alt="Page ${index}" style="max-width:100%; max-height:100%; object-fit:contain;" />`;
  imgCache[index] = html;
  svgContainer.innerHTML = html;
}

// ✅ 페이지 표시
function showPage(index) {
  if (index < 1 || index > totalPages) return;

  loadImage(index);
  currentPage = index;

  document.querySelectorAll(".page-list a").forEach((btn) =>
    btn.classList.remove("active")
  );

  const activeBtn = document.querySelector(`.page-list a[data-page="${currentPage}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
    activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

// -----------------
// 초기 로드
// -----------------
showPage(1);

// 다이얼 버튼 생성
if (pageList) {
  for (let i = 1; i <= totalPages; i++) {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `Page.${i}`;
    a.dataset.page = i;
    if (i === 1) a.classList.add("active");
    pageList.appendChild(a);

    // hover 시 → 페이지 전환 + active 표시
    a.addEventListener("mouseover", () => {
      showPage(i);
    });

    // 클릭 시 → 페이지 전환
    a.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(i);
    });
  }
}

// -----------------
// Mousemove Tilt Motion
// -----------------
const wrapper = document.querySelector(".svg-wrapper");

if (wrapper) {
  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = offsetY * -6;
    const rotateY = offsetX * 6;
    svgContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.98)`;
  });

  wrapper.addEventListener("mouseleave", () => {
    svgContainer.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

// -----------------
// Scroll Navigation
// -----------------
let isScrolling = false;

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  if (e.deltaY > 0) {
    showPage(currentPage + 1);
  } else if (e.deltaY < 0) {
    showPage(currentPage - 1);
  }

  isScrolling = true;
  setTimeout(() => (isScrolling = false), 600);
});

// -----------------
// Button Navigation
// -----------------
const processBtn = document.getElementById("processBtn");
if (processBtn) {
  processBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
}

const bottomRightBtn = document.getElementById("bottomRightBtn");
if (bottomRightBtn) {
  bottomRightBtn.addEventListener("click", () => {
    window.location.href = "../../../replica_web(24)/index.html";
  });
}
