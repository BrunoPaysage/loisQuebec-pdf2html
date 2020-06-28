$("body").append("<p id='derniereloi'></p>");
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
  var debut5=contenu.indexOf("rticles ",0);
  if(debut5!=-1){ $(this).html(faitlelien(contenu,debut5)); };
  
  contenu=$(this).html();
  var debut6=contenu.indexOf(", ",debut5);
  if(debut6!=-1){ $(this).html(faitlelien(contenu,debut6-6)); };
  
});
$("#derniereloi").remove();

function faitlelien(lecontenu,ledebut){
  var contenu=lecontenu;
  var debut=ledebut; 
  var contenusplit=contenu.substring(debut+8).split(" ");
  var numarticle=contenusplit[0]; // numéro de l'article
  var numloi="";  // cherche le numéro de la loi 
  
  var delaloi = contenusplit[1]+" "+contenusplit[2]+" "+contenusplit[3];
  if (";,.: ".indexOf(delaloi.substring((delaloi.length)-1))!=-1){delaloi=delaloi.substring(0,(delaloi.length)-1);};
  
  numloi=refdelaloi(contenu.substring(debut));
  
  var malgrelarticle=contenu.indexOf("Malgré l’article");
  if(malgrelarticle+9==debut){
    if(contenusplit[0].substring((contenusplit[0].length)-1)==","){ numloi=""; };
  };

  $("#derniereloi").html(numloi);
  if(delaloi+" loi"=="de la présente loi"){numloi="";};

  if(";,.: ".indexOf(contenusplit[0].substring((contenusplit[0].length)-1))!=-1){ numarticle=contenusplit[0].substring(0,(contenusplit[0].length)-1); 
  };
  if(contenusplit[0].substring((contenusplit[0].length)-7)=="</span>"){ numarticle=contenusplit[0].substring(0,(contenusplit[0].length)-8); };
  
  var remplacepoints = new RegExp('\\.', 'g');
  var lien = numloi+"#art"+numarticle.replace(remplacepoints, '_');
  var longueurref=numarticle.length;
  var debutcontenu=contenu.substring(0,debut+8);
  var fincontenu=contenu.substring(debut+8+longueurref);
  if("abcdefghijklmnopqrstuvwxyzéèà<(".indexOf(numarticle[0])!=-1){
    lien=numarticle; // rejet c'est un texte pas un numéro d'article
  }else{
    lien="<a href=\""+lien+"\" target=\"2\">"+numarticle+"</a>";
  };
  var contenu5=debutcontenu+lien+fincontenu;
  return contenu5;
};

