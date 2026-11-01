const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const allowed = new Set(['index.html','styles.css','app.js','assets/calico.css']);
http.createServer((req,res)=>{
  const name = new URL(req.url,'http://localhost').pathname.slice(1) || 'index.html';
  if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}
  fs.readFile(path.join(__dirname,name),(error,data)=>{
    if(error){res.writeHead(500);res.end('Unable to read file');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-store'});res.end(data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Calico UI: http://127.0.0.1:4173'));
