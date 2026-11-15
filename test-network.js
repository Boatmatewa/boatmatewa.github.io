const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=__dirname,network=JSON.parse(fs.readFileSync(root+'/swan-routes-source.json'));
const html=fs.readFileSync(root+'/index.html','utf8');assert.deepStrictEqual(JSON.parse(html.match(/const SWAN_GUIDES=(.*);/)[1]),network);assert(html.includes(fs.readFileSync(root+'/river-network-core.js','utf8').trim()));
const ctx={console,Map,Set,Math,Error};vm.createContext(ctx);
vm.runInContext(`const rad=x=>x*Math.PI/180;function distanceNM(a,b){const q=Math.sin(rad(b.lat-a.lat)/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2;return 3440.065*2*Math.atan2(Math.sqrt(Math.min(1,q)),Math.sqrt(Math.max(0,1-q)));}`+fs.readFileSync(root+'/river-network-core.js','utf8'),ctx);
const p=(s,i)=>({name:s,lat:network.segments.find(x=>x.id===s).points[i][0],lng:network.segments.find(x=>x.id===s).points[i][1]});
const a=p('swan',3),b=p('swan',225),c=p('canning',35),d=p('freshwater',7);
for(const [x,y] of [[a,b],[a,c],[c,b],[d,c],[b,d]]){const f=ctx.networkTrip(x,y,network),r=ctx.networkTrip(y,x,network);assert(f.points.length>1);assert.equal(f.legs.length,f.points.length-1);assert.equal(JSON.stringify(f.points),JSON.stringify([...r.points].reverse()));const fLen=f.points.slice(1).reduce((v,p,i)=>v+ctx.distanceNM(f.points[i],p),0);assert(fLen>0);console.log(x.name+' → '+y.name+': '+fLen.toFixed(2)+' NM');}
const cross=ctx.networkTrip(c,b,network);assert(cross.legs.some(l=>!l.upstream));assert(cross.legs.some(l=>l.upstream));
const x=p('swan',40),y=p('swan',41),mix=t=>({name:'interior',lat:x.lat+(y.lat-x.lat)*t,lng:x.lng+(y.lng-x.lng)*t});
const interior=ctx.networkTrip(mix(.25),mix(.75),network);assert.equal(interior.points.length,2);assert(Math.abs(ctx.distanceNM(interior.points[0],mix(.25)))<.001);
assert.throws(()=>ctx.networkTrip(a,a,network),/same/);assert.throws(()=>ctx.networkTrip({lat:-33,lng:116},b,network),/No plotted/);
for(const seg of network.segments)for(let i=1;i<seg.points.length;i++){const x=p(seg.id,i-1),y=p(seg.id,i);assert(ctx.distanceNM(x,y)<1,'Unexpected large jump '+seg.id+' '+i);}
console.log('PASS: branch joins, forward/reverse paths, junction direction changes, projected endpoints, unsupported locations, no large jumps.');
