/* 衣拍即合 - 纯前端，图片本地处理 */
const IMG = (p, s) => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(p)}&image_size=${s || 'square'}`;

/* ---------- 页面切换 ---------- */
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
function go(name) {
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.go === name));
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => go(el.dataset.go)));
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));

/* ---------- 首页素材条 ---------- */
const MATERIALS = [
  ['白色棉质衬衫', '白色棉质衬衫平铺产品摄影，浅灰背景，真实面料质感，高清'],
  ['直筒牛仔裤', '蓝色直筒牛仔裤平铺产品摄影，浅灰背景，真实牛仔面料纹理，高清'],
  ['卡其色风衣', '卡其色风衣平铺产品摄影，浅灰背景，真实面料褶皱，高清'],
  ['针织开衫', '米色针织开衫平铺产品摄影，浅灰背景，柔软针织纹理，高清'],
  ['小白鞋', '一双白色帆布鞋产品摄影，浅灰背景，真实质感，高清'],
  ['黑色西装裤', '黑色西装阔腿裤平铺产品摄影，浅灰背景，垂坠面料，高清'],
  ['条纹T恤', '黑白条纹棉质T恤平铺产品摄影，浅灰背景，高清'],
  ['牛仔外套', '浅蓝色牛仔外套平铺产品摄影，浅灰背景，高清'],
  ['百褶裙', '灰色百褶半身裙平铺产品摄影，浅灰背景，高清'],
  ['帆布托特包', '米白色帆布托特包产品摄影，浅灰背景，高清'],
  ['棒球帽', '米色棒球帽产品摄影，浅灰背景，高清'],
  ['卫衣', '浅灰色连帽卫衣平铺产品摄影，浅灰背景，高清'],
];
document.getElementById('homeStrip').innerHTML = MATERIALS.map(([name, p]) =>
  `<div class="thumb"><img loading="lazy" src="${IMG(p)}" alt="${name}"><div class="cap">${name}</div></div>`).join('');

/* ---------- 衣橱上传（本地预览，不上传） ---------- */
const CATS = [
  { id: 'top',    label: '上装',   req: 1 },
  { id: 'bottom', label: '下装',   req: 1 },
  { id: 'outer',  label: '外套' },
  { id: 'shoes',  label: '鞋履' },
  { id: 'acc',    label: '配饰（选填）' },
  { id: 'hair',   label: '发型参考（选填）' },
];
const wardrobe = {}; // id -> [objectURL]
const wEl = document.getElementById('wardrobe');
wEl.innerHTML = CATS.map(c => `
  <div class="cat" data-cat="${c.id}">
    <div class="up">
      <input type="file" accept="image/*" multiple>
      <div class="thumb-stack"><div class="add">+</div></div>
    </div>
    <div class="label">${c.label}${c.req ? ' *' : ''}</div>
  </div>`).join('');

wEl.addEventListener('change', e => {
  const input = e.target;
  if (!input.files) return;
  const cat = input.closest('.cat').dataset.cat;
  wardrobe[cat] = wardrobe[cat] || [];
  const stack = input.closest('.cat').querySelector('.thumb-stack');
  [...input.files].slice(0, 3).forEach(f => {
    const url = URL.createObjectURL(f);
    wardrobe[cat].push(url);
    const img = document.createElement('img');
    img.src = url;
    stack.appendChild(img);
  });
  stack.querySelector('.add')?.remove();
});

/* ---------- 选项 pills ---------- */
document.querySelectorAll('.pills').forEach(box => {
  box.addEventListener('click', e => {
    const b = e.target.closest('.pill');
    if (!b) return;
    box.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    b.classList.add('active');
  });
});
const pick = f => document.querySelector(`.pills[data-field="${f}"] .pill.active`)?.textContent || '';

/* ---------- 穿搭方案生成 ---------- */
const SKIN = {
  '冷白皮': '适合冷色调与高饱和色：宝蓝、酒红、纯白都很衬你；避开大面积土黄色。',
  '暖黄皮': '适合暖色调：驼色、奶油白、橄榄绿更显气色；慎选荧光色与灰粉色。',
  '中性皮': '大多数颜色都能驾驭，建议用同色系穿出高级感，亮色做点缀。',
  '小麦色': '健康肤色适合浓郁色：焦糖、砖红、墨绿、白色对比很出彩。',
};
const FACE = {
  '圆脸': '推荐 V 领、方领拉长颈部线条；发型可选侧分长刘海或锁骨发修饰脸型。',
  '方脸': '推荐圆领、U 领柔化轮廓；发型适合空气感卷发或八字刘海。',
  '长脸': '推荐高领、一字领横向平衡；发型适合齐刘海或蓬松短卷发。',
  '心形脸': '推荐船领、小圆领平衡额头；发型适合lob头或法式刘海。',
  '椭圆脸': '百搭脸型，领口与发型自由选择，按风格切换即可。',
};
const STYLE_TIP = {
  '简约': '以黑白灰米为主色，剪裁干净利落，全身颜色不超过三种。',
  '通勤': '衬衫、西装裤与乐福鞋是核心，选垂坠面料更显专业。',
  '街头': '廓形卫衣、工装元素叠穿，配运动鞋与棒球帽更出彩。',
  '复古': '格纹、灯芯绒、牛仔与棕色系是复古关键词。',
  '运动': '卫衣卫裤套装加复古跑鞋，用亮色点缀增加活力。',
  '甜酷': '短上衣配高腰下装，皮质或金属配饰平衡甜度。',
};
function bodyTip(h, w) {
  const bmi = w / ((h / 100) ** 2);
  if (bmi < 18.5) return '偏瘦体型：适合叠穿与有量感的面料（针织、灯芯绒），增加层次感。';
  if (bmi < 24)   return '标准体型：大多数版型都合适，高腰设计能进一步优化比例。';
  if (bmi < 28)   return '微胖体型：推荐 H 型外套与垂坠下装，V 领显瘦，避免紧绷面料。';
  return '丰满体型：推荐深色垂坠面料与直线条剪裁，突出腰线位置。';
}

document.getElementById('btnPlan').addEventListener('click', () => {
  const gender = pick('gender'), skin = pick('skin'), face = pick('face'), style = pick('style');
  const age = document.getElementById('age').value;
  const h = +document.getElementById('height').value || 165;
  const w = +document.getElementById('weight').value || 52;
  const has = CATS.filter(c => wardrobe[c.id]?.length).map(c => c.label.replace(/（.*?）/g, ''));
  const miss = CATS.filter(c => c.req && !wardrobe[c.id]?.length).map(c => c.label);
  const shopRec = {
    '简约': '一件高品质白衬衫或直筒牛仔裤',
    '通勤': '一件剪裁利落的卡其风衣或西装外套',
    '街头': '一双复古跑鞋或廓形卫衣',
    '复古': '一件格纹半裙或灯芯绒外套',
    '运动': '一套同色系卫衣卫裤',
    '甜酷': '一件短款针织上衣或皮质半裙',
  }[style];

  document.getElementById('planResult').className = 'plan-result';
  document.getElementById('planResult').innerHTML = `
    <h3>你的专属穿搭方案</h3>
    <div>${[gender, age + '岁', skin, face, style + '风'].map(t => `<span class="tag">${t}</span>`).join('')}</div>
    <p><b>衣橱诊断：</b>${has.length ? `已上传 ${has.join('、')}，可以开始组合。` : '还没有上传衣物。'}${miss.length ? ` 建议补充${miss.join('、')}照片以获得更完整的方案。` : ''}</p>
    <p><b>配色方案：</b>${SKIN[skin]}</p>
    <p><b>穿搭思路：</b>${STYLE_TIP[style]}</p>
    <p><b>身材建议：</b>${bodyTip(h, w)}</p>
    <p><b>配饰与发型：</b>${FACE[face]}</p>
    <div class="rec"><b>推荐购入单品（购物参考）</b>${shopRec}，可在下方「穿搭灵感 · 推荐单品」中查看对应实物图。</div>`;
  document.getElementById('planResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- 效果图：平铺叠放 canvas ---------- */
const SLOTS = { // x,y,w,h,rot(deg)
  outer:  [0.04, 0.06, 0.42, 0.46, -4],
  top:    [0.36, 0.05, 0.38, 0.34,  3],
  hair:   [0.76, 0.06, 0.19, 0.20, -3],
  bottom: [0.40, 0.36, 0.36, 0.44, -2],
  acc:    [0.08, 0.55, 0.24, 0.24,  6],
  shoes:  [0.30, 0.78, 0.34, 0.19,  3],
};
const CAT_NAME = { top: '上装', bottom: '下装', outer: '外套', shoes: '鞋履', acc: '配饰', hair: '发型' };
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

function drawItem(ctx, img, [x, y, w, h, rot], W, H) {
  const dx = x * W, dy = y * H, dw = w * W, dh = h * H;
  ctx.save();
  ctx.translate(dx + dw / 2, dy + dh / 2);
  ctx.rotate(rot * Math.PI / 180);
  // 阴影模拟自然叠放
  ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  // contain 保持原图比例
  const s = Math.min(dw / img.width, dh / img.height);
  const iw = img.width * s, ih = img.height * s;
  ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
  // 布料褶皱高光/暗纹
  ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(-iw / 2, 0, iw / 2, 0);
  g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.08)');
  ctx.fillStyle = g; ctx.fillRect(-iw / 2, -ih / 2, iw, ih);
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.04})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    const sx = -iw / 2 + Math.random() * iw;
    ctx.moveTo(sx, -ih / 2);
    ctx.bezierCurveTo(sx + 14, -ih / 4, sx - 14, ih / 4, sx + 8, ih / 2);
    ctx.stroke();
  }
  ctx.restore();
}

document.getElementById('btnEffect').addEventListener('click', async () => {
  const box = document.getElementById('effectResult');
  const canvas = document.getElementById('effectCanvas');
  const W = 800, H = 1000;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  // 亚麻布背景
  ctx.fillStyle = '#efe9df'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0,0,0,.03)';
  for (let i = 0; i < H; i += 3) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }
  for (let i = 0; i < W; i += 3) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }

  const order = ['outer', 'bottom', 'top', 'acc', 'shoes', 'hair'];
  let drawn = 0;
  for (const cat of order) {
    const url = wardrobe[cat]?.[0];
    if (!url) continue;
    drawItem(ctx, await loadImg(url), SLOTS[cat], W, H);
    drawn++;
  }
  if (!drawn) {
    ctx.fillStyle = '#6b7280'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('请先在「我的衣橱」上传衣物照片', W / 2, H / 2);
  } else {
    ctx.fillStyle = 'rgba(17,24,39,.55)'; ctx.font = '15px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('衣拍即合 · 我的搭配效果图', 24, H - 24);
  }
  document.getElementById('downloadEffect').href = canvas.toDataURL('image/png');
  box.classList.remove('hidden');
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- 穿搭灵感 ---------- */
const SHOP = {
  '上装': [['白色棉质衬衫', MATERIALS[0][1], '百搭基础款，通勤休闲两相宜'], ['条纹T恤', MATERIALS[6][1], '法式复古，单穿内搭都好看'], ['针织开衫', MATERIALS[3][1], '温柔层次感必备']],
  '下装': [['直筒牛仔裤', MATERIALS[1][1], '修饰腿型，高腰显腿长'], ['黑色西装裤', MATERIALS[5][1], '垂坠显瘦，通勤首选'], ['百褶裙', MATERIALS[8][1], '学院风，灵动百搭']],
  '外套': [['卡其色风衣', MATERIALS[2][1], '春秋季气场单品'], ['牛仔外套', MATERIALS[7][1], '复古街头感，永不过时']],
  '鞋履': [['小白鞋', MATERIALS[4][1], '鞋柜必备，搭一切']],
  '配饰': [['帆布托特包', MATERIALS[9][1], '大容量日常通勤'], ['棒球帽', MATERIALS[10][1], '遮阳又增加造型感']],
};
const CASES = [
  ['简约日常', '白衬衫 + 直筒牛仔裤 + 小白鞋，清爽不费力', '年轻女性穿白色衬衫和蓝色直筒牛仔裤小白鞋的全身街拍，自然光，真实摄影'],
  ['优雅通勤', '卡其风衣 + 西装裤，利落有气场', '职场女性穿卡其色风衣和黑色西装裤的全身街拍，城市街道，真实摄影'],
  ['复古学院', '针织开衫 + 百褶裙，温柔书卷气', '年轻女性穿米色针织开衫和灰色百褶裙的全身照，校园背景，真实摄影'],
  ['街头休闲', '连帽卫衣 + 工装风，松弛有型', '年轻人穿灰色连帽卫衣和工装裤的街头全身照，真实摄影'],
  ['甜酷约会', '短上衣 + 高腰裙，甜而不腻', '年轻女性穿短款上衣和高腰半身裙的全身照，咖啡馆街道，真实摄影'],
  ['复古牛仔', '牛仔外套叠穿，美式复古', '年轻人穿浅蓝牛仔外套和白T恤牛仔裤的全身街拍，真实摄影'],
];
document.getElementById('caseGrid').innerHTML = CASES.map(([t, d, p]) =>
  `<div class="case-card"><img loading="lazy" src="${IMG(p, 'portrait_4_3')}" alt="${t}"><div class="body"><b>${t}</b><p>${d}</p></div></div>`).join('');

const INSPO = {
  color: {
    opts: ['同色系', '邻近色', '对比色', '无彩色+点缀色'],
    gen: o => ({
      '同色系': ['同一色相不同深浅的组合最显高级，例如米白+驼色+咖啡，注意用材质差异制造层次。', 'lookbook 摄影，模特穿米色针织衫驼色阔腿裤咖啡色大衣同色系搭配，全身照，真实摄影'],
      '邻近色': ['色环上相邻的颜色（如蓝+绿、黄+橙）和谐又有变化，适合想跳脱基础色的你。', 'lookbook 摄影，模特穿蓝色衬衫和绿色半裙邻近色搭配，全身照，真实摄影'],
      '对比色': ['对比色（如蓝+橙）吸睛度高，建议按 7:3 面积分配，小面积撞色更耐看。', 'lookbook 摄影，模特穿蓝色外套和橙色内搭对比色搭配，全身照，真实摄影'],
      '无彩色+点缀色': ['黑白灰打底，用一个亮色（红/绿/黄）点睛，是最不容易出错的公式。', 'lookbook 摄影，模特穿黑白灰服装搭配红色包包点缀，全身照，真实摄影'],
    }[o]),
  },
  style: {
    opts: Object.keys(STYLE_TIP),
    gen: o => [STYLE_TIP[o], `时尚 lookbook，${o}风格完整穿搭，模特全身照，真实摄影，自然光`],
  },
  scene: {
    opts: ['日常上课', '约会聚会', '职场面试', '旅行度假'],
    gen: o => ({
      '日常上课': ['舒适优先：卫衣/衬衫 + 直筒裤 + 运动鞋，托特包装下课本电脑。', '大学生日常上课穿搭，卫衣直筒裤运动鞋，校园场景全身照，真实摄影'],
      '约会聚会': ['突出腰线与好气色：针织衫 + 半裙或连衣裙，配饰精致小巧。', '约会穿搭，针织衫半身裙，咖啡馆街道全身照，真实摄影'],
      '职场面试': ['干练可信：衬衫 + 西装裤/半裙 + 低跟鞋，颜色以黑白灰蓝为主。', '职场面试穿搭，白衬衫西装裤，办公室场景全身照，真实摄影'],
      '旅行度假': ['上镜又舒服：亮色连衣裙或衬衫 + 牛仔裤，草帽墨镜加分。', '旅行度假穿搭，连衣裙草帽，海边街道全身照，真实摄影'],
    }[o]),
  },
  body: {
    opts: ['梨形', '苹果形', '沙漏形', '直筒形', '小个子'],
    gen: o => ({
      '梨形': ['上浅下深、上繁下简：突出上半身，A字裙/阔腿裤弱化胯部。', '梨形身材穿搭，亮色上衣深色阔腿裤，全身照，真实摄影'],
      '苹果形': ['V领 + 高腰直筒裤拉长线条，外套敞开穿形成纵向分割。', '苹果形身材穿搭，V领上衣直筒裤开衫外套，全身照，真实摄影'],
      '沙漏形': ['顺应曲线：收腰连衣裙或短上衣 + 高腰下装，突出腰线。', '沙漏形身材穿搭，收腰连衣裙，全身照，真实摄影'],
      '直筒形': ['制造曲线：叠穿与腰带强调腰线，A字廓形增加柔美。', '直筒身材穿搭，腰带收腰衬衫A字裙，全身照，真实摄影'],
      '小个子': ['高腰线 + 同色系延长视觉：短上衣 + 高腰裤，鞋裤同色更显高。', '小个子穿搭，短上衣高腰裤同色系，全身照，真实摄影'],
    }[o]),
  },
  shop: { opts: Object.keys(SHOP) },
};
let inspoTab = 'color', inspoOpt = INSPO.color.opts[0];

function renderInspo() {
  const pills = document.getElementById('inspoPills');
  pills.innerHTML = INSPO[inspoTab].opts.map(o =>
    `<button class="pill ${o === inspoOpt ? 'active' : ''}">${o}</button>`).join('');
  const res = document.getElementById('inspoResult');
  if (inspoTab === 'shop') {
    res.innerHTML = `<h3>推荐购买单品 · ${inspoOpt}</h3><div class="shop-grid">` +
      SHOP[inspoOpt].map(([n, p, d]) =>
        `<div class="item"><img loading="lazy" src="${IMG(p)}" alt="${n}"><div class="txt"><b>${n}</b><br>${d}</div></div>`).join('') + '</div>';
    return;
  }
  const [advice, prompt] = INSPO[inspoTab].gen(inspoOpt);
  res.innerHTML = `
    <div class="card"><img loading="lazy" src="${IMG(prompt, 'portrait_4_3')}" alt="${inspoOpt}穿搭效果图">
      <div class="meta"><b>${inspoOpt}</b><p>${advice}</p></div></div>
    <h3>搭配推荐单品</h3>
    <div class="shop-grid">${SHOP['上装'].slice(0, 2).concat(SHOP['鞋履']).map(([n, p, d]) =>
      `<div class="item"><img loading="lazy" src="${IMG(p)}" alt="${n}"><div class="txt"><b>${n}</b><br>${d}</div></div>`).join('')}</div>`;
}
document.getElementById('inspoTabs').addEventListener('click', e => {
  const t = e.target.closest('.tab');
  if (!t) return;
  inspoTab = t.dataset.tab;
  inspoOpt = INSPO[inspoTab].opts[0];
  document.querySelectorAll('#inspoTabs .tab').forEach(x => x.classList.toggle('active', x === t));
  renderInspo();
});
document.getElementById('inspoPills').addEventListener('click', e => {
  const p = e.target.closest('.pill');
  if (!p) return;
  inspoOpt = p.textContent;
  renderInspo();
});
renderInspo();
