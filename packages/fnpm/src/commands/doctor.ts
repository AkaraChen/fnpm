import consola from 'consola';
import * as doctor from 'fnpm-doctor';
import type { CommandModule } from 'yargs';

class Doctor implements CommandModule {
    public command = 'doctor';
    public describe = 'diagnose common issues';
    public builder = {};

    public async handler() {
        const result = await doctor.scan(globalThis.ctx.root);
        if (result.diagnoses.length === 0) {
            consola.success('No issues found');
        } else {
            result.diagnoses.forEach(doctor.writeToConsole);
        }
    }
}

export default Doctor;
