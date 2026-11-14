import os, shutil
SRC='../composition/assets'
CSS='''
@font-face{font-family:"Bricolage";font-weight:800;src:url(assets/fonts/bricolage-800.ttf)}
@font-face{font-family:"Bricolage";font-weight:700;src:url(assets/fonts/bricolage-700.ttf)}
@font-face{font-family:"Poppins";font-weight:400;src:url(assets/fonts/poppins-400.ttf)}
@font-face{font-family:"Poppins";font-weight:500;src:url(assets/fonts/poppins-500.ttf)}
@font-face{font-family:"JBMono";font-weight:500;src:url(assets/fonts/jbmono-500.ttf)}
:root{--ground:#0F131A;--card:#161B24;--edge:rgba(255,255,255,.14);--ink:#EFF4F4;--muted:#8D97A8;--teal:#4ED0CC;--orange:#E0793E}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ground)}
#root{position:relative;width:1080px;height:1920px;background:var(--ground);color:var(--ink);font-family:"Poppins",sans-serif;overflow:hidden}
.bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:90px 90px}
.glow{position:absolute;left:-200px;top:560px;width:1480px;height:900px;background:radial-gradient(ellipse at center,rgba(78,208,204,.20),transparent 68%)}
.display{font-family:"Bricolage",sans-serif;font-weight:800;letter-spacing:-.03em;line-height:1.02}
.mono{font-family:"JBMono",monospace;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.teal{color:var(--teal)}.orange{color:var(--orange)}
#spine{position:absolute;left:110px;top:0;width:4px;height:1920px;background:var(--teal);opacity:.6;transform-origin:top}
#hdr{position:absolute;left:170px;top:120px;font-size:30px;color:var(--teal);line-height:1.5}
#hdr span{color:var(--muted)}
#brand{position:absolute;right:90px;top:104px;width:170px}
.opt{margin-top:18px;border:2px solid var(--edge);padding:30px 36px;font-size:38px;color:var(--muted);display:flex;justify-content:space-between;align-items:center}
.opt .dot{width:30px;height:30px;border:3px solid var(--edge)}
.opt.sel{border-color:var(--teal);background:rgba(78,208,204,.12);color:var(--ink)}
.opt.sel .dot{background:var(--teal);border-color:var(--teal)}
'''
def page(n,label,dur,body,css,js,audio):
    return f'''<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script><style>{CSS}{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
<div class="bg-grid"></div><div class="glow" id="glow"></div><div id="spine"></div>
<div id="hdr" class="mono">0{n} / 03<br><span>{label}</span></div>
<img id="brand" src="assets/img/logo.png" alt="Digital Creatives Hub"/>
{audio}
{body}
</div><script>
const tl=gsap.timeline({{paused:true}});const E="power3.out";
tl.fromTo("#glow",{{opacity:.55}},{{opacity:1,duration:{dur},ease:"sine.inOut"}},0);
{js}
window.__timelines=window.__timelines||{{}};window.__timelines["main"]=tl;tl.seek(0);
</script></body></html>'''
def aud(ms,dur,fi='',fo='',sfx=()):
    a=f'<audio id="music" src="assets/music/bed.mp3" data-start="0" data-duration="{dur}" data-media-start="{ms}" data-volume="0.5" {fi} {fo}></audio>'
    for i,(t,f,d,v) in enumerate(sfx):
        a+=f'<audio id="sx{i}" src="assets/sfx/{f}" data-start="{t}" data-duration="{d}" data-volume="{v}"></audio>'
    return a

