import { FormGroup } from '@angular/forms';

export const confirmPasswordValidator = (controlName: string, controlNameToMatch: string) => {
  return (formGroup: FormGroup): void => {
    // Access the controls using their names
    const control = formGroup.get(controlName);
    const controlToMatch = formGroup.get(controlNameToMatch);

    // If either control does not exist, skip validation
    if (!control || !controlToMatch) {
      return;
    }

    // Check if there's already an error on the control to match
    if (controlToMatch.errors && !controlToMatch.errors['confirmPasswordValidator']) {
      return;
    }

    // If the values do not match, set an error on the control to match
    if (control.value !== controlToMatch.value) {
      controlToMatch.setErrors({ confirmPasswordValidator: true });
    } else {
      // If values match, clear the error
      controlToMatch.setErrors(null);
    }
  };
};
