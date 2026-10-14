# builds the single-file prototype from src/: head.html + style.css + body.html + js/*.js (in file-name order)
# usage: python3 build.py VERSION BUILD [out.html]
import sys,glob,os
D=os.path.dirname(os.path.abspath(__file__))+'/'
ver,bld=sys.argv[1],sys.argv[2]
out=sys.argv[3] if len(sys.argv)>3 else D+'../pack-battle-'+ver+'.html'
js=[open(f).read() for f in sorted(glob.glob(D+'js/*.js'))]
js[0]=f"\nconst VER='{ver}',BUILD={bld};\n"
src=open(D+'head.html').read()+'<style>'+open(D+'style.css').read()+'</style>'+open(D+'body.html').read()+'<script>'+''.join(js).rstrip('\n')+'\n</script>\n'
open(out,'w').write(src);print(out,len(src))
