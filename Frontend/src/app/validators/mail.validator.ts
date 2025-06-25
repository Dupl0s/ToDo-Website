import { AbstractControl} from "@angular/forms";

export function emailDomainValidator(control: AbstractControl) {
    const value = control.value;
    if (
        typeof value === 'string' &&
        /^[\w-.]+@([\w-]+\.)+(de|com|net|org|info|edu)$/.test(value)
    ) {
        return null; // gültig
    }
    return { emailDomain: true }; // ungültig
}