# builds the landscape test page docs/landscape/index.html: the game from src/ plus landscape/zz-landscape.js (src/ itself is not changed)
# usage: python3 landscape/make_landscape.py VERSION BUILD
import sys,os,shutil,subprocess,tempfile
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ver,bld=sys.argv[1],sys.argv[2]
t=tempfile.mkdtemp();s=os.path.join(t,'src')
shutil.copytree(os.path.join(D,'src'),s,ignore=shutil.ignore_patterns('.git','cr'))
shutil.copy(os.path.join(D,'landscape','zz-landscape.js'),os.path.join(s,'js','zz-landscape.js'))
out=os.path.join(t,'game.html');subprocess.run([sys.executable,os.path.join(s,'build.py'),ver,bld,out],check=True)
game=open(out,encoding='utf-8').read()
# creature pictures are shared with the main page one folder up
assert game.count("const crS=p=>'cr/'")==1
game=game.replace("const crS=p=>'cr/'","const crS=p=>'../cr/'")
page=('<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
 '<title>Бой стаи · горизонтально</title>\n<meta name="apple-mobile-web-app-capable" content="yes">\n'
 '<meta name="mobile-web-app-capable" content="yes">\n'
 '<meta name="apple-mobile-web-app-status-bar-style" content="black">\n'
 '<meta name="apple-mobile-web-app-title" content="Бой стаи ↔">\n<meta name="theme-color" content="#16233a">\n'
 '<link rel="apple-touch-icon" href="../apple-touch-icon.png">\n<link rel="manifest" href="manifest.webmanifest">\n'
 '</head>\n<body>\n'+game+'</body>\n</html>\n')
o=os.path.join(D,'docs','landscape');os.makedirs(o,exist_ok=True)
open(os.path.join(o,'index.html'),'w',encoding='utf-8').write(page)
open(os.path.join(o,'manifest.webmanifest'),'w',encoding='utf-8').write(
 '{"name":"Бой стаи (горизонтально)","short_name":"Бой стаи ↔","start_url":"./","scope":"./","display":"fullscreen",'
 '"orientation":"landscape","background_color":"#16233a","theme_color":"#16233a","icons":['
 '{"src":"../icon-192.png","sizes":"192x192","type":"image/png"},{"src":"../icon-512.png","sizes":"512x512","type":"image/png"}]}\n')
print('docs/landscape/index.html',ver,bld,len(page))
