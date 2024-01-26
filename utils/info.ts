import time from '~build/time';
import { isCI } from '~build/ci';
import { github, sha } from '~build/git';
import { name, version } from '~build/package';

const printBuildInfo = () => {
  console.group('Build Info');
  console.log('Project:', name);
  console.log('Build Time:', time ? time.toLocaleString() : 'Unknown');
  console.log('Environment:', `${process.env.NODE_ENV}${isCI ? '(ci)' : ''}`);
  console.log('Commit:', sha);
  console.log('Version:', version);
  console.log(`${name} is an open source project, you can view its source code on Github!`);
  console.log(github);
  console.groupEnd();
};

printBuildInfo();
