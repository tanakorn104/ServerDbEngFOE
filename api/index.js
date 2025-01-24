const express = require('express');
const app = express();
const cors = require('cors')
const exp = require('constants');
const { json } = require('body-parser');
const axios = require('axios');
require('dotenv').config()
const qs = require('qs');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const fs = require('fs')
const path = require('path')
const https = require('https')
// const PORT =process.env.PORT||3000
const PORT = 8888
const RedirectCallBackLoginURL = process.env.RedirectCallBackLoginURL;
// const corsOptions = {
//     // origin: 'https://eng-foe-project.vercel.app', // ระบุโดเมนที่อนุญาต แล้วอันนี้อ่ะ? https://dbengfoe.vercel.app/
//     origin: process.env.CLIENT_ORIGIN, // ระบุโดเมนที่อนุญาต
//     // origin: '*', // ระบุโดเมนที่อนุญาต
//     methods: ['GET', 'POST'], // ระบุวิธีการที่อนุญาต
//     credentials: true // อนุญาตให้ส่งข้อมูลประจำตัว (cookies, authorization headers)
// };

app.use(cookieParser());
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// app.use((req, res, next) => {
//     // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     // res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//     //  res.setHeader('Access-Control-Allow-Origin', '*');  // อนุญาตการเข้าถึงจากทุกโดเมน
//     //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // กำหนดวิธีที่อนุญาต
//     //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // กำหนด header ที่อนุญาต

//     next();
// });
app.use((req, res, next) => {
    const allowedOrigins = [process.env.CLIENT_ORIGIN,process.env.Base_SERVER_URL]; // ระบุโดเมนที่อนุญาต
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin); // อนุญาตเฉพาะโดเมนที่กำหนด
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // วิธีที่อนุญาต
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // header ที่อนุญาต
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // อนุญาตให้ส่ง cookie

    next();
});

const parentdir = path.join(__dirname,"..")
const option = {
    key:fs.readFileSync(path.join(parentdir,'localhost.key')),
    cert:fs.readFileSync(path.join(parentdir,'localhost.crt')),
    secureProtocol: 'TLS_method',  // ใช้ TLS ที่รองรับในปัจจุบัน
    ciphers: [
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384',
    ].join(':'),
    honorCipherOrder: true,
}


// https.createServer(option,app).listen(8888,()=>{
//     console.log("https server node js run at port 8888")
// })

// app.listen(option,PORT, () => {
//     console.log("Start Server with express at port " + PORT);
// })

async function sendRequest(json) {
    //URL_FOR_DB_OLD = https://script.google.com/macros/s/AKfycbx00vm_iTaKFoi86ZIaQxvG8BjAExSPArP2PINgx8mCZ_JqTwbM5PqbgZJdLyzXe82Y8g/exec




    // const url = 'https://script.google.com/macros/s/AKfycbx00vm_iTaKFoi86ZIaQxvG8BjAExSPArP2PINgx8mCZ_JqTwbM5PqbgZJdLyzXe82Y8g/exec';
    const gettestver = await axios.get(process.env.URL_FOR_DB);
    console.log(`send ${json.type} at ${(gettestver)}`);
    // console.log(json);

    try {
        const response = await axios.post(process.env.URL_FOR_DB,
            json,
            {
                headers: {  // เปลี่ยนจาก header เป็น headers
                    'Content-Type': 'application/json'
                }
            }
        );
        // console.log("res");
        console.log("---------------------------------");
        console.log(`sended type ${json.type} and get \n >${response.data.type} that\n ${response.data.message}`);
        console.log("---------------------------------");
        // console.log('\n');

        return response.data;
    } catch (error) {
        console.error('Error sending Post request', error);
        return { "message": "Error with send Post request" };
    }

}

const getUserProfile = async (accessToken) => {
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data; // ข้อมูลโปรไฟล์ของผู้ใช้
    } catch (error) {
        throw error;
    }
};

async function checktoken(token) {
    // console.log(token)
    const urlcheck = `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`;
    try {
        const response = await fetch(urlcheck);

        if (!response.ok) {
            throw "Network response was not ok "
            // return {
            //     type: 'fail',
            //     message: 'Network response was not ok ' + response.statusText,
            // };
        }

        const data = await response.json();

        // ตรวจสอบข้อมูลที่ได้จาก Google Token Info
        return data;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw "Token verification failed"
        // return {
        //     type: 'fail',
        //     message: 'Token verification failed',
        // };

    }
}


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
app.post('/test', (req, res) => {
    // res.send(`${JSON.stringify(req.params)} + ${JSON.stringify(req.query)}`);
    res.send(`Hello Post from Server`);

})
app.get('/', (req, res) => {
    // res.send(`${JSON.stringify(req.params)} + ${JSON.stringify(req.query)}`);
    res.send(`Hello GET from Server`);

})

