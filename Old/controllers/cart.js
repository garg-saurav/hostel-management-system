const Cart = require('../models/cart');


exports.get_cart = (req,res,next) => {

    const cartlist = Cart.get_all();
    cartlist
        .then((result) => {
        
        res.render('cart', {
            cartlist: result.rows,
            pageTitle: 'Cart',
            path: '/cart',
            editing: false
        });    
        
    });

};

exports.post_cart = (req,res,next) => {
    const prod_id = req.body.product_id;
    const cart_prod = new Cart(prod_id);
    cart_prod
        .get_quantity()
        .then((result) => {
            if(result.rows[0].quantity>'0'){
                cart_prod
                    .add_to_cart()
                    .then(() => {
                        cart_prod
                            .decrease_quantity()
                            .then((result) => {
                                console.log(result);
                                res.redirect('/cart');
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }else{
                res.redirect('/prods');
            }
        })
        .catch(err => console.log(err));
};