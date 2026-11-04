const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const nodeCmd = 'node';

console.log('=====================================================');
console.log('🌟 Starting SkillBridge Full Stack Platform...');
console.log('=====================================================');

// 1. Start Server
const serverProcess = spawn(nodeCmd, ['src/server.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('[Server Error]', err);
});

// 2. Start Client
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

clientProcess.on('error', (err) => {
  console.error('[Client Error]', err);
});

// Clean termination on Ctrl+C
const cleanup = () => {
  console.log('\n🛑 Stopping SkillBridge servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
