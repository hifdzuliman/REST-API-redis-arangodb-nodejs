
const {db, aql} = require('./db');
const redis = require('redis');
const client = redis.createClient(`redis://localhost:6379`);
const fetch = require('node-fetch');
require('dotenv').config()

// const banner = mongoose.model('banner', model.banner,'banner');
const getBanner = async (req,res) => {
    const redisKey = req.params.id;
    client.get(redisKey,async (err,data) => {
        if(data){// cek apakah ada di redis atau tidak
            console.log({data})
            res.status(200).send({isCached:true,data:JSON.parse(data)});
        }else{
            await db.collection("user").document(req.params.id)
            .then((response) => {
                client.set(redisKey,JSON.stringify(response),'EX',60); // simpan hasil query ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)
                res.status(200).send({data:response}); 
            })
            .catch((e) => {
                res.status(400).send({message: e.message});
            })
            // banner.find({},(err,fetchData)=>{
            //     client.set(redisKey,JSON.stringify(fetchData),'EX',60); // simpan hasil query ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)
            //     res.status(200).send({data:fetchData}); 
            // }); // fetch data dari mongoDB
        }
    });
}
const postBanner = async (req,res) => {
    let body = req.body
   let response = await db.collection("user").save(body);
   res.status(200).send(response);
}
const getIPInfo =  async (req,res) => {
    const redisKey = 'keyip:'+req.ip; // key berdasarkan ip user
    client.get(redisKey,async (err,data) => {
        if(result){ // cek apakah ada di redis atau tidak
            res.status(200).send({isCached:true,data:JSON.parse(data)}); 
        }else{
            let fetchData = await fetch("http://ip-api.com/json/"+req.ip)
            .then((response)=> {
                return response.json();
            });// fetch data dari API
            client.set(redisKey,JSON.stringify(fetchData),'EX',60); // simpan hasil request ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)            
            res.status(200).send({data:fetchData}); 
        }
    });
}

module.exports = {
    getBanner,
    getIPInfo,
    postBanner
}