function refdelaloi(dansletexte){
  var contenu=dansletexte;
  var lepluspetit=0;
  var lepluspetittexte="";
  
  var delaloi=contenu.indexOf("de la Loi");
  if(delaloi==-1){delaloi=1000;}else{lepluspetittexte="de la Loi";};
  
  var ducode=contenu.indexOf("du Code"); 
  if(ducode==-1){ducode=1000;};
  if(delaloi>=ducode){ delaloi=1000;lepluspetit=ducode; lepluspetittexte="du Code"; }else{ ducode=1000; lepluspetit=delaloi;  }
  
  var duregle=contenu.indexOf("du Règlement"); 
  if(duregle==-1){duregle=1000;};
  if(duregle>=lepluspetit){duregle=1000;}else{lepluspetit=duregle; lepluspetittexte="du Règlement";}
  
  var decetteloi=contenu.indexOf("de cette loi");
  if(decetteloi==-1){decetteloi=1000;};
  if(decetteloi>=lepluspetit){ decetteloi=1000; }else{ lepluspetit=decetteloi; refloi=$("#derniereloi").text(); return refloi; }
  
  if(lepluspetit==1000){return "";};
  var refloi=numeroloi(contenu.substring(lepluspetit));

  return refloi
};
  
  
function faitlesliens(lecontenu,ledebut){
  var contenu=lecontenu;
  var debut=ledebut;
  var debutcontenu= contenu.substring(0,debut+9);
  var suitecontenu=contenu.substring(debut+9);
  var lepluspetit=0;
  
  var delaloi=suitecontenu.indexOf("de la Loi");
  if(delaloi==-1){delaloi=1000;};
  
  var ducode=suitecontenu.indexOf("du Code"); 
  if(ducode==-1){ducode=1000;};
  if(delaloi>=ducode){delaloi=1000;lepluspetit=ducode;}else{ducode=1000; lepluspetit=delaloi; }
  
  var duregle=suitecontenu.indexOf("du Règlement"); 
  if(duregle==-1){duregle=1000;};
  if(duregle>=lepluspetit){duregle=1000;}else{lepluspetit=duregle;}
  
  var decetteloi=suitecontenu.indexOf("de cette Loi");
  if(decetteloi==-1){decetteloi=1000;};
  if(decetteloi>=lepluspetit){decetteloi=1000;}else{lepluspetit=decetteloi;}
  
  var lesnum = lepluspetit;
//  var lesnum = (delaloi+ducode+decetteloi)-2000;
  if(lesnum==1000){
    lepluspetit=0;
    
    lesmots=suitecontenu.split(" ");
    if(lesmots[0][1]){};
    
  };
  
  var numarticle=suitecontenu.substring(0,lesnum-1);
  var fincontenu=suitecontenu.substring(lesnum);
//  alert(delaloi+" "+ducode+" "+duregle+" "+decetteloi+" "+lesnum+" "+debutcontenu+" --- |"+ numarticle+"| --- "+fincontenu);
/*  
  var contenusplit=contenu.substring(debut+9).split(" ");  
  var numarticle=contenusplit[0]; // numéro du premier article
  
  var prec="";

  var numloi="";  // cherche le numéro de la loi 
  var delaloi = contenusplit[1]+" "+contenusplit[2]+" "+contenusplit[3];
  if (";,.: ".indexOf(delaloi.substring((delaloi.length)-1))!=-1){
    delaloi=delaloi.substring(0,(delaloi.length)-1);
  };
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
  if("abcdefghijklmnopqrstuvwxyzéèà<(".indexOf(numarticle[0])!=-1){
    lien=numarticle; // rejet c'est un texte pas un numéro d'article
  }else{
    lien="<a href=\""+lien+"\" target=\"2\">"+numarticle+"</a>";
  };
  var contenu5=debutcontenu+lien+fincontenu;
  return contenu5;  
  
  */
};

function numeroloi(dansletexte){
  if(dansletexte.substring(0,43)=="de la Loi sur les infrastructures publiques"){ return "I-8.3.html";};
  if(dansletexte.substring(0,29)=="de la Loi sur l’expropriation"){return "E-24.html";};
  if(dansletexte.substring(0,41)=="de la Loi sur le ministère des transports"){return "M-28.html";};
  if(dansletexte.substring(0,51)=="de la Loi sur le ministère du Développement durable"){return "M-30.001.html.html";};
  if(dansletexte.substring(0,43)=="de la Loi sur la qualité de l’environnement"){return "Q-2.html";};
  if(dansletexte.substring(0,23)=="de la Loi sur les parcs"){return "P-9.html";};
  if(dansletexte.substring(0,58)=="de la Loi sur l’accès aux documents des organismes publics"){return "A-2.1.html";};
  if(dansletexte.substring(0,62)=="de la Loi sur la conservation et la mise en valeur de la faune"){return "C-61.1.html";};
  if(dansletexte.substring(0,13)=="du Code civil"){return "CCQ-1991.html";};

    var debutchapitre=dansletexte.indexOf("(chapitre ");
    if(debutchapitre != -1){
      var numloi=dansletexte.substring(debutchapitre+10,dansletexte.indexOf(")"))+".html"; 
      return numloi;
    };
};
