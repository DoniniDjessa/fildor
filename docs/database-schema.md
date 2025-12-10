# Database Schema - Fil d'Or

> **Important**: Pour exécuter le SQL dans Supabase, utilisez le fichier `database-schema.sql` qui contient uniquement le code SQL exécutable, sans les commentaires Markdown.

## Table: ct-users

Cette table stocke les informations des utilisateurs de l'application.

### Structure SQL

Le fichier `database-schema.sql` contient le code SQL complet et exécutable. Vous pouvez le copier-coller directement dans l'éditeur SQL de Supabase.

### Colonnes

- `id` (UUID): Identifiant unique de l'utilisateur, référence `auth.users.id` de Supabase Auth
- `email` (TEXT): Email de l'utilisateur (format: pseudo@tip.local)
- `name` (TEXT): Nom complet de l'utilisateur
- `phone` (TEXT): Numéro de téléphone de l'utilisateur
- `role` (TEXT): Rôle de l'utilisateur. Valeurs possibles:
  - `superAdmin`: Super administrateur
  - `admin`: Administrateur
  - `manager`: Manager
  - `couturier`: Couturier
  - `livreur`: Livreur
- `created_at` (TIMESTAMP): Date de création du profil
- `updated_at` (TIMESTAMP): Date de dernière mise à jour

### Notes

- La table utilise le préfixe `ct-` comme demandé
- L'ID est lié à la table `auth.users` de Supabase pour la synchronisation avec l'authentification
- Les rôles sont validés via une contrainte CHECK

