
const pool= require('../utils/database');
module.exports = class Cart{

    constructor(item_id){
        this.user_id = 1;
        this.item_id = item_id;
        this.quantity = 1;
    }

    get_quantity(){
        return pool.query('SELECT quantity FROM products WHERE id = $1;',[this.item_id]);   
    }

    decrease_quantity(){
        return pool.query('UPDATE products SET quantity = quantity-1 WHERE id = $1;',[this.item_id]);
    }

    add_to_cart(){
           return pool.query('SELECT COUNT(*) FROM cart WHERE item_id = $1 and user_id = $2;',[this.item_id, this.user_id])
                .then((result) => {
                    if(result.rows[0].count==='0'){
                        return pool.query('INSERT INTO cart(user_id, item_id, quantity) VALUES ($1, $2, $3);', [this.user_id, this.item_id, this.quantity]);
                    }else{
                        return pool.query('UPDATE cart SET quantity = quantity+1 WHERE user_id = $1 and item_id = $2;',[this.user_id, this.item_id]);
                    }
                });
    }

    static get_all(){
        return pool.query('SELECT user_id, item_id, cart.quantity AS quantity, title, image, price FROM cart JOIN products ON cart.item_id=products.id;');
    }

};