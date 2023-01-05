const express = require("express");
const app = express();
const axios = require('axios');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var cors =  require('cors');

app.listen(8080, () => {
  console.log("Application started and Listening on port 80");
});

app.use(bodyParser.json())

app.use(express.static(__dirname));

app.use('/files', express.static('files'))
app.use(cors())


app.get("/", async (req, res) => {

  let result = {}

  let result2 = await fs.stat('files/'+req.query.primary.replace('#', '')+'_'+req.query.secondary.replace('#', '')+'.css', async function(err, stat) {
      if(err == null) {
        res.json({file:'/files/'+req.query.primary.replace('#', '')+'_'+req.query.secondary.replace('#', '')+'.css'})
      } else{
        console.log('File not exist');
        result = await axios.post('https://bootstrap.build/api/sass/compile',{
              "variables":{"$primary":'#'+req.query.primary, "$secondary":'#'+req.query.secondary},
              "customSass":""
          }
        )

        fs.writeFile('files/'+req.query.primary.replace('#', '')+'_'+req.query.secondary.replace('#', '')+'.css', result.data.css, async function (err) {
          if (err) throw err;
          res.json({file:'/files/'+req.query.primary.replace('#', '')+'_'+req.query.secondary.replace('#', '')+'.css'})
        });

      }

      
  });



});