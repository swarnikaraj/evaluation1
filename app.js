
const express = require('express')

const app=express()
const mongoose=require('mongoose')

app.use(express.json())

const connect=()=>{
   return  mongoose.connect('mongodb://127.0.0.1:27017')
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

    const jobs=await Job.find().lean().exec()

    const cityWiseJobs=jobs.filter((job)=>job.city==req.params.city)

    const cityAndSkillWiseJobs=cityWiseJobs.filter((jov)=>jov.skill==req.params.skill)

    return res.status(201).send(cityAndSkillWiseJobs)
}

catch(e){


    return res.status(500).json({message:e.message,status:"Failed"})
}



})








// find all the jobs that are available as Work from home.
app.get('/jobs/:work_from_home',async (req,res)=>{

    try{
    
        const jobs=await Job.find().lean().exec()
        const wfh_jobs=jobs.filter((job)=>{job.work_from_home==req.params.work_from_home})
        return res.status(201).send(wfh_jobs)
    }
    
    catch(e){
    
    
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    
    
    })





// find all the jobs that will accept a notice period of 2 months.

app.get('/jobs/:notice_period',async (req,res)=>{

    try{
    
        const jobs=await Job.find().lean().exec()
        const filteredjob=jobs.filter((job)=>{job.notice_period==req.params.notice_period})
        return res.status(201).send(filteredjob)
    
    }
    
    catch(e){
    
    
        return res.status(500).json({message:e.message,status:"Failed"})
    }
    
    
    
    })



// find all jobs by sorting the jobs as per their rating.

app.get('/jobs/rating',async (req,res)=>{

    try{

        const jobs=await Job.find().lean().exec()
        const filteredjob=jobs.sort(function(a,b){return a.rating-b.rating})
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