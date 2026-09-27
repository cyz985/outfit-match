/* 衣拍即合 · 第三版 —— 纯前端；图片与第二版（54 款）同款生成方式：动态生成接口，清晰度一致 */
/* 图片加载失败时显示「素材待上传」占位文字，仅尝试一次，无无限加载 */
const IMG = (p, s) => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(p)}&image_size=${s || 'square'}`;
const pendSvg = name => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#f0fdf4"/><text x="300" y="296" fill="#15803d" font-size="30" text-anchor="middle" font-family="sans-serif" font-weight="600">素材待上传</text><text x="300" y="340" fill="#9ca3af" font-size="20" text-anchor="middle" font-family="sans-serif">${name || ''}</text></svg>`);
window.__pend = img => { img.onerror = null; img.src = pendSvg(img.alt); };

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

/* ---------- 服装库图片（与第二版同款：名称 + 品类描述词，动态生成） ---------- */
const LIB_VIS = {
  '鞋履':'一双鞋履产品摄影，浅灰纯色背景，真实材质质感，高清，无人物',
  '包包':'包包产品摄影，浅灰纯色背景，真实材质纹理，高清，无人物',
  '帽子':'帽子产品摄影，浅灰纯色背景，真实材质，高清，无人物',
  '围巾丝巾':'丝巾围巾产品摄影，浅灰纯色背景，丝滑垂坠质感，高清，无人物',
  '腰带袜子':'腰带袜子产品摄影，浅灰纯色背景，高清，无人物',
  '首饰':'首饰产品摄影，浅灰纯色背景，真实金属光泽，高清，无人物',
  '民族服饰':'中国少数民族传统服饰平铺展示，刺绣银饰细节，浅灰纯色背景，真实摄影，高清，无人物',
  '国内小众':'汉服平铺产品摄影，传统织锦刺绣面料，浅灰纯色背景，真实褶皱质感，高清，无人物',
  '国外特色':'外国传统服饰平铺产品摄影，浅灰纯色背景，真实面料纹理，高清，无人物',
};
const libImg = it => IMG(it[0] + '，' + (LIB_VIS[it[1]] || '服装平铺产品摄影，浅灰纯色背景，真实面料褶皱质感，高清，无人物'));

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
  `<div class="thumb"><img loading="lazy" src="${IMG(p)}" onerror="__pend(this)" alt="${name}"><div class="cap">${name}</div></div>`).join('');

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
  `<div class="case-card"><img loading="lazy" src="${IMG(p, 'portrait_4_3')}" onerror="__pend(this)" alt="${t}"><div class="body"><b>${t}</b><p>${d}</p></div></div>`).join('');

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
        `<div class="item"><img loading="lazy" src="${IMG(p)}" onerror="__pend(this)" alt="${n}"><div class="txt"><b>${n}</b><br>${d}</div></div>`).join('') + '</div>';
    return;
  }
  const [advice, prompt] = INSPO[inspoTab].gen(inspoOpt);
  res.innerHTML = `
    <div class="card"><img loading="lazy" src="${IMG(prompt, 'portrait_4_3')}" onerror="__pend(this)" alt="${inspoOpt}穿搭效果图">
      <div class="meta"><b>${inspoOpt}</b><p>${advice}</p></div></div>
    <h3>搭配推荐单品</h3>
    <div class="shop-grid">${SHOP['上装'].slice(0, 2).concat(SHOP['鞋履']).map(([n, p, d]) =>
      `<div class="item"><img loading="lazy" src="${IMG(p)}" onerror="__pend(this)" alt="${n}"><div class="txt"><b>${n}</b><br>${d}</div></div>`).join('')}</div>`;
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

