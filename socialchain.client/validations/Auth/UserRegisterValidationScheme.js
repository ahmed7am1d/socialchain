import { YinYang } from "phosphor-react";
import * as yup from "yup";

const schema = yup.object().shape({
    userName : yup.string().required("User name is a required field"),
})

const UserRegisterValidationScheme = () => {
    return schema;
}

export const yupSyncRegisterValidation = {
    async validator({field}, value) {
        await UserRegisterValidationScheme().validateSyncAt(field,{[field]:value});
    }
}


export default UserRegisterValidationScheme;