# ---------- PART 1: THE PROBLEM (9.5s)
b1='''
<div id="l1" class="display">Projects end.</div>
<svg id="chart" width="820" height="380" viewBox="0 0 820 380" style="overflow:visible">
 <path id="pa" d="M0,340 C120,320 260,270 380,230" fill="none" stroke="#8D97A8" stroke-width="6"/>
 <path id="pb" d="M380,230 L820,230" fill="none" stroke="#8D97A8" stroke-width="4" stroke-dasharray="14 12"/>
 <rect id="mk" x="366" y="216" width="28" height="28" fill="#EFF4F4"/>
 <path id="pc" d="M380,230 C520,170 660,70 800,-40" fill="none" stroke="#4ED0CC" stroke-width="8"/>
</svg>
<div id="lab" class="mono">Launch day</div>
<div id="l2" class="display"><span class="teal">Momentum</span> doesn&rsquo;t.</div>
'''
c1='''#l1{position:absolute;left:170px;right:90px;top:470px;font-size:150px}
#chart{position:absolute;left:170px;top:860px}
#lab{position:absolute;left:400px;top:1135px;font-size:28px;color:var(--ink)}
#l2{position:absolute;left:170px;right:90px;top:1280px;font-size:132px}'''
j1='''
tl.set("#spine",{opacity:0},0);
tl.set("#l1",{opacity:1},0);
tl.set("#pa",{drawSVG:0},0);
const len=(id)=>document.querySelector(id).getTotalLength();
function draw(id,t,d,ease){const L=len(id);tl.fromTo(id,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,duration:d,ease:ease||"power2.inOut"},t);}
draw("#pa",1.9,1.7);
tl.fromTo("#mk",{opacity:0,scale:.2,transformOrigin:"center"},{opacity:1,scale:1,duration:.4,ease:E},3.6);
tl.fromTo("#lab",{opacity:0},{opacity:1,duration:.5},3.7);
tl.fromTo("#pb",{opacity:0},{opacity:1,duration:.8},3.9);
tl.fromTo("#l2",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},4.9);
draw("#pc",5.1,1.6);
tl.set("#spine",{opacity:.6},7.2);
tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:.1},7.2);
'''
# spine for part1 only the bottom segment: override
j1=j1.replace('tl.set("#spine",{opacity:.6},7.2);\ntl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:.1},7.2);','tl.set("#spine",{top:1580,height:340,opacity:.6},0);\ntl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.2,ease:"power2.inOut"},7.4);').replace('tl.set("#spine",{opacity:0},0);\n','')
j1=j1.replace('tl.set("#pa",{drawSVG:0},0);\n','')
a1=aud(0,9.5,fi='data-fade-in="0.6"',sfx=[(3.6,'drop.ogg',0.11,0.4),(5.0,'drop.ogg',0.11,0.4)])

# ---------- PART 2: THE SHIFT (12s)
st=[("Diagnose.","We find the problem behind the brief."),("Architect.","Brand, platform and people mapped before anything is built."),("Build.","In parallel, with AI in every layer and checkpoints you can see."),("Compound.","After launch we measure, refine and keep it moving.")]
b2='<div id="h2" class="display">How momentum gets built.</div>'
for i,(n,l) in enumerate(st):
    cls=' last' if i==3 else ''
    nm=' orange' if i==3 else ''
    b2+=f'<div class="stage{cls}" id="st{i+1}" style="top:{640+i*250}px"><span class="dotm"></span><div class="nm{nm}">{n}</div><div class="ln">{l}</div></div>'
c2='''#h2{position:absolute;left:170px;right:90px;top:340px;font-size:100px}
.stage{position:absolute;left:170px;right:90px}
.stage .dotm{position:absolute;left:-64px;top:30px;width:20px;height:20px;background:var(--teal)}
.stage .nm{font-family:"Bricolage";font-weight:700;font-size:78px;letter-spacing:-.02em}
.stage .ln{margin-top:10px;font-size:36px;line-height:1.35;color:var(--muted);max-width:760px}
.stage.last .dotm{background:var(--orange)}'''
j2='''
tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},0);
tl.fromTo("#h2",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},.5);
["#st1","#st2","#st3","#st4"].forEach((s,i)=>tl.fromTo(s,{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:E},1.6+i*1.7));
'''
a2=aud(9.5,12,sfx=[(1.65+i*1.7,'drop.ogg',0.11,0.4) for i in range(4)])

