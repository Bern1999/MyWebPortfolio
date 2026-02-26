function sendMail() {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("message");

  const params = {
    name: (nameEl?.value || "").trim(),
    email: (emailEl?.value || "").trim(),
    message: (msgEl?.value || "").trim(),
  };

  if (!params.name || !params.email || !params.message) {
    alert("Please fill out Name, Email, and Message.");
    return;
  }

  emailjs
    .send("service_ptxeocu", "template_y8r1ajt", params)
    .then(() => {
      alert("Message sent! ✅");
      if (nameEl) nameEl.value = "";
      if (emailEl) emailEl.value = "";
      if (msgEl) msgEl.value = "";
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to send message ❌");
    });
}

/* ==============================
   PROJECT MODAL (CLEAN + STABLE)
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalImage = document.getElementById("modalImage");
  const modalPDF = document.getElementById("modalPDF");
  const modalCounter = document.getElementById("modalCounter");

  const modalCaption = document.getElementById("modalCaption");
  const pill1 = document.getElementById("pill1");
  const pill2 = document.getElementById("pill2");
  const pill3 = document.getElementById("pill3");

  const prevImg = document.getElementById("prevImg");
  const nextImg = document.getElementById("nextImg");

  const stage = modal.querySelector(".project-modal__stage");

  let items = [];
  let captions = [];
  let highlightsBySlide = []; // 👈 array of arrays
  let currentIndex = 0;

  function splitBy(raw, sep) {
    return (raw || "")
      .split(sep)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function parseCaptions(raw) {
    return raw.includes("||") ? splitBy(raw, "||") : splitBy(raw, ",");
  }

  // ✅ per-slide highlights:
  // slide groups: "A|B|C || D|E|F || G|H|I"
  function parseHighlights(raw) {
    const slideGroups = raw.includes("||") ? splitBy(raw, "||") : [raw];
    return slideGroups.map(group => splitBy(group, "|"));
  }

  function applyHighlightsForSlide(i) {
    const arr = highlightsBySlide[i] || [];
    const h1 = arr[0] || "";
    const h2 = arr[1] || "";
    const h3 = arr[2] || "";

    pill1.textContent = h1; pill1.style.display = h1 ? "inline-flex" : "none";
    pill2.textContent = h2; pill2.style.display = h2 ? "inline-flex" : "none";
    pill3.textContent = h3; pill3.style.display = h3 ? "inline-flex" : "none";
  }

  function resetZoom() {
    modalImage.classList.remove("zoomed");
    stage?.classList.remove("zoomed");
    if (stage) { stage.scrollTop = 0; stage.scrollLeft = 0; }
    modalImage.style.margin = "0 auto";
  }

  function showImage(src) {
    stage?.classList.remove("is-pdf");

    modalPDF.style.display = "none";
    modalPDF.src = "";

    modalImage.style.display = "block";
    modalImage.src = src;
    modalImage.style.margin = "0 auto";
  }

  function showPDF(src) {
    resetZoom();
    stage?.classList.add("is-pdf");

    modalImage.style.display = "none";
    modalImage.removeAttribute("src");

    modalPDF.style.display = "block";
    modalPDF.src = src;
  }

  function updateSlide() {
    if (!items.length) return;

    resetZoom();

    const item = items[currentIndex] || "";
    const isPdf = item.toLowerCase().endsWith(".pdf");

    modalCaption.textContent = captions[currentIndex] || "Preview of project output / steps.";
    applyHighlightsForSlide(currentIndex);

    if (isPdf) showPDF(item);
    else showImage(item);

    modalCounter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function openModal(btn) {
    modalTitle.textContent = btn.dataset.title || "Project";
    modalSubtitle.textContent = btn.dataset.subtitle || "";

    items = splitBy(btn.dataset.images || "", ",");
    captions = parseCaptions(btn.dataset.captions || "");
    highlightsBySlide = parseHighlights(btn.dataset.highlights || "");

    currentIndex = 0;
    updateSlide();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    resetZoom();
    stage?.classList.remove("is-pdf");
    modalPDF.src = "";
    modalImage.removeAttribute("src");
  }

  document.querySelectorAll(".project-open").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn));
  });

  prevImg?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSlide();
  });

  nextImg?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % items.length;
    updateSlide();
  });

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close === "true") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") prevImg?.click();
    if (e.key === "ArrowRight") nextImg?.click();
  });

  // ✅ Zoom toggle (images only)
  modalImage?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!modalImage.src) return;

    const isZoomed = modalImage.classList.toggle("zoomed");
    stage?.classList.toggle("zoomed", isZoomed);

    if (stage) { stage.scrollTop = 0; stage.scrollLeft = 0; }
    modalImage.style.margin = isZoomed ? "0" : "0 auto";
  });
});