import { FormGroup } from '@angular/forms';

export  const validators = {
/**verify if two fields match */
MustMatch:function (controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
  
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  },
  /**verify that the control have at least one id */
  haveRoles:function(controlName){
    return (formGroup:FormGroup) =>{
      const control = formGroup.controls[controlName];
      if(!control || (control && control.errors))
        return;
      if(!(control.value.indexOf(true) - -1))
        control.setErrors({ haveRoles: true });
      else
        control.setErrors(null);
    }
  }
}