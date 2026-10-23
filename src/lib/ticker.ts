export function drawTicker(ctx:CanvasRenderingContext2D,headline:string,time:number,width:number,height:number){
 const h=Math.round(height*.1), top=height-h, badge=Math.round(width*.17), font=Math.round(h*.42);
 ctx.fillStyle='#b91c1c';ctx.fillRect(0,top,width,h);ctx.fillStyle='#fff';ctx.fillRect(0,top,badge,h);
 ctx.font=`bold ${font}px Arial`;ctx.textBaseline='middle';ctx.fillStyle='#991b1b';ctx.fillText('BREAKING',16,top+h/2);
 ctx.save();ctx.beginPath();ctx.rect(badge+12,top,width-badge-12,h);ctx.clip();ctx.fillStyle='#fff';
 const text=headline.trim()||'LATEST NEWS';const period=ctx.measureText(text).width+120;
 let x=width-((Math.max(0,time)*140)%period);while(x>badge-period)x-=period;
 while(x<width){ctx.fillText(text,x,top+h/2);x+=period;}ctx.restore();
}
