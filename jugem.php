<?php
$vote = $_REQUEST['vote'];
$nbcases = $_REQUEST['nbcases'];
$nochoix = $_REQUEST['nochoix'];
$choix = $_REQUEST['choix'];
$chemin = $_REQUEST['chemin'];
$pourid = $_REQUEST['identifiant'];
//echo("vote: ".$vote."<br>nbcases: ".$nbcases."<br>nochoix: ".$nochoix."<br>choix: ".$choix."<br>chemin: ".$chemin."<br>identifiant: ".$pourid."<br>");
//get content of textfile $filename = "jugem.txt";
//$filename = "jugemResultats/".$chemin."-".$_REQUEST['identifiant'].".txt";
$pos = strrpos($chemin, "/");
$fichier = substr($chemin, $pos+1);
// $dossier = substr($chemin, 0, strlen($chemin)-strlen($fichier)-1);
$dossier = "../../".$chemin;
// echo("dossier: ".$dossier."<br>");
// echo("fichier: ".$fichier."<br>");
if(!is_dir($dossier)){ mkdir($dossier); };
$filename = "../../".$chemin."/".$fichier."-".$_REQUEST['identifiant'].".txt";
// echo($filename);
$content = file($filename);

// $votef[valeur0a6] Valeurs cumulées des votes inscrites dans le fichier
// $votepc[numeroduchoix][valeur0,00a100,00] Valeurs calculées en % mises dans
$votef = explode("||", $content[0]);

for ( $iter = 0; $iter < 7; $iter++){
if ($vote == $iter) {$votef[$iter] += 1;};
};

//insert votes to txt file
$insertvote = $votef[0]."||".$votef[1]."||".$votef[2]."||".$votef[3]."||".$votef[4]."||".$votef[5]."||".$votef[6];
$fp = fopen($filename,"w");
fputs($fp,$insertvote);
fclose($fp);

//prépare des proportions pour les différents votes
$votef[7]=$votef[0]+$votef[1]+$votef[2]+$votef[3]+$votef[4]+$votef[5]+$votef[6]; // total des votes
$opposants = $votef[0]+$votef[1]+$votef[2] ;
$partisants = $votef[4]+$votef[5]+$votef[6];
$gagnantperdant = "gain";
if ( $opposants >= $partisants ){ $gagnantperdant = "perte";};

for ( $iter = 0; $iter < 7; $iter++){
$votepc[0][$iter] = 100*round($votef[$iter]/$votef[7],2);
};

$lignetableau ="";
$lignespan = "";

for ( $iter = 0; $iter < 7; $iter++){

if ($nbcases == 2) {if(($iter >0)&&($iter <6) ){continue;};};
if ($nbcases == 3) {if(($iter >0)&&($iter <3)||($iter >3)&&($iter <6) ){continue;};};
if ($nbcases == 4) {if(($iter >1)&&($iter <5) ){continue;};};
if ($nbcases == 5) {if(($iter == 2)||($iter == 4) ){continue;};};
if ($nbcases == 6) {if(($iter >2)&&($iter <4) ){continue;};};


$lignetableau .="<td class=\"eval".$iter."\" width='".$votepc[0][$iter]."%' height='12px'></td>";
$lignespan .="<span class=\"eval".$iter."\">".$votepc[0][$iter]."%</span>";
};

if($choix){$choix2="<span class=\"jugemaffiche ".$gagnantperdant."\">&nbsp;".$choix."&nbsp;</span>";};

?>

<div id="<?php echo($pourid); ?>resultat" class="jugemaffiche" onClick='changeContenu(this, <?php echo($pourid); ?>barre.innerHTML, <?php echo($pourid); ?>valeurs.innerHTML)'>
<span class=""><?php echo($opposants); ?> </span>
<table width="50%" class="tableenligne"><tr>
<?php echo($lignetableau); ?>
</tr></tbody></table>
<span class=""> <?php echo($partisants); ?></span><?php echo($choix2); ?>
</div>

<div id="<?php echo($pourid); ?>barre" class="cache">
<span class=""><?php echo($opposants); ?> </span>
<table width="50%" class="tableenligne"><tr>
<?php echo($lignetableau); ?>
</tr></tbody></table>
<span class=""> <?php echo($partisants); ?></span><?php echo($choix2); ?>
</div>

<div id="<?php echo($pourid); ?>valeurs" class="cache">
<span class=""><?php echo($opposants); ?> </span>
<?php echo($lignespan); ?>
<span class=""> <?php echo($partisants); ?></span><?php echo($choix2); ?>
</div>