import os, shutil
SRC='/home/user/neon-builder-nexus/brag-output/composition'
HERE=os.path.dirname(os.path.abspath(__file__))
CSS='''
@font-face{font-family:"Bricolage";font-weight:800;src:url(assets/fonts/bricolage-800.ttf)}
@font-face{font-family:"Bricolage";font-weight:700;src:url(assets/fonts/bricolage-700.ttf)}
@font-face{font-family:"Poppins";font-weight:400;src:url(assets/fonts/poppins-400.ttf)}
@font-face{font-family:"Poppins";font-weight:500;src:url(assets/fonts/poppins-500.ttf)}
@font-face{font-family:"JBMono";font-weight:500;src:url(assets/fonts/jbmono-500.ttf)}
:root{--ground:#0F131A;--card:#161B24;--edge:rgba(255,255,255,.16);--ink:#EFF4F4;--muted:#8D97A8;--teal:#4ED0CC;--orange:#E0793E}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ground)}
#root{position:relative;width:1080px;height:1920px;background:var(--ground);color:var(--ink);font-family:"Poppins",sans-serif;overflow:hidden}
#grid{position:absolute;left:0;top:-90px;width:1080px;height:2010px;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:90px 90px}
#glow{position:absolute;left:-620px;top:1000px;width:1500px;height:1200px;background:radial-gradient(ellipse at center,rgba(78,208,204,.22),transparent 66%)}
.display{font-family:"Bricolage",sans-serif;font-weight:800;letter-spacing:-.03em;line-height:1.02}
.mono{font-family:"JBMono",monospace;font-weight:500;letter-spacing:.08em}
.teal{color:var(--teal)}
#thread{position:absolute;left:61px;top:0;width:6px;height:1920px;background:var(--teal);opacity:.55}
#pulsewrap{position:absolute;left:44px;top:0;width:40px;height:1920px;overflow:hidden}
#pulse{position:absolute;left:17px;top:-320px;width:6px;height:300px;background:linear-gradient(180deg,rgba(78,208,204,0),#BFF7F4 70%,#EFF4F4);box-shadow:0 0 22px 6px rgba(78,208,204,.55)}
#hdr{position:absolute;left:120px;top:300px;font-size:30px;color:var(--teal);line-height:1.5;text-transform:uppercase}
#hdr span{color:var(--muted)}
.h{position:absolute;left:120px;width:840px;top:440px}
.line{position:absolute;left:120px;width:840px;font-size:46px;line-height:1.3;color:var(--ink);opacity:0}
'''
def page(n,label,dur,body,css,js,audio):
    return f'''<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script><style>{CSS}{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
<div id="grid"></div><div id="glow"></div>
<div id="thread"></div><div id="pulsewrap" data-layout-allow-overflow><div id="pulse" data-layout-allow-overflow></div></div>
<div id="hdr" class="mono">0{n} / 03<br><span>{label}</span></div>
{audio}
{body}
</div><script>
const tl=gsap.timeline({{paused:true}});const E="power3.out";const D={dur};
tl.fromTo("#glow",{{opacity:.55}},{{opacity:1,duration:D,ease:"sine.inOut"}},0);
tl.fromTo("#grid",{{y:0}},{{y:90,duration:D,ease:"none"}},0);
{js}
window.__timelines=window.__timelines||{{}};window.__timelines["main"]=tl;tl.seek(0);
</script></body></html>'''
def aud(ms,dur,extra='',sfx=()):
    a=f'<audio id="music" src="assets/music/bed.mp3" data-start="0" data-duration="{dur}" data-media-start="{ms}" data-volume="0.5" {extra}></audio>'
    L={'drop.ogg':0.11,'click.ogg':0.055,'select.ogg':0.047}
    for i,(t,f,v) in enumerate(sfx):
        a+=f'\n<audio id="sx{i}" src="assets/sfx/{f}" data-start="{t}" data-duration="{L[f]}" data-volume="{v}"></audio>'
    return a

