import consola from 'consola';
import * as doctor from 'fnpm-doctor';
import type { Argv } from 'yargs';
import type { BaseCommandOptions } from './base';
import { BaseCommand } from './base';

type DoctorCommandOptions = BaseCommandOptions;

class Doctor extends BaseCommand<DoctorCommandOptions> {
    public command = 'doctor';
    public describe = 'diagnose common issues';

    public builder(args: Argv): Argv<DoctorCommandOptions> {
        return args as Argv<DoctorCommandOptions>;
    }

    public async handler() {
        const result = await doctor.scan(this.ctx.root);
        if (result.diagnoses.length === 0) {
            consola.success('No issues found');
        } else {
            result.diagnoses.forEach(doctor.writeToConsole);
        }
    }
}

export default Doctor;
