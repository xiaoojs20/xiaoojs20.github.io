(() => {
  const root = document.querySelector('[data-fitness-calendar]');
  if (!root) return;
  const zh = root.dataset.language === 'zh';
  const text = (cn, en) => zh ? cn : en;
  const data = JSON.parse(document.querySelector('#fitness-calendar-data').textContent);
  const valid = /^\d{4}-\d{2}-\d{2}$/;
  const dates = new Set((Array.isArray(data.dates) ? data.dates : []).filter(d => typeof d === 'string' && valid.test(d) && d <= data.updatedThrough));
  const start = data.startMonth;
  const end = data.updatedThrough.slice(0, 7);
  let current = end;
  const prev = root.querySelector('[data-fitness-prev]');
  const next = root.querySelector('[data-fitness-next]');
  const grid = root.querySelector('[data-fitness-grid]');
  const monthTitle = root.querySelector('[data-fitness-month]');
  const shift = (month, step) => { const [y,m]=month.split('-').map(Number); const d=new Date(Date.UTC(y,m-1+step,1)); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`; };
  const render = () => {
    const [year,month]=current.split('-').map(Number);
    monthTitle.textContent=zh ? `${year}年${month}月` : new Intl.DateTimeFormat('en',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,1)));
    prev.disabled=current<=start; next.disabled=current>=end;
    grid.replaceChildren();
    const offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
    const days=new Date(Date.UTC(year,month,0)).getUTCDate();
    const total=offset+days;
    for(let row=0; row<Math.ceil(total/7); row++){
      const line=document.createElement('div');line.className='fitness-calendar__row';line.setAttribute('role','row');
      for(let col=0; col<7; col++){
        const day=row*7+col-offset+1, cell=document.createElement('span');cell.className='fitness-calendar__day';cell.setAttribute('role','gridcell');
        if(day<1||day>days){cell.classList.add('is-empty');cell.setAttribute('aria-hidden','true')}
        else {const date=`${current}-${String(day).padStart(2,'0')}`,done=dates.has(date);cell.textContent=String(day);if(done)cell.classList.add('is-complete');cell.setAttribute('aria-label',`${date} ${done?text('已打卡','checked in'):text('无打卡记录','no check-in recorded')}`)}
        line.append(cell);
      }
      grid.append(line);
    }
    const count=[...dates].filter(d=>d.startsWith(current+'-')).length;
    root.querySelector('[data-fitness-total]').textContent=text(`${count} 个打卡日`,`${count} ${count===1?'day':'days'}`);
    root.querySelector('[data-fitness-updated]').textContent=text(`记录更新至 ${data.updatedThrough}`,`Updated through ${data.updatedThrough}`);
  };
  prev.addEventListener('click',()=>{if(current>start){current=shift(current,-1);render()}});
  next.addEventListener('click',()=>{if(current<end){current=shift(current,1);render()}});
  render();
})();
