// ===============================
// 갤러리 이미지 생성 및 초기 로딩
// ===============================
const galleryContainer = document.querySelector('.gallery-container');
const gallery = document.querySelector('.gallery');
const totalImages = 63;

for (let i = 1; i <= totalImages; i++) {
  const num = String(i).padStart(2, '0');
  const img = document.createElement('img');
  img.src = `webp/replica-${num}.webp`;   // ✅ JPG → WEBP로 변경
  img.draggable = false;
  gallery.appendChild(img);
}
const cloneGallery = gallery.cloneNode(true);
gallery.appendChild(cloneGallery);
const allImages = [...gallery.querySelectorAll('img')];

// 초기 로딩
const loading = document.querySelector('.loading-replica');
galleryContainer.style.display = 'none';
window.addEventListener('load', () => {
  setTimeout(() => {
    loading.classList.add('fade-out'); 
    setTimeout(() => {
      loading.remove(); 
      galleryContainer.style.display = 'block';
      setTimeout(() => galleryContainer.classList.add('visible'), 50);
    }, 500);
  }, 3000);
});

// ===============================
// 갤러리 스크롤
// ===============================
let scrollX = 0, targetX = 0, autoSpeed = 1.2;
let wheelDelta = 0;
function animate() {
  targetX -= autoSpeed;
  targetX -= wheelDelta;
  wheelDelta *= 0.8;
  let diff = targetX - scrollX;
  const maxDelta = 25;
  if (diff > maxDelta) diff = maxDelta;
  if (diff < -maxDelta) diff = -maxDelta;
  scrollX += diff * 0.18;
  const half = gallery.scrollWidth / 2;
  if (scrollX <= -half) { scrollX += half; targetX += half; }
  if (scrollX >= 0) { scrollX -= half; targetX -= half; }
  gallery.style.transform = `translateX(${scrollX}px)`;
  requestAnimationFrame(animate);
}
animate();
gallery.addEventListener('mouseenter', () => autoSpeed = 0.2);
gallery.addEventListener('mouseleave', () => autoSpeed = 1.2);
allImages.forEach(img => {
  img.addEventListener('mouseenter', () => {
    img.classList.add('hovered');
    autoSpeed = 0.2;
    wheelDelta = 0;
    const prev = img.previousElementSibling, next = img.nextElementSibling;
    const w = img.offsetWidth;
    if (prev) prev.style.marginRight = `${w * 0.15}px`;
    if (next) next.style.marginLeft = `${w * 0.15}px`;
  });
  img.addEventListener('mouseleave', () => {
    img.classList.remove('hovered');
    autoSpeed = 1.2;
    wheelDelta = 0;
    const prev = img.previousElementSibling, next = img.nextElementSibling;
    if (prev) prev.style.marginRight = '0px';
    if (next) next.style.marginLeft = '0px';
  });
});

// ===============================
// 전체화면 모드
// ===============================
const fullscreen = document.querySelector('.fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');
const backBtn = document.querySelector('.back-button');
let currentIndex = 0, fsScale = 1, imgPosX = 0, imgPosY = 0;
function openFullscreen(index) {
  currentIndex = index;
  fsScale = 1; imgPosX = 0; imgPosY = 0;
  fullscreenImg.style.transform = `translate(0px,0px) scale(1)`;
  fullscreenImg.src = allImages[index % totalImages].src;
  fullscreen.classList.remove('hidden');
  document.body.classList.add('fullscreen-mode');
}
function closeFullscreen() {
  fullscreen.classList.add('hidden');
  document.body.classList.remove('fullscreen-mode');
}
allImages.forEach((img, idx) => img.addEventListener('click', () => openFullscreen(idx)));
backBtn.addEventListener('click', closeFullscreen);
document.addEventListener('keydown', e => {
  if (fullscreen.classList.contains('hidden')) return;
  if (["ArrowRight", "a", " "].includes(e.key)) {
    currentIndex = (currentIndex + 1) % totalImages;
    openFullscreen(currentIndex);
  }
  if (["ArrowLeft", "d", "Backspace"].includes(e.key)) {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    openFullscreen(currentIndex);
  }
  if (e.key === "Escape") closeFullscreen();
});
window.addEventListener('wheel', e => {
  e.preventDefault();
  if (!document.body.classList.contains('fullscreen-mode')) return;
  const step = 0.05;
  if (e.deltaY < 0) fsScale = Math.min(fsScale + step, 5);
  if (e.deltaY > 0) fsScale = Math.max(fsScale - step, 1);
  fullscreenImg.style.transform = `translate(${imgPosX}px,${imgPosY}px) scale(${fsScale})`;
}, { passive: false });
fullscreenImg.addEventListener('mousedown', e => e.preventDefault());

// ===============================
// 커스텀 커서
// ===============================
const dot = document.querySelector('.cursor-dot');
const label = document.querySelector('.cursor-label');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
function isOverImage(x, y) { return allImages.some(img => { const r = img.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }); }
function renderCursor() {
  curX += (mouseX - curX) * 0.3;
  curY += (mouseY - curY) * 0.3;
  dot.style.left = `${curX}px`; dot.style.top = `${curY}px`;
  label.style.left = `${curX + 14}px`; label.style.top = `${curY + 8}px`;
  label.textContent = isOverImage(mouseX, mouseY) && !document.body.classList.contains('fullscreen-mode') ? "click\nto view" : "";
  document.body.classList.toggle('show-label', label.textContent !== "");
  dot.style.background = '#fff'; label.style.color = '#fff';
  dot.style.filter = 'contrast(100%) brightness(100%)'; label.style.filter = 'contrast(100%) brightness(100%)';
  requestAnimationFrame(renderCursor);
}
renderCursor();

// ===============================
// 버튼 클릭 이동
// ===============================
document.getElementById('replicaBtn').addEventListener('click', ()=>{
  window.location.href = "../collaboration_web-24/index.html";
});

document.getElementById('processBtn').addEventListener('click', ()=>{
  // 갤러리 → 프로세스북
  window.location.href = "./pages/replica process book/index.html";
});
