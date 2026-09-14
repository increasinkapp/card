import {readFileSync, writeFileSync} from 'fs';
const card = process.argv[2] || 'stephen-bni';
const out  = process.argv[3] || 'preview.html';
const css  = readFileSync('assets/app.css','utf8');
const js   = readFileSync('assets/app.js','utf8');
const data = readFileSync(card + '/data.js','utf8').replace(/"img\//g, `"${card}/img/`);
const html = `<title>Stephen Septian Bio GAINS</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<style>
${css}
</style>
<div id="app"></div>
<script>
${data}
</script>
<script>
${js}
</script>
`;
writeFileSync(out, html);
console.log('wrote', out, html.length, 'bytes');