/* ================= 服装库（76 款真实单品） ================= */
// 行结构：[名称, 品类, 面料材质, 搭配建议, 文化背景?, 关键词?]
const LIB_ITEMS = [
  ['短袖T恤','上衣','纯棉针织，柔软透气','配牛仔裤与小白鞋，经典不出错'],
  ['长袖T恤','上衣','纯棉/莫代尔，亲肤有弹性','作内搭配马甲、风衣，或单穿配直筒裤'],
  ['针织衫','上衣','羊毛混纺针织，细腻保暖','配半裙乐福鞋，温柔通勤'],
  ['毛衣','上衣','粗针织羊毛，蓬松保暖','配阔腿裤短靴，冬日有层次'],
  ['衬衫','上衣','精梳棉/天丝，挺括垂顺','配西装裤通勤，或敞开当薄外套'],
  ['吊带背心','上衣','棉混/真丝，贴身顺滑','单穿配高腰裤，或内搭西装'],
  ['连帽卫衣','上衣','加绒棉质针织，宽松舒适','配工装裤运动鞋，街头休闲'],
  ['牛仔外套','外套','重磅牛仔布，硬挺有型','配连衣裙或T恤牛仔裤，复古百搭'],
  ['西装外套','外套','聚酯混纺精纺，垂坠挺括','配衬衫西装裤，也可搭卫衣休闲化'],
  ['风衣','外套','棉嘎巴甸，防风有骨架','内搭针织衫直筒裤，利落通勤'],
  ['毛呢大衣','外套','羊毛混纺呢料，厚实保暖','配高领毛衣与直筒裤，冬日气场'],
  ['羽绒服','外套','高蓬羽绒+防泼水面料','配卫衣运动裤，轻便保暖'],
  ['皮夹克','外套','头层牛皮/仿皮，硬朗有光泽','配碎花裙或白T牛仔裤，甜酷平衡'],
  ['马甲','外套','针织/羽绒填充，无袖叠穿利器','叠在衬衫或卫衣外增加层次'],
  ['棒球服','外套','毛呢拼PU袖，学院运动感','配束脚裤与棒球帽，街头减龄'],
  ['阔腿裤','裤装','垂坠西装料，宽松显高','配短上衣或衬衫塞腰，显腿长'],
  ['直筒牛仔裤','裤装','重磅牛仔，微弹修饰腿型','配T恤或衬衫与小白鞋'],
  ['西装裤','裤装','垂感精纺，挺括显瘦','配衬衫西装，通勤首选'],
  ['运动裤','裤装','棉质针织，束脚舒适','配卫衣运动鞋，休闲运动'],
  ['紧身牛仔裤','裤装','弹力牛仔，贴合腿型','配宽松卫衣或长靴，松紧平衡'],
  ['工装裤','裤装','斜纹棉，多口袋挺括','配短上衣马丁靴，街头机能'],
  ['短裤','裤装','棉/牛仔，清凉利落','配T恤或长袜帆布鞋，夏日休闲'],
  ['半身长裙','半裙','雪纺/针织，垂坠飘逸','配短款针织衫与乐福鞋'],
  ['半身短裙','半裙','斜纹/牛仔，活泼显腿长','配卫衣或衬衫，减龄学院'],
  ['A字裙','半裙','西装料，上窄下宽遮胯','配衬衫或针织衫，通勤约会'],
  ['百褶裙','半裙','TR/针织，压褶垂顺','配针织开衫乐福鞋，学院风'],
  ['包臀裙','半裙','针织弹力，贴合曲线','配宽松衬衫或西装，轻熟风'],
  ['碎花连衣裙','连衣裙','雪纺/棉，轻盈浪漫','单穿配帆布鞋，外搭牛仔外套'],
  ['衬衫裙','连衣裙','棉质府绸，直筒利落','配腰带乐福鞋，可盐可甜'],
  ['吊带裙','连衣裙','缎面/雪纺，柔媚垂顺','单穿配凉鞋，或叠穿T恤'],
  ['运动连衣裙','连衣裙','速干针织，轻盈好活动','配运动鞋棒球帽，元气减龄'],
  ['针织连衣裙','连衣裙','包芯纱针织，贴身保暖','配大衣长靴，温柔冬日'],
  ['乐福鞋','鞋履','牛皮/PU，低跟好穿','配半裙、西装裤皆可'],
  ['小白鞋','鞋履','帆布/牛皮，平底百搭','与一切休闲装匹配'],
  ['帆布鞋','鞋履','硫化帆布，轻便耐穿','配牛仔裤或连衣裙'],
  ['马丁靴','鞋履','牛皮硬挺，8孔系带','配工装裤或碎花裙，酷感'],
  ['高跟鞋','鞋履','羊皮/漆皮，尖头细跟','配包臀裙或西装裤，气场'],
  ['运动鞋','鞋履','网面+缓震底，舒适','配运动套装或牛仔裤'],
  ['帆布包','包包','重磅帆布，轻便能装','日常上课首选，配休闲装'],
  ['托特包','包包','帆布/牛皮，硬挺大容量','通勤装电脑，简约大气'],
  ['腋下包','包包','牛皮/PU，小巧精致','配连衣裙或西装，法式'],
  ['斜挎包','包包','尼龙/牛皮，轻便解放双手','出行逛街，休闲百搭'],
  ['棒球帽','帽子','棉布，可调节帽围','配卫衣运动装，遮阳减龄'],
  ['贝雷帽','帽子','羊毛呢，复古画家感','配针织衫大衣，复古造型'],
  ['毛线帽','帽子','针织毛线，保暖包裹','配羽绒服毛衣，冬日必备'],
  ['丝巾','围巾丝巾','真丝缎面，丝滑有光泽','系颈间或绑包柄，点亮造型'],
  ['围巾','围巾丝巾','羊毛/羊绒，柔软保暖','配大衣风衣，温柔有层次'],
  ['腰带','腰带袜子','牛皮/帆布，经典针扣','强调腰线，配西装裤或裙装'],
  ['长袜','腰带袜子','精梳棉，弹力长筒','配短裤短裙帆布鞋，学院'],
  ['堆堆袜','腰带袜子','棉质针织，松软堆叠','配乐福鞋或马丁靴，日系'],
  ['项链','首饰','925银/镀金，纤细百搭','配V领或圆领，修饰颈线'],
  ['耳饰','首饰','银针防敏，轻盈款','与项链成套更精致'],
  ['手链','首饰','银/金细链，简约不抢眼','与手表叠戴或单独佩戴'],
  ['戒指','首饰','开口可调节，极简设计','日常通勤佩戴或多只叠戴'],

  /* ===== 民族服饰（8 款） ===== */
  ['苗族盛装','民族服饰','苗锦刺绣缎面衣+银冠银项圈银饰，华丽隆重','配银角头饰与百鸟裙，节庆盛装出行','苗族节庆盛装，以银角银冠、蜡染刺绣闻名天下','苗族 银饰 刺绣 民族 盛装 贵州 传统'],
  ['侗族服饰','民族服饰','蛋清捶打亮布，紫黑发亮，侗绣几何纹样','配侗锦围腰与银项圈，节庆盛装','侗族亮布经蓝靛染与蛋清捶打，光可鉴人','侗族 亮布 侗锦 民族 贵州 传统'],
  ['彝族火把节服饰','民族服饰','红黄黑三色绣花衣+羊毛披毡，色彩浓烈','配英雄结与察尔瓦披风，火把节盛装','彝族以火把节闻名，三色文化承载祖先崇拜','彝族 火把节 披毡 察尔瓦 民族 传统'],
  ['藏族藏袍','民族服饰','氆氇毛呢+绸缎滚边羊皮镶边，保暖挺括','单袖系腰配邦典围裙与藏靴','高原昼夜温差大，脱一袖散热是藏袍经典穿法','藏族 藏袍 氆氇 邦典 高原 民族 传统'],
  ['维吾尔族艾德莱斯裙','民族服饰','艾德莱斯绸扎经染色，纹样绚丽如云','配小花帽与长辫纱巾，舞会节庆','"艾德莱斯"意为扎染的丝，天山南麓传承千年','维吾尔族 艾德莱斯 新疆 丝绸 民族 传统'],
  ['白族扎染服饰','民族服饰','植物蓝染扎染棉布，白底青花素雅','配扎染头巾与围腰，民族旅拍','大理周城扎染以板蓝根染制，国家级非遗','白族 扎染 蓝染 大理 民族 传统'],
  ['羌族刺绣服饰','民族服饰','麻布/棉布挑花刺绣，几何纹样古朴','配绣花围腰与云云鞋，民俗展演','羌绣挑花以黑白为底彩线点缀，古羌文化活化石','羌族 羌绣 挑花 民族 传统'],
  ['哈尼族服饰','民族服饰','靛蓝土布+银泡装饰与彩色绣片','配银泡胸饰与头饰，梯田风情','哈尼族梯田农耕文化，银泡象征星辰','哈尼族 银泡 靛蓝 民族 云南 传统'],

  /* ===== 国内小众服饰（7 款） ===== */
  ['新中式宋制汉服','国内小众','宋锦/天丝提花，对襟长衫配百迭裙','配发簪与玛瑙扣，通勤约会皆宜','宋制汉服对襟雅致，新中式改良后适合日常','汉服 宋制 新中式 百迭裙 对襟 小众 传统'],
  ['明制短袄','国内小众','提花绸缎琵琶袖短袄，织金纹样','配马面裙或比甲，端庄喜庆','明制袄裙端庄大气，琵琶袖收纳巧思','汉服 明制 短袄 琵琶袖 织金 小众 传统'],
  ['马面裙','国内小众','织金锦/醋酸缎，四裙门两侧打褶','配衬衫毛衣，新中式日常','明清标志性裙装，马面结构名扬海外','汉服 马面裙 织金 明制 新中式 小众 传统'],
  ['汉元素改良褙子','国内小众','雪纺/天丝直领对襟开衫，轻薄垂顺','外搭吊带连衣裙或T恤，轻汉风','褙子源于宋代，改良后成为日常外搭','汉服 褙子 汉元素 开衫 宋制 小众'],
  ['香云纱上衣','国内小众','香云纱（莨纱），乌黑发亮凉爽挺括','配阔腿裤或半裙，岭南雅致','香云纱为岭南晒莨非遗面料，越穿越润','香云纱 莨纱 新中式 岭南 非遗 小众'],
  ['盘扣禅意套装','国内小众','棉麻提花手工盘扣，素色宽剪裁','成套穿着配布鞋，茶室禅意','一粒盘扣需缠布数十道，东方含蓄美学','盘扣 禅意 棉麻 套装 中式 小众'],
  ['畲族凤凰装','国内小众','靛蓝苎麻布+凤凰冠银饰彩带刺绣','配凤凰头饰与围腰，民俗节庆','畲族自称凤凰后裔，凤凰装寓意吉祥','畲族 凤凰装 苎麻 民族 小众 传统'],

  /* ===== 国外特色服饰（7 款） ===== */
  ['韩服Hanbok','国外特色','轻薄绸缎短衣赤古里+高腰蓬裙','配绣花鞋与发带，韩屋旅拍','朝鲜半岛传统服饰，曲线与直线之美','韩服 hanbok 韩国 传统 异域 赤古里'],
  ['日本振袖','国外特色','正绢绘羽振袖，广袖及踝花纹华丽','配袋带与木屐，成人式礼装','振袖为未婚女性最高礼装，广袖起舞如蝶','和服 振袖 日本 kimono 传统 异域'],
  ['苏格兰格纹裙','国外特色','纯羊毛格纹呢（tartan）百褶kilt','配皮带毛皮袋与及膝袜','每个苏格兰氏族都有专属格纹注册在案','苏格兰 格纹 kilt 英伦 传统 异域'],
  ['印度纱丽Sari','国外特色','真丝/雪纺数米长幅，金线镶边绣花','配衬裙短上衣与额饰手镯','纱丽是印度女性数千年不变的缠裹艺术','纱丽 sari 印度 传统 异域 丝绸'],
  ['越南奥黛','国外特色','轻薄绸缎修身长衫，侧开叉配阔腿长裤','配斗笠与长裤，温婉修长','奥黛为越南国服，开叉长衫飘逸如仙','奥黛 aodai 越南 传统 异域 长衫'],
  ['墨西哥刺绣裙','国外特色','棉布满绣花卉，五彩绣线浓烈','配编织凉帽与大耳环，度假风','墨西哥手绣花卉裙承载原住民图腾','墨西哥 刺绣 绣花裙 度假 传统 异域'],
  ['希腊传统长裙','国外特色','白色棉麻垂坠长裙，金线滚边褶饰','配金叶发饰与凉鞋，海岛旅拍','源自古希腊Chiton褶袍，爱琴海白蓝美学','希腊 长裙 地中海 传统 chiton 异域'],
];
const LIB_DETAIL = {
  care: {
    '上衣':'30℃以下轻柔机洗或手洗，深浅分开，平铺晾干避免暴晒。',
    '外套':'建议干洗或轻柔洗涤；毛呢、皮革请干洗，收纳前清洁并用防尘袋。',
    '裤装':'反面冷水洗涤减少掉色，少用柔顺剂，悬挂或平铺晾干。',
    '半裙':'轻柔手洗或装洗衣袋机洗，避免拧绞，悬挂晾干。',
    '连衣裙':'轻柔洗涤，易变形款平铺晾干，深浅分开。',
    '鞋履':'避免长时间浸水，湿布擦拭后阴干，皮质需定期保养。',
    '包包':'湿布局部擦拭，避免暴晒重压，长期不用塞入填充物。',
    '帽子':'局部清洁，帽檐避免重压变形，通风阴干。',
    '围巾丝巾':'丝巾建议手洗或干洗、低温熨烫；针织围巾平铺晾干。',
    '腰带袜子':'袜子常规机洗；腰带湿布擦拭、避免弯折存放。',
    '首饰':'避免接触香水与汗液，摘下后软布擦拭，单独密封存放。',
    '民族服饰':'刺绣银饰款建议干洗或局部手洗，洗涤前取下可拆卸饰品。',
    '国内小众':'真丝/香云纱款建议干洗或冷水手洗，棉麻款轻柔机洗，平铺阴干避免暴晒。',
    '国外特色':'真丝款干洗或轻柔手洗，棉麻羊毛款按材质轻柔洗涤，低温熨烫。',
  },
  fit: {
    '上衣':'常规合身版型，肩线与袖长决定整体精神度。',
    '外套':'廓形略宽松，内搭毛衣也有空间，落肩设计更休闲。',
    '裤装':'中高腰直筒版型，修饰腿型，裤长以轻触鞋面为佳。',
    '半裙':'中高腰设计，裙型垂顺，长度建议膝盖附近或小腿中下段。',
    '连衣裙':'收腰/直筒版型，腰线位置决定显高效果。',
    '鞋履':'标准鞋楦，脚宽建议大半码，鞋底软硬适中久穿不累。',
    '包包':'结构挺括，容量分层实用，肩带可调节。',
    '帽子':'帽围可微调，帽檐宽度适中，修饰脸型。',
    '围巾丝巾':'尺寸适中易造型，轻薄保暖兼顾。',
    '腰带袜子':'腰带为常规孔位；袜子弹力大不勒脚。',
    '首饰':'常规链长，轻盈不挑人，敏感肌可选防敏材质。',
    '民族服饰':'传统宽松剪裁，配饰丰富，以腰带或披挂塑造造型。',
    '国内小众':'传统平面剪裁改良版型，宽松舒适，以腰带或层叠穿搭优化比例。',
    '国外特色':'各国传统版型，以缠裹、收腰或宽袍剪裁为主，氛围感强。',
  },
  scene: {
    '上衣':'日常上课、通勤、约会、居家。','外套':'通勤、出行、约会、户外活动。',
    '裤装':'日常、通勤、出行、运动。','半裙':'约会、聚会、上课、通勤。',
    '连衣裙':'约会、聚会、度假、通勤。','鞋履':'通勤、上课、约会、出行。',
    '包包':'上课、通勤、逛街、短途出行。','帽子':'出行、逛街、运动、度假。',
    '围巾丝巾':'通勤、出行、办公室空调房、造型点缀。','腰带袜子':'日常、运动、通勤、造型叠穿。',
    '首饰':'约会、聚会、通勤、节日礼物。',
    '民族服饰':'民族节庆、文化活动、旅拍写真、表演。',
    '国内小众':'日常通勤、新中式约会、茶室雅集、国风拍摄。',
    '国外特色':'文化主题活动、旅拍写真、节日庆典、主题聚会。',
  },
};
let libFilter = '全部';
let libQuery = '';
const libFiltersEl = document.getElementById('libFilters');
libFiltersEl.innerHTML = ['全部', ...new Set(LIB_ITEMS.map(i => i[1]))]
  .map(c => `<button class="pill ${c === '全部' ? 'active' : ''}">${c}</button>`).join('');

