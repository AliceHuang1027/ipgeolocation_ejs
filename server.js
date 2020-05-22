const express = require('express')
const app = express()

const fetch = require('node-fetch')
const port = process.env.PORT || 8900
app.use(express.static(__dirname+'/public'))
app.use(express.json({limit:'10mb'}))
app.options('/todolist/*', (req, res) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Credentials'
    )
    res.send('ok')
  })

const obj = []
const cobj = []


app.set('view engine','ejs')


app.get('/visitors',(req,res)=>{
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0]
    console.log(ip)    
    let cityDisplay = ''
    fetch(`https://js5.c0d3.com/location/api/ip/${ip}`).then(r=>r.json()).then(data=>{
    obj.forEach((e)=>{
    e.current =false
    })       
       if(!obj.find(e=>{
            return e.ip === ip
        })){
            obj.push({
                "ip":ip,
                "count":1,
                "ll":data.ll,
                "cityStr":data.cityStr,
  		        "current":true              
            })
        } 
        if(obj.find(e=>{
            return e.ip ===ip
        }))
            {obj.forEach((e)=>{
                if (e.ip === ip){
                    e.count +=1
		            e.current = true
                }

            })}
    // for the obj sent to the template 
            cityDisplay = data.cityStr   
   
    if(!cobj.find((e)=>{
        return e.city===data.cityStr
    })){
        cobj.push({
            "city":data.cityStr,
            "count":1
        })
    }
    if(cobj.find((e)=>{
        return e.city===data.cityStr
    })){
        cobj.forEach(m=>{
            if(m.city===data.cityStr){
                m.count+=1
            }
        })
    }
})


res.render('index.ejs',{
    "city": cityDisplay,
    "cobj": cobj
})
})

app.get('/api/visitors',(req,res)=>{
    res.json(obj)
})
app.listen(port,()=>{console.log(`listening on port ${port}`)})
