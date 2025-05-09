import { generate } from "otp-generator";

export const otpGenerator = () => {
    return generate(5, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
};