function renderLib() {
  let list = libFilter === '全部' ? LIB_ITEMS : LIB_ITEMS.filter(i => i[1] === libFilter);
  if (libQuery) {
    list = list.filter(it =>
      (it[0] + ',' + it[1] + ',' + it[2] + ',' + (it[3] || '') + ',' + (it[5] || '')).toLowerCase().includes(libQuery));
  }
  const meta = document.getElementById('libSearchMeta');
  if (libQuery) { meta.textContent = `找到 ${list.length} 款相关服饰`; meta.classList.remove('hidden'); }
  else meta.classList.add('hidden');
  document.getElementById('libGrid').innerHTML = list.length ? list.map(it => `
    <div class="lib-card" data-idx="${LIB_ITEMS.indexOf(it)}">
      <img loading="lazy" src="${libImg(it)}" onerror="__pend(this)" alt="${it[0]}">
      <div class="t"><b>${it[0]}</b><span>${it[1]}</span></div>
    </div>`).join('')
    : '<div class="no-match">暂未找到对应服饰，试试其他关键词</div>';
}
libFiltersEl.addEventListener('click', e => {
  const p = e.target.closest('.pill');
  if (!p) return;
  libFilter = p.textContent;
  renderLib();
});
document.getElementById('libSearchInput').addEventListener('input', e => {
  libQuery = e.target.value.trim().toLowerCase();
  renderLib();
});
renderLib();

