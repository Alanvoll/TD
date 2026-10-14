# builds the playable page for GitHub Pages: docs/index.html
# usage: python3 make_site.py VERSION BUILD   (e.g. python3 make_site.py 0.37.0 127)
import sys,os,subprocess,tempfile
D=os.path.dirname(os.path.abspath(__file__))
ver,bld=sys.argv[1],sys.argv[2]
tmp=os.path.join(tempfile.mkdtemp(),'game.html')
subprocess.run([sys.executable,os.path.join(D,'src','build.py'),ver,bld,tmp],check=True)
game=open(tmp,encoding='utf-8').read()
page=('<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n'
 +game+'</body>\n</html>\n')
os.makedirs(os.path.join(D,'docs'),exist_ok=True)
open(os.path.join(D,'docs','index.html'),'w',encoding='utf-8').write(page)
open(os.path.join(D,'docs','.nojekyll'),'w').close()
print('docs/index.html',ver,bld,len(page))
