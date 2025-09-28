const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = ()=>{ canvas.width = innerWidth; canvas.height = innerHeight; }
    window.addEventListener('resize', resize); resize();

    function rand(min,max){return Math.random()*(max-min)+min}
    function createParticles(){
      particles = [];
      const count = Math.round((canvas.width * canvas.height) / 90000);
      for(let i=0;i<count;i++){
        particles.push({x:rand(0,canvas.width),y:rand(0,canvas.height),r:rand(0.6,2.2),vx:rand(-0.3,0.3),vy:rand(-0.2,0.2)})
      }
    }
    createParticles();

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let p of particles){
        p.x += p.vx; p.y += p.vy;
        if(p.x<0) p.x = canvas.width; if(p.x>canvas.width) p.x=0;
        if(p.y<0) p.y = canvas.height; if(p.y>canvas.height) p.y=0;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,122,0,0.06)';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y; const d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){
            ctx.beginPath(); ctx.strokeStyle = 'rgba(255,122,0,'+(0.08-(d/110)*0.07)+')'; ctx.lineWidth=0.6; ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', ()=>{createParticles()});

    // ===== Mostrar boton flotante al hacer scroll =====
    const registerFloat = document.getElementById('registerFloat');
    let shown=false;
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY || window.pageYOffset;
      if(y>120 && !shown){ registerFloat.classList.add('show'); shown=true; }
      if(y<100 && shown){ registerFloat.classList.remove('show'); shown=false; }
    });

    // ===== Enlaces al registro =====
    document.getElementById('toRegister').addEventListener('click', ()=>{ window.location.href='registrar.html'; });
    document.getElementById('cta-register').addEventListener('click', ()=>{ window.location.href='registrar.html'; });
    document.getElementById('floatBtn').addEventListener('click', ()=>{ window.location.href='registrar.html'; });

    // ===== Animación de título (entrada) =====
    const titleWrap = document.getElementById('titleWrap');
    window.addEventListener('load', ()=>{ setTimeout(()=> titleWrap.classList.add('show'), 180); });

    // ===== Slideshow automático (fade cada 3s) =====
    const slides = document.querySelectorAll('#slideshow img');
    let current = 0;
    function nextSlide(){
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }
    let slideInterval = setInterval(nextSlide, 3000);

    // Evitar descarga/menú contextual en imágenes (no garantiza 100%)
    document.addEventListener('contextmenu', (e)=>{ if(e.target && e.target.tagName === 'IMG') e.preventDefault(); });

    // Prevent dragging images
    document.querySelectorAll('img').forEach(img=>{ img.ondragstart = ()=> false; });

    // ===== Scroll reveals con IntersectionObserver =====
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, {threshold:0.12});
    revealEls.forEach(el=> io.observe(el));

   
function abrirModal(id) {
  document.getElementById(id).style.display = "flex";
}
function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}