# ---------------- Part 1 ----------------
NODES=[(140,1000),(430,1100),(760,990),(250,1310),(620,1290)]
b1='''<div id="h" class="h display" data-layout-allow-safe-zone>Growth breaks <span class="teal">in the gaps.</span></div>
<div id="la" class="line" data-layout-allow-safe-zone>The brand says one thing and the website does another.</div>
<div id="lb" class="line" data-layout-allow-safe-zone>Businesses end up hiring five vendors who never speak to each other.</div>
<div id="ca" class="card"><div class="circ"></div><div class="bar b1"></div><div class="bar b2"></div><div class="sw s1"></div><div class="sw s2"></div><div class="sw s3"></div></div>
<div id="cb" class="card"><div class="top"><i></i><i></i><i></i></div><div class="hero"></div><div class="bar b3"></div><div class="bar b4"></div><div class="btn"></div></div>
'''+''.join(f'<div class="node" id="n{i+1}" style="left:{x}px;top:{y}px"><i></i></div>' for i,(x,y) in enumerate(NODES))
c1='''#h{font-size:112px}
.line{top:720px}
.card{position:absolute;width:380px;height:400px;background:var(--card);border:2px solid var(--edge);opacity:0}
#ca{left:120px;top:990px;border-color:rgba(78,208,204,.7)}
#cb{left:560px;top:1050px}
#ca .circ{position:absolute;left:40px;top:40px;width:130px;height:130px;border-radius:50%;background:var(--teal)}
.bar{position:absolute;height:18px}
#ca .b1{left:40px;top:212px;width:230px;background:var(--ink)}
#ca .b2{left:40px;top:250px;width:150px;background:var(--muted)}
.sw{position:absolute;top:310px;width:50px;height:50px}
.s1{left:40px;background:var(--teal)}.s2{left:104px;background:rgba(78,208,204,.45)}.s3{left:168px;border:2px solid var(--teal)}
#cb .top{position:absolute;left:0;top:0;width:100%;height:52px;border-bottom:2px solid var(--edge)}
#cb .top i{position:absolute;top:19px;width:14px;height:14px;background:var(--muted)}
#cb .top i:nth-child(1){left:20px}#cb .top i:nth-child(2){left:44px}#cb .top i:nth-child(3){left:68px}
#cb .hero{position:absolute;right:36px;top:88px;width:190px;height:110px;border:2px dashed var(--muted)}
#cb .b3{right:36px;top:226px;width:120px;background:var(--muted)}
#cb .b4{right:36px;top:262px;width:250px;background:rgba(141,151,168,.5)}
#cb .btn{position:absolute;right:36px;top:314px;width:110px;height:46px;border:2px solid var(--muted)}
.node{position:absolute;width:130px;height:130px;background:var(--card);border:3px solid var(--teal);opacity:0}
.node i{position:absolute;left:47px;top:47px;width:30px;height:30px;background:var(--teal)}'''
j1='''tl.fromTo("#la",{opacity:0,y:24},{opacity:1,y:0,duration:.3,ease:E},2.4);
tl.fromTo("#ca",{opacity:0,x:-70,rotation:0},{opacity:1,x:0,rotation:0,duration:.45,ease:E},2.45);
tl.fromTo("#cb",{opacity:0,x:70,rotation:0},{opacity:1,x:0,rotation:0,duration:.45,ease:E},2.65);
tl.to("#cb",{y:54,rotation:5,duration:.4,ease:"back.out(2.2)"},3.5);
tl.to("#ca",{y:-16,rotation:-2.5,duration:.4,ease:"back.out(2.2)"},3.5);
tl.to("#ca",{x:-8,duration:2.0,ease:"sine.inOut"},3.95);
tl.to("#cb",{x:12,duration:2.0,ease:"sine.inOut"},3.95);
tl.to(["#la","#ca","#cb"],{opacity:0,duration:.18,ease:"power2.in"},6.0);
tl.fromTo("#lb",{opacity:0,y:24},{opacity:1,y:0,duration:.3,ease:E},6.2);
const P=%s,F=[14,-12,10,-14,12];
P.forEach((p,i)=>{const s="#n"+(i+1);
 tl.fromTo(s,{opacity:0,scale:.6,x:0,y:0},{opacity:1,scale:1,x:0,y:0,duration:.4,ease:"back.out(1.8)"},6.25+i*.13);
 tl.to(s,{y:F[i],duration:1.5,ease:"sine.inOut",yoyo:true,repeat:1},7.2);
 tl.to(s,{x:(475-p[0])*.55,y:(1180-p[1])*.55,duration:.42,ease:"power2.inOut"},10.2);
 tl.to(s,{y:"+=520",opacity:0,duration:.36,ease:"power2.in"},10.62);});
tl.fromTo("#pulse",{y:0},{y:2300,duration:.8,ease:"power1.in"},10.2);''' % str([list(p) for p in NODES])
a1=aud(0,11,'data-fade-in="0.6"',[(2.42,'drop.ogg',0.4),(6.22,'drop.ogg',0.4)])

