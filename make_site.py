# builds the playable page for GitHub Pages: docs/index.html
# usage: python3 make_site.py VERSION BUILD   (e.g. python3 make_site.py 0.37.0 127)
import sys,os,subprocess,tempfile
D=os.path.dirname(os.path.abspath(__file__))
ver,bld=sys.argv[1],sys.argv[2]
tmp=os.path.join(tempfile.mkdtemp(),'game.html')
subprocess.run([sys.executable,os.path.join(D,'src','build.py'),ver,bld,tmp],check=True)
game=open(tmp,encoding='utf-8').read()
page=('<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
 # «На экран Домой»: opens like an app, without browser bars (iPhone has no page fullscreen)
 '<title>Бой стаи</title>\n<meta name="apple-mobile-web-app-capable" content="yes">\n'
 '<meta name="mobile-web-app-capable" content="yes">\n'
 '<meta name="apple-mobile-web-app-status-bar-style" content="black">\n'
 '<meta name="apple-mobile-web-app-title" content="Бой стаи">\n<meta name="theme-color" content="#16233a">\n'
 '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="manifest" href="manifest.webmanifest">\n'
 '</head>\n<body>\n'
 +game+'</body>\n</html>\n')
os.makedirs(os.path.join(D,'docs'),exist_ok=True)
open(os.path.join(D,'docs','index.html'),'w',encoding='utf-8').write(page)
open(os.path.join(D,'docs','.nojekyll'),'w').close()
# icons (apple-touch-icon.png, icon-192.png, icon-512.png) are kept in docs/ as files
open(os.path.join(D,'docs','manifest.webmanifest'),'w',encoding='utf-8').write(
 '{"name":"Бой стаи","short_name":"Бой стаи","start_url":"./","scope":"./","display":"fullscreen",'
 '"orientation":"portrait","background_color":"#16233a","theme_color":"#16233a","icons":['
 '{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"}]}\n')
print('docs/index.html',ver,bld,len(page))
