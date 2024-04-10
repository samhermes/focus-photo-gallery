const focus=e=>{const t=document.querySelector("body");let s={startingItem:"",currentItem:"",images:"",imageCount:0,isLoading:!1,currentFocus:""};const c=()=>{const e=document.createElement("div");e.classList.add("focus-stage"),e.setAttribute("role","dialog"),e.setAttribute("aria-labelledby","focus-stage-title");const s=document.createElement("h1");s.innerText="Photo Gallery",s.setAttribute("id","focus-stage-title"),s.setAttribute("class","screen-reader-text"),e.appendChild(s);const c=o();e.appendChild(c);const a=document.createElement("div");a.classList.add("focus-podium"),e.appendChild(a);const i=r();e.appendChild(i);const d=n();e.appendChild(d),t.appendChild(e)},r=()=>{const e=document.createElement("button");return e.innerHTML='<span class="screen-reader-text">Close</span>',e.classList.add("focus-close"),e},n=()=>{const e=document.createElement("div");e.classList.add("focus-controls");const t=document.createElement("button");t.innerHTML='<span class="screen-reader-text">Next</span>',t.classList.add("focus-next"),e.appendChild(t);const s=document.createElement("button");return s.innerHTML='<span class="screen-reader-text">Previous</span>',s.classList.add("focus-previous"),e.appendChild(s),e},o=()=>{const e=document.createElement("div");return e.innerHTML='<svg class="loading-icon" viewBox="25 25 50 50" stroke-width="2"><circle cx="50" cy="50" r="20" /></svg><span class="screen-reader-text">Loading</span>',e.classList.add("focus-loading"),e},a=e=>{const t=document.querySelector(".focus-stage"),s=[].slice.call(t.querySelectorAll(["a[href]","area[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'].join()));if(9===e.keyCode){var c=s.indexOf(document.activeElement);e.shiftKey||c!==s.length-1?!e.shiftKey||0!==c&&-1!==c||(s[s.length-1].focus(),e.preventDefault()):(s[0].focus(),e.preventDefault())}},i=e=>{t.classList.add("focus-stage-open"),1===s.imageCount&&(document.querySelector(".focus-stage").classList.add("controls-hidden"),document.querySelector(".focus-previous").setAttribute("disabled",""),document.querySelector(".focus-next").setAttribute("disabled",""));const c=document.createElement("ul");s.images.forEach((e,t)=>{const r=document.createElement("li"),n=document.createElement("figure"),o=document.createElement("img");if(o.setAttribute("data-src",e.imageUrl),o.setAttribute("alt",e.imageAlt),n.appendChild(o),r.appendChild(n),r.classList.add("stage-item"),""!==e.imageCaption){const t=document.createElement("figcaption");t.innerText=e.imageCaption,n.appendChild(t),r.classList.add("has-caption")}if(t===s.startingItem){r.classList.add("is-active","is-first");const e=o.getAttribute("data-src");o.setAttribute("src",e),y(o)}c.appendChild(r)});const r=document.querySelector(".focus-podium");setTimeout(()=>r.appendChild(c),150),document.addEventListener("click",d),document.addEventListener("keydown",d),(e=>{s.currentFocus=e.currentTarget,document.addEventListener("keydown",a)})(e),1===s.imageCount?document.querySelector(".focus-close").focus():document.querySelector(".focus-next").focus(),u()},d=e=>{"click"===e.type&&e.target&&e.target.classList.contains("focus-next")&&m(),"click"===e.type&&e.target&&e.target.classList.contains("focus-previous")&&g(),"click"===e.type&&e.target&&e.target.classList.contains("focus-close")&&l(),"Escape"===e.key&&l(),37===e.keyCode&&g(),39===e.keyCode&&m()},u=()=>{const e=document.querySelector(".focus-next");s.currentItem+1===s.imageCount?(e.classList.add("is-restart"),e.querySelector(".screen-reader-text").innerHTML="Restart"):(e.classList.remove("is-restart"),e.querySelector(".screen-reader-text").innerHTML="Previous")},l=()=>{t.classList.remove("focus-stage-open"),document.querySelector(".focus-stage").classList.remove("controls-hidden"),document.querySelector(".focus-previous").removeAttribute("disabled"),document.querySelector(".focus-next").removeAttribute("disabled");const e=document.querySelector(".focus-podium");e.innerHTML="",e.classList.remove("has-caption"),document.removeEventListener("click",d),document.removeEventListener("keydown",d),s.currentFocus.focus(),document.removeEventListener("keydown",a)},m=()=>{s.currentItem+1<s.imageCount?s.currentItem=s.currentItem+1:s.currentItem=0,u(),document.querySelector(".is-active").classList.remove("is-active");const e=document.querySelectorAll(".stage-item")[s.currentItem],t=e.querySelector("img");t.hasAttribute("src")||t.setAttribute("src",t.getAttribute("data-src")),e.classList.add("is-active"),y(t)},g=()=>{s.currentItem-1<0?s.currentItem=s.imageCount-1:s.currentItem=s.currentItem-1,u(),document.querySelector(".is-active").classList.remove("is-active");const e=document.querySelectorAll(".stage-item")[s.currentItem],t=e.querySelector("img");t.hasAttribute("src")||t.setAttribute("src",t.getAttribute("data-src")),e.classList.add("is-active"),y(t)},p=(e,t,c)=>{t.preventDefault(),s.startingItem=e,s.currentItem=e,s.images=c,s.imageCount=c.length,i(t)},f=e=>{const t=e.children.length>1?Array.from(e.children):[e],s=Array.from(t).map(e=>(e=>{return{imageUrl:e.href||e.querySelector("a").href,imageAlt:e.querySelector("img")?e.querySelector("img").alt:"",imageCaption:e.querySelector("figcaption")?e.querySelector("figcaption").innerText:""}})(e));for(let e=0;e<t.length;e++){t[e].querySelector("a").addEventListener("click",t=>p(e,t,s))}},y=e=>{const t=document.querySelector(".focus-loading"),c=()=>{s.isLoading=!1,t.classList.remove("is-active"),e.removeEventListener("load",c)};e.complete?c():(s.isLoading=!0,t.classList.add("is-active"),e.addEventListener("load",c),e.addEventListener("error",c))};(()=>{const t=e&&e.selector?e.selector:".focus-gallery",s=document.querySelectorAll(t),r=[];Array.from(s).forEach(e=>{const t=e.querySelectorAll("a");t&&t.length&&r.push(e)}),r&&(c(),r.forEach(e=>{f(e)}))})()};