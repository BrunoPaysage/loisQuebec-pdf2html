function chargefichier(){  
  var contenu= $("#nomfichier").val();
  $("body").load(contenu, 
  function(responseTxt, statusTxt, xhr){
    if(statusTxt == "success") { $("head").append($("style")); nettoyageloi(); }; 
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
$(".y1").addClass("numeroloiofficiel eval0");
var numeroloi=$(".y1").text().substring(9);
$(".y2").addClass("titreloiofficiel fondleger");
var idpage="";
var premieritemloi="";
var typepage="pagetdm";
var prectypeligne="numeroloiofficiel";
var precclassligne=$(".y1").attr("class");
var precxligne= $(".y1").position().left;
var precyligne= $(".y1").position().top;
var contenuprec=$(".y2").text();
var titreentete="";
var avantentete=1;
var precclasssup=[];
var classrefarticle="";

$(".pc div").not(".y1, .y2").each(function(index){
  var contenu = $(this).text();
  var contenuchoix=contenu;
  if($(this).is(":first-child")){avantentete=1;};
  idpage=$(this).parent().parent().attr("id");
  if(($(this).is(":first-child"))&&(contenu==premieritemloi)){typepage="texteloi";};
  if(($(this).is(":first-child"))&&(typepage=="pagetdm")&&(contenu.substring(0,2)=="1.")){typepage="texteloi";};
  var typeligne="";
  var classligne=$(this).attr("class");
  
  var xligne= $(this).position().left;
  var yligne= $(this).position().top;
  
  var class3=classligne.split(" ")[3];
  var class5=classligne.split(" ")[5];
  
  var testecontenu="oui"
  if (contenu==titreentete){ testecontenu="non"; contenuchoix=titreentete;};
  if(classrefarticle==class3){
    testecontenu="non"; contenuchoix="refarticle";
  };
  if( (avantentete==1) && (precclasssup.indexOf(class3)!=-1) ){
    testecontenu="non"; contenuchoix="supsub";
  };
  if( ($(this).prev().hasClass("editeur")) && ($(this).hasClass("ff1")) ){
    testecontenu="non"; contenuchoix="pageloipdf";
  };
      //if($(this).is(".pc div:first-child")){ 
      //      $(this).parent().parent().prev().children().children(".enteteloi").prev().append(" "+$(this).html());
      //      $(this).remove();
      //    }else{
      //      $(this).prev().append(" "+$(this).html()); $(this).remove();
      //    };
//  var derniereligne = $(this).prev().text().split(" ");
//  var derniermot = "|"+derniereligne[derniereligne.length]+"|";
//  if("|le|la|des|du|article|".indexOf(derniermot)!=-1){
//    testecontenu="non"; contenuchoix="suiteparagraphe";
//  };
   
  if(testecontenu=="oui"){
    var contenuchoix = typecontenu(contenu, class5);

    if (contenuchoix=="refarticle"){classrefarticle= class3;};
    if ((contenuchoix=="paragraphe")||(contenuchoix=="oups")){
      // exceptions sur titres de ministère à faire
      if($(this).is(".pc div:first-child")){
        var lesmotsprec= $(this).parent().parent().prev().children().children(".entete").prev().text().split(" ");
      }else{
        var lesmotsprec=$(this).prev().text().split(" "); 
      };
      var nbmotsprec=lesmotsprec.length;
      var derniermot=lesmotsprec[nbmotsprec-1];
      if("|le|la|de|du|les|des|à|au|aux|et|(chapitre|c.|for|".indexOf("|"+derniermot+"|")!=-1){contenuchoix="suiteparagraphe";};
      if(derniermot[derniermot.length-1]=="-"){contenuchoix="suiteparagraphe";};
      if(derniermot[derniermot.length-1]==","){contenuchoix="suiteparagraphe";};
    };       
    if (contenuchoix=="listedegre"){
      // exception sur "° à" comme fin de la lifgne précédente à faire
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
      if (precclassligne.indexOf("renvoitdm")!=-1){contenuchoix="numarticle";};
      if (precclassligne.indexOf("soussectionloi")!=-1){contenuchoix="numarticle";};
      if (yligne == precyligne){contenuchoix="supsub";}else{contenuchoix="numarticle";};
    };
  };
  
  switch (contenuchoix) {
    case "tdm":
      typeligne="tdm"; $(this).addClass(typeligne+" eval1");
      premieritemloi=$(this).next().text();
      if(premieritemloi.indexOf("....")>3){premieritemloi=premieritemloi.substring(0,premieritemloi.indexOf("...."));};
      break;
    case "editeur":
      typeligne="editeur"; $(this).addClass(typeligne+" eval2"); $(this).parent().parent().removeClass("pagetdm").addClass(typepage); avantentete=0; break;
    case titreentete:
      typeligne="entete"; $(this).addClass(typeligne+" eval4"); avantentete=0; break;
    case "renvoitdm":
      typeligne="renvoitdm"; $(this).addClass(typeligne+" eval3"); avantentete=0; break;
    case "titreloi":
      typeligne="titreloi"; $(this).addClass(typeligne+" eval4"); break;
    case "chaploi":
      typeligne="chaploi"; $(this).addClass(typeligne+" eval5"); break;
    case "sectloi":
      typeligne="sectloi"; $(this).addClass(typeligne+" eval6"); break;
    case "soussectloi":
      typeligne="soussectloi"; $(this).addClass(typeligne+" eval7"); break;
    case "annexeloi":
      typeligne="annexeloi"; $(this).addClass(typeligne+" eval7"); break;
    case "nonenvigueur":
      typeligne="nonenvigueur"; $(this).addClass(typeligne+" eval0"); break;
    case "abroge":
      typeligne="abroge"; $(this).addClass(typeligne+" eval0"); break;
    case "article":
      typeligne="article"; $(this).addClass(typeligne+" eval4"); break;
    case "numarticle":
      typeligne="numarticle"; $(this).addClass(typeligne+" eval0"); break;
    case "refarticle":
      typeligne="refarticle"; $(this).addClass(typeligne+" eval1"); break;
    case "paragraphe":
      typeligne="paragraphe"; $(this).addClass(typeligne+" eval2"); break;
    case "suiteparagraphe":
      typeligne="suiteparagraphe"; $(this).addClass(typeligne+" eval3"); break;
    case "listeordonnee":
      typeligne="listeordonnee"; $(this).addClass(typeligne+" eval4"); break;
    case "listedegre":
      typeligne="listedegre"; $(this).addClass(typeligne+" eval5"); break;
    case "listetiret":
      typeligne="listetiret"; $(this).addClass(typeligne+" eval6"); break;
    case "definition":
      typeligne="definition"; $(this).addClass(typeligne+" eval6"); break;
    case "citation":
      typeligne="citation"; $(this).addClass(typeligne+" eval6"); break;
    case "titre":
      typeligne="titre"; $(this).addClass(typeligne+" eval7"); break;
    case "titregras":
      typeligne="titregras"; $(this).addClass(typeligne+" eval6"); break;
    case "titreitalique":
      typeligne="titreitalique"; $(this).addClass(typeligne+" eval5"); break;
    case "oups3":
      typeligne="oups3"; $(this).addClass(typeligne+" fondleger"); break;
    case "oups2":
      typeligne="oups2"; $(this).addClass(typeligne+" fondleger"); break;
    case "oups":
      typeligne="oups"; $(this).addClass(typeligne+" fondleger"); break;
    case "ajourau":
      typeligne="ajour"; $(this).addClass(typeligne+" eval3"); break;
    case "À jour au ":
      typeligne="ajour"; $(this).addClass(typeligne+" eval3"); 
      if(idpage=="pf2"){titreentete=$(this).prev().text(); $(this).prev().addClass("entete eval4"); $(this).prev().removeClass("titre eval7");};  
      
      $(this).append(" "+$(this).next().text()); $(this).next().remove(); $(this).append("<sup>"+$(this).next().text()+"</sup> "+$(this).next().next().next().text()); $(this).next().remove();$(this).next().remove();$(this).next().remove();   
      break;
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
        if(yligne > precyligne){
          $(this).addClass("sub eval0");
          //$(this).prev().append("<sub class='eval1'>"+$(this).text()+"</sub> ");
        }else{
          $(this).addClass("sup eval1");
          //$(this).prev().append("<sup class='eval0'>"+$(this).text()+"</sup> "); 
        };
        //$(this).remove();

      //$("."+classsup).addClass(typeligne+" eval0");
      break;
    case "pageloipdf":
      typeligne="pageloipdf"; $(this).addClass(typeligne+" eval3"); break;
    case "oups":
    case "formule":
      typeligne="formule"; $(this).addClass(typeligne+" eval0"); break;
    case "oups":
    case "Ce document a valeur officielle.":
      typeligne="officiel"; $(this).addClass(typeligne+" eval4"); $(this).text("Ce document n'a pas valeur officielle."); break;
    default:
    ; // fin du default
  }; // fin switch
  
  contenuprec = contenu;
  prectypeligne = typeligne;
  precclassligne = $(this).attr("class");
  precxligne = xligne;
  precyligne = yligne;

}); // din each .pc div
// nettoyages
//$(".ajour, .editeur").each(function(index){$(this).removeClass("exposant eval0");});

}; // fin function nettoyageloi

function typecontenu(chainecontenu, classff){
  var typecontenu="";
  var contenu = chainecontenu;
  if(contenu=="Non en vigueur"){return "nonenvigueur";};
  if(contenu=="(Périmée)"){return "nonenvigueur";};
  if(contenu.indexOf("Abrogée,")==0){return "abroge";};
  if(contenu.indexOf("XVIntitulé abrogé,")==0){return "abroge";};
//  if(contenu.substring(0,9)=="À jour au "){return "ajourau";};
  if(contenu=="TABLE DES MATIÈRES"){return "tdm";};
  if(contenu=="© Éditeur officiel du Québec"){return "editeur";};
  if(contenu=="À jour au "){return "À jour au ";};
  if(contenu=="er"){return "er";};
  if(contenu=="e"){return "e";};
  
  if(contenu.indexOf("...")!=-1){return "renvoitdm";};
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
  if(mot1=="TITRE"){return "titreloi";};
  if(mot1=="CHAPITRE"){return "chaploi";};
  if(mot1=="SECTION"){return "sectloi";};
  if(mot1=="§"){return "soussectloi";};
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
  if(contenu.indexOf(". —")!=-1){return "soussectloi";};
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
  
  var nbmots=lesmots.length;
  if(isNaN(mot1) == true){
    // chaine
    var remplacepoints2 = new RegExp('[\\.R]', 'g');
    var mot1c = mot1;
    mot1c = mot1c.replace(remplacepoints2, '');
    if(isNaN(mot1c) != true){
      if(mot1.substring(mot1.length -1)=="."){ 
        if(nbmots==1){return "suiteparagraphe";}else{return "article"; };    
      }else{ 
        if(nbmots==1){return "numeroseul";}else{return "suiteparagraphe"; };
      };
    };
  }else{
    // nombre
    if(nbmots > 1){
      if(graisse=="ff2"){
        return "article";
      }else{
        return "suiteparagraphe";
      };
    }else{
      return "numeroseul";
    };
  };
  
  var minuscules="abcdefghijklmnopqrstuvwxyzèéàêû";
  var majuscules="ABCDEFGHIJKLMNOPQRSTUVWXYZÉÈÀÊ";
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

  if((premajusc!=-1)&&(dermajusc!=-1)&&(graisse=="ff1")&&(mot1.length>2)){ 
    if(mot2==="du"){return "suiteparagraphe";};
    return "titre"; 
  };

  if((mot1==="LE")&&(graisse=="ff1")){return "titre";};
  if((mot1==="LA")&&(graisse=="ff1")){return "titre";};
  if((mot1==="ET")&&(graisse=="ff1")){return "titre";};
  
  if((premajusc!=-1)&&(avdermajusc!=-1)&&(graisse=="ff1")&&(mot1.length>2)){
    if(mot2==="de"){return "suiteparagraphe";};
    return "titre";
  };
  if((premajusc!=-1)&&(avdermajusc!=-1)&&(graisse=="ff2")&&(mot1.length>2)){return "titregras";};
  if((premajusc!=-1)&&(avdermajusc!=-1)&&(graisse=="ff3")&&(mot1.length>2)){return "titreitalique";};
  
  if((premajusc!=-1)&&(derminusc!=-1)){
    return "paragraphe";
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
    return "oups";
  }
  if(minuscules.indexOf(contenu[contenu.length-2])!=-1){return "suiteparagraphe";};

};
