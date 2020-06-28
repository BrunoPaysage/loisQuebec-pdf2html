var nomdomaine="designvegetal.com";
var cheminphploin="//www.designvegetal.com/scripts/jugem/jugem.php";
var serveurlocal="lhost"; // =hosttemp.substring(hosttemp.length - 5, hosttemp.length)
//var serveurlocal=hosttemp.substring(hosttemp.length - 5, hosttemp.length);
var cheminphplocal="/www.designvegetal.com/scripts/jugem/jugem.php"

function evaluation(){
  var nomfichier = window.location.pathname;
  nomfichier = nomfichier.split("/");
  if(nomfichier[nomfichier.length - 1]=="texteloiappel-test.html"){return;};
  // $("head").append("<script src=\""+nomfichierjs+"\"></script>"); 
  $("div.texteloi p").not("p.refarticle, p.enteteloi, p.nonenvigueur, p.noneval").attr('id', function (index) { return "p" + index; });
  $("div.texteloi p").not("p.refarticle, p.enteteloi, p.nonenvigueur, .jugem, p.pieddepageloi, p.noneval").after("<div class=\"jugem\"></div>");
  $( ".jugem" ).each(function( index ) {
    var indexarticle=$(this).prev().attr("id");
    var lecontenu = "<script>jugemquestion(\"jugemp"+indexarticle+"\",5);<\/script>"; 
    $( this ).attr('id', "jugemp"+indexarticle);
    $( this ).html(lecontenu );
    
    var lechemin=location.href;
    lechemin= lechemin.substring(0,lechemin.indexOf(".html"));
    var nomfichier=lechemin.substring(lechemin.lastIndexOf("/")+1);
    var fictif=lechemin+"/"+nomfichier+"-jugemp"+indexarticle+".txt";
    $( this ).prepend("<div id='jugemt"+indexarticle+"' class='petitebarre'></div>" );
    var lecontenu=$("#jugemt"+indexarticle).load(fictif, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success") { var lapetite=petitebarre(lecontenu.text()); $( "#jugemt"+indexarticle ).html(lapetite); };
        if(statusTxt == "error") {  $( "#jugemt"+indexarticle ).remove(); };
        });
//    $( "#jugemt"+indexarticle ).html(lecontenu );
   
  });
};

function petitebarre(lecontenu){
  var eval0 = lecontenu.split("||");
  var chaine1="<table width=\'107px\' class=\'tableenligne\'><tbody><tr>";
  var totaleval=0; //total des donnees
  for (var iter = 0; iter < 7; iter++) { totaleval += Number(eval0[iter]); };
  var votepourcent = [0,0,0,0,0,0,0]; //mise en proportion % des donnees
  for (var iter = 0; iter < 7; iter++) {
    if(iter==2){iter++};
    if(iter==4){iter++};
    votepourcent[iter] = eval0[iter]/totaleval ; 
    votepourcent[iter] = Math.round(100*votepourcent[iter],8); 
    chaine1+="<td class=\"eval"+iter+"\" width=\'"+votepourcent[iter]+"%\' height=\'4px\'></td>";
  };
  chaine1+="</tr></tbody></table>";
  return chaine1;
};

function jugemquestion(mondiv, nbcases, choix){
if (typeof nbcases == 'undefined') { nbcases=7;};
if (typeof choix == 'undefined') {var choix=[""];};
if (typeof choix == 'string') { choix = $.makeArray( choix ) };
var nbchoix=choix.length;
//alert(mondiv+" "+nbchoix);
var envoiserveur = " onclick=\"jugemenvoi(this.value)\" ";
if(nbchoix>1){envoiserveur = " onclick=\"testechoix("+" '"+mondiv+"' , "+"\'"+choix+"\')\" ";};
var mondiv2="#"+mondiv;
//var chemin = location.href.substring((location.href.lastIndexOf("designvegetal.com"))+18);
var chemin = location.href.substring((location.href.lastIndexOf(nomdomaine))+nomdomaine.length+1);
chemin = chemin.substring(0, chemin.lastIndexOf(".html"));
var questionnaire = "<form id=\""+mondiv+"formulaire\">\n";
var cediv=mondiv;  var cediv="";
for (var iter2 = 0; iter2 < nbchoix; iter2++) {
if(nbchoix>1){ cediv="_"+iter2; questionnaire += "<div class=\"plusieurschoix\"><span id=\""+mondiv+cediv+"\">"; };
for (var iter = 0; iter < 7; iter++) {

if (nbcases == 2) {if((iter >0)&&(iter <6) ){continue;};};
if (nbcases == 3) {if((iter >0)&&(iter <3)||(iter >3)&&(iter <6) ){continue;};};
if (nbcases == 4) {if((iter >1)&&(iter <5) ){continue;};};
if (nbcases == 5) {if((iter == 2)||(iter == 4) ){continue;};};
if (nbcases == 6) {if((iter >2)&&(iter <4) ){continue;};};

questionnaire += "<span class=\"eval"+iter+"\"><input type=\"radio\" name=\""+choix[iter2].replace(/\s/g,"")+"\" value=\"vote="+iter+"&nbcases="+nbcases+"&nochoix="+iter2+"&choix="+choix[iter2]+"&chemin="+chemin+"&identifiant="+mondiv+cediv+"\""+envoiserveur+" ></span>";};
if(nbchoix>1){ questionnaire += "</span>"; };
questionnaire += " "+choix[iter2]+"</div>";
};
questionnaire += "\n</form>\n";
$(mondiv2).html(questionnaire);

} 

function testechoix(mondiv,choix){
var choix2=choix.split(",");
var nbclic= $("#"+mondiv+" input[type=radio]:checked").length;
var nbchoix = choix2.length;
if(nbclic==nbchoix){
//alert("complet");
jugemvote(mondiv,choix);
$("#"+mondiv+"suivi").html("");
}else{
//alert(nbclic+" / "+nbchoix); 
ajoutediv(mondiv,"suivi");
$("#"+mondiv+"suivi").html("<small>"+nbclic+" / "+nbchoix+"<small><br>");

};//fin de la selection complète

};

function jugemvote(mondiv,choix){
  var choix2=choix.split(",");
  var nbchoix=choix2.length;
  var nbclic= $("#"+mondiv+" input[type=radio]:checked").length;
  var valeur2 =[choix2[0]]
  for (var iter = 0; iter < nbchoix; iter++) {
    valeur2[iter]=$("input[name="+choix2[iter].replace(/\s/g,"")+"]:checked").val();
  };
  var envoiou="";
  envoiou="#"+mondiv+"envoyer";
  $(envoiou).parents("form").html(""); // vide le questionnaire
  $("#"+mondiv).html(""); // vide le div du questionnaire
  for (var iter = 0; iter < nbchoix; iter++) {
    // refait le div et le charge
    var cediv=mondiv+"_"+iter;
    $("#"+mondiv).append("<div id='"+cediv+"'>"+valeur2[iter]+"</div>");
    jugemenvoi(valeur2[iter]);
  };
}

function jugemenvoi(envoivaleur){
  // stock la valeur sur le serveur et reçoit la barre de résultat
  var mondiv = envoivaleur.substring((envoivaleur.lastIndexOf("identifiant="))+12);
  var mondiv2="#"+mondiv;
  var choix = envoivaleur.substring((envoivaleur.lastIndexOf("&choix="))+7); choix = choix.substring(0,(choix.lastIndexOf("&chemin=")));
  var nbcases = envoivaleur.substring((envoivaleur.lastIndexOf("&nbcases="))+9); nbcases = nbcases.substring(0,(nbcases.lastIndexOf("&nochoix")));
  if (nbcases==""){nbcases=7};
  
  var cheminphp="";
//  var hosttemp = location.hostname;
  if (location.hostname=="www."+nomdomaine){cheminphp=cheminphploin};

//  if(location.host.length!=0){ cheminphp=location.origin+cheminphplocal }; // serveur local
  if (cheminphp!=""){ 
    $(mondiv2).load( cheminphp, envoivaleur , function(responseTxt, statusTxt, xhr){
      if(statusTxt == "success") { 
        $(mondiv2).html(responseTxt); jugemresultat(mondiv, chemin, choix, nbcases); 
        var envoiou="div#" + mondiv.substring(0,(mondiv.lastIndexOf("_"))) +">div";
        if(envoiou != "div#>div"){tinysort(envoiou,'span');};
      };
    });
  }else{
    // trace la barre à partir du fichier disque dur si on est en local
    var chemin= envoivaleur.substring(0,(envoivaleur.lastIndexOf("&"))+0);
    chemin = chemin.substring((chemin.lastIndexOf("/"))+1);
    chemin += "/"+chemin+"-"+mondiv+".txt";
    jugemresultat(mondiv, chemin, choix, nbcases);
  }
};


function jugemresultat(mondiv, lesfichiers, choix, nbcases){
  if ($.isArray(lesfichiers)==0){ lesfichiers = $.makeArray( lesfichiers )};
  var mondiv2="#"+mondiv; nbfichiers=lesfichiers.length; var var0=[0,0,0,0,0,0,0,nbfichiers,choix, nbcases];
  for (var iter = 0; iter < nbfichiers; iter++) { 
    $(mondiv2).load( lesfichiers[iter] , function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success") { 
        responseTxt = cumulreponses(mondiv, var0, responseTxt); 
        $(mondiv2).html(responseTxt); if(var0[7]==0){responseTxt = jugemfaitlabarre(mondiv, responseTxt, choix, nbcases); $(mondiv2).html(responseTxt);}; 
        var envoiou="div#" + mondiv.substring(0,(mondiv.lastIndexOf("_"))) +">div";
    }}); 
  };
}

function cumulreponses(mondiv, var0, contenufichier){
  chaine1=""; var eval1 = contenufichier.split("||");
  for (var iter = 0; iter < 7; iter++) { var0[iter] += Number(eval1[iter]); chaine1+= var0[iter]+"||"};
  var0[7] +=-1; if(var0[7]==0){ chaine1 = chaine1.substring(0,chaine1.length-2) ; return chaine1;};
}

function jugemfaitlabarre(nomdiv, contenufichier, choix, nbcases) {
  var eval0 = contenufichier.split("||");
  var totaleval=0; //total des donnees
  var opposants = (Number(eval0[0],10)+Number(eval0[1],10)+Number(eval0[2],10));
  var partisants = (Number(eval0[4],10)+Number(eval0[5],10)+Number(eval0[6],10));
  var indecis = Number(eval0[3],10);
  var gagnantperdant = "gain";
  if(opposants >= partisants){gagnantperdant = "perte";};
  
  for (var iter = 0; iter < 7; iter++) { totaleval += Number(eval0[iter]); };
    var votepourcent = [0,0,0,0,0,0,0]; //mise en proportion % des donnees
    for (var iter = 0; iter < 7; iter++) {
    votepourcent[iter] = eval0[iter]/totaleval ; 
    votepourcent[iter] = Math.round(100*votepourcent[iter],8); 
  };
  
  var chaine1a = ""; var chaine1b = ""; var chaine1c = "";
  var chaine2a = ""; var chaine2b = ""; var chaine2c = "";
  var chaine3a = ""; var chaine3b = ""; var chaine3c = "";
  
  if (choix){
    var choix2="<span class=\"jugemaffiche "+gagnantperdant+"\">&nbsp;"+choix+"&nbsp;</span>";
  }else{
    var choix2 = "";
  };
  
  chaine1a+="<div id=\""+nomdiv+"bresultat\" class=\"jugemaffiche\" onClick=\'changeContenu(this, "+nomdiv+"bbarre.innerHTML, "+nomdiv+"bvaleurs.innerHTML)\'>";
  chaine1a+="<span>"+opposants+" &nbsp;</span><table width=\'50%\' class=\'tableenligne\'><tbody><tr>";
  
  chaine2a+="<div id=\""+nomdiv+"bbarre\" class=\"cache\">";
  chaine2a+="<span>"+opposants+" &nbsp;</span><table width=\'50%\'  class=\'tableenligne\'><tbody><tr>";
  
  chaine3a+="<div id=\""+nomdiv+"bvaleurs\" class=\"cache\">";
  chaine3a+="<span>"+opposants+" &nbsp;</span>";
  
  for (var iter = 0; iter < 7; iter++) { 
    
    if (nbcases == 2) {if((iter >0)&&(iter <6) ){continue;};};
    if (nbcases == 3) {if((iter >0)&&(iter <3)||(iter >3)&&(iter <6) ){continue;};};
    if (nbcases == 4) {if((iter >1)&&(iter <5) ){continue;};};
    if (nbcases == 5) {if((iter == 2)||(iter == 4) ){continue;};};
    if (nbcases == 6) {if((iter >2)&&(iter <4) ){continue;};};
    
    
    chaine1b += "<td class=\"eval"+iter+"\" width=\'"+votepourcent[iter]+"%\' height=\'12px\'></td>"; 
    chaine2b += "<td class=\"eval"+iter+"\" width=\'"+votepourcent[iter]+"%\' height=\'12px\'></td>";
    chaine3b += "<span class=\"eval"+iter+"\" >"+votepourcent[iter]+"%</span>";
  };
  
  chaine1c+="</tr></tbody></table><span>&nbsp; "+partisants+"</span>"+choix2+"</div>";
  chaine2c+="</tr></tbody></table><span>&nbsp; "+partisants+"</span>"+choix2+"</div>";
  chaine3c+="<span>&nbsp; "+partisants+"</span>"+choix2+"</div>";
  
  
  return chaine1a+chaine1b+chaine1c+chaine2a+chaine2b+chaine2c+chaine3a+chaine3b+chaine3c
};

function changeContenu(elem, contenu1,contenu2)
{  elem.innerHTML = (elem.innerHTML == contenu1)?contenu2:contenu1; }
function changeClass(elem, className1,className2)
{  elem.className = (elem.className == className1)?className2:className1; }
