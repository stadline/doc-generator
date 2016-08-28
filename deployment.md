# Déploiement 

Déploiement de la partie API de l'application. 

## Premier déploiement 
Dans ce cas, on considère qu'on a déjà cloner le repos et que nous sommes dans le dossier /api. 

### Récupération des dépendances 
On utilise Composer pour gérer les dépendance de Api Plateform. On défini pendant cette commande les paramètres du app/config/parameters.yml

```bash
composer install
```

### Création de la BDD et chargement des fixtures
Une fois qu'on a bien toutes les dépendances et paramétré notre base de donnée, il faut la créer et charger les fixtures

```bash
php bin/console doctrine:database:create
php bin/console doctrine:fixtures:data-load
```

## Déploiement suivants
Pas besoin de recharger la base de donnée. Un simple composer install et une migration de la base de données suffisent.

```bash
composer install 
php bin/console doctrine:migrations:migrate
```