# ---------- PART 3: THE NEXT STEP (11.5s)
b3='''
<div id="h3" class="display">See where you <span class="teal">stand.</span></div>
<div id="card"><div class="cardhead"><span class="mono">Growth Diagnostic</span><span class="mono">Free &middot; 4 minutes</span></div>
 <div class="q" id="q1"><div class="mono">01 &middot; You are</div>
  <div class="opt"><span>A business owner</span><span class="dot"></span></div>
  <div class="opt" id="o1b"><span>A startup founder</span><span class="dot"></span></div>
  <div class="opt"><span>An individual professional</span><span class="dot"></span></div></div>
 <div class="q" id="q2"><div class="mono">02 &middot; You need</div>
  <div class="opt" id="o2a"><span>Brand: strategy, identity, story</span><span class="dot"></span></div>
  <div class="opt"><span>Platforms: website, app, systems</span><span class="dot"></span></div>
  <div class="opt"><span>Training for me or my team</span><span class="dot"></span></div></div></div>
<div id="sign" class="display">Strategy. Creativity. Growth. <span class="teal">Without limits.</span></div>
<div id="cta2">Take the free Growth Diagnostic &rarr;</div>
<div id="sub" class="mono">See where you stand before you talk to anyone</div>
'''
c3='''#h3{position:absolute;left:170px;right:90px;top:340px;font-size:110px}
#card{position:absolute;left:170px;right:70px;top:640px;background:var(--card);border:2px solid var(--edge);padding:50px 48px}
.cardhead{display:flex;justify-content:space-between;font-size:28px;color:var(--muted)}
.q{margin-top:44px}.q .mono{font-size:28px;color:var(--teal)}
.opt{padding:26px 32px;font-size:34px}
#sign{position:absolute;left:170px;right:90px;top:640px;font-size:92px}
#cta2{position:absolute;left:170px;right:90px;top:1240px;text-align:center;background:var(--teal);color:#0F131A;font-weight:500;font-size:38px;padding:38px 20px}
#sub{position:absolute;left:170px;right:90px;top:1400px;font-size:28px;color:var(--muted);line-height:1.5}'''
j3='''
tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},0);
tl.fromTo("#h3",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},.5);
tl.fromTo("#card",{opacity:0,y:60},{opacity:1,y:0,duration:.6,ease:E},1.3);
tl.set("#q2",{opacity:0},0);
tl.set("#o1b",{className:"opt sel"},3.0);
tl.fromTo("#q2",{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:E},3.6);
tl.set("#o2a",{className:"opt sel"},5.2);
tl.to(["#h3","#card"],{opacity:0,y:-30,duration:.5,ease:"power2.in"},6.5);
tl.fromTo("#sign",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},7.1);
tl.fromTo("#cta2",{opacity:0,y:30},{opacity:1,y:0,duration:.6,ease:E},8.4);
tl.fromTo("#sub",{opacity:0},{opacity:1,duration:.6},8.9);
tl.to("#spine",{opacity:.25,duration:.6},7.0);
'''
a3=aud(21.5,11.5,fo='data-fade-out="2.2"',sfx=[(3.05,'select.ogg',0.05,0.45),(5.25,'select.ogg',0.05,0.45)])
c3=c3  # card opt override ok
# hide sign/cta/sub initially via fromTo immediateRender
parts=[(1,'The problem',9.5,b1,c1,j1,a1),(2,'The shift',12,b2,c2,j2,a2),(3,'The next step',11.5,b3,c3,j3,a3)]
for n,label,dur,b,c,j,a in parts:
    d=f'p{n}'
    os.makedirs(d,exist_ok=True)
    if not os.path.exists(d+'/assets'): shutil.copytree(SRC,d+'/assets')
    if not os.path.exists(d+'/hyperframes.json'):
        for f in ('hyperframes.json','meta.json','package.json'): shutil.copy('../composition/'+f,d+'/'+f)
    open(d+'/index.html','w').write(page(n,label,dur,b,c,j,a))
print('ok')
