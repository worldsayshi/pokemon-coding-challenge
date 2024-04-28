import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
@Injectable()
export class TextLength implements ValidatorConstraintInterface {

  validate(value: string, validationArguments: ValidationArguments) {
    let res = value.length >= validationArguments.constraints[0];
    console.log("value, value.length, res", value, value.length, res);
    return res;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return `Text needs to be at least ${validationArguments.constraints[0]} characters long!`;
  }
}
