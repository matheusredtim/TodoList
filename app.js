

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose")


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true})


const itemSchema = {
  name: String,
 
}
const Item = mongoose.model('Item',itemSchema)

const item1 = new Item({
  name: 'Bem Vindo ao TodoList'
})
const item2 = new Item({
  name: 'Escreva o item q deseja acresentar e clique no +'
})
const item3 = new Item({
  name: '<-- clique aqui para deletar um item da lista'
})

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const defaltItems = [item1,item2,item3];



app.get("/", function(req, res) {

 Item.find({},function (err, findItem) {
   if(findItem.length === 0){
    Item.insertMany(defaltItems,function (err) {
      if(err){
        console.log(err)
      }else{
        console.log('dados inseridos com sucesso');
      }
      res.redirect('/')
    })
   }
   
   res.render("list", {listTitle: 'Hoje', newListItems: findItem});
 })


});

app.post("/", function(req, res){

 const itemName =   req.body.newItem;
 const listName =  req.body.list
 const item = new Item({
   name: itemName
 })
 if(listName === 'Hoje'){
    item.save()
    res.redirect('/')
 }else{
   List.findOne({name:listName},function (err,foundList) {
     foundList.item.push(item)
     foundList.save()
     res.redirect('/'+listName)
   })
 }



});
const listSchema = {
  name: String,
  item : [itemSchema]
}
const List  =  mongoose.model('List',listSchema)


app.get('/:parametro',function (req,res) {
  const parametro = req.params.parametro
  List.findOne({name:parametro}, function(err,findlist) {
    if(!err){
      if(!findlist){
        const list = new List({
          name:parametro,
          item:defaltItems
        })
        list.save()
        res.redirect('/'+ parametro)
      }else{
        res.render('list',{listTitle: findlist.name, newListItems: findlist.item})
      }
    }
  })

})





app.get("/about", function(req, res){
  res.render("about");
});


app.post('/delete',function (req,res) {
  const checkboxitem = req.body.checkbox
  const listName = req.body.listName

  if(listName=== 'Hoje'){
    Item.findByIdAndRemove(checkboxitem,function (err) {
      if(!err){
        console.log('item removido com  sucesso');
        res.redirect('/')
      }
    })

  }else{
    List.findOneAndUpdate({name:listName},{$pull:{item:{_id:checkboxitem}}},function (err,foundList) {
      if(!err){
        res.redirect('/'+listName)
      }
    })
  }



})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
