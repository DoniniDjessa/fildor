# Authentication Setup - Fil d'Or

## Pages créées

### 1. Page de Connexion (`/login`)
- **URL**: `/app/login/page.tsx`
- **Champs**:
  - Pseudo (format: `pseudo@tip.local` - le `@tip.local` est ajouté automatiquement si non fourni)
  - Mot de passe
- **Fonctionnalités**:
  - Validation avec Zod
  - Messages d'erreur en français
  - Redirection vers la page d'accueil après connexion
  - Lien vers la page d'inscription

### 2. Page d'Inscription (`/register`)
- **URL**: `/app/register/page.tsx`
- **Champs**:
  - Pseudo (format: `pseudo@tip.local`)
  - Nom complet
  - Téléphone
  - Rôle (superAdmin, admin, manager, couturier, livreur)
  - Mot de passe
  - Confirmation du mot de passe
- **Fonctionnalités**:
  - Validation avec Zod
  - Création du compte dans Supabase Auth
  - Création du profil dans la table `ct-users`
  - Messages d'erreur en français
  - Redirection vers la page de connexion après inscription
  - Lien vers la page de connexion

## Configuration Supabase

### Variables d'environnement requises (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### Client Supabase

- **Client-side**: `/lib/supabase/client.ts` - Pour les composants client
- **Server-side**: `/lib/supabase/server.ts` - Pour les server actions et composants serveur

## Structure de la base de données

Voir `docs/database-schema.md` pour le schéma complet de la table `ct-users`.

### Table `ct-users`

La table stocke les profils utilisateurs avec les colonnes suivantes:
- `id` (UUID) - Référence à `auth.users.id`
- `email` (TEXT) - Email de l'utilisateur
- `name` (TEXT) - Nom complet
- `phone` (TEXT) - Numéro de téléphone
- `role` (TEXT) - Rôle de l'utilisateur
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Utilitaires d'authentification

### Server Actions (`/lib/auth/actions.ts`)

- `signOut()` - Déconnexion de l'utilisateur
- `getCurrentUser()` - Récupère l'utilisateur connecté avec son profil

## Design

- Design glamour et féminin avec dégradés rose/pourpre
- Texte petit (text-xs, text-sm)
- Interface responsive mobile-first
- Mode sombre/clair automatique
- Animations subtiles sur les boutons

## Notes importantes

1. **Format d'email**: Le système utilise le format `pseudo@tip.local` pour correspondre à la configuration Supabase
2. **Préfixe des tables**: Toutes les tables doivent commencer par `ct-`
3. **Validation**: Tous les formulaires utilisent Zod pour la validation côté client
4. **Langue**: L'interface est entièrement en français