/* 详情弹窗 */
const modal = document.getElementById('itemModal');
document.getElementById('libGrid').addEventListener('click', e => {
  const card = e.target.closest('.lib-card');
  if (!card) return;
  const it = LIB_ITEMS[+card.dataset.idx];
  const [name, cat, fabric, pair, culture] = it;
  document.getElementById('modalBody').innerHTML = `
    <img src="${libImg(it)}" onerror="__pend(this)" alt="${name}">
    <h3>${name}</h3><div class="cat-tag">${cat}</div>
    <dl>
      <dt>面料材质</dt><dd>${fabric}</dd>
      <dt>清洗保养</dt><dd>${LIB_DETAIL.care[cat] || '按面料标签指示轻柔洗涤。'}</dd>
      <dt>版型特点</dt><dd>${LIB_DETAIL.fit[cat] || '常规版型，宽松舒适。'}</dd>
      <dt>适用场景</dt><dd>${LIB_DETAIL.scene[cat] || '日常通勤、约会、出行。'}</dd>
      ${culture ? `<dt>文化背景</dt><dd>${culture}</dd>` : ''}
      <dt>搭配建议</dt><dd>${pair}</dd>
    </dl>`;
  modal.classList.remove('hidden');
  addRecord('browse', name, null, libImg(it));
});
const closeModal = () => modal.classList.add('hidden');
document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ================= 本地抠图（边缘连通去背景） ================= */
function cutout(img) {
  const maxD = 620;
  const sc = Math.min(1, maxD / Math.max(img.width, img.height));
  const w = Math.max(2, Math.round(img.width * sc)), h = Math.max(2, Math.round(img.height * sc));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h), d = imgData.data, N = w * h;

  let r = 0, g = 0, b = 0;
  const samples = [];
  const add = (x, y) => { const i = (y * w + x) * 4; samples.push([d[i], d[i + 1], d[i + 2]]); };
  for (let x = 0; x < w; x += 3) { add(x, 0); add(x, h - 1); }
  for (let y = 0; y < h; y += 3) { add(0, y); add(w - 1, y); }
  samples.forEach(p => { r += p[0]; g += p[1]; b += p[2]; });
  r /= samples.length; g /= samples.length; b /= samples.length;
  let spread = 0;
  samples.forEach(p => spread += Math.abs(p[0] - r) + Math.abs(p[1] - g) + Math.abs(p[2] - b));
  spread /= samples.length;
  const T = Math.max(26, Math.min(85, spread * 1.6 + 20));
  const dist = i => Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b);

  const bg = new Uint8Array(N);
  const stack = [];
  const seed = (x, y) => { const idx = y * w + x; if (!bg[idx] && dist(idx * 4) <= T * 1.2) { bg[idx] = 1; stack.push(idx); } };
  for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
  for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
  while (stack.length) {
    const idx = stack.pop(), x = idx % w, y = (idx / w) | 0;
    const nb = [x > 0 ? idx - 1 : -1, x < w - 1 ? idx + 1 : -1, y > 0 ? idx - w : -1, y < h - 1 ? idx + w : -1];
    for (const j of nb) if (j >= 0 && !bg[j] && dist(j * 4) <= T) { bg[j] = 1; stack.push(j); }
  }
  for (let idx = 0; idx < N; idx++) if (bg[idx]) d[idx * 4 + 3] = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const idx = y * w + x;
    if (bg[idx]) continue;
    const nb = [x > 0 ? idx - 1 : -1, x < w - 1 ? idx + 1 : -1, y > 0 ? idx - w : -1, y < h - 1 ? idx + w : -1];
    let near = 0;
    for (const j of nb) if (j >= 0 && bg[j]) near++;
    if (near >= 2) d[idx * 4 + 3] = 110;
    else if (near) d[idx * 4 + 3] = 190;
  }
  ctx.putImageData(imgData, 0, 0);
  return c;
}

