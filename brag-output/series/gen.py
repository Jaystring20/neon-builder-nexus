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
<div id="hdr" class="mono">0{n} / 05<br><span>{label}</span></div>
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

N=5
def tiles(items,top0,step):
    return ''.join(f'<div class="tile" id="t{i+1}" style="top:{top0+i*step}px"><span class="sq"></span><div class="tg mono">{tg}</div><div class="nm">{nm}</div><div class="ln">{ln}</div></div>' for i,(tg,nm,ln) in enumerate(items))
TILECSS=""".tile{position:absolute;left:170px;right:90px;border:2px solid var(--edge);background:var(--card);padding:30px 40px 30px 84px}
.tile .sq{position:absolute;left:40px;top:46px;width:22px;height:22px;background:var(--teal)}
.tile .tg{font-size:28px;color:var(--teal);margin-bottom:4px}
.tile .nm{font-family:"Bricolage";font-weight:700;font-size:58px;letter-spacing:-.02em;line-height:1.05}
.tile .ln{margin-top:8px;font-size:32px;line-height:1.35;color:var(--muted)}"""
drops=lambda t0,k,gap: [(t0+i*gap,'drop.ogg',0.11,0.4) for i in range(k)]

b1='<div id="l1" class="display">Growth breaks <span class="teal">in the gaps.</span></div>'+''.join(f'<div class="gap" id="g{i+1}">{t}</div>' for i,t in enumerate([
 "The brand says one thing and the website does another.",
 "The software works, but the team can't run it.",
 "Businesses end up hiring five vendors who never speak to each other."]))
c1="""#l1{position:absolute;left:170px;right:90px;top:400px;font-size:112px}
.gap{position:absolute;left:170px;right:90px;border-left:4px solid var(--teal);padding:6px 0 6px 40px;font-size:44px;line-height:1.3;color:var(--ink)}
#g1{top:860px}#g2{top:1100px}#g3{top:1310px}"""
j1="""tl.set("#l1",{opacity:1},0);
tl.set("#spine",{top:1720,height:200,opacity:.6},0);
["#g1","#g2","#g3"].forEach((s,i)=>tl.fromTo(s,{opacity:0,y:30},{opacity:1,y:0,duration:.6,ease:E},2.4+i*2.0));
tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},9.4);"""
a1=aud(0,10.6,fi='data-fade-in="0.6"',sfx=drops(2.45,3,2.0))

b2='<div id="l1" class="display">Growth made <span class="teal">possible.</span></div>'+tiles([("","Brand.","Identity that earns attention and keeps it."),("","Platforms.","Software that scales the business, not the busywork."),("","People.","Training that turns capability into performance.")],740,250)+'<div id="l2" class="display">AI runs through all three. <span class="teal">That&rsquo;s why it compounds.</span></div>'
c2='#l1{position:absolute;left:170px;right:90px;top:400px;font-size:106px}'+TILECSS.replace('.tile .tg{','.tile .tg{display:none;')+'\n#l2{position:absolute;left:170px;right:90px;top:1560px;font-size:54px;line-height:1.1}'
j2="""tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},0);
tl.fromTo("#l1",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},.5);
["#t1","#t2","#t3"].forEach((s,i)=>tl.fromTo(s,{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:E},2.2+i*1.4));
tl.fromTo("#l2",{opacity:0,y:20},{opacity:1,y:0,duration:.6,ease:E},6.6);"""
a2=aud(10.6,11,sfx=drops(2.25,3,1.4))

b3='<div id="l1" class="display">Shipped. And <span class="teal">still moving.</span></div>'+tiles([("Creative ecosystem","Viera Amber","One brand. Five expressions."),("Optical retail","M &amp; H Eyewear","145 five-star reviews. 2,800+ frames."),("Community &amp; events","The Fitness Religion Company","Registration, live leaderboards, sponsor integration.")],700,260)
c3='#l1{position:absolute;left:170px;right:90px;top:360px;font-size:104px}'+TILECSS
j3="""tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},0);
tl.fromTo("#l1",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},.5);
["#t1","#t2","#t3"].forEach((s,i)=>tl.fromTo(s,{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:E},2.0+i*2.0));"""
a3=aud(21.6,9.7,sfx=drops(2.05,3,2.0))

st=[("Diagnose.","We find the problem behind the brief."),("Architect.","Brand, platform and people mapped before anything is built."),("Build.","In parallel, with AI in every layer and checkpoints you can see."),("Compound.","After launch we measure, refine and keep it moving.")]
b4='<div id="h2" class="display">How growth gets built.</div>'
for i,(n,l) in enumerate(st):
    cls=' last' if i==3 else ''; nm=' orange' if i==3 else ''
    b4+=f'<div class="stage{cls}" id="st{i+1}" style="top:{620+i*225}px"><span class="dotm"></span><div class="nm{nm}">{n}</div><div class="ln">{l}</div></div>'
