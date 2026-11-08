/* 运行时环境配置：与同目录 .env 保持一致。
   GitHub Pages 等纯静态托管无法直接读取 .env，因此由本文件把变量注入 window.__ENV__。
   若更换 Supabase 项目，请同时修改 .env 与本文件。 */
window.__ENV__ = {
  VITE_SUPABASE_URL: 'https://zpfiypggsofgnnazalrq.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'sb_publishable_uxRTPI2M6Q-7KAxDMvnJZw_AbEwdvjK'
};
