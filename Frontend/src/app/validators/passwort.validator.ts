import { AbstractControl} from "@angular/forms";

export function passwordRegexValidator(control: AbstractControl) {
    const value = control.value;
    if (
        typeof value === 'string' &&
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]./.test(value)
    ) {
        return null; // gültig
    }
    return { passwordRegex: true }; // ungültig
}