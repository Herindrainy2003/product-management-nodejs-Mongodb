const express = require('express');
  const router =  express.Router();
 
  const  multer = require('multer') ;
  //const  fs = require('fs') 
  const products = require('../models/products') ;
  const   path  = require('path');
 

//pour stocker l'image
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    
    filename: function (req, file, callback) 
    { 
        // let extArray = file.mimetype.split("/");
        // let extension = extArray[extArray.length - 1];
        // callback(null,file.originalname + '-' + Date.now() + "." + extension);

        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        //callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single("image");




//routes pour ajouter de produits
router.post('/add' , upload, (req , res)=>{
    console.log(products)
    let  product = new products({
        name : req.body.name ,
        prices : req.body.prices,
        image : req.file.filename

    });
    product.save()
        .then(()=>{
            res.redirect('index')
        })
        
})

//routes vers ajouter produit
router.get('/add' , (req , res)=>{
    res.render('add_products' , {title : 'Ajouter produits'})
})


//routes vers modifier les prouits
router.get('/edit/:id' , (req, res)=>{
    let id = req.params.id;
    products.findById(id)
        .then((product)=>{
            res.render('edit_products' , {products : product , title : 'Mise a jour'})
        })
        .catch((err)=>{
            console.log(err)
        })
})


//routes pour faire l'update
router.post('/update/:id' , upload , (req , res)=>{
    let id = req.params.id ;
    let new_image = ''
    if(req.file){
         new_image = req.file.filename 
         try {
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    }else{
        new_image = req.body.old_image;
    }

 products.updateOne({_id:id} , {
    name : req.body.name,
    prices : req.body.prices ,
    image  : new_image 
 })

    .then(()=>{
        res.redirect('/index')
    })
    .catch((err)=>{
        console.log(err)
    })

    
})  

//routes pour deleter
router.get('/delete/:id' , (req , res)=>{
    let id = req.params.id 
    products.deleteOne({_id : id})
        .then(()=>{
            res.redirect('/index')
        })
})


//routes pour l'affichage
router.get('/index' , (req , res)=>{
    products.find()
        .then(products =>{
            req.session.message = {
                type: "success",
                message: "User added successfully"
            }
            res.render('index' , {products : products , title : 'Index'} )
        })

        .catch(err =>{console.log(err)})
})


//exporter le module
module.exports = router 