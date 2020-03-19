# loisQuebec-pdf2html
**Objectif**: Transformer les pdf de lois publiés sur legisquebec en html/css le plus simple et accessible possible. 

Le html produit comporte les balises h div p span b i sup sub avec les class pour chaque élément titre chapitre article, etc. et un id pour les articles.  
Le css est minimal pour chaque class: corps couleur interligne


**Origine des pdf**: Les lois du Québec sont disponibles en PDF sur [legisquebec.gouv.qc.ca](http://legisquebec.gouv.qc.ca)  
Le pdf provemant de ce site est le texte officiel. Le html produit n'a pas de valeur légale.

**Pourquoi**: Une version html/css permet de travailler facilement avec ces textes sur un serveur web et du javascript côté utilisateur. 

**Exemples d'utilisation**:  

* Colorier le texte avec le css pour bien voir les titres, chapitres, sections
* Insérer les articles des projets de loi dans les lois existantes pour les voir dans leur contexte
* Ajouter une évaluation par le public sur les articles
* Etc. 

**Origine du projet**: Comprendre le projet de loi 44 et faire son évaluation sous les 3 aspects du développement durable. [www.designvegetal.com/gadrat/carnet\_de_notes/2019/pl2019044f.html](https://www.designvegetal.com/gadrat/carnet_de_notes/2019/pl2019044f.html)

**Moyens utilisés**: 

* Un serveur http (mamp ou autre pour travailler en local)
* Un ftp (Cyberduck ou autre pour publier sur un serveur web non local)
* Un éditeur de texte (SubEthaEdit ou autre pour travailler sur le html et le css)
* Un navigateur donnant accès à l'inspection du code html pour le développement (Safari ou autre)

**Procédure**:

1. Copier les fichiers texteloi.css, texteloi.js et texteloiappel-test.html sur votre serveur web ainsi que le dossier préparation
2. Récupérer le pdf sur [legisquebec.gouv.qc.ca](http://legisquebec.gouv.qc.ca)
3. Transformer le pdf en html soigné (pour la visualisation) par le site [https://convertio.co](https://convertio.co)
4. Mettre une copie du html soigné dans le répertoire préparation. Renommer le fichier avec le mot meilleur derrière le numéro de loi pour le différencier du fichier final qui sera nommé par son numéro de loi.
5. Ouvrez le fichier texteloiappel-test.html dans votre éditeur de texte et ajoutez un lien vers le nom du fichier html à simplifier s'il n'y est pas
6. Ouvrez le fichier avec votre navigateur http://..../texteloiappel-test.html
7. Ouvrez la partie développement de votre navigateur pour copier le html simplifé
8. Collez le html simplifié dans votre éditeur de texte et enregistrez le sous le numéro de la loi
9. Finalisez le html comme vous le souhaitez avant de le charger sur votre site web 

**Options**:

Le script texteloi.js peut être modifié en ajoutant ou supprimant les // pour avoir les options suivantes:

- ligne 10 effacer la coloration (class eval0, etc.)
- ligne 11 effacer la pagination
- ligne 12 supprimer les liens dans les articles
- ligne 13 garder le jquery
- ligne 14 supprimer l'évaluation des articles


