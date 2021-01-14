//Validation 

const Joi = require("@hapi/joi")

//Register validation 


const registerValidation=(body)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        password:Joi.string().required().min(6).max(1024),
        email:Joi.string().required().email()
    })
    return  schema.validate(body)
}


const loginValidation=(body)=>{
    const schema=Joi.object({
        password:Joi.string().required().min(6).max(1024),
        email:Joi.string().required().email()
    })
    return schema.validate(body);
}


module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation