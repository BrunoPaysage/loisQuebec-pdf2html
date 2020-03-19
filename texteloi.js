function chargefichier(){  
  var contenu= $("#nomfichier").val();
  var nomfichier=contenu.substring(12);nomfichier=nomfichier.substring(0,nomfichier.length-14);
  $("body").load(contenu, 
  function(responseTxt, statusTxt, xhr){
    if(statusTxt == "success") { 
      $("head").append($("style")); 
      $("head title").html(nomfichier);
      nettoyageloi(); $("head script[src=\"texteloi.js\"]").remove();
      effaceeval(); // mettre en remarque pour avoir la coloration
      supprimepagination(); // mettre en remarque pour garder la structure paginée
      compactetdm(); // mettre en remarque pour avoir la table des matières dans une balise details
      $("body").append("<script src=\"liensarticlesloi.js\"></script>"); $("body script").remove()// mettre en remarque pour supprimer l'évaluation des articles
      $("head").append("<script src=\"evaluation.js\"></script>"); $("body").append("<script>evaluation();</script>");// mettre en remarque pour supprimer les liens dans les articles
//      nettoyagescript(); // mettre en remarque pour garder le jquery
      
    }; 
    if(statusTxt == "error") { alert("erreur: "+xhr.status+" "+xhr.statusText); }; 
  });
  $("head title").after("\n<link rel=\"stylesheet\" href=\"texteloi.css\">")
 
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
//  classgras=""+$("#pf2 .pc2 div:nth-child(2)").attr("class").split(" ")[5];
  $(".pc div:first-child").each(function(index){$(this).addClass("pageloipdf eval3")});
  $("#pf1 .pc1 div:nth-child(2)").addClass("legislature fondleger");
  classgras="ff3";
  classitalique="ff6";
  $("#pf1 .pc1 div:last-child").prev().attr("class",$("#pf1 .pc1 div:last-child").prev().attr("class").replace("ff4","ff3"));
};
if(premiereligne.indexOf("LÉGISLATURE")!=-1){
  typetexte="pl36";
  $("#pf1 .pc1 div:nth-child(1)").addClass("legislature fondleger");
  classgras="ff3";
  classitalique="ff8";
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
  if(typetexte="pl44"){if($(this).is(":nth-child(2)")){ $("#"+idpage).addClass(typepage);};};
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
    testecontenu="non"; tableaumunicip="non";
    contenuchoix="refarticle"; 
    if($(this).prev().hasClass("refarticle")){ contenuchoix="suiteparagraphe";};
  };
  if( (avantentete==1) && (precclasssup.indexOf(class3)!=-1) ){
    if(contenu =="À jour au "){precclasssup.splice(precclasssup.indexOf(class3),1,"");}else{testecontenu="non"; contenuchoix="supsub"; };
  };
  if( ($(this).prev().hasClass("editeur")) && ($(this).hasClass("ff1")) ){
    testecontenu="non"; contenuchoix="pageloipdf";
  };

  // élimination de span autour de tiret
  if($(this).children().length!=0){
    if($(this).text()==="‐"){$(this).html("-");$(this).contents().unwrap();};
    $(this).children().each(function(index){
      if($(this).text()==="‑"){$(this).html("-");$(this).contents().unwrap();};
      if($(this).text()==="‐"){$(this).html("-");$(this).contents().unwrap();};
    });
    if($(this).children().children().text()==="‐"){ 
      $(this).children().children().html("-");
      $(this).children().children().contents().unwrap(); 
    };
  };
  // choix d'action en fonction du contenu de la ligne
  if(testecontenu=="oui"){
    var contenuchoix = typecontenu(contenu, class5, classgras, classitalique);

    // ajustement du choix d'action ou critères pour choix connaissance
    if (contenuchoix=="refarticle"){ classrefarticle=class3; };
        
    if (contenuchoix=="notesexplic"){ 
      classgras=class5; contenuchoix="titregras"; $(this).addClass("titreexplic");
      // classitalique=$(this).next().attr("class").split(" ")[5]
    };
    
    if (contenuchoix=="tableaumunicipal"){ tableaumunicip="oui"; contenuchoix="tableaumunicipal";};

    // modification du choix d'action en fonction du contexte
    if (contenuchoix=="suiteparagraphe"){ 
      if(ecartligne>14){
        if(contenu.substr(0,1).toUpperCase()==contenu.substr(0,1)){ contenuchoix="paragraphe" ;};
      };
    };
    
    if (contenuchoix=="paragraphe"){
      if($(this).is(".pc div:first-child")){
        var lesmotsprec= $(this).parent().parent().prev().children().children(".entete").prev().text().split(" ");
      }else{
        var lesmotsprec=$(this).prev().text().split(" "); 
      };
      if($(this).prev().hasClass("numeroloiofficiel")){ contenuchoix="titreloiofficiel";};
      var nbmotsprec=lesmotsprec.length;
      var derniermot=lesmotsprec[nbmotsprec-1];
      if("|le|la|de|du|les|des|à|au|aux|et|(chapitre|c.|for|1er|".indexOf("|"+derniermot+"|")!=-1){
        contenuchoix="suiteparagraphe";
      };
      if(derniermot[derniermot.length-1]=="-"){contenuchoix="suiteparagraphe";};
      if(derniermot[derniermot.length-1]==","){contenuchoix="suiteparagraphe";};
      if(contenuchoix!="suiteparagraphe"){
        if((ecartligne>0)&&(ecartligne<14)){
          contenuchoix="suiteparagraphe";
          if($(this).prev().hasClass("numarticle")){ contenuchoix="paragraphe"; };
          if($(this).prev().hasClass("renvoitdm")){ contenuchoix="paragraphe"; };
          if($(this).prev().hasClass("titre")){ contenuchoix="paragraphe"; };
          if($(this).prev().hasClass("titretdm")){ contenuchoix="paragraphe"; };
        };   
      };
      if((typetexte=="pl44")||(typetexte=="pl36")){ 
        var remplacefi = new RegExp('[]', 'g');
        contenu2=$(this).prev().html();
        if(contenu2){contenu2 = contenu2.replace(remplacefi, 'fi');
        $(this).prev().html(contenu2);};
        var remplaceffi = new RegExp('[]', 'g');
        contenu2=$(this).prev().html();
        if(contenu2){contenu2 = contenu2.replace(remplaceffi, 'ffi');
        $(this).prev().html(contenu2);};
        contenu2=$(this).html();
        if(contenu2){contenu2 = contenu2.replace(remplaceffi, 'ffi');
        $(this).html(contenu2);};
      };

      if(tableaumunicip=="oui"){ contenuchoix="tableaumunicipal";};
    };   
        
    if((contenuchoix=="listedegre")||(contenuchoix=="listeordonnee")){
      if($(this).is(".pc div:first-child")){
        var lesmotsprec= $(this).parent().parent().prev().children().children(".entete").prev().text().split(" ");
      }else{
        var lesmotsprec=$(this).prev().text().split(" "); 
      };
      var nbmotsprec=lesmotsprec.length;
      var derniermot=lesmotsprec[nbmotsprec-1];if("|à|le|de|ou|au|aux|et|(chapitre|".indexOf("|"+derniermot+"|")!=-1){contenuchoix="suiteparagraphe";};
    }; 
    
    if (contenuchoix=="listeordonnee"){ 
      if(contenu.substring(0,2)==="a)"){
        classitalique=$(this).attr("class").split(" ")[5];
      };
    };
         
    if (contenuchoix=="titre"){ 
      if(avanttdm==1){contenuchoix="titreavanttdm";};
      if(avanttdm==0){
        contenuchoix="titretdm";
        if(contenu.indexOf("DISPOSITIONS MODIFICATIVES")==0){ contenuchoix="titrespecialtdm"; };
        if(contenu.indexOf("AUTRES MODIFICATIONS")==0){ contenuchoix="titrespecialtdm"; };
        if(contenu.indexOf("DISPOSITIONS TRANSITOIRES")==0){ contenuchoix="titrespecialtdm"; };
        if(contenu.indexOf("DISPOSITION FINALE")==0){ contenuchoix="titrespecialtdm"; };
      };
      if(avanttdm==2){
        if($(this).prev().hasClass("titreloinum")){ contenuchoix="titreloitexte"; };
        if($(this).prev().hasClass("chaploi")){ contenuchoix="titrechapitreloi"; };
        if($(this).prev().hasClass("sectloi")){ contenuchoix="titresectloi"; };
        if($(this).prev().hasClass("annexeloi")){ contenuchoix="titreannexeloi"; };
        if($(this).prev().hasClass("titre")){ contenuchoix="suiteparagraphe"; };
        if($(this).prev().hasClass("titreloitexte")){ contenuchoix="suitetitre"; };
        if($(this).prev().hasClass("titrechapitreloi")){ contenuchoix="suitetitre"; };
        if($(this).prev().hasClass("titresectloi")){ contenuchoix="suitetitre"; };
        if($(this).prev().hasClass("titreannexeloi")){ contenuchoix="suitetitre"; };
        if(contenu.indexOf("DISPOSITIONS MODIFICATIVES")==0){ contenuchoix="titrespecial"; };
        if(contenu.indexOf("AUTRES MODIFICATIONS")==0){ contenuchoix="titrespecial"; };
        if(contenu.indexOf("DISPOSITIONS TRANSITOIRES")==0){ contenuchoix="titrespecial"; };
        if(contenu.indexOf("DISPOSITION FINALE")==0){ contenuchoix="titrespecial"; };
        if(contenu.indexOf("DISPOSITIONS FINALES")==0){ contenuchoix="titrespecial"; };
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
      if($(this).prev().hasClass("titreloiofficiel")){ 
        contenuchoix="suitetitregras";
      };
      if($(this).prev().hasClass("titregras")){ 
        contenuchoix="suitetitregras";
      };
    };  

    if(contenuchoix=="titretdm"){
      if($(this).prev().hasClass("titretdm")){ 
        if($(this).prev().hasClass("renvoitdm")){ 
          contenuchoix="titretdm";
        }else{
          contenuchoix="suiteparagraphe"
        };
      };
    }; 
    
    if(contenuchoix=="renvoitdm"){
       if($(this).prev().hasClass("titretdm")){ if(ecartligne<12){contenuchoix="suiterenvoitdm";} };
       if($(this).prev().hasClass("paragraphe")){ if(ecartligne<12){contenuchoix="suiterenvoitdm";} };
       if($(this).prev().hasClass("titreitalique")){ if(ecartligne<12){contenuchoix="suiterenvoitdm";} };
    }; 
    if (contenuchoix=="soussection"){
      if ($(this).prev().hasClass("renvoitdm")){contenuchoix="suitetdmsoussection";};
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

      if (ecartligne >14){contenuchoix="paragraphe";};
      try {
        if (precclassligne.indexOf("renvoitdm")!=-1){contenuchoix="numarticletdm";};
        if (precclassligne.indexOf("soussection")!=-1){contenuchoix="numarticletdm";};
      }catch(err){};
    };
    
    if (contenuchoix=="formule"){
      if ($(this).prev().hasClass("formule")){contenuchoix="suiteparagraphe";};
    };
    
    if (contenuchoix=="citation"){
      if(contenu[2]!=" "){
        contenuhtml=$(this).html();
        contenuhtml="« "+contenuhtml.substring(1)
        $(this).html(contenuhtml);
        if(contenuhtml.indexOf(".</span>")!=-1){
          $(this).html(contenuhtml.substring(0,contenuhtml.indexOf(".</span>")+8)+" "+contenuhtml.substring(contenuhtml.indexOf(".</span>")+8));
        };
        contenu=$(this).text();
        contenuchoix = typecontenu(contenu, class5, classgras, classitalique);
       };
    };
  };



  // Action en fonction du choix d'action
  switch (contenuchoix) {
    case "article1R": 
      $(this).html("1R"+$(this).html().substring(21));
    case "article": 
      $(this).addClass("article eval4"); 
      try{ var classneutre=$(this).children("span:first-child").attr("class").split(" ")[0]; }
      catch(error) {classneutre="ff1";};
      $(this).children("span."+classneutre).contents().wrap("<temp></temp>");
      $(this).children("span."+classneutre).contents().unwrap();
      $(this).contents().wrap("<b class=\"numarticle\"></b>");
      $(this).children("b.numarticle").children("temp").parent().contents().unwrap();
      $(this).children("temp").contents().unwrap();      
      var mot1=$(this).children("b").eq(0).text();
      if("0123456789".indexOf(mot1.substring(mot1.length-1))!=-1){
        var contenu4=$(this).children("b").text();
        var contenu5=$(this).not("b").html();
        var nbb=$(this).children("b").length;
        $(this).html("<b class=\"numarticle\">"+contenu4+"</b> "+contenu5);
        $(this).children("b+b").remove();
      };  
      var contenulien="art"+faitlelienhref($(this).children("b.numarticle").text());
      var contenu5=contenulien;
      $(this).children("b.numarticle").attr("id",contenu5);
      var lesclass=$(this).attr("class").replace(class5,"fff");
      $(this).attr("class",lesclass);
      if($(this).children("."+classitalique)){
        $(this).children("."+classitalique).contents().wrap("<i></i>"); 
        $(this).children().not("b").contents().unwrap(); 
        $(this).children("i").children("i span.ff1").parent().contents().unwrap().contents().unwrap();
      };
      break;

    case "refarticle": $(this).addClass("refarticle eval1"); break;

    case "paragraphe": 
      $(this).addClass("paragraphe eval2"); 
      if(class5==classgras){
        if($(this).children().length!=0){
          $(this).children().contents().wrap("<i></i>");
          $(this).children().contents().unwrap();
          $(this).children("i").each(function(index){
            if($(this).text()==" "){$(this).contents().unwrap();};
          });
        };
        $(this).contents().wrap("<b></b>");
      };
      if(class5==classitalique){
        $(this).contents().wrapAll("<i></i>");
      };
      if($(this).children().hasClass(classitalique)){
        $(this).children().contents().wrap("<i></i>");
        $(this).children().contents().unwrap();        
      };
      if($(this).children().length==1){
        if($(this).children("span").text()=="Gazette officielle du Québec"){
          classitalique=$(this).children("span").attr("class");
          $(this).children("span").contents().wrapAll("<i></i>");
          $(this).children("span").contents().unwrap();
         };
      };
      break;

    case "suitetitregras":
      $(this).prev().append(" "+$(this).text()); $(this).remove();
      break;
    case "suiteparagraphe":
      $(this).addClass("suiteparagraphe eval3"); 

      if((class5!=classgras)&&(class5!=classitalique)){
        var contenuprec2=$(this).prev().html();
        if(contenuprec2){
          if(contenuprec2.length-contenuprec2.lastIndexOf("</b>")==4){
            var contenu=$(this).html();
            $(this).prepend("<br>");$(this).contents().wrap("<b></b>");
          };
        };
      };

      if(class5==classgras){
        if($(this).children().length!=0){
          $(this).children().contents().wrap("<i></i>");
          $(this).children().contents().unwrap();
          $(this).children("i").each(function(index){
            if($(this).text()==" "){$(this).contents().unwrap();};
          });
        };
        if($(this).prev().hasClass("titreloiofficiel")){
          // ne pas ajouter la balise b
        }else{
          if($(this).prev().hasClass("titretdm")){
            $(this).contents().wrap("<b class=\"numarticle\"></b>");
          }else{
            $(this).contents().wrap("<b></b>");
          };
        };
      };
      
      if(class5==classitalique){
        if($(this).children().length==1){$(this).contents().wrap("<i></i>");};
        if($(this).children().length==0){$(this).contents().wrapAll("<i></i>");};
        $(this).children("i").has("> span").contents("span").unwrap().contents().unwrap();
      };
      
      if($(this).children().hasClass(classitalique)){
        $(this).children("."+classitalique).contents().wrap("<i></i>"); 
        $(this).children().contents().unwrap(); 
        $(this).children("i").children("i span.ff1").parent().contents().unwrap().contents().unwrap();
        $(this).children("."+classitalique).contents().wrap("<i></i>"); 
        $(this).children("."+classitalique).contents().unwrap(); 
        $(this).children("i").children("i span.ff1").parent().contents().unwrap().contents().unwrap();
      };
      
      if($(this).children("i").length>0){
        $(this).children("i").each(function(index){
          if($(this).text()=="‐"){$(this).html("-");$(this).contents().unwrap();};
        });
      };
      
      if($(this).prev().hasClass("pageloipdf")){
        if(typetexte=="pl44"){
          $(this).parent().parent().prev().children(".pc").children("div:last-child").append(" "+$(this).html());
        };
      }else{
        if($(this).is(".pc div:first-child")){
          $(this).parent().parent().prev().children().children(".entete").prev().append(" "+$(this).html());
        }else{
          $(this).prev().append(" "+$(this).html());    
        };
      };
      
      if(avanttdm==0){
        if(class5==classgras){ 
        // fabrique le href
          var contenulien="art"+faitlelienhref($(this).text());
          if(contenulien!="art"){ $(this).prev().contents().wrapAll("<a href=\"#"+contenulien+"\"></a>"); };
          if($(this).prev().text().substring(0,1)=="§"){
            classrenvoi="renvoitdm eval4";
          }else{
            classrenvoi="renvoitdm eval3";
          };
          $(this).prev().removeClass("paragraphe eval2 eval3 eval4 sansrenvoitdm renvoitdm").addClass(classrenvoi);
        };
      };
      
      if($(this).prev().hasClass("tableaumunicipal")){
        var derniercar = contenu.substring(contenu.length-2);
        if(derniercar[0]=="$"){$(this).prev().html(decoupetableauminicipal($(this).prev().text()));};
        if("0123456789".indexOf(derniercar[1])!=-1){
          $(this).prev().html(decoupetableauminicipal($(this).prev().text()));
        };
      };
      
      $(this).remove();
      break;

    case "suitebr": $(this).addClass("suitebr eval2"); break;
    
    case "editeur":
      $(this).addClass("editeur eval2"); 
      if(idpage=="pf1" && $("#pf1 .editeur")){
        if($(this).prev().hasClass("ajour")){$(this).addClass("pieddepageloi");}else{$(this).addClass("entete");};
      };
      $(this).parent().parent().removeClass("pagetdm").addClass(typepage); 
      avantentete=0; 
      break;

    case titreentete: $(this).addClass("entete eval2"); avantentete=0; break;

    case "ajourau":
      $(this).addClass("ajour pieddepageloi");
      if(idpage=="pf2"){
        titreentete=$(this).prev().text(); 
        $(this).prev().removeClass("titretdm titrespecialtdm sansrenvoitdm titre eval4 eval6 eval7").addClass("entete eval2"); 
      };  
      $(this).append(" "+$(this).next().text()); $(this).next().remove(); $(this).append("<sup>"+$(this).next().text()+"</sup> "+$(this).next().next().next().text()); $(this).next().remove();$(this).next().remove();$(this).next().remove();   
      break;

    case "tdm":
      $(this).addClass("tdm eval1");
      premieritemloi=$(this).next().text();
      if(premieritemloi.indexOf("....")>3){premieritemloi=premieritemloi.substring(0,premieritemloi.indexOf("...."));};
      avanttdm=0;
      break;

    case "renvoitdm": 
      avantentete=0; 
      $(this).removeClass("sansrenvoitdm").addClass("titretdm renvoitdm"); 
      if(contenu.substring(contenu.length-1)=="."){
        // renvoi en attente de numéro
      };
      if(contenu.substring(contenu.length-1)!="."){
        // renvoi complet faire href
        if($(this).children(".ff1").length==1){
          if($(this).children(".ff1").text()[0]=="§"){
            $(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("soussectiontdm renvoitdm eval4");      
            var classrenvoi="soussectiontdm";
          }else{
            $(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("soussoussectiontdm renvoitdm eval3");      
            var classrenvoi="soussoussectiontdm";
          };
          var contenu2=$(this).children(".ff1").text();
          contenu2=contenu2.substring(0,contenu2.indexOf("—")+2);
          var contenu5=contenu.substring(0,contenu.indexOf("."))+" ";
          var numarticle=contenu.substring(contenu.indexOf("—")+2);
          var contenulien="art"+faitlelienhref(numarticle);
          $(this).html("<span class=\""+classrenvoi+"\">"+contenu2+"</span> <i class=\"titretdm\">"+contenu5+"</i> <b class=\"numarticle\">"+numarticle+"</b>");
          if(contenulien!="art"){ $(this).contents().wrapAll("<a href=\"#"+contenulien+"\"></a>"); };
          
        };
        if($(this).children(".ff2").length==1){
          $(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm renvoitdm");
          
          if($(this).prev().hasClass("tdm")){$(this).removeClass("titretdm renvoitdm").addClass("titretdm titrespecialtdm renvoitdm eval4");};
          if($(this).prev().hasClass("titrespecialtdm")){$(this).removeClass("titretdm renvoitdm").addClass("titretdm titrespecialtdm renvoitdm eval4");};
          
          
          if($(this).prev().hasClass("chapitretdm")){$(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textechapitretdm renvoitdm eval6");};
          if($(this).prev().hasClass("textechapitretdm")){$(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textechapitretdm renvoitdm eval6");};
          
          if($(this).prev().hasClass("sectiontdm")){$(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textesectiontdm renvoitdm eval5");};
          if($(this).prev().hasClass("textesectiontdm")){$(this).removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textesectiontdm renvoitdm eval5");};
          if($(this).is(":first-child")){
            if($(this).parent().parent().prev().children().children(".entete").prev().hasClass("titrespecialtdm")){$(this).addClass("titretdm titrespecialtdm sansrenvoitdm eval4");};
          };
          
          var contenu5=contenu.substring(0,contenu.indexOf("."))+" ";
          var numarticle=$(this).children(".ff2").text();
          var contenulien="art"+faitlelienhref(numarticle);
          $(this).html("<span class=\"titretdm\">"+contenu5+"</span> <b class=\"numarticle\">"+numarticle+"</b>");
          if(contenulien!="art"){ $(this).contents().wrapAll("<a href=\"#"+contenulien+"\"></a>"); };
        };
      };
      break;

    case "suiterenvoitdm": 
      avantentete=0; 
      if(contenu[contenu.length]=="."){$(this).prev().addClass("eval3");};
      if(contenu[contenu.length]!="."){
       $(this).prev().removeClass(" eval6 sansrenvoitdm").addClass("renvoitdm");
       if($(this).prev().hasClass("textechapitretdm")){$(this).prev().removeClass(" eval6 sansrenvoitdm").addClass("renvoitdm eval6");};
       if($(this).prev().hasClass("textesectiontdm")){$(this).prev().removeClass(" eval5 sansrenvoitdm").addClass("renvoitdm eval5");};
       if($(this).prev().hasClass("soussectiontdm")){$(this).prev().removeClass(" eval4 sansrenvoitdm").addClass("renvoitdm eval4");};
      };
      $(this).prev().append(" "+$(this).html());
      if($(this).children(".ff2").length==1){
        contenuprec=$(this).prev().text();
          var contenu5=contenuprec.substring(0,contenuprec.indexOf("."));
          var numarticle=$(this).children(".ff2").text();
          var contenulien="art"+faitlelienhref(numarticle);
          $(this).prev().html("<span class=\"titretdm\">"+contenu5+"</span> <b class=\"numarticle\">"+numarticle+"</b>");
          if(contenulien!="art"){ $(this).prev().contents().wrapAll("<a href=\"#"+contenulien+"\"></a>"); };
      };
      $(this).remove();
      break;

    case "suitetdmsoussection": 
      var contenutexte=$(this).prev().text();
      contenutexte=contenutexte.substring(0,contenutexte.indexOf("..."));
      if($(this).text().substring(0,1)=="§"){
        classrenvoi="soussectiontdm";
        $(this).prev().removeClass("titreitalique eval5 eval2").addClass("titretdm soussectiontdm eval4");
      }else{ 
        classrenvoi="soussoussectiontdm"; 
        $(this).prev().removeClass("titreitalique eval5 eval2").addClass("titretdm soussoussectiontdm eval3");
      };
      
      $(this).prev().html("<span class=\""+classrenvoi+"\">"+$(this).text()+"</span> <i class=\"titretdm\">"+contenutexte+"</i>"); $(this).remove();
      break;

    case "numarticletdm": 
      $(this).addClass("numarticletdm eval0"); 
      var contenu5=contenuprec.substring(0,contenuprec.indexOf("."));
      var contenulien="art"+faitlelienhref($(this).text());
      $(this).prev().html("<span class=\"titretdm\">"+contenu5+"</span> <b class=\"numarticle\">"+contenu+"</b>");
      if(contenulien!="art"){ $(this).prev().contents().wrapAll("<a href=\"#"+contenulien+"\"></a>"); };
      if($(this).prev().prev().hasClass("grandtitretdm")){ $(this).prev().removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textegrandtitretdm renvoitdm eval7"); };
      if($(this).prev().prev().hasClass("chapitretdm")){$(this).prev().removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textechapitretdm renvoitdm eval6"); };
      if($(this).prev().prev().hasClass("sectiontdm")){$(this).prev().removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm textesectiontdm renvoitdm eval5");};
      if($(this).prev().prev().hasClass("annexetdm")){$(this).prev().removeClass("sansrenvoitdm renvoitdm eval3").addClass("titretdm texteannexetdm renvoitdm eval4");};
      $(this).remove();
      break;
    case "sansrenvoitdm": $(this).addClass("sansrenvoitdm eval4"); avantentete=0; break;
    

    case "listeordonnee": 
      $(this).addClass("listeordonnee eval4"); 
      if(contenu.indexOf(")")!=-1){
        var contenu2=contenu.substring(0,contenu.indexOf(")")+2);
        var contenu5=$(this).text().substring(contenu.indexOf(")")+2);
        $(this).html("<i>"+contenu2+"</i> "+contenu5);       
        var lesclass=$(this).attr("class").replace(class5,"fff");
        $(this).attr("class",lesclass);
      };
      break;
    case "listedegre": 
      $(this).addClass("listedegre eval5"); 
      if($(this).children().length!=0){
        $(this).children().contents().wrap("<i></i>");
        $(this).children().contents().unwrap();
        if($(this).children().children(".ff1").length!=0){ $(this).children().children(".ff1").parent().contents().unwrap().contents().unwrap(); };
      };
      if($(this).children().length==0){
        if($(this).hasClass(classitalique)){$(this).contents().wrap("<i></i>")};
      };
      break;
    case "listetiret": $(this).addClass("listetiret eval6"); break;
    case "definition": 
      $(this).addClass("definition eval6"); 
      if(!$(this).children().length==0){
        $(this).children().contents().wrap("<b></b>");
        $(this).children().contents().unwrap();
      };
      break;
    case "citation": 
      $(this).addClass("citation eval6"); 
      if($(this).hasClass(classitalique)){$(this).contents().wrap("<i></i>")};
      break;
    case "citationavenir": $(this).next().prepend($(this).html()); $(this).remove(); break;
    case "citationarticle": 
      $(this).addClass("citationarticle eval6"); 
      var classneutre=$(this).children("span:first-child").attr("class").split(" ")[0];
      $(this).children("span."+classneutre).contents().wrap("<temp></temp>");
      $(this).children("span."+classneutre).contents().unwrap();
      $(this).children().children("span.ff1").contents().unwrap();
      $(this).contents().wrap("<b class=\"numarticle\"></b>");
      $(this).contents("b.numarticle").not(":nth-child(2)").contents().unwrap();
      var mot1=$(this).children("b").eq(0).text();
      if("0123456789".indexOf(mot1.substring(mot1.length-1))!=-1){
        var contenu3=$(this).text().split(" ");
        var debut=contenu3[0]; contenu3[0]="";
        $(this).html("<b class=\"numarticle\">"+debut+"</b>"+contenu3.join(" "));
      };  

      $(this).children("temp").contents().unwrap();      
      var contenulien="art"+faitlelienhref($(this).children("b.numarticle").text());
      var contenu5=contenulien;
      $(this).children("b.numarticle").attr("id",contenu5);
      var lesclass=$(this).attr("class").replace(class5,"fff");
      $(this).attr("class",lesclass);
      break;
    case "citationlistedegre": $(this).addClass("citationlistedegre eval6"); break;
    case "citationlisteordonnee": 
      $(this).addClass("citationlisteordonnee eval6"); 
      var contenu3=$(this).text().split(" ");
      var debut=contenu3[1]; contenu3[0]=""; contenu3[1]="";
      $(this).html("« <i class=\"citeliste\">"+debut+"</i>"+contenu3.join(" "));
      break;
    case "citationdefinition": $(this).addClass("citationdefinition eval6"); break;
    case "citationtitre": $(this).addClass("citationtitre eval6"); break;
    case "citationtitreloinum": $(this).addClass("citationtitreloinum eval6"); break;
    case "citationchaploi": $(this).addClass("citationchaploi eval6"); break;
    case "citationsectloi": $(this).addClass("citationsectloi eval6"); break;
    case "considerant": $(this).addClass("considerant eval6"); break;

    case "numeroloiofficiel": $(this).addClass("numeroloiofficiel eval0"); break;
    case "titreloiofficiel": $(this).addClass("titreloiofficiel fondleger"); break;
    
    case "titreloinum": 
      if(avanttdm==1){$(this).addClass("titreloinum");};
      if(avanttdm==0){$(this).addClass("grandtitretdm sansrenvoitdm eval7");};
      if(avanttdm==2){$(this).addClass("titreloinum");};       
      break;
    case "titreloitexte": $(this).addClass("titreloitexte eval7"); break;
    
    case "chaploi": 
      if(avanttdm==1){$(this).addClass("chaploi eval6");};
      if(avanttdm==0){$(this).addClass("chapitretdm sansrenvoitdm eval6");};
      if(avanttdm==2){$(this).addClass("chaploi eval6");};       
      if($(this).children().length==1){$(this).children().contents().wrapAll("<i></i>")}; 
      $(this).children().contents().unwrap();
      break;
    case "titrechapitreloi": $(this).addClass("titrechapitreloi fondleger"); break;
    
    case "sectloi": 
      if(avanttdm==1){$(this).addClass("sectloi eval5");};
      if(avanttdm==0){$(this).addClass("sectiontdm sansrenvoitdm eval5");};
      if(avanttdm==2){$(this).addClass("sectloi eval5");};
      if($(this).children().length==1){$(this).children().contents().wrapAll("<i></i>")}; 
      $(this).children().contents().unwrap();
      break;
    case "titresectloi": $(this).addClass("titresectloi fondleger"); break;
    
    case "soussection": 
      if(avanttdm==1){$(this).addClass("soussection eval4");};
      if(avanttdm==0){$(this).addClass("soussectiontdm sansrenvoitdm eval4");};
      if(avanttdm==2){$(this).addClass("soussection eval4");};
      if($(this).children().length==1){$(this).children().contents().wrapAll("<i></i>")}; 
      $(this).children().contents().unwrap();
      break;
    case "titresoussection": $(this).addClass("titresoussection eval7"); break;
    
    case "annexeloi": 
      if(avanttdm==1){$(this).addClass("annexeloi eval7");};
      if(avanttdm==0){$(this).addClass("annexetdm sansrenvoitdm eval2");};
      if(avanttdm==2){$(this).addClass("annexeloi eval7");};
      break;
    case "titreannexeloi": $(this).addClass("titreannexeloi eval7"); break;
    
    case "titreavanttdm": $(this).addClass("titreavanttdm eval7"); break;
    case "titretdm": 
      if(avanttdm==1){$(this).addClass("titretdm eval6");};
      if(avanttdm==0){
        if($(this).prev().hasClass("grandtitretdm")){$(this).addClass("titretdm textegrandtitretdm sansrenvoitdm eval7");};
        if($(this).prev().hasClass("chapitretdm")){$(this).addClass("titretdm textechapitretdm sansrenvoitdm eval6");};
        if($(this).prev().hasClass("sectiontdm")){$(this).addClass("titretdm textesectiontdm sansrenvoitdm eval5");};
        if($(this).prev().hasClass("titrespecialtdm")){$(this).addClass("titretdm titrespecialtdm sansrenvoitdm eval4");};
        if($(this).prev().hasClass("annexetdm")){
          if(contenu==titreentete){}else{$(this).addClass("titretdm texteannexetdm sansrenvoitdm eval2");};
        };
        if($(this).is(":first-child")){
          $(this).addClass("titretdm sansrenvoitdm eval6");
          if($(this).parent().parent().prev().children().children(".entete").prev().hasClass("titrespecialtdm")){$(this).addClass("titretdm titrespecialtdm sansrenvoitdm eval4");};

          if($(this).parent().parent().prev().children().children(".entete").prev().hasClass("titretdm")){
            if($(this).parent().parent().prev().children().children(".entete").prev().children("a").length==1){
              
            }else{
              $(this).parent().parent().prev().children().children(".entete").prev().append(" "+$(this).text());$(this).remove();             
            };
          };
        };
           if($(this).prev().children("a").length==1){
             $(this).addClass("titretdm sansrenvoitdm");
           };
      };
      if(avanttdm==2){$(this).addClass("titretdm eval6");};
      break;
    case "chapitretdm": $(this).addClass("chapitretdm eval6"); break;
    case "sectiontdm": $(this).addClass("sectiontdm eval5"); break;
    case "annexetdm": $(this).addClass("annexetdm eval7"); break;
    case "titrespecialtdm": 
      $(this).addClass("titrespecialtdm eval5");
      if($(this).prev().hasClass("sectiontdm")){$(this).addClass("textesectiontdm titrespecialtdm sansrenvoitdm eval5");}; 
      break;
    
    case "decrete": $(this).addClass("decrete fondleger"); break;
    case "titre": $(this).addClass("titre eval7"); break;
    case "titregras": $(this).addClass("titregras eval6"); break;
    case "titreitalique": $(this).addClass("titreitalique eval5"); break;
    case "titrespecial": $(this).addClass("titrespecial fondleger"); break;

    case "suitetitre": 
      $(this).prev().append(" "+$(this).text()); 
      $(this).remove();
      break;
      
    case "supsub":
      $(this).addClass("sup eval0");
      if ($(this).prev().hasClass("article")){ yligne= yligne-25; };    
      if(yligne > precyligne){
          $(this).prev().append("<sub>"+$(this).text()+"</sub>");
      }else{
          $(this).prev().append("<sup>"+$(this).text()+"</sup>");
      };
      $(this).remove();
      break;
    case "e":   
    case "er":   
        precclasssup.push(class3);
        if ($(this).prev().hasClass("article")){ yligne= yligne-25; };
        if ($(this).prev().hasClass("suiteparagraphe")){ yligne= yligne-10; };
        if(yligne > precyligne){
          $(this).prev().append("<sub>"+$(this).text()+"</sub>");
        }else{
          $(this).prev().append("<sup>"+$(this).text()+"</sup>");
        };
        $(this).remove();
      break;
      
    case "pageloipdf": 
      $(this).addClass("pageloipdf pieddepageloi"); 
      $(this).children().contents().wrap("<b></b>");
      $(this).children().contents().unwrap();
      break;
    case "officiel":
      $(this).addClass("officiel entete eval4"); 
      $(this).text("Ce document n'a pas valeur officielle."); 
      $(this).prev().removeClass("pieddepageloi").addClass("entete")
      break;
    case "projetloinum": 
      $(this).addClass("numeroloiofficiel eval0");
      $(this).append("<sup>"+$(this).next().text()+"</sup>");
      $(this).next().remove();
      $(this).append(" "+$(this).next().text()); $(this).next().remove();
      if($(this).next().text()==" "){$(this).next().remove();};
      break;
    case "legislature": $(this).addClass("legislature eval1"); break;
      
    case "formule": $(this).addClass("formule eval0"); break;
    
    case "tableaumunicipal": 
      $(this).addClass("tableaumunicipal eval4"); 
      if("0123456789".indexOf(contenu.substring(contenu.length-1))!=-1){ $(this).html(decoupetableauminicipal(contenu)); };
      if("  ".indexOf(contenu.substring(contenu.length-2))!=-1){
        contenu2 = contenu.trim();
        if("0123456789".indexOf(contenu2.substring(contenu2.length-1))!=-1){ $(this).html(decoupetableauminicipal(contenu2)); };
      };
      break;
    
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

}); // fin each .pc div

// nettoyages
$("head style").remove();
$("body").html($("body #page-container"));
// supprimer les éléments inutiles
$(".pf div").not($(".pf div div")).contents().unwrap();
$(".editeur").remove();


//Remettre les entetes en début de page
$(".entete").each(function(index){$(this).removeClass("entete eval2").addClass("enteteloi");});
$( "body div div" ).not("body div div div").each(function(index){
  $(this).prepend($(this).children(".enteteloi"));
});


// transforme les div en p et h
$(".pagetdm div, .texteloi div").each(function(index){
  var saclass=""+$(this).attr("class") ;
  var debut4 = saclass.indexOf("ws") ;
  if (saclass){ 
    if(saclass[debut4 +3]==" "){debut4 = debut4 +4};
    if(saclass[debut4 +4]==" "){debut4 = debut4 +5};
    saclass = $(this).attr("class").substring(debut4);   
  }; 
  var sonid= "";
  if ($(this).attr("id")){sonid = " id=\""+$(this).attr("id")+"\" ";}; 
  var debutwrap="<p"; var finwrap="></p>";
  var balise;
  if(saclass.indexOf("titreloiofficiel")!=-1){ balise="titreh1"; };
  if(saclass.indexOf("grandtitreloi")!=-1){ balise="titreh1"; };
  if(saclass.indexOf("textegrandtitreloi")!=-1){ balise="titreh1"; };
  if(saclass.indexOf("chaploi")!=-1){ balise="titreh2"; };
  if(saclass.indexOf("titrechapitreloi")!=-1){ balise="titreh2"; };
  if(saclass.indexOf("titreavanttdm")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("sectloi")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("titreavanttdm")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("tdm")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("parttdm")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("soussection")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("titresoussection")!=-1){ balise="titreh3"; };
  if(saclass.indexOf("renvoitdm")!=-1){ balise="renvoitdm"; };
  if(saclass.indexOf("sansrenvoitdm")!=-1){ balise="sansrenvoitdm"; };

  switch (balise) {
    case "titreh1": debutwrap="<h1"; finwrap="></h1>"; break;
    case "titreh2": debutwrap="<h2"; finwrap="></h2>"; break;
    case "titreh3": debutwrap="<h3"; finwrap="></h3>"; break;
    default:  debutwrap="<p"; finwrap="></p>"; break;
  };
  
  $(this).wrap(debutwrap+" class=\""+saclass+"\" "+sonid+finwrap); 
  $(this).contents().unwrap();
});

$(".pagetdm").each(function(index){
  $(this).attr("class","pagetdm"); $(this).removeAttr("data-page-no");
});
$(".texteloi").each(function(index){
  $(this).attr("class","texteloi"); $(this).removeAttr("data-page-no");
});

}; // fin function nettoyageloi

function typecontenu(chainecontenu, classff, classgras, classitalique){
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
  if(contenu=="Ce document a valeur officielle."){return "officiel";};
  
  if(contenu=="Projet de loi n"){return "projetloinum";};
  if(contenu.substring(0,14)=="Nom de la muni"){return "tableaumunicipal";};
  if(contenu.substring(0,30)=="LE PARLEMENT DU QUÉBEC DÉCRÈTE"){return "decrete";};
  if(contenu.indexOf("...")!=-1){ return "renvoitdm"; };
  
  var graisse = classff;
  var lesmots = contenu.split(" ");
  var mot1=lesmots[0]; var mot1b=mot1.substring(mot1.length - 1);
  var mot2=lesmots[1];
  if(contenu==="« "){ return "citationavenir"; };
  if(contenu[0]=="«"){
    var fincite = contenu.indexOf("»");
    var debutcite2 = contenu.indexOf("«",2);
    var findef = contenu.indexOf("» : ");
    var marquelron = contenu.indexOf("°");
    var marquelpar = contenu.indexOf(")");
    var marqueltir = contenu.indexOf("-");
    var remplacepoints2 = new RegExp('[\\.R]', 'g');
    var mot2c = mot2; mot2c = mot2c.replace(remplacepoints2, '');
    if(findef>0){ 
      if(marquelpar>0){if(marquelpar+1<debutcite2+1<findef){ return "citationlisteordonnee"; }; };
      return "definition";   
    }; //"» : "
    if(fincite>0){ 
      if(marquelpar>0){if(marquelpar+1<fincite+1){ return "citationlisteordonnee"; }; };
      return "definition"; 
     }; //"»"
    if(isNaN(mot2c) != true){
      if(mot2.substring(mot2.length -1)==="."){ return "citationarticle"; };
    };
    if(mot2.substring(mot2.length -1)==="°"){ return "citationlistedegre"; };
    if(mot2==="TITRE"){ return "citationtitreloinum"; };
    if(mot2==="CHAPITRE"){ return "citationchaploi"; };
    if(mot2==="SECTION"){ return "citationsectloi"; };
    if(isNaN(mot2c) == true){
      if(mot2==mot2.toUpperCase()){ return "citationtitre"; };
    };
      if(marquelpar>0){if(marquelpar+1==(mot2.length+2)){ return "citationlisteordonnee"; }; };
      return "citation";
  };

  if(contenu.indexOf("»; ")!=-1){return "suiteparagraphe";};
  if(mot1=="TITRE"){return "titreloinum";};
  if(mot1=="CHAPITRE"){return "chaploi";};
  if(mot1=="SECTION"){return "sectloi";};
  if(mot1=="§"){return "soussection";};
  if(mot1=="CONSIDÉRANT"){return "considerant";};
  if(mot1=="DISPOSITIONS"){return "titre";};
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
  if(mot1==="1R"){return "article1R";}; // exception 1R 1.1)

  if("|i.|ii.|iii.|iv.|v.|vi.|vii.|viii".indexOf("|"+mot1+"|")!=-1){ return "listeordonnee"; };
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
        if(classff=="ff1"){ return "titre";};
        if(graisse==classgras){ return "titregras";};
        if(graisse==classitalique){ return "titreitalique";};
      };
    };
  };
  
  
  
  
  if((nbmots>1)&&(premajusc!=-1)&&(derniercar=="»")){return "suiteparagraphe";};
  if((nbmots>1)&&(premajusc!=-1)&&(".,;:".indexOf(derniercar)!=-1)){
    if(dernier2car=="»."){
      return "suiteparagraphe";
    };
    if(dernier2car=="),"){
      return "suiteparagraphe";
    };
    //else{
      return "paragraphe";
    //};  
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
  if(mot2==="x"){return "formule";};
  if(contenu=="[(G"){return "formule";};
  if(contenu=="G"){return "formule";};
  if(mot1==")]"){return "suiteparagraphe";};
  if(contenu[0]=="]"){return "suiteparagraphe";};
  if((mot1===")")&&(mot2==="-")){return "formule";};
//  if(contenu=="] − G"){return "formule";};
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
    return "suiteparagraphe";
  };
};

function faitlelienhref(contenu){
  var contenulien=contenu;
  var remplacepoints2 = new RegExp('[\\.]', 'g');
  contenulien=contenulien.replace(remplacepoints2, '_');
  var remplacepoints3 = new RegExp('[ $]', 'g');
  contenulien=contenulien.replace(remplacepoints3, '');
  if(contenulien.substring(contenulien.length -1)=="_"){contenulien = contenulien.substring(0,contenulien.length -1);};
  if(contenulien.length>15){contenulien="";}
  return contenulien;
};

function decoupetableauminicipal(contenu){
  var contenutab="";
  var debut2=0;
  var decription="";
  var montant="";
  contenutab=contenu;
  if(contenutab[contenutab.length-2]=="$"){
    // entete tableau
    debut2=contenutab.indexOf("Montant")
    contenutab="<span class=\"description\">"+contenutab.substring(0,debut2-1)+"</span> <span class=\"montant\">"+contenutab.substring(debut2)+"</span>" ;  
  }else{
    var contenutab2=contenutab.split(" ");
    var nbmots=contenutab2.length;
    if(isNaN(contenutab2[nbmots-3])){
      // texte
      if(isNaN(contenutab2[nbmots-2])){
        // texte
        if(isNaN(contenutab2[nbmots-2])){
          // texte
          return contenu;
        }else{
          // moins de 1000
          debut2= contenu.lastIndexOf(" ");
          description=contenutab.substring(0,debut2-1);
          montant=contenutab.substring(debut2);
          return contenutab="<span class=\"description\">"+description+"</span> <span class=\"montant\">"+montant+"</span>" ;
        };
      }else{
        // entre 1000 et 1000000
          debut2= contenutab.substring(0,contenutab.length-4).lastIndexOf(" ");
          description=contenu.substring(0,debut2-1);
          montant=contenu.substring(debut2);
          return contenutab="<span class=\"description\">"+description+"</span> <span class=\"montant\">"+montant+"</span>" ;
      };  
  
    }else{
      // plus de 1000000
          debut2= contenutab.substring(0,contenutab.length -8).lastIndexOf(" ");
          description=contenu.substring(0,debut2-1);
          montant=contenu.substring(debut2);
          return contenutab="<span class=\"description\">"+description+"</span> <span class=\"montant\">"+montant+"</span>" ;
    };  
  };

  return contenutab;  
};

function effaceeval(){
  $(".eval0").removeClass("eval0");
  $(".eval1").removeClass("eval1");
  $(".eval2").removeClass("eval2");
  $(".eval3").removeClass("eval3");
  $(".eval4").removeClass("eval4");
  $(".eval5").removeClass("eval5");
  $(".eval6").removeClass("eval6");
  $(".eval7").removeClass("eval7");
  $(".fondleger").removeClass("fondleger");
};

function nettoyagescript(){
  $("body script").remove();
  $("head").contents().not($("head").children()).wrap("<temp></temp>"); $("head temp").remove();
  $("head script").remove();
};

function supprimepagination(){
//  $("body div").contents().unwrap();
//  $("body div").contents().unwrap();
  $("body .pieddepageloi").remove();
  $("body .enteteloi").remove();
};

function compactetdm(){
  $(".tdm, .tdm ~").wrapAll("<div class=\"tdm1\"></div>");
  $(".pagetdm p").not(".pagetdm:first-child p").wrapAll("<div class=\"tdm2\"></div>");
  $(".tdm1").append($(".tdm2 p"));
  $(".pagetdm").each(function(index){
    if($(this).text()==""){$(this).remove()};
  });
  $(".tdm1").wrapAll("<details></details>");
  $(".tdm").unwrap();
  $(".tdm").wrap("<summary></summary>");
  $(".tdm").contents().unwrap();
};
