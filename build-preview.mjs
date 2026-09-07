import {readFileSync, writeFileSync} from 'fs';
const card = process.argv[2] || 'stephen-bni';
const out  = process.argv[3] || 'preview.html';
const css  = readFileSync('assets/app.css','utf8');
const js   = readFileSync('assets/app.js','utf8');
const data = readFileSync(card + '/data.js','utf8');
const html = `<title>Stephen Septian Bio GAINS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Limelight&display=swap" rel="stylesheet">
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