# ---------------- Part 2 ----------------
b2='''<div class="tile" id="t1"><div class="fill"></div><div class="tx display" data-layout-allow-safe-zone>Brand.</div></div>
<div class="tile" id="t2"><div class="fill"></div><div class="tx display" data-layout-allow-safe-zone>Platforms.</div></div>
<div class="tile" id="t3"><div class="fill"></div><div class="tx display" data-layout-allow-safe-zone>People.</div></div>
<div class="cn" id="c1h"></div><div class="cn" id="c1v"></div><div class="cn" id="c2h"></div><div class="cn" id="c2v"></div>
<div id="l2" class="line" data-layout-allow-safe-zone>Three parts of one engine. Each makes the others stronger.</div>
<div id="l3" class="line" data-layout-allow-safe-zone>'''+' '.join(f'<span class="w">{w}</span>' for w in "AI runs through all three. That&rsquo;s why it compounds.".split())+'''</div>
<div id="sq"></div>'''
c2='''.tile{position:absolute;width:270px;height:270px;background:var(--card);border:3px solid var(--edge)}
#t1{left:120px;top:430px}#t2{left:405px;top:715px}#t3{left:690px;top:1000px}
.tile .fill{position:absolute;inset:0;background:linear-gradient(135deg,rgba(78,208,204,.9),rgba(78,208,204,.25));opacity:0}
.tile .tx{position:absolute;left:20px;bottom:22px;font-size:46px;white-space:nowrap}
.cn{position:absolute;background:var(--teal);opacity:0}
#c1h{left:390px;top:563px;width:152px;height:4px}#c1v{left:538px;top:563px;width:4px;height:152px}
#c2h{left:675px;top:848px;width:152px;height:4px}#c2v{left:823px;top:848px;width:4px;height:152px}
.line{top:1320px}
#l3{opacity:1}#l3 .w{opacity:0}
#sq{position:absolute;left:44px;top:930px;width:40px;height:40px;background:var(--teal);opacity:0}'''
j2='''tl.fromTo("#pulse",{y:0},{y:2300,duration:.9,ease:"power1.out"},0);
["#t1","#t2","#t3"].forEach((s,i)=>tl.fromTo(s,{y:0},{y:i%2?10:-10,duration:.95,ease:"sine.inOut",yoyo:true,repeat:1},.05));
tl.fromTo("#c1h",{opacity:1,scaleX:0,transformOrigin:"left center"},{opacity:1,scaleX:1,duration:.25,ease:"power2.in"},2.0);
tl.fromTo("#c1v",{opacity:1,scaleY:0,transformOrigin:"center top"},{opacity:1,scaleY:1,duration:.25,ease:"power2.out"},2.25);
tl.fromTo("#c2h",{opacity:1,scaleX:0,transformOrigin:"left center"},{opacity:1,scaleX:1,duration:.25,ease:"power2.in"},2.5);
tl.fromTo("#c2v",{opacity:1,scaleY:0,transformOrigin:"center top"},{opacity:1,scaleY:1,duration:.25,ease:"power2.out"},2.75);
tl.to("#t1",{borderColor:"#4ED0CC",duration:.3},2.0);tl.to("#t2",{borderColor:"#4ED0CC",duration:.3},2.5);tl.to("#t3",{borderColor:"#4ED0CC",duration:.3},3.0);
tl.fromTo("#l2",{opacity:0,y:24},{opacity:1,y:0,duration:.3,ease:E},2.0);
tl.to("#l2",{opacity:0,duration:.15,ease:"power2.in"},5.85);
tl.to("#l3 .w",{opacity:1,duration:.12,stagger:.27,ease:"none"},6.05);
tl.to(".tile .fill",{opacity:.34,duration:.5,stagger:.32,ease:"power2.out"},6.1);
tl.to(".cn",{boxShadow:"0 0 18px 4px rgba(78,208,204,.7)",duration:.5,stagger:.2},6.2);
tl.to(".tile .fill",{opacity:.16,duration:.9,ease:"sine.inOut",yoyo:true,repeat:3},7.3);
tl.to(".tile .tx",{opacity:0,duration:.2},11.0);
tl.to(".cn",{opacity:0,duration:.15},11.0);
[[255,565],[540,850],[825,1135]].forEach((c,i)=>tl.to("#t"+(i+1),{x:64-c[0],y:950-c[1],scale:.148,duration:.45,ease:"power3.in"},11.0));
tl.set(".tile",{opacity:0},11.45);tl.set("#sq",{opacity:1},11.45);
tl.fromTo("#sq",{y:0},{y:1100,duration:.55,ease:"power2.in"},11.45);'''
a2=aud(11,12,'',[(2.02,'drop.ogg',0.4),(6.07,'drop.ogg',0.4),(11.45,'click.ogg',0.4)])

