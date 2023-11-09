import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";

mongoose.connect("mongodb://localhost:27017",{
    dbName:"Registration_Form"
})
.then(()=>{ console.log("Database connected"); })
.catch(()=>{ console.log(e); })

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    phone: Number,
    dob: Date,
    about: String,
    task: {
        type: String,
        maxlength:8
    },
    gender: {
        type: String,
        maxlength: 6
    },
    password: String
})

const User = mongoose.model("User",userSchema)

const app = express()


app.set('view engine', 'ejs')

// Using Middleware
// app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res)=>{

    const token = req.cookies.token;

    if(token){
        res.render("home")
    }
    else{
        res.render("index")
    }
})

app.get('/register',(req,res)=>{
    res.render("register");
})

app.post('/register',async (req,res)=>{

    const {name, email, phone, dob, about, task, gender, password} = req.body;

    const oneUser = await User.create({name, email, phone, dob, about, task, gender, password})

    res.cookie("token",oneUser._id)
    
    res.render("home",{name:oneUser.name});
})

app.get('/login',(req,res)=>{

    res.render("login");
    
})

app.post('/login', async(req,res)=>{
    const { email, password } = req.body;

    const oneUser = await User.findOne({email:email})
    
    if(oneUser){
        if(oneUser.password === password){
            res.cookie("token",oneUser._id)
            res.render("home",{name:oneUser.name})
        }
        else{
            res.render("login")
        }
    }
    else{
        res.render("login")
    }
})

app.get('/logout',(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.redirect("/register")
})

app.listen(8080,()=>{
    console.log("Server Running");
})