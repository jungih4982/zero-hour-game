import { runPrologueSimulation } from '../src/engine/simulation';

const result = runPrologueSimulation();

console.log('ZERO HOUR narrative simulation passed.');
console.log(JSON.stringify(result, null, 2));