# ---------------- Part 3 ----------------
b3='''<div id="s1">
<div id="h" class="h display" data-layout-allow-safe-zone>We don&rsquo;t take <span class="teal">every brief.</span></div>
<div id="l2" class="line" data-layout-allow-safe-zone>We take the right problems and solve them completely. Bring us yours.</div>
<div id="floor"></div>
<div id="door"><div id="light"></div><div id="panel"><i></i></div></div>
<div id="prob"><i></i></div>
</div>
<div id="sq"></div>
<img id="logo" src="assets/img/logo.png" alt="Digital Creatives Hub"/>
<div id="hero" class="display" data-layout-allow-safe-zone>Growth made<br><span class="teal">possible.</span></div>
<div id="thread2"></div><div id="elbow"></div>
<div id="cta"><div id="ct" class="display" data-layout-allow-safe-zone>Free Growth Diagnostic</div>
<div id="urlrow"><span id="url" class="mono" data-layout-allow-safe-zone>digitalcreativeshubltd.com/diagnostic</span>
<svg id="arrow" width="54" height="34" viewBox="0 0 54 34"><path d="M0 17H48M34 3L48 17L34 31" fill="none" stroke="#E0793E" stroke-width="6" stroke-linecap="square"/></svg></div>
<div id="ul"></div></div>'''
c3='''#thread{height:1263px}
#pulsewrap{height:1263px}
#thread2{position:absolute;left:61px;top:1263px;width:6px;height:657px;background:var(--teal);opacity:.55}
#elbow{position:absolute;left:67px;top:1257px;width:53px;height:6px;background:var(--teal);opacity:.55}
#h{font-size:112px}
.line{top:720px}
#sq{position:absolute;left:44px;top:480px;width:40px;height:40px;background:var(--teal)}
#floor{position:absolute;left:240px;top:1456px;width:600px;height:4px;background:var(--muted);opacity:0}
#door{position:absolute;left:380px;top:1000px;width:320px;height:460px;border:6px solid var(--teal);border-bottom:none;opacity:0}
#light{position:absolute;inset:0;background:linear-gradient(180deg,rgba(78,208,204,.55),rgba(78,208,204,.12));opacity:0}
#panel{position:absolute;inset:0;background:var(--card);border-right:4px solid var(--teal)}
#panel i{position:absolute;right:26px;top:226px;width:22px;height:22px;background:var(--teal)}
#prob{position:absolute;left:800px;top:1340px;width:100px;height:100px;background:var(--card);border:3px solid var(--teal);opacity:0}
#prob i{position:absolute;left:35px;top:35px;width:24px;height:24px;background:var(--teal)}
#logo{position:absolute;left:104px;top:410px;width:400px;opacity:0}
#hero{position:absolute;left:120px;width:840px;top:730px;font-size:118px;white-space:nowrap;opacity:0}
#cta{position:absolute;left:120px;top:1100px;width:840px;height:320px;background:var(--card);border:2px solid var(--edge);border-left:6px solid var(--teal);padding:58px 44px 0 44px;opacity:0}
#ct{font-weight:700;font-size:62px;letter-spacing:-.02em;white-space:nowrap}
#urlrow{margin-top:56px;display:flex;align-items:center;justify-content:space-between}
#url{font-size:30px;letter-spacing:0;color:var(--ink)}
#ul{margin-top:14px;width:670px;height:6px;background:var(--orange)}'''
j3='''tl.fromTo("#sq",{y:-480,x:0,scale:1,opacity:1},{y:0,x:0,scale:1,opacity:1,duration:.6,ease:"power3.out"},0);
tl.to("#sq",{scale:1.25,duration:.5,ease:"sine.inOut",yoyo:true,repeat:1},1.1);
tl.fromTo("#l2",{opacity:0,y:24},{opacity:1,y:0,duration:.3,ease:E},2.4);
tl.to("#sq",{x:476,y:730,duration:.5,ease:"power3.inOut"},2.4);
tl.to("#sq",{scale:8,opacity:0,duration:.35,ease:"power2.in"},2.85);
tl.fromTo("#door",{opacity:0,scale:.7},{opacity:1,scale:1,duration:.35,ease:"back.out(1.6)"},2.95);
tl.fromTo("#floor",{opacity:0,scaleX:0},{opacity:.7,scaleX:1,duration:.4,ease:E},3.0);
tl.fromTo("#panel",{scaleX:1,skewY:0,transformOrigin:"left center"},{scaleX:.2,skewY:-7,duration:.7,ease:"power3.inOut"},3.4);
tl.fromTo("#light",{opacity:0},{opacity:1,duration:.7,ease:"power2.out"},3.4);
tl.fromTo("#prob",{opacity:0,x:60,scale:1},{opacity:1,x:0,scale:1,duration:.35,ease:E},4.0);
tl.to("#prob",{x:-270,duration:.8,ease:"power2.inOut"},4.5);
tl.to("#prob",{scale:.5,opacity:0,duration:.3,ease:"power2.in"},5.1);
tl.to("#light",{opacity:.55,duration:.5,ease:"sine.inOut",yoyo:true,repeat:1},5.3);
tl.to("#s1",{opacity:0,duration:.2,ease:"power2.in"},6.4);
tl.fromTo("#logo",{opacity:0,y:30},{opacity:1,y:0,duration:.45,ease:E},6.6);
tl.fromTo("#hero",{opacity:0,y:40},{opacity:1,y:0,duration:.45,ease:E},6.65);
tl.fromTo("#cta",{opacity:0,y:140},{opacity:1,y:0,duration:.5,ease:E},8.6);
tl.fromTo("#thread2",{scaleY:1,transformOrigin:"center top"},{scaleY:0,duration:.4,ease:"power2.inOut"},8.6);
tl.fromTo("#elbow",{scaleX:0,transformOrigin:"left center"},{scaleX:1,duration:.3,ease:"power2.out"},8.95);
tl.fromTo("#ul",{scaleX:0,transformOrigin:"left center"},{scaleX:1,duration:.5,ease:"power2.out"},9.1);
tl.fromTo("#arrow",{opacity:0,x:-30},{opacity:1,x:0,duration:.35,ease:E},9.35);
tl.to("#arrow",{x:12,duration:.45,ease:"sine.inOut",yoyo:true,repeat:3},9.9);
tl.fromTo("#pulse",{y:0},{y:1600,duration:.9,ease:"power1.inOut"},9.3);'''
a3=aud(23,12,'data-fade-out="2.2"',[(2.42,'drop.ogg',0.4),(3.42,'click.ogg',0.35),(6.62,'drop.ogg',0.4),(8.62,'select.ogg',0.45)])

parts=[(1,'The gap',11,b1,c1,j1,a1),(2,'One engine',12,b2,c2,j2,a2),(3,'Next step',12,b3,c3,j3,a3)]
for n,label,dur,b,c,j,a in parts:
    d=os.path.join(HERE,f'p{n}')
    os.makedirs(d,exist_ok=True)
    if not os.path.exists(d+'/assets'): shutil.copytree(SRC+'/assets',d+'/assets')
    for f in ('hyperframes.json','package.json'):
        if not os.path.exists(d+'/'+f): shutil.copy(SRC+'/'+f,d+'/'+f)
    open(d+'/meta.json','w').write('{"id":"dch-3part-p%d","name":"dch-3part-p%d"}'%(n,n))
    open(d+'/index.html','w').write(page(n,label,dur,b,c,j,a))
print('ok')