/* ================= 批量衣橱 ================= */
let myItems = [];   // {id,name,key,url}
let itemSeq = 0;
const myItemsEl = document.getElementById('myItems');

function renderMyItems() {
  myItemsEl.innerHTML = myItems.map(it => `
    <div class="mi">
      <button class="del" data-del="${it.id}">×</button>
      <img src="${it.url}" alt="${it.name}">
      <div class="t">${it.name}</div>
    </div>`).join('');
}
myItemsEl.addEventListener('click', e => {
  const b = e.target.closest('[data-del]');
  if (!b) return;
  const it = myItems.find(x => x.id === +b.dataset.del);
  if (it) URL.revokeObjectURL(it.url);
  myItems = myItems.filter(x => x.id !== +b.dataset.del);
  renderMyItems();
});

document.getElementById('batchInput').addEventListener('change', async e => {
  const files = [...e.target.files];
  const key = document.getElementById('batchCat').value;
  const label = document.getElementById('batchCat').selectedOptions[0].textContent;
  e.target.value = '';
  if (!files.length) return;
  const cuts = [];
  for (const f of files.slice(0, 12)) {
    const img = await loadImg(URL.createObjectURL(f));
    const cut = cutout(img);
    cuts.push(cut);
    const url = await new Promise(res => cut.toBlob(res, 'image/png'));
    myItems.push({ id: ++itemSeq, name: label + itemSeq, key, url: URL.createObjectURL(url) });
    renderMyItems();
  }
  // 上传记录：前 3 件拼一张缩略图
  const mc = document.createElement('canvas');
  mc.width = 210; mc.height = 70;
  const mctx = mc.getContext('2d');
  cuts.slice(0, 3).forEach((cv, i) => mctx.drawImage(cv, i * 70, 0, 70, 70));
  addRecord('upload', `批量上传 ${files.length > 12 ? 12 : files.length} 件单品（${label}）`, mc.toDataURL('image/jpeg', .8));
});

