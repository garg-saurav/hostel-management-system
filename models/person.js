const pool= require('../utils/database');

module.exports = class Person{

    constructor(email){
        this.email = email;
    }

    async get_user(){
        return pool.query("SELECT person_id as id, name, email_id, TO_CHAR(dob, 'dd/mm/yyyy') as dob, phone_number, addr FROM person WHERE email_id=$1",[this.email]);
    }

};