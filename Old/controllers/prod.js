const Prod = require('../models/prod');


exports.get_prod = (req,res,next) => {

    const prodlist = Prod.get_all();
    prodlist.then((result) => {
        
        res.render('prod', {
            prodlist: result.rows,
            pageTitle: 'All Products',
            path: '/prods',
            editing: false
        });    
        
    });

};

// exports.post_test = (req,res,next) => {
//     const title = req.body.title;
//     const image = req.body.image;
//     const price = req.body.price;
//     const quantity = req.body.quantity;
//     const product = new Prod( title, image, price,quantity);
//     product
//         .add_prod()
//         .then(() => {
//             res.redirect('/admin/add-product');
//         })
//         .catch(err => console.log(err));
// };