/* ================= 智能搭配组合 ================= */
const MATCH_SLOTS = { // x,y,w,h,rot
  outer:  [.15, .03, .70, .40, -2],
  dress:  [.25, .04, .50, .66, 1],
  top:    [.27, .10, .46, .30, 2],
  bottom: [.26, .36, .48, .42, -1.5],
  scarf:  [.30, .07, .40, .13, 2],
  socks:  [.22, .72, .17, .09, 0],
  shoes:  [.29, .78, .42, .17, 2],
  bag:    [.03, .50, .25, .24, -6],
  hat:    [.72, .05, .25, .20, -3],
  jewel:  [.71, .42, .24, .13, 4],
};
const MATCH_ORDER = ['outer', 'dress', 'bottom', 'top', 'scarf', 'socks', 'shoes', 'bag', 'hat', 'jewel'];
const imgCache = new Map();
async function cachedImg(url) {
  if (!imgCache.has(url)) imgCache.set(url, await loadImg(url));
  return imgCache.get(url);
}

function buildCombos(g) {
  const pick1 = k => g[k][Math.floor(Math.random() * g[k].length)];
  let core = null;
  if (g.dress && g.shoes) core = ['dress', 'shoes'];
  else if (g.top && g.bottom && g.shoes) core = ['top', 'bottom', 'shoes'];
  else if (g.top && g.bottom) core = ['top', 'bottom'];
  else if (g.dress) core = ['dress'];
  if (!core) return [];
  const extras = ['outer', 'bag', 'hat', 'scarf', 'jewel', 'socks'].filter(k => g[k]);
  const plans = extras.length ? [[extras[0]], extras.slice(0, 2), extras.slice(0, 3)] : [[]];
  const combos = [], usedSig = new Set();
  plans.forEach(extraKeys => {
    for (let a = 0; a < 8; a++) {
      const sel = {};
      core.forEach(k => sel[k] = pick1(k));
      extraKeys.forEach(k => sel[k] = pick1(k));
      const sig = Object.values(sel).map(x => x.id).join(',');
      if (usedSig.has(sig)) continue;
      usedSig.add(sig);
      const tags = [];
      if (sel.outer) tags.push('层次感丰富');
      if (sel.jewel || sel.scarf) tags.push('配饰点睛');
      if (sel.hat) tags.push('休闲减龄');
      const pool = ['色彩和谐，整体协调', '通勤风格，利落大方', '适合周末出行', '简约不费力', '日常上课首选'];
      tags.push(pool[Math.floor(Math.random() * pool.length)]);
      combos.push({ sel, reason: [...new Set(tags)].slice(0, 2).join(' · ') });
      break;
    }
  });
  return combos.slice(0, 3);
}