b4+='<div id="wk">From question to launch, usually <span class="teal">8 to 14 weeks.</span></div>'
c4="""#h2{position:absolute;left:170px;right:90px;top:340px;font-size:100px}
.stage{position:absolute;left:170px;right:90px}
.stage .dotm{position:absolute;left:-64px;top:30px;width:20px;height:20px;background:var(--teal)}
.stage .nm{font-family:"Bricolage";font-weight:700;font-size:72px;letter-spacing:-.02em}
.stage .ln{margin-top:6px;font-size:34px;line-height:1.35;color:var(--muted);max-width:760px}
.stage.last .dotm{background:var(--orange)}
#wk{position:absolute;left:170px;right:90px;top:1560px;font-size:42px;line-height:1.3;font-family:"Bricolage";font-weight:700}"""
j4="""tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},0);
tl.fromTo("#h2",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},.5);
["#st1","#st2","#st3","#st4"].forEach((s,i)=>tl.fromTo(s,{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:E},1.5+i*1.4));
tl.fromTo("#wk",{opacity:0,y:20},{opacity:1,y:0,duration:.6,ease:E},7.6);"""
a4=aud(31.3,11.2,sfx=drops(1.55,4,1.4))

b5="""<div id="h3" class="display">See where you <span class="teal">stand.</span></div>
<div id="card"><div class="cardhead"><span class="mono">Growth Diagnostic</span><span class="mono">Free &middot; 4 minutes</span></div>
 <div class="q" id="q1"><div class="mono">01 &middot; You are</div>
  <div class="opt"><span>A business owner</span><span class="dot"></span></div>
  <div class="opt" id="o1b"><span>A startup founder</span><span class="dot"></span></div>
  <div class="opt"><span>An individual professional</span><span class="dot"></span></div></div>
 <div class="q" id="q2"><div class="mono">02 &middot; You need</div>
  <div class="opt" id="o2a"><span>Brand: strategy, identity, story</span><span class="dot"></span></div>
  <div class="opt"><span>Platforms: website, app, systems</span><span class="dot"></span></div>
  <div class="opt"><span>Training for me or my team</span><span class="dot"></span></div></div></div>
<div id="sign" class="display">We don&rsquo;t take every brief.</div>
<div id="cta2">Take the free Growth Diagnostic &rarr;</div>
<div id="sub" class="mono">digitalcreativeshubltd.com/diagnostic</div>
<div id="so" class="display">Strategy. Creativity. Growth. <span class="teal">Without limits.</span></div>"""
c5="""#h3{position:absolute;left:170px;right:90px;top:340px;font-size:110px}
#card{position:absolute;left:170px;right:70px;top:640px;background:var(--card);border:2px solid var(--edge);padding:50px 48px}
.cardhead{display:flex;justify-content:space-between;font-size:28px;color:var(--muted)}
.q{margin-top:44px}.q .mono{font-size:28px;color:var(--teal)}
.opt{padding:26px 32px;font-size:34px}
#sign{position:absolute;left:170px;right:90px;top:560px;font-size:104px}
#cta2{position:absolute;left:170px;right:90px;top:1010px;text-align:center;background:var(--teal);color:#0F131A;font-weight:500;font-size:38px;padding:38px 20px}
#sub{position:absolute;left:170px;right:90px;top:1170px;font-size:28px;color:var(--muted)}
#so{position:absolute;left:170px;right:90px;top:1340px;font-size:64px;line-height:1.1}"""
j5="""tl.fromTo("#spine",{scaleY:0},{scaleY:1,duration:1.0,ease:"power2.inOut"},0);
tl.fromTo("#h3",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},.5);
tl.fromTo("#card",{opacity:0,y:60},{opacity:1,y:0,duration:.6,ease:E},1.3);
tl.set("#q2",{opacity:0},0);
tl.set("#o1b",{className:"opt sel"},3.0);
tl.fromTo("#q2",{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:E},3.6);
tl.set("#o2a",{className:"opt sel"},5.2);
tl.to(["#h3","#card"],{opacity:0,y:-30,duration:.5,ease:"power2.in"},6.5);
tl.fromTo("#sign",{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:E},7.1);
tl.fromTo("#cta2",{opacity:0,y:30},{opacity:1,y:0,duration:.6,ease:E},8.3);
tl.fromTo("#sub",{opacity:0},{opacity:1,duration:.6},8.8);
tl.fromTo("#so",{opacity:0,y:20},{opacity:1,y:0,duration:.6,ease:E},9.7);
tl.to("#spine",{opacity:.25,duration:.6},7.0);"""
a5=aud(42.5,12.6,fo='data-fade-out="2.4"',sfx=[(3.05,'select.ogg',0.05,0.45),(5.25,'select.ogg',0.05,0.45)])

parts=[(1,'The gap',10.6,b1,c1,j1,a1),(2,'The engine',11,b2,c2,j2,a2),(3,'The proof',9.7,b3,c3,j3,a3),(4,'The method',11.2,b4,c4,j4,a4),(5,'The next step',12.6,b5,c5,j5,a5)]
for n,label,dur,b,c,j,a in parts:
    d=f'p{n}'
    os.makedirs(d,exist_ok=True)
    if not os.path.exists(d+'/assets'): shutil.copytree(SRC,d+'/assets')
    for f in ('hyperframes.json','meta.json','package.json'):
        if not os.path.exists(d+'/'+f): shutil.copy('../composition/'+f,d+'/'+f)
    open(d+'/index.html','w').write(page(n,label,dur,b,c,j,a))
print('ok')
