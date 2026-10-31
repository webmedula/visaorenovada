(function(){
  // checkout placeholder
  document.querySelectorAll('[data-checkout]').forEach(a=>a.addEventListener('click',e=>{
    if(a.getAttribute('href')==='#'){e.preventDefault();a.textContent='Link do checkout ainda não configurado';}
  }));

  // sticky mobile CTA after hero, hidden near offer
  const sticky=document.getElementById('sticky'), hero=document.querySelector('.hero'), offer=document.getElementById('oferta');
  if('IntersectionObserver' in window){
    let heroVis=true, offerVis=false, quizVis=false;
    const upd=()=>sticky.classList.toggle('show',!heroVis&&!offerVis&&!quizVis);
    new IntersectionObserver(e=>{quizVis=e[0].isIntersecting;upd()}).observe(document.getElementById('avaliacao'));
    new IntersectionObserver(e=>{heroVis=e[0].isIntersecting;upd()}).observe(hero);
    new IntersectionObserver(e=>{offerVis=e[0].isIntersecting;upd()}).observe(offer);
  }
})();