app.get("/auth/google/login", (req, res) => {
    // console.log(process.env.CLIENT_ID);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${RedirectCallBackLoginURL}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;
    res.redirect(authUrl);
})
app.get("/auth/google/logout", (req, res) => {
    console.log("log out");
    res.clearCookie('userprivatedata', '', {
        httpOnly: true,
        secure: true,
    })
    res.status(200).send("Logout successfully");
})

app.get("/auth/google/callback", async (req, res) => {
    if (req.query.error == 'access_denied') {
        res.redirect(`${process.env.CLIENT_ORIGIN}/login`);
        return;
    }
    const { code } = req.query;
    // console.log("hello")
    try {
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            qs.stringify({
                code,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: RedirectCallBackLoginURL,
                grant_type: 'authorization_code'
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        );
        const { access_token, refresh_token } = tokenResponse.data;

        const { expires_in } = await checktoken(access_token)


        // console.log(rank)
        const profile = await getUserProfile(access_token)
        const rank = await sendRequest({
            type: "getuser",
            data: {
                email: profile.email,
                secretkeyforgetuserprivatedata: process.env.SECRETKEY_FOR_GET_USERPRIVATE_DATA
            },
        })

        if (access_token && rank) {
            // console.log(`rank>${JSON.stringify(rank)}`)
            res.cookie('userprivatedata', JSON.stringify({ access_token, rank: rank.rank }), {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: expires_in * 1000,
                path: "/"
            })
        }
        if (rank != 'guest') {
            const savetoken = await sendRequest({
                type: "edituserrowdatawithprimarykey",
                data: {
                    primarykey: ['email'],
                    keyEditdata: ['refreshtoken'],
                    data: [
                        {
                            email: profile.email,
                            rank: rank,
                            refreshtoken: refresh_token
                        }
                    ]
                },
            })
        }
        // console.log(savetoken);

        const datasEncoded = encodeURIComponent(JSON.stringify({ profile: { email: profile.email, name: profile.name }, rank: rank.rank }));
        res.redirect(`${process.env.CLIENT_ORIGIN}/AuthLogin?dataslogin=${datasEncoded}`);

    } catch (e) {
        res.status(401).json({ message: "Authentication failed", errmsg: e.message })
    }


});

app.get("/auth/userinfo", async (req, res) => {
    if (req.cookies['userprivatedata']) {
        const usertoken = JSON.parse(req.cookies['userprivatedata']).access_token;

    }
    if (usertoken) {
        try {
            const profile = await getUserProfile(usertoken)
            const rank = await sendRequest({
                type: "getuser",
                data: {
                    email: profile.email,
                    secretkeyforgetuserprivatedata: process.env.SECRETKEY_FOR_GET_USERPRIVATE_DATA
                },
            })
            res.json({ profile, rank })
        } catch (e) {
            res.status(500).json({ message: 'somthing error with server' })
        }
        res.json({})
    } else {
        res.status(401).json({ message: "Authentication failed" })
    }
})
app.get("/auth/checkmycookieandtoken", async (req, res) => {
    if (req.cookies['userprivatedata']) {
        const usertoken = JSON.parse(req.cookies['userprivatedata']).access_token;
        if (usertoken) {
            try {

                // console.log(usertoken);
                const data = await checktoken(usertoken)
                // console.log(access_token)
                // const profile = await getUserProfile(usertoken)
                // const rank = await sendRequest({
                //     type: "getuserrank",
                //     data: {
                //         email: profile.email
                //     },
                // })
                // res.status(200).json({ profile, rank })
            } catch (e) {
                console.log("donthave i token")
                res.status(401).json({
                    success: false,
                    error: {
                        code: "tokenexp",
                        message: 'Authentication token failed'
                    }
                })
                return;
            }
            res.status(200).json({ message: "Authentication OK" })
            return;
        }
    } else {
        console.log("donthave i cookie2")
        res.status(401).json({
            success: false,
            error: {
                code: "cookieexp",
                message: 'Authentication cookie failed'
            }
        })
        return;
    }
})
app.get("/auth/refreshtoken", async (req, res) => {
    if (req.cookies['userprivatedata']) {
        const usertoken = JSON.parse(req.cookies['userprivatedata']).access_token;
        if (usertoken) {
            try {

                // console.log(usertoken);
                const data = await checktoken(usertoken)
                if (data) {
                    // console.log(usertoken)
                    const profile = await getUserProfile(usertoken)
                    const userdata = await sendRequest({
                        type: "getuser",
                        data: {
                            email: profile.email,
                            secretkeyforgetuserprivatedata: process.env.SECRETKEY_FOR_GET_USERPRIVATE_DATA
                        },
                    })


                    // res.status(200).json({message:"Authentication OK"})
                    const refreshResponse = await axios.post("https://oauth2.googleapis.com/token", {
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        refresh_token: userdata.refreshtoken,
                        grant_type: "refresh_token",
                    });

                    const { access_token } = refreshResponse.data;
                    // console.log(`new acctoken is :${access_token}`)
                    res.cookie('userprivatedata', JSON.stringify({ access_token, rank: userdata.rank }), {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        maxAge: data.expires_in * 1000,
                        path: "/"
                    })
                    res.status(200).json({ message: "Access Token refreshed" });
                    return;
                } else {
                    throw "something error with token";
                }
                res.json({ message: "Access Token refreshed", access_token });
                // res.status(200).json({ profile, rank })
            } catch (e) {
                console.log(" i token fail")
                console.log(e.message)
                res.status(401).json({
                    success: false,
                    error: {
                        code: "tokenexp",
                        message: 'Authentication token failed'
                    }
                })
                return;
            }


        }
    } else {
        console.log("donthave i cookie1")
        res.status(401).json({
            success: false,
            error: {
                code: "cookieexp",
                message: 'Authentication cookie failed'
            }
        })
        return;
    }
})

// app.get("/auth/google/refresh", async (req, res) => {
//     try {
//       if (!REFRESH_TOKEN) {
//         return res.status(400).json({ message: "No Refresh Token available" });
//       }

//       const refreshResponse = await axios.post("https://oauth2.googleapis.com/token", {
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         refresh_token: REFRESH_TOKEN,
//         grant_type: "refresh_token",
//       });

//       const { access_token } = refreshResponse.data;
//       res.json({ message: "Access Token refreshed", access_token });
//     } catch (error) {
//       res.status(500).json({ message: "Failed to refresh token", error: error.response.data });
//     }
//   });

app.post('/', async (req, res) => {
    // res.send("POST OK");
    const jsondata = req.body;
    console.log(`send ${jsondata.type}`);
    let usertoken
    let userrank
    if (req.cookies['userprivatedata']) {
        usertoken = JSON.parse(req.cookies['userprivatedata']).access_token;
        userrank = JSON.parse(req.cookies['userprivatedata']).rank;
    } else {
        console.log("dont have cookie");
        return res.status(302).redirect(`${process.env.CLIENT_ORIGIN}/logout`);
    }
    if (usertoken) {

        try {
            let userdataformtoken = await checktoken(usertoken).then(async result => {
                if (result.type == 'fail') {
                    console.log('Error', result.message);
                    res.json(JSON.stringify({ type: 'fail', rank: 'เกิดข้อผิดพลาดในการระบุตัวตน' }));
                } else {
                    // const requestcheckuserData = {
                    //     type: "getuserrank",
                    //     data: {
                    //         email: result.email
                    //     },
                    // };
                    // let rankuser = await sendRequest(requestcheckuserData);
                    if (userrank == 'guest') {
                        res.json(JSON.stringify({ type: 'fail', rank: 'guest' }));

                    } else {
                        if (!['getoverviewdataforeachorganiz', 'getprojectbyyear', 'getoverviewbyyear', 'getrecipientscurrentcap', 'getallmaincap'].includes(jsondata.type) && userrank == 'viewer') {
                            // ตอบหาเพจไม่เจอไปดีกว่า
                            response = JSON.stringify({ type: 'fail', message: 'คุณไม่มีสิทเข้าถึงการใช้งาน' })
                        } else {

                            response = await sendRequest(jsondata);
                        }

                        // console.log(rankuser.rank);
                        // console.log(response);

                        res.json(response);

                    }
                }
            })
        } catch (e) {
            res.status(401).json({ message: `${e.message}` });
        }
        // console.log(userdataformtoken)
    } else {
        console.log('valid token')
        // res.json(JSON.stringify({ type: 'fail', message: 'valid token' }));
    }
    // res.end();

}

    // }
)




module.exports = app;













