const express=require("express");
const app=express();
let server=require("./server");
let middleware=require("./middleware");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';
let db
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log('Connected:${url}');
});

//HOSPITAL DETAILS
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Fetching data from Hospital collection");
    var data=db.collection('hospital').find().toArray().then(result=>res.json(result));
});



//VENTILATOR DETAILS
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("Ventilators Information");
    var ventilatordetails=db.collection('ventilator')
    .find().toArray().then(result=>res.json(result));
});


//SEARCH VENTILATORS BY STATUS
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilator')
    .find({"status":status}).toArray().then(result=>res.json(result));
});


//SEARCH VENTILATORS BY HOSPITAL NAME
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilator')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});


//SEARCH HOSPITAL BY NAME
app.post('/searchhospital', middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('hospital').find({name:name}).toArray().then(result=>res.json(result));
});

//UPDATE VENTILATOR DETAILS
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection("ventilator").updateOne(ventid,newvalues,function(err,result){
        res.json('1 document updated');
        if(err) throw err;
    });
});


//ADD VENTILATOR
app.post('/addventilator',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;

    var item=
    {
        hId:hId,ventilatorId:ventilatorId,status:status,name:name
    };
    db.collection('ventilator').insertOne(item,function(err,result){
        res.json('Item inserted');
    });
});


//DELETE VENTILATOR BY VENT-ID
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorId;
    console.log(myquery);
    
    var myquery1={ventilatorId:myquery};
    db.collection('ventilator').deleteOne(myquery1,function(err,obj)
    {
        if(err) throw err;
        res.json("1 document deleted");
    });
});

app.listen(1100);