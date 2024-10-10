const express = require('express');
const app = express();
const cors = require('cors')
const exp = require('constants');
const { json } = require('body-parser');
const axios = require('axios');


async function sendRequest(json) {
    // const url = 'https://script.google.com/macros/s/AKfycbwuNStp1mOywajvKIMaJnPQBWox-zjSy8uui4xqmE1loYqsP4xJ9GBCeVFF-57R1nS5zA/exec';
    const url = 'https://script.google.com/macros/s/AKfycbx00vm_iTaKFoi86ZIaQxvG8BjAExSPArP2PINgx8mCZ_JqTwbM5PqbgZJdLyzXe82Y8g/exec';
    console.log("send");
    console.log(json);

    try{
        const response = await axios.post(url,
            json,
            {
                headers: {  // เปลี่ยนจาก header เป็น headers
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("res");
        console.log((response.data));
        console.log('\n');
        
        return response.data;
    }catch(error){
        console.error('Error sending Post reหquest',error);
        return {"message":"Error with send Post request"};
    }
    
}
async function checktoken(token) {
    const urlcheck = `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`;
    try {
        const response = await fetch(urlcheck);
        
        if (!response.ok) {
            return {
                type: 'fail',
                message: 'Network response was not ok '+ response.statusText,
            };        }
        
        const data = await response.json();

        // ตรวจสอบข้อมูลที่ได้จาก Google Token Info
        return data;
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return {
            type: 'fail',
            message: 'Token verification failed',
        };
    }
}

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({
        extended:true
    }));
    app.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
    });
    // app.post('/',async(req,res)=>{
    //     const jsondata = req.body;
        
    //     var reschecktoken = await checktoken(jsondata.token);
    //     // console.log(reschecktoken.aud);
    //     if(reschecktoken.aud=='706342397748-7raoid88ag74jg978oq0gogofh17t0mk.apps.googleusercontent.com'){
    //         console.log('Hello:'+reschecktoken.email);
    //     } 
    //     // console.log(jsondata.token);
    //     // console.log(typeof(jsondata));
    //     var data = await sendRequest(jsondata);
    //     // console.log(data);
    //     res.json(data);
    //     // res.end();
        
    // })
    app.get('/',(req,res)=>{
        res.send("Hello From Server");
    })
    app.post('/maindata',async(req,res)=>{
        const jsondata = req.body;
        if(jsondata.type == 'Login'){
            if(jsondata.token){
                
                // var response = await sendRequest(jsondata);
                let userdataformtoken = checktoken(jsondata.token).then(async result =>{
                    if(result.type =='fail'){
                        console.log('Error',result.message);
                        res.json(JSON.stringify({type:'fail',message:'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง'}));
                    }else{
                        const requestData = {
                            type: "getuserrank",
                            data: {
                                email: result.email
                            },            
                        };
                        sendRequest(requestData).then((rankuser)=>{
                            if(rankuser.rank =='guest'){
                                console.log("{type:'fail',rank:'guest'}")
                                res.json(JSON.stringify({type:'fail',rank:'guest'}));
                                
                            }else{
                                console.log(JSON.stringify({type:'success',rank:rankuser.rank}))
                                res.json(JSON.stringify({type:'success',rank:rankuser.rank}));
    
                            }
                        })
                    }
                })
                console.log(userdataformtoken)
                }else{
                    console.log('valid token')
                    res.json("{type:'fail',message:'valid token'}");
                }
        }else{
            if(jsondata.token){
                
                let userdataformtoken = checktoken(jsondata.token).then(async result =>{
                    if(result.type =='fail'){
                        console.log('Error',result.message);
                        res.json(JSON.stringify({type:'fail',rank:'เกิดข้อผิดพลาดในการระบุตัวต้น'}));
                }else{
                    const requestcheckuserData = {
                        type: "getuserrank",
                        data: {
                            email: result.email
                        },            
                    };
                    let rankuser = await sendRequest(requestcheckuserData);
                    if(rankuser.rank =='guest'){
                        res.json(JSON.stringify({type:'fail',rank:'guest'}));
                        
                    }else{
                        if(!['getoverviewdataforeachorganiz','getprojectbyyear','getoverviewbyyear'].includes(jsondata.type)&&rankuser.rank=='viewer'){
                            response = JSON.stringify({type:'fail',message:'คุณไม่มีสิทเข้าถึงการใช้งาน'})
                        }else{
                            if(userdataformtoken.type=='fail'){
                                var response = userdataformtoken;
                            }
                             response = await sendRequest(jsondata);
                        }
                        
                        // console.log(rankuser.rank);
                        console.log(response);

                        res.json(response);
                       
                    }
                }
            })
            console.log(userdataformtoken)
            }else{
                console.log('valid token')
                res.json(JSON.stringify({type:'fail',message:'valid token'}));
            }
            // res.end();

        }
        
    })

    
    app.listen(9999,()=>{
        console.log("Start Server with express at port 9999");
    })
    

module.exports =app;













