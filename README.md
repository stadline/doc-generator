# Documentation Generator

Documentation Generator est un simple npm package qui a pour but de générer un site static décrivant la documentation du projet. 
Pour le moment, il génère une documentation très simple basée sur des fichiers API blueprint (.apib) et Markdown (.md). 


# Installation 

TBD

# Utilisation et configuration de base. 

L'utilisation est très simple. 
Il suffit de remplir un fichier configuration.yml qui décrit les pages et la structure de la documentation imaginée. 
Reportez vous au fichier configuration.template.yml pour plus d'information sur le paramétrage. 

La génération est basée sur le script 'genete-docs.js' qui se trouve dans le dossier script. 
Le package est livré avec une commande NPM qui génère la documentation. Il suffit de lui pointer le fichier de configuration de votre projet. 

```bash
$> npm run gendocs /path/to/your/configuration.yml
```

# Génération des docs de base 

Afin de faciliter l'installation de la documentation pour chacun des projets Stadline, une ligne de commande existe : 

```bash
$> npm run template-docs 
```

La ligne de commande génère les documents suivants qui sont requis pour chaque projet Stadline : 
* Readme.md
* docs/deployment.md
* docs/installation.md

# TODO

* Tache de génération des éléments de structure pour le projet => OK
* Faciliter la génération du menu qui pour le moment est toujours dans le template aglio => OK
* Ajouter la gestion d'un lien relatif / absolu
* Ajouter un peu de robustesse et de tests sur les éléments qui sont utilisés / généré
* Prendre en compte les chemins relatifs et absolus dans la description des fichiers
* Mettre en place quelques tests et notamment les mardowns et API Blueprint linter
* Documentation pour changer le template de base
* Documentation pour la publication de la doc et l'automatisation