async function renderCombo(combo) {
  const W = 750, H = 980;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#efe9df'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0,0,0,.03)';
  for (let i = 0; i < H; i += 3) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

  for (const key of MATCH_ORDER) {
    const it = combo.sel[key];
    if (!it) continue;
    const img = await cachedImg(it.url);
    let [x, y, w, h, rot] = MATCH_SLOTS[key];
    rot += (Math.random() - .5) * 3;
    const dx = x * W, dy = y * H, dw = w * W, dh = h * H;
    ctx.save();
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.rotate(rot * Math.PI / 180);
    ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
    const s = Math.min(dw / img.width, dh / img.height);
    const iw = img.width * s, ih = img.height * s;
    ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();
  }
  return c;
}

document.getElementById('btnMatch').addEventListener('click', async () => {
  if (myItems.length < 2) { alert('请先批量上传至少 2 件单品'); return; }
  const loading = document.getElementById('matchLoading');
  const grid = document.getElementById('matchGrid');
  loading.classList.remove('hidden');
  grid.innerHTML = '';
  await new Promise(r => setTimeout(r, 60));
  const groups = {};
  myItems.forEach(it => (groups[it.key] = groups[it.key] || []).push(it));
  const combos = buildCombos(groups);
  const cards = [];
  for (const combo of combos) {
    const canvas = await renderCombo(combo);
    const url = canvas.toDataURL('image/png');
    const tc = document.createElement('canvas');
    tc.width = 300; tc.height = 392;
    tc.getContext('2d').drawImage(canvas, 0, 0, 300, 392);
    addRecord('outfit', combo.reason, tc.toDataURL('image/jpeg', .8));
    cards.push({ url, combo });
  }
  grid.innerHTML = cards.map(({ url, combo }) => `
    <div class="match-card">
      <img src="${url}" alt="智能搭配效果图">
      <div class="b">
        <div class="reason">${combo.reason}</div>
        <div class="mini-tags">${Object.values(combo.sel).map(x => `<span>${x.name}</span>`).join('')}</div>
      </div>
    </div>`).join('');
  loading.classList.add('hidden');
});

