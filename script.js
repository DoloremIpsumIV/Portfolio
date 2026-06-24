document.addEventListener("DOMContentLoaded", () => {
  var backdrop = document.querySelector("[data-modal-backdrop]");
  var modals = document.querySelectorAll(".modal");
  var scrollPosition = 0;
  function openModal(modalEl){ if(!modalEl || !backdrop) return; backdrop.hidden=false; modalEl.hidden=false; disableScroll(); }
  function resetMediaModal(){ var img=document.getElementById("mediaModalImage")||document.getElementById("imgModalPreview"); var vid=document.getElementById("mediaModalVideo"); if(img){img.hidden=true; img.removeAttribute("src");} if(vid){vid.pause(); vid.hidden=true; vid.removeAttribute("src"); vid.load();} }
  function closeAllModals(){ if(backdrop) backdrop.hidden=true; modals.forEach((m)=>m.hidden=true); resetMediaModal(); enableScroll(); }
  document.querySelectorAll("[data-close-modal]").forEach((btn)=>btn.addEventListener("click", closeAllModals));
  if(backdrop){ backdrop.addEventListener("click", (e)=>{ if(e.target===backdrop) closeAllModals(); }); }
  document.querySelectorAll("[data-open-modal]").forEach((btn)=>btn.addEventListener("click", (e)=>{ e.stopPropagation(); var card=e.currentTarget.closest("[data-modal-target]"); if(!card) return; openModal(document.getElementById(card.getAttribute("data-modal-target"))); }));
  document.querySelectorAll(".project-card[data-modal-target], .featured-project[data-modal-target], .creative-project[data-modal-target]").forEach((card)=>card.addEventListener("click", (e)=>{ if(e.target.closest("a") || e.target.closest("[data-open-modal]")) return; openModal(document.getElementById(card.getAttribute("data-modal-target"))); }));
  var mediaModal=document.getElementById("mediaModal")||document.getElementById("imgModal"); var mediaImage=document.getElementById("mediaModalImage")||document.getElementById("imgModalPreview"); var mediaVideo=document.getElementById("mediaModalVideo");
  document.querySelectorAll(".gallery-item").forEach((item)=>item.addEventListener("click", ()=>{ var src=item.getAttribute("data-media-src")||item.getAttribute("data-img"); var kind=item.getAttribute("data-media-kind")||"image"; if(!src) return; resetMediaModal(); if(kind==="video" && mediaVideo){mediaVideo.src=src; mediaVideo.hidden=false; mediaVideo.load(); mediaVideo.play().catch(()=>{});} else if(mediaImage){mediaImage.src=src; mediaImage.hidden=false;} openModal(mediaModal); }));
  window.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeAllModals(); });
  function disableScroll(){ scrollPosition=window.scrollY; document.body.style.position="fixed"; document.body.style.top=`-${scrollPosition}px`; document.body.style.left="0"; document.body.style.right="0"; document.body.style.width="100%"; }
  function enableScroll(){ document.body.style.position=""; document.body.style.top=""; document.body.style.left=""; document.body.style.right=""; document.body.style.width=""; window.scrollTo(0, scrollPosition); }
});
