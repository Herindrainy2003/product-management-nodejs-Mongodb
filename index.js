const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes/productRoutes'); //inclusion du routes
const app = new express()
const PORT = 8000
const session = require('express-session')


//connect mongodb 
mongoose.connect('mongodb+srv://votrenomuser:votremotdepasse@votredb.50wxxcf.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connexion à MongoDB réussie !')) //si le connexion a reussi
  .catch(() => console.log('Connexion à MongoDB échouée !'));//en cas d'erreur


//utilisation de body-parser pour recuperer les donnes du formulaires
app.use(express.urlencoded({extended:false}));
app.use(express.json());


//en attente
app.use(session({
    secret :'my secret key',
    saveUninitialized :true,
    resave:false
}));


app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//pour utiliser le views 
app.set("view engine", "ejs");


app.use(express.static('uploads'));

    //utilisation de routes
app.use('/' , routes)

//ecoutez le port 8000
app.listen(PORT , ()=>{
    console.log(`rendez-vous sur  ${PORT}`)
})