/* ================= 使用记录（localStorage） ================= */
const REC_KEY = 'ypjh_records_v1';
function getRecords() { try { return JSON.parse(localStorage.getItem(REC_KEY)) || []; } catch (e) { return []; } }
function saveRecords(r) {
  try { localStorage.setItem(REC_KEY, JSON.stringify(r.slice(0, 60))); }
  catch (e) { alert('本地存储空间不足，旧记录将被清理'); localStorage.setItem(REC_KEY, JSON.stringify(r.slice(0, 20))); }
}
function addRecord(kind, text, img, remoteUrl) {
  const r = getRecords();
  if (kind === 'browse' && r[0] && r[0].kind === 'browse' && r[0].text === text) return;
  r.unshift({ id: Date.now() + '' + Math.random().toString(36).slice(2, 6), t: Date.now(), kind, text, img: img || '', remoteUrl: remoteUrl || '' });
  saveRecords(r);
}
const REC_KIND_LABEL = { upload: '衣橱上传', outfit: 'AI 搭配', browse: '浏览单品' };
function renderRecords() {
  const r = getRecords();
  const el = document.getElementById('recordList');
  if (!r.length) { el.innerHTML = '<div class="empty-tip">还没有使用记录，去上传衣物或逛逛服装库吧</div>'; return; }
  el.innerHTML = r.map(x => {
    const thumb = x.img || x.remoteUrl || '';
    const text = x.kind === 'outfit' ? `生成搭配方案：${x.text}` : x.kind === 'upload' ? x.text : `浏览服装库单品：${x.text}`;
    return `
      <div class="record-card">
        ${thumb ? `<img loading="lazy" src="${thumb}" onerror="this.style.display='none'" alt="${x.text}">` : ''}
        <div class="info">
          <div class="line"><span class="kind">${REC_KIND_LABEL[x.kind]}</span>${text}</div>
          <div class="time">${new Date(x.t).toLocaleString('zh-CN', { hour12: false })}</div>
        </div>
        <button class="del" data-rec-del="${x.id}">删除</button>
      </div>`;
  }).join('');
}
document.getElementById('recordList').addEventListener('click', e => {
  const b = e.target.closest('[data-rec-del]');
  if (!b) return;
  saveRecords(getRecords().filter(x => x.id !== b.dataset.rec_del));
  renderRecords();
});
document.getElementById('clearRecords').addEventListener('click', () => {
  if (confirm('确定清空全部使用记录吗？此操作不可恢复')) {
    localStorage.removeItem(REC_KEY);
    renderRecords();
  }
});
document.querySelector('[data-go="records"]').addEventListener('click', renderRecords);
renderRecords();
