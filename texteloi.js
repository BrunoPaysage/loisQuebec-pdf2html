function chargefichier(){  
  var contenu= $("#nomfichier").val();
  var nomfichier=contenu.substring(12);nomfichier=nomfichier.substring(0,nomfichier.length-14);
  $("body").load(contenu, 
  function(responseTxt, statusTxt, xhr){
    if(statusTxt == "success") { 
      $("head").append($("style")); 
      $("head title").html(nomfichier);
      nettoyageloi(); 
    }; 
    if(statusTxt == "error") { alert("erreur: "+xhr.status+" "+xhr.statusText); }; 
  });
//  $("head title").after("\n<link rel=\"stylesheet\" href=\"../../../css/bgdvsite/bgdvsite.css\">")
  $("head title").after("\n<link rel=\"stylesheet\" href=\"texteloi.css\">")
 
};
function effaceeval(){
  $(".eval0").removeClass("eval0");
  $(".eval1").removeClass("eval1");
  $(".eval2").removeClass("eval2");
  $(".eval3").removeClass("eval3");
  $(".eval4").removeClass("eval4");
  $(".eval5").removeClass("eval5");
  $(".eval6").removeClass("eval6");
};

function nettoyageloi(){
// élimination des images et autres indésirables
$("img, .l, .pi, .c, .d, ._, .loading-indicator").remove();
$("#sidebar").remove();


// identifie la loi
var typetexte="";
var classnormal="ff1";
var classgras="ff2";
var classitalique="ff3";


var premiereligne = $("#pf1 .pc1 div:first-child").text();

if(premiereligne.substring(0,8)=="chapitre"){
  typetexte="loi";
  $("#pf1 .pc1 div:first-child").addClass("numeroloiofficiel eval0");
  var numeroloi=$("#pf1 .pc1 div:first-child").text().substring(9);
  $("#pf1 .pc1 div:nth-child(2)").addClass("titreloiofficiel fondleger");
};
if(premiereligne=="1"){
  typetexte="pl44"; 
  classgras=""+$("#pf2 .pc2 div:nth-child(2)").attr("class").split(" ")[5];
  $(".pc div:first-child").each(function(index){$(this).addClass("pageloipdf eval3")});
};
if(premiereligne.indexOf("LÉGISLATURE")!=-1){
  typetexte="pl36";
};




var idpage="";
var premieritemloi="";
var typepage="pagetdm";
var prectypeligne="numeroloiofficiel";
var precclassligne=$("#pf1 .pc1 div:first-child").attr("class");
var precxligne= $("#pf1 .pc1 div:first-child").position().left;
var precyligne= $("#pf1 .pc1 div:first-child").position().top;
var contenuprec=$("#pf1 .pc1 div:nth-child(2)").text();
var titreentete="";
var avantentete=1;
var avanttdm=1;
var precclasssup=[];
var classrefarticle="";
var tableaumunicip="non";

// pour toutes les lignes sauf quelques exceptions
$(".pc div").not("#pf1 .numeroloiofficiel, #pf1 .titreloiofficiel, .pageloipdf").each(function(index){
  var contenu = $(this).text();
  var contenuchoix=contenu;
  if($(this).is(":first-child")){avantentete=1;};
  idpage=$(this).parent().parent().attr("id");
  if(($(this).is(":first-child"))&&(contenu==premieritemloi)){ typepage="texteloi"; avanttdm=2;};
  if(($(this).is(":first-child"))&&(typepage=="pagetdm")&&(contenu.substring(0,2)=="1.")){typepage="texteloi"; avanttdm=2;};
  if($(this).is(":first-child")){ $("#"+idpage).addClass(typepage);};
  var typeligne="";
  var classligne=$(this).attr("class");
  
  var xligne= $(this).position().left;
  var yligne= $(this).position().top;
  var ecartligne= yligne - precyligne;
  
  var class3=classligne.split(" ")[3];
  var class5=classligne.split(" ")[5];
 
  
  var testecontenu="oui"; 
  
  // choix d'action sans connaissance du contenu de la ligne
  if (contenu==titreentete){ testecontenu="non"; contenuchoix=titreentete;};
  if(classrefarticle==class3){
    testecontenu="non"; contenuchoix="refarticle"; tableaumunicip="non";
  };
  if( (avantentete==1) && (precclasssup.indexOf(class3)!=-1) ){
    testecontenu="non"; contenuchoix="supsub";
  };
  if( ($(this).prev().hasClass("editeur")) && ($(this).hasClass("ff1")) ){
    testecontenu="non"; contenuchoix="pageloipdf";
  };

  
  // choix d'action en fonction du contenu de la ligne
  if(testecontenu=="oui"){
    var contenuchoix = typecontenu(contenu, class5, classgras);
    
    // ajustement du choix d'action ou critères pour choix connaissance
    if (contenuchoix=="refarticle"){classrefarticle=class3;};
        
    if (contenuchoix=="notesexplic"){ 
      classgras=class5; contenuchoix="titregras"; classitalique=$(this).next().attr("class").split(" ")[5]
    };
    
    if (contenuchoix=="tableaumunicipal"){ tableaumunicip="oui"; contenuchoix="tableaumunicipal";};


    if ((contenuchoix=="paragraphe")||(contenuchoix=="oups")){
      if($(this).is(".pc div:first-child")){
        var lesmotsprec= $(this).parent().parent().prev().children().children(".entete").prev().text().split(" ");
      }else{
        var lesmotsprec=$(this).prev().text().split(" "); 
      };
      if($(this).prev().hasClass("numeroloiofficiel")){ contenuchoix="titreloiofficiel";};
      var nbmotsprec=lesmotsprec.length;
      var derniermot=lesmotsprec[nbmotsprec-1];
      if("|le|la|de|du|les|des|à|au|aux|et|(chapitre|c.|for|".indexOf("|"+derniermot+"|")!=-1){contenuchoix="suiteparagraphe";};
      if(derniermot[derniermot.length-1]=="-"){contenuchoix="suiteparagraphe";};
      if(derniermot[derniermot.length-1]==","){contenuchoix="suiteparagraphe";};
      if(contenuchoix!="suiteparagraphe"){
        if((ecartligne>0)&&(ecartligne<15)){
          contenuchoix="suiteparagraphe";
          if($(this).prev().hasClass("numarticle")){ contenuchoix="paragraphe"; };
          if($(this).prev().hasClass("renvoitdm")){ contenuchoix="paragraphe"; };
          if($(this).prev().hasClass("titre")){ contenuchoix="paragraphe"; };
        };
      };
      if(tableaumunicip=="oui"){ contenuchoix="tableaumunicipal";};
    };   
        
    if (contenuchoix=="listedegre"){
      if($(this).is(".pc div:first-child")){
        var lesmotsprec= $(this).parent().parent().prev().children().children(".entete").prev().text().split(" ");
      }else{
        var lesmotsprec=$(this).prev().text().split(" "); 
      };
      var nbmotsprec=lesmotsprec.length;
      var derniermot=lesmotsprec[nbmotsprec-1];if("|à|le|de|ou|au|aux|et|".indexOf("|"+derniermot+"|")!=-1){contenuchoix="suiteparagraphe";};
    }; 
         
    if (contenuchoix=="titre"){ 
      if(avanttdm==1){contenuchoix="titreavanttdm";};
      if(avanttdm==0){contenuchoix="titretdm";};
      if(avanttdm==2){
        contenuchoix="titre";
        if($(this).prev().hasClass("titreloinum")){ contenuchoix="titreloitexte"; };
        if($(this).prev().hasClass("chaploi")){ contenuchoix="titrechapitreloi"; };
        if($(this).prev().hasClass("sectloi")){ contenuchoix="titresectloi"; };
        if($(this).prev().hasClass("annexeloi")){ contenuchoix="titreannexeloi"; };
      };
    };   
    if (contenuchoix=="titregras"){ 
      if($(this).prev().hasClass("numeroloiofficiel")){ 
        contenuchoix="titreloiofficiel"; 
        if(idpage!="pf1"){
          typepage="texteloi"; avanttdm=2;
          $(this).parent().parent().removeClass("pagetdm").addClass(typepage);
        };

      }; 
    };   
       
    if (contenuchoix=="definition"){
      if($(this).is(".pc div:first-child")){
        var contenusprec= $(this).parent().parent().prev().children().children(".entete").prev().text();
      }else{
        var contenusprec=$(this).prev().text(); 
      };
      var derniercarprec=contenusprec[contenusprec.length-1];
      if(";:".indexOf(derniercarprec)==-1){contenuchoix="suiteparagraphe";};
    }; 
         
    if (contenuchoix=="numeroseul"){
      if ((ecartligne>0)&&(ecartligne<15)){ contenuchoix="suiteparagraphe";};
      if (ecartligne >15){contenuchoix="paragraphe";};
      if (precclassligne.indexOf("renvoitdm")!=-1){contenuchoix="numarticle";};
      if (precclassligne.indexOf("soussection")!=-1){contenuchoix="numarticle";};
    };
  };
  
  // Action en fonction du choix d'action
  switch (contenuchoix) {
    case "article": $(this).addClass("article eval4"); break;
    case "article1": $(this).addClass("article1 eval0"); break;
    case "article2": $(this).addClass("article2 eval7"); break;
    case "numarticle": $(this).addClass("numarticle eval0"); break;
    case "refarticle": $(this).addClass("refarticle eval1"); break;
    case "paragraphe": $(this).addClass("paragraphe eval2"); break;
    case "suiteparagraphe":
      $(this).addClass("suiteparagraphe eval3"); break;
    case "suitebr": $(this).addClass("suitebr eval2"); break;
    
    case "editeur":
      $(this).addClass("editeur eval2"); $(this).parent().parent().removeClass("pagetdm").addClass(typepage); avantentete=0; break;
    case titreentete: $(this).addClass("entete eval2"); avantentete=0; break;
    case "ajourau":
      $(this).addClass("ajour eval3"); 
      if(idpage=="pf2"){
        titreentete=$(this).prev().text(); 
        $(this).prev().removeClass("titretdm eval7").addClass("entete eval2"); 
      };  
      $(this).append(" "+$(this).next().text()); $(this).next().remove(); $(this).append("<sup>"+$(this).next().text()+"</sup> "+$(this).next().next().next().text()); $(this).next().remove();$(this).next().remove();$(this).next().remove();   
      break;

    case "tdm":
      $(this).addClass("tdm eval1");
      premieritemloi=$(this).next().text();
      if(premieritemloi.indexOf("....")>3){premieritemloi=premieritemloi.substring(0,premieritemloi.indexOf("...."));};
      avanttdm=0;
      break;
    case "renvoitdm": $(this).addClass("renvoitdm eval3"); avantentete=0; break;
    case "sansrenvoitdm": $(this).addClass("sansrenvoitdm eval4"); avantentete=0; break;
    

    case "listeordonnee": $(this).addClass("listeordonnee eval4"); break;
    case "listedegre": $(this).addClass("listedegre eval5"); break;
    case "listetiret": $(this).addClass("listetiret eval6"); break;
    case "definition": $(this).addClass("definition eval6"); break;
    case "citation": $(this).addClass("citation eval6"); break;
    case "considerant": $(this).addClass("considerant eval6"); break;

    case "numeroloiofficiel": $(this).addClass("numeroloiofficiel eval0"); break;
    case "titreloiofficiel": $(this).addClass("titreloiofficiel fondleger"); break;
    
    case "titreloinum": $(this).addClass("titreloinum"); break;
    case "titreloitexte": $(this).addClass("titreloitexte eval7"); break;
    
    case "chaploi": $(this).addClass("chaploi eval5"); break;
    case "titrechapitreloi": $(this).addClass("titrechapitreloi fondleger"); break;
    
    case "sectloi": $(this).addClass("sectloi eval6"); break;
    case "titresectloi": $(this).addClass("titresectloi fondleger"); break;
    
    case "soussection": $(this).addClass("soussection eval7"); break;
    case "titresoussection": $(this).addClass("titresoussection eval7"); break;
    
    case "annexeloi": $(this).addClass("annexeloi eval7"); break;
    case "titreannexeloi": $(this).addClass("titreannexeloi eval7"); break;
    
    case "titreavanttdm": $(this).addClass("titreavanttdm eval7"); break;
    case "titretdm": $(this).addClass("titretdm eval6"); break;
    case "chapitretdm": $(this).addClass("chapitretdm eval5"); break;
    case "sectiontdm": $(this).addClass("sectiontdm eval6"); break;
    
    case "decrete": $(this).addClass("decrete fondleger"); break;
    case "titre": $(this).addClass("titre eval7"); break;
    case "titregras": $(this).addClass("titregras eval6"); break;
    case "titreitalique": $(this).addClass("titreitalique eval5"); break;

      
    case "supsub":
      if ($(this).prev().hasClass("article")){ yligne= yligne-25; };    
      if(yligne > precyligne){
        $(this).addClass("sub eval5");
      }else{
        $(this).addClass("sup eval7");
      };
      //$(this).remove();
      break;
    case "e":   
    case "er":   
        precclasssup.push(class3);
        if ($(this).prev().hasClass("article")){ yligne= yligne-25; };
        if ($(this).prev().hasClass("suiteparagraphe")){ yligne= yligne-10; };
        if(yligne > precyligne){
          $(this).addClass("sub eval0");
        }else{
          $(this).addClass("sup eval1");
        };
        //$(this).remove();
      break;
      
    case "pageloipdf": $(this).addClass("pageloipdf eval3"); break;
    case "Ce document a valeur officielle.":
      $(this).addClass("officiel eval4"); $(this).text("Ce document n'a pas valeur officielle."); break;
    case "projetloinum": 
      $(this).addClass("numeroloiofficiel eval0");
      $(this).append("<sup>"+$(this).next().text()+"</sup>");
      $(this).next().remove();
      $(this).append(" "+$(this).next().text()); $(this).next().remove();
      if($(this).next().text()==" "){$(this).next().remove();};
      break;
    case "legislature": $(this).addClass("legislature eval1"); break;
      
    case "formule": $(this).addClass("formule eval0"); break;
    case "tableaumunicipal": $(this).addClass("tableaumunicipal eval5"); break;
    
    case "nonenvigueur": $(this).addClass("nonenvigueur eval0"); break;
    case "abroge": $(this).addClass("abroge eval0"); break;
    case "oups3": $(this).addClass("oups3 fondleger"); break;
    case "oups2": $(this).addClass("oups2 fondleger"); break;
    case "oups": $(this).addClass("oups fondleger"); break;

    default:
    ; // fin du default
  }; // fin switch
  
  contenuprec = contenu;
  prectypeligne = typeligne;
  if($(this).is(".pc div:first-child")){
    precclassligne= $(this).parent().parent().prev().children().children(".entete").prev().attr("class");
  }else{
    precclassligne=$(this).attr("class"); 
  };
  precxligne = xligne;
  precyligne = yligne;

}); // din each .pc div
// nettoyages
//$(".ajour, .editeur").each(function(index){$(this).removeClass("exposant eval0");});

}; // fin function nettoyageloi

