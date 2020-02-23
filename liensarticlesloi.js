
// recherche des liens vers les articles
$("p").not(".enteteloi, .pieddepageloi, .refarticleloi").each(function(index){
  var contenu=$(this).html();
  var debut1=contenu.indexOf("article ",0);
  if(debut1!=-1){ $(this).html(faitlelien(contenu,debut1)); };
  
  contenu=$(this).html();
  var debut2=contenu.indexOf("article ",debut1+8);
  if(debut2!=-1){ $(this).html(faitlelien(contenu,debut2)); };
  
  contenu=$(this).html();
  var debut3=contenu.indexOf("article ",debut2+8);
  if(debut3!=-1){ $(this).html(faitlelien(contenu,debut3)); };
  
  contenu=$(this).html();
  var debut4=contenu.indexOf("article ",debut3+8);
  if(debut4!=-1){ $(this).html(faitlelien(contenu,debut4)); };
  
  contenu=$(this).html();
  var debut5=contenu.indexOf("articles ");
  if(debut5!=-1){ $(this).html(faitlesliens(contenu,debut5)); };
  
  
});

function faitlelien(lecontenu,ledebut){
  var contenu=lecontenu;
  var debut=ledebut;
  var contenusplit=contenu.substring(debut+8).split(" ");
  var numarticle=contenusplit[0]; // numéro de l'article
  var numloi="";  // cherche le numéro de la loi 
  var delaloi = contenusplit[1]+" "+contenusplit[2]+" "+contenusplit[3];
  if (";,.: ".indexOf(delaloi.substring((delaloi.length)-1))!=-1){delaloi=delaloi.substring(0,(delaloi.length)-1);};
  if (delaloi=="de la Loi" || delaloi=="du Code de"){
    var debutchapitre=contenu.indexOf("(chapitre ",debut);
    if(debutchapitre != -1){
      var contenu2=contenu.substring(debutchapitre);
      var numloi=contenu2.substring(10,contenu2.indexOf(")"))+".html";; // numéro de la loi
    };
  };
  if (delaloi=="de cette loi"){
    var debutchapitre=contenu.substring(0,debut).lastIndexOf("(chapitre ");
    if(debutchapitre != -1){
      var contenu2=contenu.substring(debutchapitre);
      var numloi=contenu2.substring(10,contenu2.indexOf(")"))+".html"; // numéro de la loi
    };
  };
  if (delaloi=="du Code civil"){
      var numloi="CCQ-1991.html"; // numéro de la loi
  };
  
  
  
  if(";,.: ".indexOf(contenusplit[0].substring((contenusplit[0].length)-1))!=-1){ numarticle=contenusplit[0].substring(0,(contenusplit[0].length)-1); };
  if(contenusplit[0].substring((contenusplit[0].length)-7)=="</span>"){ numarticle=contenusplit[0].substring(0,(contenusplit[0].length)-8); };
  
  var remplacepoints = new RegExp('\\.', 'g');
  var lien = numloi+"#art"+numarticle.replace(remplacepoints, '_');
  var longueurref=numarticle.length;
  var debutcontenu=contenu.substring(0,debut+8);
  var fincontenu=contenu.substring(debut+8+longueurref);
  if("abcdefghijklmnopqrstuvwxyzéèà<".indexOf(numarticle[0])!=-1){
    lien=numarticle; // rejet c'est un texte pas un numéro d'article
  }else{
    lien="<a href=\""+lien+"\" target=\"2\">"+numarticle+"</a>";
  };
  var contenu5=debutcontenu+lien+fincontenu;
  return contenu5;
};

function faitlesliens(lecontenu,ledebut){
  var contenu=lecontenu;
  var debut=ledebut;
  var contenusplit=contenu.substring(debut+9).split(" ");
  //alert(contenusplit[0]+"-"+contenusplit[1]+"-"+contenusplit[2]+"-"+contenusplit[3]+"-"+contenusplit[4]);
  
  var numarticle=contenusplit[0]; // numéro de l'article
  
  
  var numloi="";  // cherche le numéro de la loi 
  var delaloi = contenusplit[1]+" "+contenusplit[2]+" "+contenusplit[3];
  if (";,.: ".indexOf(delaloi.substring((delaloi.length)-1))!=-1){delaloi=delaloi.substring(0,(delaloi.length)-1);};
  if (delaloi=="de la Loi" || delaloi=="du Code de"){
    var debutchapitre=contenu.indexOf("(chapitre ",debut);
    if(debutchapitre != -1){
      var contenu2=contenu.substring(debutchapitre);
      var numloi=contenu2.substring(10,contenu2.indexOf(")"))+".html";; // numéro de la loi
    };
  };
  if (delaloi=="de cette loi"){
    var debutchapitre=contenu.substring(0,debut).lastIndexOf("(chapitre ");
    if(debutchapitre != -1){
      var contenu2=contenu.substring(debutchapitre);
      var numloi=contenu2.substring(10,contenu2.indexOf(")"))+".html";; // numéro de la loi
    };
  };
  
  if(";,.: ".indexOf(contenusplit[0].substring((contenusplit[0].length)-1))!=-1){ numarticle=contenusplit[0].substring(0,(contenusplit[0].length)-1); };
  if(contenusplit[0].substring((contenusplit[0].length)-8)=="</span>"){ numarticle=contenusplit[0].substring(0,(contenusplit[0].length)-9); };
  
  var remplacepoints = new RegExp('\\.', 'g');
  var lien = numloi+"#art"+numarticle.replace(remplacepoints, '_');
  var longueurref=numarticle.length;
  var debutcontenu=contenu.substring(0,debut+9);
  var fincontenu=contenu.substring(debut+9+longueurref);
  if("abcdefghijklmnopqrstuvwxyzéèà<".indexOf(numarticle[0])!=-1){
    lien=numarticle; // rejet c'est un texte pas un numéro d'article
  }else{
    lien="<a href=\""+lien+"\" target=\"2\">"+numarticle+"</a>";
  };
  var contenu5=debutcontenu+lien+fincontenu;
  return contenu5;  
};
