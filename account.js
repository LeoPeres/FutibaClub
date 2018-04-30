const express = require('express')
const app = express.Router()

const init = connection =>{ 
    
    app.get('/logout', (req, res)=>{
        req.session.destroy(err=>{
            res.redirect('/')
        })
    })

    app.get('/login', (req, res) =>{
        res.render('login', {error: false})
    })

    app.post('/login', async(req, res)=>{
        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
        if(rows[0].length === 0){
            res.render('login', {error:true})
        }else{           
            if(rows[0].password == req.body.password){
                const {id, name, email, role} = rows[0]
                const user = {
                    id: id,
                    name: name,
                    email: email,
                    role: role
                }  
                req.session.user = user
                res.redirect('/')  
            }
        }
    })

    app.get('/new-account', (req, res)=>{
        res.render('new-account',{
            error:false,
            success:false
        })
    })

    app.post('/new-account', async(req, res)=>{
        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
        if(rows.length === 0){
            const {name, email, password} = req.body
            await connection.execute('insert into users (name, email, password, role) values(?,?,?,?)', [
                name,
                email,
                password,
                'user'
            ])

            res.render('new-account',{
                success: true,
                error:false
            })

        }else{
            res.render('new-account', {
                error: true,
                success:false
            })
        }
    })

    return app
}

module.exports = init