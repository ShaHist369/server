const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;

const server = http.createServer((req,res) =>{
    res.writeHead(200 , {"Content-Type":"text/html"})
    if(req.method === 'GET'){
        let urlRequest = url.parse(req.url, true);
        if(urlRequest.path === '/'){
            fs.readFile('index.html',(error,data)=>{
                if(error){
                    res.writeHead(404)
                    res.write('file not found')
                    res.end()
                }else{
                    res.writeHead(200 , {"Content-Type":"text/html"})
                    res.write(data)
                    res.end()
                }
            })
        }
        if(urlRequest.path === '/style.css'){
            fs.readFile('style.css',(error,data)=>{
                if(error){
                    console.log(error);
                    throw error
                    res.end()
                }else{
                    res.writeHead(200 , {"Content-Type":"text/css"})
                    res.write(data)
                    res.end()

                }
            })
        }
        if(urlRequest.path === '/main.js'){
            fs.readFile('main.js',(error,data)=>{
                if(error){
                    console.log(error);
                    throw error
                    res.end()
                }else{
                    res.writeHead(200 , {"Content-Type":"text/javascript"})
                    res.write(data)
                    res.end()

                }
            })
        }
        if(urlRequest.path === '/fonts/asterixis.ttf'){
            fs.readFile('fonts/asterixis.ttf',(error,data)=>{
                if(error){
                    console.log(error);
                    throw error
                    res.end()
                }else{
                    res.writeHead(200 , {"Content-Type":"font/ttf"})
                    res.write(data)
                    res.end()

                }
            })
        }
    }else{
        if(req.method === 'POST'){
            let body = "";
            req.on('data', chunk => {
                    let string = chunk.toString();
                    let indexName = string.indexOf("name");
                    let uselessString = string.substr(0,indexName);
                    body = string.split(uselessString);
            });
            req.on('end', ()=>{
                body.shift();
                let user = {};
                body.map((el)=>{
                    let resultKey = el.match(/"\w+"/gm);
                    let resultValue = el.match(/\n[^-].+/gm);
                    let clearValue = resultValue[0].replace("\n",'');
                    let clearKey = resultKey[0].replace(/"/gm,'');
                     user[clearKey]= clearValue;

                    return null
                })
                addUser(user, res);
            })
        }
    }
})

function addUser(newUser, res){

    let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
    let length = Object.keys(users).length;

    if(users[0] === "empty"){
        fs.writeFile('users.json', JSON.stringify({0: newUser}),(err)=>{
            if(err){console.log(err)}
        })

        res.end('first user created');
    }else{
        let isUserExist = false;
        let i = 0;
        while( i <length){
            if(users[i].email === newUser.email){
                isUserExist = true;
            }
            i++;
        }
        if(isUserExist){
            console.log('this user already exist')
            let json = JSON.stringify({
                "sucsess": false,
                "response":"User with this e-mail address already exists",
            });
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(json);

        }else{
            let existUsers = {...users};
            users[length]=newUser;
            fs.writeFile('users.json', JSON.stringify(users),(err)=>{
                if(err){console.log(err)}
            })
            let json = JSON.stringify({
                "sucsess": true,
                "newUser": newUser,
                "existUsers": existUsers
            });
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(json);
            res.end('user just added');
        }
    }
}

server.listen(port,(error) =>{
    if(error){
        console.log(error)
    }else{
        console.log(`Server is listening on port ${port}`)
    }
});