function typecontenu(chainecontenu, classff, classgras){
  var typecontenu="";
  var contenu = chainecontenu;
  if(contenu=="Non en vigueur"){return "nonenvigueur";};
  if(contenu=="(Périmée)"){return "nonenvigueur";};
  if(contenu.indexOf("Abrogée,")==0){return "abroge";};
  if(contenu.indexOf("XVIntitulé abrogé,")==0){return "abroge";};
  if(contenu=="TABLE DES MATIÈRES"){return "tdm";};
  if(contenu=="© Éditeur officiel du Québec"){return "editeur";};
  if(contenu=="À jour au "){return "ajourau";};
  if(contenu=="er"){return "er";};
  if(contenu=="e"){return "e";};
  if(contenu==");"){return "suiteparagraphe";};
  if(contenu=="NOTES EXPLICATIVES"){return "notesexplic";};
  if(contenu=="LE PARLEMENT DU QUÉBEC DÉCRÈTE CE QUI SUIT :"){return "decrete";};
  if(contenu=="LE PARLEMENT DU QUÉBEC DÉCRÈTE CE QUI SUIT :"){return "decrete";}; // afficher les caractères invisibles pour voir la différence
  if(contenu=="Projet de loi n"){return "projetloinum";};
  if(contenu.substring(0,14)=="Nom de la muni"){return "tableaumunicipal";};
  if(contenu.indexOf("...")!=-1){ return "renvoitdm"; };
  if(contenu.indexOf("» : ")!=-1){return "definition";};
  if((contenu[0]=="«")){
    if(contenu.indexOf("»")!=-1){
      return "definition";
    }else{
      return "citation";
    };
  };
  if(contenu.indexOf("»; ")!=-1){return "suiteparagraphe";};
  var graisse = classff;
  var lesmots = contenu.split(" ");
  var mot1=lesmots[0]; var mot1b=mot1.substring(mot1.length - 1);
  var mot2=lesmots[1];
  if(mot1=="TITRE"){return "titreloinum";};
  if(mot1=="CHAPITRE"){return "chaploi";};
  if(mot1=="SECTION"){return "sectloi";};
  if(mot1=="§"){return "soussection";};
  if(mot1=="CONSIDÉRANT"){return "considerant";};
  if(mot1=="(chapitre"){return "suiteparagraphe";};
  if(mot1=="où"){return "suiteparagraphe";};
  if(mot1=="ANNEXE" || mot1=="ANNEXES"){return "annexeloi";};
  if(mot1.substring(mot1.length - 1)=="°"){return "listedegre";};
  if(mot1.substring(mot1.length - 1)==")"){
    if( mot1.substring(0,1)=="(" ){
      // mot entre parenthèse
      return "suiteparagraphe";
    }else{
      if( mot1.substring(0,1)==")" ){return "suiteparagraphe";};
      if("|TVH)|".indexOf("|"+mot1+"|")==-1){
        return "listeordonnee";
      }else{
        return "suiteparagraphe"; // exception TVH)
      };
    };
  };
  if(mot1==="TVH)(DORS"){return "suiteparagraphe";}; // exception TVH)
  if(mot1==="TVH),"){return "suiteparagraphe";}; // exception TVH)

  if("|i.|ii.|iii.|iv.|v.|vi.|vii.|viii".indexOf("|"+mot1+"|")!=-1){ return "listeordonnee"; };
  //if(mot1.substring(mot1.length - 1)=="-"){return "listetiret";};
  if(mot1=="—"){
    if(contenu.indexOf("—",3)!=-1){return "suiteparagraphe";}else{return "listetiret";};
  };
  if(contenu.indexOf(". —")!=-1){return "soussection";};
  if(mot1.substring(mot1.length - 1)==","){ 
    if(contenu.indexOf("le")==-1){
      if(contenu.indexOf("en")==-1){
     // ce n'est pas une phrase
      if( mot1.substring(0,2)=="20" ){return "refarticle";};
      if( mot1.substring(0,2)=="19" ){return "refarticle";};
      };
    };
  };
  if((mot1=="D.")&& (lesmots[2]=="a.")){return "refarticle";};
  if((mot1=="D.")&& (lesmots[3]=="G.O.")){return "suitebr";};
  
  var nbmots=lesmots.length;
  if(isNaN(mot1) == true){
    // chaine
    var remplacepoints2 = new RegExp('[\\.R]', 'g');
    var mot1c = mot1;
    mot1c = mot1c.replace(remplacepoints2, '');
    if(isNaN(mot1c) != true){
      if(mot1.substring(mot1.length -1)==="."){ 
        if(graisse==classgras){return "article";};
        return "suiteparagraphe";
      }else{ 
        if(nbmots==1){return "numeroseul";}else{return "suiteparagraphe"; };
      };
    };
  }else{
    // nombre
    if(nbmots > 1){
      if(mot1=="1."){classgras=graisse; };
      if(graisse==classgras){
        if(mot1.substr(mot1.length - 1)==="."){ return "article"; };
          return "oups3";
      }else{
        if(mot1.substr(mot1.length - 1)==="."){ return "article"; };
        return "suiteparagraphe";
      };
    }else{
      return "numeroseul";
    };
  };
  var minuscules="abcdefghijklmnopqrstuvwxyzèéàêûœﬁ";
  var majuscules="ABCDEFGHIJKLMNOPQRSTUVWXYZÉÈÀÎ";
  var nombres="1234567890";

  if(mot1==="À"){
    if(minuscules.indexOf(mot2[0])!=-1){
      if(graisse=="ff1"){return "paragraphe";};
      if(graisse=="ff3"){return "paragraphe";};
    };
  };
  
  if(contenu.indexOf(" × ")!=-1){return "formule";};
  
  var premiercar=mot1.substring(0,1);
  var premajusc= majuscules.indexOf(premiercar);
  var preminusc= minuscules.indexOf(premiercar);
  var prenombre= nombres.indexOf(premiercar);
  
  var derniercar=mot1.substring(mot1.length -1);
  var avderniercar=mot1.substring((mot1.length -2));
  var derminusc= minuscules.indexOf(derniercar);
  var dermajusc= majuscules.indexOf(derniercar);
  var avdermajusc= majuscules.indexOf(avderniercar[0]);
  var dernier2car=mot1.substring(mot1.length -2);

  if((mot1==="LE")&&(graisse=="ff1")){return "titre";};
  if((mot1==="LA")&&(graisse=="ff1")){return "titre";};
  if((mot1==="ET")&&(graisse=="ff1")){return "titre";};

  if(premajusc!=-1){
    if(derminusc!=-1){ return "paragraphe"; };
    var deuxder=contenu.substring(contenu.length-2);
    if(deuxder=="»."){ return "suiteparagraphe"; };
    if(mot1.length>2){
      if(avdermajusc!=-1){
        if(mot2==="du"){return "suiteparagraphe";};
        if(mot2==="de"){return "suiteparagraphe";};
        if(mot1==="L.Q."){return "suitebr";};
        if(graisse=="ff1"){ return "titre";};
        if(graisse==classgras){ return "titregras";};
        if(graisse=="ff3"){ return "titreitalique";};
      };
    };
  };
  
  
  
  
  if((nbmots>1)&&(premajusc!=-1)&&(derniercar=="»")){return "suiteparagraphe";};
  if((nbmots>1)&&(premajusc!=-1)&&(".,;:".indexOf(derniercar)!=-1)){
    if(dernier2car=="»."){
      return "suiteparagraphe";
    }else{
      return "paragraphe";
    };  
  }; // ligne avec premier mot fin de phrase
  
  if((nbmots==1)&&(preminusc!=-1)&&(".;:".indexOf(derniercar)!=-1)){return "suiteparagraphe";}; //mot seul fin de phrase
  if((nbmots==1)&&(premajusc!=-1)){
    if(derniercar=="."){return "suiteparagraphe";};
    if(derniercar==";"){return "paragraphe";};
    if(derniercar==":"){return "paragraphe";};
  }; //mot seul majuscule fin de phrase
  if((nbmots>1)&&(preminusc!=-1)&&(".,;:".indexOf(derniercar)!=-1)){return "suiteparagraphe";}; // ligne avec premier mot fin de phrase
  if((nbmots>1)&&(preminusc!=-1)&&(derminusc!=-1)){return "suiteparagraphe";}; // ligne avec premier mot minuscule
  if((nbmots>1)&&(derniercar=="»")){return "suiteparagraphe";}; // ligne avec premier mot minuscule
  if((nbmots>1)&&(mot1=="1897/1898")){return "suiteparagraphe";}; // exception lois anciennes
  if((dernier2car==").")||(dernier2car=="),")){return "suiteparagraphe";}; // ligne avec premier mot fin de ref
  
  if(prenombre!=-1){
    if(derniercar==","){return "suiteparagraphe";};
    if(derniercar==";"){return "suiteparagraphe";};
    if(minuscules.indexOf(contenu.substring(contenu.length-1))!=-1){return "suiteparagraphe";};
  };
  

  if(contenu.indexOf(" + ")!=-1){return "formule";};
  if(contenu=="A / B;"){return "formule";};
  if(mot1==="A"){
    if(mot2==="-"){
      if(lesmots[2]==="B."){return "formule";};
    };
  };
  if(contenu=="A − B."){return "formule";};
  if(contenu=="A - B - C."){return "formule";};
  if(contenu=="A − D;"){return "formule";};
  if(contenu=="A.1 - A.2."){return "formule";};
  if(contenu[0]=="×"){return "formule";};
  if(mot2=="x"){return "formule";};
  if(contenu=="[(G"){return "formule";};
  if(contenu=="G"){return "formule";};
  if(contenu==")] − G"){return "formule";};
  if(contenu=="] − G"){return "formule";};
  if(contenu=="[G"){return "formule";};
  if(premiercar=="("){
    if(contenu.indexOf(", c.")!=-1){return "suiteparagraphe";};
    if(derminusc != -1){return "suiteparagraphe";};
    return "paragraphe";
  }
  if(premiercar=="o"){return "er";};
  if("IVX0".indexOf(premiercar)!=-1){return "suiteparagraphe";};
  if(contenu.substring(0,2)=="− "){ return "listetiret"; };
  if(mot1=="-"){
    return "listetiret";
  }else{
    if(contenu.indexOf("LÉGISLATURE")!=-1){ return "legislature"; };
    return "suiteparagraphe";
  };
};
