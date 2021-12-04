
const express = require('express')

const app=express()
const mongoose=require('mongoose')

app.use(express.json())

const connect=()=>{
   return  mongoose.connect('mongodb://127.0.0.1:27017/evalution')
}


const jobSchma= mongoose.Schema(
    {


skill:{type:String,required:true},
notice_period:{type:Number, required:true},
rating:{type:Number,required:true},

work_from_home:{type:Number,required:true},
city:{type:String,required:true},

},
{
    versionKey:false,
    timestamps:true
}

)

const Job=new mongoose.model('job',jobSchma)


const companySchema=mongoose.Schema(

    {   company_name:{type:String,required:true},

        job_ids:[{type:mongoose.Schema.Types.ObjectId,
            ref:"job",
            require:true}],

        employees:{type:Number,required:true}    
        
    },
        {
            versionKey:false,
            timestamps:true
        }



)


const Company=new mongoose.model('company',companySchema)






// get all jobs in a particular city which matches a particular skill



app.get('/jobs/:city/:skill',async (req,res)=>{

try{

    const jobs=await Job.find({city:req.params.city}).lean().exec()


    return res.status(201).send(jobs)
}

catch(e){


    return res.status(500).json({message:e.message,status:"Failed"})
}



})








// find all the jobs that are available as Work from home.
app.get('/jobs/:work_from_home',async (req,res)=>{

    try{
    
        const jobs=await Job.find({work_from_home:1}).lean().exec()
        
        return res.status(201).send(jobs)
    }
    
    catch(e){
    
    
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    
    
    })





// find all the jobs that will accept a notice period of 2 months.

app.get('/jobs/:notice_period',async (req,res)=>{

    try{
    
        const jobs=await Job.find({notice_period:1}).lean().exec()
       
        return res.status(201).send(jobs)
    
    }
    
    catch(e){
    
    
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    
    
    })



// find all jobs by sorting the jobs as per their rating.

app.get('/jobs/rating',async (req,res)=>{

    try{

        const jobs=await Job.find().lean().exec()
        const filteredjob=jobs.sort({rating:1})
        return res.status(201).send(filteredjob)
    
   
        
    
    }
    
    catch(e){
    
    
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    
    
    })




// an api to get details of the company.

app.get('/company/:id',async (req,res)=>{

    try{


        const company = await Company.findById(req.params.id).lean().exec()
    
        return res.send(company)
    
    }
    
    catch(e){
    
    
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    
    
    })

// find the company that has the most open jobs






app.listen('2000',async()=>{

    await connect()
    console.log("listening to port 2000")
})