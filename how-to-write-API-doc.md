# Comment écrire la documentation des API

La documentation de nos API est basée sur le language open source API Blueprint,
lui même basé sur le language Markdown. La documentation est donc au format
`.apib` et est compilée en HTML pour être ensuite lisible par tous.

## Compiler la documentation

L'outil de compilation est le projet Aglio. Celui ci prend donc en entrée les
fichiers API Blueprint et les convertit en HTML. Les avantages d'Aglio sont sa
vitesse, ses rendus par défaut plutôt convaincants et son extensibilité.

### Installer Aglio

```sh
npm install -g aglio
```

### Lancer un serveur pour compiler à la volée les sources

Lorsque l'on développe, il est utile de lancer la compilation automatique (et
rafraîchissement navigateur). Aglio propose cette option et lance un serveur sur
le port 3000.

```sh
aglio -i contacts.apib --theme-variables flatly -s
```

::: warning
Si la génération de la compilation génère une erreur *ENOSPC*, il est
probable que le paramétrage du système de fichier est en cause.
Pour corriger cela, il faut lancer la commande suivante :
```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
Pour plus d'informations, voir [cette réponse](http://stackoverflow.com/a/32600959/4424102)
sur StackOverflow.
:::

### Configurer la génération de la documentation

Pour ajouter une nouvelle page au process de génération, il faut éditer le fichier
*doc/generator/generator.conf* et ajouter une nouvelle entrée.

Une entrée est composée de :

  * un chemin d'accès à la documentation ("apib" ou "md")
  * un pipe ("|")
  * un répertoire de destination (peut être vide)

Exemple :

```
/path/to/doc|output/directory
```

::: warning
Le fichier généré sera nommé automatiquement à partir du nom original du fichier.
Il faut donc faire attention aux collisions de fichiers.
:::

::: note
* Le nom du fichier généré est sensible à la casse.
* Les lignes vides sont ignorées.
* Les lignes commençant par # sont des commentaires et sont donc ignorées.
:::

Il faut ensuite ajouter la page générée dans le menu pour pouvoir y accéder lors
de la navigation. La configuration du menu se fait en éditant le fichier
*doc/template/menu.jade* et en modifiant le code du menu ([syntaxe](http://jade-lang.com/reference/)).

Le menu est mis en forme automatiquement par [Bootstrap](https://getbootstrap.com/).
L'arborescence des éléments et la syntaxe à utiliser sont décrites [ici](https://getbootstrap.com/components/#navbar).

::: warning
Il faut faire attention à utiliser exactement la même casse pour les liens que
pour les fichiers sinon la documentation ne fonctionnera pas.
:::

### Compiler la documentation complète

La génération de la documentation se fait automatiquement lors de l'intégration
continue. Elle est générée dans le répertoire *web/doc*, prête à être servie par
le serveur web.

Pour générer manuellement la documentation, il suffit de lancer le script de
génération :
```sh
./doc/generator/generator.sh
```
