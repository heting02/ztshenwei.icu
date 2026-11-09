"use strict";
(() => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-button');
  const closeMenu = () => { header.classList.remove('menu-open'); menu.setAttribute('aria-expanded','false'); };
  menu.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', open); menu.setAttribute('aria-expanded',String(open));
  });
  document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e => {if(e.key==='Escape' && header.classList.contains('menu-open')){closeMenu();menu.focus();}});
  window.matchMedia('(min-width:761px)').addEventListener('change', closeMenu);
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if(scheduled) return; scheduled=true;
    requestAnimationFrame(()=>{header.classList.toggle('scrolled',window.scrollY>20);scheduled=false;});
  }, {passive:true});
  const tabs = [...document.querySelectorAll('[role=tab]')];
  const activate = tab => {
    tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',e=>{
      let next=index;
      if(e.key==='ArrowRight'||e.key==='ArrowDown') next=(index+1)%tabs.length;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp') next=(index-1+tabs.length)%tabs.length;
      else if(e.key==='Home') next=0;
      else if(e.key==='End') next=tabs.length-1;
      else return;
      e.preventDefault();activate(tabs[next]);tabs[next].focus();
    });
  });
  const copy = document.querySelector('.copy-email');
  copy.addEventListener('click', async()=>{
    const status=document.querySelector('.copy-status');
    try{if(!navigator.clipboard) throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(copy.dataset.email);status.textContent=copy.dataset.success;}
    catch{status.textContent=copy.dataset.fallback;}
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.25});
    document.querySelectorAll('.steps li').forEach(item=>observer.observe(item));
  }
})();
